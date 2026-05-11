import type React from "react";

export interface ProgressProps {
	value: number;
	max?: number;
	label?: string;
	showValue?: boolean;
	variant?: "primary" | "success" | "warning" | "danger";
	size?: "sm" | "md" | "lg";
	className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
	value,
	max = 100,
	label,
	showValue = false,
	variant = "primary",
	size = "md",
	className = "",
}) => {
	const percentage = Math.min(100, Math.max(0, (value / max) * 100));

	const variantStyles = {
		primary: "bg-[#FDC800]",
		success: "bg-[#16A34A]",
		warning: "bg-[#D97706]",
		danger: "bg-[#DC2626]",
	};

	const sizeStyles = {
		sm: "h-2",
		md: "h-4",
		lg: "h-6",
	};

	return (
		<div className={className}>
			{(label || showValue) && (
				<div className="flex justify-between items-center mb-2">
					{label && (
						<span className="text-[#1C293C] text-[15px] font-semibold">
							{label}
						</span>
					)}
					{showValue && (
						<span className="text-[#1C293C] text-[15px] font-semibold">
							{Math.round(percentage)}%
						</span>
					)}
				</div>
			)}
			<div
				className={`w-full ${sizeStyles[size]} bg-white border-[3px] border-[#1C293C] overflow-hidden`}
			>
				<div
					className={`h-full transition-all duration-300 ${variantStyles[variant]}`}
					style={{ width: `${percentage}%` }}
				/>
			</div>
		</div>
	);
};

export default Progress;
