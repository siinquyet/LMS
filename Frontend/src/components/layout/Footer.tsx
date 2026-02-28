import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
	return (
		<footer className="bg-slate-50/50 border-t border-slate-200/60 py-16 shadow-sm w-full">
			<div className="px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
					{/* Col 1: Giới thiệu */}
					<div>
						<h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
							<span>Giới thiệu</span>
						</h3>
						<ul className="space-y-2 text-sm text-slate-600">
							<li>
								<a
									href="#"
									className="hover:text-slate-900 transition-all duration-200"
								>
									Về chúng tôi
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-slate-900 transition-all duration-200"
								>
									Sứ mệnh
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-slate-900 transition-all duration-200"
								>
									Tuyển dụng
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-slate-900 transition-all duration-200"
								>
									Liên hệ
								</a>
							</li>
						</ul>
					</div>

					{/* Col 2: Khóa học */}
					<div>
						<h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
							<span>Khóa học</span>
						</h3>
						<ul className="space-y-2 text-sm text-slate-600">
							<li>
								<a
									href="#"
									className="hover:text-slate-900 transition-all duration-200"
								>
									Lập trình
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-slate-900 transition-all duration-200"
								>
									Design
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-slate-900 transition-all duration-200"
								>
									Marketing
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-slate-900 transition-all duration-200"
								>
									Business
								</a>
							</li>
						</ul>
					</div>

					{/* Col 3: Hỗ trợ */}
					<div>
						<h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
							<span>Hỗ trợ</span>
						</h3>
						<ul className="space-y-2 text-sm text-slate-600">
							<li>
								<a
									href="#"
									className="hover:text-slate-900 transition-all duration-200"
								>
									Hướng dẫn
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-slate-900 transition-all duration-200"
								>
									FAQ
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-slate-900 transition-all duration-200"
								>
									Chính sách
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-slate-900 transition-all duration-200"
								>
									Bảo mật
								</a>
							</li>
						</ul>
					</div>

					{/* Col 4: Contact & Social */}
					<div>
						<h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
							<span>Liên hệ</span>
						</h3>
						<div className="space-y-4 mb-6">
							<div className="flex items-start space-x-3 text-sm text-slate-600">
								<Mail className="w-5 h-5 mt-0.5 text-slate-400 flex-shrink-0" />
								<span>support@lms.com</span>
							</div>
							<div className="flex items-start space-x-3 text-sm text-slate-600">
								<Phone className="w-5 h-5 mt-0.5 text-slate-400 flex-shrink-0" />
								<span>+84 123 456 789</span>
							</div>
							<div className="flex items-start space-x-3 text-sm text-slate-600">
								<MapPin className="w-5 h-5 mt-0.5 text-slate-400 flex-shrink-0" />
								<span>Hà Nội, Việt Nam</span>
							</div>
						</div>
						<div className="flex space-x-4">
							<a
								href="#"
								className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200"
								aria-label="Facebook"
							>
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
								</svg>
							</a>
							<a
								href="#"
								className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all duration-200"
								aria-label="Twitter"
							>
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
								</svg>
							</a>
							<a
								href="#"
								className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200"
								aria-label="Youtube"
							>
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
								</svg>
							</a>
						</div>
					</div>
				</div>

				{/* Copyright */}
				<div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
					<p>&copy; 2024 LMS Platform. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
