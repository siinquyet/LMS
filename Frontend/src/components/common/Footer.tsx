import { Link } from "react-router-dom";
import { Play } from "lucide-react";

const Footer = () => {
	return (
		<footer className="bg-white border-t border-slate-200 py-8">
			<div className="max-w-7xl mx-auto px-6">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div>
						<Link to="/" className="flex items-center gap-2 mb-4">
							<div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
								<Play className="w-4 h-4 text-white" />
							</div>
							<span className="font-bold text-slate-900">LearnHub</span>
						</Link>
						<p className="text-slate-500 text-sm">
							Nền tảng học trực tuyến hàng đầu Việt Nam. Học mọi lúc, mọi nơi với các khóa học chất lượng cao.
						</p>
					</div>
					<div>
						<h4 className="font-semibold text-slate-900 mb-4">Khóa học</h4>
						<ul className="space-y-2">
							<li>
								<Link to="/store?category=programming" className="text-slate-500 hover:text-blue-600 text-sm">
									Lập trình
								</Link>
							</li>
							<li>
								<Link to="/store?category=design" className="text-slate-500 hover:text-blue-600 text-sm">
									Thiết kế
								</Link>
							</li>
							<li>
								<Link to="/store?category=marketing" className="text-slate-500 hover:text-blue-600 text-sm">
									Marketing
								</Link>
							</li>
							<li>
								<Link to="/store?category=business" className="text-slate-500 hover:text-blue-600 text-sm">
									Kinh doanh
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="font-semibold text-slate-900 mb-4">Hỗ trợ</h4>
						<ul className="space-y-2">
							<li>
								<Link to="#" className="text-slate-500 hover:text-blue-600 text-sm">
									Trung tâm trợ giúp
								</Link>
							</li>
							<li>
								<Link to="#" className="text-slate-500 hover:text-blue-600 text-sm">
									Liên hệ
								</Link>
							</li>
							<li>
								<Link to="#" className="text-slate-500 hover:text-blue-600 text-sm">
									Chính sách hoàn tiền
								</Link>
							</li>
							<li>
								<Link to="#" className="text-slate-500 hover:text-blue-600 text-sm">
									Điều khoản dịch vụ
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="font-semibold text-slate-900 mb-4">Liên hệ</h4>
						<ul className="space-y-2 text-sm text-slate-500">
							<li>Email: support@learnhub.com</li>
							<li>Hotline: 1900 xxxx</li>
							<li>Địa chỉ: Hà Nội, Việt Nam</li>
						</ul>
					</div>
				</div>
				<div className="border-t border-slate-200 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
					<p className="text-slate-500 text-sm">
						© 2026 LearnHub. Tất cả các quyền được bảo lưu.
					</p>
					<div className="flex items-center gap-4">
						<Link to="#" className="text-slate-400 hover:text-blue-600">
							<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
							</svg>
						</Link>
						<Link to="#" className="text-slate-400 hover:text-blue-600">
							<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
							</svg>
						</Link>
						<Link to="#" className="text-slate-400 hover:text-blue-600">
							<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
							</svg>
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
