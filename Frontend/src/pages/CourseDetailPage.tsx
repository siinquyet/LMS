import {
	Award,
	BookOpen,
	Bookmark,
	Calendar,
	ChartBar,
	ChevronDown,
	ChevronRight,
	Clock,
	FileText,
} from "lucide-react";
import {
	Globe,
	GraduationCap,
	Heart,
	HelpCircle,
	Play,
	PlayCircle,
	Share2,
	Star,
	Users,
	Video,
} from "lucide-react";
import { useState } from "react";
import ActionButton from "../components/common/ActionButton";
import { useCart } from "../contexts/CartContext";

interface CourseDetail {
	id: number;
	title: string;
	description: string;
	thumbnail: string;
	price: number;
	originalPrice: number;
	rating: number;
	students: number;
	category: string;
	level: string;
	duration: string;
	lessonsCount: number;
	lastUpdated: string;
	language: string;
	certificate: boolean;
	instructor: {
		id: number;
		name: string;
		avatar: string;
		title: string;
		students: number;
		courses: number;
		rating: number;
		about: string;
	};
	whatYouWillLearn: string[];
	requirements: string[];
	chapters: {
		id: number;
		title: string;
		lessons: {
			id: number;
			title: string;
			duration: string;
			isPreview: boolean;
		}[];
	}[];
	reviews: {
		id: number;
		user: string;
		avatar: string;
		rating: number;
		date: string;
		comment: string;
	}[];
}

const mockCourse: CourseDetail = {
	id: 1,
	title: "React & Next.js Full Course - Học từ cơ bản đến nâng cao",
	description:
		"Khóa học toàn diện về React và Next.js, từ những khái niệm cơ bản đến các kỹ thuật nâng cao. Bạn sẽ học cách xây dựng các ứng dụng web hiện đại với hiệu suất cao, SEO tốt và trải nghiệm người dùng tuyệt vời. Khóa học bao gồm dự án thực tế, giúp bạn có đủ kỹ năng để làm việc với React và Next.js trong môi trường production.",
	thumbnail:
		"https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
	price: 499000,
	originalPrice: 899000,
	rating: 4.8,
	students: 1250,
	category: "Lập trình",
	level: "Cơ bản đến Nâng cao",
	duration: "40 giờ",
	lessonsCount: 125,
	lastUpdated: "2024-01-15",
	language: "Tiếng Việt",
	certificate: true,
	instructor: {
		id: 1,
		name: "Nguyễn Văn A",
		avatar: "",
		title: "Senior Full-stack Developer",
		students: 15000,
		courses: 12,
		rating: 4.9,
		about:
			"Tôi là một Full-stack Developer với hơn 10 năm kinh nghiệm trong ngành công nghệ thông tin. Tôi đã làm việc cho nhiều công ty công nghệ hàng đầu và giảng dạy cho hàng nghìn học viên trên khắp Việt Nam.",
	},
	whatYouWillLearn: [
		"Xây dựng ứng dụng web hiện đại với React",
		"Làm việc với Next.js và Server-side Rendering",
		"Quản lý state với Redux, Zustand và Context API",
		"Thiết kế API RESTful và GraphQL",
		"Tối ưu hiệu suất ứng dụng",
		"Triển khai ứng dụng lên production",
	],
	requirements: [
		"Có kiến thức cơ bản về HTML, CSS, JavaScript",
		"Máy tính có kết nối internet",
		"Không cần kinh nghiệm lập trình trước đó",
	],
	chapters: [
		{
			id: 1,
			title: "Giới thiệu và Thiết lập môi trường",
			lessons: [
				{
					id: 1,
					title: "Giới thiệu khóa học",
					duration: "10:00",
					isPreview: true,
				},
				{
					id: 2,
					title: "Cài đặt Node.js và VS Code",
					duration: "15:30",
					isPreview: true,
				},
				{
					id: 3,
					title: "Tạo project React đầu tiên",
					duration: "20:00",
					isPreview: false,
				},
				{
					id: 4,
					title: "Cấu trúc thư mục React",
					duration: "12:00",
					isPreview: false,
				},
			],
		},
		{
			id: 2,
			title: "JavaScript ES6+ Fundamentals",
			lessons: [
				{
					id: 5,
					title: "Let, Const và Block Scoping",
					duration: "18:00",
					isPreview: false,
				},
				{
					id: 6,
					title: "Arrow Functions",
					duration: "15:00",
					isPreview: false,
				},
				{
					id: 7,
					title: "Destructuring và Spread Operator",
					duration: "20:00",
					isPreview: false,
				},
				{
					id: 8,
					title: "Async/Await và Promises",
					duration: "25:00",
					isPreview: false,
				},
				{
					id: 9,
					title: "Modules và Import/Export",
					duration: "15:00",
					isPreview: false,
				},
			],
		},
		{
			id: 3,
			title: "React Core Concepts",
			lessons: [
				{
					id: 10,
					title: "JSX và Virtual DOM",
					duration: "22:00",
					isPreview: true,
				},
				{
					id: 11,
					title: "Components và Props",
					duration: "28:00",
					isPreview: false,
				},
				{
					id: 12,
					title: "State và Lifecycle",
					duration: "30:00",
					isPreview: false,
				},
				{
					id: 13,
					title: "Event Handling",
					duration: "18:00",
					isPreview: false,
				},
				{
					id: 14,
					title: "Conditional Rendering",
					duration: "20:00",
					isPreview: false,
				},
			],
		},
		{
			id: 4,
			title: "Hooks trong React",
			lessons: [
				{
					id: 15,
					title: "useState và useEffect",
					duration: "35:00",
					isPreview: false,
				},
				{
					id: 16,
					title: "useContext và useReducer",
					duration: "30:00",
					isPreview: false,
				},
				{
					id: 17,
					title: "useMemo và useCallback",
					duration: "25:00",
					isPreview: false,
				},
				{ id: 18, title: "Custom Hooks", duration: "28:00", isPreview: false },
			],
		},
		{
			id: 5,
			title: "Next.js Fundamentals",
			lessons: [
				{
					id: 19,
					title: "Giới thiệu Next.js",
					duration: "15:00",
					isPreview: false,
				},
				{
					id: 20,
					title: "File-based Routing",
					duration: "30:00",
					isPreview: false,
				},
				{
					id: 21,
					title: "Server-side Rendering",
					duration: "35:00",
					isPreview: false,
				},
				{
					id: 22,
					title: "Static Site Generation",
					duration: "28:00",
					isPreview: false,
				},
				{ id: 23, title: "API Routes", duration: "25:00", isPreview: false },
			],
		},
	],
	reviews: [
		{
			id: 1,
			user: "Trần Thị B",
			avatar: "",
			rating: 5,
			date: "2024-01-10",
			comment:
				"Khóa học rất hay và chi tiết. Giảng viên giải thích dễ hiểu, các dự án thực tế giúp tôi nắm vững kiến thức. Đã áp dụng vào công việc ngay sau khi học xong!",
		},
		{
			id: 2,
			user: "Lê Văn C",
			avatar: "",
			rating: 4,
			date: "2024-01-05",
			comment:
				"Nội dung phong phú, cập nhật kiến thức mới nhất. Mong muốn có thêm nhiều bài tập thực hành hơn.",
		},
	],
};

const CourseDetailPage = () => {
	const course = mockCourse;
	const { items, addItem } = useCart();
	const [expandedChapters, setExpandedChapters] = useState<number[]>([1]);
	const [isWishlisted, setIsWishlisted] = useState(false);

	const isInCart = items.some((item) => item.id === course.id);

	const handleAddToCart = () => {
		addItem({
			id: course.id,
			title: course.title,
			thumbnail: course.thumbnail,
			instructor: course.instructor.name,
			price: course.price,
			originalPrice: course.originalPrice,
		});
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
			maximumFractionDigits: 0,
		}).format(price);
	};

	const toggleChapter = (chapterId: number) => {
		setExpandedChapters((prev) =>
			prev.includes(chapterId)
				? prev.filter((id) => id !== chapterId)
				: [...prev, chapterId],
		);
	};

	const totalLessons = course.chapters.reduce(
		(acc, ch) => acc + ch.lessons.length,
		0,
	);

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Hero Section */}
			<div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Left: Course Info */}
						<div className="lg:col-span-2 text-white">
							{/* Breadcrumb */}
							<nav className="flex items-center gap-2 text-sm text-slate-300 mb-4">
								<a href="/" className="hover:text-white">
									Trang chủ
								</a>
								<span>/</span>
								<a href="/store" className="hover:text-white">
									Cửa hàng
								</a>
								<span>/</span>
								<span className="text-slate-200">{course.category}</span>
							</nav>

							<h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
								{course.title}
							</h1>

							<p className="text-slate-300 text-lg mb-6 max-w-2xl">
								{course.description}
							</p>

							{/* Stats */}
							<div className="flex flex-wrap items-center gap-4 mb-6">
								<div className="flex items-center gap-2">
									<Star className="w-5 h-5 text-amber-400 fill-amber-400" />
									<span className="font-bold">{course.rating}</span>
									<span className="text-slate-300">
										({course.students.toLocaleString()} đánh giá)
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Users className="w-5 h-5 text-slate-300" />
									<span className="text-slate-300">
										{course.students.toLocaleString()} học viên
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Clock className="w-5 h-5 text-slate-300" />
									<span className="text-slate-300">{course.duration} giờ</span>
								</div>
							</div>

							{/* Instructor */}
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
									<GraduationCap className="w-6 h-6 text-white" />
								</div>
								<div>
									<p className="text-sm text-slate-300">Giảng viên</p>
									<p className="font-medium">{course.instructor.name}</p>
								</div>
							</div>
						</div>

						{/* Right: Purchase Card */}
						<div className="lg:col-span-1">
							<div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-24">
								{/* Thumbnail */}
								<div className="relative">
									<img
										src={course.thumbnail}
										alt={course.title}
										className="w-full h-48 object-cover"
									/>
									<div className="absolute inset-0 bg-black/40 flex items-center justify-center">
										<button
											type="button"
											className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
										>
											<PlayCircle className="w-10 h-10 text-blue-600" />
										</button>
									</div>
									<div className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 rounded text-white text-xs">
										Xem trước
									</div>
								</div>

								{/* Price & Actions */}
								<div className="p-6">
									<div className="flex items-baseline gap-3 mb-4">
										<span className="text-3xl font-bold text-blue-600">
											{formatPrice(course.price)}
										</span>
										<span className="text-lg text-slate-400 line-through">
											{formatPrice(course.originalPrice)}
										</span>
										<span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-medium rounded">
											{Math.round(
												((course.originalPrice - course.price) /
													course.originalPrice) *
													100,
											)}
											% GIẢM
										</span>
									</div>

									<div className="space-y-3">
										<ActionButton
											size="lg"
											className="w-full !py-3.5"
											onClick={handleAddToCart}
											disabled={isInCart}
										>
											{isInCart ? "Đã thêm vào giỏ" : "Thêm vào giỏ hàng"}
										</ActionButton>
										<ActionButton
											variant="outline"
											size="lg"
											className="w-full !py-3.5"
										>
											Mua ngay
										</ActionButton>
									</div>

									<div className="flex items-center justify-center gap-4 mt-4">
										<button
											type="button"
											onClick={() => setIsWishlisted(!isWishlisted)}
											className={`flex items-center gap-2 text-sm transition-colors ${
												isWishlisted
													? "text-red-500"
													: "text-slate-500 hover:text-red-500"
											}`}
										>
											<Heart
												className={`w-4 h-4 ${
													isWishlisted ? "fill-current" : ""
												}`}
											/>
											Yêu thích
										</button>
										<button
											type="button"
											className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
										>
											<Share2 className="w-4 h-4" />
											Chia sẻ
										</button>
									</div>

									{/* Course includes */}
									<div className="mt-6 pt-6 border-t border-slate-200">
										<h4 className="font-semibold text-slate-900 mb-4">
											Khóa học bao gồm:
										</h4>
										<ul className="space-y-3">
											<li className="flex items-center gap-3 text-sm text-slate-600">
												<Video className="w-4 h-4 text-blue-500" />
												{course.duration} giờ video
											</li>
											<li className="flex items-center gap-3 text-sm text-slate-600">
												<FileText className="w-4 h-4 text-blue-500" />
												{totalLessons} bài học
											</li>
											<li className="flex items-center gap-3 text-sm text-slate-600">
												<Globe className="w-4 h-4 text-blue-500" />
												{course.language}
											</li>
											<li className="flex items-center gap-3 text-sm text-slate-600">
												<Award className="w-4 h-4 text-blue-500" />
												Chứng chỉ hoàn thành
											</li>
											<li className="flex items-center gap-3 text-sm text-slate-600">
												<Bookmark className="w-4 h-4 text-blue-500" />
												Truy cập trọn đời
											</li>
											<li className="flex items-center gap-3 text-sm text-slate-600">
												<Calendar className="w-4 h-4 text-blue-500" />
												Cập nhật mới nhất {course.lastUpdated}
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Course Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-8">
						{/* What you'll learn */}
						<section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
							<h2 className="text-2xl font-bold text-slate-900 mb-6">
								Bạn sẽ học được gì
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{course.whatYouWillLearn.map((item) => (
									<div key={item} className="flex items-start gap-3">
										<ChevronRight className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
										<span className="text-slate-700">{item}</span>
									</div>
								))}
							</div>
						</section>

						{/* Course content */}
						<section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-2xl font-bold text-slate-900">
									Nội dung khóa học
								</h2>
								<span className="text-sm text-slate-500">
									{course.chapters.length} chương • {totalLessons} bài học •{" "}
									{course.duration}
								</span>
							</div>

							<div className="space-y-3">
								{course.chapters.map((chapter) => (
									<div
										key={chapter.id}
										className="border border-slate-200 rounded-xl overflow-hidden"
									>
										<button
											type="button"
											onClick={() => toggleChapter(chapter.id)}
											className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
										>
											<div className="flex items-center gap-3">
												{expandedChapters.includes(chapter.id) ? (
													<ChevronDown className="w-5 h-5 text-slate-500" />
												) : (
													<ChevronRight className="w-5 h-5 text-slate-500" />
												)}
												<span className="font-medium text-slate-900 text-left">
													{chapter.id}. {chapter.title}
												</span>
											</div>
											<span className="text-sm text-slate-500">
												{chapter.lessons.length} bài
											</span>
										</button>

										{expandedChapters.includes(chapter.id) && (
											<div className="divide-y divide-slate-100">
												{chapter.lessons.map((lesson) => (
													<div
														key={lesson.id}
														className="flex items-center justify-between p-4 hover:bg-slate-50"
													>
														<div className="flex items-center gap-3">
															{lesson.isPreview ? (
																<Play className="w-4 h-4 text-blue-500" />
															) : (
																<Video className="w-4 h-4 text-slate-400" />
															)}
															<span
																className={
																	lesson.isPreview
																		? "text-slate-700"
																		: "text-slate-600"
																}
															>
																{lesson.title}
															</span>
															{lesson.isPreview && (
																<span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded">
																	Xem trước
																</span>
															)}
														</div>
														<span className="text-sm text-slate-500">
															{lesson.duration}
														</span>
													</div>
												))}
											</div>
										)}
									</div>
								))}
							</div>
						</section>

						{/* Requirements */}
						<section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
							<h2 className="text-2xl font-bold text-slate-900 mb-6">
								Yêu cầu
							</h2>
							<ul className="space-y-3">
								{course.requirements.map((req) => (
									<li key={req} className="flex items-start gap-3">
										<ChevronRight className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
										<span className="text-slate-700">{req}</span>
									</li>
								))}
							</ul>
						</section>

						{/* Instructor */}
						<section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
							<h2 className="text-2xl font-bold text-slate-900 mb-6">
								Giảng viên
							</h2>
							<div className="flex flex-col md:flex-row gap-6">
								<div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shrink-0">
									<GraduationCap className="w-10 h-10 text-white" />
								</div>
								<div className="flex-1">
									<h3 className="text-xl font-semibold text-slate-900 mb-1">
										{course.instructor.name}
									</h3>
									<p className="text-slate-500 mb-3">
										{course.instructor.title}
									</p>
									<div className="flex items-center gap-4 mb-4 text-sm">
										<div className="flex items-center gap-1">
											<Star className="w-4 h-4 text-amber-400 fill-amber-400" />
											<span className="font-medium">
												{course.instructor.rating}
											</span>
											<span className="text-slate-500">đánh giá</span>
										</div>
										<div className="flex items-center gap-1">
											<Users className="w-4 h-4 text-slate-500" />
											<span className="text-slate-500">
												{course.instructor.students.toLocaleString()} học viên
											</span>
										</div>
										<div className="flex items-center gap-1">
											<BookOpen className="w-4 h-4 text-slate-500" />
											<span className="text-slate-500">
												{course.instructor.courses} khóa học
											</span>
										</div>
									</div>
									<p className="text-slate-700 leading-relaxed">
										{course.instructor.about}
									</p>
								</div>
							</div>
						</section>

						{/* Reviews */}
						<section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
							<h2 className="text-2xl font-bold text-slate-900 mb-6">
								Đánh giá
							</h2>

							{/* Rating summary */}
							<div className="flex items-center gap-8 mb-8 pb-8 border-b border-slate-200">
								<div className="text-center">
									<div className="text-5xl font-bold text-slate-900 mb-2">
										{course.rating}
									</div>
									<div className="flex items-center justify-center gap-1 mb-2">
										{[1, 2, 3, 4, 5].map((star) => (
											<Star
												key={star}
												className={`w-5 h-5 ${
													star <= course.rating
														? "text-amber-400 fill-amber-400"
														: "text-slate-300"
												}`}
											/>
										))}
									</div>
									<p className="text-sm text-slate-500">
										{course.students.toLocaleString()} đánh giá
									</p>
								</div>

								{/* Rating bars */}
								<div className="flex-1 space-y-2">
									{[5, 4, 3, 2, 1].map((star) => (
										<div key={star} className="flex items-center gap-2">
											<span className="text-sm text-slate-600 w-8">
												{star} sao
											</span>
											<div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
												<div
													className="h-full bg-amber-400 rounded-full"
													style={{
														width:
															star === 5
																? "75%"
																: star === 4
																	? "20%"
																	: star === 3
																		? "3%"
																		: "2%",
													}}
												/>
											</div>
											<span className="text-sm text-slate-500 w-12 text-right">
												{star === 5 ? "75%" : star === 4 ? "20%" : "5%"}
											</span>
										</div>
									))}
								</div>
							</div>

							{/* Review list */}
							<div className="space-y-6">
								{course.reviews.map((review) => (
									<div
										key={review.id}
										className="pb-6 border-b border-slate-100 last:border-0"
									>
										<div className="flex items-start gap-4">
											<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shrink-0">
												<span className="text-white font-medium">
													{review.user.charAt(0)}
												</span>
											</div>
											<div className="flex-1">
												<div className="flex items-center gap-3 mb-2">
													<span className="font-medium text-slate-900">
														{review.user}
													</span>
													<span className="text-sm text-slate-500">
														{review.date}
													</span>
												</div>
												<div className="flex items-center gap-1 mb-2">
													{[1, 2, 3, 4, 5].map((star) => (
														<Star
															key={star}
															className={`w-4 h-4 ${
																star <= review.rating
																	? "text-amber-400 fill-amber-400"
																	: "text-slate-300"
															}`}
														/>
													))}
												</div>
												<p className="text-slate-700">{review.comment}</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</section>
					</div>

					{/* Sidebar */}
					<div className="lg:col-span-1 space-y-6">
						{/* Level */}
						<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
							<h3 className="font-semibold text-slate-900 mb-4">
								Thông tin khóa học
							</h3>
							<ul className="space-y-4">
								<li className="flex items-center gap-3">
									<ChartBar className="w-5 h-5 text-slate-500" />
									<div>
										<p className="text-sm text-slate-500">Trình độ</p>
										<p className="font-medium text-slate-900">{course.level}</p>
									</div>
								</li>
								<li className="flex items-center gap-3">
									<Clock className="w-5 h-5 text-slate-500" />
									<div>
										<p className="text-sm text-slate-500">Thời lượng</p>
										<p className="font-medium text-slate-900">
											{course.duration}
										</p>
									</div>
								</li>
								<li className="flex items-center gap-3">
									<Video className="w-5 h-5 text-slate-500" />
									<div>
										<p className="text-sm text-slate-500">Số bài học</p>
										<p className="font-medium text-slate-900">
											{totalLessons} bài
										</p>
									</div>
								</li>
								<li className="flex items-center gap-3">
									<Globe className="w-5 h-5 text-slate-500" />
									<div>
										<p className="text-sm text-slate-500">Ngôn ngữ</p>
										<p className="font-medium text-slate-900">
											{course.language}
										</p>
									</div>
								</li>
								<li className="flex items-center gap-3">
									<Calendar className="w-5 h-5 text-slate-500" />
									<div>
										<p className="text-sm text-slate-500">Cập nhật lần cuối</p>
										<p className="font-medium text-slate-900">
											{course.lastUpdated}
										</p>
									</div>
								</li>
								<li className="flex items-center gap-3">
									<Award className="w-5 h-5 text-slate-500" />
									<div>
										<p className="text-sm text-slate-500">Chứng chỉ</p>
										<p className="font-medium text-slate-900">
											{course.certificate ? "Có" : "Không"}
										</p>
									</div>
								</li>
							</ul>
						</div>

						{/* Help */}
						<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
							<div className="flex items-center gap-3 mb-4">
								<HelpCircle className="w-5 h-5 text-blue-500" />
								<h3 className="font-semibold text-slate-900">Cần hỗ trợ?</h3>
							</div>
							<p className="text-sm text-slate-600 mb-4">
								Nếu bạn có câu hỏi về khóa học, đừng ngần ngại liên hệ với chúng
								tôi.
							</p>
							<ActionButton variant="outline" className="w-full">
								Liên hệ hỗ trợ
							</ActionButton>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CourseDetailPage;
