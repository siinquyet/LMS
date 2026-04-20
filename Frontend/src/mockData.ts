// ============================================
// MOCK DATA - ĐỂ HÌNH THÀNH CẤU TRÚC DATABASE
// ============================================

// -------------------- 1. NGƯỜI DÙNG --------------------
export interface User {
  id: number;
  ten_dang_nhap: string;
  email: string;
  mat_khau: string;
  ten: string;
  ho: string;
  anh_dai_dien?: string;
  so_dien_thoai?: string;
  dia_chi?: string;
  gioi_thieu?: string;
  bi_khoa: boolean;
  ngay_tham_gia: string;
  vai_tro: 'hoc_vien' | 'giang_vien' | 'admin';
}

export const users: User[] = [
  {
    id: 1,
    ten_dang_nhap: 'user',
    email: 'user@example.com',
    mat_khau: 'user',
    ho: 'Nguyen',
    ten: 'User',
    anh_dai_dien: 'https://picsum.photos/seed/user/100/100',
    so_dien_thoai: '0912345678',
    dia_chi: 'Ho Chi Minh City',
    gioi_thieu: 'Học viên yêu công nghệ',
    bi_khoa: false,
    ngay_tham_gia: '2025-01-15',
    vai_tro: 'hoc_vien',
  },
  {
    id: 2,
    ten_dang_nhap: 'admin',
    email: 'admin@example.com',
    mat_khau: 'admin',
    ho: 'Tran',
    ten: 'Admin',
    anh_dai_dien: 'https://picsum.photos/seed/admin/100/100',
    bi_khoa: false,
    ngay_tham_gia: '2024-06-01',
    vai_tro: 'admin',
  },
  {
    id: 3,
    ten_dang_nhap: 'teacher',
    email: 'teacher@example.com',
    mat_khau: 'teacher',
    ho: 'Le',
    ten: 'Teacher',
    anh_dai_dien: 'https://picsum.photos/seed/teacher/100/100',
    so_dien_thoai: '0987654321',
    gioi_thieu: 'Giảng viên chuyên nghiệp với 10 năm kinh nghiệm',
    bi_khoa: false,
    ngay_tham_gia: '2024-03-10',
    vai_tro: 'giang_vien',
  },
  {
    id: 4,
    ten_dang_nhap: 'teacher2',
    email: 'teacher2@example.com',
    mat_khau: 'teacher2',
    ho: 'Pham',
    ten: 'Thi B',
    anh_dai_dien: 'https://picsum.photos/seed/teacher2/100/100',
    bi_khoa: false,
    ngay_tham_gia: '2024-05-20',
    vai_tro: 'giang_vien',
  },
];

// -------------------- 2. DANH MỤC --------------------
export interface Category {
  id: number;
  ten: string;
}

export const categories: Category[] = [
  { id: 1, ten: 'Lập trình' },
  { id: 2, ten: 'Thiết kế' },
  { id: 3, ten: 'Marketing' },
  { id: 4, ten: 'Kinh doanh' },
];

// -------------------- 3. KHÓA HỌC --------------------
export interface Course {
  id: number;
  tieu_de: string;
  giang_vien_id: number;
  danh_muc_id: number;
  gia: number;
  so_luong_toi_da?: number;
  so_luong_da_dang_ky: number;
  trang_thai: 'draft' | 'completed' | 'pending' | 'approved' | 'rejected';
  mo_ta?: string;
  yeu_cau?: string[];
  ban_thiet_bi?: string[];
  thumbnail?: string;
  hinh_anh?: string;
  muc_do?: string;
  thoi_luong?: string;
  so_bai_hoc?: number;
  xep_hang?: number;
  requirements?: string[];
  whatYouLearn?: string[];
}

export const courses: Course[] = [
  {
    id: 1,
    tieu_de: 'React & Next.js Full Course',
    giang_vien_id: 3,
    danh_muc_id: 1,
    gia: 699000,
    so_luong_toi_da: 1000,
    so_luong_da_dang_ky: 1250,
    trang_thai: 'completed',
    mo_ta: 'Khóa học toàn diện về React và Next.js, từ cơ bản đến nâng cao',
    thumbnail: 'https://picsum.photos/seed/react/300/200',
    muc_do: 'Trung cấp',
    thoi_luong: '40 giờ',
    so_bai_hoc: 120,
    xep_hang: 4.8,
    requirements: ['Biết cơ bản HTML, CSS, JavaScript', 'Máy tính có kết nối internet', 'Đam mê học lập trình web'],
    whatYouLearn: ['Xây dựng ứng dụng React từ đầu', 'Quản lý state với Redux và Context API', 'Tạo API với Next.js', 'Triển khai ứng dụng lên production'],
  },
  {
    id: 2,
    tieu_de: 'TypeScript Fundamentals',
    giang_vien_id: 3,
    danh_muc_id: 1,
    gia: 499000,
    so_luong_da_dang_ky: 890,
    trang_thai: 'completed',
    thumbnail: 'https://picsum.photos/seed/ts/300/200',
    muc_do: 'Cơ bản',
    thoi_luong: '20 giờ',
    so_bai_hoc: 60,
    xep_hang: 4.9,
    requirements: ['Biết JavaScript cơ bản', 'Máy tính có kết nối internet'],
    whatYouLearn: ['Hiểu về TypeScript type system', 'Sử dụng các tính năng nâng cao', 'Áp dụng best practices'],
  },
  {
    id: 3,
    tieu_de: 'Node.js Backend Development',
    giang_vien_id: 4,
    danh_muc_id: 1,
    gia: 799000,
    so_luong_da_dang_ky: 2100,
    trang_thai: 'completed',
    thumbnail: 'https://picsum.photos/seed/node/300/200',
    muc_do: 'Nâng cao',
    thoi_luong: '50 giờ',
    so_bai_hoc: 150,
    xep_hang: 4.7,
    requirements: ['Biết JavaScript', 'Hiểu cơ bản về HTTP và REST API'],
    whatYouLearn: ['Xây dựng REST API với Express', 'Kết nối database với Prisma', 'Authentication và Authorization'],
  },
];

// -------------------- 4. CHƯƠNG HỌC --------------------
export interface Chapter {
  id: number;
  khoa_hoc_id: number;
  tieu_de: string;
  thu_tu: number;
}

export const chapters: Chapter[] = [
  // Course 1 chapters
  { id: 1, khoa_hoc_id: 1, tieu_de: 'Giới thiệu React', thu_tu: 1 },
  { id: 2, khoa_hoc_id: 1, tieu_de: 'JSX và Components', thu_tu: 2 },
  { id: 3, khoa_hoc_id: 1, tieu_de: 'State và Props', thu_tu: 3 },
  { id: 4, khoa_hoc_id: 1, tieu_de: 'React Hooks', thu_tu: 4 },
  { id: 5, khoa_hoc_id: 1, tieu_de: 'Next.js Basics', thu_tu: 5 },
  // Course 2 chapters
  { id: 6, khoa_hoc_id: 2, tieu_de: 'TypeScript Overview', thu_tu: 1 },
  { id: 7, khoa_hoc_id: 2, tieu_de: 'Type System', thu_tu: 2 },
  { id: 8, khoa_hoc_id: 2, tieu_de: 'Advanced Types', thu_tu: 3 },
];

// -------------------- 5. BÀI HỌC --------------------
export interface Lesson {
  id: number;
  chuong_hoc_id: number;
  tieu_de: string;
  video_url?: string;
  loai: 'video' | 'document' | 'quiz' | 'exercise';
  thoi_luong?: string;
  noi_dung?: string;
}

export const lessons: Lesson[] = [
  // Chapter 1 - React Intro
  { id: 1, chuong_hoc_id: 1, tieu_de: 'React là gì?', video_url: 'https://example.com/video/1', loai: 'video', thoi_luong: '10:00' },
  { id: 2, chuong_hoc_id: 1, tieu_de: 'Cài đặt môi trường', video_url: 'https://example.com/video/2', loai: 'video', thoi_luong: '15:30' },
  { id: 3, chuong_hoc_id: 1, tieu_de: 'Tạo project đầu tiên', video_url: 'https://example.com/video/3', loai: 'video', thoi_luong: '20:00' },
  // Chapter 2 - JSX
  { id: 4, chuong_hoc_id: 2, tieu_de: 'JSX Syntax', video_url: 'https://example.com/video/4', loai: 'video', thoi_luong: '12:00' },
  { id: 5, chuong_hoc_id: 2, tieu_de: 'Components cơ bản', video_url: 'https://example.com/video/5', loai: 'video', thoi_luong: '18:00' },
  { id: 6, chuong_hoc_id: 2, tieu_de: 'Quiz chương 2', loai: 'quiz' },
  // Chapter 3 - State & Props
  { id: 7, chuong_hoc_id: 3, tieu_de: 'useState hook', video_url: 'https://example.com/video/7', loai: 'video', thoi_luong: '25:00' },
  { id: 8, chuong_hoc_id: 3, tieu_de: 'Props trong React', video_url: 'https://example.com/video/8', loai: 'video', thoi_luong: '15:00' },
  { id: 9, chuong_hoc_id: 3, tieu_de: 'Bài tập useState', loai: 'exercise' },
];

// -------------------- 6. ĐĂNG KÝ KHÓA HỌC (ENROLLMENT) --------------------
export interface Enrollment {
  id: number;
  nguoi_dung_id: number;
  khoa_hoc_id: number;
  ngay_dang_ky: string;
}

export const enrollments: Enrollment[] = [
  { id: 1, nguoi_dung_id: 1, khoa_hoc_id: 1, ngay_dang_ky: '2025-02-01' },
  { id: 2, nguoi_dung_id: 1, khoa_hoc_id: 2, ngay_dang_ky: '2025-02-15' },
  { id: 3, nguoi_dung_id: 1, khoa_hoc_id: 3, ngay_dang_ky: '2025-03-01' },
];

// -------------------- 7. TIẾN ĐỘ BÀI HỌC --------------------
export interface Progress {
  nguoi_dung_id: number;
  bai_hoc_id: number;
  da_hoan_thanh: boolean;
  ngay_hoan_thanh?: string;
}

export const progress: Progress[] = [
  { nguoi_dung_id: 1, bai_hoc_id: 1, da_hoan_thanh: true, ngay_hoan_thanh: '2025-02-02' },
  { nguoi_dung_id: 1, bai_hoc_id: 2, da_hoan_thanh: true, ngay_hoan_thanh: '2025-02-03' },
  { nguoi_dung_id: 1, bai_hoc_id: 3, da_hoan_thanh: true, ngay_hoan_thanh: '2025-02-04' },
  { nguoi_dung_id: 1, bai_hoc_id: 4, da_hoan_thanh: true, ngay_hoan_thanh: '2025-02-05' },
  { nguoi_dung_id: 1, bai_hoc_id: 5, da_hoan_thanh: false },
  { nguoi_dung_id: 1, bai_hoc_id: 6, da_hoan_thanh: false },
];

// -------------------- 8. ĐƠN HÀNG --------------------
export interface Order {
  id: number;
  nguoi_dung_id: number;
  tong_tien: number;
  trang_thai: 'pending' | 'success' | 'failed';
  ngay_dat: string;
}

export interface OrderItem {
  id: number;
  don_hang_id: number;
  khoa_hoc_id: number;
  gia: number;
}

export const orders: Order[] = [
  { id: 1, nguoi_dung_id: 1, tong_tien: 699000, trang_thai: 'success', ngay_dat: '2025-02-01' },
  { id: 2, nguoi_dung_id: 1, tong_tien: 499000, trang_thai: 'success', ngay_dat: '2025-02-15' },
  { id: 3, nguoi_dung_id: 1, tong_tien: 799000, trang_thai: 'success', ngay_dat: '2025-03-01' },
];

export const orderItems: OrderItem[] = [
  { id: 1, don_hang_id: 1, khoa_hoc_id: 1, gia: 699000 },
  { id: 2, don_hang_id: 2, khoa_hoc_id: 2, gia: 499000 },
  { id: 3, don_hang_id: 3, khoa_hoc_id: 3, gia: 799000 },
];

// -------------------- 9. THANH TOÁN --------------------
export interface Payment {
  id: number;
  don_hang_id: number;
  so_tien: number;
  trang_thai: 'pending' | 'success' | 'failed';
  ngay_thanh_toan: string;
  phuong_thuc?: string;
}

export const payments: Payment[] = [
  { id: 1, don_hang_id: 1, so_tien: 699000, trang_thai: 'success', ngay_thanh_toan: '2025-02-01', phuong_thuc: 'vnpay' },
  { id: 2, don_hang_id: 2, so_tien: 499000, trang_thai: 'success', ngay_thanh_toan: '2025-02-15', phuong_thuc: 'vnpay' },
  { id: 3, don_hang_id: 3, so_tien: 799000, trang_thai: 'success', ngay_thanh_toan: '2025-03-01', phuong_thuc: 'stripe' },
];

// -------------------- 10. BÌNH LUẬN --------------------
export interface Comment {
  id: number;
  bai_hoc_id: number;
  nguoi_dung_id: number;
  noi_dung: string;
  parent_id?: number;
  ngay_tao: string;
}

export const comments: Comment[] = [
  { id: 1, bai_hoc_id: 1, nguoi_dung_id: 1, noi_dung: 'Bài giảng rất dễ hiểu!', ngay_tao: '2025-02-02' },
  { id: 2, bai_hoc_id: 1, nguoi_dung_id: 2, noi_dung: 'Cảm ơn giảng viên', ngay_tao: '2025-02-03' },
  { id: 3, bai_hoc_id: 1, nguoi_dung_id: 3, noi_dung: 'Cảm ơn phản hồi!', parent_id: 1, ngay_tao: '2025-02-04' },
  { id: 4, bai_hoc_id: 4, nguoi_dung_id: 1, noi_dung: 'JSX syntax khá thú vị', ngay_tao: '2025-02-05' },
];

// -------------------- 11. THÔNG BÁO --------------------
export interface Notification {
  id: number;
  nguoi_dung_id: number;
  tieu_de: string;
  noi_dung: string;
  loai: 'info' | 'success' | 'warning' | 'error';
  da_doc: boolean;
  ngay_tao: string;
  link?: string;
}

export const notifications: Notification[] = [
  { id: 1, nguoi_dung_id: 1, tieu_de: 'Đăng ký khóa học thành công', noi_dung: 'Bạn đã đăng ký khóa React & Next.js Full Course', loai: 'success', da_doc: false, ngay_tao: '2025-02-01', link: '/my-courses' },
  { id: 2, nguoi_dung_id: 1, tieu_de: 'Khóa học mới', noi_dung: 'Khóa TypeScript Fundamentals đã được cập nhật', loai: 'info', da_doc: true, ngay_tao: '2025-02-10', link: '/course/2' },
  { id: 3, nguoi_dung_id: 1, tieu_de: 'Nhắc nhở', noi_dung: 'Hãy hoàn thành bài tập tuần này', loai: 'warning', da_doc: true, ngay_tao: '2025-02-15', link: '/assignments' },
];

// -------------------- 12. DIỄN ĐÀN --------------------
export interface ForumTopic {
  id: number;
  nguoi_dung_id: number;
  tieu_de: string;
  noi_dung: string;
  khoa_hoc_id?: number;
  luot_xem: number;
  luot_tra_loi: number;
  ngay_tao: string;
  ngay_cap_nhat: string;
}

export interface ForumReply {
  id: number;
  topic_id: number;
  nguoi_dung_id: number;
  noi_dung: string;
  ngay_tao: string;
}

export const forumTopics: ForumTopic[] = [
  { id: 1, nguoi_dung_id: 1, tieu_de: 'Cách học React hiệu quả?', noi_dung: 'Mọi người có tip gì để học React nhanh không?', khoa_hoc_id: 1, luot_xem: 150, luot_tra_loi: 5, ngay_tao: '2025-02-01', ngay_cap_nhat: '2025-02-02' },
  { id: 2, nguoi_dung_id: 2, tieu_de: 'TypeScript vs JavaScript', noi_dung: 'Nên học TypeScript trước hay sau JS?', luot_xem: 200, luot_tra_loi: 8, ngay_tao: '2025-02-05', ngay_cap_nhat: '2025-02-06' },
  { id: 3, nguoi_dung_id: 3, tieu_de: 'Hỏi về Next.js SSR', noi_dung: 'Khi nào nên dùng SSR trong Next.js?', khoa_hoc_id: 1, luot_xem: 80, luot_tra_loi: 3, ngay_tao: '2025-02-10', ngay_cap_nhat: '2025-02-11' },
];

export const forumReplies: ForumReply[] = [
  { id: 1, topic_id: 1, nguoi_dung_id: 3, noi_dung: 'Mình recommend học kỹ JS trước rồi mới qua React nhé!', ngay_tao: '2025-02-01' },
  { id: 2, topic_id: 1, nguoi_dung_id: 1, noi_dung: 'Cảm ơn bạn, sẽ làm theo gợi ý!', ngay_tao: '2025-02-02' },
  { id: 3, topic_id: 2, nguoi_dung_id: 3, noi_dung: 'Nên học JS trước, sau đó mới TypeScript để hiểu rõ hơn về types.', ngay_tao: '2025-02-05' },
];

// -------------------- 13. QUIZ (BÀI KIỂM TRA) --------------------
export interface Quiz {
  id: number;
  bai_hoc_id: number;
  tieu_de: string;
  thoi_gian_lam?: number; // phút
  so_cau_hoi: number;
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  cau_hoi: string;
  lua_chon: { id: string; text: string }[];
  dap_an_dung: string;
}

export interface QuizAttempt {
  id: number;
  quiz_id: number;
  nguoi_dung_id: number;
  diem: number;
  ngay_lam: string;
}

export const quizzes: Quiz[] = [
  { id: 1, bai_hoc_id: 6, tieu_de: 'Quiz chương 2: JSX và Components', thoi_gian_lam: 15, so_cau_hoi: 10 },
  { id: 2, bai_hoc_id: 7, tieu_de: 'Quiz chương 3: State và Props', thoi_gian_lam: 20, so_cau_hoi: 15 },
];

export const quizQuestions: QuizQuestion[] = [
  { id: 1, quiz_id: 1, cau_hoi: 'JSX là gì?', lua_chon: [
    { id: 'a', text: 'JavaScript XML' },
    { id: 'b', text: 'Java Syntax Extension' },
    { id: 'c', text: 'JavaScript Extension' },
    { id: 'd', text: 'JavaScript Extra' },
  ], dap_an_dung: 'c' },
  { id: 2, quiz_id: 1, cau_hoi: 'Để render JSX trong React ta dùng?', lua_chon: [
    { id: 'a', text: 'render()' },
    { id: 'b', text: 'ReactDOM.render()' },
    { id: 'c', text: 'React.render()' },
    { id: 'd', text: 'renderDOM()' },
  ], dap_an_dung: 'b' },
  { id: 3, quiz_id: 1, cau_hoi: 'Component trong React là gì?', lua_chon: [
    { id: 'a', text: 'Một hàm JavaScript' },
    { id: 'b', text: 'Một đối tượng JavaScript' },
    { id: 'c', text: 'Một khối code có thể tái sử dụng' },
    { id: 'd', text: 'Một file HTML' },
  ], dap_an_dung: 'c' },
];

export const quizAttempts: QuizAttempt[] = [
  { id: 1, quiz_id: 1, nguoi_dung_id: 1, diem: 8, ngay_lam: '2025-02-05' },
];

// -------------------- 14. BÀI TẬP --------------------
export interface Assignment {
  id: number;
  bai_hoc_id: number;
  tieu_de: string;
  mo_ta: string;
  bat_buoc: boolean;
  han_nop?: string;
}

export interface AssignmentSubmission {
  id: number;
  bai_tap_id: number;
  nguoi_dung_id: number;
  noi_dung: string;
  file_dinh_kem?: string;
  diem?: number;
  nhan_xet?: string;
  ngay_nop: string;
}

export const assignments: Assignment[] = [
  { id: 1, bai_hoc_id: 9, tieu_de: 'Bài tập useState', mo_ta: 'Tạo counter app sử dụng useState', bat_buoc: true, han_nop: '2025-02-20' },
  { id: 2, bai_hoc_id: 10, tieu_de: 'Bài tập Props', mo_ta: 'Tạo component hiển thị thông tin user', bat_buoc: false, han_nop: '2025-02-25' },
];

export const assignmentSubmissions: AssignmentSubmission[] = [
  { id: 1, bai_tap_id: 1, nguoi_dung_id: 1, noi_dung: 'Đã hoàn thành bài tập', diem: 9, nhan_xet: 'Làm tốt lắm!', ngay_nop: '2025-02-15' },
];

// -------------------- 15. CHỨNG CHỈ --------------------
export interface Certificate {
  id: number;
  nguoi_dung_id: number;
  khoa_hoc_id: number;
  ngay_cap: string;
  ma_chung_chi: string;
}

export const certificates: Certificate[] = [
  { id: 1, nguoi_dung_id: 1, khoa_hoc_id: 1, ngay_cap: '2025-03-01', ma_chung_chi: 'LMS-2025-001' },
];

// ============================================
// DATABASE TABLES NEEDED (từ mock data):
// ============================================
// 1. nguoi_dung (users) - id, ten_dang_nhap, email, mat_khau, ten, ho, anh_dai_dien, so_dien_thoai, dia_chi, gioi_thieu, bi_khoa, ngay_tham_gia
// 2. vai_tro (roles) - id, ten (hoc_vien, giang_vien, admin)
// 3. nguoi_dung_vai_tro (user_roles) - nguoi_dung_id, vai_tro_id
// 4. danh_muc (categories) - id, ten
// 5. khoa_hoc (courses) - id, tieu_de, giang_vien_id, danh_muc_id, gia, so_luong_toi_da, so_luong_da_dang_ky, trang_thai, mo_ta, thumbnail, muc_do, thoi_luong, so_bai_hoc, xep_hang
// 6. chuong_hoc (chapters) - id, khoa_hoc_id, tieu_de, thu_tu
// 7. bai_hoc (lessons) - id, chuong_hoc_id, tieu_de, video_url, loai, thoi_luong, noi_dung
// 8. dang_ky_khoa_hoc (enrollments) - id, nguoi_dung_id, khoa_hoc_id, ngay_dang_ky
// 9. tien_do_bai_hoc (progress) - nguoi_dung_id, bai_hoc_id, da_hoan_thanh, ngay_hoan_thanh
// 10. don_hang (orders) - id, nguoi_dung_id, tong_tien, trang_thai, ngay_dat
// 11. chi_tiet_don_hang (order_items) - id, don_hang_id, khoa_hoc_id, gia
// 12. thanh_toan (payments) - id, don_hang_id, so_tien, trang_thai, ngay_thanh_toan, phuong_thuc
// 13. binh_luan (comments) - id, bai_hoc_id, nguoi_dung_id, noi_dung, parent_id, ngay_tao
// 14. thong_bao (notifications) - id, nguoi_dung_id, tieu_de, noi_dung, loai, da_doc, ngay_tao, link
// 15. chu_de_forum (forum_topics) - id, nguoi_dung_id, tieu_de, noi_dung, khoa_hoc_id, luot_xem, luot_tra_loi, ngay_tao, ngay_cap_nhat
// 16. tra_loi_forum (forum_replies) - id, topic_id, nguoi_dung_id, noi_dung, ngay_tao
// 17. bai_kiem_tra (quizzes) - id, bai_hoc_id, tieu_de, thoi_gian_lam, so_cau_hoi
// 18. cau_hoi (quiz_questions) - id, quiz_id, cau_hoi, lua_chon, dap_an_dung
// 19. lam_bai (quiz_attempts) - id, quiz_id, nguoi_dung_id, diem, ngay_lam
// 20. bai_tap (assignments) - id, bai_hoc_id, tieu_de, mo_ta, bat_buoc, han_nop
// 21. nop_bai (assignment_submissions) - id, bai_tap_id, nguoi_dung_id, noi_dung, file_dinh_kem, diem, nhan_xet, ngay_nop
// 22. chung_chi (certificates) - id, nguoi_dung_id, khoa_hoc_id, ngay_cap, ma_chung_chi
