import type React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "default";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
	children,
	variant = "primary",
	size = "md",
	className = "",
}) => {
	const variantStyles = {
		primary: "bg-[#FDC800] text-[#1C293C] border-[3px] border-[#1C293C]",
		secondary: "bg-[#432DD7] text-white border-[3px] border-[#1C293C]",
		success: "bg-[#16A34A] text-white border-[3px] border-[#1C293C]",
		warning: "bg-[#D97706] text-white border-[3px] border-[#1C293C]",
		danger: "bg-[#DC2626] text-white border-[3px] border-[#1C293C]",
		default: "bg-white text-[#1C293C] border-[3px] border-[#1C293C]",
	};

	const sizeStyles = {
		sm: "px-2 py-0.5 text-[11px]",
		md: "px-3 py-1 text-[13px]",
		lg: "px-4 py-1.5 text-[15px]",
	};

	return (
		<span
			className={`
        inline-flex
        items-center
        font-semibold
        uppercase
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
		>
			{children}
		</span>
	);
};

export default Badge;
