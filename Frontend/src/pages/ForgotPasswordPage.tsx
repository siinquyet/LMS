import { Mail } from "lucide-react";
import { type ChangeEvent, type FormEvent, useState } from "react";
import ActionButton from "../components/common/ActionButton";
import AuthLayout from "./AuthLayout";

interface FormData {
	email: string;
}

interface FormErrors {
	[key: string]: string;
}

const ForgotPasswordPage = () => {
	const [formData, setFormData] = useState<FormData>({
		email: "",
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [message, setMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);

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

		if (!formData.email.trim()) newErrors.email = "Email là bắt buộc";
		else if (!/\S+@\S+\.\S+/.test(formData.email))
			newErrors.email = "Email không hợp lệ";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;

		setIsSubmitting(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setSubmitted(true);
			setMessage(
				"Đã gửi link đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư!",
			);
		} catch (error) {
			setErrors({ email: "Có lỗi xảy ra. Vui lòng thử lại." });
		} finally {
			setIsSubmitting(false);
		}
	};

	if (submitted) {
		return (
			<AuthLayout
				title="Kiểm tra email của bạn"
				subtitle="Chúng tôi đã gửi link đặt lại mật khẩu"
			>
				<div className="text-center py-12">
					<div className="w-24 h-24 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
						<Mail className="w-12 h-12 text-green-600" />
					</div>
					<h3 className="text-2xl font-bold text-slate-900 mb-4">{message}</h3>
					<p className="text-slate-600 mb-8">
						Link sẽ hết hạn trong 1 giờ. Nếu bạn không thấy email, vui lòng kiểm
						tra thư rác.
					</p>
					<div className="space-y-4">
						<ActionButton
							onClick={() => {
								setSubmitted(false);
								setFormData({ email: "" });
							}}
							className="w-full"
						>
							Gửi lại
						</ActionButton>
						<ActionButton
							variant="outline"
							onClick={() => (window.location.href = "/login")}
							className="w-full"
						>
							Quay lại đăng nhập
						</ActionButton>
					</div>
				</div>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout
			title="Quên mật khẩu?"
			subtitle="Nhập email để nhận link đặt lại mật khẩu."
		>
			<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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

				<ActionButton
					type="submit"
					size="lg"
					className="w-full flex items-center justify-center !py-4"
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<>
							<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
							Đang gửi...
						</>
					) : (
						"Gửi link đặt lại"
					)}
				</ActionButton>
			</form>

			<div className="mt-12 pt-8 border-t border-slate-200 text-center space-y-4">
				<p className="text-sm text-slate-600">
					Quay lại{" "}
					<a
						href="/login"
						className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer transition-colors"
					>
						đăng nhập
					</a>
				</p>
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

export default ForgotPasswordPage;
