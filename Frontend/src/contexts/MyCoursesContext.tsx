import { createContext, useContext, useState, type ReactNode } from "react";

export interface QuizQuestion {
	id: number;
	question: string;
	options: { id: string; text: string }[];
	correctAnswer: string;
}

export interface LessonExercise {
	id: number;
	title: string;
	description: string;
	required: boolean;
	deadline?: string;
}

export interface Lesson {
	id: number;
	title: string;
	duration: string;
	completed: boolean;
	videoUrl?: string;
	quizzes?: QuizQuestion[];
	exercises?: LessonExercise[];
}

export interface Chapter {
	id: number;
	title: string;
	lessons: Lesson[];
}

export interface PurchasedCourse {
	id: number;
	title: string;
	thumbnail: string;
	instructor: string;
	price: number;
	purchaseDate: string;
	progress: number;
	chapters: Chapter[];
}

interface MyCoursesContextType {
	courses: PurchasedCourse[];
	addCourse: (course: PurchasedCourse) => void;
	updateProgress: (courseId: number, lessonId: number, completed: boolean) => void;
	getCourse: (id: number) => PurchasedCourse | undefined;
}

const MyCoursesContext = createContext<MyCoursesContextType | undefined>(undefined);

const STORAGE_KEY = "lms_my_courses";

const defaultQuiz = [
	{
		id: 1,
		question: "React là gì?",
		options: [
			{ id: "a", text: "A. Ngôn ngữ lập trình" },
			{ id: "b", text: "B. Thư viện JavaScript" },
			{ id: "c", text: "C. Framework PHP" },
			{ id: "d", text: "D. Database" },
		],
		correctAnswer: "b",
	},
	{
		id: 2,
		question: "JSX là gì?",
		options: [
			{ id: "a", text: "A. JavaScript XML" },
			{ id: "b", text: "B. Java Syntax Extension" },
			{ id: "c", text: "C. JSON XML" },
			{ id: "d", text: "D. JavaScript Extra" },
		],
		correctAnswer: "a",
	},
	{
		id: 3,
		question: "useState dùng để làm gì?",
		options: [
			{ id: "a", text: "A. Gọi API" },
			{ id: "b", text: "B. Quản lý state" },
			{ id: "c", text: "C. Routing" },
			{ id: "d", text: "D. Styling" },
		],
		correctAnswer: "b",
	},
	{
		id: 4,
		question: "Props trong React dùng để làm gì?",
		options: [
			{ id: "a", text: "A. Style component" },
			{ id: "b", text: "B. Truyền dữ liệu giữa các component" },
			{ id: "c", text: "C. Quản lý state" },
			{ id: "d", text: "D. Xử lý sự kiện" },
		],
		correctAnswer: "b",
	},
	{
		id: 5,
		question: "Component React phải trả về?",
		options: [
			{ id: "a", text: "A. Một object" },
			{ id: "b", text: "B. Một hàm" },
			{ id: "c", text: "C. Một JSX element hoặc null" },
			{ id: "d", text: "D. Một string" },
		],
		correctAnswer: "c",
	},
	{
		id: 6,
		question: "useEffect chạy khi nào?",
		options: [
			{ id: "a", text: "A. Chỉ chạy một lần khi mount" },
			{ id: "b", text: "B. Chạy sau mỗi lần render" },
			{ id: "c", text: "C. Phụ thuộc vào dependency array" },
			{ id: "d", text: "D. Không bao giờ chạy" },
		],
		correctAnswer: "c",
	},
	{
		id: 7,
		question: "Cách đúng để cập nhật state?",
		options: [
			{ id: "a", text: "A. state = newValue" },
			{ id: "b", text: "B. setState(newValue)" },
			{ id: "c", text: "C. this.state = newValue" },
			{ id: "d", text: "D. state.update(newValue)" },
		],
		correctAnswer: "b",
	},
	{
		id: 8,
		question: "useEffect với dependency array rỗng [] tương đương với?",
		options: [
			{ id: "a", text: "A. componentDidUpdate" },
			{ id: "b", text: "B. componentDidMount" },
			{ id: "c", text: "C. componentWillUnmount" },
			{ id: "d", text: "D. render" },
		],
		correctAnswer: "b",
	},
	{
		id: 9,
		question: "Virtual DOM là gì?",
		options: [
			{ id: "a", text: "A. DOM thật trong trình duyệt" },
			{ id: "b", text: "B. Bản sao nhẹ của DOM" },
			{ id: "c", text: "C. Một loại database" },
			{ id: "d", text: "D. Framework khác" },
		],
		correctAnswer: "b",
	},
	{
		id: 10,
		question: "React Hook là gì?",
		options: [
			{ id: "a", text: "A. Hàm đặc biệt cho phép sử dụng state và lifecycle" },
			{ id: "b", text: "B. Một loại component" },
			{ id: "c", text: "C. CSS framework" },
			{ id: "d", text: "D. Database" },
		],
		correctAnswer: "a",
	},
];

const defaultCourse: PurchasedCourse = {
	id: 1,
	title: "React & Next.js Full Course - Học từ cơ bản đến nâng cao",
	thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
	instructor: "Nguyễn Văn A",
	price: 699000,
	purchaseDate: new Date().toLocaleDateString("vi-VN"),
	progress: 0,
	chapters: [
		{
			id: 1,
			title: "Giới thiệu",
			lessons: [
				{
					id: 1,
					title: "Giới thiệu khóa học",
					duration: "10:00",
					completed: false,
					quizzes: defaultQuiz,
					exercises: [
						{
							id: 1,
							title: "Giới thiệu bản thân",
							description: "Viết một đoạn giới thiệu về bản thân bạn",
							required: false,
						},
					],
				},
				{
					id: 2,
					title: "Hướng dẫn học tập",
					duration: "15:00",
					completed: false,
					quizzes: defaultQuiz,
					exercises: [],
				},
			],
		},
		{
			id: 2,
			title: "Nội dung chính",
			lessons: [
				{
					id: 3,
					title: "Bài học 1 - React Fundamentals",
					duration: "25:00",
					completed: false,
					quizzes: defaultQuiz,
					exercises: [
						{
							id: 2,
							title: "Tạo component Hello World",
							description: "Tạo một component React hiển thị 'Hello World'",
							required: true,
						},
					],
				},
				{
					id: 4,
					title: "Bài học 2 - Components & Props",
					duration: "30:00",
					completed: false,
					quizzes: defaultQuiz,
					exercises: [
						{
							id: 3,
							title: "Tạo component với Props",
							description: "Tạo component UserCard nhận name, email làm props",
							required: true,
						},
					],
				},
				{
					id: 5,
					title: "Bài học 3 - State & Lifecycle",
					duration: "20:00",
					completed: false,
					quizzes: defaultQuiz,
					exercises: [
						{
							id: 4,
							title: "Counter App",
							description: "Tạo ứng dụng đếm số với nút tăng/giảm",
							required: true,
						},
					],
				},
			],
		},
	],
};

const defaultCourse2: PurchasedCourse = {
	id: 2,
	title: "TypeScript Fundamentals - Từ Cơ Bản Đến Nâng Cao",
	thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
	instructor: "Trần Thị B",
	price: 499000,
	purchaseDate: "15/01/2025",
	progress: 35,
	chapters: [
		{
			id: 1,
			title: "Giới thiệu TypeScript",
			lessons: [
				{ id: 1, title: "TypeScript là gì?", duration: "12:00", completed: true, quizzes: defaultQuiz },
				{ id: 2, title: "Cài đặt môi trường", duration: "18:00", completed: true, quizzes: defaultQuiz },
			],
		},
		{
			id: 2,
			title: "Type System",
			lessons: [
				{ id: 3, title: "Basic Types", duration: "25:00", completed: true, quizzes: defaultQuiz },
				{ id: 4, title: "Interfaces vs Types", duration: "20:00", completed: false, quizzes: defaultQuiz },
				{ id: 5, title: "Generics", duration: "30:00", completed: false, quizzes: defaultQuiz },
			],
		},
	],
};

const defaultCourse3: PurchasedCourse = {
	id: 3,
	title: "Node.js Backend Development - Xây Dựng API",
	thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
	instructor: "Lê Văn C",
	price: 799000,
	purchaseDate: "10/01/2025",
	progress: 60,
	chapters: [
		{
			id: 1,
			title: "Node.js Cơ Bản",
			lessons: [
				{ id: 1, title: "Giới thiệu Node.js", duration: "15:00", completed: true, quizzes: defaultQuiz },
				{ id: 2, title: "Module System", duration: "20:00", completed: true, quizzes: defaultQuiz },
			],
		},
		{
			id: 2,
			title: "Express Framework",
			lessons: [
				{ id: 3, title: "Tạo Server với Express", duration: "25:00", completed: true, quizzes: defaultQuiz },
				{ id: 4, title: "Routing & Middleware", duration: "30:00", completed: true, quizzes: defaultQuiz },
				{ id: 5, title: "RESTful API Design", duration: "35:00", completed: false, quizzes: defaultQuiz },
			],
		},
	],
};

const defaultCourse4: PurchasedCourse = {
	id: 4,
	title: "Python for Data Science",
	thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800",
	instructor: "Phạm Thị D",
	price: 599000,
	purchaseDate: "05/01/2025",
	progress: 15,
	chapters: [
		{
			id: 1,
			title: "Python Basics",
			lessons: [
				{ id: 1, title: "Giới thiệu Python", duration: "10:00", completed: true, quizzes: defaultQuiz },
				{ id: 2, title: "Variables & Data Types", duration: "20:00", completed: false, quizzes: defaultQuiz },
			],
		},
	],
};

const defaultCourse5: PurchasedCourse = {
	id: 5,
	title: "Vue.js 3 Complete Guide",
	thumbnail: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=800",
	instructor: "Hoàng Văn E",
	price: 549000,
	purchaseDate: "01/01/2025",
	progress: 80,
	chapters: [
		{
			id: 1,
			title: "Vue.js Fundamentals",
			lessons: [
				{ id: 1, title: "Giới thiệu Vue 3", duration: "15:00", completed: true, quizzes: defaultQuiz },
				{ id: 2, title: "Components", duration: "25:00", completed: true, quizzes: defaultQuiz },
			],
		},
		{
			id: 2,
			title: "Composition API",
			lessons: [
				{ id: 3, title: "ref & reactive", duration: "20:00", completed: true, quizzes: defaultQuiz },
				{ id: 4, title: "Computed & Watch", duration: "18:00", completed: true, quizzes: defaultQuiz },
			],
		},
	],
};

const defaultCourse6: PurchasedCourse = {
	id: 6,
	title: "SQL & Database Design",
	thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800",
	instructor: "Ngô Thị F",
	price: 449000,
	purchaseDate: "28/12/2024",
	progress: 100,
	chapters: [
		{
			id: 1,
			title: "SQL Basics",
			lessons: [
				{ id: 1, title: "SELECT & WHERE", duration: "20:00", completed: true, quizzes: defaultQuiz },
				{ id: 2, title: "JOIN Tables", duration: "25:00", completed: true, quizzes: defaultQuiz },
			],
		},
	],
};

const defaultCoursesList = [defaultCourse, defaultCourse2, defaultCourse3, defaultCourse4, defaultCourse5, defaultCourse6];

export const MyCoursesProvider = ({ children }: { children: ReactNode }) => {
	const [courses, setCourses] = useState<PurchasedCourse[]>(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			if (parsed.length > 0) return parsed;
		}
		return defaultCoursesList;
	});

	const saveToStorage = (newCourses: PurchasedCourse[]) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(newCourses));
	};

	const addCourse = (course: PurchasedCourse) => {
		setCourses((prev) => {
			if (prev.some((c) => c.id === course.id)) return prev;
			const newCourses = [...prev, course];
			saveToStorage(newCourses);
			return newCourses;
		});
	};

	const updateProgress = (courseId: number, lessonId: number, completed: boolean) => {
		setCourses((prev) => {
			const newCourses = prev.map((course) => {
				if (course.id !== courseId) return course;

				const updatedChapters = course.chapters.map((chapter) => ({
					...chapter,
					lessons: chapter.lessons.map((lesson) =>
						lesson.id === lessonId ? { ...lesson, completed } : lesson
					),
				}));

				const totalLessons = updatedChapters.reduce(
					(acc, ch) => acc + ch.lessons.length,
					0
				);
				const completedLessons = updatedChapters.reduce(
					(acc, ch) =>
						acc + ch.lessons.filter((l) => l.completed).length,
					0
				);
				const progress = Math.round((completedLessons / totalLessons) * 100);

				return { ...course, chapters: updatedChapters, progress };
			});
			saveToStorage(newCourses);
			return newCourses;
		});
	};

	const getCourse = (id: number) => courses.find((c) => c.id === id);

	return (
		<MyCoursesContext.Provider
			value={{ courses, addCourse, updateProgress, getCourse }}
		>
			{children}
		</MyCoursesContext.Provider>
	);
};

export const useMyCourses = (): MyCoursesContextType => {
	const context = useContext(MyCoursesContext);
	if (context === undefined) {
		throw new Error("useMyCourses must be used within a MyCoursesProvider");
	}
	return context;
};
