import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { type ChangeEvent, type FormEvent, useState } from "react";
import ActionButton from "../components/common/ActionButton";
import { useAuth } from "../contexts/AuthContext";
import AuthLayout from "./AuthLayout";

interface FormData {
	identifier: string;
	password: string;
}

interface FormErrors {
	[key: string]: string;
}

const LoginPage = () => {
	const { login } = useAuth();
	const [formData, setFormData] = useState<FormData>({
		identifier: "",
		password: "",
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
		if (errors[name]) {
			setErrors({
				...errors,
				[name]: "",
			});
		}
	};

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};

		if (!formData.identifier.trim())
			newErrors.identifier = "Email hoặc tên đăng nhập là bắt buộc";
		if (!formData.password) newErrors.password = "Mật khẩu là bắt buộc";
		else if (formData.password.length < 4)
			newErrors.password = "Mật khẩu phải có ít nhất 4 ký tự";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;

		setIsSubmitting(true);
		try {
			const success = await login(formData.identifier, formData.password);
			if (success) {
				window.location.href = "/";
			} else {
				setErrors({ identifier: " ", password: " " });
				alert("Email/tên đăng nhập hoặc mật khẩu không chính xác.");
			}
		} catch {
			alert("Đã xảy ra lỗi. Vui lòng thử lại.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<AuthLayout
			title="Đăng nhập tài khoản"
			subtitle="Chào mừng quay lại! Vui lòng đăng nhập để tiếp tục."
		>
			<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
				<div>
					<label
						htmlFor="identifier"
						className="block text-sm font-medium text-slate-700 mb-2"
					>
						Email hoặc Tên đăng nhập
					</label>
					<div className="relative">
						<Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
						<input
							id="identifier"
							name="identifier"
							type="text"
							required
							className={`w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm ${
								errors.identifier
									? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
									: ""
							}`}
							value={formData.identifier}
							onChange={handleChange}
						/>
					</div>
					{errors.identifier && (
						<p className="mt-1 text-sm text-red-600">{errors.identifier}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-slate-700 mb-2"
					>
						Mật khẩu
					</label>
					<div className="relative">
						<Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
						<input
							id="password"
							name="password"
							type={showPassword ? "text" : "password"}
							required
							className={`w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm ${
								errors.password
									? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
									: ""
							}`}
							value={formData.password}
							onChange={handleChange}
						/>
						<button
							type="button"
							className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? (
								<EyeOff className="w-4 h-4" />
							) : (
								<Eye className="w-4 h-4" />
							)}
						</button>
					</div>
					{errors.password && (
						<p className="mt-1 text-sm text-red-600">{errors.password}</p>
					)}
				</div>

				<div className="flex items-center justify-between">
					<label className="flex items-center text-sm">
						<input
							type="checkbox"
							className="rounded border-slate-200 text-blue-600 focus:ring-blue-500 w-4 h-4"
						/>
						<span className="ml-2 text-slate-600">Ghi nhớ đăng nhập</span>
					</label>
					<a
						href="/forgot-password"
						className="text-sm font-medium text-blue-600 hover:text-blue-500 cursor-pointer transition-colors"
					>
						Quên mật khẩu?
					</a>
				</div>

				<ActionButton
					type="submit"
					size="lg"
					className="w-full flex items-center justify-center gap-2 !py-4"
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<>
							<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
							Đang đăng nhập...
						</>
					) : (
						<>
							<span>Đăng nhập</span>
						</>
					)}
				</ActionButton>
			</form>

			<div className="mt-12 pt-8 border-t border-slate-200 text-center">
				<p className="text-sm text-slate-600">
					Chưa có tài khoản?{" "}
					<a
						href="/register"
						className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer transition-colors"
					>
						Đăng ký ngay
					</a>
				</p>
			</div>
		</AuthLayout>
	);
};

export default LoginPage;
