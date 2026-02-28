interface AvatarProps {
	src?: string;
	name: string;
	size?: "sm" | "md" | "lg";
	className?: string;
}

const Avatar = ({ src, name, size = "md", className = "" }: AvatarProps) => {
	const sizeClasses = {
		sm: "w-8 h-8 text-sm",
		md: "w-10 h-10 text-sm",
		lg: "w-12 h-12 text-base",
	};

	const initials = name
		.split(" ")
		.map((n) => n[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();

	return (
		<div
			className={`
      relative rounded-full bg-gradient-to-r flex items-center justify-center font-semibold uppercase overflow-hidden shadow-sm border-2 border-slate-200/50
      ${sizeClasses[size]} ${className}
    `}
		>
			{src ? (
				<img src={src} alt={name} className="w-full h-full object-cover" />
			) : (
				<span className="text-slate-100 font-semibold leading-none">
					{initials}
				</span>
			)}
		</div>
	);
};

export default Avatar;
