import {
	BookOpen,
	Edit2,
	Eye,
	Filter,
	Plus,
	Trash2,
	Users,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCourse, getTeacherCourses } from "../api";
import {
	Badge,
	Button,
	Card,
	Loader,
	Modal,
	SearchInput,
} from "../components/common";
import { useAuth } from "../contexts/AuthContext";

const STATUS_LABELS: Record<string, string> = {
	draft: "Bản nháp",
	pending: "Chờ duyệt",
	approved: "Đã duyệt",
	rejected: "Bị từ chối",
};

const STATUS_COLORS: Record<string, string> = {
	draft: "default",
	pending: "warning",
	approved: "success",
	rejected: "danger",
};

export const TeacherCoursesPage: React.FC = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [courses, setCourses] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("");
	const [showFilterModal, setShowFilterModal] = useState(false);

	const fetchCourses = async () => {
		setLoading(true);
		try {
			const { courses: data } = await getTeacherCourses();
			setCourses(data || []);
		} catch (error) {
			console.error("Error fetching courses:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCourses();
	}, []);

	const handleDelete = async (id: number) => {
		if (!confirm("Bạn có chắc muốn xóa khóa học này?")) return;
		try {
			await deleteCourse(id);
			setCourses(courses.filter((c) => c.id !== id));
		} catch (error) {
			console.error("Error deleting:", error);
			alert("Xóa thất bại");
		}
	};

	const filteredCourses = courses.filter((c) => {
		const matchesSearch =
			!searchQuery ||
			c.tieu_de?.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = !statusFilter || c.trang_thai === statusFilter;
		return matchesSearch && matchesStatus;
	});

	const statusCounts = courses.reduce(
		(acc, c) => {
			acc[c.trang_thai] = (acc[c.trang_thai] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);

	if (loading) return <Loader />;

	return (
		<div className="min-h-screen bg-[#F8F6F3]">
			<div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="font-['Inter', sans-serif] text-3xl text-[#1C293C]">
							Khóa học
						</h1>
						<p className="text-gray-600 mt-2">
							Quản lý và tạo khóa học của bạn
						</p>
					</div>
					<Button
						variant="primary"
						onClick={() => navigate("/teacher/courses/new")}
					>
						<Plus className="w-4 h-4" />
						Tạo khóa học
					</Button>
				</div>

				<div className="flex gap-3 items-center">
					<div className="flex-1">
						<SearchInput
							value={searchQuery}
							onChange={setSearchQuery}
							placeholder="Tìm kiếm khóa học..."
						/>
					</div>
					<Button variant="outline" onClick={() => setShowFilterModal(true)}>
						<Filter className="w-4 h-4" />
						Lọc{" "}
						{statusFilter && (
							<Badge variant="primary" size="sm">
								{STATUS_LABELS[statusFilter]}
							</Badge>
						)}
					</Button>
				</div>

				{/* Status counts */}
				<div className="flex gap-3 text-sm">
					<button
						onClick={() => setStatusFilter("")}
						className={`px-3 py-1.5 rounded-full border-2 transition-all ${!statusFilter ? "border-[#49B6E5] bg-[#49B6E5]/10 text-[#49B6E5]" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
					>
						Tất cả ({courses.length})
					</button>
					{Object.entries(STATUS_LABELS).map(([status, label]) => (
						<button
							key={status}
							onClick={() =>
								setStatusFilter(statusFilter === status ? "" : status)
							}
							className={`px-3 py-1.5 rounded-full border-2 transition-all ${statusFilter === status ? "border-[#49B6E5] bg-[#49B6E5]/10 text-[#49B6E5]" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
						>
							{label} ({statusCounts[status] || 0})
						</button>
					))}
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredCourses.map((course: any) => (
						<Card key={course.id} hoverable className="overflow-hidden">
							<img
								src={
									course.thumbnail ||
									"https://picsum.photos/seed/course/400/300"
								}
								alt={course.tieu_de}
								className="w-full h-40 object-cover"
							/>
							<div className="p-4">
								<div className="flex items-start justify-between mb-2">
									<h3 className="font-['Inter', sans-serif] text-[#1C293C] line-clamp-2">
										{course.tieu_de}
									</h3>
									<Badge
										variant={
											(STATUS_COLORS[course.trang_thai] || "default") as any
										}
										size="sm"
									>
										{STATUS_LABELS[course.trang_thai] || course.trang_thai}
									</Badge>
								</div>
								<div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
									<Users className="w-4 h-4" />
									<span>{course.so_luong_da_dang_ky || 0} học viên</span>
								</div>
								<div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
									<span>{course.so_chuong || 0} chương</span>
									<span>•</span>
									<span>{course.tong_bai_hoc || 0} bài học</span>
								</div>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											navigate(`/teacher/courses/${course.id}/edit`)
										}
									>
										<Edit2 className="w-4 h-4" />
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => navigate(`/learn/${course.id}`)}
									>
										<Eye className="w-4 h-4" />
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleDelete(course.id)}
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							</div>
						</Card>
					))}
				</div>

				{filteredCourses.length === 0 && (
					<div className="text-center py-12">
						<BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
						<p className="text-gray-500">
							{statusFilter
								? "Không có khóa học nào ở trạng thái này"
								: "Chưa có khóa học nào"}
						</p>
						{!statusFilter && (
							<Button
								variant="primary"
								className="mt-4"
								onClick={() => navigate("/teacher/courses/new")}
							>
								Tạo khóa học đầu tiên
							</Button>
						)}
					</div>
				)}
			</div>

			{/* Filter Modal */}
			<Modal
				open={showFilterModal}
				onClose={() => setShowFilterModal(false)}
				title="Lọc khóa học"
			>
				<div className="space-y-3">
					<p className="font-['Inter', sans-serif] text-sm text-gray-600">
						Chọn trạng thái:
					</p>
					{Object.entries(STATUS_LABELS).map(([status, label]) => (
						<button
							key={status}
							onClick={() => {
								setStatusFilter(statusFilter === status ? "" : status);
								setShowFilterModal(false);
							}}
							className={`w-full p-3 rounded-[8px] border-2 text-left transition-all ${statusFilter === status ? "border-[#49B6E5] bg-[#49B6E5]/10" : "border-gray-200 hover:border-gray-300"}`}
						>
							<div className="flex items-center justify-between">
								<span className="font-['Inter', sans-serif]">{label}</span>
								<span className="text-sm text-gray-500">
									({statusCounts[status] || 0})
								</span>
							</div>
						</button>
					))}
				</div>
			</Modal>
		</div>
	);
};

export default TeacherCoursesPage;
