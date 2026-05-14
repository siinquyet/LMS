import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from './utils/jwt.js';
import { globalRateLimiter, authRateLimiter, loginRateLimiter } from './middleware/rateLimit.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authenticate, requireRole } from './middleware/auth.js';

import { loginSchema, registerSchema, refreshTokenSchema } from './utils/validators.js';
import { authHandlers } from './utils/authHandlers.js';
import { ZodError } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();
const courseStatuses = ['draft', 'completed', 'pending', 'approved', 'rejected'] as const;
const lessonTypes = ['video', 'document', 'quiz', 'exercise'] as const;

const PORT = process.env.PORT || 3001;

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const parseId = (value: string) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const parseOptionalId = (value: unknown) => {
  if (typeof value !== 'string' || value.length === 0) {
    return undefined;
  }

  return parseId(value);
};

const serializeUser = (user: {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  phone: string | null;
  address: string | null;
  bio: string | null;
  isLocked: boolean;
  isEmailVerified: boolean;
  status: string;
  lastLoginAt: Date | null;
  joinedAt: Date;
  role: string;
}) => ({
  id: user.id,
  ten_dang_nhap: user.username,
  email: user.email,
  ten: user.firstName,
  ho: user.lastName,
  anh_dai_dien: user.avatarUrl,
  so_dien_thoai: user.phone,
  dia_chi: user.address,
  gioi_thieu: user.bio,
  bi_khoa: user.isLocked,
  email_da_xac_thuc: user.isEmailVerified,
  trang_thai: user.status,
  lan_dang_nhap_cuoi: user.lastLoginAt?.toISOString() ?? null,
  ngay_tham_gia: user.joinedAt.toISOString(),
  vai_tro: user.role,
});

const serializeCourse = (course: {
  id: number;
  title: string;
  instructorId: number;
  categoryId: number;
  price: number;
  
  enrolledCount: number;
  status: string;
  description: string | null;
  imageUrl: string | null;
  level: string | null;
  duration: string | null;
  lessonCount: number | null;
  rating: number | null;
  requirements: unknown;
  learningOutcomes: unknown;
  instructor?: { id: number; firstName: string; lastName: string; avatarUrl?: string | null; email?: string };
  category?: { id: number; name: string };
}) => ({
  id: course.id,
  tieu_de: course.title,
  giang_vien_id: course.instructorId,
  danh_muc_id: course.categoryId,
  gia: course.price,
  
  so_luong_da_dang_ky: course.enrolledCount,
  trang_thai: course.status,
  mo_ta: course.description,
  hinh_anh: course.imageUrl,
  muc_do: course.level,
  thoi_luong: course.duration,
  so_bai_hoc: course.lessonCount,
  xep_hang: course.rating,
  requirements: course.requirements,
  what_you_learn: course.learningOutcomes,
  giang_vien: course.instructor
    ? {
        id: course.instructor.id,
        ten: course.instructor.firstName,
        ho: course.instructor.lastName,
        anh_dai_dien: course.instructor.avatarUrl,
      }
    : undefined,
  danh_muc: course.category
    ? {
        id: course.category.id,
        ten: course.category.name,
      }
    : undefined,
});

const handleError = (res: express.Response, error: unknown) => {
  console.error(error);
  res.status(500).json({ error: 'Internal error' });
};

const serializeComment = (comment: {
  id: number;
  lessonId: number;
  userId: number;
  content: string;
  parentId: number | null;
  createdAt: Date;
  user?: { id: number; firstName: string; lastName: string; avatarUrl: string | null };
  replies?: Array<{
    id: number;
    lessonId: number;
    userId: number;
    content: string;
    parentId: number | null;
    createdAt: Date;
    user?: { id: number; firstName: string; lastName: string; avatarUrl: string | null };
  }>;
}) => ({
  id: comment.id,
  bai_hoc_id: comment.lessonId,
  nguoi_dung_id: comment.userId,
  noi_dung: comment.content,
  parent_id: comment.parentId,
  ngay_tao: comment.createdAt.toISOString(),
  user: comment.user
    ? {
        id: comment.user.id,
        ten: comment.user.firstName,
        ho: comment.user.lastName,
        anh_dai_dien: comment.user.avatarUrl,
      }
    : undefined,
  replies: comment.replies?.map((reply) => ({
    id: reply.id,
    bai_hoc_id: reply.lessonId,
    nguoi_dung_id: reply.userId,
    noi_dung: reply.content,
    parent_id: reply.parentId,
    ngay_tao: reply.createdAt.toISOString(),
    user: reply.user
      ? {
          id: reply.user.id,
          ten: reply.user.firstName,
          ho: reply.user.lastName,
          anh_dai_dien: reply.user.avatarUrl,
        }
      : undefined,
  })),
});

// Middleware
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Video streaming endpoint with CORS
app.get('/api/videos/*', (req, res) => {
  const filename = req.params[0];
  const filePath = path.join(uploadDir, filename);
  
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'Video not found' });
    return;
  }
  
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;
  
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Length', chunksize);
    res.setHeader('Content-Type', 'video/mp4');
    
    const stream = fs.createReadStream(filePath, { start, end });
    stream.pipe(res);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Content-Length', fileSize);
    res.setHeader('Content-Type', 'video/mp4');
    fs.createReadStream(filePath).pipe(res);
  }
});

app.use(globalRateLimiter);

// Error handler (must be last)
app.use(errorHandler);

// Upload endpoint
const storage = multer.diskStorage({
  destination: (_: unknown, __: unknown, cb: (err: Error | null, path: string) => void) => {
    cb(null, uploadDir);
  },
  filename: (_: unknown, file: { originalname: string }, cb: (err: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

app.post('/api/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }
  const url = `/uploads/${file.filename}`;
  res.json({ url, filename: file.filename });
});

// Routes
app.get('/', (_req, res) => {
  res.json({
    name: 'LMS Backend API',
    status: 'OK',
    endpoints: [
      '/health',
      '/api/auth/login',
      '/api/auth/register',
      '/api/users',
      '/api/users/:id',
      '/api/users/:id [PATCH]',
      '/api/users/:userId/progress',
      '/api/categories',
      '/api/categories [POST]',
      '/api/categories/:id [PATCH|DELETE]',
      '/api/courses',
      '/api/courses [POST]',
      '/api/courses/:id',
      '/api/courses/:id [PATCH|DELETE]',
      '/api/courses/:id/chapters',
      '/api/chapters/:id [PATCH|DELETE]',
      '/api/chapters/:id/lessons',
      '/api/lessons/:id [PATCH|DELETE]',
      '/api/lessons/:id/comments',
      '/api/comments/:id [DELETE]',
      '/api/forum/topics',
      '/api/forum/topics/:id',
      '/api/forum/topics/:id [PATCH|DELETE]',
      '/api/forum/topics/:id/replies',
      '/api/forum/replies/:id [DELETE]',
      '/api/enrollments',
      '/api/my-courses/:userId',
      '/api/my-enrollments',
'/api/cart',
      '/api/cart/:courseId',
      '/api/checkout',
      '/api/orders',
      '/api/orders/:id/pay',
      '/api/orders/:id/refund',
      '/api/admin/overview',
      '/api/my-enrollments',
      '/api/courses/:id/status',
      '/api/instructors',
      '/api/instructors/:id/students',
      '/api/instructors/:id/analytics',
      '/api/analytics',
      '/api/progress [PATCH]',
      '/api/quizzes/:id',
      '/api/quizzes/:id/questions',
      '/api/quizzes/:id/questions [POST]',
      '/api/quizzes/:quizId/questions/:questionId [PATCH|DELETE]',
      '/api/quizzes/:id/attempts',
      '/api/quizzes/:id/attempts/:attemptId/grade',
      '/api/assignments',
      '/api/assignments/:id/submissions',
    ],
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Backend running!' });
});

app.post('/api/auth/login', loginRateLimiter, async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const credential = (data.email ?? data.username ?? '').trim();

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: credential }, { username: credential }],
      },
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    if (user.isLocked) {
      res.status(403).json({ error: 'User is locked' });
      return;
    }

    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, tokenVersion: user.tokenVersion });

    res.json({
      user: serializeUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.issues });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/register', authRateLimiter, async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username || data.email.split('@')[0] },
        ],
      },
      select: { id: true },
    });

    if (existingUser) {
      res.status(409).json({ error: 'Email or username already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const normalizedUsername = data.username?.trim() || data.email.split('@')[0] || '';
    const normalizedName = data.name.trim();
    const parts = normalizedName.split(/\s+/).filter(Boolean);
    const firstName = parts.length === 1 ? parts[0] : parts.slice(0, -1).join(' ') || normalizedName;
    const lastName = parts.length > 1 ? parts[parts.length - 1] : '';

    const user = await prisma.user.create({
      data: {
        username: normalizedUsername,
        email: data.email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        joinedAt: new Date(),
        role: data.role || 'hoc_vien',
      },
    });

    const { generateToken } = await import('./utils/permissions.js');
    const verificationToken = generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt,
      },
    });

    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, tokenVersion: user.tokenVersion });

    res.status(201).json({
      user: serializeUser(user),
      accessToken,
      refreshToken,
      verificationToken,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.issues });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users', authenticate, requireRole('admin'), async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: 'asc' },
    });

    res.json({ users: users.map(serializeUser) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/refresh', async (req, res) => {
  try {
    const data = refreshTokenSchema.parse(req.body);

    const payload = verifyRefreshToken(data.refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true, tokenVersion: true },
    });

    if (!user || user.tokenVersion !== payload.tokenVersion) {
      res.status(401).json({ error: 'Invalid refresh token' });
      return;
    }

    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, tokenVersion: user.tokenVersion });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.issues });
      return;
    }
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

app.post('/api/auth/logout', authenticate, async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { tokenVersion: { increment: 1 } },
    });

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/forgot-password', authHandlers.forgotPassword);

app.post('/api/auth/reset-password', authHandlers.resetPassword);

app.post('/api/auth/verify-email', authHandlers.verifyEmail);

app.post('/api/auth/resend-verification', authHandlers.resendVerification);

app.get('/api/auth/sessions', ...authHandlers.getSessions);

app.delete('/api/auth/sessions/:sessionId', ...authHandlers.revokeSession);

app.post('/api/auth/revoke-all-sessions', ...authHandlers.revokeAllSessions);

app.get('/api/auth/permissions', ...authHandlers.getPermissions);


app.get('/api/users/:id', async (req, res) => {
  const userId = parseId(req.params.id);

  if (!userId) {
    res.status(400).json({ error: 'Invalid user id' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user: serializeUser(user) });
  } catch (error) {
    handleError(res, error);
  }
});

app.patch('/api/users/:id', async (req, res) => {
  const userId = parseId(req.params.id);

  if (!userId) {
    res.status(400).json({ error: 'Invalid user id' });
    return;
  }

  const { ten, ho, email, so_dien_thoai, dia_chi, gioi_thieu, anh_dai_dien } = req.body as Record<string, unknown>;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: typeof ten === 'string' ? ten.trim() : undefined,
        lastName: typeof ho === 'string' ? ho.trim() : undefined,
        email: typeof email === 'string' ? email.trim().toLowerCase() : undefined,
        phone: typeof so_dien_thoai === 'string' ? so_dien_thoai.trim() : undefined,
        address: typeof dia_chi === 'string' ? dia_chi.trim() : undefined,
        bio: typeof gioi_thieu === 'string' ? gioi_thieu.trim() : undefined,
        avatarUrl: typeof anh_dai_dien === 'string' ? anh_dai_dien.trim() : undefined,
      },
    });

    res.json({ user: serializeUser(user) });
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/categories', async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: 'asc' },
    });

    res.json({
      categories: categories.map((category) => ({
        id: category.id,
        ten: category.name,
      })),
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/categories', authenticate, async (req, res) => {
  const { ten } = req.body as { ten?: string };
  const name = ten?.trim();

  if (!name) {
    res.status(400).json({ error: 'Category name is required' });
    return;
  }



  try {
    const category = await prisma.category.create({
      data: { name },
    });

    res.status(201).json({ category: { id: category.id, ten: category.name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/categories/:id', async (req, res) => {
  const categoryId = parseId(req.params.id);
  const { ten } = req.body as { ten?: string };
  const name = ten?.trim();

  if (!categoryId || !name) {
    res.status(400).json({ error: 'Invalid category payload' });
    return;
  }

  try {
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: { name },
    });

    res.json({ category: { id: category.id, ten: category.name } });
  } catch (error) {
    handleError(res, error);
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  const categoryId = parseId(req.params.id);

  if (!categoryId) {
    res.status(400).json({ error: 'Invalid category id' });
    return;
  }

  try {
    await prisma.category.delete({ where: { id: categoryId } });
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/courses', async (req, res) => {
  try {
    const categoryId = parseOptionalId(req.query.categoryId);
    const instructorId = parseOptionalId(req.query.instructorId);
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
    const level = typeof req.query.level === 'string' ? req.query.level : undefined;
    const sortBy = typeof req.query.sortBy === 'string' ? req.query.sortBy : undefined;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 12;

    const userId = req.headers['x-user-id'] ? Number(req.headers['x-user-id']) : undefined;

    const where: any = {
      status: 'approved',      ...(categoryId ? { categoryId } : {}),
      ...(instructorId ? { instructorId } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(minPrice ? { price: { gte: minPrice } } : {}),
      ...(maxPrice ? { price: { lte: maxPrice } } : {}),
      ...(level ? { level } : {}),
    };

    let enrolledCourseIds: number[] = [];
    if (userId) {
      const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        select: { courseId: true },
      });
      enrolledCourseIds = enrollments.map(e => e.courseId);
    }

    if (enrolledCourseIds.length > 0) {
      where.id = { notIn: enrolledCourseIds };
    }

    let orderBy: any = { id: 'desc' };
    if (sortBy === 'popular') {
      orderBy = { enrolledCount: 'desc' };
    } else if (sortBy === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (sortBy === 'price-desc') {
      orderBy = { price: 'desc' };
    } else if (sortBy === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const skip = (page - 1) * limit;
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.course.count({ where }),
    ]);

    res.json({
      courses: courses.map(serializeCourse),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/teacher/courses', authenticate, async (req, res) => {
  try {
    const statusParam = typeof req.query.status === 'string' ? req.query.status : undefined;
    const status = courseStatuses.find((value) => value === statusParam);

    const courses = await prisma.course.findMany({
      where: {
        instructorId: req.user!.userId,
        ...(status ? { status } : {}),
      },
      include: {
        category: { select: { id: true, name: true } },
        chapters: {
          include: {
            lessons: { select: { id: true } },
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    res.json({
      courses: courses.map((course) => ({
        ...serializeCourse(course),
        so_chuong: course.chapters.length,
        tong_bai_hoc: course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0),
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/teacher/courses/:id', authenticate, async (req, res) => {
  const courseId = parseId(req.params.id);
  if (!courseId) {
    res.status(400).json({ error: 'Invalid course id' });
    return;
  }

  try {
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: req.user!.userId,
      },
      include: {
        category: true,          chapters: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                quizzes: { select: { id: true, title: true, questionCount: true, timeLimit: true } },
                assignments: { select: { id: true, title: true } },
              },
            },
          },
        },
      },
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    res.json({
      course: {
        ...serializeCourse(course),
        danh_muc: course.category ? { id: course.category.id, ten: course.category.name } : undefined,
        so_luong_toi_da: undefined,
        chuong_hoc: course.chapters.map((chapter) => ({
          id: chapter.id,
          khoa_hoc_id: chapter.courseId,
          tieu_de: chapter.title,
          thu_tu: chapter.order,
          bai_hoc: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            chuong_hoc_id: lesson.chapterId,
            tieu_de: lesson.title,
            thu_tu: lesson.order,
            video_url: lesson.videoUrl,
            loai: lesson.type,
            thoi_luong: lesson.duration,
            noi_dung: lesson.content,
            quizzes: lesson.quizzes.map((quiz) => ({
              id: quiz.id,
              tieu_de: quiz.title,
              so_cau_hoi: quiz.questionCount,
              thoi_gian_lam: quiz.timeLimit,
            })),
            assignments: lesson.assignments.map((assignment) => ({
              id: assignment.id,
              tieu_de: assignment.title,
            })),
          })),
        })),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/courses/:id', async (req, res) => {
  const courseId = parseId(req.params.id);

  if (!courseId) {
    res.status(400).json({ error: 'Invalid course id' });
    return;
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            bio: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        chapters: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { id: 'asc' },
              include: {
                quizzes: {
                  select: { id: true, title: true, timeLimit: true, questionCount: true },
                },
                assignments: {
                  select: { id: true, title: true, description: true, isRequired: true, dueAt: true },
                },
              },
            },
          },
        },
      },
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    res.json({
      course: {
        ...serializeCourse(course),
        giang_vien: course.instructor
          ? {
              id: course.instructor.id,
              ten: course.instructor.firstName,
              ho: course.instructor.lastName,
              anh_dai_dien: course.instructor.avatarUrl,
              gioi_thieu: course.instructor.bio,
            }
          : undefined,
        chuong_hoc: course.chapters.map((chapter) => ({
          id: chapter.id,
          khoa_hoc_id: chapter.courseId,
          tieu_de: chapter.title,
          thu_tu: chapter.order,
          bai_hoc: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            chuong_hoc_id: lesson.chapterId,
            tieu_de: lesson.title,
            video_url: lesson.videoUrl,
            loai: lesson.type,
            thoi_luong: lesson.duration,
            noi_dung: lesson.content,
            quizzes: lesson.quizzes.map((quiz) => ({
              id: quiz.id,
              tieu_de: quiz.title,
              thoi_gian_lam: quiz.timeLimit,
              so_cau_hoi: quiz.questionCount,
            })),
            assignments: lesson.assignments.map((assignment) => ({
              id: assignment.id,
              tieu_de: assignment.title,
              mo_ta: assignment.description,
              bat_buoc: assignment.isRequired,
              han_nop: assignment.dueAt?.toISOString() ?? null,
            })),
          })),
        })),
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/lessons/:id', async (req, res) => {
  const lessonId = parseId(req.params.id);
  if (!lessonId) {
    res.status(400).json({ error: 'Invalid lesson id' });
    return;
  }

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        chapter: {
          include: {
            course: {
              select: { id: true, title: true },
            },
          },
        },
        quizzes: {
          select: { id: true, title: true, questionCount: true, timeLimit: true },
        },
        assignments: {
          select: { id: true, title: true, isRequired: true, dueAt: true },
        },
      },
    });

    if (!lesson) {
      res.status(404).json({ error: 'Lesson not found' });
      return;
    }

    res.json({
      lesson: {
        id: lesson.id,
        bai_hoc_id: lesson.chapterId,
        chuong_hoc_id: lesson.chapterId,
        khoa_hoc_id: lesson.chapter.courseId,
        tieu_de: lesson.title,
        video_url: lesson.videoUrl,
        loai: lesson.type,
        thoi_luong: lesson.duration,
        noi_dung: lesson.content,
        khoa_hoc: lesson.chapter.course,
        quizzes: lesson.quizzes,
        assignments: lesson.assignments,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/lessons/:lessonId/quiz', authenticate, async (req, res) => {
  const lessonId = parseId(req.params.lessonId);
  const { tieu_de, thoi_gian_lam, questions } = req.body as {
    tieu_de?: string;
    thoi_gian_lam?: number;
    questions?: Array<{ cau_hoi: string; lua_chon: string[]; dap_an_dung: number }>;
  };

  if (!lessonId || !tieu_de?.trim()) {
    res.status(400).json({ error: 'Invalid quiz payload' });
    return;
  }

  try {
    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId },
      include: { chapter: { include: { course: { select: { instructorId: true } } } } },
    });

    if (!lesson) {
      res.status(404).json({ error: 'Lesson not found' });
      return;
    }

    if (lesson.chapter.course.instructorId !== req.user!.userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const quiz = await prisma.quiz.create({
      data: {
        lessonId,
        title: tieu_de.trim(),
        timeLimit: typeof thoi_gian_lam === 'number' ? thoi_gian_lam : 10,
        questionCount: Array.isArray(questions) ? questions.length : 0,
      },
    });

    if (Array.isArray(questions) && questions.length > 0) {
      await prisma.quizQuestion.createMany({
        data: questions.map((q) => ({
          quizId: quiz.id,
          question: q.cau_hoi,
          options: q.lua_chon,
          correctAnswer: q.lua_chon[q.dap_an_dung] || q.lua_chon[0],
        })),
      });
    }

    const quizWithQuestions = await prisma.quiz.findUnique({
      where: { id: quiz.id },
      include: { questions: { orderBy: { id: 'asc' } } },
    });

    res.status(201).json({
      quiz: {
        id: quizWithQuestions!.id,
        bai_hoc_id: quizWithQuestions!.lessonId,
        tieu_de: quizWithQuestions!.title,
        thoi_gian_lam: quizWithQuestions!.timeLimit,
        so_cau_hoi: quizWithQuestions!.questionCount,
        questions: quizWithQuestions!.questions.map((q) => ({
          id: q.id,
          quiz_id: q.quizId,
          cau_hoi: q.question,
          lua_chon: q.options,
          dap_an_dung: q.correctAnswer,
        })),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/lessons/:id/comments', async (req, res) => {
  const lessonId = parseId(req.params.id);

  if (!lessonId) {
    res.status(400).json({ error: 'Invalid lesson id' });
    return;
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        lessonId,
        parentId: null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ comments: comments.map(serializeComment) });
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/lessons/:id/comments', authenticate, async (req, res) => {
  const lessonId = parseId(req.params.id);
  const { nguoi_dung_id, noi_dung, parent_id } = req.body as {
    nguoi_dung_id?: number;
    noi_dung?: string;
    parent_id?: number;
  };

  const userId = Number(nguoi_dung_id);
  const content = noi_dung?.trim();
  const parentId = parent_id == null ? null : Number(parent_id);

  if (!lessonId || !Number.isInteger(userId) || !content) {
    res.status(400).json({ error: 'Invalid comment payload' });
    return;
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        lessonId,
        userId,
        content,
        parentId: Number.isInteger(parentId) ? parentId : null,
        createdAt: new Date(),
        
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    res.status(201).json({ comment: serializeComment(comment) });
  } catch (error) {
    handleError(res, error);
  }
});

app.delete('/api/comments/:id', async (req, res) => {
  const commentId = parseId(req.params.id);

  if (!commentId) {
    res.status(400).json({ error: 'Invalid comment id' });
    return;
  }

  try {
    await prisma.comment.delete({ where: { id: commentId } });
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/courses', authenticate, async (req, res) => {
  const {
    tieu_de,
    danh_muc_id,
    gia,
    trang_thai,
    mo_ta,
    hinh_anh,
    muc_do,
    thoi_luong,
    requirements,
    what_you_learn,
  } = req.body as Record<string, unknown>;

  const title = typeof tieu_de === 'string' ? tieu_de.trim() : '';
  const instructorId = req.user!.userId;
  const categoryId = Number(danh_muc_id);
  const price = Number(gia);
  const status = courseStatuses.find((value) => value === trang_thai) ?? 'draft';

  if (!title || !Number.isInteger(categoryId) || Number.isNaN(price)) {
    res.status(400).json({ error: 'Invalid course payload' });
    return;
  }

  try {
    const course = await prisma.course.create({
      data: {
        title,
        instructorId,
        categoryId,
        price,
        enrolledCount: 0,
        status,
        description: typeof mo_ta === 'string' ? mo_ta : null,
        imageUrl: typeof hinh_anh === 'string' ? hinh_anh : null,
        level: typeof muc_do === 'string' ? muc_do : null,
        duration: typeof thoi_luong === 'string' ? thoi_luong : null,
        requirements: Array.isArray(requirements) ? requirements : undefined,
        learningOutcomes: Array.isArray(what_you_learn) ? what_you_learn : undefined,
        
      },
      include: {
        instructor: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        category: { select: { id: true, name: true } },
      },
    });

    res.status(201).json({ course: serializeCourse(course) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/courses/:id', async (req, res) => {
  const courseId = parseId(req.params.id);

  if (!courseId) {
    res.status(400).json({ error: 'Invalid course id' });
    return;
  }

  const {
    tieu_de,
    giang_vien_id,
    danh_muc_id,
    gia,
    trang_thai,
    mo_ta,
    hinh_anh,
    muc_do,
    thoi_luong,
    requirements,
    what_you_learn,
  } = req.body as Record<string, unknown>;

  try {
    const course = await prisma.course.update({
      where: { id: courseId },
      data: {
        title: typeof tieu_de === 'string' ? tieu_de.trim() : undefined,
        instructorId: Number.isInteger(giang_vien_id) ? Number(giang_vien_id) : undefined,
        categoryId: Number.isInteger(danh_muc_id) ? Number(danh_muc_id) : undefined,
        price: typeof gia === 'number' ? gia : undefined,
        status: courseStatuses.find((value) => value === trang_thai) ?? undefined,
        description: typeof mo_ta === 'string' ? mo_ta : undefined,
        imageUrl: typeof hinh_anh === 'string' ? hinh_anh : undefined,
        level: typeof muc_do === 'string' ? muc_do : undefined,
        duration: typeof thoi_luong === 'string' ? thoi_luong : undefined,
        requirements: Array.isArray(requirements) ? requirements : undefined,
        learningOutcomes: Array.isArray(what_you_learn) ? what_you_learn : undefined,
      },
      include: {
        instructor: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        category: { select: { id: true, name: true } },
      },
    });

    res.json({ course: serializeCourse(course) });
  } catch (error) {
    handleError(res, error);
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  const courseId = parseId(req.params.id);

  if (!courseId) {
    res.status(400).json({ error: 'Invalid course id' });
    return;
  }

  try {
    await prisma.course.delete({ where: { id: courseId } });
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

app.patch('/api/courses/:id/chapters/reorder', authenticate, async (req, res) => {
  const courseId = parseId(req.params.id);
  const { chapterIds } = req.body as { chapterIds?: number[] };

  if (!courseId || !Array.isArray(chapterIds)) {
    res.status(400).json({ error: 'Invalid reorder payload' });
    return;
  }

  try {
    const course = await prisma.course.findFirst({
      where: { id: courseId, instructorId: req.user!.userId },
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    await prisma.$transaction(
      chapterIds.map((id, index) =>
        prisma.chapter.update({
          where: { id },
          data: { order: index + 1 },
        })
      )
    );

    res.json({ message: 'Chapters reordered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/courses/:id/chapters', authenticate, async (req, res) => {
  const courseId = parseId(req.params.id);
  const { tieu_de, thu_tu } = req.body as { tieu_de?: string; thu_tu?: number };

  if (!courseId || !tieu_de?.trim()) {
    res.status(400).json({ error: 'Invalid chapter payload' });
    return;
  }


  try {
    const chapter = await prisma.chapter.create({
      data: {
        courseId,
        title: tieu_de.trim(),
        order: typeof thu_tu === 'number' && Number.isInteger(thu_tu) ? thu_tu : 1,
        
      },
    });

    res.status(201).json({
      chapter: {
        id: chapter.id,
        khoa_hoc_id: chapter.courseId,
        tieu_de: chapter.title,
        thu_tu: chapter.order,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/chapters/:id', authenticate, async (req, res) => {
  const chapterId = parseId(req.params.id);
  const { tieu_de, thu_tu } = req.body as { tieu_de?: string; thu_tu?: number };

  if (!chapterId) {
    res.status(400).json({ error: 'Invalid chapter id' });
    return;
  }


  try {
    const chapter = await prisma.chapter.findFirst({
      where: { id: chapterId },
      include: { course: { select: { instructorId: true } } },
    });

    if (!chapter) {
      res.status(404).json({ error: 'Chapter not found' });
      return;
    }

    if (chapter.course.instructorId !== req.user!.userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const updated = await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        title: typeof tieu_de === 'string' ? tieu_de.trim() : undefined,
        order: typeof thu_tu === 'number' && Number.isInteger(thu_tu) ? thu_tu : undefined,
      },
    });

    res.json({
      chapter: {
        id: updated.id,
        khoa_hoc_id: updated.courseId,
        tieu_de: updated.title,
        thu_tu: updated.order,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.delete('/api/chapters/:id', authenticate, async (req, res) => {
  const chapterId = parseId(req.params.id);

  if (!chapterId) {
    res.status(400).json({ error: 'Invalid chapter id' });
    return;
  }


  try {
    const chapter = await prisma.chapter.findFirst({
      where: { id: chapterId },
      include: { course: { select: { instructorId: true } } },
    });

    if (!chapter) {
      res.status(404).json({ error: 'Chapter not found' });
      return;
    }

    if (chapter.course.instructorId !== req.user!.userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    await prisma.chapter.delete({ where: { id: chapterId } });
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/chapters/:id/lessons', authenticate, async (req, res) => {
  const chapterId = parseId(req.params.id);
  const { tieu_de, video_url, loai, thoi_luong, noi_dung } = req.body as Record<string, unknown>;
  const title = typeof tieu_de === 'string' ? tieu_de.trim() : '';
  const type = lessonTypes.find((value) => value === loai) ?? 'video';

  if (!chapterId || !title) {
    res.status(400).json({ error: 'Invalid lesson payload' });
    return;
  }


  try {
    const existingCount = await prisma.lesson.count({ where: { chapterId } });
    const lesson = await prisma.lesson.create({
      data: {
        chapterId,
        title,
        order: existingCount + 1,
        videoUrl: typeof video_url === 'string' ? video_url : null,
        type,
        duration: typeof thoi_luong === 'string' ? thoi_luong : null,
        content: typeof noi_dung === 'string' ? noi_dung : null,
        
      },
    });

    res.status(201).json({
      lesson: {
        id: lesson.id,
        chuong_hoc_id: lesson.chapterId,
        tieu_de: lesson.title,
        thu_tu: lesson.order,
        video_url: lesson.videoUrl,
        loai: lesson.type,
        thoi_luong: lesson.duration,
        noi_dung: lesson.content,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/lessons/:id', authenticate, async (req, res) => {
  const lessonId = parseId(req.params.id);
  const { tieu_de, video_url, loai, thoi_luong, noi_dung } = req.body as Record<string, unknown>;

  if (!lessonId) {
    res.status(400).json({ error: 'Invalid lesson id' });
    return;
  }


  try {
    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId },
      include: { chapter: { include: { course: { select: { instructorId: true } } } } },
    });

    if (!lesson) {
      res.status(404).json({ error: 'Lesson not found' });
      return;
    }

    if (lesson.chapter.course.instructorId !== req.user!.userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const updated = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: typeof tieu_de === 'string' ? tieu_de.trim() : undefined,
        videoUrl: typeof video_url === 'string' ? video_url : undefined,
        type: lessonTypes.find((value) => value === loai) ?? undefined,
        duration: typeof thoi_luong === 'string' ? thoi_luong : undefined,
        content: typeof noi_dung === 'string' ? noi_dung : undefined,
        order: typeof req.body.thu_tu === 'number' ? req.body.thu_tu : undefined,
      },
    });

    res.json({
      lesson: {
        id: updated.id,
        chuong_hoc_id: updated.chapterId,
        tieu_de: updated.title,
        thu_tu: updated.order,
        video_url: updated.videoUrl,
        loai: updated.type,
        thoi_luong: updated.duration,
        noi_dung: updated.content,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.delete('/api/lessons/:id', authenticate, async (req, res) => {
  const lessonId = parseId(req.params.id);

  if (!lessonId) {
    res.status(400).json({ error: 'Invalid lesson id' });
    return;
  }


  try {
    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId },
      include: { chapter: { include: { course: { select: { instructorId: true } } } } },
    });

    if (!lesson) {
      res.status(404).json({ error: 'Lesson not found' });
      return;
    }

    if (lesson.chapter.course.instructorId !== req.user!.userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    await prisma.lesson.delete({ where: { id: lessonId } });
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

app.patch('/api/chapters/:id/lessons/reorder', authenticate, async (req, res) => {
  const chapterId = parseId(req.params.id);
  const { lessonIds } = req.body as { lessonIds?: number[] };

  if (!chapterId || !Array.isArray(lessonIds)) {
    res.status(400).json({ error: 'Invalid reorder payload' });
    return;
  }


  try {
    const chapter = await prisma.chapter.findFirst({
      where: { id: chapterId },
      include: { course: { select: { instructorId: true } } },
    });

    if (!chapter) {
      res.status(404).json({ error: 'Chapter not found' });
      return;
    }

    if (chapter.course.instructorId !== req.user!.userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    await prisma.$transaction(
      lessonIds.map((id, index) =>
        prisma.lesson.update({
          where: { id },
          data: { order: index + 1 },
        })
      )
    );

    res.json({ message: 'Lessons reordered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/my-courses/:userId', async (req, res) => {
  const userId = parseId(req.params.userId);

  if (!userId) {
    res.status(400).json({ error: 'Invalid user id' });
    return;
  }

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            chapters: {
              include: {
                lessons: {
                  select: { id: true },
                },
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    const progressRows = await prisma.progress.findMany({
      where: { userId },
      select: {
        lessonId: true,
        completed: true,
      },
    });

    const completedLessonIds = new Set(progressRows.filter((item) => item.completed).map((item) => item.lessonId));

    res.json({
      courses: enrollments.map((enrollment) => {
        const lessonIds = enrollment.course.chapters.flatMap((chapter) => chapter.lessons.map((lesson) => lesson.id));
        const totalLessons = lessonIds.length;
        const completedLessons = lessonIds.filter((lessonId) => completedLessonIds.has(lessonId)).length;
        const progress = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

        return {
          ...serializeCourse(enrollment.course),
          ngay_dang_ky: enrollment.enrolledAt.toISOString(),
          tien_do: progress,
          tong_bai_hoc: totalLessons,
          bai_hoc_hoan_thanh: completedLessons,
        };
      }),
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/users/:userId/progress', async (req, res) => {
  const userId = parseId(req.params.userId);
  const courseId = parseOptionalId(req.query.courseId);

  if (!userId) {
    res.status(400).json({ error: 'Invalid user id' });
    return;
  }

  try {
    const progressRows = await prisma.progress.findMany({
      where: {
        userId,
        ...(courseId
          ? {
              lesson: {
                chapter: {
                  courseId,
                },
              },
            }
          : {}),
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            chapterId: true,
          },
        },
      },
      orderBy: { lessonId: 'asc' },
    });

    res.json({
      progress: progressRows.map((item) => ({
        nguoi_dung_id: item.userId,
        bai_hoc_id: item.lessonId,
        da_hoan_thanh: item.completed,
        ngay_hoan_thanh: item.completedAt?.toISOString() ?? null,
        bai_hoc: {
          id: item.lesson.id,
          tieu_de: item.lesson.title,
          chuong_hoc_id: item.lesson.chapterId,
        },
      })),
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.patch('/api/progress', authenticate, async (req, res) => {
  const { bai_hoc_id, da_hoan_thanh } = req.body as {
    bai_hoc_id?: number;
    da_hoan_thanh?: boolean;
  };

  const userId = req.user!.userId;
  const lessonId = Number(bai_hoc_id);

  if (!Number.isInteger(userId) || !Number.isInteger(lessonId) || typeof da_hoan_thanh !== 'boolean') {
    res.status(400).json({ error: 'Invalid progress payload' });
    return;
  }


  try {
    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        completed: da_hoan_thanh,
        completedAt: da_hoan_thanh ? new Date() : null,
      },
      create: {
        userId,
        lessonId,
        completed: da_hoan_thanh,
        completedAt: da_hoan_thanh ? new Date() : null,
        
      },
    });

    if (da_hoan_thanh) {
      const lesson = await prisma.lesson.findFirst({
        where: { id: lessonId },
        include: {
          chapter: {
            include: {
              course: {
                include: {
                  chapters: { include: { lessons: true } },
                },
              },
            },
          },
        },
      });

      if (lesson) {
        const totalLessons = lesson.chapter.course.chapters.reduce(
          (sum, ch) => sum + ch.lessons.length, 0
        );

        const completedCount = await prisma.progress.count({
          where: { userId, completed: true },
        });

        if (completedCount >= totalLessons && totalLessons > 0) {
          await prisma.enrollment.updateMany({
            where: {
              userId,
              courseId: lesson.chapter.course.id,
              completedAt: null,
            },
            data: { completedAt: new Date() },
          });
        }
      }
    }

    res.json({
      progress: {
        nguoi_dung_id: progress.userId,
        bai_hoc_id: progress.lessonId,
        da_hoan_thanh: progress.completed,
        ngay_hoan_thanh: progress.completedAt?.toISOString() ?? null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/enrollments', authenticate, async (req, res) => {
  const { khoa_hoc_id } = req.body as { khoa_hoc_id?: number };
  const userId = req.user!.userId;
  const courseId = Number(khoa_hoc_id);

  if (!Number.isInteger(userId) || !Number.isInteger(courseId)) {
    res.status(400).json({ error: 'Invalid enrollment payload' });
    return;
  }


  try {
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (existingEnrollment) {
      res.json({
        enrollment: {
          id: existingEnrollment.id,
          nguoi_dung_id: existingEnrollment.userId,
          khoa_hoc_id: existingEnrollment.courseId,
          ngay_dang_ky: existingEnrollment.enrolledAt.toISOString(),
        },
      });
      return;
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        enrolledAt: new Date(),
        
      },
    });

    await prisma.course.update({
      where: { id: courseId },
      data: {
        enrolledCount: {
          increment: 1,
        },
      },
    });

    res.status(201).json({
      enrollment: {
        id: enrollment.id,
        nguoi_dung_id: enrollment.userId,
        khoa_hoc_id: enrollment.courseId,
        ngay_dang_ky: enrollment.enrolledAt.toISOString(),
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

// Phase 1.1: Mount course routes for reviews
import courseRoutes from './routes/course.routes.js';
app.use('/api/courses', courseRoutes);

// Mount quiz routes (prerequisite logic in quiz.routes.ts uses the router)
import quizRoutes from './routes/quiz.routes.js';
app.use('/api/quizzes', quizRoutes);

// Mount media routes for uploads
import mediaRoutes from './routes/media.js';
app.use('/api/media', mediaRoutes);

// Phase 1.2: GET /api/enrollments/check/:courseId
app.get('/api/enrollments/check/:courseId', authenticate, async (req, res) => {
  const courseId = parseId(req.params.courseId);
  const userId = req.user!.userId;

  if (!courseId) {
    res.status(400).json({ error: 'Invalid course id' });
    return;
  }

  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (enrollment) {
      res.json({
        enrolled: true,
        enrollmentId: enrollment.id,
        ngay_dang_ky: enrollment.enrolledAt.toISOString(),
      });
    } else {
      res.json({ enrolled: false });
    }
  } catch (error) {
    handleError(res, error);
  }
});

// Phase 1.4: GET /api/my-enrollments
app.get('/api/my-enrollments', authenticate, async (req, res) => {
  const userId = req.user!.userId;

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: {
              select: { id: true, firstName: true, lastName: true, avatarUrl: true },
            },
            category: {
              select: { id: true, name: true },
            },
            chapters: {
              include: {
                lessons: {
                  select: { id: true },
                },
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    const progressRows = await prisma.progress.findMany({
      where: { userId, completed: true },
      select: { lessonId: true },
    });
    const completedLessonIds = new Set(progressRows.map(item => item.lessonId));

    res.json({
      enrollments: enrollments.map((enrollment) => {
        const lessonIds = enrollment.course.chapters.flatMap(chapter => chapter.lessons.map(lesson => lesson.id));
        const totalLessons = lessonIds.length;
        const completedLessons = lessonIds.filter(lessonId => completedLessonIds.has(lessonId)).length;
        const progress = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

        let trang_thai: "completed" | "in_progress" | "not_started" = "not_started";
        if (progress === 100) trang_thai = "completed";
        else if (progress > 0) trang_thai = "in_progress";

        return {
          id: enrollment.id,
          khoa_hoc_id: enrollment.courseId,
          tien_do: progress,
          trang_thai,
          ngay_dang_ky: enrollment.enrolledAt.toISOString(),
          ngay_hoan_thanh: progress === 100 ? new Date().toISOString() : null,
          bai_hoc_hien_tai: null,
          khoa_hoc: {
            id: enrollment.course.id,
            tieu_de: enrollment.course.title,
            mo_ta: enrollment.course.description || "",
            hinh_anh: enrollment.course.imageUrl,
            gia: enrollment.course.price,
            muc_do: enrollment.course.level,
            trang_thai: enrollment.course.status,
            giang_vien: {
              id: enrollment.course.instructor.id,
              ho: enrollment.course.instructor.lastName || "",
              ten: enrollment.course.instructor.firstName || "",
              anh_dai_dien: enrollment.course.instructor.avatarUrl,
            },
          },
        };
      }),
    });
  } catch (error) {
    handleError(res, error);
  }
});

// Phase 1.3: POST /api/cart (with duplicate check)
app.post('/api/cart', authenticate, async (req, res) => {
  const { khoa_hoc_id } = req.body as { khoa_hoc_id?: number };
  const userId = req.user!.userId;
  const courseId = Number(khoa_hoc_id);

  if (!Number.isInteger(userId) || !Number.isInteger(courseId)) {
    res.status(400).json({ error: 'Invalid cart payload' });
    return;
  }

  try {
    // Check if user already enrolled in this course
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (existingEnrollment) {
      res.status(400).json({ error: 'Bạn đã đăng ký khóa học này rồi' });
      return;
    }

    // Check if already in cart
    const existingCartItem = await prisma.cart.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (existingCartItem) {
      res.status(400).json({ error: 'Khóa học đã có trong giỏ hàng' });
      return;
    }

    // Check if course exists and is available
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, status: true },
    });

    if (!course) {
      res.status(404).json({ error: 'Khóa học không tồn tại' });
      return;
    }

    if (course.status !== 'approved') {
      res.status(400).json({ error: 'Khóa học không khả dụng' });
      return;
    }

    const cartItem = await prisma.cart.create({
      data: {
        userId,
        courseId,
        createdAt: new Date(),
      },
      include: {
        course: {
          include: {
            instructor: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
            category: { select: { id: true, name: true } },
          },
        },
      },
    });

    res.status(201).json({
      item: {
        id: cartItem.id,
        khoa_hoc_id: cartItem.courseId,
        gia: cartItem.course.price,
        khoa_hoc: {
          id: cartItem.course.id,
          tieu_de: cartItem.course.title,
          hinh_anh: cartItem.course.imageUrl,
          giang_vien: cartItem.course.instructor,
          danh_muc: cartItem.course.category,
        },
        ngay_them: cartItem.createdAt.toISOString(),
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

// DELETE /api/cart/:courseId (remove from cart)
app.delete('/api/cart/:courseId', authenticate, async (req, res) => {
  const courseId = parseId(req.params.courseId);
  const userId = req.user!.userId;

  if (!courseId) {
    res.status(400).json({ error: 'Invalid course id' });
    return;
  }

  try {
    await prisma.cart.deleteMany({
      where: { userId, courseId },
    });
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

// DELETE /api/cart (clear entire cart)
app.delete('/api/cart', authenticate, async (req, res) => {
  const userId = req.user!.userId;

  try {
    await prisma.cart.deleteMany({
      where: { userId },
    });
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/forum/topics', async (req, res) => {
  const courseId = parseOptionalId(req.query.courseId);
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';

  try {
    const topics = await prisma.forumTopic.findMany({
      where: {
        ...(courseId ? { courseId } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({
      topics: topics.map((topic) => ({
        id: topic.id,
        nguoi_dung_id: topic.userId,
        tieu_de: topic.title,
        noi_dung: topic.content,
        khoa_hoc_id: topic.courseId,
        luot_xem: topic.viewCount,
        luot_tra_loi: topic.replyCount,
        ngay_tao: topic.createdAt.toISOString(),
        ngay_cap_nhat: topic.updatedAt.toISOString(),
        user: {
          id: topic.user.id,
          ten: topic.user.firstName,
          ho: topic.user.lastName,
          anh_dai_dien: topic.user.avatarUrl,
        },
        khoa_hoc: topic.course
          ? {
              id: topic.course.id,
              tieu_de: topic.course.title,
            }
          : null,
      })),
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/forum/topics', authenticate, async (req, res) => {
  const { nguoi_dung_id, tieu_de, noi_dung, khoa_hoc_id } = req.body as Record<string, unknown>;
  const userId = Number(nguoi_dung_id);
  const title = typeof tieu_de === 'string' ? tieu_de.trim() : '';
  const content = typeof noi_dung === 'string' ? noi_dung.trim() : '';
  const courseId = khoa_hoc_id == null || khoa_hoc_id === '' ? null : Number(khoa_hoc_id);

  if (!Number.isInteger(userId) || !title || !content) {
    res.status(400).json({ error: 'Invalid forum topic payload' });
    return;
  }


  try {
    const topic = await prisma.forumTopic.create({
      data: {
        userId,
        title,
        content,
        courseId: Number.isInteger(courseId) ? courseId : null,
        viewCount: 0,
        replyCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        course: { select: { id: true, title: true } },
      },
    });

    res.status(201).json({
      topic: {
        id: topic.id,
        nguoi_dung_id: topic.userId,
        tieu_de: topic.title,
        noi_dung: topic.content,
        khoa_hoc_id: topic.courseId,
        luot_xem: topic.viewCount,
        luot_tra_loi: topic.replyCount,
        ngay_tao: topic.createdAt.toISOString(),
        ngay_cap_nhat: topic.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/forum/topics/:id', async (req, res) => {
  const topicId = parseId(req.params.id);

  if (!topicId) {
    res.status(400).json({ error: 'Invalid topic id' });
    return;
  }

  try {
    const topic = await prisma.forumTopic.update({
      where: { id: topicId },
      data: {
        viewCount: {
          increment: 1,
        },
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        course: { select: { id: true, title: true } },
        replies: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    res.json({
      topic: {
        id: topic.id,
        nguoi_dung_id: topic.userId,
        tieu_de: topic.title,
        noi_dung: topic.content,
        khoa_hoc_id: topic.courseId,
        luot_xem: topic.viewCount,
        luot_tra_loi: topic.replyCount,
        ngay_tao: topic.createdAt.toISOString(),
        ngay_cap_nhat: topic.updatedAt.toISOString(),
        replies: topic.replies.map((reply) => ({
          id: reply.id,
          topic_id: reply.topicId,
          nguoi_dung_id: reply.userId,
          noi_dung: reply.content,
          ngay_tao: reply.createdAt.toISOString(),
          user: {
            id: reply.user.id,
            ten: reply.user.firstName,
            ho: reply.user.lastName,
            anh_dai_dien: reply.user.avatarUrl,
          },
        })),
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/forum/topics/:id/replies', authenticate, async (req, res) => {
  const topicId = parseId(req.params.id);
  const { nguoi_dung_id, noi_dung } = req.body as Record<string, unknown>;
  const userId = Number(nguoi_dung_id);
  const content = typeof noi_dung === 'string' ? noi_dung.trim() : '';

  if (!topicId || !Number.isInteger(userId) || !content) {
    res.status(400).json({ error: 'Invalid forum reply payload' });
    return;
  }


  try {
    const reply = await prisma.forumReply.create({
      data: {
        topicId,
        userId,
        content,
        createdAt: new Date(),
        
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
      },
    });

    await prisma.forumTopic.update({
      where: { id: topicId },
      data: {
        replyCount: {
          increment: 1,
        },
        updatedAt: new Date(),
      },
    });

    res.status(201).json({
      reply: {
        id: reply.id,
        topic_id: reply.topicId,
        nguoi_dung_id: reply.userId,
        noi_dung: reply.content,
        ngay_tao: reply.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/forum/topics/:id', async (req, res) => {
  const topicId = parseId(req.params.id);
  const { tieu_de, noi_dung, khoa_hoc_id } = req.body as Record<string, unknown>;

  if (!topicId) {
    res.status(400).json({ error: 'Invalid topic id' });
    return;
  }

  try {
    const topic = await prisma.forumTopic.update({
      where: { id: topicId },
      data: {
        title: typeof tieu_de === 'string' ? tieu_de.trim() : undefined,
        content: typeof noi_dung === 'string' ? noi_dung.trim() : undefined,
        courseId:
          khoa_hoc_id == null || khoa_hoc_id === ''
            ? undefined
            : typeof khoa_hoc_id === 'number' && Number.isInteger(khoa_hoc_id)
              ? khoa_hoc_id
              : undefined,
        updatedAt: new Date(),
      },
    });

    res.json({
      topic: {
        id: topic.id,
        nguoi_dung_id: topic.userId,
        tieu_de: topic.title,
        noi_dung: topic.content,
        khoa_hoc_id: topic.courseId,
        luot_xem: topic.viewCount,
        luot_tra_loi: topic.replyCount,
        ngay_tao: topic.createdAt.toISOString(),
        ngay_cap_nhat: topic.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.delete('/api/forum/topics/:id', async (req, res) => {
  const topicId = parseId(req.params.id);

  if (!topicId) {
    res.status(400).json({ error: 'Invalid topic id' });
    return;
  }

  try {
    await prisma.forumTopic.delete({ where: { id: topicId } });
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

app.delete('/api/forum/replies/:id', async (req, res) => {
  const replyId = parseId(req.params.id);

  if (!replyId) {
    res.status(400).json({ error: 'Invalid reply id' });
    return;
  }

  try {
    const reply = await prisma.forumReply.delete({ where: { id: replyId } });

    await prisma.forumTopic.update({
      where: { id: reply.topicId },
      data: {
        replyCount: {
          decrement: 1,
        },
        updatedAt: new Date(),
      },
    });

    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/quizzes/:id', async (req, res) => {
  const quizId = parseId(req.params.id);

  if (!quizId) {
    res.status(400).json({ error: 'Invalid quiz id' });
    return;
  }

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        lesson: {
          include: {
            chapter: {
              include: {
                course: {
                  select: { id: true, title: true },
                },
              },
            },
          },
        },
        questions: {
          orderBy: { id: 'asc' },
        },
      },
    });

    if (!quiz) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }

    res.json({
      quiz: {
        id: quiz.id,
        bai_hoc_id: quiz.lessonId,
        tieu_de: quiz.title,
        thoi_gian_lam: quiz.timeLimit,
        so_cau_hoi: quiz.questionCount,
        khoa_hoc: {
          id: quiz.lesson.chapter.course.id,
          tieu_de: quiz.lesson.chapter.course.title,
        },
        questions: quiz.questions.map((question) => ({
          id: question.id,
          quiz_id: question.quizId,
          cau_hoi: question.question,
          lua_chon: question.options,
          dap_an_dung: question.correctAnswer,
        })),
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/quizzes/:id/attempts', authenticate, async (req, res) => {
  const quizId = parseId(req.params.id);
  const { nguoi_dung_id, answers } = req.body as {
    nguoi_dung_id?: number;
    answers?: Array<{ questionId: number; answer: string }>;
  };

  const userId = Number(nguoi_dung_id);

  if (!quizId || !Number.isInteger(userId) || !Array.isArray(answers)) {
    res.status(400).json({ error: 'Invalid quiz attempt payload' });
    return;
  }

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        lesson: {
          include: {
            chapter: {
              include: {
                lessons: { orderBy: { id: 'asc' }, select: { id: true } },
                course: { select: { id: true } },
              },
            },
          },
        },
      },
    });

    if (!quiz) {
      res.status(404).json({ error: 'Quiz not found' });
      return;
    }

    // Phase 3: Quiz prerequisite - check previous lesson completed
    const lessonsInChapter = quiz.lesson.chapter.lessons;
    const currentLessonIndex = lessonsInChapter.findIndex(l => l.id === quiz.lessonId);

    if (currentLessonIndex > 0) {
      const previousLessonId = lessonsInChapter[currentLessonIndex - 1].id;
      const previousProgress = await prisma.progress.findUnique({
        where: { userId_lessonId: { userId, lessonId: previousLessonId } },
      });

      if (!previousProgress?.completed) {
        res.status(403).json({
          error: 'Bạn cần hoàn thành bài học trước để làm bài kiểm tra này',
          prerequisite: { lessonId: previousLessonId, message: 'Hoàn thành bài học liền trước' },
        });
        return;
      }
    }

    const questions = await prisma.quizQuestion.findMany({
      where: { quizId },
      select: { id: true, correctAnswer: true },
    });

    if (questions.length === 0) {
      res.status(404).json({ error: 'Quiz questions not found' });
      return;
    }

    const answerMap = new Map(answers.map((answer) => [answer.questionId, answer.answer]));
    const correctCount = questions.filter((question) => answerMap.get(question.id) === question.correctAnswer).length;
    const score = Number(((correctCount / questions.length) * 10).toFixed(2));

    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId,
        userId,
        score,
        answers: answers,
        takenAt: new Date(),
      },
    });

    res.status(201).json({
      attempt: {
        id: attempt.id,
        quiz_id: attempt.quizId,
        nguoi_dung_id: attempt.userId,
        diem: attempt.score,
        ngay_lam: attempt.takenAt.toISOString(),
      },
      result: {
        correct: correctCount,
        total: questions.length,
        score,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Review endpoint: get attempt details with questions and answers
app.get('/api/quizzes/attempts/:attemptId/review', async (req, res) => {
  const attemptId = parseId(req.params.attemptId);

  if (!attemptId) {
    res.status(400).json({ error: 'Invalid attempt id' });
    return;
  }

  try {
    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          include: {
            questions: { orderBy: { id: 'asc' } },
          },
        },
      },
    });

    if (!attempt) {
      res.status(404).json({ error: 'Attempt not found' });
      return;
    }

    const userAnswers = (attempt.answers as Array<{ questionId: number; answer: string }>) || [];
    const answerMap = new Map(userAnswers.map((a: any) => [a.questionId, a.answer]));

    res.json({
      attempt: {
        id: attempt.id,
        quiz_id: attempt.quizId,
        nguoi_dung_id: attempt.userId,
        diem: attempt.score,
        ngay_lam: attempt.takenAt.toISOString(),
      },
      questions: attempt.quiz.questions.map((q) => ({
        id: q.id,
        quiz_id: q.quizId,
        cau_hoi: q.question,
        lua_chon: q.options,
        dap_an_dung: q.correctAnswer,
        cau_tra_loi_cua_toi: answerMap.get(q.id) || null,
        dung_sai: answerMap.get(q.id) === q.correctAnswer,
      })),
    });
  } catch (error) {
    handleError(res, error);
  }
});

// Get latest quiz attempt for a user quiz
app.get('/api/quizzes/:quizId/attempts/latest', async (req, res) => {
  const quizId = parseId(req.params.quizId);
  const userId = req.query.userId ? Number(req.query.userId) : undefined;

  if (!quizId || !userId) {
    res.status(400).json({ error: 'Invalid params' });
    return;
  }

  try {
    const attempt = await prisma.quizAttempt.findFirst({
      where: { quizId, userId },
      orderBy: { takenAt: 'desc' },
    });

    if (!attempt) {
      res.json({ attempt: null });
      return;
    }

    res.json({
      attempt: {
        id: attempt.id,
        quiz_id: attempt.quizId,
        nguoi_dung_id: attempt.userId,
        diem: attempt.score,
        ngay_lam: attempt.takenAt.toISOString(),
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

// Get all quizzes with attempt status and scores (completed lesson quizzes)
app.get('/api/assignments/skipped-quizzes', async (req, res) => {
  const userId = parseOptionalId(req.query.userId);

  if (!userId) {
    res.status(400).json({ error: 'UserId required' });
    return;
  }

  try {
    // Find all lessons that have quizzes, where the user completed the lesson
    const completedLessons = await prisma.progress.findMany({
      where: { userId, completed: true },
      select: { lessonId: true },
    });

    const completedLessonIds = completedLessons.map((p) => p.lessonId);

    if (completedLessonIds.length === 0) {
      res.json({ quizzes: [] });
      return;
    }

    // Get quizzes in completed lessons
    const quizzes = await prisma.quiz.findMany({
      where: { lessonId: { in: completedLessonIds } },
      include: {
        lesson: {
          include: {
            chapter: {
              include: {
                course: { select: { id: true, title: true } },
              },
            },
          },
        },
      },
    });

    if (quizzes.length === 0) {
      res.json({ quizzes: [] });
      return;
    }

    // Get latest attempt per quiz for this user
    const quizIds = quizzes.map((q) => q.id);
    const attempts = await prisma.quizAttempt.findMany({
      where: { quizId: { in: quizIds }, userId },
      orderBy: { takenAt: 'desc' },
    });

    // Build a map of quizId -> latest attempt
    const latestAttemptMap = new Map<number, typeof attempts[0]>();
    for (const att of attempts) {
      if (!latestAttemptMap.has(att.quizId)) {
        latestAttemptMap.set(att.quizId, att);
      }
    }

    const result = quizzes.map((q) => {
      const latestAttempt = latestAttemptMap.get(q.id);
      const isAttempted = !!latestAttempt;
      return {
        id: q.id,
        tieu_de: q.title,
        so_cau_hoi: q.questionCount,
        thoi_gian_lam: q.timeLimit,
        bai_hoc_id: q.lessonId,
        ten_bai_hoc: q.lesson.title,
        khoa_hoc: {
          id: q.lesson.chapter.course.id,
          tieu_de: q.lesson.chapter.course.title,
        },
        trang_thai: isAttempted ? 'da_lam' : 'chua_lam',
        diem: latestAttempt ? latestAttempt.score : null,
        lan_lam_cuoi: latestAttempt ? latestAttempt.takenAt.toISOString() : null,
        so_lan_lam: attempts.filter(a => a.quizId === q.id).length,
      };
    });

    res.json({ quizzes: result });
  } catch (error) {
    handleError(res, error);
  }
});

// Get quiz scores for a course (for LearningPage)
app.get('/api/courses/:courseId/quiz-scores', async (req, res) => {
  const courseId = parseId(req.params.courseId);
  const userId = parseOptionalId(req.query.userId);

  if (!courseId || !userId) {
    res.status(400).json({ error: 'CourseId and userId required' });
    return;
  }

  try {
    // Get all quizzes in this course
    const quizzes = await prisma.quiz.findMany({
      where: {
        lesson: {
          chapter: { courseId },
        },
      },
      select: { id: true, lessonId: true, title: true, questionCount: true },
    });

    if (quizzes.length === 0) {
      res.json({ quiz_scores: [] });
      return;
    }

    // Get latest attempt for each quiz by this user
    const quizIds = quizzes.map(q => q.id);
    const attempts = await prisma.quizAttempt.findMany({
      where: { quizId: { in: quizIds }, userId },
      orderBy: { takenAt: 'desc' },
    });

    const latestAttemptMap = new Map<number, typeof attempts[0]>();
    const attemptCountMap = new Map<number, number>();
    for (const att of attempts) {
      if (!latestAttemptMap.has(att.quizId)) {
        latestAttemptMap.set(att.quizId, att);
      }
      attemptCountMap.set(att.quizId, (attemptCountMap.get(att.quizId) || 0) + 1);
    }

    res.json({
      quiz_scores: quizzes.map(q => {
        const latest = latestAttemptMap.get(q.id);
        return {
          quiz_id: q.id,
          bai_hoc_id: q.lessonId,
          tieu_de: q.title,
          so_cau_hoi: q.questionCount,
          trang_thai: latest ? 'da_lam' : 'chua_lam',
          diem: latest?.score ?? null,
          lan_lam_cuoi_id: latest?.id ?? null,
          so_lan_lam: attemptCountMap.get(q.id) || 0,
        };
      }),
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/assignments', async (req, res) => {
  const userId = parseOptionalId(req.query.userId);
  const courseId = parseOptionalId(req.query.courseId);

  try {
    const assignments = await prisma.assignment.findMany({
      where: {
        ...(courseId
          ? {
              lesson: {
                chapter: {
                  courseId,
                },
              },
            }
          : {}),
      },
      include: {
        lesson: {
          include: {
            chapter: {
              include: {
                course: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
        submissions: userId
          ? {
              where: { userId },
              select: {
                id: true,
                score: true,
                submittedAt: true,
              },
            }
          : false,
      },
      orderBy: { id: 'asc' },
    });

    res.json({
      assignments: assignments.map((assignment) => ({
        id: assignment.id,
        bai_hoc_id: assignment.lessonId,
        tieu_de: assignment.title,
        mo_ta: assignment.description,
        bat_buoc: assignment.isRequired,
        han_nop: assignment.dueAt?.toISOString() ?? null,
        khoa_hoc: {
          id: assignment.lesson.chapter.course.id,
          tieu_de: assignment.lesson.chapter.course.title,
        },
        status: assignment.submissions && assignment.submissions.length > 0 ? 'completed' : 'pending',
        submission: assignment.submissions?.[0]
          ? {
              id: assignment.submissions[0].id,
              diem: assignment.submissions[0].score,
              ngay_nop: assignment.submissions[0].submittedAt.toISOString(),
            }
          : null,
      })),
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/assignments/:id/submissions', authenticate, async (req, res) => {
  const assignmentId = parseId(req.params.id);
  const { nguoi_dung_id, noi_dung, file_dinh_kem } = req.body as {
    nguoi_dung_id?: number;
    noi_dung?: string;
    file_dinh_kem?: string;
  };

  const userId = Number(nguoi_dung_id);
  const content = noi_dung?.trim();

  if (!assignmentId || !Number.isInteger(userId) || !content) {
    res.status(400).json({ error: 'Invalid assignment submission payload' });
    return;
  }


  try {
    const submission = await prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_userId: {
          assignmentId,
          userId,
        },
      },
      update: {
        content,
        attachmentUrl: typeof file_dinh_kem === 'string' ? file_dinh_kem : null,
        submittedAt: new Date(),
      },
      create: {
        assignmentId,
        userId,
        content,
        attachmentUrl: typeof file_dinh_kem === 'string' ? file_dinh_kem : null,
        submittedAt: new Date(),
        
      },
    });

    res.status(201).json({
      submission: {
        id: submission.id,
        bai_tap_id: submission.assignmentId,
        nguoi_dung_id: submission.userId,
        noi_dung: submission.content,
        file_dinh_kem: submission.attachmentUrl,
        diem: submission.score,
        nhan_xet: submission.feedback,
        ngay_nop: submission.submittedAt.toISOString(),
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/checkout', authenticate, async (req, res) => {
  const userId = req.user!.userId;

  try {
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { course: true },
    });

    if (cartItems.length === 0) {
      res.status(400).json({ error: 'Giỏ hàng trống' });
      return;
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.course.price, 0);

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: 'success',
        orderedAt: new Date(),
        items: {
          create: cartItems.map((item) => ({
            courseId: item.courseId,
            price: item.course.price,
          })),
        },
      },
    });

    const orderWithItems = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: { include: { course: { select: { id: true, title: true, imageUrl: true } } } },
      },
    });

    for (const item of cartItems) {
      await prisma.enrollment.upsert({
        where: { userId_courseId: { userId, courseId: item.courseId } },
        update: {},
        create: { userId, courseId: item.courseId, enrolledAt: new Date() },
      });

      await prisma.course.update({
        where: { id: item.courseId },
        data: { enrolledCount: { increment: 1 } },
      });
    }

    await prisma.cart.deleteMany({ where: { userId } });

    res.status(201).json({
      order: {
        id: orderWithItems!.id,
        nguoi_dung_id: orderWithItems!.userId,
        tong_tien: orderWithItems!.totalAmount,
        trang_thai: orderWithItems!.status,
        ngay_dat: orderWithItems!.orderedAt.toISOString(),
        items: orderWithItems!.items.map((item: any) => ({
          id: item.id,
          khoa_hoc_id: item.courseId,
          khoa_hoc: { id: item.course.id, tieu_de: item.course.title, hinh_anh: item.course.imageUrl },
          gia: item.price,
        })),
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/notifications/:userId', async (req, res) => {
  const userId = parseId(req.params.userId);

  if (!userId) {
    res.status(400).json({ error: 'Invalid user id' });
    return;
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      notifications: notifications.map((notification) => ({
        id: notification.id,
        nguoi_dung_id: notification.userId,
        tieu_de: notification.title,
        noi_dung: notification.content,
        loai: notification.type,
        da_doc: notification.isRead,
        ngay_tao: notification.createdAt.toISOString(),
        link: notification.link,
      })),
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.patch('/api/notifications/:id/read', async (req, res) => {
  const notificationId = parseId(req.params.id);

  if (!notificationId) {
    res.status(400).json({ error: 'Invalid notification id' });
    return;
  }

  try {
    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    res.json({
      notification: {
        id: notification.id,
        nguoi_dung_id: notification.userId,
        tieu_de: notification.title,
        noi_dung: notification.content,
        loai: notification.type,
        da_doc: notification.isRead,
        ngay_tao: notification.createdAt.toISOString(),
        link: notification.link,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.patch('/api/notifications/users/:userId/read-all', async (req, res) => {
  const userId = parseId(req.params.userId);

  if (!userId) {
    res.status(400).json({ error: 'Invalid user id' });
    return;
  }

  try {
    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    res.json({ updated: result.count });
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/cart', authenticate, async (req, res) => {
  try {
    const cartItems = await prisma.cart.findMany({
      where: {
        userId: req.user!.userId,
        
      },
      include: {
        course: {
          include: {
            instructor: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
            category: { select: { id: true, name: true } },
            chapters: {
              include: { lessons: { select: { id: true } } },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalAmount = cartItems.reduce((sum, item) => sum + item.course.price, 0);

    res.json({
      items: cartItems.map((item) => ({
        id: item.id,
        khoa_hoc_id: item.courseId,
        gia: item.course.price,
        khoa_hoc: {
          ...serializeCourse(item.course),
          so_chuong: item.course.chapters.length,
          tong_bai_hoc: item.course.chapters.reduce((s, ch) => s + ch.lessons.length, 0),
          giang_vien: item.course.instructor,
          danh_muc: item.course.category,
        },
        ngay_them: item.createdAt.toISOString(),
      })),
      tong_tien: totalAmount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/orders', authenticate, async (req, res) => {
  const userIdParam = parseOptionalId(req.query.userId);
  const startDate = typeof req.query.startDate === 'string' ? req.query.startDate : undefined;
  const endDate = typeof req.query.endDate === 'string' ? req.query.endDate : undefined;
  const isAdmin = req.user!.role === 'admin';

  const targetUserId: number | undefined = isAdmin ? (userIdParam ?? undefined) : req.user!.userId;

  try {
    const orders = await prisma.order.findMany({
      where: {
        
        ...(targetUserId ? { userId: targetUserId } : {}),
        ...(startDate || endDate
          ? {
              orderedAt: {
                ...(startDate ? { gte: new Date(startDate) } : {}),
                ...(endDate ? { lte: new Date(endDate) } : {}),
              },
            }
          : {}),
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true },
        },
        items: {
          include: {
            course: {
              select: { id: true, title: true },
            },
          },
        },
        payments: true,
      },
      orderBy: { orderedAt: 'desc' },
    });

    const totalRevenue = orders.filter((order) => order.status === 'success').reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({
      summary: {
        total_orders: orders.length,
        total_revenue: totalRevenue,
      },
      orders: orders.map((order) => ({
        id: order.id,
        nguoi_dung_id: order.userId,
        tong_tien: order.totalAmount,
        trang_thai: order.status,
        ngay_dat: order.orderedAt.toISOString(),
        user: {
          id: order.user.id,
          ten: order.user.firstName,
          ho: order.user.lastName,
        },
        items: order.items.map((item) => ({
          id: item.id,
          khoa_hoc_id: item.courseId,
          gia: item.price,
          khoa_hoc: {
            id: item.course.id,
            tieu_de: item.course.title,
          },
        })),
        payments: order.payments.map((payment) => ({
          id: payment.id,
          so_tien: payment.amount,
          trang_thai: payment.status,
          ngay_thanh_toan: payment.paidAt ? payment.paidAt.toISOString() : null,
          phuong_thuc: payment.method,
        })),
      })),
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/admin/overview', authenticate, async (_req, res) => {

  try {
    const [usersCount, coursesCount, orders, pendingCoursesCount] = await Promise.all([
      prisma.user.count({ where: {} }),
      prisma.course.count({ where: {} }),
      prisma.order.findMany({ where: {}, select: { totalAmount: true, status: true } }),
      prisma.course.count({ where: { status: 'pending' } }),
    ]);

    const revenue = orders.filter((order) => order.status === 'success').reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({
      overview: {
        users: usersCount,
        courses: coursesCount,
        revenue,
        pending_courses: pendingCoursesCount,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.patch('/api/courses/:id/status', authenticate, async (req, res) => {
  const courseId = parseId(req.params.id);
  const { trang_thai, ly_do } = req.body as { trang_thai?: string; ly_do?: string };
  const status = courseStatuses.find((value) => value === trang_thai);

  if (!courseId || !status) {
    res.status(400).json({ error: 'Invalid status payload' });
    return;
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    const isOwner = course.instructorId === req.user!.userId;
    const isAdmin = req.user!.role === 'admin';

    if (status === 'pending' && !isOwner) {
      res.status(403).json({ error: 'Only course owner can submit for approval' });
      return;
    }

    if (['approved', 'rejected'].includes(status) && !isAdmin) {
      res.status(403).json({ error: 'Only admin can approve/reject courses' });
      return;
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: { status },
      include: {
        instructor: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        category: { select: { id: true, name: true } },
      },
    });

    const title = status === 'approved' ? 'Khóa học đã được phê duyệt' : 'Khóa học bị từ chối';

      await prisma.notification.create({
        data: {
          userId: course.instructorId,
          title,
          content: status === 'rejected' && ly_do ? `Lý do: ${ly_do}` : `Khóa học "${course.title}" đã ${status === 'approved' ? 'được phê duyệt' : 'bị từ chối'}.`,
          type: status === 'approved' ? 'success' : 'warning',
          createdAt: new Date(),
        },
      });

    res.json({ course: serializeCourse(updatedCourse) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/courses/:id/submit', authenticate, async (req, res) => {
  const courseId = parseId(req.params.id);

  if (!courseId) {
    res.status(400).json({ error: 'Invalid course id' });
    return;
  }

  try {
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: req.user!.userId,
      },
      include: {
        chapters: {
          include: { lessons: true },
        },
      },
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    if (course.status !== 'draft') {
      res.status(400).json({ error: 'Only draft courses can be submitted' });
      return;
    }

    if (course.chapters.length === 0) {
      res.status(400).json({ error: 'Course must have at least one chapter' });
      return;
    }

    const totalLessons = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
    if (totalLessons === 0) {
      res.status(400).json({ error: 'Course must have at least one lesson' });
      return;
    }

    await prisma.course.update({
      where: { id: courseId },
      data: { status: 'pending' },
    });

    const pendingCount = await prisma.course.count({
    });

    const adminUsers = await prisma.user.findMany({
      select: { id: true },
    });

    for (const admin of adminUsers) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          title: 'Khóa học mới chờ duyệt',
          content: `Khóa học "${course.title}" đang chờ bạn phê duyệt.`,
          type: 'info',
          link: `/admin/courses?status=pending`,
          createdAt: new Date(),
        },
      });
    }

    res.json({
      message: 'Course submitted for approval',
      pending_count: pendingCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/courses/:id/status', authenticate, async (req, res) => {
  const courseId = parseId(req.params.id);

  if (!courseId) {
    res.status(400).json({ error: 'Invalid course id' });
    return;
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        status: true,
        instructorId: true,
      },
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    res.json({ status: course.status, is_owner: course.instructorId === req.user?.userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/courses', authenticate, async (req, res) => {
  const statusParam = typeof req.query.status === 'string' ? req.query.status : undefined;
  const status = courseStatuses.find((value) => value === statusParam);

  try {
    const courses = await prisma.course.findMany({
      where: {
        ...(status ? { status } : {}),
      },
      include: {
        instructor: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
        category: { select: { id: true, name: true } },
        chapters: {
          include: { lessons: { select: { id: true } } },
        },
      },
      orderBy: { id: 'desc' },
    });

    res.json({
      courses: courses.map((course) => ({
        ...serializeCourse(course),
        so_chuong: course.chapters.length,
        tong_bai_hoc: course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0),
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/pending-courses', authenticate, async (_req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        status: 'pending',
      },
      include: {
        instructor: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
        category: { select: { id: true, name: true } },
        chapters: {
          include: { lessons: { select: { id: true } } },
        },
      },
      orderBy: { id: 'desc' },
    });

    res.json({
      courses: courses.map((course) => ({
        ...serializeCourse(course),
        so_chuong: course.chapters.length,
        tong_bai_hoc: course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0),
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/instructors', async (_req, res) => {
  try {
    const instructors = await prisma.user.findMany({
      where: { role: 'giang_vien' },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        bio: true,
        joinedAt: true,
      },
    });

    res.json({
      giang_viens: instructors.map((i) => ({
        id: i.id,
        ten_dang_nhap: i.username,
        email: i.email,
        ten: i.firstName,
        ho: i.lastName,
        anh_dai_dien: i.avatarUrl,
        gioi_thieu: i.bio,
        ngay_tham_gia: i.joinedAt.toISOString(),
      })),
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/instructors/:id/students', async (req, res) => {
  const instructorId = parseId(req.params.id);

  if (!instructorId) {
    res.status(400).json({ error: 'Invalid instructor id' });
    return;
  }

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        course: { instructorId },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            joinedAt: true,
          },
        },
        course: {
          select: { id: true, title: true },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    const studentMap = new Map<number, {
      id: number;
      ten_dang_nhap: string;
      email: string;
      ten: string;
      ho: string;
      anh_dai_dien: string | null;
      ngay_tham_gia: string;
      khoa_hoc: Array<{ id: number; tieu_de: string; ngay_dang_ky: string }>;
    }>();

    for (const e of enrollments) {
      if (!studentMap.has(e.user.id)) {
        studentMap.set(e.user.id, {
          id: e.user.id,
          ten_dang_nhap: e.user.username,
          email: e.user.email,
          ten: e.user.firstName,
          ho: e.user.lastName,
          anh_dai_dien: e.user.avatarUrl,
          ngay_tham_gia: e.user.joinedAt.toISOString(),
          khoa_hoc: [],
        });
      }
      studentMap.get(e.user.id)!.khoa_hoc.push({
        id: e.course.id,
        tieu_de: e.course.title,
        ngay_dang_ky: e.enrolledAt.toISOString(),
      });
    }

    res.json({ hoc_vien: Array.from(studentMap.values()) });
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/instructors/:id/analytics', async (req, res) => {
  const instructorId = parseId(req.params.id);

  if (!instructorId) {
    res.status(400).json({ error: 'Invalid instructor id' });
    return;
  }

  try {
    const courses = await prisma.course.findMany({
      where: { instructorId },
      select: {
        id: true,
        title: true,
        enrolledCount: true,
        price: true,
      },
    });

    const courseIds = courses.map((c) => c.id);

const [orders, recentEnrollments] = await Promise.all([
      prisma.order.findMany({
        where: {
          status: 'success',
          items: { some: { courseId: { in: courseIds } } },
        },
        select: { totalAmount: true, orderedAt: true },
      }),
      prisma.enrollment.findMany({
        where: { course: { instructorId } },
        include: {
          course: { select: { title: true } },
          user: { select: { firstName: true, lastName: true } },
        },
        orderBy: { enrolledAt: 'desc' },
        take: 10,
      }),
    ]);

    const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalStudents = courses.reduce((sum, c) => sum + c.enrolledCount, 0);

    res.json({
      tong_doanh_thu: revenue,
      tong_hoc_vien: totalStudents,
      so_khoa_hoc: courses.length,
      khoa_hoc: courses.map((c) => ({
        id: c.id,
        tieu_de: c.title,
        so_luong_da_dang_ky: c.enrolledCount,
        gia: c.price,
        doanh_thu: c.enrolledCount * c.price,
      })),
      dang_ky_gan_day: recentEnrollments.map((e) => ({
        ho_ten: `${e.user.firstName} ${e.user.lastName}`.trim(),
        khoa_hoc: e.course.title,
        ngay_dang_ky: e.enrolledAt.toISOString(),
      })),
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/analytics', async (_req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalUsers, totalCourses, pendingCourses, approvedCourses, totalOrders, recentOrders] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.course.count({ where: { status: 'pending' } }),
      prisma.course.count({ where: { status: 'approved' } }),
      prisma.order.count(),
      prisma.order.findMany({
        where: { orderedAt: { gte: thirtyDaysAgo } },
        select: { totalAmount: true, status: true, orderedAt: true },
        orderBy: { orderedAt: 'asc' },
      }),
    ]);

    const revenueByDay = new Map<string, number>();
    let totalRevenue = 0;

    for (const o of recentOrders) {
      if (o.status === 'success') {
        totalRevenue += o.totalAmount;
        const day = o.orderedAt.toISOString().split('T')[0];
        revenueByDay.set(day, (revenueByDay.get(day) || 0) + o.totalAmount);
      }
    }

    const chartData = Array.from(revenueByDay.entries()).map(([ngay, doanh_thu]) => ({
      ngay,
      doanh_thu,
    }));

    res.json({
      tong_nguoi_dung: totalUsers,
      tong_khoa_hoc: totalCourses,
      khoa_chờ_duyệt: pendingCourses,
      khoa_da_duyet: approvedCourses,
      tong_don_hang: totalOrders,
      tong_doanh_thu: totalRevenue,
      bieu_do_doanh_thu: chartData,
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.patch('/api/orders/:id/refund', authenticate, async (req, res) => {
  const orderId = parseId(req.params.id);

  if (!orderId) {
    res.status(400).json({ error: 'Invalid order id' });
    return;
  }

  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
        items: { include: { course: { select: { id: true, title: true } } } },
        payments: true,
      },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const isOwner = order.userId === req.user!.userId;
    const isAdmin = req.user!.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'refunded' },
      include: {
        items: { include: { course: { select: { id: true, title: true } } } },
      },
    });

    for (const item of order.items) {
      await prisma.enrollment.deleteMany({
        where: { userId: order.userId, courseId: item.courseId },
      });

      await prisma.course.update({
        where: { id: item.courseId },
        data: { enrolledCount: { decrement: 1 } },
      });
    }

    res.json({
      don_hang: {
        id: updatedOrder.id,
        nguoi_dung_id: updatedOrder.userId,
        tong_tien: updatedOrder.totalAmount,
        trang_thai: updatedOrder.status,
        ngay_dat: updatedOrder.orderedAt.toISOString(),
        items: updatedOrder.items.map((item) => ({
          id: item.id,
          khoa_hoc_id: item.courseId,
          khoa_hoc: { id: item.course.id, tieu_de: item.course.title },
        })),
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/quizzes/:id/questions', async (req, res) => {
  const quizId = parseId(req.params.id);

  if (!quizId) {
    res.status(400).json({ error: 'Invalid quiz id' });
    return;
  }

  try {
    const questions = await prisma.quizQuestion.findMany({
      where: { quizId },
      orderBy: { id: 'asc' },
    });

    res.json({
      cau_hoi: questions.map((q) => ({
        id: q.id,
        quiz_id: q.quizId,
        cau_hoi: q.question,
        lua_chon: q.options,
        dap_an_dung: q.correctAnswer,
      })),
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/quizzes/:id/questions', authenticate, async (req, res) => {
  const quizId = parseId(req.params.id);
  const { cau_hoi, lua_chon, dap_an_dung } = req.body as {
    cau_hoi?: string;
    lua_chon?: string[];
    dap_an_dung?: string;
  };

  const question = cau_hoi?.trim();
  const options = Array.isArray(lua_chon) ? lua_chon : [];
  const correctAnswer = dap_an_dung?.trim();

  if (!quizId || !question || options.length === 0 || !correctAnswer) {
    res.status(400).json({ error: 'Invalid question payload' });
    return;
  }


  try {
    const newQuestion = await prisma.quizQuestion.create({
      data: {
        quizId,
        question,
        options,
        correctAnswer,
        
      },
    });

    await prisma.quiz.update({
      where: { id: quizId },
      data: { questionCount: { increment: 1 } },
    });

    res.status(201).json({
      cau_hoi: {
        id: newQuestion.id,
        quiz_id: newQuestion.quizId,
        cau_hoi: newQuestion.question,
        lua_chon: newQuestion.options,
        dap_an_dung: newQuestion.correctAnswer,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/quizzes/:quizId/questions/:questionId', async (req, res) => {
  const questionId = parseId(req.params.questionId);
  const { cau_hoi, lua_chon, dap_an_dung } = req.body as Record<string, unknown>;

  if (!questionId) {
    res.status(400).json({ error: 'Invalid question id' });
    return;
  }

  try {
    const question = await prisma.quizQuestion.update({
      where: { id: questionId },
      data: {
        question: typeof cau_hoi === 'string' ? cau_hoi.trim() : undefined,
        options: Array.isArray(lua_chon) ? lua_chon : undefined,
        correctAnswer: typeof dap_an_dung === 'string' ? dap_an_dung.trim() : undefined,
      },
    });

    res.json({
      cau_hoi: {
        id: question.id,
        quiz_id: question.quizId,
        cau_hoi: question.question,
        lua_chon: question.options,
        dap_an_dung: question.correctAnswer,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.delete('/api/quizzes/:quizId/questions/:questionId', async (req, res) => {
  const questionId = parseId(req.params.questionId);
  const quizId = parseId(req.params.quizId);

  if (!questionId || !quizId) {
    res.status(400).json({ error: 'Invalid ids' });
    return;
  }

  try {
    await prisma.quizQuestion.delete({ where: { id: questionId } });

    await prisma.quiz.update({
      where: { id: quizId },
      data: { questionCount: { decrement: 1 } },
    });

    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

app.patch('/api/quizzes/:id/attempts/:attemptId/grade', async (req, res) => {
  const attemptId = parseId(req.params.attemptId);
  const { diem, nhan_xet } = req.body as { diem?: number; nhan_xet?: string };
  const score = typeof diem === 'number' ? diem : undefined;
  const feedback = typeof nhan_xet === 'string' ? nhan_xet.trim() : undefined;

  if (!attemptId || typeof score !== 'number') {
    res.status(400).json({ error: 'Invalid grade payload' });
    return;
  }

  try {
    const attempt = await prisma.quizAttempt.update({
      where: { id: attemptId },
      data: { score, feedback: feedback ?? null },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
        quiz: { select: { id: true, title: true } },
      },
    });

    res.json({
      ket_qua: {
        id: attempt.id,
        quiz_id: attempt.quizId,
        nguoi_dung_id: attempt.userId,
        diem: attempt.score,
        nhan_xet: attempt.feedback,
        ngay_lam: attempt.takenAt.toISOString(),
        user: {
          id: attempt.user.id,
          ten: attempt.user.firstName,
          ho: attempt.user.lastName,
        },
        quiz: {
          id: attempt.quiz.id,
          tieu_de: attempt.quiz.title,
        },
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
