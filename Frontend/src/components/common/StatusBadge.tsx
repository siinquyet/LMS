interface StatusBadgeProps {
	status: "choXuLy" | "daGiaiQuyet" | "daDangKy";
	children?: React.ReactNode;
	className?: string;
}

const StatusBadge = ({
	status,
	children = status.charAt(0).toUpperCase() +
		status.slice(1).replace(/([A-Z])/g, " $1"),
	className = "",
}: StatusBadgeProps) => {
	const statusConfig = {
		choXuLy: {
			bg: "bg-amber-100 text-amber-800 ring-1 ring-amber-200/50",
			text: "Chờ xử lý",
		},
		daGiaiQuyet: {
			bg: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/50",
			text: "Đã giải quyết",
		},
		daDangKy: {
			bg: "bg-blue-100 text-blue-800 ring-1 ring-blue-200/50",
			text: "Đã đăng ký",
		},
	};

	const config = statusConfig[status];

	return (
		<span
			className={`
      inline-flex px-3 py-1 rounded-lg text-xs font-semibold shadow-sm border border-slate-200/60 hover:shadow-md active:scale-95 transition-all duration-300 ${config.bg} ${className}
    `}
		>
			{children || config.text}
		</span>
	);
};

export default StatusBadge;
