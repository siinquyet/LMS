import {
	BookOpen,
	Calendar,
	PlayCircle,
	Search,
	User,
	Video,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ActionButton from "../components/common/ActionButton";
import { useMyCourses } from "../contexts/MyCoursesContext";

const ITEMS_PER_PAGE = 6;

const MyCoursesPage = () => {
	const { courses } = useMyCourses();
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredCourses = courses.filter((course) =>
		course.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

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

	if (courses.length === 0) {
		return (
			<div className="min-h-screen bg-slate-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
					<div className="text-center">
						<div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<BookOpen className="w-10 h-10 text-slate-400" />
						</div>
						<h2 className="text-2xl font-bold text-slate-900 mb-2">
							Bạn chưa có khóa học nào
						</h2>
						<p className="text-slate-500 mb-8">
							Mua khóa học để bắt đầu học ngay
						</p>
						<ActionButton>
							<Link to="/store">Khám phá khóa học</Link>
						</ActionButton>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Header */}
			<div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
						Khóa học của tôi
					</h1>
					<p className="text-blue-100">{courses.length} khóa học đã mua</p>
				</div>
			</div>

			{/* Search */}
			<div className="bg-white border-b border-slate-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="relative max-w-md">
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
				</div>
			</div>

			{/* Course List */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{filteredCourses.length > 0 ? (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{paginatedCourses.map((course) => (
								<Link
									key={course.id}
									to={`/learn/${course.id}`}
									className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300"
								>
									<div className="relative">
										<img
											src={course.thumbnail}
											alt={course.title}
											className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
										/>
										<div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
											<PlayCircle className="w-14 h-14 text-white" />
										</div>
										<div className="absolute top-3 left-3">
											<span className="px-2.5 py-1 bg-blue-600 text-white text-xs font-medium rounded">
												Đã mua
											</span>
										</div>
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

										{/* Progress Bar */}
										<div className="mb-3">
											<div className="flex items-center justify-between text-sm mb-1">
												<span className="text-slate-500">Tiến độ</span>
												<span className="font-medium text-slate-700">
													{course.progress}%
												</span>
											</div>
											<div className="h-2 bg-slate-200 rounded-full overflow-hidden">
												<div
													className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
													style={{ width: `${course.progress}%` }}
												/>
											</div>
										</div>

										<div className="flex items-center gap-4 text-sm text-slate-500">
											<div className="flex items-center gap-1">
												<Video className="w-4 h-4" />
												{course.chapters.reduce(
													(acc, ch) => acc + ch.lessons.length,
													0,
												)}{" "}
												bài
											</div>
											<div className="flex items-center gap-1">
												<Calendar className="w-4 h-4" />
												{course.purchaseDate}
											</div>
										</div>

										<div className="mt-4 pt-4 border-t border-slate-100">
											<ActionButton className="w-full">Tiếp tục học</ActionButton>
										</div>
									</div>
								</Link>
							))}
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="mt-12 flex justify-center">
								<div className="flex items-center gap-2">
									<button
										type="button"
										onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
												onClick={() => setCurrentPage(page)}
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
										onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
										disabled={currentPage === totalPages}
										className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										Sau
									</button>
								</div>
							</div>
						)}
					</>
				) : (
					<div className="text-center py-12">
						<p className="text-slate-500">Không tìm thấy khóa học nào</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default MyCoursesPage;
