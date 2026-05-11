import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Input } from "../components/common";
import { useAuth } from "../contexts/AuthContext";

export const LoginPage: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!email.trim()) {
			setError("Vui lòng nhập email");
			return;
		}
		if (!password.trim()) {
			setError("Vui lòng nhập mật khẩu");
			return;
		}

		setIsLoading(true);

		const result = await login(email, password);
		setIsLoading(false);

		if (result.success) {
			const userJson = localStorage.getItem("user");
			if (userJson) {
				const user = JSON.parse(userJson);
				if (user.vai_tro === "giang_vien") {
					navigate("/teacher");
				} else if (user.vai_tro === "admin") {
					navigate("/admin");
				} else {
					navigate("/");
				}
			} else {
				navigate("/");
			}
		} else {
			setError(result.error || "Email hoặc mật khẩu không đúng");
		}
	};

	return (
		<div className="min-h-screen bg-[#FBFBF9] flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<Card className="p-8" hoverable={false}>
					<div className="text-center mb-8">
						<h1 className="font-['Inter', sans-serif] font-bold text-[35px] text-[#1C293C] mb-2 flex items-center justify-center gap-3">
							<LogIn className="w-10 h-10 text-[#432DD7]" />
							Đăng nhập
						</h1>
						<p className="font-['Inter', sans-serif] text-[15px] text-[#6B7280]">
							Chào mừng trở lại!
						</p>
					</div>

					{error && (
						<div className="mb-4 p-3 bg-[#DC2626]/10 border-[3px] border-[#DC2626]">
							<p className="font-['Inter', sans-serif] font-semibold text-sm text-[#DC2626]">
								{error}
							</p>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						<Input
							label="Email"
							type="email"
							placeholder="Nhập email của bạn"
							value={email}
							onChange={setEmail}
							icon={<Mail className="w-5 h-5" />}
						/>

						<div className="relative">
							<Input
								label="Mật khẩu"
								type={showPassword ? "text" : "password"}
								placeholder="Nhập mật khẩu"
								value={password}
								onChange={setPassword}
								icon={<Lock className="w-5 h-5" />}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-[42px] text-[#6B7280] hover:text-[#1C293C]"
							>
								{showPassword ? (
									<EyeOff className="w-5 h-5" />
								) : (
									<Eye className="w-5 h-5" />
								)}
							</button>
						</div>

						<div className="flex items-center justify-between">
							<label className="flex items-center gap-2 cursor-pointer">
								<input type="checkbox" className="w-5 h-5 border-[3px] border-[#1C293C]" />
								<span className="font-['Inter', sans-serif] text-[15px] text-[#6B7280]">
									Ghi nhớ
								</span>
							</label>
							<Link
								to="/forgot-password"
								className="font-['Inter', sans-serif] font-semibold text-[15px] text-[#432DD7] hover:underline"
							>
								Quên mật khẩu?
							</Link>
						</div>

						<Button
							type="submit"
							variant="primary"
							className="w-full"
							disabled={isLoading}
						>
							{isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
						</Button>
					</form>

					<div className="mt-6 text-center">
						<p className="font-['Inter', sans-serif] text-[#6B7280]">
							Chưa có tài khoản?{" "}
							<Link to="/register" className="text-[#49B6E5] hover:underline">
								Đăng ký ngay
							</Link>
						</p>
					</div>

					<div className="mt-6 p-4 bg-[#F8F6F3] rounded-[12px] border-2 border-dashed border-[#E5E1DC]">
						<p className="font-['Inter', sans-serif] text-xs text-[#6B7280] text-center mb-2">
							Tài khoản demo:
						</p>
						<div className="font-['Inter', sans-serif] text-xs text-[#6B7280] space-y-1">
							<p>Học viên: user@example.com / user</p>
							<p>Giảng viên: teacher@example.com / teacher</p>
							<p>Admin: admin@example.com / admin</p>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
};

export default LoginPage;
