import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const courseStatuses = ['draft', 'completed', 'pending', 'approved', 'rejected'] as const;
const lessonTypes = ['video', 'document', 'quiz', 'exercise'] as const;
const roles = ['hoc_vien', 'giang_vien', 'admin'] as const;

const PORT = process.env.PORT || 3001;

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

const splitFullName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return { firstName: '', lastName: '' };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }

  return {
    firstName: parts[parts.length - 1],
    lastName: parts.slice(0, -1).join(' '),
  };
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
  ngay_tham_gia: user.joinedAt.toISOString(),
  vai_tro: user.role,
});

const serializeCourse = (course: {
  id: number;
  title: string;
  instructorId: number;
  categoryId: number;
  price: number;
  maxStudents: number | null;
  enrolledCount: number;
  status: string;
  description: string | null;
  thumbnailUrl: string | null;
  imageUrl: string | null;
  level: string | null;
  duration: string | null;
  lessonCount: number | null;
  rating: number | null;
  requirements: unknown;
  learningOutcomes: unknown;
  instructor?: { id: number; firstName: string; lastName: string; avatarUrl: string | null };
  category?: { id: number; name: string };
}) => ({
  id: course.id,
  tieu_de: course.title,
  giang_vien_id: course.instructorId,
  danh_muc_id: course.categoryId,
  gia: course.price,
  so_luong_toi_da: course.maxStudents,
  so_luong_da_dang_ky: course.enrolledCount,
  trang_thai: course.status,
  mo_ta: course.description,
  thumbnail: course.thumbnailUrl,
  hinh_anh: course.imageUrl,
  muc_do: course.level,
  thoi_luong: course.duration,
  so_bai_hoc: course.lessonCount,
  xep_hang: course.rating,
  requirements: course.requirements,
  whatYouLearn: course.learningOutcomes,
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
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

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
      '/api/notifications/:userId',
      '/api/notifications/:id/read',
      '/api/notifications/users/:userId/read-all',
      '/api/orders',
      '/api/admin/overview',
      '/api/progress [PATCH]',
      '/api/quizzes/:id',
      '/api/quizzes/:id/attempts',
      '/api/assignments',
      '/api/assignments/:id/submissions',
    ],
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Backend running!' });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, username, password } = req.body as {
    email?: string;
    username?: string;
    password?: string;
  };

  const credential = (email ?? username ?? '').trim();

  if (!credential || !password) {
    res.status(400).json({ error: 'Email/username and password are required' });
    return;
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: credential }, { username: credential }],
      },
    });

    if (!user || user.password !== password) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    if (user.isLocked) {
      res.status(403).json({ error: 'User is locked' });
      return;
    }

    res.json({ user: serializeUser(user) });
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, username, role } = req.body as {
    name?: string;
    email?: string;
    password?: string;
    username?: string;
    role?: string;
  };

  const normalizedName = name?.trim() ?? '';
  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedUsername = username?.trim() || normalizedEmail?.split('@')[0] || '';
  const normalizedRole = roles.find((value) => value === role) ?? 'hoc_vien';

  if (!normalizedName || !normalizedEmail || !password) {
    res.status(400).json({ error: 'Name, email and password are required' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
    return;
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { username: normalizedUsername }],
      },
      select: { id: true },
    });

    if (existingUser) {
      res.status(409).json({ error: 'Email or username already exists' });
      return;
    }

    const { firstName, lastName } = splitFullName(normalizedName);

    const user = await prisma.user.create({
      data: {
        username: normalizedUsername,
        email: normalizedEmail,
        password,
        firstName,
        lastName,
        joinedAt: new Date(),
        role: normalizedRole,
      },
    });

    res.status(201).json({ user: serializeUser(user) });
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/users', async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: 'asc' },
    });

    res.json({ users: users.map(serializeUser) });
  } catch (error) {
    handleError(res, error);
  }
});

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

app.post('/api/categories', async (req, res) => {
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
    handleError(res, error);
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
    const statusParam = typeof req.query.status === 'string' ? req.query.status : undefined;
    const status = courseStatuses.find((value) => value === statusParam);

    const courses = await prisma.course.findMany({
      where: {
        ...(categoryId ? { categoryId } : {}),
        ...(instructorId ? { instructorId } : {}),
        ...(status ? { status } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
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
      orderBy: { id: 'asc' },
    });

    res.json({ courses: courses.map(serializeCourse) });
  } catch (error) {
    handleError(res, error);
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

app.post('/api/lessons/:id/comments', async (req, res) => {
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

app.post('/api/courses', async (req, res) => {
  const {
    tieu_de,
    giang_vien_id,
    danh_muc_id,
    gia,
    so_luong_toi_da,
    trang_thai,
    mo_ta,
    thumbnail,
    hinh_anh,
    muc_do,
    thoi_luong,
    requirements,
    whatYouLearn,
  } = req.body as Record<string, unknown>;

  const title = typeof tieu_de === 'string' ? tieu_de.trim() : '';
  const instructorId = Number(giang_vien_id);
  const categoryId = Number(danh_muc_id);
  const price = Number(gia);
  const maxStudents = so_luong_toi_da == null || so_luong_toi_da === '' ? null : Number(so_luong_toi_da);
  const status = courseStatuses.find((value) => value === trang_thai) ?? 'draft';

  if (!title || !Number.isInteger(instructorId) || !Number.isInteger(categoryId) || Number.isNaN(price)) {
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
        maxStudents: typeof maxStudents === 'number' && !Number.isNaN(maxStudents) ? maxStudents : null,
        enrolledCount: 0,
        status,
        description: typeof mo_ta === 'string' ? mo_ta : null,
        thumbnailUrl: typeof thumbnail === 'string' ? thumbnail : null,
        imageUrl: typeof hinh_anh === 'string' ? hinh_anh : null,
        level: typeof muc_do === 'string' ? muc_do : null,
        duration: typeof thoi_luong === 'string' ? thoi_luong : null,
        requirements: Array.isArray(requirements) ? requirements : undefined,
        learningOutcomes: Array.isArray(whatYouLearn) ? whatYouLearn : undefined,
      },
      include: {
        instructor: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        category: { select: { id: true, name: true } },
      },
    });

    res.status(201).json({ course: serializeCourse(course) });
  } catch (error) {
    handleError(res, error);
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
    so_luong_toi_da,
    trang_thai,
    mo_ta,
    thumbnail,
    hinh_anh,
    muc_do,
    thoi_luong,
    requirements,
    whatYouLearn,
  } = req.body as Record<string, unknown>;

  try {
    const course = await prisma.course.update({
      where: { id: courseId },
      data: {
        title: typeof tieu_de === 'string' ? tieu_de.trim() : undefined,
        instructorId: Number.isInteger(giang_vien_id) ? Number(giang_vien_id) : undefined,
        categoryId: Number.isInteger(danh_muc_id) ? Number(danh_muc_id) : undefined,
        price: typeof gia === 'number' ? gia : undefined,
        maxStudents:
          so_luong_toi_da == null || so_luong_toi_da === ''
            ? undefined
            : typeof so_luong_toi_da === 'number'
              ? so_luong_toi_da
              : undefined,
        status: courseStatuses.find((value) => value === trang_thai) ?? undefined,
        description: typeof mo_ta === 'string' ? mo_ta : undefined,
        thumbnailUrl: typeof thumbnail === 'string' ? thumbnail : undefined,
        imageUrl: typeof hinh_anh === 'string' ? hinh_anh : undefined,
        level: typeof muc_do === 'string' ? muc_do : undefined,
        duration: typeof thoi_luong === 'string' ? thoi_luong : undefined,
        requirements: Array.isArray(requirements) ? requirements : undefined,
        learningOutcomes: Array.isArray(whatYouLearn) ? whatYouLearn : undefined,
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

app.post('/api/courses/:id/chapters', async (req, res) => {
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
    handleError(res, error);
  }
});

app.patch('/api/chapters/:id', async (req, res) => {
  const chapterId = parseId(req.params.id);
  const { tieu_de, thu_tu } = req.body as { tieu_de?: string; thu_tu?: number };

  if (!chapterId) {
    res.status(400).json({ error: 'Invalid chapter id' });
    return;
  }

  try {
    const chapter = await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        title: typeof tieu_de === 'string' ? tieu_de.trim() : undefined,
        order: typeof thu_tu === 'number' && Number.isInteger(thu_tu) ? thu_tu : undefined,
      },
    });

    res.json({
      chapter: {
        id: chapter.id,
        khoa_hoc_id: chapter.courseId,
        tieu_de: chapter.title,
        thu_tu: chapter.order,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.delete('/api/chapters/:id', async (req, res) => {
  const chapterId = parseId(req.params.id);

  if (!chapterId) {
    res.status(400).json({ error: 'Invalid chapter id' });
    return;
  }

  try {
    await prisma.chapter.delete({ where: { id: chapterId } });
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/chapters/:id/lessons', async (req, res) => {
  const chapterId = parseId(req.params.id);
  const { tieu_de, video_url, loai, thoi_luong, noi_dung } = req.body as Record<string, unknown>;
  const title = typeof tieu_de === 'string' ? tieu_de.trim() : '';
  const type = lessonTypes.find((value) => value === loai) ?? 'video';

  if (!chapterId || !title) {
    res.status(400).json({ error: 'Invalid lesson payload' });
    return;
  }

  try {
    const lesson = await prisma.lesson.create({
      data: {
        chapterId,
        title,
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
        video_url: lesson.videoUrl,
        loai: lesson.type,
        thoi_luong: lesson.duration,
        noi_dung: lesson.content,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.patch('/api/lessons/:id', async (req, res) => {
  const lessonId = parseId(req.params.id);
  const { tieu_de, video_url, loai, thoi_luong, noi_dung } = req.body as Record<string, unknown>;

  if (!lessonId) {
    res.status(400).json({ error: 'Invalid lesson id' });
    return;
  }

  try {
    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: typeof tieu_de === 'string' ? tieu_de.trim() : undefined,
        videoUrl: typeof video_url === 'string' ? video_url : undefined,
        type: lessonTypes.find((value) => value === loai) ?? undefined,
        duration: typeof thoi_luong === 'string' ? thoi_luong : undefined,
        content: typeof noi_dung === 'string' ? noi_dung : undefined,
      },
    });

    res.json({
      lesson: {
        id: lesson.id,
        chuong_hoc_id: lesson.chapterId,
        tieu_de: lesson.title,
        video_url: lesson.videoUrl,
        loai: lesson.type,
        thoi_luong: lesson.duration,
        noi_dung: lesson.content,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.delete('/api/lessons/:id', async (req, res) => {
  const lessonId = parseId(req.params.id);

  if (!lessonId) {
    res.status(400).json({ error: 'Invalid lesson id' });
    return;
  }

  try {
    await prisma.lesson.delete({ where: { id: lessonId } });
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
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

app.patch('/api/progress', async (req, res) => {
  const { nguoi_dung_id, bai_hoc_id, da_hoan_thanh } = req.body as {
    nguoi_dung_id?: number;
    bai_hoc_id?: number;
    da_hoan_thanh?: boolean;
  };

  const userId = Number(nguoi_dung_id);
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

    res.json({
      progress: {
        nguoi_dung_id: progress.userId,
        bai_hoc_id: progress.lessonId,
        da_hoan_thanh: progress.completed,
        ngay_hoan_thanh: progress.completedAt?.toISOString() ?? null,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/enrollments', async (req, res) => {
  const { nguoi_dung_id, khoa_hoc_id } = req.body as { nguoi_dung_id?: number; khoa_hoc_id?: number };
  const userId = Number(nguoi_dung_id);
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

app.post('/api/forum/topics', async (req, res) => {
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
    handleError(res, error);
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

app.post('/api/forum/topics/:id/replies', async (req, res) => {
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
    handleError(res, error);
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

app.post('/api/quizzes/:id/attempts', async (req, res) => {
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

app.post('/api/assignments/:id/submissions', async (req, res) => {
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

app.get('/api/orders', async (req, res) => {
  const userId = parseOptionalId(req.query.userId);
  const startDate = typeof req.query.startDate === 'string' ? req.query.startDate : undefined;
  const endDate = typeof req.query.endDate === 'string' ? req.query.endDate : undefined;

  try {
    const orders = await prisma.order.findMany({
      where: {
        ...(userId ? { userId } : {}),
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
          ngay_thanh_toan: payment.paidAt.toISOString(),
          phuong_thuc: payment.method,
        })),
      })),
    });
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/admin/overview', async (_req, res) => {
  try {
    const [usersCount, coursesCount, orders, pendingCoursesCount] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.order.findMany({ select: { totalAmount: true, status: true } }),
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

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
