import {
	ArrowLeft,
	Award,
	Calendar,
	CreditCard,
	ShieldCheck,
	ShoppingCart,
	Star,
	Trash2,
	TrendingUp,
	Video,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ActionButton from "../components/common/ActionButton";
import { useCart } from "../contexts/CartContext";
import { useMyCourses } from "../contexts/MyCoursesContext";

const CartPage = () => {
	const { items, removeItem, clearCart, totalPrice } = useCart();
	const { addCourse } = useMyCourses();
	const [isProcessing, setIsProcessing] = useState(false);
	const [orderSuccess, setOrderSuccess] = useState(false);

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
			maximumFractionDigits: 0,
		}).format(price);
	};

	const handleCheckout = async () => {
		setIsProcessing(true);
		await new Promise((resolve) => setTimeout(resolve, 2000));

		for (const item of items) {
			addCourse({
				id: item.id,
				title: item.title,
				thumbnail: item.thumbnail,
				instructor: item.instructor,
				price: item.price,
				purchaseDate: new Date().toLocaleDateString("vi-VN"),
				progress: 0,
				chapters: [
					{
						id: 1,
						title: "Giới thiệu",
						lessons: [
							{
								id: 1,
								title: "Giới thiệu khóa học",
								duration: "10:00",
								completed: false,
								quizzes: [
									{
										id: 1,
										question: "Mục tiêu của khóa học này là gì?",
										options: [
											{ id: "a", text: "A. Học React cơ bản" },
											{ id: "b", text: "B. Trở thành full-stack dev" },
											{ id: "c", text: "C. Học Node.js" },
											{ id: "d", text: "D. Học database" },
										],
										correctAnswer: "b",
									},
								],
								exercises: [
									{
										id: 1,
										title: "Giới thiệu bản thân",
										description: "Viết một đoạn giới thiệu về bản thân bạn",
										required: false,
									},
								],
							},
						{
							id: 2,
							title: "Hướng dẫn học tập",
							duration: "15:00",
							completed: false,
							quizzes: [
								{
									id: 2,
									question: "Cách tốt nhất để học React là gì?",
									options: [
										{ id: "a", text: "A. Đọc tài liệu" },
										{ id: "b", text: "B. Thực hành nhiều" },
										{ id: "c", text: "C. Xem video" },
										{ id: "d", text: "D. Hỏi người khác" },
									],
									correctAnswer: "b",
								},
								{
									id: 3,
									question: "React hook đầu tiên cần học là gì?",
									options: [
										{ id: "a", text: "A. useEffect" },
										{ id: "b", text: "B. useState" },
										{ id: "c", text: "C. useContext" },
										{ id: "d", text: "D. useReducer" },
									],
									correctAnswer: "b",
								},
							],
							exercises: [],
						},
						],
					},
					{
						id: 2,
						title: "Nội dung chính",
						lessons: [
							{
								id: 3,
								title: "Bài học 1 - React Fundamentals",
								duration: "25:00",
								completed: false,
								quizzes: [
									{
										id: 3,
										question: "React là gì?",
										options: [
											{ id: "a", text: "A. Ngôn ngữ lập trình" },
											{ id: "b", text: "B. Thư viện JavaScript" },
											{ id: "c", text: "C. Framework PHP" },
											{ id: "d", text: "D. Database" },
										],
										correctAnswer: "b",
									},
									{
										id: 4,
										question: "JSX là gì?",
										options: [
											{ id: "a", text: "A. JavaScript XML" },
											{ id: "b", text: "B. Java Syntax Extension" },
											{ id: "c", text: "C. JSON XML" },
											{ id: "d", text: "D. JavaScript Extra" },
										],
										correctAnswer: "a",
									},
								],
								exercises: [
									{
										id: 2,
										title: "Tạo component Hello World",
										description:
											"Tạo một component React hiển thị 'Hello World'",
										required: true,
									},
								],
							},
							{
								id: 4,
								title: "Bài học 2 - Components & Props",
								duration: "30:00",
								completed: false,
								quizzes: [
									{
										id: 5,
										question: "Props trong React dùng để làm gì?",
										options: [
											{ id: "a", text: "A. Style component" },
											{ id: "b", text: "B. Truyền dữ liệu giữa các component" },
											{ id: "c", text: "C. Quản lý state" },
											{ id: "d", text: "D. Xử lý sự kiện" },
										],
										correctAnswer: "b",
									},
									{
										id: 6,
										question: "Component React phải trả về?",
										options: [
											{ id: "a", text: "A. Một object" },
											{ id: "b", text: "B. Một hàm" },
											{ id: "c", text: "C. Một JSX element hoặc null" },
											{ id: "d", text: "D. Một string" },
										],
										correctAnswer: "c",
									},
									{
										id: 7,
										question: "Cách nào đúng để truyền props?",
										options: [
											{ id: "a", text: "A. <Component props={value} />" },
											{ id: "b", text: "B. <Component prop='value' />" },
											{ id: "c", text: "C. Cả A và B đều đúng" },
											{ id: "d", text: "D. Không truyền được props" },
										],
										correctAnswer: "c",
									},
								],
								exercises: [
									{
										id: 3,
										title: "Tạo component với Props",
										description:
											"Tạo component UserCard nhận name, email làm props",
										required: true,
									},
								],
							},
							{
								id: 5,
								title: "Bài học 3 - State & Lifecycle",
								duration: "20:00",
								completed: false,
								quizzes: [
									{
										id: 8,
										question: "useState dùng để làm gì?",
										options: [
											{ id: "a", text: "A. Gọi API" },
											{ id: "b", text: "B. Quản lý state" },
											{ id: "c", text: "C. Routing" },
											{ id: "d", text: "D. Styling" },
										],
										correctAnswer: "b",
									},
									{
										id: 9,
										question: "Cách đúng để cập nhật state?",
										options: [
											{ id: "a", text: "A. state = newValue" },
											{ id: "b", text: "B. setState(newValue)" },
											{ id: "c", text: "C. this.state = newValue" },
											{ id: "d", text: "D. state.update(newValue)" },
										],
										correctAnswer: "b",
									},
									{
										id: 10,
										question: "useEffect chạy khi nào?",
										options: [
											{ id: "a", text: "A. Chỉ chạy một lần khi mount" },
											{ id: "b", text: "B. Chạy sau mỗi lần render" },
											{ id: "c", text: "C. Phụ thuộc vào dependency array" },
											{ id: "d", text: "D. Không bao giờ chạy" },
										],
										correctAnswer: "c",
									},
									{
										id: 11,
										question: "useEffect với dependency array rỗng [] tương đương với?",
										options: [
											{ id: "a", text: "A. componentDidUpdate" },
											{ id: "b", text: "B. componentDidMount" },
											{ id: "c", text: "C. componentWillUnmount" },
											{ id: "d", text: "D. render" },
										],
										correctAnswer: "b",
									},
									{
										id: 12,
										question: "Cleanup function trong useEffect dùng để?",
										options: [
											{ id: "a", text: "A. Xóa cache" },
											{ id: "b", text: "B. Hủy subscriptions, timers" },
											{ id: "c", text: "C. Reset state" },
											{ id: "d", text: "D. Không có tác dụng" },
										],
										correctAnswer: "b",
									},
								],
								exercises: [
									{
										id: 4,
										title: "Counter App",
										description: "Tạo ứng dụng đếm số với nút tăng/giảm",
										required: true,
									},
								],
							},
						],
					},
				],
			});
		}

		setIsProcessing(false);
		setOrderSuccess(true);
		clearCart();
	};

	if (orderSuccess) {
		return (
			<div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
				<div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
					<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<ShieldCheck className="w-10 h-10 text-green-600" />
					</div>
					<h2 className="text-2xl font-bold text-slate-900 mb-4">
						Đặt hàng thành công!
					</h2>
					<p className="text-slate-600 mb-6">
						Cảm ơn bạn đã mua khóa học. Giờ hãy bắt đầu học ngay!
					</p>
					<div className="space-y-3">
						<ActionButton className="w-full">
							<Link to="/my-courses">Vào học ngay</Link>
						</ActionButton>
						<ActionButton variant="outline" className="w-full">
							<Link to="/store">Tiếp tục mua sắm</Link>
						</ActionButton>
					</div>
				</div>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="min-h-screen bg-slate-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
					<div className="text-center">
						<div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<ShoppingCart className="w-10 h-10 text-slate-400" />
						</div>
						<h2 className="text-2xl font-bold text-slate-900 mb-2">
							Giỏ hàng trống
						</h2>
						<p className="text-slate-500 mb-8">
							Hãy thêm khóa học vào giỏ hàng của bạn
						</p>
						<ActionButton>
							<Link to="/store">Khám phá khóa học</Link>
						</ActionButton>
					</div>
				</div>
			</div>
		);
	}

	const originalTotal = items.reduce(
		(sum, item) => sum + item.originalPrice,
		0,
	);
	const discount = originalTotal - totalPrice;

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Header */}
			<div className="bg-white border-b border-slate-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<Link
						to="/store"
						className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						Tiếp tục mua sắm
					</Link>
					<h1 className="text-3xl font-bold text-slate-900 mt-4">
						Giỏ hàng của bạn
					</h1>
					<p className="text-slate-500 mt-1">
						{items.length} khóa học trong giỏ
					</p>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Cart Items */}
					<div className="lg:col-span-2 space-y-4">
						{items.map((item) => (
							<div
								key={item.id}
								className="bg-white rounded-2xl border border-slate-200 p-6 flex gap-6"
							>
								<Link to={`/course/${item.id}`}>
									<img
										src={item.thumbnail}
										alt={item.title}
										className="w-48 h-28 object-cover rounded-xl"
									/>
								</Link>
								<div className="flex-1">
									<Link
										to={`/course/${item.id}`}
										className="font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2"
									>
										{item.title}
									</Link>
									<p className="text-sm text-slate-500 mt-1">
										{item.instructor}
									</p>
									<div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
										<div className="flex items-center gap-1">
											<Star className="w-4 h-4 text-amber-400 fill-amber-400" />
											4.8
										</div>
										<div className="flex items-center gap-1">
											<Video className="w-4 h-4" />
											40 giờ
										</div>
										<div className="flex items-center gap-1">
											<TrendingUp className="w-4 h-4" />
											Cơ bản
										</div>
									</div>
									<div className="flex items-center justify-between mt-4">
										<div>
											<span className="text-xl font-bold text-blue-600">
												{formatPrice(item.price)}
											</span>
											<span className="ml-2 text-sm text-slate-400 line-through">
												{formatPrice(item.originalPrice)}
											</span>
										</div>
										<button
											type="button"
											onClick={() => removeItem(item.id)}
											className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
										>
											<Trash2 className="w-4 h-4" />
											<span className="text-sm">Xóa</span>
										</button>
									</div>
								</div>
							</div>
						))}

						<button
							type="button"
							onClick={clearCart}
							className="text-slate-500 hover:text-slate-700 text-sm transition-colors"
						>
							Xóa tất cả khóa học
						</button>
					</div>

					{/* Order Summary */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
							<h2 className="text-xl font-bold text-slate-900 mb-6">
								Tổng quan đơn hàng
							</h2>

							<div className="space-y-4 pb-6 border-b border-slate-200">
								<div className="flex justify-between text-slate-600">
									<span>Tổng cộng ({items.length} khóa học)</span>
									<span>{formatPrice(originalTotal)}</span>
								</div>
								<div className="flex justify-between text-green-600">
									<span>Giảm giá</span>
									<span>-{formatPrice(discount)}</span>
								</div>
							</div>

							<div className="flex justify-between py-6 border-b border-slate-200">
								<span className="text-lg font-bold text-slate-900">
									Tổng tiền
								</span>
								<span className="text-2xl font-bold text-blue-600">
									{formatPrice(totalPrice)}
								</span>
							</div>

							<div className="pt-6">
								<ActionButton
									size="lg"
									className="w-full !py-4"
									onClick={handleCheckout}
									disabled={isProcessing}
								>
									{isProcessing ? (
										<>
											<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
											Đang xử lý...
										</>
									) : (
										<>
											<CreditCard className="w-5 h-5 mr-2" />
											Thanh toán ngay
										</>
									)}
								</ActionButton>
							</div>

							{/* Benefits */}
							<div className="mt-6 space-y-4">
								<div className="flex items-start gap-3 text-sm">
									<ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
									<div>
										<p className="font-medium text-slate-700">
											Bảo đảm hoàn tiền
										</p>
										<p className="text-slate-500">Trong vòng 30 ngày</p>
									</div>
								</div>
								<div className="flex items-start gap-3 text-sm">
									<Calendar className="w-5 h-5 text-blue-500 shrink-0" />
									<div>
										<p className="font-medium text-slate-700">
											Truy cập trọn đời
										</p>
										<p className="text-slate-500">Học mọi lúc, mọi nơi</p>
									</div>
								</div>
								<div className="flex items-start gap-3 text-sm">
									<Award className="w-5 h-5 text-purple-500 shrink-0" />
									<div>
										<p className="font-medium text-slate-700">
											Chứng chỉ hoàn thành
										</p>
										<p className="text-slate-500">
											Nhận chứng chỉ khi hoàn thành
										</p>
									</div>
								</div>
							</div>

							{/* Payment methods */}
							<div className="mt-6 pt-6 border-t border-slate-200">
								<p className="text-sm text-slate-500 mb-3">
									Phương thức thanh toán
								</p>
								<div className="flex items-center gap-2 text-slate-400">
									<div className="px-3 py-1.5 border border-slate-200 rounded text-xs">
										Visa
									</div>
									<div className="px-3 py-1.5 border border-slate-200 rounded text-xs">
										Mastercard
									</div>
									<div className="px-3 py-1.5 border border-slate-200 rounded text-xs">
										MoMo
									</div>
									<div className="px-3 py-1.5 border border-slate-200 rounded text-xs">
										VNPay
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartPage;
