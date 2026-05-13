import {
	BookOpen,
	ChevronDown,
	ChevronRight,
	ClipboardList,
	FileText,
	Search,
	X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, Card } from "../components/common";
import { getAssignments } from "../api";
import { getCurrentUser } from "../api";

interface Course {
	id: number;
	tieu_de: string;
}

interface Submission {
	id: number;
	diem: number;
	ngay_nop: string;
}

interface Assignment {
	id: number;
	bai_hoc_id: number;
	tieu_de: string;
	mo_ta: string;
	bat_buoc: boolean;
	han_nop: string | null;
	khoa_hoc: Course;
	status: "pending" | "completed";
	submission: Submission | null;
}

interface AssignmentResponse {
	assignments: Assignment[];
}

export const AssignmentsPage: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCourse, setSelectedCourse] = useState<number | "all">("all");
	const [statusFilter, setStatusFilter] = useState<
		"all" | "pending" | "completed"
	>("all");
	const [assignments, setAssignments] = useState<Assignment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchAssignments = async () => {
			try {
				setLoading(true);
				const currentUser = getCurrentUser();
				const userId = currentUser?.id;
				const data = await getAssignments(userId) as AssignmentResponse;
				setAssignments(data.assignments || []);
				setError(null);
			} catch (err) {
				setError("Không thể tải danh sách bài tập");
				setAssignments([]);
			} finally {
				setLoading(false);
			}
		};
		fetchAssignments();
	}, []);

	const courses = useMemo(() => {
		const uniqueCourses = new Map<number, Course>();
		for (const a of assignments) {
			if (!uniqueCourses.has(a.khoa_hoc.id)) {
				uniqueCourses.set(a.khoa_hoc.id, a.khoa_hoc);
			}
		}
		return Array.from(uniqueCourses.values());
	}, [assignments]);

	const [expandedCourses, setExpandedCourses] = useState<Set<number>>(
		new Set(courses.map((c) => c.id)),
	);

	const filteredAssignments = useMemo(() => {
		return assignments.filter((a) => {
			const matchesSearch =
				a.tieu_de.toLowerCase().includes(searchQuery.toLowerCase()) ||
				a.khoa_hoc.tieu_de.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCourse =
				selectedCourse === "all" || a.khoa_hoc.id === selectedCourse;
			const matchesStatus = statusFilter === "all" || a.status === statusFilter;
			return matchesSearch && matchesCourse && matchesStatus;
		});
	}, [searchQuery, selectedCourse, statusFilter, assignments]);

	const toggleCourse = (courseId: number) => {
		setExpandedCourses((prev) => {
			const next = new Set(prev);
			if (next.has(courseId)) next.delete(courseId);
			else next.add(courseId);
			return next;
		});
	};

	const getStatusBadge = (status: string) => {
		return status === "pending" ? (
			<Badge variant="warning">Chưa làm</Badge>
		) : (
			<Badge variant="success">Đã nộp</Badge>
		);
	};

	const pendingCount = assignments.filter((a) => a.status === "pending").length;
	const completedCount = assignments.filter(
		(a) => a.status === "completed",
	).length;

	const groupedByCourse = useMemo(() => {
		const groups: Record<number, Assignment[]> = {};
		for (const a of filteredAssignments) {
			const courseId = a.khoa_hoc.id;
			if (!groups[courseId]) groups[courseId] = [];
			groups[courseId].push(a);
		}
		return groups;
	}, [filteredAssignments]);

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

							<select
								value={statusFilter}
								onChange={(e) =>
									setStatusFilter(e.target.value as typeof statusFilter)
								}
								className="px-4 py-2 border-2 border-[#1C293C] rounded-[8px] font-['Inter', sans-serif] text-sm focus:border-[#49B6E5] outline-none"
							>
								<option value="all">Tất cả trạng thái</option>
								<option value="pending">Chưa làm</option>
								<option value="completed">Đã nộp</option>
							</select>
						</div>
					</div>

					<div className="flex gap-4 mt-4 pt-4 border-t border-[#E5E1DC]">
						<button
							type="button"
							onClick={() => setStatusFilter("all")}
							className={`px-4 py-2 rounded-[8px] font-['Inter', sans-serif] text-sm ${statusFilter === "all" ? "bg-[#1C293C] text-white" : "bg-gray-100 text-[#6B7280]"}`}
						>
							Tất cả ({assignments.length})
						</button>
						<button
							type="button"
							onClick={() => setStatusFilter("pending")}
							className={`px-4 py-2 rounded-[8px] font-['Inter', sans-serif] text-sm ${statusFilter === "pending" ? "bg-red-500 text-white" : "bg-gray-100 text-[#6B7280]"}`}
						>
							Chưa làm ({pendingCount})
						</button>
						<button
							type="button"
							onClick={() => setStatusFilter("completed")}
							className={`px-4 py-2 rounded-[8px] font-['Inter', sans-serif] text-sm ${statusFilter === "completed" ? "bg-green-500 text-white" : "bg-gray-100 text-[#6B7280]"}`}
						>
							Đã nộp ({completedCount})
						</button>
					</div>
				</Card>

				<p className="font-['Inter', sans-serif] text-sm text-[#6B7280] mb-4">
					Tìm thấy {filteredAssignments.length} bài tập
				</p>

				{Object.keys(groupedByCourse).length === 0 ? (
					<div className="text-center py-12">
						<FileText className="w-16 h-16 text-[#6B7280] mx-auto mb-4" />
						<h3 className="font-['Inter', sans-serif] text-xl text-[#1C293C] mb-2">
							Không tìm thấy bài tập
						</h3>
						<p className="font-['Inter', sans-serif] text-[#6B7280]">
							{assignments.length === 0
								? "Bạn chưa có bài tập nào. Hãy đăng ký khóa học để bắt đầu."
								: "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"}
						</p>
					</div>
				) : (
					Object.entries(groupedByCourse).map(([courseId, courseAssignments]) => {
						const courseName = courseAssignments[0].khoa_hoc.tieu_de;
						const courseIdNum = Number(courseId);
						const isExpanded = expandedCourses.has(courseIdNum);

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
										<Badge variant="primary">
											{courseAssignments.length} bài
										</Badge>
									</div>
									<div className="flex items-center gap-2">
										<span className="font-['Inter', sans-serif] text-sm text-[#6B7280]">
											{courseAssignments.filter(
												(a) => a.status === "pending",
											).length}{" "}
											chưa làm
										</span>
									</div>
								</button>

								{isExpanded && (
									<div className="border-t border-[#E5E1DC]">
										{courseAssignments.map((assignment) => (
											<div
												key={assignment.id}
												className="flex items-center gap-4 p-4 border-b border-[#E5E1DC] hover:bg-gray-50 last:border-b-0"
											>
												<div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-purple-100 text-purple-600">
													<FileText className="w-5 h-5" />
												</div>

												<div className="flex-1 min-w-0">
													<h3 className="font-['Inter', sans-serif] text-sm text-[#1C293C] truncate">
														{assignment.tieu_de}
													</h3>
													<div className="flex items-center gap-3 mt-1">
														{assignment.bat_buoc && (
															<span className="font-['Inter', sans-serif] text-xs text-red-500 font-medium">
																Bắt buộc
															</span>
														)}
														{assignment.status === "completed" &&
															assignment.submission && (
																<span className="font-['Inter', sans-serif] text-xs text-green-600 font-semibold">
																	Điểm: {assignment.submission.diem}
																</span>
															)}
													</div>
												</div>

												<div className="shrink-0">
													{getStatusBadge(assignment.status)}
												</div>

												<Link to="#" className="shrink-0">
													<Button
														variant={
															assignment.status === "completed"
																? "secondary"
																: "primary"
														}
														size="sm"
													>
														{assignment.status === "completed"
															? "Xem lại"
															: "Làm bài"}
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