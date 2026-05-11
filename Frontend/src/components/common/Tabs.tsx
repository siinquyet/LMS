import type React from "react";
import { useState } from "react";

export interface TabItem {
	id: string;
	label: string;
	content: React.ReactNode;
	disabled?: boolean;
	icon?: React.ReactNode;
}

export interface TabsProps {
	tabs: TabItem[];
	defaultTab?: string;
	onChange?: (tabId: string) => void;
	variant?: "default" | "pills";
	className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
	tabs,
	defaultTab,
	onChange,
	variant = "default",
	className = "",
}) => {
	const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

	const handleTabClick = (tabId: string) => {
		setActiveTab(tabId);
		onChange?.(tabId);
	};

	const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

	const tabBaseStyles =
		variant === "pills"
			? "px-4 py-2 text-[15px] font-semibold border-[3px] transition-all duration-150"
			: "px-4 py-2 text-[15px] font-semibold border-[3px] border-b-0 transition-all duration-150";

	return (
		<div className={className}>
			<div
				className={`flex flex-wrap gap-2 ${
					variant === "default" ? "border-b-[3px] border-[#1C293C] pb-0" : ""
				}`}
				role="tablist"
			>
				{tabs.map((tab) => (
					<button
						key={tab.id}
						role="tab"
						aria-selected={activeTab === tab.id}
						aria-disabled={tab.disabled}
						onClick={() => !tab.disabled && handleTabClick(tab.id)}
						disabled={tab.disabled}
						className={`
              ${tabBaseStyles}
              ${
								activeTab === tab.id
									? variant === "pills"
										? "bg-[#FDC800] text-[#1C293C] border-[#1C293C]"
										: "bg-[#FDC800] text-[#1C293C] border-[#1C293C]"
									: variant === "pills"
										? "bg-white text-[#1C293C] border-[#1C293C] hover:bg-[#FBFBF9]"
										: "bg-white text-[#1C293C] border-[#1C293C] border-b-[3px] hover:bg-[#FBFBF9]"
							}
              ${tab.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
					>
						{tab.icon && (
							<span className="flex items-center gap-2">{tab.icon}</span>
						)}
						{tab.label}
					</button>
				))}
			</div>
			<div role="tabpanel" className="mt-4">
				{activeContent}
			</div>
		</div>
	);
};

export default Tabs;
