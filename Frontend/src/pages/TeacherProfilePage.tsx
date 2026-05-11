import { BookOpen, Calendar, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTeacherProfile } from "../api";
import { Avatar, Button, Card, Loader } from "../components/common";

export const TeacherProfilePage: React.FC = () => {
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [teacher, setTeacher] = useState<any>(null);
	const [courses, setCourses] = useState<any[]>([]);
	const [stats, setStats] = useState<{
		tong_khoa_hoc: number;
		tong_hoc_vien: number;
		trung_binh_xep_hang: number;
	} | null>(null);

	useEffect(() => {
		const fetchTeacher = async () => {
			if (!id) return;
			setLoading(true);
			try {
				const data = await getTeacherProfile(Number(id));
				setTeacher(data.giang_vien);
				setCourses(data.khoa_hoc || []);
				setStats(data.thong_tin);
			} catch (error) {
				console.error("Error fetching teacher:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchTeacher();
	}, [id]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader />
			</div>
		);
	}

	if (!teacher) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="font-['Inter', sans-serif] text-[#6B7280]">
					Không tìm thấy giảng viên
				</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F8F6F3]">
			{/* Header */}
			<div className="bg-[#1C293C] text-white py-12">
				<div className="container mx-auto px-4">
					<div className="flex items-center gap-6 max-w-4xl mx-auto">
						<Avatar
							name={teacher ? `${teacher.ho} ${teacher.ten}` : "Teacher"}
							size="xl"
							className="w-32 h-32 text-4xl"
						/>
						<div>
							<h1 className="font-['Inter', sans-serif] text-3xl mb-2">
								{teacher.ho} {teacher.ten}
							</h1>
							{teacher.gioi_thieu && (
								<p className="font-['Inter', sans-serif] text-white/80 max-w-xl">
									{teacher.gioi_thieu}
								</p>
							)}
							<div className="flex items-center gap-2 mt-2 text-white/60 text-sm">
								<Calendar className="w-4 h-4" />
								<span className="font-['Inter', sans-serif]">
									Tham gia:{" "}
									{new Date(teacher.ngay_tham_gia).toLocaleDateString("vi-VN")}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Stats */}
			{stats && (
				<div className="container mx-auto px-4 -mt-6">
					<div className="max-w-4xl mx-auto">
						<div className="flex gap-4 justify-center">
							<div className="bg-white p-4 rounded-[12px] border-2 border-[#1C293C] text-center">
								<BookOpen className="w-6 h-6 text-[#49B6E5] mx-auto mb-2" />
								<p className="font-['Inter', sans-serif] text-2xl font-bold text-[#1C293C]">
									{stats.tong_khoa_hoc}
								</p>
								<p className="font-['Inter', sans-serif] text-xs text-[#6B7280]">
									Khóa học
								</p>
							</div>
							<div className="bg-white p-4 rounded-[12px] border-2 border-[#1C293C] text-center">
								<Users className="w-6 h-6 text-[#49B6E5] mx-auto mb-2" />
								<p className="font-['Inter', sans-serif] text-2xl font-bold text-[#1C293C]">
									{stats.tong_hoc_vien}
								</p>
								<p className="font-['Inter', sans-serif] text-xs text-[#6B7280]">
									Học viên
								</p>
							</div>
							<div className="bg-white p-4 rounded-[12px] border-2 border-[#1C293C] text-center">
								<Star className="w-6 h-6 text-[#D97706] fill-[#D97706] mx-auto mb-2" />
								<p className="font-['Inter', sans-serif] text-2xl font-bold text-[#1C293C]">
									{stats.trung_binh_xep_hang?.toFixed(1) || "0"}
								</p>
								<p className="font-['Inter', sans-serif] text-xs text-[#6B7280]">
									Đánh giá
								</p>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Courses */}
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto">
					<h2 className="font-['Inter', sans-serif] text-xl text-[#1C293C] mb-6">
						Khóa học của tôi
					</h2>
					{courses.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{courses.map((course) => (
								<Link key={course.id} to={`/course/${course.id}`}>
									<Card className="overflow-hidden hover:shadow-lg transition-shadow">
										<div className="aspect-video bg-gray-200 relative">
											{course.thumbnailUrl ? (
												<img
													src={course.thumbnailUrl}
													alt={course.title}
													className="w-full h-full object-cover"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center text-gray-400">
													<BookOpen className="w-12 h-12" />
												</div>
											)}
										</div>
										<div className="p-4">
											<h3 className="font-['Inter', sans-serif] text-[#1C293C] font-semibold line-clamp-2 mb-2">
												{course.title}
											</h3>
											<div className="flex items-center justify-between text-sm">
												<div className="flex items-center gap-1 text-[#6B7280]">
													<Users className="w-4 h-4" />
													<span className="font-['Inter', sans-serif]">
														{course.enrolledCount}
													</span>
												</div>
												<div className="flex items-center gap-1 text-[#D97706]">
													<Star className="w-4 h-4 fill-[#D97706]" />
													<span className="font-['Inter', sans-serif]">
														{course.rating?.toFixed(1) || "0"}
													</span>
												</div>
												<span className="font-['Inter', sans-serif] font-bold text-[#1C293C]">
													{course.price === 0
														? "Miễn phí"
														: `${course.price.toLocaleString("vi-VN")} VNĐ`}
												</span>
											</div>
										</div>
									</Card>
								</Link>
							))}
						</div>
					) : (
						<div className="text-center py-12">
							<BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
							<p className="font-['Inter', sans-serif] text-[#6B7280]">
								Chưa có khóa học nào
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TeacherProfilePage;
