import {
	Bell,
	BookOpen,
	ChevronRight,
	Clock,
	Eye,
	EyeOff,
	GraduationCap,
	History,
	Lock,
	MapPin,
	Shield,
	TrendingUp,
	User,
	X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ActionButton from "../components/common/ActionButton";

type SettingsTabType = "password" | "notifications" | "privacy" | "account";

const SettingsPage = () => {
	const [activeTab, setActiveTab] = useState<SettingsTabType>("password");
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	
	const [passwords, setPasswords] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const [notifications, setNotifications] = useState({
		email: true,
		push: true,
		marketing: false,
		updates: true,
		courseReminders: true,
		newComments: true,
		newReplies: true,
		promotions: false,
	});

	const tabs = [
		{ key: "password", label: "Mật khẩu", icon: Lock },
		{ key: "notifications", label: "Thông báo", icon: Bell },
		{ key: "privacy", label: "Quyền riêng tư", icon: Shield },
		{ key: "account", label: "Tài khoản", icon: User },
	];

	const handleChangePassword = () => {
		if (passwords.newPassword !== passwords.confirmPassword) {
			alert("Mật khẩu xác nhận không khớp!");
			return;
		}
		if (passwords.newPassword.length < 6) {
			alert("Mật khẩu mới phải có ít nhất 6 ký tự!");
			return;
		}
		alert("Đổi mật khẩu thành công!");
		setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
	};

	const stats = {
		coursesCompleted: 5,
		coursesInProgress: 2,
		totalHours: 156,
		certificates: 4,
	};

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Header Banner */}
			<div className="h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
				<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
			</div>

			<div className="max-w-6xl mx-auto px-4">
				{/* Profile Header */}
				<div className="relative -mt-16 mb-6">
					<div className="flex flex-col md:flex-row items-start md:items-end gap-4">
						{/* Avatar */}
						<div className="w-32 h-32 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center border-4 border-white shadow-lg">
							<User className="w-16 h-16 text-white" />
						</div>

						{/* Info */}
						<div className="flex-1 pb-2">
							<h1 className="text-2xl font-bold text-white">Nguyễn Văn User</h1>
							<p className="text-blue-100">user@example.com</p>
							<div className="flex items-center gap-4 mt-2 text-blue-100 text-sm">
								<span className="flex items-center gap-1">
									<MapPin className="w-4 h-4" />
									Hà Nội, Việt Nam
								</span>
								<span className="flex items-center gap-1">
									<History className="w-4 h-4" />
									Tham gia tháng 1, 2024
								</span>
							</div>
						</div>

						{/* Back to Profile */}
						<div className="pb-2">
							<Link
								to="/profile"
								className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
							>
								<ChevronRight className="w-4 h-4 rotate-180" />
								Quay lại hồ sơ
							</Link>
						</div>
					</div>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
					<div className="bg-white rounded-xl p-4 border border-slate-200">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
								<BookOpen className="w-5 h-5 text-blue-600" />
							</div>
							<div>
								<p className="text-2xl font-bold text-slate-900">{stats.coursesCompleted}</p>
								<p className="text-sm text-slate-500">Khóa học hoàn thành</p>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-xl p-4 border border-slate-200">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
								<Clock className="w-5 h-5 text-green-600" />
							</div>
							<div>
								<p className="text-2xl font-bold text-slate-900">{stats.totalHours}</p>
								<p className="text-sm text-slate-500">Giờ học</p>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-xl p-4 border border-slate-200">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
								<GraduationCap className="w-5 h-5 text-purple-600" />
							</div>
							<div>
								<p className="text-2xl font-bold text-slate-900">{stats.certificates}</p>
								<p className="text-sm text-slate-500">Chứng chỉ</p>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-xl p-4 border border-slate-200">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
								<TrendingUp className="w-5 h-5 text-orange-600" />
							</div>
							<div>
								<p className="text-2xl font-bold text-slate-900">{stats.coursesInProgress}</p>
								<p className="text-sm text-slate-500">Đang học</p>
							</div>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Sidebar */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
							{tabs.map((tab) => (
								<button
									key={tab.key}
									type="button"
									onClick={() => setActiveTab(tab.key as SettingsTabType)}
									className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
										activeTab === tab.key
											? "bg-blue-50 text-blue-600 border-l-2 border-blue-600"
											: "text-slate-600 hover:bg-slate-50"
									}`}
								>
									<tab.icon className="w-5 h-5" />
									<span className="font-medium">{tab.label}</span>
								</button>
							))}
						</div>
					</div>

					{/* Content */}
					<div className="lg:col-span-3">
						{activeTab === "password" && (
							<div className="bg-white rounded-xl border border-slate-200 p-6">
								<h2 className="text-xl font-semibold text-slate-900 mb-6">Đổi mật khẩu</h2>
								<div className="max-w-md space-y-4">
									<div>
										<label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu hiện tại</label>
										<div className="relative">
											<input
												type={showCurrentPassword ? "text" : "password"}
												value={passwords.currentPassword}
												onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
												className="w-full px-4 py-2 pr-10 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
												placeholder="Nhập mật khẩu hiện tại"
											/>
											<button
												type="button"
												onClick={() => setShowCurrentPassword(!showCurrentPassword)}
												className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
											>
												{showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
											</button>
										</div>
									</div>
									<div>
										<label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu mới</label>
										<div className="relative">
											<input
												type={showNewPassword ? "text" : "password"}
												value={passwords.newPassword}
												onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
												className="w-full px-4 py-2 pr-10 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
												placeholder="Nhập mật khẩu mới"
											/>
											<button
												type="button"
												onClick={() => setShowNewPassword(!showNewPassword)}
												className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
											>
												{showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
											</button>
										</div>
									</div>
									<div>
										<label className="block text-sm font-medium text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
										<input
											type="password"
											value={passwords.confirmPassword}
											onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
											className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
											placeholder="Xác nhận mật khẩu mới"
										/>
									</div>
									<ActionButton onClick={handleChangePassword}>
										<Lock className="w-4 h-4 mr-2" />
										Đổi mật khẩu
									</ActionButton>
								</div>
							</div>
						)}

						{activeTab === "notifications" && (
							<div className="bg-white rounded-xl border border-slate-200 p-6">
								<h2 className="text-xl font-semibold text-slate-900 mb-6">Cài đặt thông báo</h2>
								<div className="space-y-6">
									<div>
										<h3 className="font-medium text-slate-900 mb-3">Thông báo chung</h3>
										<div className="space-y-3">
											<label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
												<div>
													<p className="font-medium text-slate-900">Email notifications</p>
													<p className="text-sm text-slate-500">Nhận thông báo qua email</p>
												</div>
												<input
													type="checkbox"
													checked={notifications.email}
													onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
													className="w-5 h-5 text-blue-600 rounded"
												/>
											</label>
											<label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
												<div>
													<p className="font-medium text-slate-900">Push notifications</p>
													<p className="text-sm text-slate-500">Nhận thông báo trên thiết bị</p>
												</div>
												<input
													type="checkbox"
													checked={notifications.push}
													onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
													className="w-5 h-5 text-blue-600 rounded"
												/>
											</label>
											<label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
												<div>
													<p className="font-medium text-slate-900">Nhắc nhở học tập</p>
													<p className="text-sm text-slate-500">Nhận thông báo nhắc học bài</p>
												</div>
												<input
													type="checkbox"
													checked={notifications.courseReminders}
													onChange={(e) => setNotifications({ ...notifications, courseReminders: e.target.checked })}
													className="w-5 h-5 text-blue-600 rounded"
												/>
											</label>
										</div>
									</div>
									<div>
										<h3 className="font-medium text-slate-900 mb-3">Hoạt động</h3>
										<div className="space-y-3">
											<label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
												<div>
													<p className="font-medium text-slate-900">Bình luận mới</p>
													<p className="text-sm text-slate-500">Thông báo khi có người trả lời bình luận</p>
												</div>
												<input
													type="checkbox"
													checked={notifications.newComments}
													onChange={(e) => setNotifications({ ...notifications, newComments: e.target.checked })}
													className="w-5 h-5 text-blue-600 rounded"
												/>
											</label>
											<label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
												<div>
													<p className="font-medium text-slate-900">Phản hồi mới</p>
													<p className="text-sm text-slate-500">Thông báo khi có người trả lời</p>
												</div>
												<input
													type="checkbox"
													checked={notifications.newReplies}
													onChange={(e) => setNotifications({ ...notifications, newReplies: e.target.checked })}
													className="w-5 h-5 text-blue-600 rounded"
												/>
											</label>
											<label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
												<div>
													<p className="font-medium text-slate-900">Cập nhật khóa học</p>
													<p className="text-sm text-slate-500">Thông báo khi khóa học được cập nhật</p>
												</div>
												<input
													type="checkbox"
													checked={notifications.updates}
													onChange={(e) => setNotifications({ ...notifications, updates: e.target.checked })}
													className="w-5 h-5 text-blue-600 rounded"
												/>
											</label>
										</div>
									</div>
									<div>
										<h3 className="font-medium text-slate-900 mb-3">Marketing</h3>
										<div className="space-y-3">
											<label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
												<div>
													<p className="font-medium text-slate-900">Khuyến mãi & ưu đãi</p>
													<p className="text-sm text-slate-500">Nhận tin khuyến mãi, ưu đãi đặc biệt</p>
												</div>
												<input
													type="checkbox"
													checked={notifications.promotions}
													onChange={(e) => setNotifications({ ...notifications, promotions: e.target.checked })}
													className="w-5 h-5 text-blue-600 rounded"
												/>
											</label>
										</div>
									</div>
								</div>
							</div>
						)}

						{activeTab === "privacy" && (
							<div className="bg-white rounded-xl border border-slate-200 p-6">
								<h2 className="text-xl font-semibold text-slate-900 mb-6">Cài đặt quyền riêng tư</h2>
								<div className="space-y-4">
									<label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer">
										<div>
											<p className="font-medium text-slate-900">Hiển thị hồ sơ công khai</p>
											<p className="text-sm text-slate-500">Cho phép người khác xem thông tin hồ sơ</p>
										</div>
										<input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
									</label>
									<label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer">
										<div>
											<p className="font-medium text-slate-900">Hiển thị hoạt động</p>
											<p className="text-sm text-slate-500">Cho phép xem lịch sử hoạt động</p>
										</div>
										<input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
									</label>
									<label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer">
										<div>
											<p className="font-medium text-slate-900">Cho phép tìm kiếm</p>
											<p className="text-sm text-slate-500">Cho phép người khác tìm kiếm bạn qua email</p>
										</div>
										<input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
									</label>
									<label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer">
										<div>
											<p className="font-medium text-slate-900">Hiển thị khóa học đã mua</p>
											<p className="text-sm text-slate-500">Cho phép xem danh sách khóa học đã đăng ký</p>
										</div>
										<input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
									</label>
								</div>
							</div>
						)}

						{activeTab === "account" && (
							<div className="space-y-6">
								<div className="bg-white rounded-xl border border-slate-200 p-6">
									<h2 className="text-xl font-semibold text-slate-900 mb-6">Quản lý tài khoản</h2>
									<div className="space-y-4">
										<div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
											<div className="flex items-center gap-3 mb-2">
												<User className="w-5 h-5 text-blue-600" />
												<span className="font-medium text-blue-900">Tài khoản đã xác minh</span>
											</div>
											<p className="text-sm text-blue-700">Email của bạn đã được xác minh</p>
										</div>
										<div className="grid grid-cols-2 gap-4">
											<div className="p-4 bg-slate-50 rounded-lg">
												<p className="text-sm text-slate-500 mb-1">Loại tài khoản</p>
												<p className="font-medium text-slate-900">Học viên</p>
											</div>
											<div className="p-4 bg-slate-50 rounded-lg">
												<p className="text-sm text-slate-500 mb-1">Ngày tham gia</p>
												<p className="font-medium text-slate-900">Tháng 1, 2024</p>
											</div>
										</div>
									</div>
								</div>

								<div className="bg-red-50 rounded-xl border border-red-200 p-6">
									<h2 className="text-xl font-semibold text-red-700 mb-4">Khu vực nguy hiểm</h2>
									<p className="text-sm text-red-600 mb-4">
										Các thao tác dưới đây có thể ảnh hưởng vĩnh viễn đến tài khoản của bạn. Vui lòng cân nhắc kỹ.
									</p>
									<div className="space-y-3">
										<button
											type="button"
											className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
										>
											<X className="w-4 h-4" />
											Xóa tài khoản vĩnh viễn
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default SettingsPage;
