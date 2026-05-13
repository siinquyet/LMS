import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

import { sendNotification, sendNotificationBatch } from '../utils/notificationService.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const prisma = new PrismaClient();
const router = Router();

const courseStatuses = ['draft', 'completed', 'pending', 'published', 'rejected'] as const;

const serializeCourse = (course: {
  id: number;
  title: string;
  instructorId: number;
  categoryId: number;
  price: number;
  enrolledCount: number;
  status: string;
  description: string | null;
  requirements: string[] | unknown;
  imageUrl: string | null;
  level: string | null;
  duration: string | null;
  lessonCount: number | null;
  rating: number | null;
  learningOutcomes: string[] | unknown;
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
  requirements: (course.requirements as string[]) || [],
  what_you_learn: (course.learningOutcomes as string[]) || [],
});

router.get('/', asyncHandler(async (req, res) => {
  const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
  const instructorId = req.query.instructorId ? Number(req.query.instructorId) : undefined;
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
  const level = typeof req.query.level === 'string' ? req.query.level : undefined;
  const sortBy = typeof req.query.sortBy === 'string' ? req.query.sortBy : undefined;
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 12;

  const userId = req.headers['x-user-id'] ? Number(req.headers['x-user-id']) : undefined;

  const where: any = {
    status: 'completed',
    ...(categoryId ? { categoryId } : {}),
    ...(instructorId ? { instructorId } : {}),
    ...(search ? { OR: [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }] } : {}),
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
      include: { instructor: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } }, category: { select: { id: true, name: true } } },
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
}));

router.get('/:id/reviews', asyncHandler(async (req, res) => {
  const courseId = Number(req.params.id);
  if (!courseId) { res.status(400).json({ error: 'Invalid course id' }); return; }

  const reviews = await prisma.review.findMany({
    where: { courseId, status: 'published' },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const reviewsWithUser = reviews.map((review) => ({
    id: review.id,
    nguoi_dung_id: review.userId,
    danh_gia: review.rating,
    binh_luan: review.comment,
    ngay_tao: review.createdAt.toISOString(),
    nguoi_dung: {
      id: review.user.id,
      ten: review.user.firstName,
      ho: review.user.lastName,
      anh_dai_dien: review.user.avatarUrl,
    },
  }));

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  res.json({
    danh_gia: reviewsWithUser,
    thong_tin: {
      trung_binh_xep_hang: Math.round(averageRating * 10) / 10,
      tong_danh_gia: reviews.length,
    },
  });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const courseId = Number(req.params.id);
  if (!courseId) { res.status(400).json({ error: 'Invalid course id' }); return; }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: {
        select: { id: true, firstName: true, lastName: true, avatarUrl: true, bio: true },
      },
      category: {
        select: { id: true, name: true },
      },
      chapters: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { id: "asc" },
            include: {
              quizzes: {
                select: { id: true, title: true, timeLimit: true, questionCount: true },
              },
              assignments: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  isRequired: true,
                  dueAt: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!course) { res.status(404).json({ error: 'Course not found' }); return; }

  res.json({
    course: {
      ...serializeCourse(course),
      giang_vien: course.instructor ? { id: course.instructor.id, ten: course.instructor.firstName, ho: course.instructor.lastName, anh_dai_dien: course.instructor.avatarUrl, gioi_thieu: course.instructor.bio } : undefined,
      chuong_hoc: course.chapters.map((ch) => ({
        id: ch.id, khoa_hoc_id: ch.courseId, tieu_de: ch.title, thu_tu: ch.order,
        bai_hoc: ch.lessons.map((ls) => ({
          id: ls.id, chuong_hoc_id: ls.chapterId, tieu_de: ls.title, video_url: ls.videoUrl, loai: ls.type, thoi_luong: ls.duration, noi_dung: ls.content,
          quizzes: ls.quizzes.map((q) => ({ id: q.id, tieu_de: q.title, thoi_gian_lam: q.timeLimit, so_cau_hoi: q.questionCount })),
          assignments: ls.assignments.map((a) => ({ id: a.id, tieu_de: a.title, mo_ta: a.description, bat_buoc: a.isRequired, han_nop: a.dueAt?.toISOString() ?? null })),
        })),
      })),
    },
  });
}));

router.post('/', authenticate, asyncHandler(async (req, res) => {
  const { tieu_de, danh_muc_id, gia, trang_thai, mo_ta, hinh_anh, muc_do, thoi_luong, requirements, what_you_learn } = req.body as {
    tieu_de?: string;
    danh_muc_id?: number;
    gia?: number;
    trang_thai?: string;
    mo_ta?: string;
    hinh_anh?: string;
    muc_do?: string;
    thoi_luong?: string;
    requirements?: string[];
    what_you_learn?: string[];
  };

  const title = typeof tieu_de === 'string' ? tieu_de.trim() : '';
  const categoryId = Number(danh_muc_id);
  const price = Number(gia);
  const status = courseStatuses.find((v) => v === trang_thai) ?? 'draft';

  if (!title || !Number.isInteger(categoryId) || Number.isNaN(price)) {
    res.status(400).json({ error: 'Invalid course payload' });
    return;
  }

  const course = await prisma.course.create({
    data: {
      title,
      instructorId: req.user!.userId,
      categoryId,
      price,
      enrolledCount: 0,
      status,
      description: typeof mo_ta === 'string' ? mo_ta : null,
      
      imageUrl: typeof hinh_anh === 'string' ? hinh_anh : null,
      level: typeof muc_do === 'string' ? muc_do : null,
      duration: typeof thoi_luong === 'string' ? thoi_luong : null,
      requirements: Array.isArray(requirements) ? requirements : [],
      learningOutcomes: Array.isArray(what_you_learn) ? what_you_learn : [],
    },
    include: { instructor: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } }, category: { select: { id: true, name: true } } },
  });

  res.status(201).json({ course: serializeCourse(course) });
}));

router.patch('/:id', authenticate, asyncHandler(async (req, res) => {
  const courseId = Number(req.params.id);
  const { tieu_de, giang_vien_id, danh_muc_id, gia, trang_thai, mo_ta, hinh_anh, muc_do, thoi_luong, requirements, what_you_learn } = req.body as {
    tieu_de?: string;
    giang_vien_id?: number;
    danh_muc_id?: number;
    gia?: number;
    trang_thai?: string;
    mo_ta?: string;
    hinh_anh?: string;
    muc_do?: string;
    thoi_luong?: string;
    requirements?: string[];
    what_you_learn?: string[];
  };

  const course = await prisma.course.update({
    where: { id: courseId },
    data: {
      title: typeof tieu_de === 'string' ? tieu_de.trim() : undefined,
      instructorId: Number.isInteger(giang_vien_id) ? Number(giang_vien_id) : undefined,
      categoryId: Number.isInteger(danh_muc_id) ? Number(danh_muc_id) : undefined,
      price: typeof gia === 'number' ? gia : undefined,
      status: courseStatuses.find((v) => v === trang_thai) ?? undefined,
      description: typeof mo_ta === 'string' ? mo_ta : undefined,
      
      imageUrl: typeof hinh_anh === 'string' ? hinh_anh : undefined,
      level: typeof muc_do === 'string' ? muc_do : undefined,
      duration: typeof thoi_luong === 'string' ? thoi_luong : undefined,
      requirements: Array.isArray(requirements) ? requirements : undefined,
      learningOutcomes: Array.isArray(what_you_learn) ? what_you_learn : undefined,
    },
    include: { instructor: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } }, category: { select: { id: true, name: true } } },
  });

  res.json({ course: serializeCourse(course) });
}));

router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  const courseId = Number(req.params.id);
  if (!courseId) { res.status(400).json({ error: 'Invalid course id' }); return; }
  await prisma.course.delete({ where: { id: courseId } });
  res.status(204).send();
}));

router.post('/:id/chapters', authenticate, asyncHandler(async (req, res, next) => {
  const courseId = Number(req.params.id);
  const { tieu_de, thu_tu } = req.body as { tieu_de?: string; thu_tu?: number };

  if (!courseId || !tieu_de?.trim()) { next(new AppError('Invalid chapter payload', 400)); return; }

  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { instructorId: true } });
  if (!course) { res.status(404).json({ error: 'Course not found' }); return; }

  const chapter = await prisma.chapter.create({
    data: { courseId, title: tieu_de.trim(), order: typeof thu_tu === 'number' && Number.isInteger(thu_tu) ? thu_tu : 1 } as any,
  });

  res.status(201).json({ chapter: { id: chapter.id, khoa_hoc_id: chapter.courseId, tieu_de: chapter.title, thu_tu: chapter.order } });
}));

router.patch('/:id/chapters/reorder', authenticate, asyncHandler(async (req, res, next) => {
  const courseId = Number(req.params.id);
  const { chapterIds } = req.body as { chapterIds?: number[] };

  if (!courseId || !Array.isArray(chapterIds)) { next(new AppError('Invalid reorder payload', 400)); return; }

  const course = await prisma.course.findFirst({ where: { id: courseId, instructorId: req.user!.userId } });
  if (!course) { res.status(404).json({ error: 'Course not found' }); return; }

  await prisma.$transaction(chapterIds.map((id, index) => prisma.chapter.update({ where: { id }, data: { order: index + 1 } })));
  res.json({ message: 'Chapters reordered successfully' });
}));

router.patch('/:id/status', authenticate, asyncHandler(async (req, res, next) => {
  const courseId = Number(req.params.id);
  const { trang_thai, ly_do } = req.body as { trang_thai?: string; ly_do?: string };
  const status = courseStatuses.find((v) => v === trang_thai);

  if (!courseId || !status) { next(new AppError('Invalid status payload', 400)); return; }

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) { res.status(404).json({ error: 'Course not found' }); return; }

  const isOwner = course.instructorId === req.user!.userId;
  const isAdmin = req.user!.role === 'admin';

  if (status === 'pending' && !isOwner) { res.status(403).json({ error: 'Only course owner can submit for approval' }); return; }
if (['published', 'rejected'].includes(status) && !isAdmin) { res.status(403).json({ error: 'Only admin can publish/reject courses' }); return; }

    const event = status === 'published' ? 'course_published' : 'course_rejected';
  await sendNotification({
    userId: course.instructorId,
    event,
    data: { courseTitle: course.title, courseId, reason: ly_do },
  });

  res.json({ course: serializeCourse(course) });
}));

router.post('/:id/submit', authenticate, asyncHandler(async (req, res, next) => {
  const courseId = Number(req.params.id);
  if (!courseId) { next(new AppError('Invalid course id', 400)); return; }

  const course = await prisma.course.findFirst({
    where: { id: courseId, instructorId: req.user!.userId },
    include: { chapters: { include: { lessons: true } } },
  });

  if (!course) { res.status(404).json({ error: 'Course not found' }); return; }
  if (course.status !== 'draft') { next(new AppError('Only draft courses can be submitted', 400)); return; }
  if (course.chapters.length === 0) { next(new AppError('Course must have at least one chapter', 400)); return; }

  const totalLessons = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
  if (totalLessons === 0) { next(new AppError('Course must have at least one lesson', 400)); return; }

  await prisma.course.update({ where: { id: courseId }, data: { status: 'pending' } });

  const adminUsers = await prisma.user.findMany({ where: { role: 'admin' }, select: { id: true } });
  await sendNotificationBatch(adminUsers, 'course_submitted', { courseTitle: course.title, courseId });

  res.json({ message: 'Course submitted for approval' });
}));

router.get('/:id/status', authenticate, asyncHandler(async (req, res) => {
  const courseId = Number(req.params.id);
  if (!courseId) { res.status(400).json({ error: 'Invalid course id' }); return; }

  const course = await prisma.course.findUnique({ where: { id: courseId }, select: { id: true, status: true, instructorId: true } });
  if (!course) { res.status(404).json({ error: 'Course not found' }); return; }
  res.json({ status: course.status, is_owner: course.instructorId === req.user?.userId });
}));

export default router;