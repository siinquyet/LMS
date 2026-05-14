import {
	CheckCircle,
	Clock,
	GraduationCap,
	Play,
	RotateCcw,
	Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMyEnrollments, refundOrder } from "../api";
import {
	Avatar,
	Badge,
	Button,
	Card,
	EmptyState,
	Input,
	Loader,
	Progress,
} from "../components/common";
import { useAuth } from "../contexts/AuthContext";

interface CurrentLesson {
	id: number;
	tieu_de: string;
}

interface Enrollment {
	id: number;
	khoa_hoc_id: number;
	tien_do: number;
	trang_thai: "completed" | "in_progress" | "not_started";
	ngay_dang_ky: string;
	ngay_hoan_thanh: string | null;
	bai_hoc_hien_tai?: CurrentLesson | null;
	khoa_hoc: {
		id: number;
		tieu_de: string;
		mo_ta: string;
		hinh_anh?: string;
		gia: number;
		giang_vien: {
			id: number;
			ho: string;
			ten: string;
			anh_dai_dien?: string;
		};
	};
}

const statusLabels = {
	not_started: "Chưa bắt đầu",
	in_progress: "Đang học",
	completed: "Hoàn thành",
};

const statusColors = {
	not_started: "default",
	in_progress: "warning",
	completed: "success",
};

interface EnrollmentWithOrder extends Enrollment {
	don_hang_id: number | null;
	don_hang_trang_thai: string | null;
}

export const MyCoursesPage: React.FC = () => {
	const { user } = useAuth();
	const [searchQuery, setSearchQuery] = useState("");
	const [enrollments, setEnrollments] = useState<EnrollmentWithOrder[]>([]);
	const [loading, setLoading] = useState(true);
	const [refundingId, setRefundingId] = useState<number | null>(null);

	useEffect(() => {
		const fetchEnrollments = async () => {
			if (!user) {
				setEnrollments([]);
				return;
			}
			setLoading(true);
			try {
				const { enrollments: data } = await getMyEnrollments();
				setEnrollments(data || []);
			} catch (error) {
				setEnrollments([]);
			} finally {
				setLoading(false);
			}
		};
		fetchEnrollments();
	}, [user]);

	const handleRefund = async (orderId: number) => {
		if (!confirm("Bạn có chắc chắn muốn hoàn tiền cho khóa học này?")) return;
		setRefundingId(orderId);
		try {
			await refundOrder(orderId);
			const { enrollments: data } = await getMyEnrollments();
			setEnrollments(data || []);
		} catch (error) {
			console.error("Refund error:", error);
		} finally {
			setRefundingId(null);
		}
	};

	const filteredEnrollments = useMemo(() => {
		return enrollments.filter((e: Enrollment) => {
			const matchesSearch = e.khoa_hoc?.tieu_de
				?.toLowerCase()
				.includes(searchQuery.toLowerCase());
			return !searchQuery || matchesSearch;
		});
	}, [searchQuery, enrollments]);

	const inProgressCount = enrollments.filter(
		(e: Enrollment) => e.trang_thai === "in_progress",
	).length;
	const notStartedCount = enrollments.filter(
		(e: Enrollment) => e.trang_thai === "not_started",
	).length;
	const completedCount = enrollments.filter(
		(e: Enrollment) => e.trang_thai === "completed",
	).length;

	if (loading) return <Loader />;

	return (
		<div className="min-h-screen bg-[#FBFBF9] py-8">
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex items-center gap-3 mb-6">
					<GraduationCap className="w-8 h-8 text-[#FDC800]" />
					<h1 className="text-[35px] font-bold text-[#1C293C]">
						Khóa học của tôi
					</h1>
				</div>

				<div className="grid grid-cols-3 gap-4 mb-6">
					<Card className="p-4 text-center">
						<Clock className="w-6 h-6 mx-auto mb-2 text-[#6B7280]" />
						<p className="text-[27px] font-bold text-[#1C293C]">
							{notStartedCount}
						</p>
						<p className="text-[13px] text-[#6B7280]">Chưa bắt đầu</p>
					</Card>
					<Card className="p-4 text-center">
						<Play className="w-6 h-6 mx-auto mb-2 text-[#D97706]" />
						<p className="text-[27px] font-bold text-[#1C293C]">
							{inProgressCount}
						</p>
						<p className="text-[13px] text-[#6B7280]">Đang học</p>
					</Card>
					<Card className="p-4 text-center">
						<CheckCircle className="w-6 h-6 mx-auto mb-2 text-[#16A34A]" />
						<p className="text-[27px] font-bold text-[#1C293C]">
							{completedCount}
						</p>
						<p className="text-[13px] text-[#6B7280]">Hoàn thành</p>
					</Card>
				</div>

				<Card className="p-4 mb-6">
					<Input
						iconLeft={<Search className="w-5 h-5" />}
						placeholder="Tìm kiếm khóa học..."
						value={searchQuery}
						onChange={setSearchQuery}
					/>
				</Card>

				{filteredEnrollments.length === 0 ? (
					<EmptyState
						icon={<GraduationCap className="w-8 h-8" />}
						title="Chưa có khóa học nào"
						description="Bạn chưa đăng ký khóa học nào. Hãy khám phá cửa hàng để tìm khóa học phù hợp."
						action={{
							label: "Khám phá khóa học",
							onClick: () => window.location.href = "/store"
						}}
					/>
				) : (
					<div className="space-y-4">
						{filteredEnrollments.map((enrollment: Enrollment) => (
							<Card key={enrollment.id} className="p-4">
								<div className="flex gap-4 flex-col md:flex-row">
									<img
										src={
						enrollment.khoa_hoc.hinh_anh ||
						"https://picsum.photos/seed/course/200/150"
										}
										alt={enrollment.khoa_hoc.tieu_de}
										className="w-full md:w-48 h-40 md:h-32 object-cover border-[3px] border-[#1C293C]"
									/>
									<div className="flex-1">
										<div className="flex items-center justify-between flex-wrap gap-2">
											<h3 className="text-[17px] font-bold text-[#1C293C]">
												{enrollment.khoa_hoc.tieu_de}
											</h3>
											<Badge
												variant={statusColors[enrollment.trang_thai] as any}
											>
												{statusLabels[enrollment.trang_thai]}
											</Badge>
										</div>
										<div className="flex items-center gap-2 mt-2">
											<Avatar
												name={
													enrollment.khoa_hoc.giang_vien
														? `${enrollment.khoa_hoc.giang_vien.ho} ${enrollment.khoa_hoc.giang_vien.ten}`
														: "Instructor"
												}
												src={enrollment.khoa_hoc.giang_vien?.anh_dai_dien}
												size="sm"
											/>
											<span className="text-[13px] text-[#6B7280]">
												{enrollment.khoa_hoc.giang_vien
													? `${enrollment.khoa_hoc.giang_vien.ho} ${enrollment.khoa_hoc.giang_vien.ten}`
													: "Giảng viên"}
											</span>
										</div>
										<div className="mt-3">
											<Progress
												value={enrollment.tien_do}
												variant={
													enrollment.trang_thai === "completed"
														? "success"
														: "primary"
												}
												showValue
											/>
										</div>
										<div className="flex gap-2 mt-3">
											<Link
												to={
													enrollment.bai_hoc_hien_tai
														? `/learn/${enrollment.khoa_hoc_id}/${enrollment.bai_hoc_hien_tai.id}`
														: `/learn/${enrollment.khoa_hoc_id}`
												}
											>
												<Button
													variant={
														enrollment.trang_thai === "not_started"
															? "primary"
															: "secondary"
													}
												>
													<Play className="w-4 h-4" />
													{enrollment.trang_thai === "not_started"
														? "Bắt đầu học"
														: enrollment.trang_thai === "completed"
															? "Xem lại"
															: "Tiếp tục học"}
												</Button>
											</Link>
											{(enrollment as any).don_hang_id &&
												["success", "pending"].includes(
													(enrollment as any).don_hang_trang_thai,
												) &&
												enrollment.trang_thai !== "completed" && (
													<Button
														variant="outline"
														onClick={() =>
															handleRefund((enrollment as any).don_hang_id)
														}
														disabled={
															refundingId === (enrollment as any).don_hang_id
														}
													>
														<RotateCcw className="w-4 h-4" />
														{refundingId === (enrollment as any).don_hang_id
															? "Đang xử lý..."
															: "Hoàn tiền"}
													</Button>
												)}
										</div>
									</div>
								</div>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default MyCoursesPage;
