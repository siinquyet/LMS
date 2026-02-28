import {
	Bell,
	ChevronDown,
	LogOut,
	Menu,
	Search,
	Settings,
	ShoppingCart,
	User,
	X,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

const Header = () => {
	const { user, logout } = useAuth();
	const { totalItems } = useCart();
	const navigate = useNavigate();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	return (
		<header className="sticky top-0 z-50 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm supports-[backdrop-filter:blur(20px)]:bg-white/90 w-full">
			<div className="h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Left: Logo + Desktop Nav */}
				<div className="flex items-center space-x-8">
					<a href="/" className="flex items-center space-x-2">
						<h1 className="text-xl font-bold text-slate-900 cursor-pointer hover:text-slate-700 transition-colors duration-200">
							LMS
						</h1>
					</a>
					<nav className="hidden md:flex space-x-6">
						<a
							href="/"
							className="text-sm font-medium text-slate-700 hover:text-slate-900 cursor-pointer transition-colors duration-200 px-3 py-2"
						>
							Home
						</a>
						<a
							href="/my-courses"
							className="text-sm font-medium text-slate-700 hover:text-slate-900 cursor-pointer transition-colors duration-200 px-3 py-2"
						>
							Khóa học
						</a>
						<a
							href="/assignments"
							className="text-sm font-medium text-slate-700 hover:text-slate-900 cursor-pointer transition-colors duration-200 px-3 py-2"
						>
							Bài tập
						</a>
						<Link
							to="/store"
							className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors duration-200 px-3 py-2"
						>
							Cửa hàng
						</Link>
						<Link
							to="/forum"
							className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors duration-200 px-3 py-2"
						>
							Thảo luận
						</Link>
					</nav>
				</div>

				{/* Center: Search */}
				<div className="hidden lg:flex flex-1 max-w-md mx-8">
					<div className="relative w-full">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
						<input
							type="text"
							placeholder="Tìm kiếm khóa học..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-300 focus:border-transparent transition-all duration-200 bg-white/50"
						/>
					</div>
				</div>

				{/* Right: Notifications + Cart + Profile + Mobile Menu */}
				<div className="flex items-center space-x-4">
					<Link
						to="/cart"
						className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out active:scale-95 group"
					>
						<ShoppingCart className="w-5 h-5" />
						{totalItems > 0 && (
							<span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
								{totalItems}
							</span>
						)}
					</Link>

					<button
						type="button"
						className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out active:scale-95 group"
					>
						<Bell className="w-5 h-5" />
						<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
							4
						</span>
					</button>

					{user ? (
						<div className="relative">
							<button
								type="button"
								className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
								onClick={() => setIsProfileOpen(!isProfileOpen)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										setIsProfileOpen(!isProfileOpen);
									}
								}}
								aria-expanded={isProfileOpen}
								aria-haspopup="true"
							>
								<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
									<User className="w-4 h-4 text-white" />
								</div>
								<span className="hidden sm:block text-sm font-medium text-slate-700">
									{user.ho} {user.ten}
								</span>
								<ChevronDown className="w-4 h-4 text-slate-500" />
							</button>

							{isProfileOpen && (
								<div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
									<div className="px-4 py-2 border-b border-slate-100">
										<p className="font-medium text-slate-900">
											{user.ho} {user.ten}
										</p>
										<p className="text-sm text-slate-500">{user.email}</p>
										<span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
											{user.vai_tro === "admin"
												? "Quản trị viên"
												: user.vai_tro === "giang_vien"
													? "Giảng viên"
													: "Học viên"}
										</span>
									</div>
									<Link
										to="/profile"
										className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
									>
										<User className="w-4 h-4" />
										Trang cá nhân
									</Link>
									<a
										href="/settings"
										className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
									>
										<Settings className="w-4 h-4" />
										Cài đặt
									</a>
									<hr className="my-2 border-slate-100" />
									<button
										type="button"
										onClick={handleLogout}
										className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
									>
										<LogOut className="w-4 h-4" />
										Đăng xuất
									</button>
								</div>
							)}
						</div>
					) : (
						<>
							<Link
								to="/login"
								className="text-sm font-medium text-slate-700 hover:text-slate-900 cursor-pointer transition-colors px-3 py-2"
							>
								Đăng nhập
							</Link>
							<a
								href="/register"
								className="text-sm font-medium text-white hover:text-white cursor-pointer transition-all duration-200 px-4 py-2 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:via-slate-700 hover:to-slate-800 rounded-lg shadow-sm hover:shadow-xl active:scale-[0.98]"
							>
								Đăng ký
							</a>
						</>
					)}

					{/* Mobile Menu Button */}
					<button
						type="button"
						className="md:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-900 active:text-white focus:bg-slate-900 focus:text-white focus:ring-2 focus:ring-slate-300/50 rounded-lg backdrop-blur-sm shadow-md hover:shadow-lg active:shadow-lg transition-all duration-200 group-active:scale-95"
						onClick={() => setIsMobileMenuOpen(true)}
					>
						<Menu className="w-6 h-6" />
					</button>
				</div>
			</div>

			{/* Mobile Menu Overlay */}
			{isMobileMenuOpen && (
				<div
					className="fixed top-0 left-0 right-0 bottom-0 z-[70] bg-black/70 backdrop-blur-2xl"
					onClick={() => setIsMobileMenuOpen(false)}
					onKeyDown={(e) => {
						if (e.key === "Escape") setIsMobileMenuOpen(false);
					}}
					role="dialog"
					aria-modal="true"
				>
					<div className="fixed right-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl border-l border-slate-200 transform transition-all duration-300 ease-in-out z-50">
						<div className="p-6">
							<div className="flex items-center justify-between mb-8">
								<h2 className="text-lg font-bold text-slate-900">Menu</h2>
								<button
									type="button"
									onClick={() => setIsMobileMenuOpen(false)}
									className="p-2 hover:bg-slate-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out active:scale-95 group"
									aria-label="Close menu"
								>
									<X className="w-6 h-6" />
								</button>
							</div>
							<nav className="space-y-4">
								<a
									href="/"
									className="block py-2 px-4 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200 font-medium"
								>
									Khám phá
								</a>
								<a
									href="/my-courses"
									className="block py-2 px-4 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200 font-medium"
								>
									Khóa học của tôi
								</a>
								<a
									href="/instructor"
									className="block py-2 px-4 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200 font-medium"
								>
									Giảng viên
								</a>
							</nav>
							<div className="mt-8 pt-8 border-t border-slate-200">
								{user ? (
									<div className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-all duration-200">
										<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
											<User className="w-5 h-5 text-white" />
										</div>
										<div>
											<p className="font-medium text-slate-900">
												{user.ho} {user.ten}
											</p>
											<p className="text-sm text-slate-600">{user.email}</p>
										</div>
									</div>
								) : (
									<div className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-all duration-200">
										<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
											<User className="w-5 h-5 text-white" />
										</div>
										<div>
											<p className="font-medium text-slate-900">Khách</p>
											<p className="text-sm text-slate-600">Chưa đăng nhập</p>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;
