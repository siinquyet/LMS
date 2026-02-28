import {
	BookOpen,
	Calendar,
	Code,
	GraduationCap,
	Palette,
	TrendingUp,
} from "lucide-react";
import ActionButton from "../components/common/ActionButton";
import CourseCard from "../components/common/CourseCard";
import SectionHeader from "../components/common/SectionHeader";

const featuredCourses = [
	{
		thumbnail: "/api/placeholder/400/225",
		title: "React & Next.js Full Course - Học từ cơ bản đến nâng cao",
		instructor: "John Doe",
		instructorLink: "#",
		price: "₫499.000",
		category: "Web Development",
		link: "#",
	},
	{
		thumbnail: "/api/placeholder/400/225",
		title: "Figma UI/UX Design Masterclass - Thiết kế chuyên nghiệp",
		instructor: "Jane Smith",
		instructorLink: "#",
		price: "₫299.000",
		category: "Design",
		link: "#",
	},
	{
		thumbnail: "/api/placeholder/400/225",
		title: "Digital Marketing 2024 - Chiến lược toàn diện",
		instructor: "Mike Johnson",
		instructorLink: "#",
		price: "₫399.000",
		category: "Marketing",
		link: "#",
	},
	{
		thumbnail: "/api/placeholder/400/225",
		title: "Python Data Science - Phân tích dữ liệu chuyên sâu",
		instructor: "Sarah Lee",
		instructorLink: "#",
		price: "₫599.000",
		category: "Data Science",
		link: "#",
	},
	{
		thumbnail: "/api/placeholder/400/225",
		title: "Leadership & Management - Kỹ năng lãnh đạo",
		instructor: "David Brown",
		instructorLink: "#",
		price: "₫249.000",
		category: "Business",
		link: "#",
	},
	{
		thumbnail: "/api/placeholder/400/225",
		title: "Mobile App Development with Flutter",
		instructor: "Emily Chen",
		instructorLink: "#",
		price: "₫449.000",
		category: "Mobile",
		link: "#",
	},
];

const categories = [
	{
		icon: Code,
		name: "Lập trình",
		count: "150+",
		color: "from-blue-500 to-indigo-600",
	},
	{
		icon: Palette,
		name: "Thiết kế",
		count: "89+",
		color: "from-pink-500 to-rose-600",
	},
	{
		icon: TrendingUp,
		name: "Marketing",
		count: "67+",
		color: "from-emerald-500 to-teal-600",
	},
	{
		icon: BookOpen,
		name: "Business",
		count: "120+",
		color: "from-purple-500 to-violet-600",
	},
	{
		icon: GraduationCap,
		name: "Phát triển bản thân",
		count: "45+",
		color: "from-amber-500 to-orange-600",
	},
	{
		icon: Calendar,
		name: "Quản lý thời gian",
		count: "32+",
		color: "from-slate-500 to-slate-600",
	},
];

const HomeContent = () => {
	return (
		<>
			{/* Hero Section */}
			<section className="w-full bg-white py-24 md:py-32">
				<div className="lms-container">
					<div className="max-w-4xl mx-auto text-center">
						<h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-6 leading-tight">
							Nâng Tầm Kỹ Năng
							<br />
							<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
								Kiến Tạo Tương Lai
							</span>
						</h1>
						<p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
							Học từ các chuyên gia hàng đầu thế giới.{" "}
							<span className="font-semibold text-slate-900">
								Hơn 10.000+ học viên
							</span>{" "}
							đã thay đổi sự nghiệp với chúng tôi.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
							<ActionButton size="lg" className="!px-10 !py-5 !text-lg">
								Khám phá khóa học
							</ActionButton>
							<ActionButton
								variant="outline"
								size="lg"
								className="!px-10 !py-5 !text-lg"
							>
								Tìm hiểu thêm
							</ActionButton>
						</div>
					</div>
				</div>
			</section>

			{/* Featured Courses */}
			<section className="w-full bg-slate-50 py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<SectionHeader
						title="Khóa học nổi bật"
						subtitle="Các khóa học được học viên đánh giá cao nhất"
						linkText="Xem tất cả khóa học"
					/>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{featuredCourses.slice(0, 6).map((course, index) => (
							<CourseCard key={`course-${index}`} {...course} />
						))}
					</div>
				</div>
			</section>

			{/* Categories */}
			<section className="w-full py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<SectionHeader
						title="Khám phá theo lĩnh vực"
						subtitle="Chọn lĩnh vực bạn muốn phát triển kỹ năng"
					/>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
						{categories.map((category) => {
							const Icon = category.icon;
							return (
								<div key={category.name} className="group">
									<div className="p-6 rounded-2xl border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300 bg-white h-full flex flex-col items-center text-center">
										<div
											className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-r ${category.color} shadow-lg`}
										>
											<Icon className="w-8 h-8 text-white" />
										</div>
										<h3 className="font-semibold text-slate-900 mb-1">
											{category.name}
										</h3>
										<p className="text-sm text-slate-500">
											{category.count} khóa học
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="max-w-4xl mx-auto text-center bg-white/80 backdrop-blur-sm rounded-3xl p-12 md:p-16 shadow-2xl">
						<h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
							Sẵn sàng bắt đầu hành trình?
						</h2>
						<p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
							Tham gia ngay hôm nay và nhận ngay tài liệu học tập miễn phí.
						</p>

						<ActionButton
							variant="outline"
							size="lg"
							className="!px-12 !py-6 !text-xl border-2 border-slate-200 hover:border-slate-300 hover:bg-white shadow-lg hover:shadow-xl"
							onClick={() => (window.location.href = "/register")}
						>
							Đăng ký tài khoản miễn phí
						</ActionButton>
					</div>
				</div>
			</section>
		</>
	);
};

export default HomeContent;
