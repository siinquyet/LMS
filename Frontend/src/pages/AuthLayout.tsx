import type { ReactNode } from "react";

interface AuthLayoutProps {
	children: ReactNode;
	title: string;
	subtitle: string;
}

const AuthLayout = ({
	children,
	title,
	subtitle,
}: AuthLayoutProps) => {
	return (
		<div className="w-full min-h-screen flex flex-col lg:flex-row items-stretch lg:items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
			<div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto gap-12 lg:gap-20">
				{/* Left - Image/Gradient */}
				<div className="lg:w-1/2 min-h-[500px] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 lg:p-16 flex flex-col items-center justify-center text-white text-center shadow-2xl relative overflow-hidden lg:flex-1">
					<div className="relative z-10 max-w-md mx-auto">
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
							Chào mừng đến với
						</h1>
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-4 drop-shadow-2xl">
							LMS Platform
						</h2>
						<p className="text-xl md:text-2xl opacity-90 leading-relaxed drop-shadow-md">
							Nơi kiến tạo tương lai sự nghiệp của bạn
						</p>
					</div>
					<div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] -z-10" />
				</div>

				{/* Right - Form */}
				<div className="lg:w-1/2 bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-12 lg:p-16 border border-slate-200/50 shadow-2xl flex flex-col justify-center lg:flex-1">
					<div>
						<h2 className="text-center text-3xl font-bold text-slate-900 mb-4">
							{title}
						</h2>
						<p className="text-center text-sm text-slate-600 mb-8">
							{subtitle}
						</p>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthLayout;
