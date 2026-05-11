import type React from "react";

interface LoaderProps {
	size?: "sm" | "md" | "lg";
	className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
	size = "md",
	className = "",
}) => {
	const sizeClasses = {
		sm: "w-4 h-4 border-[2px]",
		md: "w-8 h-8 border-[3px]",
		lg: "w-12 h-12 border-[4px]",
	};

	return (
		<div className={`flex items-center justify-center p-8 ${className}`}>
			<div
				className={`${sizeClasses[size]} border-[#E5E7EB] border-t-[#FDC800] animate-spin`}
			/>
		</div>
	);
};

export default Loader;
