import {
	AlertCircle,
	BarChart,
	Bell,
	BookOpen,
	Check,
	ChevronDown,
	FileText,
	GraduationCap,
	Info,
	LogIn,
	LogOut,
	Menu,
	MessageCircle,
	Settings,
	Shield,
	ShoppingCart,
	Store,
	User,
	X,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { notifications as mockNotifications } from "../../mockData";
import { Button } from "../common";
import Avatar from "../common/Avatar";

interface LocalNotification {
	id: number;
	type: "info" | "success" | "warning" | "error";
	title: string;
	message: string;
	time: string;
	read: boolean;
}

const headerNotifications: LocalNotification[] = mockNotifications
	.slice(0, 5)
	.map((n) => ({
		id: n.id,
		type: n.loai,
		title: n.tieu_de,
		message: n.noi_dung,
		time: n.ngay_tao,
		read: n.da_doc,
	}));

export const Header: React.FC = () => {
	const location = useLocation();
	const [menuOpen, setMenuOpen] = useState(false);
	const [profileOpen, setProfileOpen] = useState(false);
	const [notiOpen, setNotiOpen] = useState(false);
	const profileRef = useRef<HTMLDivElement>(null);
	const notiRef = useRef<HTMLDivElement>(null);
	const { user, logout } = useAuth();
	const [notifications, setNotifications] =
		useState<LocalNotification[]>(headerNotifications);
	const [switchedRole, setSwitchedRole] = useState<string | null>(null);

	const displayRole = switchedRole || user?.vai_tro || "hoc_vien";
	const isDisplaySwitched = switchedRole !== null;

	const isActive = (path: string) => location.pathname === path;

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				profileRef.current &&
				!profileRef.current.contains(event.target as Node)
			) {
				setProfileOpen(false);
			}
			if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
				setNotiOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const unreadCount = notifications.filter((n) => !n.read).length;

	const getNotiIcon = (type: LocalNotification["type"]) => {
		switch (type) {
			case "success":
				return <Check className="w-4 h-4 text-[#16A34A]" />;
			case "warning":
				return <AlertCircle className="w-4 h-4 text-[#D97706]" />;
			case "error":
				return <X className="w-4 h-4 text-[#DC2626]" />;
			default:
				return <Info className="w-4 h-4 text-[#432DD7]" />;
		}
	};

	const markAsRead = (id: number) => {
		setNotifications(
			notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
		);
	};

	const markAllAsRead = () => {
		setNotifications(notifications.map((n) => ({ ...n, read: true })));
	};

	const handleLogout = () => {
		logout();
		setProfileOpen(false);
	};

	const navLinkClass = (path: string) =>
		`text-[15px] font-semibold flex items-center gap-2 transition-colors ${
			isActive(path)
				? "text-[#FDC800] bg-[#FDC800] px-3 py-1 border-[3px] border-[#1C293C]"
				: "text-[#1C293C] hover:text-[#432DD7]"
		}`;

	const switchUI = (newRole: string) => {
		setSwitchedRole(newRole);
		setProfileOpen(false);
	};

	const switchBack = () => {
		setSwitchedRole(null);
		setProfileOpen(false);
	};

	const originalRoleName =
		user?.vai_tro === "giang_vien"
			? "Giảng viên"
			: user?.vai_tro === "admin"
				? "Admin"
				: "Học viên";
	const displayRoleName =
		displayRole === "giang_vien"
			? "Giảng viên"
			: displayRole === "admin"
				? "Admin"
				: "Học viên";

	return (
		<header className="bg-white border-b-[3px] border-[#1C293C] sticky top-0 z-50 w-full">
			<div className="w-full px-4 py-3">
				<div className="flex items-center justify-between">
					<Link to="/" className="flex items-center gap-2 group">
						<BookOpen
							className="w-8 h-8 text-[#1C293C] group-hover:text-[#432DD7] transition-colors"
							strokeWidth={2}
						/>
						<span className="text-[21px] font-bold text-[#1C293C] group-hover:text-[#432DD7] transition-colors">
							LMS
						</span>
					</Link>

					<nav className="hidden md:flex items-center gap-6">
						<Link to="/store" className={navLinkClass("/store")}>
							<Store className="w-5 h-5" />
							Store
						</Link>
						<Link to="/my-courses" className={navLinkClass("/my-courses")}>
							<BookOpen className="w-5 h-5" />
							My Courses
						</Link>
						<Link to="/assignments" className={navLinkClass("/assignments")}>
							<FileText className="w-5 h-5" />
							Assignments
						</Link>
						<Link to="/forum" className={navLinkClass("/forum")}>
							<MessageCircle className="w-5 h-5" />
							Forum
						</Link>
					</nav>

					<div className="hidden md:flex items-center gap-4">
						<Link
							to="/cart"
							className="text-[15px] font-semibold text-[#1C293C] hover:text-[#432DD7] relative flex items-center gap-2"
						>
							<ShoppingCart className="w-5 h-5" />
							Cart
						</Link>

						{user ? (
							<>
								<div className="relative" ref={notiRef}>
									<button
										type="button"
										onClick={() => setNotiOpen(!notiOpen)}
										className="text-[#1C293C] hover:text-[#432DD7] relative p-1"
									>
										<Bell className="w-5 h-5" />
										{unreadCount > 0 && (
											<span className="absolute -top-1 -right-1 w-4 h-4 bg-[#DC2626] text-white text-[11px] font-semibold flex items-center justify-center">
												{unreadCount}
											</span>
										)}
									</button>
									{notiOpen && (
										<div className="absolute right-0 mt-2 w-80 bg-white border-[3px] border-[#1C293C] shadow-[6px_6px_0_#1C293C] overflow-hidden z-50">
											<div className="p-3 border-b-[3px] border-dashed border-[#1C293C] flex items-center justify-between">
												<span className="text-[15px] font-semibold text-[#1C293C]">
													Thông báo
												</span>
												{unreadCount > 0 && (
													<button
														type="button"
														onClick={markAllAsRead}
														className="text-[13px] font-semibold text-[#432DD7] hover:underline"
													>
														Đánh dấu đã đọc
													</button>
												)}
											</div>
											<div className="max-h-80 overflow-y-auto">
												{notifications.length === 0 ? (
													<div className="p-4 text-center text-[#6B7280] text-[15px]">
														Không có thông báo
													</div>
												) : (
													notifications.map((noti) => (
														<button
															key={noti.id}
															type="button"
															onClick={() => markAsRead(noti.id)}
															className={`w-full p-3 text-left border-b-[3px] border-dashed border-[#E5E7EB] hover:bg-[#FBFBF9] ${!noti.read ? "bg-[#FDC800]/20" : ""}`}
														>
															<div className="flex items-start gap-2">
																{getNotiIcon(noti.type)}
																<div className="flex-1 min-w-0">
																	<p className="text-[13px] font-semibold text-[#1C293C] truncate">
																		{noti.title}
																	</p>
																	<p className="text-[13px] text-[#6B7280] truncate">
																		{noti.message}
																	</p>
																	<p className="text-[13px] text-[#6B7280] mt-1">
																		{noti.time}
																	</p>
																</div>
																{!noti.read && (
																	<div className="w-2 h-2 bg-[#FDC800] shrink-0 mt-1" />
																)}
															</div>
														</button>
													))
												)}
											</div>
										</div>
									)}
								</div>
								<div className="relative" ref={profileRef}>
									<button
										type="button"
										onClick={() => setProfileOpen(!profileOpen)}
										className="flex items-center gap-2 p-1 border-[3px] border-transparent hover:border-[#1C293C] transition-all"
									>
										<Avatar
											src={user.anh_dai_dien}
											name={user.ten || user.ten_dang_nhap}
											size="sm"
											interactive
										/>
										<ChevronDown
											className={`w-4 h-4 text-[#1C293C] transition-transform ${profileOpen ? "rotate-180" : ""}`}
										/>
									</button>
									{profileOpen && (
										<div className="absolute right-0 mt-2 w-56 bg-white border-[3px] border-[#1C293C] shadow-[6px_6px_0_#1C293C] overflow-hidden z-50">
											<div className="p-3 border-b-[3px] border-dashed border-[#1C293C]">
												<p className="text-[15px] font-semibold text-[#1C293C]">
													{user.ten || user.ten_dang_nhap}
												</p>
												<p className="text-[13px] text-[#6B7280]">
													{user.email}
												</p>
												<div className="flex items-center gap-1 mt-1">
													{displayRole === "admin" && (
														<span className="px-2 py-0.5 bg-[#DC2626] text-white text-[11px] font-semibold border-[2px] border-[#1C293C]">
															Admin
														</span>
													)}
													{displayRole === "giang_vien" && (
														<span className="px-2 py-0.5 bg-[#432DD7] text-white text-[11px] font-semibold border-[2px] border-[#1C293C]">
															Giảng viên
														</span>
													)}
													{displayRole === "hoc_vien" && (
														<span className="px-2 py-0.5 bg-[#FDC800] text-[#1C293C] text-[11px] font-semibold border-[2px] border-[#1C293C]">
															Học viên
														</span>
													)}
												</div>
											</div>

											{displayRole === "admin" && (
												<>
													<Link
														to="/admin"
														className="flex items-center gap-2 px-3 py-2 hover:bg-[#FBFBF9] text-[#1C293C]"
														onClick={() => setProfileOpen(false)}
													>
														<BarChart className="w-4 h-4" />
														<span className="text-[15px]">Dashboard</span>
													</Link>
													<Link
														to="/admin/users"
														className="flex items-center gap-2 px-3 py-2 hover:bg-[#FBFBF9] text-[#1C293C]"
														onClick={() => setProfileOpen(false)}
													>
														<Settings className="w-4 h-4" />
														<span className="text-[15px]">Quản lý</span>
													</Link>
													<div className="border-t-[3px] border-dashed border-[#1C293C]" />
												</>
											)}

											<Link
												to="/profile"
												className="flex items-center gap-2 px-3 py-2 hover:bg-[#FBFBF9] text-[#1C293C]"
												onClick={() => setProfileOpen(false)}
											>
												<User className="w-4 h-4" />
												<span className="text-[15px]">Hồ sơ</span>
											</Link>
											<Link
												to="/settings"
												className="flex items-center gap-2 px-3 py-2 hover:bg-[#FBFBF9] text-[#1C293C]"
												onClick={() => setProfileOpen(false)}
											>
												<Settings className="w-4 h-4" />
												<span className="text-[15px]">Cài đặt</span>
											</Link>

											{user?.vai_tro &&
												user?.vai_tro !== "hoc_vien" &&
												displayRole === "hoc_vien" && (
													<div className="border-t-[3px] border-dashed border-[#1C293C] pt-2 mt-2">
														<button
															type="button"
															onClick={() => switchUI(user.vai_tro)}
															className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#FBFBF9] text-[#1C293C]"
														>
															{user.vai_tro === "giang_vien" ? (
																<GraduationCap className="w-4 h-4" />
															) : (
																<Shield className="w-4 h-4" />
															)}
															<span className="text-[15px]">
																Sang giao diện {originalRoleName}
															</span>
														</button>
													</div>
												)}

											<button
												type="button"
												onClick={handleLogout}
												className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#FEF2F2] text-[#DC2626]"
											>
												<LogOut className="w-4 h-4" />
												<span className="text-[15px]">Đăng xuất</span>
											</button>
										</div>
									)}
								</div>
							</>
						) : (
							<div className="flex items-center gap-2">
								<Link to="/login">
									<Button variant="secondary" size="sm">
										<LogIn className="w-4 h-4" />
										Đăng nhập
									</Button>
								</Link>
								<Link to="/register">
									<Button variant="primary" size="sm">
										<User className="w-4 h-4" />
										Đăng ký
									</Button>
								</Link>
							</div>
						)}
					</div>

					<button
						type="button"
						className="md:hidden p-2 text-[#1C293C] border-[3px] border-[#1C293C] hover:bg-[#FBFBF9]"
						onClick={() => setMenuOpen(!menuOpen)}
					>
						{menuOpen ? (
							<X className="w-6 h-6" />
						) : (
							<Menu className="w-6 h-6" />
						)}
					</button>
				</div>

				{menuOpen && (
					<nav className="md:hidden mt-4 pb-4 border-t-[3px] border-dashed border-[#1C293C] pt-4">
						<div className="flex flex-col gap-3">
							<Link
								to="/store"
								className={navLinkClass("/store")}
								onClick={() => setMenuOpen(false)}
							>
								<Store className="w-5 h-5" /> Store
							</Link>
							<Link
								to="/my-courses"
								className={navLinkClass("/my-courses")}
								onClick={() => setMenuOpen(false)}
							>
								<BookOpen className="w-5 h-5" /> My Courses
							</Link>
							<Link
								to="/assignments"
								className={navLinkClass("/assignments")}
								onClick={() => setMenuOpen(false)}
							>
								<FileText className="w-5 h-5" /> Assignments
							</Link>
							<Link
								to="/forum"
								className={navLinkClass("/forum")}
								onClick={() => setMenuOpen(false)}
							>
								<MessageCircle className="w-5 h-5" /> Forum
							</Link>
							<Link
								to="/cart"
								className={navLinkClass("/cart")}
								onClick={() => setMenuOpen(false)}
							>
								<ShoppingCart className="w-5 h-5" /> Cart
							</Link>

							{user && (
								<Link
									to="/profile"
									className={navLinkClass("/profile")}
									onClick={() => setMenuOpen(false)}
								>
									<Avatar name={user.ten || user.ten_dang_nhap} size="sm" />
									Profile
								</Link>
							)}
							{!user && (
								<div className="flex gap-2 mt-2">
									<Link to="/login" className="flex-1">
										<Button variant="secondary" size="sm" className="w-full">
											Đăng nhập
										</Button>
									</Link>
									<Link to="/register" className="flex-1">
										<Button variant="primary" size="sm" className="w-full">
											Đăng ký
										</Button>
									</Link>
								</div>
							)}
						</div>
					</nav>
				)}
			</div>
		</header>
	);
};

export default Header;
