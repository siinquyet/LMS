import { ChevronDown } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

export interface DropdownOption {
	value: string;
	label: string;
	icon?: React.ReactNode;
	disabled?: boolean;
}

export interface DropdownProps {
	options: DropdownOption[];
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	label?: string;
	disabled?: boolean;
	className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
	options,
	value,
	onChange,
	placeholder = "Chọn...",
	label,
	disabled,
	className = "",
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const selected = options.find((opt) => opt.value === value);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			setIsOpen(!isOpen);
		}
		if (e.key === "Escape") {
			setIsOpen(false);
		}
	};

	return (
		<div className={`flex flex-col gap-2 ${className}`}>
			{label && (
				<label className="font-semibold text-[#1C293C] text-[15px]">
					{label}
				</label>
			)}
			<div ref={ref} className="relative">
				<div
					role="combobox"
					aria-expanded={isOpen}
					aria-haspopup="listbox"
					tabIndex={disabled ? -1 : 0}
					onClick={() => !disabled && setIsOpen(!isOpen)}
					onKeyDown={handleKeyDown}
					className={`
            w-full px-4 py-3
            bg-white border-[3px] border-[#1C293C]
            text-[15px] font-['Inter']
            text-left flex items-center justify-between
            transition-all duration-150
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-[#432DD7]"}
          `}
				>
					<span
						className={`flex items-center gap-2 ${selected ? "text-[#1C293C]" : "text-[#6B7280]"}`}
					>
						{selected?.icon}
						{selected?.label || placeholder}
					</span>
					<ChevronDown
						className={`w-5 h-5 text-[#1C293C] transition-transform ${isOpen ? "rotate-180" : ""}`}
					/>
				</div>

				{isOpen && (
					<div
						role="listbox"
						className="absolute z-[100] w-full mt-2 bg-white border-[3px] border-[#1C293C] shadow-[6px_6px_0_#1C293C]"
					>
						{options.map((option) => (
							<div
								key={option.value}
								role="option"
								aria-selected={option.value === value}
								aria-disabled={option.disabled}
								onClick={() => {
									if (!option.disabled) {
										onChange?.(option.value);
										setIsOpen(false);
									}
								}}
								className={`
                  w-full px-4 py-3 text-left
                  text-[15px] font-['Inter']
                  border-b-[3px] border-dashed border-[#1C293C]
                  last:border-b-0
                  transition-colors flex items-center gap-2
                  ${option.value === value ? "bg-[#FDC800] text-[#1C293C] font-semibold" : "text-[#1C293C] hover:bg-[#FBFBF9]"}
                  ${option.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
							>
								{option.icon}
								{option.label}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Dropdown;
