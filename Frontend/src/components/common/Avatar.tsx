import type React from "react";

export interface AvatarProps {
	src?: string;
	alt?: string;
	name?: string;
	size?: "sm" | "md" | "lg" | "xl";
	className?: string;
	onClick?: () => void;
	onChange?: (file: File) => void;
	interactive?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
	src,
	alt = "Avatar",
	name,
	size = "md",
	className = "",
	onClick,
	onChange,
	interactive,
}) => {
	const sizeStyles = {
		sm: "w-8 h-8 text-[11px] border-[2px]",
		md: "w-12 h-12 text-[13px] border-[3px]",
		lg: "w-16 h-16 text-[15px] border-[3px]",
		xl: "w-24 h-24 text-[21px] border-[4px]",
	};

	const getInitials = (name?: string) => {
		if (!name || typeof name !== "string") return "?";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && onChange) {
			onChange(file);
		}
	};

	const isInteractive = onClick || onChange || interactive;

	const baseStyles = `
    relative
    overflow-hidden
    bg-[#FBFBF9]
    flex items-center justify-center
    font-semibold
    text-[#1C293C]
    shrink-0
    ${isInteractive ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
  `;

	const imageStyles = `
    w-full h-full object-cover
  `;

	const initialsStyles = `
    w-full h-full
    flex items-center justify-center
    bg-[#FDC800]
    font-semibold
    text-[#1C293C]
  `;

	if (onChange) {
		return (
			<label
				className={`${sizeStyles[size]} ${baseStyles} cursor-pointer group`}
			>
				<input
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					className="hidden"
				/>
				{src ? (
					<img src={src} alt={alt} className={imageStyles} />
				) : (
					<div className={`${initialsStyles} border-[3px] border-[#1C293C]`}>
						{getInitials(name)}
					</div>
				)}
				<div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
					<span className="text-white text-[11px] font-semibold">Đổi</span>
				</div>
			</label>
		);
	}

	return (
		<div
			role={isInteractive ? "button" : undefined}
			tabIndex={isInteractive ? 0 : undefined}
			onClick={onClick}
			onKeyDown={(e) => {
				if (isInteractive && (e.key === "Enter" || e.key === " ")) {
					onClick?.();
				}
			}}
			className={`${sizeStyles[size]} ${baseStyles} ${className}`}
		>
			{src ? (
				<img src={src} alt={alt} className={imageStyles} />
			) : (
				<div className={`${initialsStyles} border-[3px] border-[#1C293C]`}>
					{getInitials(name)}
				</div>
			)}
		</div>
	);
};

export default Avatar;
