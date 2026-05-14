import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().min(1).optional(),
  password: z.string().min(1, 'Password is required'),
}).refine(data => data.email || data.username, {
  message: 'Email or username is required',
});

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  username: z.string().min(1).max(50).optional(),
  role: z.enum(['hoc_vien', 'giang_vien', 'admin']).optional(),
});

export const userUpdateSchema = z.object({
  ten: z.string().max(100).optional(),
  ho: z.string().max(100).optional(),
  email: z.string().email().optional(),
  so_dien_thoai: z.string().max(20).optional(),
  dia_chi: z.string().max(255).optional(),
  gioi_thieu: z.string().max(1000).optional(),
  anh_dai_dien: z.string().url().optional().nullable(),
});

export const categorySchema = z.object({
  ten: z.string().min(1, 'Category name is required').max(100),
});

export const courseCreateSchema = z.object({
  tieu_de: z.string().min(1, 'Title is required').max(255),
  giang_vien_id: z.number().int().positive(),
  danh_muc_id: z.number().int().positive(),
  gia: z.number().min(0),
  so_luong_toi_da: z.number().int().positive().nullable().optional(),
  trang_thai: z.enum(['draft', 'completed', 'pending', 'approved', 'rejected']).optional(),
  mo_ta: z.string().max(5000).optional(),
  hinh_anh: z.string().url().optional().nullable(),
  muc_do: z.string().max(50).optional(),
  thoi_luong: z.string().max(50).optional(),
  requirements: z.array(z.string()).optional(),
  whatYouLearn: z.array(z.string()).optional(),
});

export const courseUpdateSchema = courseCreateSchema.partial();

export const chapterCreateSchema = z.object({
  tieu_de: z.string().min(1, 'Chapter title is required').max(255),
  thu_tu: z.number().int().positive().optional(),
});

export const chapterUpdateSchema = z.object({
  tieu_de: z.string().min(1).max(255).optional(),
  thu_tu: z.number().int().positive().optional(),
});

export const lessonCreateSchema = z.object({
  tieu_de: z.string().min(1, 'Lesson title is required').max(255),
  video_url: z.string().url().optional().nullable(),
  loai: z.enum(['video', 'document', 'quiz', 'exercise']).optional(),
  thoi_luong: z.string().max(50).optional(),
  noi_dung: z.string().max(50000).optional(),
});

export const lessonUpdateSchema = z.object({
  tieu_de: z.string().min(1).max(255).optional(),
  video_url: z.string().url().optional().nullable(),
  loai: z.enum(['video', 'document', 'quiz', 'exercise']).optional(),
  thoi_luong: z.string().max(50).optional(),
  noi_dung: z.string().max(50000).optional(),
});

export const commentCreateSchema = z.object({
  nguoi_dung_id: z.number().int().positive(),
  noi_dung: z.string().min(1, 'Comment content is required').max(2000),
  parent_id: z.number().int().positive().optional().nullable(),
});

export const forumTopicCreateSchema = z.object({
  nguoi_dung_id: z.number().int().positive(),
  tieu_de: z.string().min(1, 'Title is required').max(255),
  noi_dung: z.string().min(1, 'Content is required').max(10000),
  khoa_hoc_id: z.number().int().positive().optional().nullable(),
});

export const forumTopicUpdateSchema = z.object({
  tieu_de: z.string().min(1).max(255).optional(),
  noi_dung: z.string().min(1).max(10000).optional(),
  khoa_hoc_id: z.number().int().positive().optional().nullable(),
});

export const forumReplyCreateSchema = z.object({
  nguoi_dung_id: z.number().int().positive(),
  noi_dung: z.string().min(1, 'Reply content is required').max(2000),
});

export const progressUpdateSchema = z.object({
  nguoi_dung_id: z.number().int().positive(),
  bai_hoc_id: z.number().int().positive(),
  da_hoan_thanh: z.boolean(),
});

export const enrollmentCreateSchema = z.object({
  nguoi_dung_id: z.number().int().positive(),
  khoa_hoc_id: z.number().int().positive(),
});

export const quizAttemptSchema = z.object({
  nguoi_dung_id: z.number().int().positive(),
  answers: z.array(z.object({
    questionId: z.number().int().positive(),
    answer: z.string(),
  })),
});

export const assignmentSubmissionSchema = z.object({
  nguoi_dung_id: z.number().int().positive(),
  noi_dung: z.string().min(1, 'Submission content is required').max(10000),
  file_dinh_kem: z.string().url().optional().nullable(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const parseIdParam = (value: string): number | null => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};
