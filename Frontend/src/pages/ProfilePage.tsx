import {
	Award,
	BookOpen,
	Calendar,
	Camera,
	ChevronRight,
	Clock,
	Heart,
	History,
	MapPin,
	MessageCircle,
	Pencil,
	Save,
	Settings,
	Share2,
	TrendingUp,
	User,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ActionButton from "../components/common/ActionButton";

type TabType = "profile" | "courses" | "activity";
type ActivityType = "saved" | "comments" | "interactions";

const ProfilePage = () => {
	const { user } = useAuth();
	const [activeTab, setActiveTab] = useState<TabType>("profile");
	const [activityType, setActivityType] = useState<ActivityType>("saved");
	const [isEditing, setIsEditing] = useState(false);
	
	const [profile, setProfile] = useState({
		ho: user?.ho || "Nguyen",
		ten: user?.ten || "User",
		email: user?.email || "user@example.com",
		so_dien_thoai: "0123456789",
		ngay_sinh: "2000-01-01",
		gioi_tinh: "Nam",
		dia_chi: "Hà Nội, Việt Nam",
		gioi_thieu: "Học viên đam mê lập trình và công nghệ. Luôn tìm kiếm cơ hội học hỏi và phát triển kỹ năng mới.",
	});

	const stats = {
		coursesCompleted: 5,
		coursesInProgress: 2,
		totalHours: 156,
		certificates: 4,
		posts: 12,
		comments: 45,
		likesReceived: 128,
	};

	const courses = [
		{
			id: 1,
			title: "React & Next.js Full Course",
			progress: 75,
			status: "in_progress",
			image: "from-blue-500 to-indigo-600",
			lastAccess: "2 giờ trước",
		},
		{
			id: 2,
			title: "TypeScript Fundamentals",
			progress: 100,
			status: "completed",
			image: "from-cyan-500 to-blue-600",
			lastAccess: "1 ngày trước",
		},
		{
			id: 3,
			title: "Node.js Backend Development",
			progress: 30,
			status: "in_progress",
			image: "from-green-500 to-teal-600",
			lastAccess: "3 ngày trước",
		},
	];

	const savedPosts = [
		{
			id: 1,
			title: "Hướng dẫn sử dụng useEffect trong React",
			author: "Nguyễn Văn A",
			likes: 24,
			comments: 8,
			time: "2 ngày trước",
		},
		{
			id: 2,
			title: "Tổng hợp tài liệu học TypeScript",
			author: "Trần Thị B",
			likes: 45,
			comments: 12,
			time: "1 tuần trước",
		},
		{
			id: 3,
			title: "Cách xây dựng REST API với Node.js",
			author: "Lê Văn C",
			likes: 67,
			comments: 23,
			time: "2 tuần trước",
		},
	];

	const userComments = [
		{
			id: 1,
			postTitle: "Hướng dẫn sử dụng useEffect trong React",
			content: "Bạn có thể kiểm tra dependency array kỹ hơn. Nếu không cần chạy lại thì để mảng rỗng []",
			likes: 5,
			time: "2 giờ trước",
		},
		{
			id: 2,
			postTitle: "Chia sẻ kinh nghiệm học lập trình",
			content: "Mình cũng từng gặp vấn đề này! Giải pháp là dùng useCallback cho function",
			likes: 3,
			time: "5 giờ trước",
		},
		{
			id: 3,
			postTitle: "Thông báo: Tuần này chúng ta sẽ học về React Router",
			content: "Cảm ơn thầy! Em sẽ chuẩn bị trước",
			likes: 8,
			time: "1 ngày trước",
		},
	];

	const interactions = [
		{
			id: 1,
			type: "like",
			targetUser: "Nguyễn Văn A",
			postTitle: "Hướng dẫn sử dụng useEffect trong React",
			time: "2 giờ trước",
			icon: Heart,
		},
		{
			id: 2,
			type: "like",
			targetUser: "Trần Thị B",
			postTitle: "Chia sẻ kinh nghiệm học lập trình",
			time: "5 giờ trước",
			icon: Heart,
		},
		{
			id: 3,
			type: "share",
			targetUser: "Lê Văn C",
			postTitle: "Thông báo: Tuần này chúng ta sẽ học về React Router",
			time: "1 ngày trước",
			icon: Share2,
		},
		{
			id: 4,
			type: "like",
			targetUser: "Phạm Thị D",
			postTitle: "Mọi người có tài liệu hay về TypeScript không?",
			time: "2 ngày trước",
			icon: Heart,
		},
	];

	const tabs = [
		{ key: "profile", label: "Hồ sơ", icon: User },
		{ key: "courses", label: "Khóa học", icon: BookOpen },
		{ key: "activity", label: "Hoạt động", icon: History },
	];

	const handleSaveProfile = () => {
		setIsEditing(false);
		alert("Cập nhật hồ sơ thành công!");
	};

	const handleAvatarChange = () => {
		alert("Tính năng đang được phát triển!");
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
						<div className="relative">
							<div className="w-32 h-32 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center border-4 border-white shadow-lg">
								<User className="w-16 h-16 text-white" />
							</div>
							<label className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 shadow-md border-2 border-white">
								<Camera className="w-4 h-4" onClick={handleAvatarChange} />
								<input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
							</label>
						</div>

						{/* Info */}
						<div className="flex-1 pb-2">
							<div className="flex items-center gap-3 mb-1">
								<h1 className="text-2xl font-bold text-white">{profile.ho} {profile.ten}</h1>
								<span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full">
									{user?.vai_tro === "admin" ? "Quản trị viên" : user?.vai_tro === "giang_vien" ? "Giảng viên" : "Học viên"}
								</span>
							</div>
							<p className="text-blue-100">{profile.email}</p>
							<div className="flex items-center gap-4 mt-2 text-blue-100 text-sm">
								<span className="flex items-center gap-1">
									<MapPin className="w-4 h-4" />
									{profile.dia_chi}
								</span>
								<span className="flex items-center gap-1">
									<Calendar className="w-4 h-4" />
									Tham gia tháng 1, 2024
								</span>
							</div>
						</div>

						{/* Actions */}
						<div className="flex gap-2 pb-2">
							<ActionButton
								variant="secondary"
								onClick={() => setIsEditing(!isEditing)}
							>
								<Pencil className="w-4 h-4 mr-2" />
								{isEditing ? "Hủy" : "Chỉnh sửa"}
							</ActionButton>
							<Link to="/settings">
								<ActionButton>
									<Settings className="w-4 h-4 mr-2" />
									Cài đặt
								</ActionButton>
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
								<Award className="w-5 h-5 text-purple-600" />
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

				{/* Tabs */}
				<div className="bg-white rounded-xl border border-slate-200 mb-6">
					<div className="flex border-b border-slate-200 overflow-x-auto">
						{tabs.map((tab) => (
							<button
								key={tab.key}
								type="button"
								onClick={() => setActiveTab(tab.key as TabType)}
								className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
									activeTab === tab.key
										? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
										: "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
								}`}
							>
								<tab.icon className="w-4 h-4" />
								{tab.label}
							</button>
						))}
					</div>

					<div className="p-6">
						{activeTab === "profile" && (
							<div className="max-w-2xl">
								{isEditing ? (
									<>
										<div className="grid grid-cols-2 gap-4 mb-4">
											<div>
												<label className="block text-sm font-medium text-slate-700 mb-1">Họ</label>
												<input
													type="text"
													value={profile.ho}
													onChange={(e) => setProfile({ ...profile, ho: e.target.value })}
													className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-slate-700 mb-1">Tên</label>
												<input
													type="text"
													value={profile.ten}
													onChange={(e) => setProfile({ ...profile, ten: e.target.value })}
													className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
												/>
											</div>
										</div>
										<div className="mb-4">
											<label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
											<input
												type="email"
												value={profile.email}
												onChange={(e) => setProfile({ ...profile, email: e.target.value })}
												className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
											/>
										</div>
										<div className="grid grid-cols-2 gap-4 mb-4">
											<div>
												<label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
												<input
													type="tel"
													value={profile.so_dien_thoai}
													onChange={(e) => setProfile({ ...profile, so_dien_thoai: e.target.value })}
													className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
												/>
											</div>
											<div>
												<label className="block text-sm font-medium text-slate-700 mb-1">Ngày sinh</label>
												<input
													type="date"
													value={profile.ngay_sinh}
													onChange={(e) => setProfile({ ...profile, ngay_sinh: e.target.value })}
													className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
												/>
											</div>
										</div>
										<div className="grid grid-cols-2 gap-4 mb-4">
											<div>
												<label className="block text-sm font-medium text-slate-700 mb-1">Giới tính</label>
												<select
													value={profile.gioi_tinh}
													onChange={(e) => setProfile({ ...profile, gioi_tinh: e.target.value })}
													className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
												>
													<option value="Nam">Nam</option>
													<option value="Nữ">Nữ</option>
													<option value="Khác">Khác</option>
												</select>
											</div>
											<div>
												<label className="block text-sm font-medium text-slate-700 mb-1">Địa chỉ</label>
												<input
													type="text"
													value={profile.dia_chi}
													onChange={(e) => setProfile({ ...profile, dia_chi: e.target.value })}
													className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
												/>
											</div>
										</div>
										<div className="mb-6">
											<label className="block text-sm font-medium text-slate-700 mb-1">Giới thiệu</label>
											<textarea
												value={profile.gioi_thieu}
												onChange={(e) => setProfile({ ...profile, gioi_thieu: e.target.value })}
												rows={4}
												className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
											/>
										</div>
										<div className="flex gap-3">
											<ActionButton onClick={handleSaveProfile}>
												<Save className="w-4 h-4 mr-2" />
												Lưu thay đổi
											</ActionButton>
											<ActionButton variant="secondary" onClick={() => setIsEditing(false)}>
												Hủy
											</ActionButton>
										</div>
									</>
								) : (
									<>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<label className="block text-sm font-medium text-slate-500 mb-1">Họ và tên</label>
												<p className="text-slate-900 font-medium">{profile.ho} {profile.ten}</p>
											</div>
											<div>
												<label className="block text-sm font-medium text-slate-500 mb-1">Email</label>
												<p className="text-slate-900 font-medium">{profile.email}</p>
											</div>
											<div>
												<label className="block text-sm font-medium text-slate-500 mb-1">Số điện thoại</label>
												<p className="text-slate-900 font-medium">{profile.so_dien_thoai}</p>
											</div>
											<div>
												<label className="block text-sm font-medium text-slate-500 mb-1">Ngày sinh</label>
												<p className="text-slate-900 font-medium">{new Date(profile.ngay_sinh).toLocaleDateString("vi-VN")}</p>
											</div>
											<div>
												<label className="block text-sm font-medium text-slate-500 mb-1">Giới tính</label>
												<p className="text-slate-900 font-medium">{profile.gioi_tinh}</p>
											</div>
											<div>
												<label className="block text-sm font-medium text-slate-500 mb-1">Địa chỉ</label>
												<p className="text-slate-900 font-medium">{profile.dia_chi}</p>
											</div>
										</div>
										<div className="mt-6 pt-6 border-t border-slate-200">
											<label className="block text-sm font-medium text-slate-500 mb-1">Giới thiệu</label>
											<p className="text-slate-700">{profile.gioi_thieu}</p>
										</div>
									</>
								)}
							</div>
						)}

						{activeTab === "courses" && (
							<div>
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold text-slate-900">Khóa học của tôi</h3>
									<Link to="/my-courses" className="text-sm text-blue-600 hover:underline">
										Xem tất cả
									</Link>
								</div>
								<div className="space-y-4">
									{courses.map((course) => (
										<div
											key={course.id}
											className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors"
										>
											<div className={`w-24 h-16 bg-gradient-to-r ${course.image} rounded-lg flex items-center justify-center shrink-0`}>
												<BookOpen className="w-8 h-8 text-white" />
											</div>
											<div className="flex-1">
												<h4 className="font-medium text-slate-900 mb-1">{course.title}</h4>
												<div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
													<span className="flex items-center gap-1">
														<Clock className="w-3 h-3" />
														{course.lastAccess}
													</span>
													<span className={`px-2 py-0.5 rounded-full text-xs ${
														course.status === "completed" 
															? "bg-green-100 text-green-700" 
															: "bg-blue-100 text-blue-700"
													}`}>
														{course.status === "completed" ? "Hoàn thành" : "Đang học"}
													</span>
												</div>
												<div className="flex items-center gap-2">
													<div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
														<div
															className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
															style={{ width: `${course.progress}%` }}
														/>
													</div>
													<span className="text-sm font-medium text-slate-600">{course.progress}%</span>
												</div>
											</div>
											<Link
												to={`/learn/${course.id}`}
												className="self-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
											>
												<ChevronRight className="w-5 h-5" />
											</Link>
										</div>
									))}
								</div>
							</div>
						)}

						{activeTab === "activity" && (
							<div>
								{/* Sub-tabs */}
								<div className="flex gap-2 mb-4">
									<button
										type="button"
										onClick={() => setActivityType("saved")}
										className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
											activityType === "saved"
												? "bg-blue-600 text-white"
												: "bg-slate-100 text-slate-600 hover:bg-slate-200"
										}`}
									>
										<Save className="w-4 h-4 inline-block mr-2" />
										Đã lưu
									</button>
									<button
										type="button"
										onClick={() => setActivityType("comments")}
										className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
											activityType === "comments"
												? "bg-blue-600 text-white"
												: "bg-slate-100 text-slate-600 hover:bg-slate-200"
										}`}
									>
										<MessageCircle className="w-4 h-4 inline-block mr-2" />
										Bình luận
									</button>
									<button
										type="button"
										onClick={() => setActivityType("interactions")}
										className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
											activityType === "interactions"
												? "bg-blue-600 text-white"
												: "bg-slate-100 text-slate-600 hover:bg-slate-200"
										}`}
									>
										<Heart className="w-4 h-4 inline-block mr-2" />
										Tương tác
									</button>
								</div>

								{/* Content */}
								{activityType === "saved" && (
									<div className="space-y-3">
										{savedPosts.map((post) => (
											<div
												key={post.id}
												className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer"
											>
												<div className="flex-1">
													<h4 className="font-medium text-slate-900 mb-1">{post.title}</h4>
													<p className="text-sm text-slate-500">Tác giả: {post.author}</p>
													<div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
														<span className="flex items-center gap-1">
															<Heart className="w-3 h-3" />
															{post.likes}
														</span>
														<span className="flex items-center gap-1">
															<MessageCircle className="w-3 h-3" />
															{post.comments}
														</span>
														<span>{post.time}</span>
													</div>
												</div>
												<Save className="w-5 h-5 text-blue-600 shrink-0" />
											</div>
										))}
									</div>
								)}

								{activityType === "comments" && (
									<div className="space-y-3">
										{userComments.map((comment) => (
											<div
												key={comment.id}
												className="p-4 bg-slate-50 rounded-xl border border-slate-200"
											>
												<p className="text-xs text-slate-500 mb-2">Bình luận trong: {comment.postTitle}</p>
												<p className="text-slate-700 mb-2">{comment.content}</p>
												<div className="flex items-center gap-3 text-xs text-slate-400">
													<span className="flex items-center gap-1">
														<Heart className="w-3 h-3" />
														{comment.likes}
													</span>
													<span>{comment.time}</span>
												</div>
											</div>
										))}
									</div>
								)}

								{activityType === "interactions" && (
									<div className="space-y-3">
										{interactions.map((interaction) => (
											<div
												key={interaction.id}
												className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200"
											>
												<div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 border border-slate-200">
													<interaction.icon className="w-5 h-5 text-blue-600" />
												</div>
												<div className="flex-1">
													<p className="text-sm text-slate-600">
														{interaction.type === "like" ? "Đã thích" : "Đã chia sẻ"} bài viết của <span className="font-medium text-slate-900">{interaction.targetUser}</span>
													</p>
													<p className="text-sm text-slate-500 mt-1">{interaction.postTitle}</p>
													<p className="text-xs text-slate-400 mt-1">{interaction.time}</p>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
