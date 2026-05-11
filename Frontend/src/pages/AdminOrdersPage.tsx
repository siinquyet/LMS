import { Check, DollarSign, RotateCcw, TrendingUp, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
	approvePayoutRequest,
	getAdminPayoutRequests,
	getOrders,
	refundOrder,
	rejectPayoutRequest,
} from "../api";
import { Badge, Button, Card, Loader } from "../components/common";

const formatPrice = (price: number) => {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		maximumFractionDigits: 0,
	}).format(price);
};

const formatDate = (dateStr: string) => {
	const date = new Date(dateStr);
	return date.toLocaleDateString("vi-VN");
};

export const AdminOrdersPage: React.FC = () => {
	const [orders, setOrders] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [payoutRequests, setPayoutRequests] = useState<any[]>([]);
	const [activeTab, setActiveTab] = useState<"orders" | "payouts">("orders");

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const [ordersData, payoutsData] = await Promise.all([
					getOrders().catch(() => ({ orders: [] })),
					getAdminPayoutRequests().catch(() => ({ yeu_cau_rut_tien: [] })),
				]);
				setOrders(ordersData.orders || []);
				setPayoutRequests(payoutsData.yeu_cau_rut_tien || []);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const handleRefund = async (id: number) => {
		if (!confirm("Bạn có chắc muốn hoàn tiền đơn hàng này?")) return;
		try {
			await refundOrder(id);
			const { orders: data } = await getOrders();
			setOrders(data || []);
		} catch (error) {
			console.error("Refund error:", error);
		}
	};

	const handleApprovePayout = async (id: number) => {
		if (!confirm("Duyệt yêu cầu rút tiền này?")) return;
		try {
			await approvePayoutRequest(id);
			const { yeu_cau_rut_tien: data } = await getAdminPayoutRequests();
			setPayoutRequests(data || []);
		} catch (error) {
			console.error("Approve error:", error);
		}
	};

	const handleRejectPayout = async (id: number) => {
		if (!confirm("Từ chối yêu cầu rút tiền này?")) return;
		try {
			await rejectPayoutRequest(id);
			const { yeu_cau_rut_tien: data } = await getAdminPayoutRequests();
			setPayoutRequests(data || []);
		} catch (error) {
			console.error("Reject error:", error);
		}
	};

	const filteredOrders = orders.filter((o: any) => {
		const matchesSearch =
			o.user?.ten?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			o.items?.[0]?.khoa_hoc?.tieu_de
				?.toLowerCase()
				.includes(searchQuery.toLowerCase());
		return matchesSearch;
	});

	const totalRevenue = filteredOrders
		.filter((o: any) => o.trang_thai === "success")
		.reduce((sum, o) => sum + o.tong_tien, 0);

	if (loading) return <Loader />;

	return (
		<div className="max-w-7xl mx-auto w-full">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="font-['Inter', sans-serif] text-3xl text-[#1C293C]">
						Quản lý đơn hàng & Payout
					</h1>
					<p className="font-['Inter', sans-serif] text-gray-500 mt-1">
						Theo dõi đơn hàng và yêu cầu rút tiền
					</p>
				</div>
				<div className="text-right">
					<p className="font-['Inter', sans-serif] text-sm text-gray-500">
						Tổng doanh thu
					</p>
					<p className="font-['Inter', sans-serif] text-2xl text-[#1C293C]">
						{formatPrice(totalRevenue)}
					</p>
				</div>
			</div>

			<div className="flex gap-2 mb-6">
				<Button
					variant={activeTab === "orders" ? "primary" : "outline"}
					onClick={() => setActiveTab("orders")}
				>
					<TrendingUp className="w-4 h-4 mr-2" />
					Đơn hàng
				</Button>
				<Button
					variant={activeTab === "payouts" ? "primary" : "outline"}
					onClick={() => setActiveTab("payouts")}
				>
					<DollarSign className="w-4 h-4 mr-2" />
					Yêu cầu rút tiền
				</Button>
			</div>

			{activeTab === "orders" && (
				<>
					<div className="flex gap-4 mb-4">
						<div className="relative flex-1 max-w-md">
							<input
								type="text"
								placeholder="Tìm kiếm đơn hàng..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg font-['Inter', sans-serif] text-sm focus:outline-none focus:border-[#49B6E5]"
							/>
						</div>
						<input
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							className="px-4 py-2 border border-gray-300 rounded-lg font-['Inter', sans-serif] text-sm"
						/>
						<span className="flex items-center text-gray-400">-</span>
						<input
							type="date"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							className="px-4 py-2 border border-gray-300 rounded-lg font-['Inter', sans-serif] text-sm"
						/>
					</div>

					<Card className="p-6">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-gray-200">
										<th className="text-left py-3 px-4 font-['Inter', sans-serif] text-gray-500 text-sm">
											Mã đơn
										</th>
										<th className="text-left py-3 px-4 font-['Inter', sans-serif] text-gray-500 text-sm">
											Khách hàng
										</th>
										<th className="text-left py-3 px-4 font-['Inter', sans-serif] text-gray-500 text-sm">
											Khóa học
										</th>
										<th className="text-left py-3 px-4 font-['Inter', sans-serif] text-gray-500 text-sm">
											Số tiền
										</th>
										<th className="text-left py-3 px-4 font-['Inter', sans-serif] text-gray-500 text-sm">
											Trạng thái
										</th>
										<th className="text-left py-3 px-4 font-['Inter', sans-serif] text-gray-500 text-sm">
											Ngày
										</th>
										<th className="text-left py-3 px-4 font-['Inter', sans-serif] text-gray-500 text-sm">
											Thao tác
										</th>
									</tr>
								</thead>
								<tbody>
									{filteredOrders.map((order: any) => (
										<tr
											key={order.id}
											className="border-b border-gray-100 hover:bg-gray-50"
										>
											<td className="py-3 px-4 font-['Inter', sans-serif] text-[#1C293C] text-sm">
												#{order.id}
											</td>
											<td className="py-3 px-4 font-['Inter', sans-serif] text-gray-600 text-sm">
												{order.user?.ho} {order.user?.ten}
											</td>
											<td className="py-3 px-4 font-['Inter', sans-serif] text-gray-600 text-sm">
												{order.items?.[0]?.khoa_hoc?.tieu_de}
											</td>
											<td className="py-3 px-4 font-['Inter', sans-serif] text-gray-600 text-sm">
												{formatPrice(order.tong_tien)}
											</td>
											<td className="py-3 px-4">
												<Badge
													variant={
														order.trang_thai === "success"
															? "success"
															: order.trang_thai === "refunded"
																? "warning"
																: "default"
													}
												>
													{order.trang_thai === "success"
														? "Thành công"
														: order.trang_thai === "refunded"
															? "Đã hoàn"
															: "Chờ"}
												</Badge>
											</td>
											<td className="py-3 px-4 font-['Inter', sans-serif] text-gray-600 text-sm">
												{formatDate(order.ngay_dat)}
											</td>
											<td className="py-3 px-4">
												{order.trang_thai === "success" && (
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleRefund(order.id)}
													>
														<RotateCcw className="w-4 h-4 mr-1" />
														Hoàn tiền
													</Button>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</Card>
				</>
			)}

			{activeTab === "payouts" && (
				<Card className="p-6">
					<h2 className="font-['Inter', sans-serif] text-xl text-[#1C293C] mb-4">
						Yêu cầu rút tiền
					</h2>
					{payoutRequests.length === 0 ? (
						<p className="text-center text-gray-500 py-8">
							Chưa có yêu cầu rút tiền nào
						</p>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-gray-200">
										<th className="text-left py-3 px-4 font-['Inter', sans-serif] text-gray-500 text-sm">
											ID
										</th>
										<th className="text-left py-3 px-4 font-['Inter', sans-serif] text-gray-500 text-sm">
											Giảng viên
										</th>
										<th className="text-left py-3 px-4 font-['Inter', sans-serif] text-gray-500 text-sm">
											Số tiền
										</th>
										<th className="text-left py-3 px-4 font-['Inter', sans-serif] text-gray-500 text-sm">
											Ngân hàng
										</th>
										<th className="text-left py-3 px-4 font-['Inter', sans-serif] text-gray-500 text-sm">
											Ngày
										</th>
										<th className="text-left py-3 px-4 font-['Inter', sans-serif] text-gray-500 text-sm">
											Trạng thái
										</th>
										<th className="text-left py-3 px-4 font-['Inter', sans-serif] text-gray-500 text-sm">
											Thao tác
										</th>
									</tr>
								</thead>
								<tbody>
									{payoutRequests.map((p: any) => (
										<tr
											key={p.id}
											className="border-b border-gray-100 hover:bg-gray-50"
										>
											<td className="py-3 px-4 font-['Inter', sans-serif] text-[#1C293C] text-sm">
												#{p.id}
											</td>
											<td className="py-3 px-4">
												<div>
													<p className="font-['Inter', sans-serif] text-[#1C293C] text-sm">
														{p.giang_vien?.ho} {p.giang_vien?.ten}
													</p>
													<p className="text-xs text-gray-500">
														{p.giang_vien?.email}
													</p>
												</div>
											</td>
											<td className="py-3 px-4 font-['Inter', sans-serif] text-[#1C293C] text-sm">
												{formatPrice(p.so_tien)}
											</td>
											<td className="py-3 px-4 font-['Inter', sans-serif] text-gray-600 text-sm">
												<div>
													<p>{p.ten_ngan_hang}</p>
													<p className="text-xs text-gray-500">
														{p.so_tai_khoan}
													</p>
												</div>
											</td>
											<td className="py-3 px-4 font-['Inter', sans-serif] text-gray-600 text-sm">
												{formatDate(p.ngay_tao)}
											</td>
											<td className="py-3 px-4">
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
											</td>
											<td className="py-3 px-4">
												{p.trang_thai === "pending" && (
													<div className="flex gap-2">
														<Button
															size="sm"
															onClick={() => handleApprovePayout(p.id)}
														>
															<Check className="w-4 h-4" />
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleRejectPayout(p.id)}
														>
															<X className="w-4 h-4" />
														</Button>
													</div>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</Card>
			)}
		</div>
	);
};

export default AdminOrdersPage;
