import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export interface SidebarItem {
	id: string;
	label: string;
	icon?: React.ReactNode;
	href?: string;
	onClick?: () => void;
	badge?: string | number;
	children?: SidebarItem[];
}

export interface SidebarProps {
	items: SidebarItem[];
	collapsed?: boolean;
	onToggle?: () => void;
	className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
	items,
	collapsed = false,
	onToggle,
	className = "",
}) => {
	const location = useLocation();
	const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
		new Set(),
	);

	const isActive = (href?: string) => href && location.pathname === href;

	const toggleChapter = (chapterId: string) => {
		setExpandedChapters((prev) => {
			const next = new Set(prev);
			if (next.has(chapterId)) {
				next.delete(chapterId);
			} else {
				next.add(chapterId);
			}
			return next;
		});
	};

	const isChapterExpanded = (chapterId: string) =>
		expandedChapters.has(chapterId);

	const renderItems = (items: SidebarItem[], depth = 0) => {
		return items.map((item) => {
			const active = isActive(item.href);
			const hasChildren = item.children && item.children.length > 0;
			const isExpanded = hasChildren && isChapterExpanded(item.id);

			return (
				<div key={item.id}>
					{hasChildren ? (
						<button
							type="button"
							onClick={() => toggleChapter(item.id)}
							className={`
                flex items-center gap-3 px-4 py-3 w-full
                text-[15px] font-semibold text-[#1C293C]
                bg-white border-l-[3px] border-transparent
                hover:bg-[#FBFBF9]
                ${depth > 0 ? "ml-4" : ""}
              `}
						>
							{item.icon && (
								<span className="w-5 flex-shrink-0">{item.icon}</span>
							)}
							{!collapsed && (
								<span className="flex-1 truncate">{item.label}</span>
							)}
							{!collapsed && (
								<ChevronDown
									className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
								/>
							)}
						</button>
					) : item.href ? (
						<Link
							to={item.href}
							className={`
                flex items-center gap-3 px-4 py-3
                text-[15px] font-semibold border-l-[3px]
                transition-all duration-150
                ${
									active
										? "bg-[#FDC800] text-[#1C293C] border-[#1C293C]"
										: "text-[#1C293C] border-transparent hover:bg-[#FBFBF9]"
								}
                ${depth > 0 ? "ml-4" : ""}
              `}
						>
							{item.icon && (
								<span className="w-5 flex-shrink-0">{item.icon}</span>
							)}
							{!collapsed && (
								<span className="flex-1 truncate">{item.label}</span>
							)}
							{!collapsed && item.badge && (
								<span className="px-2 py-0.5 bg-[#1C293C] text-white text-[11px] font-semibold border-[2px] border-[#1C293C]">
									{item.badge}
								</span>
							)}
						</Link>
					) : (
						<button
							type="button"
							onClick={item.onClick}
							className={`
                flex items-center gap-3 px-4 py-3 w-full
                text-[15px] font-semibold text-[#1C293C]
                bg-white border-l-[3px] border-transparent
                hover:bg-[#FBFBF9]
                ${depth > 0 ? "ml-4" : ""}
              `}
						>
							{item.icon && (
								<span className="w-5 flex-shrink-0">{item.icon}</span>
							)}
							{!collapsed && (
								<span className="flex-1 truncate">{item.label}</span>
							)}
							{!collapsed && item.badge && (
								<span className="px-2 py-0.5 bg-[#1C293C] text-white text-[11px] font-semibold border-[2px] border-[#1C293C]">
									{item.badge}
								</span>
							)}
						</button>
					)}
					{item.children && !collapsed && isExpanded && (
						<div className="overflow-hidden">
							{renderItems(item.children, depth + 1)}
						</div>
					)}
				</div>
			);
		});
	};

	return (
		<aside
			className={`
      bg-white border-r-[3px] border-[#1C293C]
      flex flex-col h-full
      transition-all duration-300
      ${collapsed ? "w-16" : "w-64"}
      ${className}
    `}
		>
			<div className="flex-1 py-4 overflow-y-auto min-h-0">
				{renderItems(items)}
			</div>
			{onToggle && (
				<button
					type="button"
					onClick={onToggle}
					className="p-4 border-t-[3px] border-dashed border-[#1C293C] flex justify-center shrink-0 hover:bg-[#FBFBF9]"
				>
					{collapsed ? (
						<ChevronRight className="w-5 h-5 text-[#1C293C]" />
					) : (
						<ChevronLeft className="w-5 h-5 text-[#1C293C]" />
					)}
				</button>
			)}
		</aside>
	);
};

export default Sidebar;
