import {
	BookOpen,
	Code,
	Filter,
	Grid3X3,
	Heart,
	Palette,
	Search,
	ShoppingCart,
	SlidersHorizontal,
	Star,
	TrendingUp,
	User,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ActionButton from "../components/common/ActionButton";

const allCourses = [
	{
		id: 1,
		thumbnail:
			"https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
		title: "React & Next.js Full Course - Học từ cơ bản đến nâng cao",
		instructor: "John Doe",
		instructorAvatar: "",
		rating: 4.8,
		students: 1250,
		price: 499000,
		category: "Lập trình",
		level: "Cơ bản",
		duration: "40 giờ",
	},
	{
		id: 2,
		thumbnail:
			"https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop",
		title: "Figma UI/UX Design Masterclass - Thiết kế chuyên nghiệp",
		instructor: "Jane Smith",
		instructorAvatar: "",
		rating: 4.9,
		students: 890,
		price: 299000,
		category: "Thiết kế",
		level: "Trung cấp",
		duration: "25 giờ",
	},
	{
		id: 3,
		thumbnail:
			"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
		title: "Digital Marketing 2024 - Chiến lược toàn diện",
		instructor: "Mike Johnson",
		instructorAvatar: "",
		rating: 4.7,
		students: 2100,
		price: 399000,
		category: "Marketing",
		level: "Cơ bản",
		duration: "30 giờ",
	},
	{
		id: 4,
		thumbnail:
			"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
		title: "Python Data Science - Phân tích dữ liệu chuyên sâu",
		instructor: "Sarah Lee",
		instructorAvatar: "",
		rating: 4.9,
		students: 1560,
		price: 599000,
		category: "Lập trình",
		level: "Nâng cao",
		duration: "50 giờ",
	},
	{
		id: 5,
		thumbnail:
			"https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=225&fit=crop",
		title: "Leadership & Management - Kỹ năng lãnh đạo",
		instructor: "David Brown",
		instructorAvatar: "",
		rating: 4.6,
		students: 780,
		price: 249000,
		category: "Kinh doanh",
		level: "Trung cấp",
		duration: "20 giờ",
	},
	{
		id: 6,
		thumbnail:
			"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=225&fit=crop",
		title: "Mobile App Development with Flutter",
		instructor: "Emily Chen",
		instructorAvatar: "",
		rating: 4.8,
		students: 920,
		price: 449000,
		category: "Lập trình",
		level: "Trung cấp",
		duration: "35 giờ",
	},
	{
		id: 7,
		thumbnail:
			"https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=225&fit=crop",
		title: "Cybersecurity Fundamentals - An ninh mạng",
		instructor: "Alex Turner",
		instructorAvatar: "",
		rating: 4.7,
		students: 650,
		price: 549000,
		category: "Lập trình",
		level: "Cơ bản",
		duration: "28 giờ",
	},
	{
		id: 8,
		thumbnail:
			"https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop",
		title: "Video Editing with Premiere Pro",
		instructor: "Maria Garcia",
		instructorAvatar: "",
		rating: 4.5,
		students: 1100,
		price: 349000,
		category: "Thiết kế",
		level: "Cơ bản",
		duration: "22 giờ",
	},
	{
		id: 9,
		thumbnail:
			"https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=225&fit=crop",
		title: "Financial Analysis & Modeling",
		instructor: "Robert Wilson",
		instructorAvatar: "",
		rating: 4.8,
		students: 480,
		price: 699000,
		category: "Kinh doanh",
		level: "Nâng cao",
		duration: "45 giờ",
	},
];

const categories = [
	{ id: "all", name: "Tất cả", icon: Grid3X3 },
	{ id: "programming", name: "Lập trình", icon: Code },
	{ id: "design", name: "Thiết kế", icon: Palette },
	{ id: "marketing", name: "Marketing", icon: TrendingUp },
	{ id: "business", name: "Kinh doanh", icon: BookOpen },
];

const levels = ["Tất cả", "Cơ bản", "Trung cấp", "Nâng cao"];
const sortOptions = [
	{ value: "popular", label: "Phổ biến nhất" },
	{ value: "newest", label: "Mới nhất" },
	{ value: "price-low", label: "Giá: Thấp đến cao" },
	{ value: "price-high", label: "Giá: Cao đến thấp" },
	{ value: "rating", label: "Đánh giá cao" },
];

const ITEMS_PER_PAGE = 9;

const StorePage = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [selectedLevel, setSelectedLevel] = useState("Tất cả");
	const [sortBy, setSortBy] = useState("popular");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
	const [showFilters, setShowFilters] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
			maximumFractionDigits: 0,
		}).format(price);
	};

	const filteredCourses = allCourses
		.filter((course) => {
			const matchesSearch =
				course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory =
				selectedCategory === "all" ||
				course.category
					.toLowerCase()
					.includes(
						selectedCategory === "programming"
							? "lập trình"
							: selectedCategory === "design"
								? "thiết kế"
								: selectedCategory === "marketing"
									? "marketing"
									: selectedCategory === "business"
										? "kinh doanh"
										: "",
					);
			const matchesLevel =
				selectedLevel === "Tất cả" || course.level === selectedLevel;
			const matchesPrice =
				course.price >= priceRange[0] && course.price <= priceRange[1];

			return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case "popular":
					return b.students - a.students;
				case "price-low":
					return a.price - b.price;
				case "price-high":
					return b.price - a.price;
				case "rating":
					return b.rating - a.rating;
				default:
					return 0;
			}
		});

	const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const paginatedCourses = filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		if (totalPages <= 5) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
		} else {
			if (currentPage <= 3) {
				pages.push(1, 2, 3, 4, "...", totalPages);
			} else if (currentPage >= totalPages - 2) {
				pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
			} else {
				pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
			}
		}
		return pages;
	};
	return (
		<div className="min-h-screen bg-slate-50">
			{/* Header Banner */}
			<div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
						Cửa hàng khóa học
					</h1>
					<p className="text-blue-100 text-lg max-w-2xl">
						Khám phá hàng trăm khóa học chất lượng từ các chuyên gia hàng đầu.
						Nâng cao kỹ năng và phát triển sự nghiệp của bạn ngay hôm nay.
					</p>
				</div>
			</div>

			{/* Search & Filter Bar */}
			<div className="bg-white border-b border-slate-200 sticky top-16 z-40">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
						{/* Search */}
						<div className="relative flex-1 w-full max-w-xl">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
							<input
								type="text"
								placeholder="Tìm kiếm khóa học..."
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setCurrentPage(1);
								}}
								className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-slate-50"
							/>
						</div>

						{/* Filter Controls */}
						<div className="flex items-center gap-3 w-full lg:w-auto">
							<button
								type="button"
								onClick={() => setShowFilters(!showFilters)}
								className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
									showFilters
										? "bg-blue-50 border-blue-300 text-blue-700"
										: "border-slate-200 text-slate-600 hover:bg-slate-50"
								}`}
							>
								<SlidersHorizontal className="w-4 h-4" />
								<span className="font-medium">Lọc</span>
							</button>

							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer"
							>
								{sortOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>

							<div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
								<button
									type="button"
									onClick={() => setViewMode("grid")}
									className={`p-2.5 transition-colors ${
										viewMode === "grid"
											? "bg-blue-600 text-white"
											: "bg-white text-slate-500 hover:bg-slate-50"
									}`}
								>
									<Grid3X3 className="w-4 h-4" />
								</button>
								<button
									type="button"
									onClick={() => setViewMode("list")}
									className={`p-2.5 transition-colors ${
										viewMode === "list"
											? "bg-blue-600 text-white"
											: "bg-white text-slate-500 hover:bg-slate-50"
									}`}
								>
									<Filter className="w-4 h-4" />
								</button>
							</div>
						</div>
					</div>

					{/* Expanded Filters */}
					{showFilters && (
						<div className="mt-4 pt-4 border-t border-slate-200 animate-in slide-in-from-top-2">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-2">
										Danh mục
									</label>
									<div className="flex flex-wrap gap-2">
										{categories.map((cat) => {
											const Icon = cat.icon;
											return (
												<button
													key={cat.id}
													type="button"
													onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
													className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
														selectedCategory === cat.id
															? "bg-blue-600 text-white"
															: "bg-slate-100 text-slate-600 hover:bg-slate-200"
													}`}
												>
													<Icon className="w-3.5 h-3.5" />
													{cat.name}
												</button>
											);
										})}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-700 mb-2">
										Trình độ
									</label>
									<div className="flex flex-wrap gap-2">
										{levels.map((level) => (
											<button
												key={level}
												type="button"
												onClick={() => setSelectedLevel(level)}
												className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
													selectedLevel === level
														? "bg-blue-600 text-white"
														: "bg-slate-100 text-slate-600 hover:bg-slate-200"
												}`}
											>
												{level}
											</button>
										))}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-700 mb-2">
										Khoảng giá
									</label>
									<div className="flex items-center gap-3">
										<input
											type="number"
											placeholder="Min"
											value={priceRange[0]}
											onChange={(e) =>
												setPriceRange([Number(e.target.value), priceRange[1]])
											}
											className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
										/>
										<span className="text-slate-400">-</span>
										<input
											type="number"
											placeholder="Max"
											value={priceRange[1]}
											onChange={(e) =>
												setPriceRange([priceRange[0], Number(e.target.value)])
											}
											className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
										/>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Category Pills */}
			<div className="bg-white border-b border-slate-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
					<div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
						<span className="text-sm text-slate-500 whitespace-nowrap">
							Danh mục:
						</span>
						{categories.map((cat) => {
							const Icon = cat.icon;
							return (
								<button
									key={cat.id}
									type="button"
									onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
									className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
										selectedCategory === cat.id
											? "bg-blue-600 text-white shadow-md"
											: "bg-slate-100 text-slate-600 hover:bg-slate-200"
									}`}
								>
									<Icon className="w-4 h-4" />
									{cat.name}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{/* Results */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex items-center justify-between mb-6">
					<p className="text-slate-600">
						Tìm thấy{" "}
						<span className="font-semibold text-slate-900">
							{filteredCourses.length}
						</span>{" "}
						khóa học
					</p>
				</div>

				{paginatedCourses.length > 0 ? (
					<div
						className={
							viewMode === "grid"
								? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
								: "space-y-4"
						}
					>
						{paginatedCourses.map((course) => (
							<Link
								key={course.id}
								to={`/course/${course.id}`}
								className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300"
							>
								<div className="relative">
									<img
										src={course.thumbnail}
										alt={course.title}
										className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
									/>
									<div className="absolute top-3 left-3">
										<span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-slate-700">
											{course.category}
										</span>
									</div>
									<button
										type="button"
										className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-500 hover:text-red-500 transition-colors"
										aria-label="Add to wishlist"
									>
										<Heart className="w-4 h-4" />
									</button>
								</div>

								<div className="p-5">
									<h3 className="font-semibold text-slate-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
										{course.title}
									</h3>

									<div className="flex items-center gap-2 mb-3">
										<div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
											<User className="w-3.5 h-3.5 text-white" />
										</div>
										<span className="text-sm text-slate-600">
											{course.instructor}
										</span>
									</div>

									<div className="flex items-center gap-4 mb-4 text-sm">
										<div className="flex items-center gap-1">
											<Star className="w-4 h-4 text-amber-400 fill-amber-400" />
											<span className="font-medium text-slate-900">
												{course.rating}
											</span>
											<span className="text-slate-500">
												({course.students.toLocaleString()})
											</span>
										</div>
										<span className="text-slate-400">|</span>
										<span className="text-slate-500">{course.duration}</span>
									</div>

									<div className="flex items-center justify-between pt-4 border-t border-slate-100">
										<span className="text-xl font-bold text-blue-600">
											{formatPrice(course.price)}
										</span>
										<button
											type="button"
											className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
										>
											<ShoppingCart className="w-4 h-4" />
											Thêm vào giỏ
										</button>
									</div>
								</div>
							</Link>
						))}
					</div>
				) : (
					<div className="text-center py-16">
						<div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<Search className="w-10 h-10 text-slate-400" />
						</div>
						<h3 className="text-xl font-semibold text-slate-900 mb-2">
							Không tìm thấy khóa học nào
						</h3>
						<p className="text-slate-500 mb-6">
							Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
						</p>
						<ActionButton
							onClick={() => {
								setSearchQuery("");
								setSelectedCategory("all");
								setSelectedLevel("Tất cả");
								setPriceRange([0, 1000000]);
							}}
						>
							Xóa bộ lọc
						</ActionButton>
					</div>
				)}

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="mt-12 flex justify-center">
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => {
									setCurrentPage((p) => Math.max(1, p - 1));
									window.scrollTo({ top: 0, behavior: "smooth" });
								}}
								disabled={currentPage === 1}
								className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Trước
							</button>
							{getPageNumbers().map((page, index) => (
								typeof page === "number" ? (
									<button
										key={`page-${page}`}
										type="button"
										onClick={() => {
											setCurrentPage(page);
											window.scrollTo({ top: 0, behavior: "smooth" });
										}}
										className={`px-4 py-2 rounded-lg font-medium transition-colors ${
											currentPage === page
												? "bg-blue-600 text-white"
												: "border border-slate-200 text-slate-600 hover:bg-slate-50"
										}`}
									>
										{page}
									</button>
								) : (
									<span key={`ellipsis-${index}`} className="px-2 text-slate-400">
										{page}
									</span>
								)
							))}
							<button
								type="button"
								onClick={() => {
									setCurrentPage((p) => Math.min(totalPages, p + 1));
									window.scrollTo({ top: 0, behavior: "smooth" });
								}}
								disabled={currentPage === totalPages}
								className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Sau
							</button>
						</div>
					</div>
					)}
			</div>
		</div>
	);
};

export default StorePage;
