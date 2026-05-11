import {
	ArrowLeft,
	ArrowUpDown,
	Award,
	BookOpen,
	CheckCircle,
	ChevronDown,
	Clock,
	FileText,
	Flag,
	GraduationCap,
	Heart,
	MessageSquare,
	Play,
	Reply,
	Send,
	ShoppingCart,
	Star,
	Users,
	Video,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
	checkEnrollment,
	createReview,
	enrollCourse,
	getCourse,
	getCourseReviews,
} from "../api";
import { Avatar, Badge, Button, Card, Loader } from "../components/common";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { courseDetailMockData } from "../mockData";

export const CourseDetailPage: React.FC = () => {
	const { id } = useParams();
	const { addItem } = useCart();
	const { user } = useAuth();
	const [course, setCourse] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [openChapters, setOpenChapters] = useState<number[]>([]);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [userRating, setUserRating] = useState(0);
	const [ratingComment, setRatingComment] = useState("");
	const [isEnrolled, setIsEnrolled] = useState(false);
	const [isCompleted, setIsCompleted] = useState(false);
	const [reviews, setReviews] = useState<any[]>([]);
	const [reviewStats, setReviewStats] = useState<{
		trung_binh_xep_hang: number;
		tong_danh_gia: number;
	}>({ trung_binh_xep_hang: 0, tong_danh_gia: 0 });
	const [submittingReview, setSubmittingReview] = useState(false);

	useEffect(() => {
		const fetchCourse = async () => {
			if (!id) return;
			setLoading(true);
			try {
				const [{ course: data }, enrollCheck, reviewsData] = await Promise.all([
					getCourse(Number(id)),
					user
						? checkEnrollment(Number(id)).catch(() => ({ enrolled: false }))
						: Promise.resolve({ enrolled: false }),
					getCourseReviews(Number(id)).catch(() => ({
						danh_gia: [],
						thong_tin: {},
					})),
				]);
				if (data && data.tieu_de) {
					setCourse(data);
					setIsEnrolled(enrollCheck.enrolled);
					setIsCompleted(!!enrollCheck.enrollment?.completedAt);
				} else {
					setCourse(courseDetailMockData);
				}
				if (reviewsData) {
					setReviews(reviewsData.danh_gia || []);
					setReviewStats(
						reviewsData.thong_tin || {
							trung_binh_xep_hang: 0,
							tong_danh_gia: 0,
						},
					);
				}
			} catch (error) {
				console.error("Error fetching course:", error);
				setCourse(courseDetailMockData);
			} finally {
				setLoading(false);
			}
		};
		fetchCourse();
	}, [id, user]);

	const isMock = !course?.tieu_de;
	const displayCourse = isMock
		? {
				...courseDetailMockData,
				id: Number(id),
				tieu_de: course?.tieu_de || courseDetailMockData.title,
				gia: course?.gia || courseDetailMockData.price,
				mo_ta: course?.mo_ta || courseDetailMockData.description,
				danh_muc: course?.danh_muc || { ten: courseDetailMockData.category },
				muc_do: course?.muc_do || courseDetailMockData.level,
				thoi_luong: course?.thoi_luong || courseDetailMockData.duration,
				so_bai_hoc: course?.so_bai_hoc || courseDetailMockData.lessons,
				xep_hang: course?.xep_hang || courseDetailMockData.rating,
				so_luong_da_dang_ky:
					course?.so_luong_da_dang_ky || courseDetailMockData.students,
				thumbnail: course?.thumbnail || courseDetailMockData.thumbnail,
				giang_vien: course?.giang_vien || {
					ten: courseDetailMockData.instructor,
					ho: "",
					gioi_thieu: courseDetailMockData.instructorBio,
				},
				chuong_hoc: course?.chuong_hoc || courseDetailMockData.chapters,
			}
		: course;

	const handleSubmitRating = async () => {
		if (!user || !id || userRating === 0 || !ratingComment.trim()) return;
		setSubmittingReview(true);
		try {
			await createReview(Number(id), userRating, ratingComment);
			alert("Đánh giá của bạn đã được gửi!");
			setUserRating(0);
			setRatingComment("");
			const reviewsData = await getCourseReviews(Number(id));
			if (reviewsData) {
				setReviews(reviewsData.danh_gia || []);
				setReviewStats(
					reviewsData.thong_tin || { trung_binh_xep_hang: 0, tong_danh_gia: 0 },
				);
			}
		} catch (error: any) {
			alert(error.message || "Không thể gửi đánh giá");
		} finally {
			setSubmittingReview(false);
		}
	};

	const toggleChapter = (chapterId: number) => {
		setOpenChapters((prev) =>
			prev.includes(chapterId)
				? prev.filter((id) => id !== chapterId)
				: [...prev, chapterId],
		);
	};

	const handleAddToCart = () => {
		if (!course) return;
		addItem({
			id: course.id,
			title: course.tieu_de,
			thumbnail: course.thumbnail,
			instructor: course.giang_vien?.ten,
			price: course.gia,
			originalPrice: course.gia,
		});
	};

	const handleEnroll = async () => {
		if (!course || !user) return;
		try {
			await enrollCourse(user.id, course.id);
			alert("Đăng ký thành công!");
		} catch (error) {
			console.error("Error enrolling:", error);
		}
	};

	if (loading) return <Loader />;
	if (!displayCourse) return <div>Không tìm thấy khóa học</div>;

	const courseData = displayCourse;

	return (
		<div className="w-full bg-[#F8F6F3]">
			{/* Hero Section */}
			<div className="bg-[#1C293C] text-white py-12">
				<div className="w-full px-4">
					<Link
						to="/store"
						className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6"
					>
						<ArrowLeft className="w-4 h-4" />
						<span className="font-['Inter', sans-serif] text-sm">
							Quay lại cửa hàng
						</span>
					</Link>

					<div className="flex flex-col lg:flex-row gap-8">
						{/* Left - Course Info */}
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-4">
								<Badge variant="primary">
									{course.danh_muc?.ten || "Lập trình"}
								</Badge>
								<Badge variant="warning">{course.muc_do || "Trung cấp"}</Badge>
							</div>

							<h1 className="font-['Inter', sans-serif] text-3xl md:text-4xl mb-4">
								{course.tieu_de}
							</h1>

							<p className="font-['Inter', sans-serif] text-white/80 mb-6 text-lg">
								{course.mo_ta}
							</p>

							<div className="flex flex-wrap items-center gap-4 mb-6">
								<div className="flex items-center gap-2">
									<Star className="w-5 h-5 text-[#D97706] fill-[#D97706]" />
									<span className="font-['Inter', sans-serif] font-semibold">
										{course.xep_hang || 0}
									</span>
									<span className="font-['Inter', sans-serif] text-white/70">
										({course.so_luong_da_dang_ky || 0} học viên)
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Clock className="w-5 h-5" />
									<span className="font-['Inter', sans-serif]">
										{course.thoi_luong || "0 giờ"}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<FileText className="w-5 h-5" />
									<span className="font-['Inter', sans-serif]">
										{course.so_bai_hoc || 0} bài học
									</span>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<Avatar
									name={
										course.giang_vien?.ten
											? `${course.giang_vien.ho} ${course.giang_vien.ten}`
											: "Instructor"
									}
									size="lg"
								/>
								<div>
									<p className="font-['Inter', sans-serif] text-sm text-white/70">
										Giảng viên
									</p>
									<p className="font-['Inter', sans-serif] font-semibold">
										{course.giang_vien?.ten
											? `${course.giang_vien.ho} ${course.giang_vien.ten}`
											: "Instructor"}
									</p>
								</div>
							</div>
						</div>

						{/* Right - Purchase Card */}
						<div className="w-full lg:w-96">
							<Card className="bg-white p-0 overflow-hidden">
								<img
									src={
										course.thumbnail ||
										course.hinh_anh ||
										"https://picsum.photos/seed/course/800/400"
									}
									alt={course.tieu_de}
									className="w-full h-48 object-cover"
								/>
								<div className="p-6">
									<div className="flex items-end gap-2 mb-4">
										<span className="font-['Inter', sans-serif] text-3xl font-bold text-[#1C293C]">
											{(course.gia || 0).toLocaleString()}đ
										</span>
									</div>

									{isEnrolled ? (
										<Link to={`/learn/${course.id}`}>
											<Button
												variant="primary"
												size="lg"
												className="w-full mb-3"
											>
												<Play className="w-5 h-5" />
												Vào học ngay
											</Button>
										</Link>
									) : (
										<Button
											variant="primary"
											size="lg"
											className="w-full mb-3"
											onClick={handleAddToCart}
										>
											<ShoppingCart className="w-5 h-5" />
											Thêm vào giỏ
										</Button>
									)}

									{isEnrolled ? null : (
										<Link to="/my-courses">
											<Button variant="secondary" size="lg" className="w-full">
												<Play className="w-5 h-5" />
												Học thử miễn phí
											</Button>
										</Link>
									)}

									<p className="font-['Inter', sans-serif] text-xs text-[#6B7280] text-center mt-4">
										🔒 30 ngày hoàn tiền nếu không hài lòng
									</p>
								</div>
							</Card>
						</div>
					</div>
				</div>
			</div>

			{/* Course Content */}
			<div className="w-full px-4 py-12">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Main Content */}
					<div className="flex-1">
						{/* What You'll Learn */}
						<Card className="mb-8">
							<h2 className="font-['Inter', sans-serif] text-xl text-[#1C293C] mb-4 flex items-center gap-2">
								<GraduationCap className="w-6 h-6 text-[#49B6E5]" />
								Bạn sẽ học được gì?
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								{(courseData.whatYouLearn || []).map((item, index) => (
									<div key={index} className="flex items-start gap-2">
										<CheckCircle className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
										<span className="font-['Inter', sans-serif] text-sm text-[#1C293C]">
											{item}
										</span>
									</div>
								))}
							</div>
						</Card>

						{/* Course Content */}
						<Card className="mb-8">
							<h2 className="font-['Inter', sans-serif] text-xl text-[#1C293C] mb-4 flex items-center gap-2">
								<FileText className="w-6 h-6 text-[#49B6E5]" />
								Nội dung khóa học
							</h2>
							<p className="font-['Inter', sans-serif] text-sm text-[#6B7280] mb-4">
								{(course.chuong_hoc || []).length} chương •{" "}
								{course.so_bai_hoc || 0} bài học •{" "}
								{course.thoi_luong || "0 giờ"} tổng thời lượng
							</p>

							<div className="space-y-2">
								{(course.chuong_hoc || []).map((chapter: any) => (
									<div
										key={chapter.id}
										className="border-2 border-[#1C293C] rounded-[12px] overflow-hidden"
									>
										<button
											onClick={() => toggleChapter(chapter.id)}
											className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-[#F8F6F3] transition-colors"
										>
											<span className="font-['Inter', sans-serif] text-[#1C293C]">
												{chapter.thu_tu}. {chapter.tieu_de} (
												{(chapter.bai_hoc || []).length} bài)
											</span>
											<ChevronDown
												className={`w-5 h-5 text-[#1C293C] transition-transform ${openChapters.includes(chapter.id) ? "rotate-180" : ""}`}
											/>
										</button>
										{openChapters.includes(chapter.id) && (
											<div className="px-4 py-3 bg-[#F8F6F3] border-t-2 border-dashed border-[#E5E1DC] space-y-2">
												{(chapter.bai_hoc || []).map((lesson: any) => (
													<div
														key={lesson.id}
														className="flex items-center justify-between p-2 hover:bg-white rounded-[8px]"
													>
														<div className="flex items-center gap-2">
															{lesson.loai === "video" && (
																<Video className="w-4 h-4 text-[#6B7280]" />
															)}
															{lesson.loai === "exercise" && (
																<FileText className="w-4 h-4 text-[#6B7280]" />
															)}
															{lesson.loai === "quiz" && (
																<Star className="w-4 h-4 text-[#6B7280]" />
															)}
															<span className="font-['Inter', sans-serif] text-sm text-[#1C293C]">
																{lesson.tieu_de}
															</span>
														</div>
														<span className="font-['Inter', sans-serif] text-xs text-[#6B7280]">
															{lesson.thoi_luong}
														</span>
													</div>
												))}
											</div>
										)}
									</div>
								))}
							</div>
						</Card>

						{/* Requirements */}
						<Card className="mb-8">
							<h2 className="font-['Inter', sans-serif] text-xl text-[#1C293C] mb-4 flex items-center gap-2">
								<Award className="w-6 h-6 text-[#49B6E5]" />
								Yêu cầu
							</h2>
							<ul className="space-y-2">
								{(course.requirements || []).map((req: any, index: number) => (
									<li key={index} className="flex items-center gap-2">
										<span className="w-2 h-2 bg-[#1C293C] rounded-full" />
										<span className="font-['Inter', sans-serif] text-sm text-[#1C293C]">
											{req}
										</span>
									</li>
								))}
							</ul>
						</Card>

						{/* Instructor */}
						<Card className="mb-8">
							<h2 className="font-['Inter', sans-serif] text-xl text-[#1C293C] mb-4 flex items-center gap-2">
								<Users className="w-6 h-6 text-[#49B6E5]" />
								Giảng viên
							</h2>
							<div className="flex items-start gap-4">
								<Avatar
									name={
										course.giang_vien?.ten
											? `${course.giang_vien.ho} ${course.giang_vien.ten}`
											: "Instructor"
									}
									size="xl"
								/>
								<div>
									<h3 className="font-['Inter', sans-serif] text-lg text-[#1C293C] font-semibold">
										{course.giang_vien?.ten
											? `${course.giang_vien.ho} ${course.giang_vien.ten}`
											: "Instructor"}
									</h3>
									<p className="font-['Inter', sans-serif] text-sm text-[#6B7280] mb-2">
										{course.giang_vien?.gioi_thieu || "Giảng viên"}
									</p>
								</div>
							</div>
						</Card>

						{/* Ratings */}
						<Card className="mb-8">
							<h2 className="font-['Inter', sans-serif] text-xl text-[#1C293C] mb-4 flex items-center gap-2">
								<Star className="w-6 h-6 text-[#D97706]" />
								Đánh giá ({reviewStats.tong_danh_gia || 0})
							</h2>

							<div className="mb-6 p-4 bg-[#F8F6F3] rounded-[12px] border-2 border-[#1C293C]">
								<div className="flex items-center gap-6">
									<div className="text-center shrink-0">
										<p className="font-['Inter', sans-serif] text-4xl font-bold text-[#1C293C]">
											{reviewStats.trung_binh_xep_hang?.toFixed(1) || "0"}
										</p>
										<div className="flex gap-0.5 mt-1 justify-center">
											{[1, 2, 3, 4, 5].map((star) => (
												<Star
													key={star}
													className={`w-4 h-4 ${star <= Math.round(reviewStats.trung_binh_xep_hang || 0) ? "text-[#D97706] fill-[#D97706]" : "text-[#E5E1DC]"}`}
												/>
											))}
										</div>
										<p className="font-['Inter', sans-serif] text-xs text-[#6B7280] mt-1">
											{reviewStats.tong_danh_gia || 0} đánh giá
										</p>
									</div>
								</div>
							</div>

							{isCompleted && user && (
								<div className="p-4 bg-[#F8F6F3] rounded-[12px] border-2 border-[#1C293C] mb-6">
									<p className="font-['Inter', sans-serif] text-sm text-[#1C293C] mb-2">
										Chọn số sao:
									</p>
									<div className="flex gap-2 mb-4">
										{[1, 2, 3, 4, 5].map((star) => (
											<button
												key={star}
												type="button"
												onClick={() => setUserRating(star)}
												className="p-1 hover:scale-110 transition-transform"
											>
												<Star
													className={`w-8 h-8 ${star <= userRating ? "text-[#D97706] fill-[#D97706]" : "text-[#E5E1DC]"}`}
												/>
											</button>
										))}
									</div>
									<textarea
										value={ratingComment}
										onChange={(e) => setRatingComment(e.target.value)}
										placeholder="Viết đánh giá của bạn..."
										className="w-full p-3 border-2 border-[#1C293C] rounded-[8px] font-['Inter', sans-serif] text-[#1C293C] resize-none mb-3"
										rows={3}
									/>
									<Button
										variant="primary"
										onClick={handleSubmitRating}
										disabled={
											userRating === 0 ||
											!ratingComment.trim() ||
											submittingReview
										}
										className="w-full"
									>
										{submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
									</Button>
								</div>
							)}

							{!isCompleted && user && (
								<div className="p-4 bg-yellow-50 rounded-[12px] border-2 border-yellow-300 mb-6">
									<p className="font-['Inter', sans-serif] text-sm text-yellow-800">
										Bạn cần hoàn thành khóa học để đánh giá
									</p>
								</div>
							)}

							<div className="space-y-4">
								{reviews.length > 0 ? (
									reviews.map((rating: any) => (
										<div
											key={rating.id}
											className="border-b border-[#E5E1DC] pb-4 last:border-0"
										>
											<div className="flex items-start gap-3">
												<Avatar
													name={
														rating.nguoi_dung
															? `${rating.nguoi_dung.ho} ${rating.nguoi_dung.ten}`
															: "User"
													}
													size="md"
												/>
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-1">
														<span className="font-['Inter', sans-serif] font-semibold text-[#1C293C]">
															{rating.nguoi_dung
																? `${rating.nguoi_dung.ho} ${rating.nguoi_dung.ten}`
																: "User"}
														</span>
														<div className="flex gap-0.5">
															{[1, 2, 3, 4, 5].map((star) => (
																<Star
																	key={star}
																	className={`w-3 h-3 ${star <= rating.danh_gia ? "text-[#D97706] fill-[#D97706]" : "text-[#E5E1DC]"}`}
																/>
															))}
														</div>
														<span className="font-['Inter', sans-serif] text-xs text-[#6B7280]">
															{new Date(rating.ngay_tao).toLocaleDateString(
																"vi-VN",
															)}
														</span>
													</div>
													<p className="font-['Inter', sans-serif] text-sm text-[#1C293C] mb-2">
														{rating.binh_luan}
													</p>
													{rating.phan_hoi && (
														<div className="ml-4 mt-2 p-2 bg-gray-50 rounded-[8px] border-l-2 border-[#1C293C]">
															<p className="font-['Inter', sans-serif] text-xs font-semibold text-[#1C293C]">
																Phản hồi:
															</p>
															<p className="font-['Inter', sans-serif] text-sm text-[#1C293C]">
																{rating.phan_hoi}
															</p>
														</div>
													)}
												</div>
											</div>
										</div>
									))
								) : (
									<p className="font-['Inter', sans-serif] text-sm text-[#6B7280] text-center py-4">
										Chưa có đánh giá nào
									</p>
								)}
							</div>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CourseDetailPage;
