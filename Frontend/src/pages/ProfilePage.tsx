import {
	BookOpen,
	Briefcase,
	Cake,
	Calendar,
	Edit,
	Globe,
	GraduationCap,
	Mail,
	MapPin,
	Phone,
	Save,
	User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, Button, Card, Input, Textarea } from "../components/common";
import { getUserProfile, updateUserProfile, uploadAvatar } from "../api";

interface UserProfile {
	id: number;
	ten_dang_nhap: string;
	email: string;
	ho: string;
	ten: string;
	so_dien_thoai?: string;
	dia_chi?: string;
	gioi_thieu?: string;
	anh_dai_dien?: string;
	ngay_tham_gia: string;
	ngay_sinh?: string;
	gioi_tinh?: string;
	trinh_do?: string;
	nghe_nghiep?: string;
	website?: string;
	facebook?: string;
	linkedin?: string;
}

export const ProfilePage: React.FC = () => {
	const [user, setUser] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [editForm, setEditForm] = useState<UserProfile | null>(null);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const savedUser = localStorage.getItem("user");
		if (savedUser) {
			const userData = JSON.parse(savedUser);
			loadUser(userData.id);
		}
	}, []);

	const loadUser = async (userId: number) => {
		try {
			const { user: userData } = await getUserProfile(userId);
			setUser(userData);
			setEditForm(userData);
		} catch (error) {
			console.error("Failed to load user:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async () => {
		if (!editForm || !user) return;
		setSaving(true);
		try {
			await updateUserProfile(user.id, {
				ten: editForm.ten,
				ho: editForm.ho,
				email: editForm.email,
				so_dien_thoai: editForm.so_dien_thoai,
				dia_chi: editForm.dia_chi,
				gioi_thieu: editForm.gioi_thieu,
				anh_dai_dien: avatarPreview || editForm.anh_dai_dien,
			});
			setUser(editForm);
			localStorage.setItem("user", JSON.stringify(editForm));
			setIsEditing(false);
			setAvatarPreview(null);
			alert("Lưu thành công!");
		} catch (error) {
			alert("Lưu thất bại");
		} finally {
			setSaving(false);
		}
	};

	const handleCancel = () => {
		setEditForm(user);
		setIsEditing(false);
		setAvatarPreview(null);
	};

	const handleAvatarChange = (file: File) => {
		const reader = new FileReader();
		reader.onload = () => {
			setAvatarPreview(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	const handleAvatarUpload = async (file: File) => {
		try {
			const data = await uploadAvatar(file);
			if (data.success && data.url) {
				setAvatarPreview(data.url);
			}
		} catch (err) {
			console.error('Avatar upload failed:', err);
			alert('Tải ảnh thất bại');
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center">
				<div className="text-[#1C293C]">Đang tải...</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="min-h-screen bg-[#F8F6F3] p-8">
				<Card className="p-8 text-center">
					<p className="text-[#1C293C]">Vui lòng đăng nhập để xem hồ sơ</p>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F8F6F3] p-4 md:p-8">
			<div className="max-w-4xl mx-auto space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<h1 className="font-['Inter', sans-serif] text-2xl text-[#1C293C]">
						Hồ sơ cá nhân
					</h1>
					{!isEditing && (
						<Button
							variant="primary"
							onClick={() => {
								setEditForm(user);
								setIsEditing(true);
							}}
						>
							<Edit className="w-4 h-4" /> Chỉnh sửa
						</Button>
					)}
				</div>

				{/* Profile Card */}
				<Card className="p-6">
					<div className="flex flex-col md:flex-row gap-6">
						{/* Avatar */}
						<div className="flex flex-col items-center gap-4">
							<div className="relative">
								<Avatar
									src={avatarPreview || user.anh_dai_dien}
									name={user.ten}
									size="xl"
									onChange={isEditing ? handleAvatarUpload : undefined}
								/>
							</div>
							{isEditing && (
								<p className="font-['Inter', sans-serif] text-sm text-[#6B7280]">
									Nhấn vào ảnh để đổi
								</p>
							)}
						</div>

						{/* Info */}
						<div className="flex-1 space-y-4">
							{isEditing ? (
								<>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<Input
											label="Họ"
											value={editForm.ho}
											onChange={(e) =>
												setEditForm({ ...editForm, ho: e })
											}
											icon={<User className="w-4 h-4" />}
										/>
										<Input
											label="Tên"
											value={editForm.ten}
											onChange={(e) =>
												setEditForm({ ...editForm, ten: e })
											}
										/>
									</div>
									<Input
										label="Email"
										type="email"
										value={editForm.email}
										onChange={(e) =>
											setEditForm({ ...editForm, email: e })
										}
										icon={<Mail className="w-4 h-4" />}
									/>
									<Input
										label="Số điện thoại"
										value={editForm.so_dien_thoai || ""}
										onChange={(e) =>
											setEditForm({
												...editForm,
												so_dien_thoai: e,
											})
										}
										icon={<Phone className="w-4 h-4" />}
									/>
									<Input
										label="Địa chỉ"
										value={editForm.dia_chi || ""}
										onChange={(e) =>
											setEditForm({ ...editForm, dia_chi: e })
										}
										icon={<MapPin className="w-4 h-4" />}
									/>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<Input
											label="Ngày sinh"
											type="date"
											value={editForm.ngay_sinh || ""}
											onChange={(e) =>
												setEditForm({ ...editForm, ngay_sinh: e })
											}
											icon={<Cake className="w-4 h-4" />}
										/>
										<Input
											label="Giới tính"
											value={editForm.gioi_tinh || ""}
											onChange={(e) =>
												setEditForm({ ...editForm, gioi_tinh: e })
											}
										/>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<Input
											label="Trình độ"
											value={editForm.trinh_do || ""}
											onChange={(e) =>
												setEditForm({ ...editForm, trinh_do: e })
											}
											icon={<GraduationCap className="w-4 h-4" />}
										/>
										<Input
											label="Nghề nghiệp"
											value={editForm.nghe_nghiep || ""}
											onChange={(e) =>
												setEditForm({
													...editForm,
													nghe_nghiep: e,
												})
											}
											icon={<Briefcase className="w-4 h-4" />}
										/>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<Input
											label="Facebook"
											value={editForm.facebook || ""}
											onChange={(e) =>
												setEditForm({ ...editForm, facebook: e })
											}
											placeholder="https://facebook.com/..."
										/>
										<Input
											label="LinkedIn"
											value={editForm.linkedin || ""}
											onChange={(e) =>
												setEditForm({ ...editForm, linkedin: e })
											}
											placeholder="https://linkedin.com/in/..."
										/>
									</div>
									<Textarea
										label="Giới thiệu"
										value={editForm.gioi_thieu || ""}
										onChange={(e) =>
											setEditForm({ ...editForm, gioi_thieu: e })
										}
										placeholder="Giới thiệu về bản thân..."
										rows={3}
									/>
									<div className="flex gap-3">
										<Button variant="secondary" onClick={handleCancel}>
											Hủy
										</Button>
										<Button variant="primary" onClick={handleSave}>
											<Save className="w-4 h-4" /> Lưu
										</Button>
									</div>
								</>
							) : (
								<>
									<div>
										<h2 className="font-['Inter', sans-serif] text-xl text-[#1C293C]">
											{user.ho} {user.ten}
										</h2>
										<p className="font-['Inter', sans-serif] text-sm text-[#6B7280]">
											@{user.ten_dang_nhap}
										</p>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="flex items-center gap-3">
											<Mail className="w-5 h-5 text-[#6B7280]" />
											<span className="font-['Inter', sans-serif] text-[#1C293C]">
												{user.email}
											</span>
										</div>
										<div className="flex items-center gap-3">
											<Phone className="w-5 h-5 text-[#6B7280]" />
											<span className="font-['Inter', sans-serif] text-[#1C293C]">
												{user.so_dien_thoai || "Chưa cập nhật"}
											</span>
										</div>
										<div className="flex items-center gap-3">
											<MapPin className="w-5 h-5 text-[#6B7280]" />
											<span className="font-['Inter', sans-serif] text-[#1C293C]">
												{user.dia_chi || "Chưa cập nhật"}
											</span>
										</div>
										<div className="flex items-center gap-3">
											<Cake className="w-5 h-5 text-[#6B7280]" />
											<span className="font-['Inter', sans-serif] text-[#1C293C]">
												{user.ngay_sinh || "Chưa cập nhật"}
											</span>
										</div>
										<div className="flex items-center gap-3">
											<Briefcase className="w-5 h-5 text-[#6B7280]" />
											<span className="font-['Inter', sans-serif] text-[#1C293C]">
												{user.nghe_nghiep || "Chưa cập nhật"}
											</span>
										</div>
										<div className="flex items-center gap-3">
											<Calendar className="w-5 h-5 text-[#6B7280]" />
											<span className="font-['Inter', sans-serif] text-[#1C293C]">
												Tham gia: {user.ngay_tham_gia}
											</span>
										</div>
										<div className="flex items-center gap-3">
											<GraduationCap className="w-5 h-5 text-[#6B7280]" />
											<span className="font-['Inter', sans-serif] text-[#1C293C]">
												{user.trinh_do || "Chưa cập nhật"}
											</span>
										</div>
									</div>

									{/* Social Links */}
									{(user.facebook || user.linkedin) && (
										<div className="flex gap-4 mt-2">
											{user.facebook && (
												<a
													href={user.facebook}
													target="_blank"
													rel="noopener noreferrer"
													className="font-['Inter', sans-serif] text-sm text-[#49B6E5] hover:underline"
												>
													Facebook
												</a>
											)}
											{user.linkedin && (
												<a
													href={user.linkedin}
													target="_blank"
													rel="noopener noreferrer"
													className="font-['Inter', sans-serif] text-sm text-[#49B6E5] hover:underline"
												>
													LinkedIn
												</a>
											)}
										</div>
									)}

									{user.gioi_thieu && (
										<div className="p-4 bg-[#F8F6F3] rounded-[8px]">
											<h3 className="font-['Inter', sans-serif] text-sm text-[#6B7280] mb-1">
												Giới thiệu
											</h3>
											<p className="font-['Inter', sans-serif] text-[#1C293C]">
												{user.gioi_thieu}
											</p>
										</div>
									)}
								</>
							)}
						</div>
					</div>
				</Card>

				{/* Enrolled Courses */}
				<div>
					<h2 className="font-['Inter', sans-serif] text-xl text-[#1C293C] mb-4">
						Khóa học của tôi
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{[].map((course) => (
							<Card key={course.id} className="p-4">
								<div className="aspect-video bg-[#1C293C] rounded-[8px] mb-3 flex items-center justify-center">
									<BookOpen className="w-8 h-8 text-white" />
								</div>
								<h3 className="font-['Inter', sans-serif] text-sm text-[#1C293C] mb-2 line-clamp-2">
									{course.title}
								</h3>
								<div className="space-y-1">
									<div className="flex justify-between text-xs">
										<span className="font-['Inter', sans-serif] text-[#6B7280]">
											Tiến độ
										</span>
										<span className="font-['Inter', sans-serif] text-[#1C293C]">
											{course.progress}%
										</span>
									</div>
									<div className="h-2 bg-[#E5E1DC] rounded-full overflow-hidden">
										<div
											className="h-full bg-[#1C293C] rounded-full"
											style={{ width: `${course.progress}%` }}
										/>
									</div>
								</div>
							</Card>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
