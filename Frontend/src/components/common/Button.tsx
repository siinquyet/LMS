import type React from "react";

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?:
		| "primary"
		| "secondary"
		| "danger"
		| "outline"
		| "ghost"
		| "success"
		| "warning"
		| "default";
	size?: "sm" | "md" | "lg";
	children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
	variant = "primary",
	size = "md",
	children,
	className = "",
	...props
}) => {
	const baseStyles = `
    font-['Inter', sans-serif]
    font-semibold
    border-[3px]
    border-[#1C293C]
    cursor-pointer
    transition-all
    duration-100
    ease-out
    relative
    inline-flex
    items-center
    justify-center
    gap-2
    whitespace-nowrap
    outline-none
  `;

	const variantStyles = {
		primary:
			"bg-[#FDC800] text-[#1C293C] shadow-[4px_4px_0_#1C293C] hover:shadow-[6px_6px_0_#1C293C] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
		secondary:
			"bg-[#432DD7] text-white shadow-[4px_4px_0_#1C293C] hover:shadow-[6px_6px_0_#1C293C] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
		danger:
			"bg-[#DC2626] text-white shadow-[4px_4px_0_#1C293C] hover:shadow-[6px_6px_0_#1C293C] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
		success:
			"bg-[#16A34A] text-white shadow-[4px_4px_0_#1C293C] hover:shadow-[6px_6px_0_#1C293C] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
		warning:
			"bg-[#D97706] text-white shadow-[4px_4px_0_#1C293C] hover:shadow-[6px_6px_0_#1C293C] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
		outline:
			"bg-transparent text-[#1C293C] border-dashed hover:bg-[#FDC800]/20",
		ghost:
			"bg-transparent text-[#1C293C] border-transparent hover:bg-[#E5E7EB]",
		default:
			"bg-white text-[#1C293C] shadow-[4px_4px_0_#1C293C] hover:shadow-[6px_6px_0_#1C293C] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
	};

	const sizeStyles = {
		sm: "px-4 py-2 text-[13px] shadow-[2px_2px_0_#1C293C] hover:shadow-[4px_4px_0_#1C293C]",
		md: "px-6 py-3 text-[15px]",
		lg: "px-8 py-4 text-[17px] shadow-[6px_6px_0_#1C293C] hover:shadow-[8px_8px_0_#1C293C]",
	};

	return (
		<button
			className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
};

export default Button;
