// Learning Page Types

export interface ChapterWithLock {
	id: number;
	khoa_hoc_id: number;
	tieu_de: string;
	thu_tu: number;
	bai_hoc: LessonWithStatus[];
}

export interface LessonWithStatus {
	id: number;
	chuong_hoc_id: number;
	tieu_de: string;
	loai: "video" | "document" | "quiz" | "exercise";
	thoi_luong: string | null;
	video_url: string | null;
	noi_dung: string | null;
	isLocked: boolean;
	isCompleted: boolean;
}

export interface LearningProgress {
	tong_bai: number;
	da_hoan_thanh: number;
	phan_tram: number;
	isCourseCompleted: boolean;
}

export interface CurrentLesson {
	id: number;
	tieu_de: string;
}

export interface LearningCourseResponse {
	course: {
		id: number;
		tieu_de: string;
		chuong_hoc: ChapterWithLock[];
	};
	progress: LearningProgress;
	bai_hoc_hien_tai: CurrentLesson | null;
}

// Enrollment Types
export interface EnrollmentCourse {
	id: number;
	tieu_de: string;
	mo_ta: string | null;
	thumbnail: string | null;
	gia: number;
	giang_vien: {
		id: number;
		ten: string;
		ho: string;
		anh_dai_dien: string | null;
	};
}

export interface CurrentLessonInfo {
	id: number;
	tieu_de: string;
}

export interface Enrollment {
	id: number;
	khoa_hoc_id: number;
	tien_do: number;
	trang_thai: "not_started" | "in_progress" | "completed";
	ngay_dang_ky: string;
	ngay_hoan_thanh: string | null;
	don_hang_id: number | null;
	don_hang_trang_thai: string | null;
	bai_hoc_hien_tai: CurrentLessonInfo | null;
	khoa_hoc: EnrollmentCourse;
}

export interface EnrollmentsResponse {
	enrollments: Enrollment[];
}

// My Courses Page
export interface MyCoursesResponse {
	enrollments: Enrollment[];
	currentLesson?: CurrentLessonInfo;
}

// API Functions
export interface ApiResponse<T> {
	data?: T;
	error?: string;
}
