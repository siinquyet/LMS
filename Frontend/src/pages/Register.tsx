import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { type ChangeEvent, type FormEvent, useState } from "react";
import ActionButton from "../components/common/ActionButton";
import AuthLayout from "./AuthLayout";

interface FormData {
	ho: string;
	ten: string;
	tenDangNhap: string;
	email: string;
	password: string;
	confirmPassword: string;
}

interface FormErrors {
	[key: string]: string;
}

const Register = () => {
	const [formData, setFormData] = useState<FormData>({
		ho: "",
		ten: "",
		tenDangNhap: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
		// Clear error on change
		if (errors[name]) {
			setErrors({
				...errors,
				[name]: "",
			});
		}
	};

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};

		if (!formData.ho.trim()) newErrors.ho = "Họ là bắt buộc";
		if (!formData.ten.trim()) newErrors.ten = "Tên là bắt buộc";
		if (!formData.tenDangNhap.trim())
			newErrors.tenDangNhap = "Tên đăng nhập là bắt buộc";
		if (!formData.email.trim()) newErrors.email = "Email là bắt buộc";
		else if (!/\S+@\S+\.\S+/.test(formData.email))
			newErrors.email = "Email không hợp lệ";
		if (!formData.password) newErrors.password = "Mật khẩu là bắt buộc";
		else if (formData.password.length < 6)
			newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
		if (formData.confirmPassword !== formData.password)
			newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;

		setIsSubmitting(true);
		try {
			// Mock API call
			await new Promise((resolve) => setTimeout(resolve, 1500));
			alert("Đăng ký thành công! Chào mừng đến với LMS.");
			// Redirect to login
			window.location.href = "/login";
		} catch (error) {
			alert("Có lỗi xảy ra. Vui lòng thử lại.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<AuthLayout
			title="Tạo tài khoản mới"
			subtitle="Đăng ký để bắt đầu hành trình học tập"
		>
			<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label
							htmlFor="ho"
							className="block text-sm font-medium text-slate-700 mb-2"
						>
							Họ
						</label>
						<div className="relative">
							<User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
							<input
								id="ho"
								name="ho"
								type="text"
								required
								className={`w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm ${
									errors.ho
										? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
										: ""
								}`}
								value={formData.ho}
								onChange={handleChange}
							/>
						</div>
						{errors.ho && (
							<p className="mt-1 text-sm text-red-600">{errors.ho}</p>
						)}
					</div>
					<div>
						<label
							htmlFor="ten"
							className="block text-sm font-medium text-slate-700 mb-2"
						>
							Tên
						</label>
						<div className="relative">
							<User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
							<input
								id="ten"
								name="ten"
								type="text"
								required
								className={`w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm ${
									errors.ten
										? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
										: ""
								}`}
								value={formData.ten}
								onChange={handleChange}
							/>
						</div>
						{errors.ten && (
							<p className="mt-1 text-sm text-red-600">{errors.ten}</p>
						)}
					</div>
				</div>

				<div>
					<label
						htmlFor="tenDangNhap"
						className="block text-sm font-medium text-slate-700 mb-2"
					>
						Tên đăng nhập
					</label>
					<div className="relative">
						<User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
						<input
							id="tenDangNhap"
							name="tenDangNhap"
							type="text"
							required
							className={`w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm ${
								errors.tenDangNhap
									? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
									: ""
							}`}
							value={formData.tenDangNhap}
							onChange={handleChange}
						/>
					</div>
					{errors.tenDangNhap && (
						<p className="mt-1 text-sm text-red-600">{errors.tenDangNhap}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-slate-700 mb-2"
					>
						Email
					</label>
					<div className="relative">
						<Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
						<input
							id="email"
							name="email"
							type="email"
							required
							className={`w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm ${
								errors.email
									? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
									: ""
							}`}
							value={formData.email}
							onChange={handleChange}
						/>
					</div>
					{errors.email && (
						<p className="mt-1 text-sm text-red-600">{errors.email}</p>
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

				<div>
					<label
						htmlFor="confirmPassword"
						className="block text-sm font-medium text-slate-700 mb-2"
					>
						Xác nhận mật khẩu
					</label>
					<div className="relative">
						<Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
						<input
							id="confirmPassword"
							name="confirmPassword"
							type={showConfirmPassword ? "text" : "password"}
							required
							className={`w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm ${
								errors.confirmPassword
									? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
									: ""
							}`}
							value={formData.confirmPassword}
							onChange={handleChange}
						/>
						<button
							type="button"
							className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
						>
							{showConfirmPassword ? (
								<EyeOff className="w-4 h-4" />
							) : (
								<Eye className="w-4 h-4" />
							)}
						</button>
					</div>
					{errors.confirmPassword && (
						<p className="mt-1 text-sm text-red-600">
							{errors.confirmPassword}
						</p>
					)}
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
							Đang đăng ký...
						</>
					) : (
						<>
							<span>Đăng ký</span>
							<ArrowRight className="w-5 h-5" />
						</>
					)}
				</ActionButton>
			</form>

			<div className="mt-12 pt-8 border-t border-slate-200 text-center">
				<p className="text-sm text-slate-600">
					Đã có tài khoản?{" "}
					<a
						href="/login"
						className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer transition-colors"
					>
						Đăng nhập ngay
					</a>
				</p>
			</div>
		</AuthLayout>
	);
};

export default Register;
