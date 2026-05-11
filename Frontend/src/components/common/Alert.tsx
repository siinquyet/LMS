import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import type React from "react";

export interface AlertProps {
	type?: "success" | "error" | "warning" | "info";
	title?: string;
	children: React.ReactNode;
	onClose?: () => void;
	className?: string;
}

export const Alert: React.FC<AlertProps> = ({
	type = "info",
	title,
	children,
	onClose,
	className = "",
}) => {
	const icons = {
		success: <CheckCircle className="w-5 h-5" />,
		error: <AlertCircle className="w-5 h-5" />,
		warning: <AlertTriangle className="w-5 h-5" />,
		info: <Info className="w-5 h-5" />,
	};

	const styles = {
		success: "border-[#16A34A] text-[#16A34A]",
		error: "border-[#DC2626] text-[#DC2626]",
		warning: "border-[#D97706] text-[#D97706]",
		info: "border-[#432DD7] text-[#432DD7]",
	};

	const bgStyles = {
		success: "bg-[#ECFDF5]",
		error: "bg-[#FEF2F2]",
		warning: "bg-[#FFFBEB]",
		info: "bg-[#E8F6FC]",
	};

	return (
		<div
			className={`
      flex gap-3 p-4
      border-[3px] border-l-[12px]
      ${bgStyles[type]}
      ${className}
    `}
		>
			<div className={styles[type]}>{icons[type]}</div>
			<div className="flex-1">
				{title && (
					<h4 className="text-[15px] font-bold text-[#1C293C] mb-1">{title}</h4>
				)}
				<div className="text-[15px] text-[#1C293C]">{children}</div>
			</div>
			{onClose && (
				<button
					type="button"
					onClick={onClose}
					className="text-[#6B7280] hover:text-[#DC2626]"
				>
					<X className="w-4 h-4" />
				</button>
			)}
		</div>
	);
};

export default Alert;
