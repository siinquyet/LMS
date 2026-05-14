import type { Response } from 'express';

export const serializeUser = (user: {
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

export const serializeCourse = (course: {
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

export const serializeComment = (comment: {
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

export const handleError = (res: Response, error: unknown) => {
  console.error(error);
  res.status(500).json({ error: 'Internal error' });
};