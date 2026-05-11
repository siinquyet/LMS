import { ChevronDown } from "lucide-react";
import type React from "react";
import { useState } from "react";

export interface AccordionItem {
	id: string;
	title: string;
	content: React.ReactNode;
	disabled?: boolean;
	icon?: React.ReactNode;
}

export interface AccordionProps {
	items: AccordionItem[];
	allowMultiple?: boolean;
	defaultOpen?: string[];
	className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
	items,
	allowMultiple = false,
	defaultOpen = [],
	className = "",
}) => {
	const [openIds, setOpenIds] = useState<string[]>(defaultOpen);

	const toggle = (id: string) => {
		if (allowMultiple) {
			setOpenIds((prev) =>
				prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
			);
		} else {
			setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
		if (
			(e.key === "Enter" || e.key === " ") &&
			!items.find((i) => i.id === id)?.disabled
		) {
			e.preventDefault();
			toggle(id);
		}
	};

	return (
		<div className={`space-y-2 ${className}`}>
			{items.map((item) => {
				const isOpen = openIds.includes(item.id);
				return (
					<div key={item.id} className="border-[3px] border-[#1C293C]">
						<button
							type="button"
							onClick={() => !item.disabled && toggle(item.id)}
							onKeyDown={(e) => handleKeyDown(e, item.id)}
							disabled={item.disabled}
							aria-expanded={isOpen}
							className={`
                w-full px-4 py-3
                flex items-center justify-between
                text-[15px] font-semibold text-[#1C293C]
                bg-white
                transition-colors
                ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[#FBFBF9]"}
              `}
						>
							<span className="flex items-center gap-2">
								{item.icon}
								{item.title}
							</span>
							<ChevronDown
								className={`w-5 h-5 text-[#1C293C] transition-transform ${isOpen ? "rotate-180" : ""}`}
							/>
						</button>
						{isOpen && (
							<div className="px-4 py-3 bg-[#FBFBF9] border-t-[3px] border-dashed border-[#1C293C]">
								{item.content}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default Accordion;
