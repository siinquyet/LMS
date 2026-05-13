import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const prisma = new PrismaClient();
const router = Router();

router.get('/:id', asyncHandler(async (req, res) => {
  const quizId = Number(req.params.id);
  if (!quizId) { res.status(400).json({ error: 'Invalid quiz id' }); return; }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      lesson: { include: { chapter: { include: { course: { select: { id: true, title: true } } } } } },
      questions: { orderBy: { id: 'asc' } },
    },
  });

  if (!quiz) { res.status(404).json({ error: 'Quiz not found' }); return; }

  res.json({
    quiz: {
      id: quiz.id, bai_hoc_id: quiz.lessonId, tieu_de: quiz.title, thoi_gian_lam: quiz.timeLimit, so_cau_hoi: quiz.questionCount,
      khoa_hoc: { id: quiz.lesson.chapter.course.id, tieu_de: quiz.lesson.chapter.course.title },
      questions: quiz.questions.map((q) => ({ id: q.id, quiz_id: q.quizId, cau_hoi: q.question, lua_chon: q.options, dap_an_dung: q.correctAnswer })),
    },
  });
}));

router.get('/:id/questions', asyncHandler(async (req, res) => {
  const quizId = Number(req.params.id);
  if (!quizId) { res.status(400).json({ error: 'Invalid quiz id' }); return; }

  const questions = await prisma.quizQuestion.findMany({ where: { quizId }, orderBy: { id: 'asc' } });
  res.json({ cau_hoi: questions.map((q) => ({ id: q.id, quiz_id: q.quizId, cau_hoi: q.question, lua_chon: q.options, dap_an_dung: q.correctAnswer })) });
}));

router.post('/:id/questions', authenticate, asyncHandler(async (req, res, next) => {
  const quizId = Number(req.params.id);
  const { cau_hoi, lua_chon, dap_an_dung } = req.body as { cau_hoi?: string; lua_chon?: string[]; dap_an_dung?: string };

  const question = cau_hoi?.trim();
  const options = Array.isArray(lua_chon) ? lua_chon : [];
  const correctAnswer = dap_an_dung?.trim();

  if (!quizId || !question || options.length === 0 || !correctAnswer) { next(new AppError('Invalid question payload', 400)); return; }

  const newQuestion = await prisma.quizQuestion.create({ data: { quizId, question, options, correctAnswer } });
  await prisma.quiz.update({ where: { id: quizId }, data: { questionCount: { increment: 1 } } });
  res.status(201).json({ cau_hoi: { id: newQuestion.id, quiz_id: newQuestion.quizId, cau_hoi: newQuestion.question, lua_chon: newQuestion.options, dap_an_dung: newQuestion.correctAnswer } });
}));

router.patch('/:quizId/questions/:questionId', asyncHandler(async (req, res, next) => {
  const questionId = Number(req.params.questionId);
  const { cau_hoi, lua_chon, dap_an_dung } = req.body as Record<string, unknown>;

  if (!questionId) { next(new AppError('Invalid question id', 400)); return; }

  const question = await prisma.quizQuestion.update({
    where: { id: questionId },
    data: {
      question: typeof cau_hoi === 'string' ? cau_hoi.trim() : undefined,
      options: Array.isArray(lua_chon) ? lua_chon : undefined,
      correctAnswer: typeof dap_an_dung === 'string' ? dap_an_dung.trim() : undefined,
    },
  });

  res.json({ cau_hoi: { id: question.id, quiz_id: question.quizId, cau_hoi: question.question, lua_chon: question.options, dap_an_dung: question.correctAnswer } });
}));

router.delete('/:quizId/questions/:questionId', asyncHandler(async (req, res, next) => {
  const questionId = Number(req.params.questionId);
  const quizId = Number(req.params.quizId);

  if (!questionId || !quizId) { next(new AppError('Invalid ids', 400)); return; }

  await prisma.quizQuestion.delete({ where: { id: questionId } });
  await prisma.quiz.update({ where: { id: quizId }, data: { questionCount: { decrement: 1 } } });
  res.status(204).send();
}));

router.post('/:id/attempts', authenticate, asyncHandler(async (req, res, next) => {
  const quizId = Number(req.params.id);
  const { answers } = req.body as { answers?: Array<{ questionId: number; answer: string }> };
  const userId = req.user!.userId;

  if (!quizId || !Number.isInteger(userId) || !Array.isArray(answers)) { next(new AppError('Invalid quiz attempt payload', 400)); return; }

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

  if (!quiz) { res.status(404).json({ error: 'Quiz not found' }); return; }

  // Phase 3: Quiz prerequisite - check previous lesson completed
  const lessonsInChapter = quiz.lesson.chapter.lessons as { id: number }[];
  const currentLessonIndex = lessonsInChapter.findIndex((l) => l.id === quiz.lessonId);

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

  const questions = await prisma.quizQuestion.findMany({ where: { quizId }, select: { id: true, correctAnswer: true } });
  if (questions.length === 0) { res.status(404).json({ error: 'Quiz questions not found' }); return; }

  const answerMap = new Map(answers.map((a) => [a.questionId, a.answer]));
  const correctCount = questions.filter((q) => answerMap.get(q.id) === q.correctAnswer).length;
  const score = Number(((correctCount / questions.length) * 10).toFixed(2));

  const attempt = await prisma.quizAttempt.create({
    data: { quizId, userId, score, takenAt: new Date() },
  });

  const bestAttempt = await prisma.quizAttempt.findFirst({
    where: { quizId, userId },
    orderBy: { score: 'desc' },
  });

  res.status(201).json({
    attempt: { id: attempt.id, quiz_id: attempt.quizId, nguoi_dung_id: attempt.userId, diem: attempt.score, ngay_lam: attempt.takenAt.toISOString() },
    result: { correct: correctCount, total: questions.length, score },
    best_score: bestAttempt?.score ?? score,
  });
}));

router.get('/:id/attempts', asyncHandler(async (req, res) => {
  const quizId = Number(req.params.id);
  const userId = req.query.userId ? Number(req.query.userId) : undefined;

  if (!quizId) { res.status(400).json({ error: 'Invalid quiz id' }); return; }

  const attempts = await prisma.quizAttempt.findMany({
    where: { quizId, ...(userId ? { userId } : {}) },
    include: { user: { select: { id: true, firstName: true, lastName: true } } },
    orderBy: { takenAt: 'desc' },
  });

  const bestScore = attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : 0;
  const attemptCount = attempts.length;

  res.json({
    lich_su: attempts.map((a) => ({ id: a.id, quiz_id: a.quizId, nguoi_dung_id: a.userId, diem: a.score, nhan_xet: a.feedback, ngay_lam: a.takenAt.toISOString() })),
    diem_cao_nhat: bestScore,
    so_lan_lam: attemptCount,
  });
}));

router.patch('/:id/attempts/:attemptId/grade', asyncHandler(async (req, res, next) => {
  const attemptId = Number(req.params.attemptId);
  const { diem, nhan_xet } = req.body as { diem?: number; nhan_xet?: string };
  const score = typeof diem === 'number' ? diem : undefined;

  if (!attemptId || typeof score !== 'number') { next(new AppError('Invalid grade payload', 400)); return; }

  const attempt = await prisma.quizAttempt.update({
    where: { id: attemptId },
    data: { score, feedback: typeof nhan_xet === 'string' ? nhan_xet.trim() : undefined },
    include: { user: { select: { id: true, firstName: true, lastName: true } }, quiz: { select: { id: true, title: true } } },
  });

  res.json({
    ket_qua: {
      id: attempt.id, quiz_id: attempt.quizId, nguoi_dung_id: attempt.userId,
      diem: attempt.score, nhan_xet: attempt.feedback, ngay_lam: attempt.takenAt.toISOString(),
      user: { id: attempt.user.id, ten: attempt.user.firstName, ho: attempt.user.lastName },
      quiz: { id: attempt.quiz.id, tieu_de: attempt.quiz.title },
    },
  });
}));

router.get('/:id/analytics', authenticate, asyncHandler(async (req, res, next) => {
  const quizId = Number(req.params.id);

  if (!quizId) { next(new AppError('Invalid quiz id', 400)); return; }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      lesson: {
        include: {
          chapter: { include: { course: { select: { id: true, title: true, instructorId: true } } } },
        },
      },
      questions: { orderBy: { id: 'asc' } },
    },
  });

  if (!quiz) { res.status(404).json({ error: 'Quiz not found' }); return; }
  if (quiz.lesson.chapter.course.instructorId !== req.user!.userId) { res.status(403).json({ error: 'Forbidden' }); return; }

  const attempts = await prisma.quizAttempt.findMany({
    where: { quizId },
    include: { user: { select: { id: true, firstName: true, lastName: true } } },
    orderBy: { takenAt: 'desc' },
  });

  const totalAttempts = attempts.length;
  const uniqueStudents = new Set(attempts.map((a) => a.userId)).size;
  const avgScore = totalAttempts > 0 ? Number((attempts.reduce((s, a) => s + a.score, 0) / totalAttempts).toFixed(2)) : 0;
  const passCount = attempts.filter((a) => a.score >= 5).length;
  const passRate = totalAttempts > 0 ? Number(((passCount / totalAttempts) * 100).toFixed(1)) : 0;

  const scoreDistribution = {
    '0-4': attempts.filter((a) => a.score < 5).length,
    '5-6.9': attempts.filter((a) => a.score >= 5 && a.score < 7).length,
    '7-8.9': attempts.filter((a) => a.score >= 7 && a.score < 9).length,
    '9-10': attempts.filter((a) => a.score >= 9).length,
  };

  const recentAttempts = attempts.slice(0, 10).map((a) => ({
    id: a.id,
    user: { id: a.user.id, ten: a.user.firstName, ho: a.user.lastName },
    diem: a.score,
    ngay_lam: a.takenAt.toISOString(),
  }));

  res.json({
    quiz: { id: quiz.id, tieu_de: quiz.title, so_cau_hoi: quiz.questions.length },
    overview: { total_attempts: totalAttempts, unique_students: uniqueStudents, diem_trung_binh: avgScore, pass_rate: passRate },
    score_distribution: scoreDistribution,
    recent_attempts: recentAttempts,
  });
}));

router.get('/:id/question-analytics', authenticate, asyncHandler(async (req: any, res: any, next) => {
  const quizId = Number(req.params.id);

  if (!quizId) { next(new AppError('Invalid quiz id', 400)); return; }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      lesson: { include: { chapter: { include: { course: { select: { instructorId: true } } } } } },
      questions: { orderBy: { id: 'asc' } },
    },
  });

  if (!quiz) { res.status(404).json({ error: 'Quiz not found' }); return; }
  if (quiz.lesson.chapter.course.instructorId !== req.user!.userId) { res.status(403).json({ error: 'Forbidden' }); return; }

  const attempts = await prisma.quizAttempt.findMany({ where: { quizId } });
  const totalAttempts = attempts.length;

  if (totalAttempts === 0) {
    return res.json({ questions: quiz.questions.map((q, i) => ({ id: q.id, cau_hoi: q.question, thu_tu: i + 1, correct_count: 0, correct_rate: 0 })) });
  }

  const questionAnalytics = quiz.questions.map((q, i) => {
    const correctCount = attempts.filter((a) => {
      try {
        const perQuestionScore = 10 / quiz.questions.length;
        const expectedCorrect = Math.round(a.score / perQuestionScore);
        return i + 1 <= expectedCorrect;
      } catch {
        return false;
      }
    }).length;

    return {
      id: q.id,
      cau_hoi: q.question,
      thu_tu: i + 1,
      dap_an_dung: q.correctAnswer,
      correct_count: correctCount,
      correct_rate: Number(((correctCount / totalAttempts) * 100).toFixed(1)),
    };
  });

  res.json({ questions: questionAnalytics });
}));

export default router;