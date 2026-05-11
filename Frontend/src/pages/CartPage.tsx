import {
	AlertCircle,
	ArrowRight,
	CheckCircle,
	Clock,
	Loader,
	ShoppingCart,
	Trash2,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as api from "../api";
import { Avatar, Button, Card } from "../components/common";
import { useAuth } from "../contexts/AuthContext";

type PaymentStatus = "idle" | "processing" | "success" | "failed";

interface CartItem {
	id: number;
	khoa_hoc_id: number;
	gia: number;
	khoa_hoc: {
		id: number;
		tieu_de: string;
		thumbnail?: string;
		giang_vien: {
			id: number;
			ho: string;
			ten: string;
			anh_dai_dien?: string;
		};
	};
}

export const CartPage: React.FC = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [items, setItems] = useState<CartItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
	const [countdown, setCountdown] = useState(5);
	const [error, setError] = useState<string | null>(null);

	const totalPrice = items.reduce((sum, item) => sum + item.gia, 0);

	useEffect(() => {
		fetchCart();
	}, []);

	const fetchCart = async () => {
		try {
			const { items: cartItems } = await api.getCart();
			setItems(cartItems || []);
		} catch (err) {
			console.error("Failed to fetch cart:", err);
			setItems([]);
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveItem = async (courseId: number) => {
		try {
			await api.removeFromCart(courseId);
			setItems(items.filter((item) => item.khoa_hoc_id !== courseId));
		} catch (err) {
			console.error("Failed to remove:", err);
			alert("Xóa thất bại");
		}
	};

	const handleCheckout = async () => {
		if (!user) {
			setError("Vui lòng đăng nhập để thanh toán");
			return;
		}

		try {
			// Create order from cart
			await api.checkout();

			// Navigate to payment page
			navigate("/payment");
		} catch (err) {
			console.error("Checkout failed:", err);
			setError("Tạo đơn hàng thất bại. Vui lòng thử lại.");
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-[#F8F6F3] py-8">
				<div className="max-w-4xl mx-auto px-4 flex justify-center">
					<Loader size="lg" />
				</div>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="min-h-screen bg-[#F8F6F3] py-8">
				<div className="max-w-4xl mx-auto px-4">
					<h1 className="font-['Inter', sans-serif] text-4xl text-[#1C293C] mb-8 flex items-center gap-3">
						<ShoppingCart className="w-10 h-10" />
						Giỏ hàng
					</h1>
					<Card className="text-center py-12">
						<ShoppingCart className="w-16 h-16 mx-auto mb-4 text-[#6B7280]" />
						<h2 className="font-['Inter', sans-serif] text-xl text-[#1C293C] mb-2">
							Giỏ hàng trống
						</h2>
						<p className="font-['Inter', sans-serif] text-[#6B7280] mb-6">
							Bạn chưa có khóa học nào trong giỏ
						</p>
						<Link to="/store">
							<Button variant="primary" size="lg">
								Khám phá khóa học
							</Button>
						</Link>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F8F6F3] py-8">
			<div className="max-w-4xl mx-auto px-4">
				<h1 className="font-['Inter', sans-serif] text-4xl text-[#1C293C] mb-8 flex items-center gap-3">
					<ShoppingCart className="w-10 h-10" />
					Giỏ hàng
				</h1>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Cart Items */}
					<div className="lg:col-span-2 space-y-4">
						{items.map((item) => (
							<Card key={item.id} className="flex gap-4">
								<img
									src={
										item.khoa_hoc.thumbnail ||
										"https://picsum.photos/seed/course/300/200"
									}
									alt={item.khoa_hoc.tieu_de}
									className="w-32 h-24 object-cover rounded-[12px] border-2 border-[#1C293C]"
								/>
								<div className="flex-1">
									<h3 className="font-['Inter', sans-serif] text-[#1C293C] text-lg mb-1 line-clamp-2">
										{item.khoa_hoc.tieu_de}
									</h3>
									<div className="flex items-center gap-2 mb-2">
										<Avatar
											name={
												item.khoa_hoc.giang_vien
													? `${item.khoa_hoc.giang_vien.ho} ${item.khoa_hoc.giang_vien.ten}`
													: "Instructor"
											}
											src={item.khoa_hoc.giang_vien?.anh_dai_dien}
											size="sm"
										/>
										<span className="font-['Inter', sans-serif] text-sm text-[#6B7280]">
											{item.khoa_hoc.giang_vien
												? `${item.khoa_hoc.giang_vien.ho} ${item.khoa_hoc.giang_vien.ten}`
												: "Giảng viên"}
										</span>
									</div>
									<span className="font-['Inter', sans-serif] text-xl text-[#1C293C] font-semibold">
										{item.gia.toLocaleString()}đ
									</span>
								</div>
								<button
									onClick={() => handleRemoveItem(item.khoa_hoc_id)}
									className="self-start p-2 text-[#DC2626] hover:bg-[#FEF2F2] rounded-[8px] transition-colors"
								>
									<Trash2 className="w-5 h-5" />
								</button>
							</Card>
						))}
					</div>

					{/* Payment Section */}
					<div>
						<Card className="sticky top-24">
							<h2 className="font-['Inter', sans-serif] text-xl text-[#1C293C] mb-4">
								Thanh toán
							</h2>

							<div className="space-y-3 mb-6">
								<div className="flex justify-between">
									<span className="font-['Inter', sans-serif] text-[#6B7280]">
										Tạm tính ({items.length} khóa học)
									</span>
									<span className="font-['Inter', sans-serif] text-[#1C293C]">
										{totalPrice.toLocaleString()}đ
									</span>
								</div>
								<div className="border-t-2 border-dashed border-[#E5E1DC] pt-3">
									<div className="flex justify-between">
										<span className="font-['Inter', sans-serif] text-[#1C293C] font-semibold">
											Tổng cộng
										</span>
										<span className="font-['Inter', sans-serif] text-2xl text-[#1C293C] font-bold">
											{totalPrice.toLocaleString()}đ
										</span>
									</div>
								</div>
							</div>

							{error && (
								<div className="mb-4 p-3 bg-[#FEF2F2] rounded-[8px]">
									<p className="font-['Inter', sans-serif] text-sm text-[#DC2626]">
										{error}
									</p>
								</div>
							)}

							<Button
								variant="primary"
								size="lg"
								className="w-full"
								onClick={handleCheckout}
							>
								<Clock className="w-5 h-5" />
								Thanh toán ngay
							</Button>

							<p className="font-['Inter', sans-serif] text-xs text-[#6B7280] text-center mt-4">
								🔒 Thanh toán an toàn (giả lập)
							</p>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartPage;
