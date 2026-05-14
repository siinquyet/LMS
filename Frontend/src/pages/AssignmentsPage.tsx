import {
	BookOpen,
	ChevronDown,
	ChevronRight,
	ClipboardList,
	FileText,
	Search,
	X,
	HelpCircle,
	Zap,
	CheckCircle,
	BarChart3,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Card } from "../components/common";
import { getSkippedQuizzes, getCurrentUser } from "../api";

interface KhoaHoc {
	id: number;
	tieu_de: string;
}

interface QuizItem {
	id: number;
	tieu_de: string;
	so_cau_hoi: number;
	thoi_gian_lam: number | null;
	bai_hoc_id: number;
	ten_bai_hoc: string;
	khoa_hoc: KhoaHoc;
	trang_thai: "da_lam" | "chua_lam";
	diem: number | null;
	lan_lam_cuoi: string | null;
	so_lan_lam: number;
}

type FilterStatus = "all" | "da_lam" | "chua_lam";

export const AssignmentsPage: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCourse, setSelectedCourse] = useState<number | "all">("all");
	const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
	const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const currentUser = getCurrentUser();
				const userId = currentUser?.id;
				if (!userId) {
					setQuizzes([]);
					setError("Vui lòng đăng nhập");
					return;
				}
				const data = await getSkippedQuizzes(userId);
				setQuizzes(data.quizzes || []);
				setError(null);
			} catch (err) {
				setError("Không thể tải danh sách bài kiểm tra");
				setQuizzes([]);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const courses = useMemo(() => {
		const uniqueCourses = new Map<number, KhoaHoc>();
		for (const a of quizzes) {
			if (!uniqueCourses.has(a.khoa_hoc.id)) {
				uniqueCourses.set(a.khoa_hoc.id, a.khoa_hoc);
			}
		}
		return Array.from(uniqueCourses.values());
	}, [quizzes]);

	const [expandedCourses, setExpandedCourses] = useState<Set<number>>(new Set());

	// Expand all courses when data loads
	useEffect(() => {
		if (courses.length > 0) {
			setExpandedCourses(new Set(courses.map((c) => c.id)));
		}
	}, [courses]);

	const filteredQuizzes = useMemo(() => {
		return quizzes.filter((a) => {
			const matchesSearch =
				a.tieu_de.toLowerCase().includes(searchQuery.toLowerCase()) ||
				a.khoa_hoc.tieu_de.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCourse =
				selectedCourse === "all" || a.khoa_hoc.id === selectedCourse;
			const matchesStatus =
				filterStatus === "all" || a.trang_thai === filterStatus;
			return matchesSearch && matchesCourse && matchesStatus;
		});
	}, [searchQuery, selectedCourse, filterStatus, quizzes]);

	const toggleCourse = (courseId: number) => {
		setExpandedCourses((prev) => {
			const next = new Set(prev);
			if (next.has(courseId)) next.delete(courseId);
			else next.add(courseId);
			return next;
		});
	};

	const groupedByCourse = useMemo(() => {
		const groups: Record<number, QuizItem[]> = {};
		for (const a of filteredQuizzes) {
			const courseId = a.khoa_hoc.id;
			if (!groups[courseId]) groups[courseId] = [];
			groups[courseId].push(a);
		}
		return groups;
	}, [filteredQuizzes]);

	const totalSkipped = quizzes.filter((q) => q.trang_thai === "chua_lam").length;
	const totalDone = quizzes.filter((q) => q.trang_thai === "da_lam").length;

	if (loading) {
		return (
			<div className="min-h-screen bg-[#F8F6F3] py-8">
				<div className="max-w-7xl mx-auto px-4">
					<div className="flex items-center gap-3 mb-6">
						<FileText className="w-8 h-8 text-[#1C293C]" />
						<h1 className="font-['Inter', sans-serif] text-3xl text-[#1C293C]">
							Bài tập
						</h1>
					</div>

					<Card className="p-4 mb-6">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-1 h-10 bg-gray-200 animate-pulse rounded-[8px]" />
							<div className="flex gap-2">
								<div className="w-32 h-10 bg-gray-200 animate-pulse rounded-[8px]" />
								<div className="w-32 h-10 bg-gray-200 animate-pulse rounded-[8px]" />
							</div>
						</div>
						<div className="flex gap-4 mt-4 pt-4 border-t border-[#E5E1DC]">
							<div className="w-24 h-10 bg-gray-200 animate-pulse rounded-[8px]" />
							<div className="w-24 h-10 bg-gray-200 animate-pulse rounded-[8px]" />
							<div className="w-24 h-10 bg-gray-200 animate-pulse rounded-[8px]" />
						</div>
					</Card>

					<div className="space-y-4">
						{[1, 2].map((i) => (
							<Card key={i} className="p-4">
								<div className="h-12 bg-gray-200 animate-pulse rounded mb-4" />
								<div className="space-y-3">
									<div className="h-16 bg-gray-200 animate-pulse rounded" />
									<div className="h-16 bg-gray-200 animate-pulse rounded" />
								</div>
							</Card>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-[#F8F6F3] py-8">
				<div className="max-w-7xl mx-auto px-4">
					<div className="flex items-center gap-3 mb-6">
						<FileText className="w-8 h-8 text-[#1C293C]" />
						<h1 className="font-['Inter', sans-serif] text-3xl text-[#1C293C]">
							Bài tập
						</h1>
					</div>
					<Card className="p-8 text-center">
						<FileText className="w-16 h-16 text-red-400 mx-auto mb-4" />
						<h3 className="font-['Inter', sans-serif] text-xl text-[#1C293C] mb-2">
							Lỗi tải dữ liệu
						</h3>
						<p className="font-['Inter', sans-serif] text-[#6B7280] mb-4">
							{error}
						</p>
						<Button
							variant="primary"
							onClick={() => window.location.reload()}
						>
							Thử lại
						</Button>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F8F6F3] py-8">
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex items-center gap-3 mb-6">
					<FileText className="w-8 h-8 text-[#1C293C]" />
					<h1 className="font-['Inter', sans-serif] text-3xl text-[#1C293C]">
						Bài tập
					</h1>
				</div>

				<Card className="p-4 mb-6">
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
							<input
								type="text"
								placeholder="Tìm kiếm bài tập..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border-2 border-[#1C293C] rounded-[8px] font-['Inter', sans-serif] focus:border-[#49B6E5] outline-none"
							/>
							{searchQuery && (
								<button
									type="button"
									onClick={() => setSearchQuery("")}
									className="absolute right-3 top-1/2 -translate-y-1/2"
								>
									<X className="w-4 h-4 text-[#6B7280]" />
								</button>
							)}
						</div>

						<div className="flex gap-2">
							<select
								value={selectedCourse}
								onChange={(e) =>
									setSelectedCourse(
										e.target.value === "all"
											? "all"
											: Number(e.target.value),
									)
								}
								className="px-4 py-2 border-2 border-[#1C293C] rounded-[8px] font-['Inter', sans-serif] text-sm focus:border-[#49B6E5] outline-none"
							>
								<option value="all">Tất cả khóa học</option>
								{courses.map((c) => (
									<option key={c.id} value={c.id}>
										{c.tieu_de}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className="flex gap-2 mt-4 pt-4 border-t border-[#E5E1DC]">
						<button
							type="button"
							onClick={() => setFilterStatus("all")}
							className={`px-4 py-2 rounded-[8px] font-['Inter', sans-serif] text-sm font-medium transition-colors ${
								filterStatus === "all"
									? "bg-[#1C293C] text-white shadow-[2px_2px_0px_#49B6E5]"
									: "bg-white border-2 border-[#1C293C] text-[#1C293C] hover:bg-gray-50"
							}`}
						>
							Tất cả ({quizzes.length})
						</button>
						<button
							type="button"
							onClick={() => setFilterStatus("chua_lam")}
							className={`px-4 py-2 rounded-[8px] font-['Inter', sans-serif] text-sm font-medium transition-colors ${
								filterStatus === "chua_lam"
									? "bg-yellow-500 text-white shadow-[2px_2px_0px_#1C293C]"
									: "bg-white border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50"
							}`}
						>
							<Zap className="w-4 h-4 inline mr-1" />
							Chưa làm ({totalSkipped})
						</button>
						<button
							type="button"
							onClick={() => setFilterStatus("da_lam")}
							className={`px-4 py-2 rounded-[8px] font-['Inter', sans-serif] text-sm font-medium transition-colors ${
								filterStatus === "da_lam"
									? "bg-green-600 text-white shadow-[2px_2px_0px_#1C293C]"
									: "bg-white border-2 border-green-500 text-green-600 hover:bg-green-50"
							}`}
						>
							<CheckCircle className="w-4 h-4 inline mr-1" />
							Đã làm ({totalDone})
						</button>
					</div>
				</Card>

				<p className="font-['Inter', sans-serif] text-sm text-[#6B7280] mb-4">
					{filterStatus === "all"
						? `Hiển thị ${filteredQuizzes.length} bài kiểm tra`
						: filterStatus === "chua_lam"
							? `Tìm thấy ${filteredQuizzes.length} bài kiểm tra chưa làm`
							: `Tìm thấy ${filteredQuizzes.length} bài kiểm tra đã làm`}
				</p>

				{Object.keys(groupedByCourse).length === 0 ? (
					<div className="text-center py-12">
						<HelpCircle className="w-16 h-16 text-[#6B7280] mx-auto mb-4" />
						<h3 className="font-['Inter', sans-serif] text-xl text-[#1C293C] mb-2">
							{filterStatus === "chua_lam"
								? "Không có bài kiểm tra chưa làm"
								: filterStatus === "da_lam"
									? "Chưa làm bài kiểm tra nào"
									: "Không có dữ liệu bài kiểm tra"}
						</h3>
						<p className="font-['Inter', sans-serif] text-[#6B7280]">
							{filterStatus !== "chua_lam"
								? "Hoàn thành bài học để có bài kiểm tra"
								: "Bạn đã hoàn thành tất cả bài kiểm tra!"}
						</p>
					</div>
				) : (
					Object.entries(groupedByCourse).map(([courseId, courseQuizzes]) => {
						const courseName = courseQuizzes[0].khoa_hoc.tieu_de;
						const courseIdNum = Number(courseId);
						const isExpanded = expandedCourses.has(courseIdNum);
						const skippedCount = courseQuizzes.filter((q) => q.trang_thai === "chua_lam").length;

						return (
							<Card key={courseId} className="mb-4 overflow-hidden">
								<button
									type="button"
									onClick={() => toggleCourse(courseIdNum)}
									className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
								>
									<div className="flex items-center gap-3">
										{isExpanded ? (
											<ChevronDown className="w-5 h-5 text-[#1C293C]" />
										) : (
											<ChevronRight className="w-5 h-5 text-[#1C293C]" />
										)}
										<BookOpen className="w-5 h-5 text-[#49B6E5]" />
										<span className="font-['Inter', sans-serif] text-[#1C293C] font-semibold">
											{courseName}
										</span>
										{skippedCount > 0 && (
											<Badge variant="warning">
												{skippedCount} bài bỏ qua
											</Badge>
										)}
									</div>
									<div className="flex items-center gap-2">
										<span className="font-['Inter', sans-serif] text-sm text-[#6B7280]">
											{courseQuizzes.length} bài
											{skippedCount > 0 && ` (${skippedCount} chưa làm)`}
										</span>
									</div>
								</button>

								{isExpanded && (
									<div className="border-t border-[#E5E1DC]">
										{courseQuizzes.map((quiz) => (
											<div
												key={quiz.id}
												className={`flex items-center gap-4 p-4 border-b border-[#E5E1DC] hover:bg-gray-50 last:border-b-0 ${
													quiz.trang_thai === "da_lam" ? "bg-green-50/40" : ""
												}`}
											>
												<div
													className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
														quiz.trang_thai === "da_lam"
															? "bg-green-100 text-green-600"
															: "bg-yellow-100 text-yellow-600"
													}`}
												>
													{quiz.trang_thai === "da_lam" ? (
														<BarChart3 className="w-5 h-5" />
													) : (
														<Zap className="w-5 h-5" />
													)}
												</div>

												<div className="flex-1 min-w-0">
													<h3 className="font-['Inter', sans-serif] text-sm text-[#1C293C] truncate">
														{quiz.tieu_de}
													</h3>
													<div className="flex items-center gap-3 mt-1">
														<span className="font-['Inter', sans-serif] text-xs text-[#6B7280]">
															Bài: {quiz.ten_bai_hoc}
														</span>
														<span className="font-['Inter', sans-serif] text-xs text-[#6B7280]">
															{quiz.so_cau_hoi} câu
														</span>
														{quiz.trang_thai === "da_lam" && quiz.diem !== null && (
															<span className={`font-['Inter', sans-serif] text-xs font-bold ${
																quiz.diem >= 5 ? "text-green-600" : quiz.diem >= 3 ? "text-yellow-600" : "text-red-600"
															}`}>
																Điểm: {quiz.diem}/10
															</span>
														)}
													</div>
												</div>

												<div className="shrink-0">
													<Badge variant={quiz.trang_thai === "da_lam" ? "success" : "warning"}>
														{quiz.trang_thai === "da_lam" ? "Đã làm" : "Bỏ qua"}
													</Badge>
												</div>

												<Link
													to={
														quiz.trang_thai === "da_lam"
															? `/quiz/${quiz.khoa_hoc.id}/${quiz.bai_hoc_id}/review`
															: `/quiz/${quiz.khoa_hoc.id}/${quiz.bai_hoc_id}/do`
													}
													className="shrink-0"
												>
													<Button
														variant={quiz.trang_thai === "da_lam" ? "outline" : "primary"}
														size="sm"
													>
														{quiz.trang_thai === "da_lam" ? "Xem lại" : "Làm ngay"}
													</Button>
												</Link>
											</div>
										))}
									</div>
								)}
							</Card>
						);
					})
				)}
			</div>
		</div>
	);
};

export default AssignmentsPage;