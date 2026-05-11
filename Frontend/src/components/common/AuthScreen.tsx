import { ArrowLeft, ArrowRight, Lock, Mail, User } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Card } from "./Card";

export interface AuthScreenProps {
	type: "login" | "register" | "forgot-password";
	onSubmit?: (data: Record<string, string>) => void;
	onSwitch?: (type: "login" | "register" | "forgot-password") => void;
	className?: string;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
	type,
	onSubmit,
	onSwitch,
	className = "",
}) => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		name: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit?.(formData);
	};

	const handleChange = (field: string) => (value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const isLogin = type === "login";
	const isRegister = type === "register";
	const isForgot = type === "forgot-password";

	return (
		<div
			className={`min-h-screen bg-[#FBFBF9] flex items-center justify-center p-4 ${className}`}
		>
			<Card className="w-full max-w-md p-8">
				<div className="text-center mb-8">
					<h1 className="text-[27px] font-bold text-[#1C293C] mb-2">
						{isLogin
							? "Chào mừng trở lại!"
							: isRegister
								? "Đăng ký tài khoản"
								: "Khôi phục mật khẩu"}
					</h1>
					<p className="text-[15px] text-[#6B7280]">
						{isLogin
							? "Đăng nhập để tiếp tục học tập"
							: isRegister
								? "Tạo tài khoản mới"
								: "Nhập email để khôi phục"}
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					{isRegister && (
						<Input
							label="Họ tên"
							placeholder="Nhập họ tên của bạn"
							value={formData.name}
							onChange={handleChange("name")}
							iconLeft={<User className="w-5 h-5" />}
						/>
					)}

					<Input
						label="Email"
						type="email"
						placeholder="Nhập email của bạn"
						value={formData.email}
						onChange={handleChange("email")}
						iconLeft={<Mail className="w-5 h-5" />}
					/>

					{!isForgot && (
						<Input
							label="Mật khẩu"
							type="password"
							placeholder="Nhập mật khẩu"
							value={formData.password}
							onChange={handleChange("password")}
							iconLeft={<Lock className="w-5 h-5" />}
						/>
					)}

					{isRegister && (
						<Input
							label="Xác nhận mật khẩu"
							type="password"
							placeholder="Nhập lại mật khẩu"
							value={formData.confirmPassword}
							onChange={handleChange("confirmPassword")}
							iconLeft={<Lock className="w-5 h-5" />}
						/>
					)}

					{isLogin && (
						<button
							type="button"
							onClick={() => onSwitch?.("forgot-password")}
							className="text-[15px] font-semibold text-[#432DD7] hover:underline"
						>
							Quên mật khẩu?
						</button>
					)}

					<Button type="submit" variant="primary" className="w-full">
						{isLogin
							? "Đăng nhập"
							: isRegister
								? "Tạo tài khoản"
								: "Gửi liên kết"}
						<ArrowRight className="w-4 h-4" />
					</Button>
				</form>

				<div className="mt-6 text-center">
					{isLogin && (
						<p className="text-[15px] text-[#6B7280]">
							Chưa có tài khoản?{" "}
							<button
								type="button"
								onClick={() => onSwitch?.("register")}
								className="text-[#432DD7] font-semibold hover:underline"
							>
								Đăng ký ngay
							</button>
						</p>
					)}
					{isRegister && (
						<p className="text-[15px] text-[#6B7280]">
							Đã có tài khoản?{" "}
							<button
								type="button"
								onClick={() => onSwitch?.("login")}
								className="text-[#432DD7] font-semibold hover:underline"
							>
								Đăng nhập
							</button>
						</p>
					)}
					{isForgot && (
						<button
							type="button"
							onClick={() => onSwitch?.("login")}
							className="text-[15px] font-semibold text-[#432DD7] hover:underline flex items-center justify-center gap-2 w-full"
						>
							<ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
						</button>
					)}
				</div>
			</Card>
		</div>
	);
};

export default AuthScreen;
