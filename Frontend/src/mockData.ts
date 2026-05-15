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
	vai_tro: "hoc_vien" | "giang_vien" | "admin";
}

export const users: User[] = [
	{
		id: 1,
		ten_dang_nhap: "user",
		email: "user@example.com",
		mat_khau: "user",
		ho: "Nguyen",
		ten: "User",
		anh_dai_dien: "https://picsum.photos/seed/user/100/100",
		so_dien_thoai: "0912345678",
		dia_chi: "Ho Chi Minh City",
		gioi_thieu: "Học viên yêu công nghệ",
		bi_khoa: false,
		ngay_tham_gia: "2025-01-15",
		vai_tro: "hoc_vien",
	},
	{
		id: 2,
		ten_dang_nhap: "admin",
		email: "admin@example.com",
		mat_khau: "admin",
		ho: "Tran",
		ten: "Admin",
		anh_dai_dien: "https://picsum.photos/seed/admin/100/100",
		bi_khoa: false,
		ngay_tham_gia: "2024-06-01",
		vai_tro: "admin",
	},
	{
		id: 3,
		ten_dang_nhap: "teacher",
		email: "teacher@example.com",
		mat_khau: "teacher",
		ho: "Le",
		ten: "Teacher",
		anh_dai_dien: "https://picsum.photos/seed/teacher/100/100",
		so_dien_thoai: "0987654321",
		gioi_thieu: "Giảng viên chuyên nghiệp với 10 năm kinh nghiệm",
		bi_khoa: false,
		ngay_tham_gia: "2024-03-10",
		vai_tro: "giang_vien",
	},
	{
		id: 4,
		ten_dang_nhap: "teacher2",
		email: "teacher2@example.com",
		mat_khau: "teacher2",
		ho: "Pham",
		ten: "Thi B",
		anh_dai_dien: "https://picsum.photos/seed/teacher2/100/100",
		bi_khoa: false,
		ngay_tham_gia: "2024-05-20",
		vai_tro: "giang_vien",
	},
];

// -------------------- 2. DANH MỤC --------------------
export interface Category {
	id: number;
	ten: string;
}

export const categories: Category[] = [
	{ id: 1, ten: "Lập trình" },
	{ id: 2, ten: "Thiết kế" },
	{ id: 3, ten: "Marketing" },
	{ id: 4, ten: "Kinh doanh" },
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
	trang_thai: "draft" | "completed" | "pending" | "approved" | "rejected";
	mo_ta?: string;
	yeu_cau?: string[];
	ban_thiet_bi?: string[];
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
		tieu_de: "React & Next.js Full Course",
		giang_vien_id: 3,
		danh_muc_id: 1,
		gia: 699000,
		so_luong_toi_da: 1000,
		so_luong_da_dang_ky: 1250,
		trang_thai: "completed",
		mo_ta: "Khóa học toàn diện về React và Next.js, từ cơ bản đến nâng cao. Học cách xây dựng ứng dụng web hiện đại với React hooks, Redux, Context API, và Next.js với Server Side Rendering.",
		hinh_anh: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
		muc_do: "Trung cấp",
		thoi_luong: "40 giờ",
		so_bai_hoc: 120,
		xep_hang: 4.8,
		requirements: [
			"Biết cơ bản HTML, CSS, JavaScript",
			"Máy tính có kết nối internet",
			"Đam mê học lập trình web",
		],
		whatYouLearn: [
			"Xây dựng ứng dụng React từ đầu",
			"Quản lý state với Redux và Context API",
			"Tạo API với Next.js",
			"Triển khai ứng dụng lên production",
		],
	},
	{
		id: 2,
		tieu_de: "TypeScript Fundamentals",
		giang_vien_id: 3,
		danh_muc_id: 1,
		gia: 499000,
		so_luong_da_dang_ky: 890,
		trang_thai: "completed",
		mo_ta: "Khóa học TypeScript từ cơ bản đến nâng cao. Nắm vững type system, interfaces, generics và các tính năng hiện đại của TypeScript để viết code an toàn và dễ bảo trì.",
		hinh_anh: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
		muc_do: "Cơ bản",
		thoi_luong: "20 giờ",
		so_bai_hoc: 60,
		xep_hang: 4.9,
		requirements: ["Biết JavaScript cơ bản", "Máy tính có kết nối internet"],
		whatYouLearn: [
			"Hiểu về TypeScript type system",
			"Sử dụng các tính năng nâng cao",
			"Áp dụng best practices",
		],
	},
	{
		id: 3,
		tieu_de: "Node.js Backend Development",
		giang_vien_id: 4,
		danh_muc_id: 1,
		gia: 799000,
		so_luong_da_dang_ky: 2100,
		trang_thai: "completed",
		mo_ta: "Xây dựng backend với Node.js và Express. Tìm hiểu về RESTful API, authentication, authorization, database với Prisma và deployment.",
		hinh_anh: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&h=400&fit=crop",
		muc_do: "Nâng cao",
		thoi_luong: "50 giờ",
		so_bai_hoc: 150,
		xep_hang: 4.7,
		requirements: ["Biết JavaScript", "Hiểu cơ bản về HTTP và REST API"],
		whatYouLearn: [
			"Xây dựng REST API với Express",
			"Kết nối database với Prisma",
			"Authentication và Authorization",
		],
	},
	{
		id: 4,
		tieu_de: "Python cho người mới bắt đầu",
		giang_vien_id: 4,
		danh_muc_id: 1,
		gia: 599000,
		so_luong_da_dang_ky: 3500,
		trang_thai: "completed",
		mo_ta: "Khóa học Python từ cơ bản đến nâng cao dành cho người mới bắt đầu. Học cách viết code Python, làm việc với dữ liệu và xây dựng ứng dụng thực tế.",
		hinh_anh: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=400&fit=crop",
		muc_do: "Cơ bản",
		thoi_luong: "30 giờ",
		so_bai_hoc: 85,
		xep_hang: 4.9,
		requirements: ["Không yêu cầu kinh nghiệm lập trình", "Máy tính có kết nối internet"],
		whatYouLearn: [
			"Viết chương trình Python từ cơ bản đến nâng cao",
			"Làm việc với dữ liệu và thư viện",
			"Xây dựng ứng dụng web với Flask",
			"Phân tích dữ liệu với Pandas",
		],
	},
	{
		id: 5,
		tieu_de: "Java Core - Lập trình hướng đối tượng",
		giang_vien_id: 3,
		danh_muc_id: 1,
		gia: 849000,
		so_luong_da_dang_ky: 1800,
		trang_thai: "completed",
		mo_ta: "Khóa học Java toàn diện từ cơ bản đến nâng cao. Nắm vững OOP, collections, multithreading và xây dựng ứng dụng Java hoàn chỉnh.",
		hinh_anh: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop",
		muc_do: "Trung cấp",
		thoi_luong: "45 giờ",
		so_bai_hoc: 130,
		xep_hang: 4.7,
		requirements: ["Biết cơ bản về lập trình", "Máy tính cài đặt JDK"],
		whatYouLearn: [
			"Lập trình hướng đối tượng (OOP)",
			"Collections Framework",
			"Xử lý exception và multithreading",
			"Xây dựng ứng dụng desktop với JavaFX",
		],
	},
	{
		id: 6,
		tieu_de: "Vue.js 3 - Composition API Mastery",
		giang_vien_id: 4,
		danh_muc_id: 1,
		gia: 649000,
		so_luong_da_dang_ky: 1200,
		trang_thai: "completed",
		mo_ta: "Học Vue.js 3 với Composition API - framework JavaScript tiên tiến. Xây dựng ứng dụng web hiện đại với Vue 3, Vue Router và Pinia.",
		hinh_anh: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
		muc_do: "Trung cấp",
		thoi_luong: "35 giờ",
		so_bai_hoc: 100,
		xep_hang: 4.8,
		requirements: ["Biết JavaScript và HTML/CSS", "Máy tính có kết nối internet"],
		whatYouLearn: [
			"Vue 3 Composition API",
			"Vue Router và Pinia",
			"Component development",
			"Xây dựng SPA application",
		],
	},
	{
		id: 7,
		tieu_de: "Docker & Kubernetes Cho DevOps",
		giang_vien_id: 3,
		danh_muc_id: 1,
		gia: 999000,
		so_luong_da_dang_ky: 950,
		trang_thai: "completed",
		mo_ta: "Khóa học DevOps toàn diện về Docker và Kubernetes. Học cách containerize ứng dụng, orchestration và triển khai production.",
		hinh_anh: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=600&h=400&fit=crop",
		muc_do: "Nâng cao",
		thoi_luong: "40 giờ",
		so_bai_hoc: 110,
		xep_hang: 4.8,
		requirements: ["Biết Linux cơ bản", "Hiểu về CI/CD", "Có kiến thức về cloud"],
		whatYouLearn: [
			"Docker containerization",
			"Kubernetes orchestration",
			"CI/CD pipelines",
			"Cloud deployment",
		],
	},
	{
		id: 8,
		tieu_de: "Flutter - Xây dựng ứng dụng di động",
		giang_vien_id: 4,
		danh_muc_id: 1,
		gia: 749000,
		so_luong_da_dang_ky: 1650,
		trang_thai: "completed",
		mo_ta: "Khóa học Flutter toàn diện để xây dựng ứng dụng di động đa nền tảng iOS và Android với một codebase duy nhất.",
		hinh_anh: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
		muc_do: "Trung cấp",
		thoi_luong: "38 giờ",
		so_bai_hoc: 95,
		xep_hang: 4.9,
		requirements: ["Biết lập trình cơ bản", "Máy tính cài Flutter SDK"],
		whatYouLearn: [
			"Flutter widgets và layouts",
			"State management với Provider",
			"REST API integration",
			"Publish app lên stores",
		],
	},
	{
		id: 9,
		tieu_de: "SQL & Database Design",
		giang_vien_id: 3,
		danh_muc_id: 1,
		gia: 449000,
		so_luong_da_dang_ky: 2200,
		trang_thai: "completed",
		mo_ta: "Học SQL từ cơ bản đến nâng cao và thiết kế database. Nắm vững MySQL, PostgreSQL và các nguyên tắc thiết kế database chuẩn.",
		hinh_anh: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&h=400&fit=crop",
		muc_do: "Cơ bản",
		thoi_luong: "25 giờ",
		so_bai_hoc: 70,
		xep_hang: 4.6,
		requirements: ["Không yêu cầu kinh nghiệm", "Máy tính cài đặt MySQL"],
		whatYouLearn: [
			"SQL queries và joins",
			"Database normalization",
			"Indexing và optimization",
			"Database design patterns",
		],
	},
	{
		id: 10,
		tieu_de: "Go Language - Lập trình Backend",
		giang_vien_id: 4,
		danh_muc_id: 1,
		gia: 699000,
		so_luong_da_dang_ky: 780,
		trang_thai: "completed",
		mo_ta: "Khóa học Go programming cho backend development. Xây dựng API hiệu năng cao với Go, Gin framework và PostgreSQL.",
		hinh_anh: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
		muc_do: "Trung cấp",
		thoi_luong: "32 giờ",
		so_bai_hoc: 90,
		xep_hang: 4.7,
		requirements: ["Biết một ngôn ngữ lập trình", "Hiểu HTTP và REST"],
		whatYouLearn: [
			"Go syntax và concurrency",
			"RESTful API với Gin",
			"Database với GORM",
			"Microservices architecture",
		],
	},
	{
		id: 11,
		tieu_de: "UI/UX Design Masterclass với Figma",
		giang_vien_id: 4,
		danh_muc_id: 2,
		gia: 799000,
		so_luong_da_dang_ky: 2400,
		trang_thai: "completed",
		mo_ta: "Khóa học thiết kế UI/UX toàn diện với Figma. Học cách tạo giao diện đẹp mắt, user experience tốt và design system chuyên nghiệp.",
		hinh_anh: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
		muc_do: "Trung cấp",
		thoi_luong: "28 giờ",
		so_bai_hoc: 80,
		xep_hang: 4.9,
		requirements: ["Biết cơ bản về thiết kế", "Có máy tính cài Figma"],
		whatYouLearn: [
			"Thành thạo Figma",
			"Design System và Components",
			"UX Research và Wireframe",
			"Prototyping chuyên nghiệp",
		],
	},
	{
		id: 12,
		tieu_de: "Adobe Photoshop CC Complete",
		giang_vien_id: 3,
		danh_muc_id: 2,
		gia: 549000,
		so_luong_da_dang_ky: 1850,
		trang_thai: "completed",
		mo_ta: "Khóa học Photoshop toàn diện từ cơ bản đến nâng cao. Học retouch ảnh, thiết kế đồ họa, banner và marketing materials.",
		hinh_anh: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=600&h=400&fit=crop",
		muc_do: "Cơ bản",
		thoi_luong: "22 giờ",
		so_bai_hoc: 65,
		xep_hang: 4.7,
		requirements: ["Máy tính cài Photoshop CC", "Yêu thích thiết kế đồ họa"],
		whatYouLearn: [
			"Photoshop tools và techniques",
			"Image retouching",
			"Graphic design",
			"Social media templates",
		],
	},
	{
		id: 13,
		tieu_de: "Adobe Illustrator矢量图形设计",
		giang_vien_id: 4,
		danh_muc_id: 2,
		gia: 599000,
		so_luong_da_dang_ky: 1100,
		trang_thai: "completed",
		mo_ta: "Học Adobe Illustrator để tạo logo, icon, illustration và矢量图形. Thiết kế đồ họa chuyên nghiệp cho thương hiệu.",
		hinh_anh: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop",
		muc_do: "Trung cấp",
		thoi_luong: "24 giờ",
		so_bai_hoc: 70,
		xep_hang: 4.8,
		requirements: ["Máy tính cài Illustrator", "Hiểu cơ bản về design"],
		whatYouLearn: [
			"Illustrator tools",
			"Logo và brand design",
			"Illustration techniques",
			"Vector graphics",
		],
	},
	{
		id: 14,
		tieu_de: "Motion Graphics với After Effects",
		giang_vien_id: 3,
		danh_muc_id: 2,
		gia: 849000,
		so_luong_da_dang_ky: 680,
		trang_thai: "completed",
		mo_ta: "Khóa học After Effects để tạo motion graphics, video effects và animations. Làm video quảng cáo, intro/outro chuyên nghiệp.",
		hinh_anh: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop",
		muc_do: "Nâng cao",
		thoi_luong: "35 giờ",
		so_bai_hoc: 95,
		xep_hang: 4.8,
		requirements: ["Biết cơ bản Adobe Suite", "Có máy tính mạnh"],
		whatYouLearn: [
			"After Effects essentials",
			"Animation principles",
			"VFX và compositing",
			"Video production",
		],
	},
	{
		id: 15,
		tieu_de: "Brand Identity Design - Xây dựng thương hiệu",
		giang_vien_id: 4,
		danh_muc_id: 2,
		gia: 699000,
		so_luong_da_dang_ky: 920,
		trang_thai: "completed",
		mo_ta: "Khóa học xây dựng brand identity hoàn chỉnh. Từ nghiên cứu thương hiệu đến thiết kế logo, color palette và brand guidelines.",
		hinh_anh: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop",
		muc_do: "Trung cấp",
		thoi_luong: "26 giờ",
		so_bai_hoc: 75,
		xep_hang: 4.7,
		requirements: ["Biết Illustrator/Photoshop", "Hiểu về marketing"],
		whatYouLearn: [
			"Brand strategy",
			"Logo design",
			"Brand guidelines",
			"Visual identity system",
		],
	},
	{
		id: 16,
		tieu_de: "Digital Marketing Tổng Hợp 2024",
		giang_vien_id: 3,
		danh_muc_id: 3,
		gia: 449000,
		so_luong_da_dang_ky: 3100,
		trang_thai: "completed",
		mo_ta: "Khóa học Digital Marketing toàn diện bao gồm SEO, Google Ads, Facebook Ads, Content Marketing và Email Marketing.",
		hinh_anh: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=600&h=400&fit=crop",
		muc_do: "Cơ bản",
		thoi_luong: "30 giờ",
		so_bai_hoc: 85,
		xep_hang: 4.8,
		requirements: ["Không yêu cầu kinh nghiệm", "Máy tính có kết nối internet"],
		whatYouLearn: [
			"Chiến lược Marketing tổng thể",
			"Chạy quảng cáo hiệu quả",
			"SEO website",
			"Content và Email Marketing",
		],
	},
	{
		id: 17,
		tieu_de: "SEO Master - Tối ưu công cụ tìm kiếm",
		giang_vien_id: 4,
		danh_muc_id: 3,
		gia: 599000,
		so_luong_da_dang_ky: 1500,
		trang_thai: "completed",
		mo_ta: "Khóa học SEO chuyên sâu. Học On-page SEO, Off-page SEO, technical SEO và xây dựng chiến lược SEO hiệu quả.",
		hinh_anh: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=400&fit=crop",
		muc_do: "Trung cấp",
		thoi_luong: "28 giờ",
		so_bai_hoc: 80,
		xep_hang: 4.7,
		requirements: ["Biết cơ bản HTML", "Có website để thực hành"],
		whatYouLearn: [
			"On-page và Off-page SEO",
			"Technical SEO",
			"Keyword research",
			"SEO analytics",
		],
	},
	{
		id: 18,
		tieu_de: "Facebook & Instagram Ads",
		giang_vien_id: 3,
		danh_muc_id: 3,
		gia: 499000,
		so_luong_da_dang_ky: 2100,
		trang_thai: "completed",
		mo_ta: "Học chạy quảng cáo Facebook và Instagram Ads từ cơ bản đến nâng cao. Tối ưu chiến dịch, targeting và đo lường hiệu quả.",
		hinh_anh: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
		muc_do: "Cơ bản",
		thoi_luong: "20 giờ",
		so_bai_hoc: 55,
		xep_hang: 4.8,
		requirements: ["Có tài khoản Facebook Business", "Hiểu cơ bản về marketing"],
		whatYouLearn: [
			"Facebook Ads Manager",
			"Audience targeting",
			"Campaign optimization",
			"Analytics và reporting",
		],
	},
	{
		id: 19,
		tieu_de: "Content Marketing & Copywriting",
		giang_vien_id: 4,
		danh_muc_id: 3,
		gia: 399000,
		so_luong_da_dang_ky: 1750,
		trang_thai: "completed",
		mo_ta: "Khóa học viết content và copywriting hiệu quả. Học cách tạo nội dung thu hút, SEO content và copywriting cho marketing.",
		hinh_anh: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop",
		muc_do: "Cơ bản",
		thoi_luong: "18 giờ",
		so_bai_hoc: 50,
		xep_hang: 4.6,
		requirements: ["Yêu thích viết lách", "Máy tính có kết nối internet"],
		whatYouLearn: [
			"Content strategy",
			"SEO writing",
			"Copywriting techniques",
			"Content distribution",
		],
	},
	{
		id: 20,
		tieu_de: "Startup Business - Từ ý tưởng đến thành công",
		giang_vien_id: 3,
		danh_muc_id: 4,
		gia: 899000,
		so_luong_da_dang_ky: 850,
		trang_thai: "completed",
		mo_ta: "Khóa học khởi nghiệp toàn diện. Từ việc tìm kiếm ý tưởng, lập kế hoạch kinh doanh, gọi vốn đến quản lý startup thành công.",
		hinh_anh: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop",
		muc_do: "Cơ bản",
		thoi_luong: "35 giờ",
		so_bai_hoc: 90,
		xep_hang: 4.9,
		requirements: ["Có ý tưởng kinh doanh", "Đam mê khởi nghiệp"],
		whatYouLearn: [
			"Lean startup methodology",
			"Business model canvas",
			"Fundraising strategies",
			"Team building",
		],
	},
	{
		id: 21,
		tieu_de: "Quản lý Dự án Agile/Scrum",
		giang_vien_id: 4,
		danh_muc_id: 4,
		gia: 649000,
		so_luong_da_dang_ky: 1300,
		trang_thai: "completed",
		mo_ta: "Học quản lý dự án với Agile và Scrum. Nắm vững sprint planning, daily standup, retrospective và các công cụ quản lý hiện đại.",
		hinh_anh: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=400&fit=crop",
		muc_do: "Trung cấp",
		thoi_luong: "24 giờ",
		so_bai_hoc: 65,
		xep_hang: 4.7,
		requirements: ["Có kinh nghiệm làm việc nhóm", "Hiểu cơ bản về development"],
		whatYouLearn: [
			"Agile methodology",
			"Scrum framework",
			"Sprint management",
			"Product backlog",
		],
	},
	{
		id: 22,
		tieu_de: "Leadership - Nghệ thuật lãnh đạo",
		giang_vien_id: 3,
		danh_muc_id: 4,
		gia: 749000,
		so_luong_da_dang_ky: 680,
		trang_thai: "completed",
		mo_ta: "Khóa học phát triển kỹ năng lãnh đạo. Học cách dẫn dắt đội nhóm, giao tiếp hiệu quả và tạo văn hóa doanh nghiệp tích cực.",
		hinh_anh: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop",
		muc_do: "Trung cấp",
		thoi_luong: "22 giờ",
		so_bai_hoc: 60,
		xep_hang: 4.8,
		requirements: ["Có kinh nghiệm quản lý hoặc muốn phát triển"],
		whatYouLearn: [
			"Leadership skills",
			"Team management",
			"Communication",
			"Decision making",
		],
	},
	{
		id: 23,
		tieu_de: "Sales & Negotiation Skills",
		giang_vien_id: 4,
		danh_muc_id: 4,
		gia: 549000,
		so_luong_da_dang_ky: 1450,
		trang_thai: "completed",
		mo_ta: "Khóa học kỹ năng bán hàng và đàm phán. Học chiến lược sales, kỹ thuật đàm phán và chốt deal hiệu quả.",
		hinh_anh: "https://images.unsplash.com/photo-1556745757-8d76bdb698e0?w=600&h=400&fit=crop",
		muc_do: "Cơ bản",
		thoi_luong: "18 giờ",
		so_bai_hoc: 50,
		xep_hang: 4.7,
		requirements: ["Muốn phát triển kỹ năng bán hàng", "Máy tính có kết nối internet"],
		whatYouLearn: [
			"Sales process",
			"Customer handling",
			"Negotiation techniques",
			"Closing deals",
		],
	},
	{
		id: 24,
		tieu_de: "Tài chính Cá nhân & Đầu tư",
		giang_vien_id: 3,
		danh_muc_id: 4,
		gia: 399000,
		so_luong_da_dang_ky: 2200,
		trang_thai: "completed",
		mo_ta: "Khóa học tài chính cá nhân và đầu tư. Học quản lý tài chính, đầu tư chứng khoán, bất động sản và các chiến lược wealth building.",
		hinh_anh: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&h=400&fit=crop",
		muc_do: "Cơ bản",
		thoi_luong: "16 giờ",
		so_bai_hoc: 45,
		xep_hang: 4.8,
		requirements: ["Muốn cải thiện tài chính cá nhân", "Máy tính có kết nối internet"],
		whatYouLearn: [
			"Personal finance management",
			"Investment basics",
			"Stock market investing",
			"Wealth building strategies",
		],
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
	{ id: 1, khoa_hoc_id: 1, tieu_de: "Giới thiệu React", thu_tu: 1 },
	{ id: 2, khoa_hoc_id: 1, tieu_de: "JSX và Components", thu_tu: 2 },
	{ id: 3, khoa_hoc_id: 1, tieu_de: "State và Props", thu_tu: 3 },
	{ id: 4, khoa_hoc_id: 1, tieu_de: "React Hooks", thu_tu: 4 },
	{ id: 5, khoa_hoc_id: 1, tieu_de: "Next.js Basics", thu_tu: 5 },
	// Course 2 chapters
	{ id: 6, khoa_hoc_id: 2, tieu_de: "TypeScript Overview", thu_tu: 1 },
	{ id: 7, khoa_hoc_id: 2, tieu_de: "Type System", thu_tu: 2 },
	{ id: 8, khoa_hoc_id: 2, tieu_de: "Advanced Types", thu_tu: 3 },
	// Course 3 chapters
	{ id: 9, khoa_hoc_id: 3, tieu_de: "Node.js Introduction", thu_tu: 1 },
	{ id: 10, khoa_hoc_id: 3, tieu_de: "Express Framework", thu_tu: 2 },
	{ id: 11, khoa_hoc_id: 3, tieu_de: "Database with Prisma", thu_tu: 3 },
];

// -------------------- 5. BÀI HỌC --------------------
export interface Lesson {
	id: number;
	chuong_hoc_id: number;
	tieu_de: string;
	video_url?: string;
	loai: "video" | "document" | "quiz" | "exercise";
	thoi_luong?: string;
	noi_dung?: string;
}

export const lessons: Lesson[] = [
	// Chapter 1 - React Intro
	{
		id: 1,
		chuong_hoc_id: 1,
		tieu_de: "React là gì?",
		video_url: "/uploads/videos/basic-1.mp4",
		loai: "video",
		thoi_luong: "10:00",
	},
	{
		id: 2,
		chuong_hoc_id: 1,
		tieu_de: "Cài đặt môi trường",
		video_url: "/uploads/videos/basic-2.mp4",
		loai: "video",
		thoi_luong: "15:30",
	},
	{
		id: 3,
		chuong_hoc_id: 1,
		tieu_de: "Tạo project đầu tiên",
		video_url: "/uploads/videos/lesson-1.mp4",
		loai: "video",
		thoi_luong: "20:00",
	},
	// Chapter 2 - JSX
	{
		id: 4,
		chuong_hoc_id: 2,
		tieu_de: "JSX Syntax",
		video_url: "/uploads/videos/lesson-2.mp4",
		loai: "video",
		thoi_luong: "12:00",
	},
	{
		id: 5,
		chuong_hoc_id: 2,
		tieu_de: "Components cơ bản",
		video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
		loai: "video",
		thoi_luong: "18:00",
	},
	{ id: 6, chuong_hoc_id: 2, tieu_de: "Quiz chương 2", loai: "quiz" },
	// Chapter 3 - State & Props
	{
		id: 7,
		chuong_hoc_id: 3,
		tieu_de: "useState hook",
		video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
		loai: "video",
		thoi_luong: "25:00",
	},
	{
		id: 8,
		chuong_hoc_id: 3,
		tieu_de: "Props trong React",
		video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
		loai: "video",
		thoi_luong: "15:00",
	},
	{ id: 9, chuong_hoc_id: 3, tieu_de: "Bài tập useState", loai: "exercise" },

	// Course 2: TypeScript Fundamentals - Chapter 6: TypeScript Overview
	{
		id: 10,
		chuong_hoc_id: 6,
		tieu_de: "TypeScript là gì?",
		video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
		loai: "video",
		thoi_luong: "12:00",
	},
	{
		id: 11,
		chuong_hoc_id: 6,
		tieu_de: "Cài đặt TypeScript",
		video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
		loai: "video",
		thoi_luong: "15:00",
	},
	{
		id: 12,
		chuong_hoc_id: 6,
		tieu_de: "Quiz TypeScript Overview",
		loai: "quiz",
	},

	// Course 2: TypeScript Fundamentals - Chapter 7: Type System
	{
		id: 13,
		chuong_hoc_id: 7,
		tieu_de: "Kiểu dữ liệu cơ bản",
		video_url: "/uploads/videos/basic-1.mp4",
		loai: "video",
		thoi_luong: "20:00",
	},
	{
		id: 14,
		chuong_hoc_id: 7,
		tieu_de: "Interfaces và Types",
		video_url: "/uploads/videos/basic-2.mp4",
		loai: "video",
		thoi_luong: "18:00",
	},
	{
		id: 15,
		chuong_hoc_id: 7,
		tieu_de: "Quiz Type System",
		loai: "quiz",
	},

	// Course 2: TypeScript Fundamentals - Chapter 8: Advanced Types
	{
		id: 16,
		chuong_hoc_id: 8,
		tieu_de: "Generics trong TypeScript",
		video_url: "/uploads/videos/lesson-1.mp4",
		loai: "video",
		thoi_luong: "22:00",
	},
	{
		id: 17,
		chuong_hoc_id: 8,
		tieu_de: "Utility Types và Mapped Types",
		video_url: "/uploads/videos/lesson-2.mp4",
		loai: "video",
		thoi_luong: "25:00",
	},
	{
		id: 18,
		chuong_hoc_id: 8,
		tieu_de: "Quiz Advanced Types",
		loai: "quiz",
	},

	// Course 3: Node.js Backend - Chapter 9: Node.js Introduction
	{
		id: 19,
		chuong_hoc_id: 9,
		tieu_de: "Node.js là gì?",
		video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
		loai: "video",
		thoi_luong: "10:00",
	},
	{
		id: 20,
		chuong_hoc_id: 9,
		tieu_de: "Module System trong Node.js",
		video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
		loai: "video",
		thoi_luong: "15:00",
	},
	{
		id: 21,
		chuong_hoc_id: 9,
		tieu_de: "Quiz Node.js",
		loai: "quiz",
	},

	// Course 3: Node.js Backend - Chapter 10: Express Framework
	{
		id: 22,
		chuong_hoc_id: 10,
		tieu_de: "Express cơ bản",
		video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
		loai: "video",
		thoi_luong: "20:00",
	},
	{
		id: 23,
		chuong_hoc_id: 10,
		tieu_de: "Routing và Middleware",
		video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
		loai: "video",
		thoi_luong: "25:00",
	},
	{
		id: 24,
		chuong_hoc_id: 10,
		tieu_de: "Quiz Express",
		loai: "quiz",
	},

	// Course 3: Node.js Backend - Chapter 11: Database with Prisma
	{
		id: 25,
		chuong_hoc_id: 11,
		tieu_de: "Prisma ORM",
		video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
		loai: "video",
		thoi_luong: "20:00",
	},
	{
		id: 26,
		chuong_hoc_id: 11,
		tieu_de: "CRUD Operations",
		video_url: "/uploads/videos/basic-1.mp4",
		loai: "video",
		thoi_luong: "22:00",
	},
	{
		id: 27,
		chuong_hoc_id: 11,
		tieu_de: "Quiz Database",
		loai: "quiz",
	},
];

// -------------------- 6. ĐĂNG KÝ KHÓA HỌC (ENROLLMENT) --------------------
export interface Enrollment {
	id: number;
	nguoi_dung_id: number;
	khoa_hoc_id: number;
	ngay_dang_ky: string;
}

export const enrollments: Enrollment[] = [
	{ id: 1, nguoi_dung_id: 1, khoa_hoc_id: 1, ngay_dang_ky: "2025-02-01" },
	{ id: 2, nguoi_dung_id: 1, khoa_hoc_id: 2, ngay_dang_ky: "2025-02-15" },
	{ id: 3, nguoi_dung_id: 1, khoa_hoc_id: 3, ngay_dang_ky: "2025-03-01" },
];

// -------------------- 7. TIẾN ĐỘ BÀI HỌC --------------------
export interface Progress {
	nguoi_dung_id: number;
	bai_hoc_id: number;
	da_hoan_thanh: boolean;
	ngay_hoan_thanh?: string;
}

export const progress: Progress[] = [
	{
		nguoi_dung_id: 1,
		bai_hoc_id: 1,
		da_hoan_thanh: true,
		ngay_hoan_thanh: "2025-02-02",
	},
	{
		nguoi_dung_id: 1,
		bai_hoc_id: 2,
		da_hoan_thanh: true,
		ngay_hoan_thanh: "2025-02-03",
	},
	{
		nguoi_dung_id: 1,
		bai_hoc_id: 3,
		da_hoan_thanh: true,
		ngay_hoan_thanh: "2025-02-04",
	},
	{
		nguoi_dung_id: 1,
		bai_hoc_id: 4,
		da_hoan_thanh: true,
		ngay_hoan_thanh: "2025-02-05",
	},
	{ nguoi_dung_id: 1, bai_hoc_id: 5, da_hoan_thanh: false },
	{ nguoi_dung_id: 1, bai_hoc_id: 6, da_hoan_thanh: false },

	// Course 2: TypeScript - completed video lessons
	{
		nguoi_dung_id: 1,
		bai_hoc_id: 10,
		da_hoan_thanh: true,
		ngay_hoan_thanh: "2025-03-05",
	},
	{
		nguoi_dung_id: 1,
		bai_hoc_id: 11,
		da_hoan_thanh: true,
		ngay_hoan_thanh: "2025-03-06",
	},
	{
		nguoi_dung_id: 1,
		bai_hoc_id: 12,
		da_hoan_thanh: true,
		ngay_hoan_thanh: "2025-03-07",
	},
	{
		nguoi_dung_id: 1,
		bai_hoc_id: 13,
		da_hoan_thanh: true,
		ngay_hoan_thanh: "2025-03-08",
	},
	{
		nguoi_dung_id: 1,
		bai_hoc_id: 14,
		da_hoan_thanh: true,
		ngay_hoan_thanh: "2025-03-09",
	},
	{
		nguoi_dung_id: 1,
		bai_hoc_id: 15,
		da_hoan_thanh: true,
		ngay_hoan_thanh: "2025-03-10",
	},
	{
		nguoi_dung_id: 1,
		bai_hoc_id: 16,
		da_hoan_thanh: true,
		ngay_hoan_thanh: "2025-03-11",
	},
	{
		nguoi_dung_id: 1,
		bai_hoc_id: 17,
		da_hoan_thanh: true,
		ngay_hoan_thanh: "2025-03-12",
	},
	{
		nguoi_dung_id: 1,
		bai_hoc_id: 18,
		da_hoan_thanh: true,
		ngay_hoan_thanh: "2025-03-13",
	},

	// Course 3: Node.js - completed video lessons
	{
		nguoi_dung_id: 1,
		bai_hoc_id: 19,
		da_hoan_thanh: true,
		ngay_hoan_thanh: "2025-03-14",
	},
	{
		nguoi_dung_id: 1,
		bai_hoc_id: 20,
		da_hoan_thanh: true,
		ngay_hoan_thanh: "2025-03-15",
	},
	{
		nguoi_dung_id: 1,
		bai_hoc_id: 21,
		da_hoan_thanh: true,
		ngay_hoan_thanh: "2025-03-16",
	},
	{
		nguoi_dung_id: 1,
		bai_hoc_id: 22,
		da_hoan_thanh: true,
		ngay_hoan_thanh: "2025-03-17",
	},
	{
		nguoi_dung_id: 1,
		bai_hoc_id: 23,
		da_hoan_thanh: true,
		ngay_hoan_thanh: "2025-03-18",
	},
	{
		nguoi_dung_id: 1,
		bai_hoc_id: 24,
		da_hoan_thanh: true,
		ngay_hoan_thanh: "2025-03-19",
	},
	{
		nguoi_dung_id: 1,
		bai_hoc_id: 25,
		da_hoan_thanh: true,
		ngay_hoan_thanh: "2025-03-20",
	},
	{
		nguoi_dung_id: 1,
		bai_hoc_id: 26,
		da_hoan_thanh: true,
		ngay_hoan_thanh: "2025-03-21",
	},
	{
		nguoi_dung_id: 1,
		bai_hoc_id: 27,
		da_hoan_thanh: true,
		ngay_hoan_thanh: "2025-03-22",
	},
];

// -------------------- 8. ĐƠN HÀNG --------------------
export interface Order {
	id: number;
	nguoi_dung_id: number;
	tong_tien: number;
	trang_thai: "pending" | "success" | "failed" | "refunded";
	ngay_dat: string;
}

export interface OrderItem {
	id: number;
	don_hang_id: number;
	khoa_hoc_id: number;
	gia: number;
}

export const orders: Order[] = [
	{
		id: 1,
		nguoi_dung_id: 1,
		tong_tien: 699000,
		trang_thai: "success",
		ngay_dat: "2025-02-01",
	},
	{
		id: 2,
		nguoi_dung_id: 1,
		tong_tien: 499000,
		trang_thai: "success",
		ngay_dat: "2025-02-15",
	},
	{
		id: 3,
		nguoi_dung_id: 1,
		tong_tien: 799000,
		trang_thai: "success",
		ngay_dat: "2025-03-01",
	},
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
	trang_thai: "pending" | "success" | "failed";
	ngay_thanh_toan: string;
	phuong_thuc?: string;
}

export const payments: Payment[] = [
	{
		id: 1,
		don_hang_id: 1,
		so_tien: 699000,
		trang_thai: "success",
		ngay_thanh_toan: "2025-02-01",
		phuong_thuc: "vnpay",
	},
	{
		id: 2,
		don_hang_id: 2,
		so_tien: 499000,
		trang_thai: "success",
		ngay_thanh_toan: "2025-02-15",
		phuong_thuc: "vnpay",
	},
	{
		id: 3,
		don_hang_id: 3,
		so_tien: 799000,
		trang_thai: "success",
		ngay_thanh_toan: "2025-03-01",
		phuong_thuc: "stripe",
	},
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
	{
		id: 1,
		bai_hoc_id: 1,
		nguoi_dung_id: 1,
		noi_dung: "Bài giảng rất dễ hiểu!",
		ngay_tao: "2025-02-02",
	},
	{
		id: 2,
		bai_hoc_id: 1,
		nguoi_dung_id: 2,
		noi_dung: "Cảm ơn giảng viên",
		ngay_tao: "2025-02-03",
	},
	{
		id: 3,
		bai_hoc_id: 1,
		nguoi_dung_id: 3,
		noi_dung: "Cảm ơn phản hồi!",
		parent_id: 1,
		ngay_tao: "2025-02-04",
	},
	{
		id: 4,
		bai_hoc_id: 4,
		nguoi_dung_id: 1,
		noi_dung: "JSX syntax khá thú vị",
		ngay_tao: "2025-02-05",
	},
];

// -------------------- 11. THÔNG BÁO --------------------
export interface Notification {
	id: number;
	nguoi_dung_id: number;
	tieu_de: string;
	noi_dung: string;
	loai: "info" | "success" | "warning" | "error";
	da_doc: boolean;
	ngay_tao: string;
	link?: string;
}

export const notifications: Notification[] = [
	{
		id: 1,
		nguoi_dung_id: 1,
		tieu_de: "Đăng ký khóa học thành công",
		noi_dung: "Bạn đã đăng ký khóa React & Next.js Full Course",
		loai: "success",
		da_doc: false,
		ngay_tao: "2025-02-01",
		link: "/my-courses",
	},
	{
		id: 2,
		nguoi_dung_id: 1,
		tieu_de: "Khóa học mới",
		noi_dung: "Khóa TypeScript Fundamentals đã được cập nhật",
		loai: "info",
		da_doc: true,
		ngay_tao: "2025-02-10",
		link: "/course/2",
	},
	{
		id: 3,
		nguoi_dung_id: 1,
		tieu_de: "Nhắc nhở",
		noi_dung: "Hãy hoàn thành bài tập tuần này",
		loai: "warning",
		da_doc: true,
		ngay_tao: "2025-02-15",
		link: "/assignments",
	},
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
	{
		id: 1,
		nguoi_dung_id: 1,
		tieu_de: "Cách học React hiệu quả?",
		noi_dung: "Mọi người có tip gì để học React nhanh không?",
		khoa_hoc_id: 1,
		luot_xem: 150,
		luot_tra_loi: 5,
		ngay_tao: "2025-02-01",
		ngay_cap_nhat: "2025-02-02",
	},
	{
		id: 2,
		nguoi_dung_id: 2,
		tieu_de: "TypeScript vs JavaScript",
		noi_dung: "Nên học TypeScript trước hay sau JS?",
		luot_xem: 200,
		luot_tra_loi: 8,
		ngay_tao: "2025-02-05",
		ngay_cap_nhat: "2025-02-06",
	},
	{
		id: 3,
		nguoi_dung_id: 3,
		tieu_de: "Hỏi về Next.js SSR",
		noi_dung: "Khi nào nên dùng SSR trong Next.js?",
		khoa_hoc_id: 1,
		luot_xem: 80,
		luot_tra_loi: 3,
		ngay_tao: "2025-02-10",
		ngay_cap_nhat: "2025-02-11",
	},
];

export const forumReplies: ForumReply[] = [
	{
		id: 1,
		topic_id: 1,
		nguoi_dung_id: 3,
		noi_dung: "Mình recommend học kỹ JS trước rồi mới qua React nhé!",
		ngay_tao: "2025-02-01",
	},
	{
		id: 2,
		topic_id: 1,
		nguoi_dung_id: 1,
		noi_dung: "Cảm ơn bạn, sẽ làm theo gợi ý!",
		ngay_tao: "2025-02-02",
	},
	{
		id: 3,
		topic_id: 2,
		nguoi_dung_id: 3,
		noi_dung:
			"Nên học JS trước, sau đó mới TypeScript để hiểu rõ hơn về types.",
		ngay_tao: "2025-02-05",
	},
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
	nhan_xet?: string;
	ngay_lam: string;
}

export const quizzes: Quiz[] = [
	{
		id: 1,
		bai_hoc_id: 6,
		tieu_de: "Quiz chương 2: JSX và Components",
		thoi_gian_lam: 15,
		so_cau_hoi: 10,
	},
	{
		id: 2,
		bai_hoc_id: 7,
		tieu_de: "Quiz chương 3: State và Props",
		thoi_gian_lam: 20,
		so_cau_hoi: 15,
	},
	// Course 2 quizzes
	{
		id: 3,
		bai_hoc_id: 12,
		tieu_de: "Quiz TypeScript Overview",
		thoi_gian_lam: 15,
		so_cau_hoi: 5,
	},
	{
		id: 4,
		bai_hoc_id: 15,
		tieu_de: "Quiz Type System",
		thoi_gian_lam: 15,
		so_cau_hoi: 5,
	},
	{
		id: 5,
		bai_hoc_id: 18,
		tieu_de: "Quiz Advanced Types",
		thoi_gian_lam: 20,
		so_cau_hoi: 5,
	},
	// Course 3 quizzes
	{
		id: 6,
		bai_hoc_id: 21,
		tieu_de: "Quiz Node.js",
		thoi_gian_lam: 15,
		so_cau_hoi: 5,
	},
	{
		id: 7,
		bai_hoc_id: 24,
		tieu_de: "Quiz Express",
		thoi_gian_lam: 15,
		so_cau_hoi: 5,
	},
	{
		id: 8,
		bai_hoc_id: 27,
		tieu_de: "Quiz Database",
		thoi_gian_lam: 20,
		so_cau_hoi: 5,
	},
];

export const quizQuestions: QuizQuestion[] = [
	{
		id: 1,
		quiz_id: 1,
		cau_hoi: "JSX là gì?",
		lua_chon: [
			{ id: "a", text: "JavaScript XML" },
			{ id: "b", text: "Java Syntax Extension" },
			{ id: "c", text: "JavaScript Extension" },
			{ id: "d", text: "JavaScript Extra" },
		],
		dap_an_dung: "c",
	},
	{
		id: 2,
		quiz_id: 1,
		cau_hoi: "Để render JSX trong React ta dùng?",
		lua_chon: [
			{ id: "a", text: "render()" },
			{ id: "b", text: "ReactDOM.render()" },
			{ id: "c", text: "React.render()" },
			{ id: "d", text: "renderDOM()" },
		],
		dap_an_dung: "b",
	},
	{
		id: 3,
		quiz_id: 1,
		cau_hoi: "Component trong React là gì?",
		lua_chon: [
			{ id: "a", text: "Một hàm JavaScript" },
			{ id: "b", text: "Một đối tượng JavaScript" },
			{ id: "c", text: "Một khối code có thể tái sử dụng" },
			{ id: "d", text: "Một file HTML" },
		],
		dap_an_dung: "c",
	},

	// Quiz 3: TypeScript Overview
	{
		id: 4,
		quiz_id: 3,
		cau_hoi: "TypeScript là gì?",
		lua_chon: [
			{ id: "a", text: "Một ngôn ngữ lập trình mới" },
			{ id: "b", text: "JavaScript với kiểu tĩnh" },
			{ id: "c", text: "Một framework" },
			{ id: "d", text: "Một thư viện CSS" },
		],
		dap_an_dung: "b",
	},
	{
		id: 5,
		quiz_id: 3,
		cau_hoi: "File TypeScript có đuôi gì?",
		lua_chon: [
			{ id: "a", text: ".js" },
			{ id: "b", text: ".tsx" },
			{ id: "c", text: ".ts" },
			{ id: "d", text: ".jsx" },
		],
		dap_an_dung: "c",
	},
	{
		id: 6,
		quiz_id: 3,
		cau_hoi: "Câu lệnh nào dùng để cài đặt TypeScript?",
		lua_chon: [
			{ id: "a", text: "npm install typescript" },
			{ id: "b", text: "npm install -g typescript" },
			{ id: "c", text: "npm add typescript" },
			{ id: "d", text: "npm get typescript" },
		],
		dap_an_dung: "b",
	},
	{
		id: 7,
		quiz_id: 3,
		cau_hoi: "File tsconfig.json dùng để làm gì?",
		lua_chon: [
			{ id: "a", text: "Cấu hình TypeScript" },
			{ id: "b", text: "Chứa mã nguồn TypeScript" },
			{ id: "c", text: "File log" },
			{ id: "d", text: "File test" },
		],
		dap_an_dung: "a",
	},
	{
		id: 8,
		quiz_id: 3,
		cau_hoi: "Từ khóa nào dùng để khai báo kiểu trong TypeScript?",
		lua_chon: [
			{ id: "a", text: "type" },
			{ id: "b", text: "var" },
			{ id: "c", text: "let" },
			{ id: "d", text: "const" },
		],
		dap_an_dung: "a",
	},

	// Quiz 4: Type System
	{
		id: 9,
		quiz_id: 4,
		cau_hoi: "Kiểu dữ liệu nào KHÔNG phải kiểu cơ bản trong TypeScript?",
		lua_chon: [
			{ id: "a", text: "string" },
			{ id: "b", text: "number" },
			{ id: "c", text: "integer" },
			{ id: "d", text: "boolean" },
		],
		dap_an_dung: "c",
	},
	{
		id: 10,
		quiz_id: 4,
		cau_hoi: "Interface dùng để làm gì?",
		lua_chon: [
			{ id: "a", text: "Định nghĩa cấu trúc đối tượng" },
			{ id: "b", text: "Tạo instance mới" },
			{ id: "c", text: "Khai báo biến" },
			{ id: "d", text: "Import module" },
		],
		dap_an_dung: "a",
	},
	{
		id: 11,
		quiz_id: 4,
		cau_hoi: "Từ khóa nào dùng để kế thừa interface?",
		lua_chon: [
			{ id: "a", text: "extends" },
			{ id: "b", text: "implements" },
			{ id: "c", text: "inherits" },
			{ id: "d", text: "extends" },
		],
		dap_an_dung: "d",
	},
	{
		id: 12,
		quiz_id: 4,
		cau_hoi: "Kiểu union trong TypeScript dùng toán tử nào?",
		lua_chon: [
			{ id: "a", text: "&" },
			{ id: "b", text: "|" },
			{ id: "c", text: "^" },
			{ id: "d", text: ":" },
		],
		dap_an_dung: "b",
	},
	{
		id: 13,
		quiz_id: 4,
		cau_hoi: "Optional property trong interface được đánh dấu bằng?",
		lua_chon: [
			{ id: "a", text: "?" },
			{ id: "b", text: "!" },
			{ id: "c", text: "*" },
			{ id: "d", text: "-" },
		],
		dap_an_dung: "a",
	},

	// Quiz 5: Advanced Types
	{
		id: 14,
		quiz_id: 5,
		cau_hoi: "Generics trong TypeScript cho phép?",
		lua_chon: [
			{ id: "a", text: "Tạo component tái sử dụng với nhiều kiểu" },
			{ id: "b", text: "Tạo biến toàn cục" },
			{ id: "c", text: "Import module" },
			{ id: "d", text: "Khai báo hằng số" },
		],
		dap_an_dung: "a",
	},
	{
		id: 15,
		quiz_id: 5,
		cau_hoi: "Từ khóa nào dùng để khai báo generic?",
		lua_chon: [
			{ id: "a", text: "<T>" },
			{ id: "b", text: "[T]" },
			{ id: "c", text: "{T}" },
			{ id: "d", text: "(T)" },
		],
		dap_an_dung: "a",
	},
	{
		id: 16,
		quiz_id: 5,
		cau_hoi: "Partial&lt;T&gt; dùng để làm gì?",
		lua_chon: [
			{ id: "a", text: "Biến tất cả thuộc tính thành optional" },
			{ id: "b", text: "Biến tất cả thuộc tính thành required" },
			{ id: "c", text: "Xóa tất cả thuộc tính" },
			{ id: "d", text: "Thêm thuộc tính mới" },
		],
		dap_an_dung: "a",
	},
	{
		id: 17,
		quiz_id: 5,
		cau_hoi: "Pick&lt;T, K&gt; trong TypeScript dùng để?",
		lua_chon: [
			{ id: "a", text: "Chọn một số thuộc tính từ T" },
			{ id: "b", text: "Bỏ qua một số thuộc tính" },
			{ id: "c", text: "Đổi tên thuộc tính" },
			{ id: "d", text: "Thêm thuộc tính mới" },
		],
		dap_an_dung: "a",
	},
	{
		id: 18,
		quiz_id: 5,
		cau_hoi: "Readonly&lt;T&gt; làm gì?",
		lua_chon: [
			{ id: "a", text: "Biến tất cả thuộc tính thành read-only" },
			{ id: "b", text: "Xóa tất cả thuộc tính" },
			{ id: "c", text: "Thêm thuộc tính có thể ghi" },
			{ id: "d", text: "Tạo bản sao của T" },
		],
		dap_an_dung: "a",
	},

	// Quiz 6: Node.js
	{
		id: 19,
		quiz_id: 6,
		cau_hoi: "Node.js chạy trên môi trường nào?",
		lua_chon: [
			{ id: "a", text: "V8 JavaScript Engine" },
			{ id: "b", text: "SpiderMonkey" },
			{ id: "c", text: "ChakraCore" },
			{ id: "d", text: "JavaScriptCore" },
		],
		dap_an_dung: "a",
	},
	{
		id: 20,
		quiz_id: 6,
		cau_hoi: "Node.js được tạo bởi?",
		lua_chon: [
			{ id: "a", text: "Ryan Dahl" },
			{ id: "b", text: "Brendan Eich" },
			{ id: "c", text: "Mark Zuckerberg" },
			{ id: "d", text: "Larry Page" },
		],
		dap_an_dung: "a",
	},
	{
		id: 21,
		quiz_id: 6,
		cau_hoi: "Module system mặc định của Node.js là?",
		lua_chon: [
			{ id: "a", text: "CommonJS" },
			{ id: "b", text: "ES Modules" },
			{ id: "c", text: "AMD" },
			{ id: "d", text: "UMD" },
		],
		dap_an_dung: "a",
	},
	{
		id: 22,
		quiz_id: 6,
		cau_hoi: "Hàm require() trong Node.js dùng để?",
		lua_chon: [
			{ id: "a", text: "Import module" },
			{ id: "b", text: "Export module" },
			{ id: "c", text: "Tạo module" },
			{ id: "d", text: "Xóa module" },
		],
		dap_an_dung: "a",
	},
	{
		id: 23,
		quiz_id: 6,
		cau_hoi: "npm là viết tắt của?",
		lua_chon: [
			{ id: "a", text: "Node Package Manager" },
			{ id: "b", text: "Node Project Manager" },
			{ id: "c", text: "New Package Manager" },
			{ id: "d", text: "Node Program Manager" },
		],
		dap_an_dung: "a",
	},

	// Quiz 7: Express
	{
		id: 24,
		quiz_id: 7,
		cau_hoi: "Express là gì?",
		lua_chon: [
			{ id: "a", text: "Web framework cho Node.js" },
			{ id: "b", text: "Database" },
			{ id: "c", text: "CSS framework" },
			{ id: "d", text: "Testing library" },
		],
		dap_an_dung: "a",
	},
	{
		id: 25,
		quiz_id: 7,
		cau_hoi: "Phương thức nào dùng để định nghĩa route GET?",
		lua_chon: [
			{ id: "a", text: "app.get()" },
			{ id: "b", text: "app.post()" },
			{ id: "c", text: "app.put()" },
			{ id: "d", text: "app.delete()" },
		],
		dap_an_dung: "a",
	},
	{
		id: 26,
		quiz_id: 7,
		cau_hoi: "Middleware trong Express là?",
		lua_chon: [
			{ id: "a", text: "Hàm xử lý request trước khi đến route" },
			{ id: "b", text: "Một loại database" },
			{ id: "c", text: "Template engine" },
			{ id: "d", text: "File system" },
		],
		dap_an_dung: "a",
	},
	{
		id: 27,
		quiz_id: 7,
		cau_hoi: "Để parse JSON body trong Express ta dùng?",
		lua_chon: [
			{ id: "a", text: "express.json()" },
			{ id: "b", text: "express.urlencoded()" },
			{ id: "c", text: "express.text()" },
			{ id: "d", text: "express.raw()" },
		],
		dap_an_dung: "a",
	},
	{
		id: 28,
		quiz_id: 7,
		cau_hoi: "Để gửi response JSON trong Express ta dùng?",
		lua_chon: [
			{ id: "a", text: "res.json()" },
			{ id: "b", text: "res.send()" },
			{ id: "c", text: "res.render()" },
			{ id: "d", text: "res.file()" },
		],
		dap_an_dung: "a",
	},

	// Quiz 8: Database
	{
		id: 29,
		quiz_id: 8,
		cau_hoi: "Prisma là gì?",
		lua_chon: [
			{ id: "a", text: "ORM cho Node.js" },
			{ id: "b", text: "Web framework" },
			{ id: "c", text: "Database" },
			{ id: "d", text: "Testing tool" },
		],
		dap_an_dung: "a",
	},
	{
		id: 30,
		quiz_id: 8,
		cau_hoi: "Prisma schema được định nghĩa trong file?",
		lua_chon: [
			{ id: "a", text: "schema.prisma" },
			{ id: "b", text: "prisma.config.js" },
			{ id: "c", text: "database.ts" },
			{ id: "d", text: "prisma.json" },
		],
		dap_an_dung: "a",
	},
	{
		id: 31,
		quiz_id: 8,
		cau_hoi: "Lệnh nào để migrate database trong Prisma?",
		lua_chon: [
			{ id: "a", text: "npx prisma migrate dev" },
			{ id: "b", text: "npx prisma push" },
			{ id: "c", text: "npm prisma migrate" },
			{ id: "d", text: "prisma migrate" },
		],
		dap_an_dung: "a",
	},
	{
		id: 32,
		quiz_id: 8,
		cau_hoi: "CRUD viết tắt của?",
		lua_chon: [
			{ id: "a", text: "Create, Read, Update, Delete" },
			{ id: "b", text: "Copy, Run, Update, Drop" },
			{ id: "c", text: "Create, Run, Use, Drop" },
			{ id: "d", text: "Copy, Read, Use, Delete" },
		],
		dap_an_dung: "a",
	},
	{
		id: 33,
		quiz_id: 8,
		cau_hoi: "Prisma Client được tạo bằng lệnh nào?",
		lua_chon: [
			{ id: "a", text: "npx prisma generate" },
			{ id: "b", text: "npx prisma client" },
			{ id: "c", text: "npx prisma build" },
			{ id: "d", text: "npx prisma start" },
		],
		dap_an_dung: "a",
	},
];

export const quizAttempts: QuizAttempt[] = [
	{
		id: 1,
		quiz_id: 1,
		nguoi_dung_id: 1,
		diem: 8,
		nhan_xet: "Làm tốt!",
		ngay_lam: "2025-02-05",
	},
];

// -------------------- 14. ANALYTICS & INSTRUCTOR DATA --------------------
export const instructorList = [
	{
		id: 3,
		ten_dang_nhap: "teacher",
		email: "teacher@example.com",
		ten: "Teacher",
		ho: "Le",
		anh_dai_dien: "https://picsum.photos/seed/teacher/100/100",
		gioi_thieu: "Giảng viên chuyên nghiệp",
		ngay_tham_gia: "2024-03-10",
	},
	{
		id: 4,
		ten_dang_nhap: "teacher2",
		email: "teacher2@example.com",
		ten: "Thi B",
		ho: "Pham",
		anh_dai_dien: "https://picsum.photos/seed/teacher2/100/100",
		gioi_thieu: "Giảng viên thiết kế",
		ngay_tham_gia: "2024-05-20",
	},
];

export const instructorStudentsData = [
	{
		id: 1,
		ten_dang_nhap: "user1",
		email: "user1@example.com",
		ten: "Van A",
		ho: "Nguyen",
		anh_dai_dien: null,
		ngay_tham_gia: "2024-01-15",
		khoa_hoc: [
			{
				id: 1,
				tieu_de: "React & Next.js Full Course",
				ngay_dang_ky: "2025-02-01",
			},
		],
	},
	{
		id: 2,
		ten_dang_nhap: "user2",
		email: "user2@example.com",
		ten: "Thi B",
		ho: "Tran",
		anh_dai_dien: null,
		ngay_tham_gia: "2024-02-20",
		khoa_hoc: [
			{ id: 2, tieu_de: "TypeScript Fundamentals", ngay_dang_ky: "2025-02-10" },
		],
	},
];

export const instructorAnalyticsData = {
	tong_doanh_thu: 131900000,
	tong_hoc_vien: 2140,
	so_khoa_hoc: 3,
	khoa_hoc: [
		{
			id: 1,
			tieu_de: "React & Next.js Full Course",
			so_luong_da_dang_ky: 1250,
			gia: 699000,
			doanh_thu: 873750000,
		},
		{
			id: 2,
			tieu_de: "TypeScript Fundamentals",
			so_luong_da_dang_ky: 890,
			gia: 499000,
			doanh_thu: 444110000,
		},
		{
			id: 3,
			tieu_de: "Node.js Backend",
			so_luong_da_dang_ky: 0,
			gia: 799000,
			doanh_thu: 0,
		},
	],
	dang_ky_gan_day: [
		{
			ho_ten: "Nguyen Van A",
			khoa_hoc: "React & Next.js Full Course",
			ngay_dang_ky: "2025-03-01",
		},
		{
			ho_ten: "Tran Thi B",
			khoa_hoc: "TypeScript Fundamentals",
			ngay_dang_ky: "2025-02-28",
		},
	],
};

export const analyticsOverview = {
	tong_nguoi_dung: 150,
	tong_khoa_hoc: 45,
	khoa_chờ_duyệt: 5,
	khoa_da_duyet: 32,
	tong_don_hang: 280,
	tong_doanh_thu: 125000000,
	bieu_do_doanh_thu: [
		{ ngay: "2025-02-01", doanh_thu: 5000000 },
		{ ngay: "2025-02-02", doanh_thu: 7200000 },
		{ ngay: "2025-02-03", doanh_thu: 4100000 },
		{ ngay: "2025-02-04", doanh_thu: 8900000 },
		{ ngay: "2025-02-05", doanh_thu: 6500000 },
	],
};

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
	{
		id: 1,
		bai_hoc_id: 9,
		tieu_de: "Bài tập useState",
		mo_ta: "Tạo counter app sử dụng useState",
		bat_buoc: true,
		han_nop: "2025-02-20",
	},
	{
		id: 2,
		bai_hoc_id: 10,
		tieu_de: "Bài tập Props",
		mo_ta: "Tạo component hiển thị thông tin user",
		bat_buoc: false,
		han_nop: "2025-02-25",
	},
];

export const assignmentSubmissions: AssignmentSubmission[] = [
	{
		id: 1,
		bai_tap_id: 1,
		nguoi_dung_id: 1,
		noi_dung: "Đã hoàn thành bài tập",
		diem: 9,
		nhan_xet: "Làm tốt lắm!",
		ngay_nop: "2025-02-15",
	},
];

// -------------------- 15. UI MOCKS --------------------
export const adminDashboardCourses = [
	{
		id: 1,
		title: "React & Next.js Full Course",
		instructor: "Trần Thị B",
		hinhAnh: "https://picsum.photos/seed/react/300/200",
		students: 1250,
		price: 699000,
		status: "approved" as const,
	},
	{
		id: 2,
		title: "TypeScript Fundamentals",
		instructor: "Trần Thị B",
		hinhAnh: "https://picsum.photos/seed/ts/300/200",
		students: 890,
		price: 499000,
		status: "approved" as const,
	},
	{
		id: 3,
		title: "Node.js Backend",
		instructor: "Lê Văn C",
		hinhAnh: "https://picsum.photos/seed/node/300/200",
		students: 200,
		price: 799000,
		status: "pending" as const,
	},
	{
		id: 4,
		title: "Vue.js Complete",
		instructor: "Lê Văn C",
		hinhAnh: "https://picsum.photos/seed/vue/300/200",
		students: 0,
		price: 599000,
		status: "draft" as const,
	},
];

export const adminUsers = [
	{
		id: 1,
		name: "Nguyễn Văn A",
		email: "user@example.com",
		role: "hoc_vien" as const,
		status: "active" as const,
		joinedDate: "2024-01-15",
	},
	{
		id: 2,
		name: "Trần Thị B",
		email: "teacher@example.com",
		role: "giang_vien" as const,
		status: "active" as const,
		joinedDate: "2024-02-20",
	},
	{
		id: 3,
		name: "Lê Văn C",
		email: "levanc@example.com",
		role: "giang_vien" as const,
		status: "active" as const,
		joinedDate: "2024-02-25",
	},
	{
		id: 4,
		name: "Phạm Thị D",
		email: "phamt@example.com",
		role: "hoc_vien" as const,
		status: "banned" as const,
		joinedDate: "2024-03-10",
	},
];

export const adminOrders = [
	{
		id: 1,
		user: "Nguyễn Văn A",
		course: "React & Next.js",
		amount: 699000,
		status: "success" as const,
		date: "2024-07-15",
	},
	{
		id: 2,
		user: "Trần Thị B",
		course: "TypeScript",
		amount: 499000,
		status: "success" as const,
		date: "2024-07-14",
	},
	{
		id: 3,
		user: "Lê Văn C",
		course: "Node.js",
		amount: 799000,
		status: "success" as const,
		date: "2024-07-13",
	},
	{
		id: 4,
		user: "Phạm Thị D",
		course: "React & Next.js",
		amount: 699000,
		status: "success" as const,
		date: "2024-06-12",
	},
	{
		id: 5,
		user: "Hoàng Văn E",
		course: "Python",
		amount: 599000,
		status: "success" as const,
		date: "2024-06-10",
	},
	{
		id: 6,
		user: "Nguyễn Thị F",
		course: "Vue.js",
		amount: 549000,
		status: "success" as const,
		date: "2024-05-08",
	},
	{
		id: 7,
		user: "Trần Văn G",
		course: "SQL",
		amount: 449000,
		status: "success" as const,
		date: "2024-05-05",
	},
];

export const adminReports = [
	{
		id: 1,
		reporterId: 1,
		reporterName: "Nguyễn Văn A",
		reportedUserId: 4,
		reportedUserName: "Phạm Thị D",
		reason: "Spam nội dung không phù hợp",
		status: "pending" as const,
		createdAt: "2024-04-15",
	},
	{
		id: 2,
		reporterId: 2,
		reporterName: "Trần Thị B",
		reportedUserId: 1,
		reportedUserName: "Nguyễn Văn A",
		reason: "Quấy rối trong khóa học",
		status: "pending" as const,
		createdAt: "2024-04-14",
	},
];

export const adminMonthRevenue = [
	{ month: "T1", revenue: 12500000 },
	{ month: "T2", revenue: 18200000 },
	{ month: "T3", revenue: 15800000 },
	{ month: "T4", revenue: 22100000 },
	{ month: "T5", revenue: 28500000 },
	{ month: "T6", revenue: 52400000 },
	{ month: "T7", revenue: 34950000 },
];

export const teacherDashboardCourses = [
	{
		id: 1,
		title: "React & Next.js Full Course",
		hinhAnh: "https://picsum.photos/seed/react/300/200",
		students: 1250,
		revenue: 875000000,
		rating: 4.8,
		lessons: 50,
		status: "approved" as const,
	},
	{
		id: 2,
		title: "TypeScript Fundamentals",
		hinhAnh: "https://picsum.photos/seed/ts/300/200",
		students: 890,
		revenue: 444000000,
		rating: 4.9,
		lessons: 30,
		status: "approved" as const,
	},
	{
		id: 3,
		title: "Node.js Backend",
		hinhAnh: "https://picsum.photos/seed/node/300/200",
		students: 200,
		revenue: 160000000,
		rating: 4.6,
		lessons: 40,
		status: "pending" as const,
	},
];

export const teacherDashboardStudents = [
	{
		id: 1,
		name: "Nguyễn Văn A",
		avatar: "NVA",
		course: "React & Next.js Full Course",
		progress: 75,
		enrolledDate: "15/01/2026",
	},
	{
		id: 2,
		name: "Trần Thị B",
		avatar: "TTB",
		course: "TypeScript Fundamentals",
		progress: 45,
		enrolledDate: "20/01/2026",
	},
	{
		id: 3,
		name: "Lê Văn C",
		avatar: "LVC",
		course: "React & Next.js Full Course",
		progress: 30,
		enrolledDate: "22/01/2026",
	},
	{
		id: 4,
		name: "Phạm Thị D",
		avatar: "PTD",
		course: "Node.js Backend",
		progress: 90,
		enrolledDate: "25/01/2026",
	},
	{
		id: 5,
		name: "Hoàng Văn E",
		avatar: "HVE",
		course: "TypeScript Fundamentals",
		progress: 60,
		enrolledDate: "28/01/2026",
	},
];

export const teacherRevenueData = [
	{ label: "T2", value: 12.5 },
	{ label: "T3", value: 18.2 },
	{ label: "T4", value: 15.8 },
	{ label: "T5", value: 22.1 },
	{ label: "T6", value: 28.5 },
	{ label: "T7", value: 52.4 },
];

export const teacherStudents = [
	{
		id: 1,
		name: "Nguyen Van An",
		email: "an.nguyen@example.com",
		phone: "0901 234 567",
		course: "React & Next.js Full Course",
		progress: 82,
		enrolledDate: "15/01/2026",
		lastActive: "2 giờ trước",
		status: "active" as const,
	},
	{
		id: 2,
		name: "Tran Thi Bich",
		email: "bich.tran@example.com",
		phone: "0902 345 678",
		course: "TypeScript Fundamentals",
		progress: 46,
		enrolledDate: "20/01/2026",
		lastActive: "Hôm qua",
		status: "active" as const,
	},
	{
		id: 3,
		name: "Le Minh Chau",
		email: "chau.le@example.com",
		phone: "0903 456 789",
		course: "React & Next.js Full Course",
		progress: 18,
		enrolledDate: "22/01/2026",
		lastActive: "5 ngày trước",
		status: "at-risk" as const,
	},
	{
		id: 4,
		name: "Pham Gia Huy",
		email: "huy.pham@example.com",
		phone: "0904 567 890",
		course: "Node.js Backend",
		progress: 100,
		enrolledDate: "25/01/2026",
		lastActive: "1 giờ trước",
		status: "completed" as const,
	},
	{
		id: 5,
		name: "Hoang Thu Ha",
		email: "ha.hoang@example.com",
		phone: "0905 678 901",
		course: "TypeScript Fundamentals",
		progress: 61,
		enrolledDate: "28/01/2026",
		lastActive: "3 giờ trước",
		status: "active" as const,
	},
	{
		id: 6,
		name: "Do Quoc Khanh",
		email: "khanh.do@example.com",
		phone: "0906 789 012",
		course: "Node.js Backend",
		progress: 29,
		enrolledDate: "01/02/2026",
		lastActive: "1 tuần trước",
		status: "at-risk" as const,
	},
];

export const teacherCourses = [
	{
		id: 1,
		title: "React & Next.js Full Course",
		description: "Học React từ cơ bản đến nâng cao",
		price: 699000,
		hinhAnh: "https://picsum.photos/seed/react/300/200",
		category: "programming",
		level: "Nâng cao",
		duration: "40 giờ",
		status: "completed" as const,
		students: 1250,
		rating: 4.8,
		requirements: [
			"Biết cơ bản HTML, CSS, JavaScript",
			"Máy tính có kết nối internet",
		],
		whatYouLearn: ["Xây dựng ứng dụng React", "Tạo API với Next.js"],
		chapters: [
			{
				id: 1,
				title: "Chương 1: React Cơ bản",
				order: 1,
				videos: [
					{
						id: 1,
						title: "Giới thiệu React",
						description: "Tổng quan về React và cách cài đặt",
						videoUrl: "/uploads/videos/basic-1.mp4",
						duration: "15:30",
						order: 1,
						freePreview: true,
						documents: [
							{
								id: 1,
								title: "Slide bài giảng",
								fileUrl: "#",
								fileType: "PDF",
							},
							{ id: 2, title: "Mã nguồn mẫu", fileUrl: "#", fileType: "ZIP" },
						],
						exercises: [
							{
								id: 1,
								title: "Quiz React cơ bản",
								description: "Kiểm tra kiến thức React",
								type: "quiz" as const,
								questions: [
									{
										id: 1,
										question: "React là gì?",
										options: [
											{ id: 1, text: "Framework" },
											{ id: 2, text: "Library" },
											{ id: 3, text: "Ngôn ngữ" },
										],
										correctOptionId: 1,
									},
								],
							},
						],
					},
					{
						id: 2,
						title: "Component trong React",
						description: "Tìm hiểu về Component",
						videoUrl: "/uploads/videos/basic-2.mp4",
						duration: "20:00",
						order: 2,
						freePreview: false,
						documents: [],
						exercises: [],
					},
				],
			},
			{
				id: 2,
				title: "Chương 2: Next.js Nâng cao",
				order: 2,
				videos: [
					{
						id: 3,
						title: "Server Components",
						description: "Tìm hiểu về Server Components trong Next.js",
						videoUrl: "/uploads/videos/lesson-1.mp4",
						duration: "25:00",
						order: 1,
						freePreview: false,
						documents: [
							{
								id: 3,
								title: "Tài liệu Next.js",
								fileUrl: "#",
								fileType: "PDF",
							},
						],
						exercises: [],
					},
				],
			},
		],
	},
	{
		id: 2,
		title: "TypeScript Fundamentals",
		description: "TypeScript cho người mới",
		price: 499000,
		hinhAnh: "https://picsum.photos/seed/ts/300/200",
		category: "programming",
		level: "Cơ bản",
		duration: "20 giờ",
		status: "pending" as const,
		students: 0,
		rating: 0,
		chapters: [],
		requirements: [],
		whatYouLearn: [],
	},
	{
		id: 3,
		title: "Node.js Backend",
		description: "Xây dựng API",
		price: 799000,
		hinhAnh: "https://picsum.photos/seed/node/300/200",
		category: "programming",
		level: "Trung cấp",
		duration: "35 giờ",
		status: "draft" as const,
		students: 0,
		rating: 0,
		chapters: [],
		requirements: [],
		whatYouLearn: [],
	},
];

export const profileMockUser = {
	id: 1,
	ten_dang_nhap: "user",
	email: "user@example.com",
	ho: "Nguyễn",
	ten: "Văn A",
	so_dien_thoai: "0123456789",
	dia_chi: "Hà Nội, Việt Nam",
	gioi_thieu: "Yêu thích học lập trình, đặc biệt là React và Node.js",
	anh_dai_dien: "NVA",
	ngay_tham_gia: "2024-01-15",
	ngay_sinh: "2000-01-01",
	gioi_tinh: "Nam",
	trinh_do: "Đại học",
	nghe_nghiep: "Lập trình viên",
	facebook: "https://facebook.com/user",
	linkedin: "https://linkedin.com/in/user",
};

export const profileMockEnrolledCourses = [
	{ id: 1, title: "React & Next.js Full Course", progress: 75, hinhAnh: "" },
	{ id: 2, title: "TypeScript Fundamentals", progress: 100, hinhAnh: "" },
	{ id: 3, title: "Node.js Backend Development", progress: 45, hinhAnh: "" },
];

export const learningQuizMock = {
	id: 1,
	title: "Quiz chương 1: Giới thiệu React",
	courseName: "React & Next.js Full Course",
	timeLimit: 600,
	questions: [
		{
			id: 1,
			question: "React được phát triển bởi?",
			options: ["Google", "Facebook", "Microsoft", "Apple"],
			correct: 1,
		},
		{
			id: 2,
			question: "React sử dụng mô hình nào?",
			options: [
				"Object-Oriented",
				"Component-based",
				"Functional",
				"Procedural",
			],
			correct: 1,
		},
		{
			id: 3,
			question: "Virtual DOM là gì?",
			options: [
				"Bản sao của DOM trong bộ nhớ",
				"Ngôn ngữ lập trình",
				"Thư viện CSS",
				"Database",
			],
			correct: 0,
		},
		{
			id: 4,
			question: "JSX là viết tắt của?",
			options: [
				"JavaScript XML",
				"Java Syntax Extension",
				"JavaScript Extra",
				"JSON XML",
			],
			correct: 0,
		},
		{
			id: 5,
			question: "Hàm nào dùng để render React?",
			options: [
				"React.render()",
				"ReactDOM.render()",
				"render()",
				"React.renderDOM()",
			],
			correct: 1,
		},
	],
};

export const learningQuizResults = [
	{
		quizId: 1,
		score: 8,
		total: 10,
		answers: [1, 1, 1, 0, 1],
		completedAt: "2024-01-15 10:30",
	},
	{
		quizId: 1,
		score: 6,
		total: 10,
		answers: [1, 0, 1, 0, 1],
		completedAt: "2024-01-10 14:20",
	},
];

export const teacherAnalyticsRevenueData = [
	{
		id: 1,
		course: "React & Next.js Full Course",
		category: "Lập trình",
		period: "2026-01",
		status: "completed" as const,
		students: 148,
		orders: 52,
		revenue: 36400000,
		growth: 12,
	},
	{
		id: 2,
		course: "React & Next.js Full Course",
		category: "Lập trình",
		period: "2026-02",
		status: "completed" as const,
		students: 176,
		orders: 61,
		revenue: 42700000,
		growth: 17,
	},
	{
		id: 3,
		course: "TypeScript Fundamentals",
		category: "Lập trình",
		period: "2026-01",
		status: "approved" as const,
		students: 97,
		orders: 34,
		revenue: 16900000,
		growth: 8,
	},
	{
		id: 4,
		course: "TypeScript Fundamentals",
		category: "Lập trình",
		period: "2026-02",
		status: "approved" as const,
		students: 112,
		orders: 39,
		revenue: 19400000,
		growth: 10,
	},
	{
		id: 5,
		course: "Node.js Backend",
		category: "Lập trình",
		period: "2026-01",
		status: "pending" as const,
		students: 43,
		orders: 15,
		revenue: 11900000,
		growth: -3,
	},
	{
		id: 6,
		course: "Node.js Backend",
		category: "Lập trình",
		period: "2026-02",
		status: "pending" as const,
		students: 58,
		orders: 19,
		revenue: 15100000,
		growth: 6,
	},
	{
		id: 7,
		course: "UI Design Masterclass",
		category: "Thiết kế",
		period: "2026-01",
		status: "draft" as const,
		students: 25,
		orders: 9,
		revenue: 7200000,
		growth: 0,
	},
	{
		id: 8,
		course: "UI Design Masterclass",
		category: "Thiết kế",
		period: "2026-02",
		status: "draft" as const,
		students: 31,
		orders: 11,
		revenue: 8800000,
		growth: 4,
	},
];

export const homeDemoCourses = [
	{
		id: 1,
		title: "React & Next.js Full Course",
		instructor: "Nguyen Van A",
		price: 699000,
		rating: 4.8,
		students: 1250,
		hinhAnh: "https://picsum.photos/seed/react/300/200",
		level: "Trung cấp",
		duration: "40 giờ",
	},
	{
		id: 2,
		title: "TypeScript Fundamentals",
		instructor: "Tran Thi B",
		price: 499000,
		rating: 4.9,
		students: 890,
		hinhAnh: "https://picsum.photos/seed/ts/300/200",
		level: "Cơ bản",
		duration: "20 giờ",
	},
	{
		id: 3,
		title: "Node.js Backend Development",
		instructor: "Le Van C",
		price: 799000,
		rating: 4.7,
		students: 2100,
		hinhAnh: "https://picsum.photos/seed/node/300/200",
		level: "Nâng cao",
		duration: "50 giờ",
	},
	{
		id: 4,
		title: "Python for Data Science",
		instructor: "Pham Thi D",
		price: 599000,
		rating: 4.8,
		students: 1560,
		hinhAnh: "https://picsum.photos/seed/python/300/200",
		level: "Trung cấp",
		duration: "35 giờ",
	},
];

export const homeReviews = [
	{
		id: 1,
		name: "Nguyễn Minh Khoa",
		avatar: "NMK",
		rating: 5,
		comment:
			"Khóa học tuyệt vời! Giảng viên dạy rất dễ hiểu, có doodle style vui vẻ. Đã học xong và apply được vào công việc.",
		course: "React & Next.js",
	},
	{
		id: 2,
		name: "Trần Thị Hương",
		avatar: "TTH",
		rating: 5,
		comment:
			"Giao diện đẹp, dễ sử dụng. Đặc biệt thích phần bài tập thực hành, giúp mình cải thiện kỹ năng nhanh chóng.",
		course: "TypeScript",
	},
	{
		id: 3,
		name: "Lê Đình Phong",
		avatar: "LDP",
		rating: 4,
		comment:
			"Nội dung chất lượng, có cả quiz và assignment. Free trial 7 ngày rất hữu ích để trải nghiệm trước khi mua.",
		course: "Node.js",
	},
];

export const homeBenefits = [
	{ title: "Học nhanh", desc: "Nội dung ngắn gọn, dễ hiểu" },
	{ title: "Mọi lúc", desc: "Truy cập không giới hạn 24/7" },
	{ title: "Chứng nhận", desc: "Nhận chứng chỉ khi hoàn thành" },
	{ title: "Dùng thử", desc: "Trải nghiệm miễn phí 7 ngày" },
];

export const homeStats = [
	{ value: "10,000+", label: "Học viên" },
	{ value: "200+", label: "Khóa học" },
	{ value: "50+", label: "Giảng viên" },
	{ value: "4.8", label: "Đánh giá" },
];

export const homeCategories = [
	{ id: "programming", name: "Lập trình", count: 45, color: "bg-[#E8F6FC]" },
	{ id: "design", name: "Thiết kế", count: 28, color: "bg-[#FEF3C7]" },
	{ id: "marketing", name: "Marketing", count: 32, color: "bg-[#ECFDF5]" },
	{ id: "business", name: "Kinh doanh", count: 22, color: "bg-[#F3E8FF]" },
];

export const storeCourses = [
	{
		id: 1,
		title: "React & Next.js Full Course",
		instructor: "Nguyen Van A",
		price: 699000,
		rating: 4.8,
		students: 1250,
		hinhAnh: "https://picsum.photos/seed/react/300/200",
		category: "programming",
		level: "Nâng cao",
	},
	{
		id: 2,
		title: "TypeScript Fundamentals",
		instructor: "Tran Thi B",
		price: 499000,
		rating: 4.9,
		students: 890,
		hinhAnh: "https://picsum.photos/seed/ts/300/200",
		category: "programming",
		level: "Cơ bản",
	},
	{
		id: 3,
		title: "UI/UX Design Master",
		instructor: "Le Thi C",
		price: 599000,
		rating: 4.7,
		students: 2100,
		hinhAnh: "https://picsum.photos/seed/ux/300/200",
		category: "design",
		level: "Trung cấp",
	},
	{
		id: 4,
		title: "Digital Marketing 2024",
		instructor: "Pham Van D",
		price: 449000,
		rating: 4.6,
		students: 1560,
		hinhAnh: "https://picsum.photos/seed/marketing/300/200",
		category: "marketing",
		level: "Cơ bản",
	},
	{
		id: 5,
		title: "Python for Data Science",
		instructor: "Nguyen Thi E",
		price: 799000,
		rating: 4.8,
		students: 980,
		hinhAnh: "https://picsum.photos/seed/python/300/200",
		category: "programming",
		level: "Nâng cao",
	},
	{
		id: 6,
		title: "Business Strategy",
		instructor: "Tran Van F",
		price: 549000,
		rating: 4.5,
		students: 720,
		hinhAnh: "https://picsum.photos/seed/business/300/200",
		category: "business",
		level: "Trung cấp",
	},
	{
		id: 7,
		title: "Vue.js 3 Complete Guide",
		instructor: "Hoang Van G",
		price: 599000,
		rating: 4.7,
		students: 650,
		hinhAnh: "https://picsum.photos/seed/vue/300/200",
		category: "programming",
		level: "Trung cấp",
	},
	{
		id: 8,
		title: "Figma for Beginners",
		instructor: "Nguyen Thi H",
		price: 399000,
		rating: 4.9,
		students: 1800,
		hinhAnh: "https://picsum.photos/seed/figma/300/200",
		category: "design",
		level: "Cơ bản",
	},
	{
		id: 9,
		title: "AWS Cloud Practitioner",
		instructor: "Le Van I",
		price: 899000,
		rating: 4.6,
		students: 420,
		hinhAnh: "https://picsum.photos/seed/aws/300/200",
		category: "programming",
		level: "Nâng cao",
	},
	{
		id: 10,
		title: "Content Marketing SEO",
		instructor: "Tran Thi K",
		price: 349000,
		rating: 4.4,
		students: 920,
		hinhAnh: "https://picsum.photos/seed/seo/300/200",
		category: "marketing",
		level: "Cơ bản",
	},
	{
		id: 11,
		title: "Financial Analysis",
		instructor: "Pham Van L",
		price: 649000,
		rating: 4.5,
		students: 380,
		hinhAnh: "https://picsum.photos/seed/finance/300/200",
		category: "business",
		level: "Nâng cao",
	},
	{
		id: 12,
		title: "Flutter Mobile Development",
		instructor: "Nguyen Van M",
		price: 749000,
		rating: 4.8,
		students: 560,
		hinhAnh: "https://picsum.photos/seed/flutter/300/200",
		category: "programming",
		level: "Trung cấp",
	},
];

export const storeCategories = [
	{ value: "", label: "Tất cả danh mục" },
	{ value: "programming", label: "Lập trình" },
	{ value: "design", label: "Thiết kế" },
	{ value: "marketing", label: "Marketing" },
	{ value: "business", label: "Kinh doanh" },
];

export const storeLevels = [
	{ value: "", label: "Tất cả cấp độ" },
	{ value: "basic", label: "Cơ bản" },
	{ value: "intermediate", label: "Trung cấp" },
	{ value: "advanced", label: "Nâng cao" },
];

export const courseDetailMockData = {
	id: 1,
	title: "React & Next.js Full Course",
	instructor: "Nguyen Van A",
	instructorAvatar: "NVA",
	price: 699000,
	originalPrice: 999000,
	rating: 4.8,
	students: 1250,
	hinhAnh: "https://picsum.photos/seed/react/800/400",
	category: "Lập trình",
	level: "Nâng cao",
	duration: "40 giờ",
	lessons: 120,
	description:
		"Khóa học toàn diện về React và Next.js, từ cơ bản đến nâng cao. Bạn sẽ học cách xây dựng ứng dụng web hiện đại với React, quản lý state, routing, và triển khai ứng dụng với Next.js.",
	whatYouLearn: [
		"Xây dựng ứng dụng React từ đầu",
		"Quản lý state với Redux và Context API",
		"Tạo API với Next.js",
		"Triển khai ứng dụng lên production",
		"Responsive design và UI/UX tốt",
		"Testing và debug ứng dụng",
	],
	requirements: [
		"Biết cơ bản HTML, CSS, JavaScript",
		"Máy tính có kết nối internet",
		"Đam mê học lập trình web",
	],
	chapters: [
		{
			id: 1,
			title: "Giới thiệu React",
			lessons: [
				{
					id: 1,
					title: "React là gì?",
					duration: "10:00",
					type: "video",
					free: true,
				},
				{
					id: 2,
					title: "Cài đặt môi trường",
					duration: "15:00",
					type: "video",
					free: true,
				},
				{
					id: 3,
					title: "Tạo project đầu tiên",
					duration: "20:00",
					type: "video",
					free: false,
				},
			],
		},
		{
			id: 2,
			title: "JSX và Component",
			lessons: [
				{
					id: 4,
					title: "JSX là gì?",
					duration: "12:00",
					type: "video",
					free: false,
				},
				{
					id: 5,
					title: "Tạo Component",
					duration: "18:00",
					type: "video",
					free: false,
				},
				{
					id: 6,
					title: "Props và State",
					duration: "25:00",
					type: "video",
					free: false,
				},
				{
					id: 7,
					title: "Bài tập chương",
					duration: "30:00",
					type: "exercise",
					free: false,
				},
			],
		},
		{
			id: 3,
			title: "Hooks trong React",
			lessons: [
				{
					id: 8,
					title: "useState",
					duration: "20:00",
					type: "video",
					free: false,
				},
				{
					id: 9,
					title: "useEffect",
					duration: "25:00",
					type: "video",
					free: false,
				},
				{
					id: 10,
					title: "useContext",
					duration: "15:00",
					type: "video",
					free: false,
				},
				{
					id: 11,
					title: "Quiz chương",
					duration: "20:00",
					type: "quiz",
					free: false,
				},
			],
		},
		{
			id: 4,
			title: "Next.js Fundamentals",
			lessons: [
				{
					id: 12,
					title: "Giới thiệu Next.js",
					duration: "15:00",
					type: "video",
					free: false,
				},
				{
					id: 13,
					title: "Routing trong Next.js",
					duration: "20:00",
					type: "video",
					free: false,
				},
				{
					id: 14,
					title: "API Routes",
					duration: "25:00",
					type: "video",
					free: false,
				},
				{
					id: 15,
					title: "Deployment",
					duration: "30:00",
					type: "video",
					free: false,
				},
			],
		},
	],
	instructorBio:
		"Giảng viên Nguyễn Văn A với hơn 10 năm kinh nghiệm trong lĩnh vực phát triển web. Đã làm việc tại nhiều công ty công nghệ hàng đầu và có kinh nghiệm giảng dạy cho hàng nghìn học viên.",
	ratings: [
		{
			id: 1,
			user: "Nguyen Van A",
			avatar: "NVA",
			rating: 5,
			comment: "Khóa học rất hay, giảng viên dạy rất dễ hiểu!",
			time: "2 ngày trước",
			likes: 12,
		},
		{
			id: 2,
			user: "Tran Thi B",
			avatar: "TTB",
			rating: 4,
			comment: "Nội dung chi tiết, có thực hành tốt.",
			time: "1 tuần trước",
			likes: 8,
			replies: [
				{
					id: 3,
					user: "Nguyen Van A",
					avatar: "NVA",
					comment: "Cảm ơn bạn đã feedback!",
					time: "6 ngày trước",
				},
			],
		},
		{
			id: 3,
			user: "Le Van C",
			avatar: "LVC",
			rating: 5,
			comment: "Khóa học tốt nhất mà tôi từng học!",
			time: "2 tuần trước",
			likes: 15,
		},
	],
};

export const learningCourseData = {
	id: 1,
	title: "React & Next.js Full Course",
	chapters: [
		{
			id: 1,
			title: "Giới thiệu React",
			lessons: [
				{
					id: 1,
					title: "React là gì?",
					duration: "10:00",
					type: "video",
					completed: true,
				},
				{
					id: 2,
					title: "Cài đặt môi trường",
					duration: "15:00",
					type: "video",
					completed: true,
				},
				{
					id: 3,
					title: "Tài liệu React",
					duration: "5:00",
					type: "document",
					completed: false,
				},
				{
					id: 4,
					title: "Quiz chương 1",
					duration: "10:00",
					type: "quiz",
					completed: false,
				},
			],
		},
		{
			id: 2,
			title: "JSX và Component",
			lessons: [
				{
					id: 5,
					title: "JSX là gì?",
					duration: "12:00",
					type: "video",
					completed: false,
				},
				{
					id: 6,
					title: "Tạo Component",
					duration: "18:00",
					type: "video",
					completed: false,
				},
				{
					id: 7,
					title: "Props và State",
					duration: "25:00",
					type: "video",
					completed: false,
				},
				{
					id: 8,
					title: "Bài tập chương 2",
					duration: "30:00",
					type: "exercise",
					completed: false,
				},
			],
		},
		{
			id: 3,
			title: "Hooks trong React",
			lessons: [
				{
					id: 9,
					title: "useState",
					duration: "20:00",
					type: "video",
					completed: false,
				},
				{
					id: 10,
					title: "useEffect",
					duration: "25:00",
					type: "video",
					completed: false,
				},
				{
					id: 11,
					title: "Tài liệu Hooks",
					duration: "10:00",
					type: "document",
					completed: false,
				},
				{
					id: 12,
					title: "Quiz chương 3",
					duration: "20:00",
					type: "quiz",
					completed: false,
				},
			],
		},
	],
	currentLesson: {
		id: 1,
		title: "React là gì?",
		type: "video",
		duration: "10:00",
		videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
		content:
			"React là một thư viện JavaScript mã nguồn mở được phát triển bởi Facebook (Meta). Nó được sử dụng để xây dựng giao diện người dùng (UI) cho các ứng dụng web một cách nhanh chóng và hiệu quả. React sử dụng mô hình component-based, cho phép chia nhỏ giao diện thành các phần độc lập có thể tái sử dụng.",
		notes: [
			{ id: 1, timestamp: "0:30", content: "Giới thiệu về React" },
			{ id: 2, timestamp: "2:15", content: "Tại sao nên dùng React?" },
			{ id: 3, timestamp: "5:00", content: "Virtual DOM là gì?" },
		],
		documents: [
			{ id: 1, title: "React Documentation", size: "2.5 MB" },
			{ id: 2, title: "Getting Started Guide", size: "1.2 MB" },
		],
		quiz: {
			questions: [
				{
					id: 1,
					question: "React được phát triển bởi ai?",
					options: ["Google", "Facebook", "Microsoft", "Apple"],
					correct: 1,
				},
				{
					id: 2,
					question: "React sử dụng mô hình nào?",
					options: [
						"Object-Oriented",
						"Component-based",
						"Functional",
						"Procedural",
					],
					correct: 1,
				},
			],
		},
		comments: [
			{
				id: 1,
				user: "Nguyen Van A",
				avatar: "NVA",
				content: "Bài giảng rất dễ hiểu, cảm ơn thầy!",
				time: "2 giờ trước",
				replies: [
					{
						id: 2,
						user: "Tran Thi B",
						avatar: "TTB",
						content: "Đồng ý, em cũng thấy dễ hiểu lắm!",
						time: "1 giờ trước",
					},
				],
			},
			{
				id: 3,
				user: "Le Van C",
				avatar: "LVC",
				content: "Cho em hỏi Virtual DOM khác gì Real DOM?",
				time: "30 phút trước",
			},
		],
	},
};

export const learningQuizHistory = [
	{ id: 1, date: "2024-01-15", score: 8, total: 10, time: "15 phút" },
	{ id: 2, date: "2024-01-10", score: 6, total: 10, time: "20 phút" },
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
