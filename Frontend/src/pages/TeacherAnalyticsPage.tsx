import {
	BarChart3,
	Clock,
	CreditCard,
	DollarSign,
	TrendingUp,
	Users,
	Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
	createPayoutRequest,
	getInstructorAnalytics,
	getTeacherEarnings,
	getTeacherEarningsHistory,
	getTeacherPayoutRequests,
} from "../api";
import { Badge, Button, Card, Loader } from "../components/common";
import { useAuth } from "../contexts/AuthContext";

const formatPrice = (value: number) =>
	new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		maximumFractionDigits: 0,
	}).format(value);

export const TeacherAnalyticsPage = () => {
	const { user } = useAuth();
	const [analytics, setAnalytics] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [earnings, setEarnings] = useState<any>(null);
	const [earningsHistory, setEarningsHistory] = useState<any[]>([]);
	const [payoutRequests, setPayoutRequests] = useState<any[]>([]);
	const [showPayoutModal, setShowPayoutModal] = useState(false);
	const [payoutAmount, setPayoutAmount] = useState("");
	const [bankName, setBankName] = useState("");
	const [bankAccount, setBankAccount] = useState("");
	const [activeTab, setActiveTab] = useState<
		"overview" | "earnings" | "payouts"
	>("overview");

	useEffect(() => {
		const fetchData = async () => {
			if (!user?.id) return;
			setLoading(true);
			try {
				const [analyticsData, earningsData, historyData, payoutsData] =
					await Promise.all([
						getInstructorAnalytics(user.id),
						getTeacherEarnings().catch(() => null),
						getTeacherEarningsHistory().catch(() => ({ lich_su_thu_nhap: [] })),
						getTeacherPayoutRequests().catch(() => ({ lich_su_rut_tien: [] })),
					]);
				setAnalytics(analyticsData);
				setEarnings(earningsData);
				setEarningsHistory(historyData.lich_su_thu_nhap || []);
				setPayoutRequests(payoutsData.lich_su_rut_tien || []);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [user?.id]);

	const handlePayout = async () => {
		if (!payoutAmount || !bankName || !bankAccount) {
			alert("Vui lòng nhập đầy đủ thông tin");
			return;
		}
		try {
			await createPayoutRequest(Number(payoutAmount), bankName, bankAccount);
			alert("Yêu cầu rút tiền thành công!");
			setShowPayoutModal(false);
			setPayoutAmount("");
			setBankName("");
			setBankAccount("");
			const [historyData, payoutsData] = await Promise.all([
				getTeacherEarningsHistory().catch(() => ({ lich_su_thu_nhap: [] })),
				getTeacherPayoutRequests().catch(() => ({ lich_su_rut_tien: [] })),
			]);
			setEarningsHistory(historyData.lich_su_thu_nhap || []);
			setPayoutRequests(payoutsData.lich_su_rut_tien || []);
		} catch (error) {
			console.error("Payout error:", error);
			alert("Không thể tạo yêu cầu rút tiền");
		}
	};

	if (loading) return <Loader />;

	return (
		<div className="min-h-screen bg-[#F8F6F3]">
			<div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
				<div>
					<h1 className="font-['Inter', sans-serif] text-3xl text-[#1C293C]">
						Thống kê
					</h1>
					<p className="text-gray-600 mt-2">
						Theo dõi doanh thu và hiệu suất khóa học
					</p>
				</div>

				<div className="flex gap-2">
					<Button
						variant={activeTab === "overview" ? "primary" : "outline"}
						onClick={() => setActiveTab("overview")}
					>
						Tổng quan
					</Button>
					<Button
						variant={activeTab === "earnings" ? "primary" : "outline"}
						onClick={() => setActiveTab("earnings")}
					>
						Thu nhập
					</Button>
					<Button
						variant={activeTab === "payouts" ? "primary" : "outline"}
						onClick={() => setActiveTab("payouts")}
					>
						Rút tiền
					</Button>
				</div>

				{activeTab === "overview" && (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<Card className="p-6">
								<div className="flex items-center gap-3 mb-2">
									<div className="p-2 bg-green-100 rounded-lg">
										<DollarSign className="w-5 h-5 text-green-600" />
									</div>
									<span className="font-['Inter', sans-serif] text-gray-500 text-sm">
										Tổng doanh thu
									</span>
								</div>
								<p className="font-['Inter', sans-serif] text-3xl text-[#1C293C]">
									{formatPrice(analytics?.tong_doanh_thu || 0)}
								</p>
							</Card>

							<Card className="p-6">
								<div className="flex items-center gap-3 mb-2">
									<div className="p-2 bg-blue-100 rounded-lg">
										<Users className="w-5 h-5 text-blue-600" />
									</div>
									<span className="font-['Inter', sans-serif] text-gray-500 text-sm">
										Tổng học viên
									</span>
								</div>
								<p className="font-['Inter', sans-serif] text-3xl text-[#1C293C]">
									{analytics?.tong_hoc_vien || 0}
								</p>
							</Card>

							<Card className="p-6">
								<div className="flex items-center gap-3 mb-2">
									<div className="p-2 bg-purple-100 rounded-lg">
										<BarChart3 className="w-5 h-5 text-purple-600" />
									</div>
									<span className="font-['Inter', sans-serif] text-gray-500 text-sm">
										Số khóa học
									</span>
								</div>
								<p className="font-['Inter', sans-serif] text-3xl text-[#1C293C]">
									{analytics?.so_khoa_hoc || 0}
								</p>
							</Card>

							<Card className="p-6">
								<div className="flex items-center gap-3 mb-2">
									<div className="p-2 bg-yellow-100 rounded-lg">
										<TrendingUp className="w-5 h-5 text-yellow-600" />
									</div>
									<span className="font-['Inter', sans-serif] text-gray-500 text-sm">
										Đăng ký gần đây
									</span>
								</div>
								<p className="font-['Inter', sans-serif] text-3xl text-[#1C293C]">
									{(analytics?.dang_ky_gan_day || []).length}
								</p>
							</Card>
						</div>

						<Card className="p-6">
							<h2 className="font-['Inter', sans-serif] text-xl text-[#1C293C] mb-4">
								Doanh thu theo khóa học
							</h2>
							<div className="space-y-4">
								{(analytics?.khoa_hoc || []).map((course: any) => (
									<div
										key={course.id}
										className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
									>
										<div>
											<p className="font-['Inter', sans-serif] text-[#1C293C]">
												{course.tieu_de}
											</p>
											<p className="text-sm text-gray-500">
												{course.so_luong_da_dang_ky} học viên
											</p>
										</div>
										<div className="text-right">
											<p className="font-['Inter', sans-serif] text-[#1C293C]">
												{formatPrice(course.doanh_thu)}
											</p>
											<p className="text-sm text-gray-500">
												{formatPrice(course.gia)}/học viên
											</p>
										</div>
									</div>
								))}
							</div>
						</Card>
					</>
				)}

				{activeTab === "earnings" && (
					<>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<Card className="p-6">
								<div className="flex items-center gap-3 mb-2">
									<div className="p-2 bg-green-100 rounded-lg">
										<DollarSign className="w-5 h-5 text-green-600" />
									</div>
									<span className="font-['Inter', sans-serif] text-gray-500 text-sm">
										Tổng thu nhập
									</span>
								</div>
								<p className="font-['Inter', sans-serif] text-3xl text-[#1C293C]">
									{formatPrice(earnings?.tong_thu_nhap || 0)}
								</p>
							</Card>

							<Card className="p-6">
								<div className="flex items-center gap-3 mb-2">
									<div className="p-2 bg-blue-100 rounded-lg">
										<Wallet className="w-5 h-5 text-blue-600" />
									</div>
									<span className="font-['Inter', sans-serif] text-gray-500 text-sm">
										Số dư khả dụng
									</span>
								</div>
								<p className="font-['Inter', sans-serif] text-3xl text-[#1C293C]">
									{formatPrice(earnings?.so_du_kha_dung || 0)}
								</p>
							</Card>

							<Card className="p-6">
								<div className="flex items-center gap-3 mb-2">
									<div className="p-2 bg-yellow-100 rounded-lg">
										<Clock className="w-5 h-5 text-yellow-600" />
									</div>
									<span className="font-['Inter', sans-serif] text-gray-500 text-sm">
										Chờ xử lý
									</span>
								</div>
								<p className="font-['Inter', sans-serif] text-3xl text-[#1C293C]">
									{formatPrice(earnings?.so_du_cho_xu_ly || 0)}
								</p>
							</Card>
						</div>

						<Card className="p-6">
							<div className="flex justify-between items-center mb-4">
								<h2 className="font-['Inter', sans-serif] text-xl text-[#1C293C]">
									Lịch sử thu nhập
								</h2>
								<Button onClick={() => setShowPayoutModal(true)}>
									<CreditCard className="w-4 h-4 mr-2" />
									Rút tiền
								</Button>
							</div>
							<div className="space-y-4">
								{earningsHistory.length === 0 ? (
									<p className="text-center text-gray-500 py-4">
										Chưa có thu nhập nào
									</p>
								) : (
									earningsHistory.map((e: any) => (
										<div
											key={e.id}
											className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
										>
											<div>
												<p className="font-['Inter', sans-serif] text-[#1C293C]">
													{e.khoa_hoc}
												</p>
												<p className="text-sm text-gray-500">
													Đơn hàng #{e.don_hang_id} -{" "}
													{new Date(e.ngay_dat).toLocaleDateString("vi-VN")}
												</p>
											</div>
											<div className="text-right">
												<p className="font-['Inter', sans-serif] text-[#1C293C]">
													{formatPrice(e.so_tien_thuc_nhan)}
												</p>
												<Badge
													variant={
														e.trang_thai === "available"
															? "success"
															: e.trang_thai === "pending"
																? "warning"
																: "default"
													}
												>
													{e.trang_thai === "available"
														? "Khả dụng"
														: e.trang_thai === "pending"
															? "Chờ xử lý"
															: e.trang_thai}
												</Badge>
											</div>
										</div>
									))
								)}
							</div>
						</Card>
					</>
				)}

				{activeTab === "payouts" && (
					<Card className="p-6">
						<h2 className="font-['Inter', sans-serif] text-xl text-[#1C293C] mb-4">
							Lịch sử rút tiền
						</h2>
						<div className="space-y-4">
							{payoutRequests.length === 0 ? (
								<p className="text-center text-gray-500 py-4">
									Chưa có yêu cầu rút tiền nào
								</p>
							) : (
								payoutRequests.map((p: any) => (
									<div
										key={p.id}
										className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
									>
										<div>
											<p className="font-['Inter', sans-serif] text-[#1C293C]">
												{formatPrice(p.so_tien)}
											</p>
											<p className="text-sm text-gray-500">
												{p.ten_ngan_hang} - {p.so_tai_khoan}
											</p>
											<p className="text-sm text-gray-500">
												{new Date(p.ngay_tao).toLocaleDateString("vi-VN")}
											</p>
										</div>
										<Badge
											variant={
												p.trang_thai === "pending"
													? "warning"
													: p.trang_thai === "paid"
														? "success"
														: p.trang_thai === "rejected"
															? "danger"
															: "default"
											}
										>
											{p.trang_thai === "pending"
												? "Chờ duyệt"
												: p.trang_thai === "paid"
													? "Đã thanh toán"
													: p.trang_thai === "rejected"
														? "Từ chối"
														: p.trang_thai}
										</Badge>
									</div>
								))
							)}
						</div>
					</Card>
				)}

				{showPayoutModal && (
					<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
						<Card className="p-6 w-full max-w-md">
							<h3 className="font-['Inter', sans-serif] text-xl text-[#1C293C] mb-4">
								Yêu cầu rút tiền
							</h3>
							<div className="space-y-4">
								<div>
									<label className="block text-sm text-gray-600 mb-1">
										Số tiền (VND)
									</label>
									<input
										type="number"
										value={payoutAmount}
										onChange={(e) => setPayoutAmount(e.target.value)}
										className="w-full p-2 border-2 border-[#1C293C] rounded-lg"
										placeholder="Nhập số tiền"
									/>
									<p className="text-sm text-gray-500 mt-1">
										Số dư khả dụng: {formatPrice(earnings?.so_du_kha_dung || 0)}
									</p>
								</div>
								<div>
									<label className="block text-sm text-gray-600 mb-1">
										Ngân hàng
									</label>
									<input
										type="text"
										value={bankName}
										onChange={(e) => setBankName(e.target.value)}
										className="w-full p-2 border-2 border-[#1C293C] rounded-lg"
										placeholder="Ví dụ: Vietcombank"
									/>
								</div>
								<div>
									<label className="block text-sm text-gray-600 mb-1">
										Số tài khoản
									</label>
									<input
										type="text"
										value={bankAccount}
										onChange={(e) => setBankAccount(e.target.value)}
										className="w-full p-2 border-2 border-[#1C293C] rounded-lg"
										placeholder="Nhập số tài khoản"
									/>
								</div>
							</div>
							<div className="flex gap-2 mt-6">
								<Button onClick={handlePayout} className="flex-1">
									Gửi yêu cầu
								</Button>
								<Button
									variant="outline"
									onClick={() => setShowPayoutModal(false)}
								>
									Hủy
								</Button>
							</div>
						</Card>
					</div>
				)}
			</div>
		</div>
	);
};

export default TeacherAnalyticsPage;
