import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const prisma = new PrismaClient();
const router = Router();
const lessonTypes = ['video', 'document', 'quiz', 'exercise'] as const;

router.get('/lessons/:id', asyncHandler(async (req, res) => {
  const lessonId = Number(req.params.id);

  if (!lessonId) { res.status(400).json({ error: 'Invalid lesson id' }); return; }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      chapter: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              instructorId: true,
            },
          },
        },
      },
      quizzes: {
        select: {
          id: true,
          title: true,
          timeLimit: true,
          questionCount: true,
        },
      },
    },
  });

  if (!lesson) { res.status(404).json({ error: 'Lesson not found' }); return; }

  res.json({
    lesson: {
      id: lesson.id,
      chuong_hoc_id: lesson.chapterId,
      tieu_de: lesson.title,
      thu_tu: lesson.order,
      video_url: lesson.videoUrl,
      loai: lesson.type,
      thoi_luong: lesson.duration,
      mo_ta: lesson.content,
      khoa_hoc_id: lesson.chapter.courseId,
      so_cau_hoi: lesson.quizzes?.[0]?.questionCount || 5,
      thoi_gian: lesson.quizzes?.[0]?.timeLimit ? `${lesson.quizzes[0].timeLimit} phút` : "10 phút",
    },
  });
}));

router.post('/chapters/:id/lessons', authenticate, asyncHandler(async (req, res, next) => {
  const chapterId = Number(req.params.id);
  const { tieu_de, video_url, loai, thoi_luong, noi_dung } = req.body as Record<string, unknown>;

  const title = typeof tieu_de === 'string' ? tieu_de.trim() : '';
  const type = lessonTypes.find((v) => v === loai) ?? 'video';

  if (!chapterId || !title) { next(new AppError('Invalid lesson payload', 400)); return; }

  const existingCount = await prisma.lesson.count({ where: { chapterId } });
  const lesson = await prisma.lesson.create({
    data: {
      chapterId, title, order: existingCount + 1,
      videoUrl: typeof video_url === 'string' ? video_url : null,
      type, duration: typeof thoi_luong === 'string' ? thoi_luong : null,
      content: typeof noi_dung === 'string' ? noi_dung : null,
    },
  });

  res.status(201).json({
    lesson: { id: lesson.id, chuong_hoc_id: lesson.chapterId, tieu_de: lesson.title, thu_tu: lesson.order, video_url: lesson.videoUrl, loai: lesson.type, thoi_luong: lesson.duration, noi_dung: lesson.content },
  });
}));

router.patch('/lessons/:id', authenticate, asyncHandler(async (req, res, next) => {
  const lessonId = Number(req.params.id);
  const { tieu_de, video_url, loai, thoi_luong, noi_dung } = req.body as Record<string, unknown>;

  if (!lessonId) { next(new AppError('Invalid lesson id', 400)); return; }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { chapter: { include: { course: { select: { instructorId: true } } } } },
  });

  if (!lesson) { res.status(404).json({ error: 'Lesson not found' }); return; }
  if (lesson.chapter.course.instructorId !== req.user!.userId) { res.status(403).json({ error: 'Forbidden' }); return; }

  const updated = await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      title: typeof tieu_de === 'string' ? tieu_de.trim() : undefined,
      videoUrl: typeof video_url === 'string' ? video_url : undefined,
      type: lessonTypes.find((v) => v === loai) ?? undefined,
      duration: typeof thoi_luong === 'string' ? thoi_luong : undefined,
      content: typeof noi_dung === 'string' ? noi_dung : undefined,
      order: typeof req.body.thu_tu === 'number' ? req.body.thu_tu : undefined,
    },
  });

  res.json({ lesson: { id: updated.id, chuong_hoc_id: updated.chapterId, tieu_de: updated.title, thu_tu: updated.order, video_url: updated.videoUrl, loai: updated.type, thoi_luong: updated.duration, noi_dung: updated.content } });
}));

router.delete('/lessons/:id', authenticate, asyncHandler(async (req, res, next) => {
  const lessonId = Number(req.params.id);

  if (!lessonId) { next(new AppError('Invalid lesson id', 400)); return; }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { chapter: { include: { course: { select: { instructorId: true } } } } },
  });

  if (!lesson) { res.status(404).json({ error: 'Lesson not found' }); return; }
  if (lesson.chapter.course.instructorId !== req.user!.userId) { res.status(403).json({ error: 'Forbidden' }); return; }

  await prisma.lesson.delete({ where: { id: lessonId } });
  res.status(204).send();
}));

router.patch('/chapters/:id/lessons/reorder', authenticate, asyncHandler(async (req, res, next) => {
  const { lessonIds } = req.body as { lessonIds?: number[] };

  if (!lessonIds || lessonIds.length === 0) {
    next(new AppError('Lesson IDs required', 400));
    return;
  }

  await prisma.$transaction(
    lessonIds.map((lessonId, index) =>
      prisma.lesson.update({
        where: { id: lessonId },
        data: { order: index + 1 },
      })
    )
  );

  res.json({ message: 'Lessons reordered' });
}));

export default router;