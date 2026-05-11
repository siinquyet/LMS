import type React from "react";

export interface SkeletonProps {
	width?: string | number;
	height?: string | number;
	variant?: "text" | "square" | "rectangular";
	className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
	width,
	height,
	variant = "text",
	className = "",
}) => {
	const variantStyles = {
		text: "",
		square: "",
		rectangular: "",
	};

	return (
		<div
			className={`
        bg-[#FBFBF9]
        border-[2px] border-[#E5E7EB]
        animate-pulse
        ${variantStyles[variant]}
        ${className}
      `}
			style={{
				width: typeof width === "number" ? `${width}px` : width,
				height: typeof height === "number" ? `${height}px` : height,
			}}
		/>
	);
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
	lines = 3,
	className = "",
}) => {
	return (
		<div className={`space-y-3 ${className}`}>
			{Array.from({ length: lines }).map((_, i) => (
				<Skeleton
					key={i}
					width={i === lines - 1 ? "60%" : "100%"}
					height={16}
					variant="text"
				/>
			))}
		</div>
	);
};

export const SkeletonCard: React.FC<{ className?: string }> = ({
	className = "",
}) => {
	return (
		<div
			className={`p-6 bg-white border-[3px] border-[#1C293C] shadow-[6px_6px_0_#1C293C] ${className}`}
		>
			<div className="flex gap-4">
				<Skeleton width={80} height={60} variant="rectangular" />
				<div className="flex-1 space-y-2">
					<Skeleton width="70%" height={16} variant="text" />
					<Skeleton width="40%" height={14} variant="text" />
				</div>
			</div>
		</div>
	);
};

export default Skeleton;
