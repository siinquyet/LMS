import {
	Download,
	File,
	Link as LinkIcon,
	Video,
} from "lucide-react";

interface ResourceItemProps {
	name: string;
	type: "pdf" | "video" | "link";
	onAction: () => void;
	actionLabel?: string;
	className?: string;
}

const ResourceItem = ({
	name,
	type,
	onAction,
	actionLabel = type === "pdf" ? "Tải xuống" : type === "video" ? "Xem" : "Mở",
	className = "",
}: ResourceItemProps) => {
	const iconMap = {
		pdf: File,
		video: Video,
		link: LinkIcon,
	};

	const IconComponent = iconMap[type];

	return (
		<div
			className={`flex items-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:shadow-sm transition-all duration-200 group ${className}`}
		>
			<div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:from-blue-50 group-hover:to-indigo-50">
				<IconComponent className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors duration-200" />
			</div>
			<div className="flex-1 min-w-0">
				<p className="font-medium text-slate-900 truncate">{name}</p>
			</div>
			<button
				type="button"
				onClick={onAction}
				className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 flex items-center space-x-1 group-hover:shadow-sm"
			>
				<Download className="w-4 h-4" />
				<span>{actionLabel}</span>
			</button>
		</div>
	);
};

export default ResourceItem;
