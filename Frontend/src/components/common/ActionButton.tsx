import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	variant?: "primary" | "secondary" | "outline";
	size?: "sm" | "md" | "lg";
	isLoading?: boolean;
	className?: string;
}

const ActionButton = ({
	children,
	variant = "primary",
	size = "md",
	isLoading = false,
	disabled = false,
	className = "",
	...props
}: ActionButtonProps) => {
	const baseClasses = `inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
		size === "sm"
			? "px-4 py-2 text-sm min-h-[36px]"
			: size === "lg"
				? "px-8 py-4 text-lg min-h-[52px]"
				: "px-6 py-3 min-h-[44px]"
	}`;

	const variantClasses = {
		primary:
			"bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 ease-in-out",
		secondary:
			"bg-slate-50/50 text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-300 shadow-sm hover:shadow-md active:scale-95 transition-all duration-300 ease-in-out",
		outline:
			"border-2 border-slate-200/60 text-slate-900 hover:border-slate-200/80 hover:bg-slate-50 focus-visible:ring-slate-300 shadow-sm hover:shadow-md active:scale-95 transition-all duration-300 ease-in-out",
	};

	return (
		<button
			{...props}
			disabled={disabled || isLoading}
			className={`${baseClasses} ${variantClasses[variant]} ${className}`}
		>
			{isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
			{children}
		</button>
	);
};

export default ActionButton;
