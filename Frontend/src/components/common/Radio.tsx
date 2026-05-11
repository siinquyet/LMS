import type React from "react";

export interface RadioProps {
	name: string;
	value: string;
	checked?: boolean;
	onChange?: (value: string) => void;
	label?: string;
	disabled?: boolean;
	className?: string;
}

export const Radio: React.FC<RadioProps> = ({
	name,
	value,
	checked = false,
	onChange,
	label,
	disabled,
	className = "",
}) => {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if ((e.key === "Enter" || e.key === " ") && !disabled) {
			e.preventDefault();
			onChange?.(value);
		}
	};

	return (
		<label
			className={`flex items-center gap-3 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
		>
			<div
				role="radio"
				aria-checked={checked}
				aria-disabled={disabled}
				tabIndex={disabled ? -1 : 0}
				onKeyDown={handleKeyDown}
				className={`
          w-6 h-6
          border-[3px] border-[#1C293C]
          flex items-center justify-center
          transition-all duration-150
          ${checked ? "bg-[#FDC800]" : "bg-white"}
        `}
			>
				{checked && <div className="w-3 h-3 bg-[#1C293C]" />}
			</div>
			<input
				type="radio"
				name={name}
				value={value}
				checked={checked}
				onChange={() => !disabled && onChange?.(value)}
				disabled={disabled}
				className="sr-only"
			/>
			{label && <span className="text-[#1C293C] text-[15px]">{label}</span>}
		</label>
	);
};

export default Radio;
