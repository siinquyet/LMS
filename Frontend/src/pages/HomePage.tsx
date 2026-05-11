import {
	ArrowRight,
	Award,
	BadgeCheck,
	Book,
	BookOpen,
	Clock,
	Code,
	FolderOpen,
	GraduationCap,
	Heart,
	MessageSquare,
	Palette,
	PlayCircle,
	Rocket,
	Sparkles,
	Star,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories, getCourses } from "../api";
import {
	Avatar,
	Badge,
	Button,
	Card,
	Input,
	Loader,
} from "../components/common";
import {
	homeBenefits,
	homeDemoCourses,
	homeReviews,
	homeStats,
} from "../mockData";

const benefitIcons = [Zap, Clock, BadgeCheck, PlayCircle];
const statIcons = [Users, BookOpen, Award, Star];
const categoryIcons = [Code, Palette, TrendingUp, Book];

export const HomePage: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [categories, setCategories] = useState<any[]>([]);
	const [courses, setCourses] = useState<any[]>([]);
	const [registerEmail, setRegisterEmail] = useState("");
	const [registerPassword, setRegisterPassword] = useState("");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [categoriesData, coursesData] = await Promise.all([
					getCategories(),
					getCourses({ limit: 6 }),
				]);
				setCategories(categoriesData.danh_muc || []);
				setCourses(coursesData.khoa_hoc || []);
			} catch (error) {
				console.error("Error fetching home data:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const handleRegister = (e: React.FormEvent) => {
		e.preventDefault();
	};

	return (
		<div className="min-h-screen bg-[#FBFBF9]">
			{/* Hero Section */}
			<section className="relative bg-[#1C293C] text-white py-16 md:py-24 overflow-hidden">
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-8 left-8 w-20 h-20 border-[3px] border-[#FDC800] animate-pulse" />
					<div
						className="absolute bottom-12 right-16 w-16 h-16 border-[3px] border-[#FDC800] animate-pulse"
						style={{ animationDelay: "0.5s" }}
					/>
					<div
						className="absolute top-1/3 right-1/4 w-12 h-12 border-[3px] border-[#FDC800] animate-pulse"
						style={{ animationDelay: "1s" }}
					/>
				</div>

				<div className="max-w-7xl mx-auto px-4 relative z-10">
					<div className="text-center mb-10">
						<div className="inline-flex items-center gap-2 bg-[#FDC800] px-4 py-2 mb-6 border-[3px] border-[#1C293C]">
							<Sparkles className="w-4 h-4 text-[#1C293C]" />
							<span className="text-[13px] font-semibold text-[#1C293C]">
								Nền tảng giáo dục trực tuyến uy tín
							</span>
						</div>
						<h1 className="text-[35px] md:text-[48px] lg:text-[56px] font-bold mb-4 leading-tight">
							Nền tảng học tập trực tuyến hàng đầu
						</h1>
						<p className="text-[17px] md:text-[21px] text-white/80 max-w-2xl mx-auto mb-8">
							Trao cơ hội tiếp cận kiến thức chất lượng cao cho mọi người, mọi
							nơi
						</p>
					</div>

					<div className="flex flex-wrap justify-center gap-3 mb-10">
						{homeBenefits.map((benefit, index) => {
							const Icon = benefitIcons[index];
							return (
								<div
									key={index}
									className="flex items-center gap-2 bg-[#FDC800] px-4 py-2 border-[3px] border-[#1C293C]"
								>
									<Icon className="w-4 h-4 text-[#1C293C]" />
									<span className="text-[13px] font-semibold text-[#1C293C]">
										{benefit.title}
									</span>
								</div>
							);
						})}
					</div>

					<div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
						<Link to="/register">
							<Button variant="primary" size="lg" className="w-full sm:w-auto">
								<Zap className="w-5 h-5" />
								Đăng ký miễn phí
							</Button>
						</Link>
						<Link to="/store">
							<Button variant="outline" size="lg" className="w-full sm:w-auto">
								<PlayCircle className="w-5 h-5" />
								Xem khóa học
							</Button>
						</Link>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
						{homeStats.map((stat, index) => {
							const Icon = statIcons[index];
							return (
								<div key={index} className="text-center">
									<div className="w-12 h-12 mx-auto mb-2 bg-[#FDC800] border-[3px] border-[#1C293C] flex items-center justify-center">
										<Icon className="w-6 h-6 text-[#1C293C]" />
									</div>
									<div className="text-[27px] md:text-[32px] font-bold text-[#FDC800]">
										{stat.value}
									</div>
									<div className="text-[13px] md:text-[15px] text-white/70">
										{stat.label}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Free Trial Banner */}
			<section className="py-8 max-w-7xl mx-auto px-4 -mt-4 relative z-20">
				<Card className="bg-[#FDC800] border-[3px] border-[#1C293C] shadow-[6px_6px_0_#1C293C]">
					<div className="flex flex-col md:flex-row items-center justify-between gap-4">
						<div className="flex items-center gap-4">
							<div className="w-14 h-14 bg-[#1C293C] border-[3px] border-[#1C293C] flex items-center justify-center">
								<Sparkles className="w-7 h-7 text-[#FDC800]" />
							</div>
							<div>
								<h3 className="text-[21px] font-bold text-[#1C293C]">
									Free Trial 7 ngày
								</h3>
								<p className="text-[15px] text-[#1C293C]">
									Truy cập không giới hạn tất cả khóa học
								</p>
							</div>
						</div>
						<Link to="/register">
							<Button variant="secondary" size="md">
								Dùng thử ngay <ArrowRight className="w-4 h-4" />
							</Button>
						</Link>
					</div>
				</Card>
			</section>

			{/* Demo Courses Section */}
			<section className="py-12 bg-white border-t-[3px] border-[#1C293C]">
				<div className="max-w-7xl mx-auto px-4">
					<div className="flex items-center justify-between mb-8">
						<div>
							<h2 className="text-[27px] font-bold text-[#1C293C] flex items-center gap-2">
								<GraduationCap className="w-8 h-8 text-[#FDC800]" />
								Khóa học nổi bật
							</h2>
							<p className="text-[15px] text-[#6B7280] mt-1">
								Những khóa học được yêu thích nhất
							</p>
						</div>
						<Link
							to="/store"
							className="text-[15px] font-semibold text-[#432DD7] flex items-center gap-2 hover:gap-3 transition-all"
						>
							Xem tất cả <ArrowRight className="w-4 h-4" />
						</Link>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{(courses.length > 0 ? courses : homeDemoCourses).map(
							(course: any) => (
								<Link key={course.id} to={`/course/${course.id}`}>
									<Card hoverable className="overflow-hidden p-0">
										<div className="relative">
											<img
												src={
													course.thumbnail ||
													course.thumbnailUrl ||
													"https://picsum.photos/seed/course/400/300"
												}
												alt={course.tieu_de || course.title}
												className="w-full h-40 object-cover"
											/>
										</div>
										<div className="p-4">
											<h3 className="text-[17px] font-bold text-[#1C293C] mb-2 line-clamp-2">
												{course.tieu_de || course.title}
											</h3>
											<div className="flex items-center gap-2 mb-3">
												<Avatar
													name={course.giang_vien?.ten || course.instructor}
													size="sm"
												/>
												<span className="text-[13px] text-[#6B7280]">
													{course.giang_vien
														? `${course.giang_vien.ho} ${course.giang_vien.ten}`
														: course.instructor}
												</span>
											</div>
											<div className="flex items-center justify-between mb-3">
												<div className="flex items-center gap-1">
													<Star className="w-4 h-4 text-[#D97706] fill-[#D97706]" />
													<span className="text-[15px] font-bold text-[#1C293C]">
														{course.xep_hang || course.rating || 0}
													</span>
													<span className="text-[13px] text-[#6B7280]">
														(
														{course.so_luong_da_dang_ky || course.students || 0}
														)
													</span>
												</div>
												<span className="text-[15px] font-bold bg-[#FDC800] border-[3px] border-[#1C293C] px-2 py-1">
													{Number(
														course.gia || course.price || 0,
													).toLocaleString()}
													đ
												</span>
											</div>
											<Button variant="primary" className="w-full">
												Xem chi tiết
											</Button>
										</div>
									</Card>
								</Link>
							),
						)}
					</div>
				</div>
			</section>

			{/* Categories */}
			<section className="py-12 max-w-7xl mx-auto px-4">
				<h2 className="text-[27px] font-bold text-[#1C293C] text-center mb-8 flex items-center justify-center gap-2">
					<FolderOpen className="w-8 h-8 text-[#FDC800]" />
					Danh mục khóa học
				</h2>
				{loading ? (
					<div className="flex justify-center py-8">
						<Loader />
					</div>
				) : (
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{(categories.length > 0 ? categories : []).map(
							(cat: any, index: number) => {
								const Icon = categoryIcons[index % categoryIcons.length];
								return (
									<Link key={cat.id} to={`/store?category=${cat.id}`}>
										<Card hoverable className="text-center py-6">
											<div className="w-14 h-14 mx-auto mb-3 bg-[#FDC800] border-[3px] border-[#1C293C] flex items-center justify-center">
												<Icon className="w-7 h-7 text-[#1C293C]" />
											</div>
											<h3 className="text-[17px] font-bold text-[#1C293C] mb-1">
												{cat.ten || cat.name}
											</h3>
											<span className="text-[13px] text-[#6B7280]">
												Xem khóa học
											</span>
										</Card>
									</Link>
								);
							},
						)}
					</div>
				)}
			</section>

			{/* Reviews Section */}
			<section className="py-12 bg-white border-t-[3px] border-[#1C293C]">
				<div className="max-w-7xl mx-auto px-4">
					<div className="text-center mb-10">
						<h2 className="text-[27px] font-bold text-[#1C293C] mb-2 flex items-center justify-center gap-2">
							<MessageSquare className="w-8 h-8 text-[#FDC800]" />
							Đánh giá từ học viên
						</h2>
						<p className="text-[15px] text-[#6B7280]">
							Hơn 10,000+ học viên đã tin tưởng và lựa chọn
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{homeReviews.map((review) => (
							<Card key={review.id} hoverable className="relative">
								<div className="absolute -top-3 left-4">
									<div className="bg-[#FDC800] border-[3px] border-[#1C293C] px-3 py-1 flex items-center gap-1">
										<Star className="w-3 h-3 text-[#1C293C] fill-[#1C293C]" />
										<span className="text-[13px] font-bold text-[#1C293C]">
											{review.rating}.0
										</span>
									</div>
								</div>
								<div className="pt-4">
									<div className="flex items-start gap-3 mb-3">
										<Avatar name={review.avatar} size="md" />
										<div>
											<h4 className="text-[15px] font-bold text-[#1C293C]">
												{review.name}
											</h4>
											<span className="text-[13px] text-[#6B7280]">
												{review.course}
											</span>
										</div>
									</div>
									<p className="text-[15px] text-[#6B7280] leading-relaxed">
										"{review.comment}"
									</p>
								</div>
								<div className="mt-4 pt-3 border-t-[3px] border-dashed border-[#1C293C] flex items-center gap-2">
									<MessageSquare className="w-4 h-4 text-[#6B7280]" />
									<span className="text-[13px] text-[#6B7280]">
										Review thực tế
									</span>
								</div>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* CTA & Registration Section */}
			<section className="py-16 max-w-7xl mx-auto px-4">
				<div className="bg-[#1C293C] text-white overflow-hidden relative border-[3px] border-[#1C293C] shadow-[8px_8px_0_#1C293C]">
					<div className="absolute inset-0 opacity-10">
						<div className="absolute top-4 left-4 w-16 h-16 border-[3px] border-[#FDC800]" />
						<div className="absolute bottom-4 right-4 w-20 h-20 border-[3px] border-[#FDC800]" />
					</div>

					<div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 p-8">
						<div className="flex-1 text-center lg:text-left">
							<h2 className="text-[27px] mb-4 flex items-center justify-center lg:justify-start gap-2">
								<Rocket className="w-8 h-8 text-[#FDC800]" />
								Bắt đầu hành trình học tập
							</h2>
							<p className="text-[15px] text-white/80 mb-6 max-w-lg">
								Tham gia cộng đồng hơn 10,000 học viên. Đăng ký ngay hôm nay để
								nhận{" "}
								<span className="text-[#FDC800] font-bold">
									7 ngày dùng thử miễn phí
								</span>{" "}
								và khám phá kho tài liệu học tập chất lượng cao.
							</p>
							<div className="flex flex-wrap justify-center lg:justify-start gap-4">
								<div className="flex items-center gap-2">
									<Heart className="w-5 h-5 text-[#DC2626]" />
									<span className="text-[15px] text-white/80">
										Không cần thẻ tín dụng
									</span>
								</div>
								<div className="flex items-center gap-2">
									<BadgeCheck className="w-5 h-5 text-[#16A34A]" />
									<span className="text-[15px] text-white/80">
										Chứng nhận hoàn thành
									</span>
								</div>
							</div>
						</div>

						<div className="w-full max-w-md">
							<div className="bg-white border-[3px] border-[#1C293C] shadow-[6px_6px_0_#1C293C] p-6">
								<h3 className="text-[21px] font-bold text-[#1C293C] text-center mb-1">
									Đăng ký nhanh
								</h3>
								<p className="text-[13px] text-[#6B7280] text-center mb-6">
									Chỉ cần email để bắt đầu
								</p>
								<form onSubmit={handleRegister} className="space-y-4">
									<Input
										type="email"
										placeholder="Email của bạn"
										value={registerEmail}
										onChange={(v) => setRegisterEmail(v)}
									/>
									<Input
										type="password"
										placeholder="Mật khẩu"
										value={registerPassword}
										onChange={(v) => setRegisterPassword(v)}
									/>
									<Button
										type="submit"
										variant="primary"
										size="lg"
										className="w-full"
									>
										<Zap className="w-5 h-5" />
										Đăng ký miễn phí
									</Button>
									<p className="text-[13px] text-[#6B7280] text-center">
										Đã có tài khoản?{" "}
										<Link
											to="/login"
											className="text-[#432DD7] font-semibold hover:underline"
										>
											Đăng nhập
										</Link>
									</p>
								</form>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Final CTA */}
			<section className="py-12 max-w-3xl mx-auto px-4 text-center">
				<h3 className="text-[21px] font-bold text-[#1C293C] mb-4">
					Còn chờ gì nữa?
				</h3>
				<p className="text-[15px] text-[#6B7280] mb-6">
					Bắt đầu hành trình học tập của bạn ngay hôm nay
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Link to="/register">
						<Button variant="primary" size="lg">
							Đăng ký ngay <ArrowRight className="w-5 h-5" />
						</Button>
					</Link>
					<Link to="/store">
						<Button variant="outline" size="lg">
							Khám phá khóa học
						</Button>
					</Link>
				</div>
			</section>
		</div>
	);
};

export default HomePage;
