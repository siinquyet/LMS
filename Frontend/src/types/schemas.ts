import { z } from "zod";

export const courseSchema = z.object({
  id: z.number(),
  tieu_de: z.string(),
  mo_ta: z.string().nullable(),
  gia: z.number(),
  muc_do: z.string().nullable(),
  danh_muc_id: z.number(),
  thoi_luong: z.string().nullable(),
  thumbnail: z.string().nullable(),
  trang_thai: z.enum(["draft", "pending", "approved", "published", "rejected", "completed"]),
  so_luong_da_dang_ky: z.number(),
  xep_hang: z.number().nullable(),
  chuong_hoc: z.array(z.object({
    id: z.number(),
    tieu_de: z.string(),
    thu_tu: z.number(),
    bai_hoc: z.array(z.object({
      id: z.number(),
      tieu_de: z.string(),
      video_url: z.string().nullable(),
      loai: z.enum(["video", "document", "quiz", "exercise"]),
      thoi_luong: z.string().nullable(),
      noi_dung: z.string().nullable(),
      mo_ta: z.string().nullable(),
    })).optional(),
  })).optional(),
  giang_vien: z.object({
    id: z.number(),
    ten: z.string(),
    ho: z.string().nullable(),
    anh_dai_dien: z.string().nullable(),
    gioi_thieu: z.string().nullable(),
  }).optional(),
  danh_muc: z.object({
    id: z.number(),
    ten: z.string(),
  }).optional(),
});

export const chapterSchema = z.object({
  id: z.number(),
  khoa_hoc_id: z.number(),
  tieu_de: z.string(),
  thu_tu: z.number(),
  bai_hoc: z.array(z.object({
    id: z.number(),
    chuong_hoc_id: z.number(),
    tieu_de: z.string(),
    video_url: z.string().nullable(),
    loai: z.enum(["video", "document", "quiz", "exercise"]),
    thoi_luong: z.string().nullable(),
    noi_dung: z.string().nullable(),
  })).optional(),
});

export const lessonSchema = z.object({
  id: z.number(),
  chuong_hoc_id: z.number(),
  tieu_de: z.string(),
  video_url: z.string().nullable(),
  loai: z.enum(["video", "document", "quiz", "exercise"]),
  thoi_luong: z.string().nullable(),
  noi_dung: z.string().nullable(),
  mo_ta: z.string().nullable(),
  quizzes: z.array(z.object({
    id: z.number(),
    tieu_de: z.string(),
    thoi_gian_lam: z.number().nullable(),
    so_cau_hoi: z.number().nullable(),
  })).optional(),
  assignments: z.array(z.object({
    id: z.number(),
    tieu_de: z.string(),
    mo_ta: z.string().nullable(),
    bat_buoc: z.boolean(),
    han_nop: z.string().nullable(),
  })).optional(),
});

export const userSchema = z.object({
  id: z.number(),
  ten_dang_nhap: z.string(),
  email: z.string(),
  ho: z.string(),
  ten: z.string(),
  vai_tro: z.enum(["hoc_vien", "giang_vien", "admin"]),
  anh_dai_dien: z.string().nullable(),
});

export const progressSchema = z.object({
  nguoi_dung_id: z.number(),
  bai_hoc_id: z.number(),
  da_hoan_thanh: z.boolean(),
  ngay_hoan_thanh: z.string().nullable(),
  bai_hoc: z.object({
    id: z.number(),
    tieu_de: z.string(),
    chuong_hoc_id: z.number(),
  }),
});

export const analyticsSchema = z.object({
  tong_hoc_vien: z.number(),
  tong_doanh_thu: z.number(),
  hoc_vien_thang_nay: z.number().optional(),
  so_khoa_hoc: z.number().optional(),
  khoa_hoc: z.array(z.object({
    id: z.number(),
    tieu_de: z.string(),
    so_luong_da_dang_ky: z.number(),
    gia: z.number(),
    doanh_thu: z.number(),
    thu_nhap_thuc_nhan: z.number(),
    ty_le_hoan_thanh: z.number(),
  })).optional(),
  dang_ky_gan_day: z.array(z.object({
    ho_ten: z.string(),
    khoa_hoc: z.string(),
    ngay_dang_ky: z.string(),
  })),
  bieu_do_thang: z.array(z.object({
    thang: z.string(),
    doanh_thu: z.number(),
  })).optional(),
});

export const savedPostSchema = z.object({
  id: z.number(),
  tieu_de: z.string(),
  noi_dung: z.string(),
  ngay_luu: z.string(),
  nguoi_dung: z.object({
    id: z.number(),
    ten: z.string(),
    anh_dai_dien: z.string().nullable(),
  }),
  danh_muc: z.object({
    id: z.number(),
    ten: z.string(),
    mau_sac: z.string(),
  }).nullable(),
});

export type Course = z.infer<typeof courseSchema>;
export type Chapter = z.infer<typeof chapterSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type User = z.infer<typeof userSchema>;
export type Progress = z.infer<typeof progressSchema>;
export type Analytics = z.infer<typeof analyticsSchema>;
export type SavedPost = z.infer<typeof savedPostSchema>;