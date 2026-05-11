import {
	BarChart3,
	BookOpen,
	DollarSign,
	FileText,
	GraduationCap,
	LogOut,
	Menu,
	Settings,
	Shield,
	Star,
	UserCheck,
	Users,
	X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Avatar from "../common/Avatar";

interface AdminLayoutProps {
	children?: React.ReactNode;
}

const menuItems = [
	{
		path: "/admin",
		icon: <BarChart3 className="w-5 h-5" />,
		label: "Tổng quan",
		badge: 0,
	},
	{
		path: "/admin/courses",
		icon: <BookOpen className="w-5 h-5" />,
		label: "Khóa học",
		badge: 1,
	},
	{
		path: "/admin/users",
		icon: <Users className="w-5 h-5" />,
		label: "Người dùng",
		badge: 0,
	},
	{
		path: "/admin/reports",
		icon: <Star className="w-5 h-5" />,
		label: "Báo cáo",
		badge: 2,
	},
	{
		path: "/admin/orders",
		icon: <FileText className="w-5 h-5" />,
		label: "Đơn hàng",
		badge: 0,
	},
	{
		path: "/admin/settings",
		icon: <Settings className="w-5 h-5" />,
		label: "Cài đặt",
		badge: 0,
	},
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const { user, logout } = useAuth();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const isActive = (path: string) => {
		if (path === "/admin") {
			return location.pathname === "/admin";
		}
		return location.pathname.startsWith(path);
	};

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	return (
		<div className="min-h-screen bg-[#F8F6F3] flex">
			<aside
				className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1C293C] text-white transform transition-transform duration-300 border-r-3 border-[#1C293C]
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
			>
				<div className="flex flex-col h-full shadow-[4px_0_0px_#49B6E5]">
					<div className="p-4 border-b-2 border-white/20">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Shield className="w-8 h-8 text-[#49B6E5]" />
								<span className="font-['Inter', sans-serif] text-lg font-bold">
									LMS Admin
								</span>
							</div>
							<button
								type="button"
								onClick={() => setSidebarOpen(false)}
								className="lg:hidden p-1"
							>
								<X className="w-5 h-5" />
							</button>
						</div>
						<p className="text-xs text-white/60 mt-1">Quản trị viên</p>
					</div>

					<nav className="flex-1 p-4 space-y-1">
						{menuItems.map((item) => (
							<Link
								key={item.path}
								to={item.path}
								onClick={() => setSidebarOpen(false)}
								className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-[8px] transition-all font-['Inter', sans-serif] text-sm
                  ${
										isActive(item.path)
											? "bg-[#49B6E5] text-white shadow-[2px_2px_0px_#1C293C]"
											: "text-white/70 hover:bg-white/10 hover:text-white"
									}
                `}
							>
								{item.icon}
								<span className="flex-1">
									{item.label}
								</span>
								{item.badge > 0 && (
									<span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
										{item.badge}
									</span>
								)}
							</Link>
						))}
					</nav>

					<div className="p-4 border-t-2 border-white/20">
						<div className="flex items-center gap-3 mb-3 p-2 bg-white/5 rounded-[8px]">
							<Avatar
								name={user?.ten || user?.ten_dang_nhap || "Admin"}
								size="sm"
							/>
							<div className="flex-1 min-w-0">
								<p className="font-['Inter', sans-serif] text-sm font-bold truncate">
									{user?.ten || user?.ten_dang_nhap}
								</p>
								<p className="text-xs text-white/60 truncate">{user?.email}</p>
							</div>
						</div>
						<Link
							to="/"
							onClick={() => setSidebarOpen(false)}
							className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-white/70 hover:bg-white/10 hover:text-white transition-colors mb-2 font-['Inter', sans-serif] text-sm"
						>
							<BookOpen className="w-5 h-5" />
							<span>
								Xem site
							</span>
						</Link>
						<button
							type="button"
							onClick={handleLogout}
							className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-white/70 hover:bg-white/10 hover:text-white transition-colors font-['Inter', sans-serif] text-sm"
						>
							<LogOut className="w-5 h-5" />
							<span>
								Đăng xuất
							</span>
						</button>
					</div>
				</div>
			</aside>

			<div className="flex-1 flex flex-col">
				<header className="bg-white border-b-3 border-[#1C293C] px-4 py-3 flex items-center justify-between lg:hidden shadow-[0_2px_0px_#E5E1DC]">
					<div className="flex items-center gap-2">
						<Shield className="w-6 h-6 text-[#49B6E5]" />
						<span className="font-['Inter', sans-serif] text-lg font-bold">
							LMS Admin
						</span>
					</div>
					<button
						type="button"
						onClick={() => setSidebarOpen(true)}
						className="p-2 hover:bg-gray-100 rounded-[8px]"
					>
						<Menu className="w-6 h-6" />
					</button>
				</header>

				<main className="flex-1 overflow-auto p-6 bg-[#F8F6F3]">{children}</main>
			</div>

			{sidebarOpen && (
				<button
					type="button"
					className="fixed inset-0 bg-black/50 z-40 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}
		</div>
	);
};

export default AdminLayout;
