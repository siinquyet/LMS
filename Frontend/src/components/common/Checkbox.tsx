import { Check } from "lucide-react";
import type React from "react";

export interface CheckboxProps {
	checked?: boolean;
	onChange?: (checked: boolean) => void;
	label?: string;
	disabled?: boolean;
	className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
	checked = false,
	onChange,
	label,
	disabled,
	className = "",
}) => {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if ((e.key === "Enter" || e.key === " ") && !disabled) {
			e.preventDefault();
			onChange?.(!checked);
		}
	};

	return (
		<label
			className={`flex items-center gap-3 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
		>
			<div
				role="checkbox"
				aria-checked={checked}
				aria-disabled={disabled}
				tabIndex={disabled ? -1 : 0}
				onClick={() => !disabled && onChange?.(!checked)}
				onKeyDown={handleKeyDown}
				className={`
          w-6 h-6
          border-[3px] border-[#1C293C]
          flex items-center justify-center
          transition-all duration-150
          ${checked ? "bg-[#FDC800]" : "bg-white"}
          ${!disabled && "cursor-pointer"}
        `}
			>
				{checked && (
					<Check className="w-4 h-4 text-[#1C293C]" strokeWidth={3} />
				)}
			</div>
			{label && <span className="text-[#1C293C] text-[15px]">{label}</span>}
		</label>
	);
};

export default Checkbox;
