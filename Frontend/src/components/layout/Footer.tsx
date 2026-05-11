import {
	BookOpen,
	Code,
	ExternalLink,
	Mail,
	Palette,
	Phone,
	TrendingUp,
} from "lucide-react";
import type React from "react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
	return (
		<footer className="bg-[#1C293C] text-white w-full border-t-[3px] border-[#1C293C]">
			<div className="max-w-7xl mx-auto px-4 py-8 w-full">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div>
						<div className="flex items-center gap-2 mb-4">
							<BookOpen className="w-8 h-8" strokeWidth={2} />
							<span className="text-[21px] font-bold">LMS</span>
						</div>
						<p className="text-[15px] text-white/80">
							Nền tảng học tập trực tuyến
						</p>
					</div>

					<div>
						<h4 className="text-[17px] font-bold mb-4 border-b-[3px] border-dashed border-white/30 pb-2 flex items-center gap-2">
							<ExternalLink className="w-4 h-4" /> Quick Links
						</h4>
						<ul className="space-y-2">
							<li>
								<Link
									to="/store"
									className="text-[15px] text-white/80 hover:text-[#FDC800] flex items-center gap-2"
								>
									<BookOpen className="w-4 h-4" /> Store
								</Link>
							</li>
							<li>
								<Link
									to="/my-courses"
									className="text-[15px] text-white/80 hover:text-[#FDC800] flex items-center gap-2"
								>
									<BookOpen className="w-4 h-4" /> My Courses
								</Link>
							</li>
							<li>
								<Link
									to="/forum"
									className="text-[15px] text-white/80 hover:text-[#FDC800] flex items-center gap-2"
								>
									<BookOpen className="w-4 h-4" /> Forum
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="text-[17px] font-bold mb-4 border-b-[3px] border-dashed border-white/30 pb-2 flex items-center gap-2">
							<ExternalLink className="w-4 h-4" /> Categories
						</h4>
						<ul className="space-y-2">
							<li className="text-[15px] text-white/80 flex items-center gap-2">
								<Code className="w-4 h-4" /> Lập trình
							</li>
							<li className="text-[15px] text-white/80 flex items-center gap-2">
								<Palette className="w-4 h-4" /> Thiết kế
							</li>
							<li className="text-[15px] text-white/80 flex items-center gap-2">
								<TrendingUp className="w-4 h-4" /> Marketing
							</li>
						</ul>
					</div>

					<div>
						<h4 className="text-[17px] font-bold mb-4 border-b-[3px] border-dashed border-white/30 pb-2 flex items-center gap-2">
							<ExternalLink className="w-4 h-4" /> Contact
						</h4>
						<ul className="space-y-2">
							<li className="text-[15px] text-white/80 flex items-center gap-2">
								<Mail className="w-4 h-4" /> email@lms.com
							</li>
							<li className="text-[15px] text-white/80 flex items-center gap-2">
								<Phone className="w-4 h-4" /> +84 123 456 789
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-8 pt-6 border-t-[3px] border-dashed border-white/20 text-center">
					<p className="text-[13px] text-white/60 flex items-center justify-center gap-2">
						© 2026 LMS | All rights reserved
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
