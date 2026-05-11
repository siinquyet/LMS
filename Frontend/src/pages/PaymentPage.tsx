import {
	ArrowLeft,
	Building2,
	CheckCircle,
	CreditCard,
	Loader,
	Smartphone,
	XCircle,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as api from "../api";
import { Button, Card, Loader as LoaderComp } from "../components/common";
import { useAuth } from "../contexts/AuthContext";

interface Order {
	id: number;
	tong_tien: number;
	trang_thai: string;
	createdAt: string;
	items: {
		id: number;
		khoa_hoc: {
			id: number;
			tieu_de: string;
			thumbnail?: string;
		};
	}[];
}

type PaymentStatus = "idle" | "processing" | "success" | "failed";

const paymentMethods = [
	{ id: "visa", label: "Visa / Mastercard", icon: CreditCard },
	{ id: "momo", label: "MoMo", icon: Smartphone },
	{ id: "bank", label: "Chuyển khoản ngân hàng", icon: Building2 },
];

export const PaymentPage: React.FC = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [order, setOrder] = useState<Order | null>(null);
	const [selectedMethod, setSelectedMethod] = useState("visa");
	const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
	const [countdown, setCountdown] = useState(3);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchOrder();
	}, []);

	const fetchOrder = async () => {
		try {
			const { orders } = await api.getOrders();
			// Get the most recent pending order
			const pendingOrder = orders?.find(
				(o: Order) => o.trang_thai === "pending",
			);
			if (pendingOrder) {
				setOrder(pendingOrder);
			} else {
				// No pending order, redirect to cart
				navigate("/cart");
			}
		} catch (err) {
			console.error("Failed to fetch order:", err);
			navigate("/cart");
		} finally {
			setLoading(false);
		}
	};

	const handlePayment = async () => {
		if (!order) return;

		setPaymentStatus("processing");
		setCountdown(3);

		const interval = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(interval);

					// Simulate payment (90% success)
					(async () => {
						try {
							const result = await api.payOrder(order.id, selectedMethod);

							// Simulate 90% success
							const success = Math.random() < 0.9;

							if (success) {
								setPaymentStatus("success");
							} else {
								setPaymentStatus("failed");
								setError("Thanh toán thất bại. Vui lòng thử lại.");
							}
						} catch (err) {
							console.error("Payment failed:", err);
							setPaymentStatus("failed");
							setError("Đã xảy ra lỗi. Vui lòng thử lại.");
						}
					})();

					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center">
				<LoaderComp size="lg" />
			</div>
		);
	}

	if (paymentStatus === "success") {
		return (
			<div className="min-h-screen bg-[#F8F6F3] py-8">
				<div className="max-w-2xl mx-auto px-4">
					<Card className="text-center py-12">
						<CheckCircle className="w-20 h-20 mx-auto mb-6 text-[#16A34A]" />
						<h1 className="font-['Inter', sans-serif] text-3xl text-[#16A34A] mb-4">
							Thanh toán thành công!
						</h1>
						<p className="font-['Inter', sans-serif] text-[#6B7280] mb-8">
							Cảm ơn bạn đã mua khóa học. Giờ hãy bắt đầu học ngay!
						</p>
						<Link to="/my-courses">
							<Button variant="primary" size="lg">
								Xem khóa học của tôi
							</Button>
						</Link>
					</Card>
				</div>
			</div>
		);
	}

	if (paymentStatus === "failed") {
		return (
			<div className="min-h-screen bg-[#F8F6F3] py-8">
				<div className="max-w-2xl mx-auto px-4">
					<Card className="text-center py-12">
						<XCircle className="w-20 h-20 mx-auto mb-6 text-[#DC2626]" />
						<h1 className="font-['Inter', sans-serif] text-3xl text-[#DC2626] mb-4">
							Thanh toán thất bại
						</h1>
						<p className="font-['Inter', sans-serif] text-[#6B7280] mb-2">
							{error || "Vui lòng thử lại."}
						</p>
						<Button
							variant="primary"
							size="lg"
							className="mt-4"
							onClick={() => setPaymentStatus("idle")}
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
			<div className="max-w-2xl mx-auto px-4">
				<button
					onClick={() => navigate("/cart")}
					className="flex items-center gap-2 text-[#1C293C] mb-6 hover:underline"
				>
					<ArrowLeft className="w-5 h-5" />
					<span className="font-['Inter', sans-serif]">Quay lại giỏ hàng</span>
				</button>

				<h1 className="font-['Inter', sans-serif] text-4xl text-[#1C293C] mb-8">
					Thanh toán
				</h1>

				<div className="grid gap-6">
					{/* Order Summary */}
					<Card className="p-6">
						<h2 className="font-['Inter', sans-serif] text-xl text-[#1C293C] mb-4">
							Đơn hàng
						</h2>
						<div className="space-y-3">
							{order?.items?.map((item) => (
								<div key={item.id} className="flex gap-3">
									<img
										src={
											item.khoa_hoc.thumbnail ||
											"https://picsum.photos/seed/course/100/60"
										}
										alt={item.khoa_hoc.tieu_de}
										className="w-20 h-14 object-cover rounded"
									/>
									<div className="flex-1">
										<p className="font-['Inter', sans-serif] text-sm text-[#1C293C] line-clamp-2">
											{item.khoa_hoc.tieu_de}
										</p>
									</div>
								</div>
							))}
							<div className="border-t pt-3 mt-3">
								<div className="flex justify-between">
									<span className="font-['Inter', sans-serif] text-[#6B7280]">
										Tổng cộng
									</span>
									<span className="font-['Inter', sans-serif] text-2xl text-[#1C293C] font-bold">
										{order?.tong_tien?.toLocaleString()}đ
									</span>
								</div>
							</div>
						</div>
					</Card>

					{/* Payment Method */}
					<Card className="p-6">
						<h2 className="font-['Inter', sans-serif] text-xl text-[#1C293C] mb-4">
							Phương thức thanh toán
						</h2>
						<div className="space-y-3">
							{paymentMethods.map((method) => (
								<label
									key={method.id}
									className={`flex items-center gap-3 p-4 border-2 rounded-[12px] cursor-pointer transition-colors ${
										selectedMethod === method.id
											? "border-[#49B6E5] bg-[#F0F9FF]"
											: "border-[#E5E1DC] hover:border-[#49B6E5]"
									}`}
								>
									<input
										type="radio"
										name="paymentMethod"
										value={method.id}
										checked={selectedMethod === method.id}
										onChange={() => setSelectedMethod(method.id)}
										className="w-5 h-5 text-[#49B6E5]"
									/>
									<method.icon className="w-6 h-6 text-[#1C293C]" />
									<span className="font-['Inter', sans-serif] text-[#1C293C]">
										{method.label}
									</span>
								</label>
							))}
						</div>
					</Card>

					{/* Pay Button */}
					{paymentStatus === "processing" ? (
						<Card className="p-8 text-center">
							<div className="w-16 h-16 mx-auto mb-4 border-4 border-[#49B6E5] border-t-transparent rounded-full animate-spin" />
							<p className="font-['Inter', sans-serif] text-[#1C293C] mb-2">
								Đang xử lý thanh toán...
							</p>
							<p className="font-['Inter', sans-serif] text-3xl text-[#49B6E5] font-bold">
								{countdown}s
							</p>
						</Card>
					) : (
						<Button
							variant="primary"
							size="lg"
							className="w-full py-4"
							onClick={handlePayment}
						>
							Thanh toán {order?.tong_tien?.toLocaleString()}đ
						</Button>
					)}

					<p className="font-['Inter', sans-serif] text-xs text-[#6B7280] text-center">
						🔒 Thanh toán an toàn (giả lập - 90% thành công)
					</p>
				</div>
			</div>
		</div>
	);
};

export default PaymentPage;
