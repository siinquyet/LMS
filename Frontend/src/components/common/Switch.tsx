import type React from "react";

export interface SwitchProps {
	checked?: boolean;
	onChange?: (checked: boolean) => void;
	label?: string;
	disabled?: boolean;
	size?: "sm" | "md" | "lg";
	className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
	checked = false,
	onChange,
	label,
	disabled,
	size = "md",
	className = "",
}) => {
	const sizes = {
		sm: {
			container: "w-10 h-5",
			knob: "w-4 h-4",
			translate: checked ? "left-5" : "left-0.5",
			border: "border-[2px]",
		},
		md: {
			container: "w-12 h-7",
			knob: "w-5 h-5",
			translate: checked ? "left-6" : "left-0.5",
			border: "border-[3px]",
		},
		lg: {
			container: "w-14 h-9",
			knob: "w-7 h-7",
			translate: checked ? "left-7" : "left-0.5",
			border: "border-[3px]",
		},
	};

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
				role="switch"
				aria-checked={checked}
				aria-disabled={disabled}
				tabIndex={disabled ? -1 : 0}
				onClick={() => !disabled && onChange?.(!checked)}
				onKeyDown={handleKeyDown}
				className={`
          ${sizes[size].container}
          ${sizes[size].border} border-[#1C293C]
          relative
          transition-all duration-150
          ${checked ? "bg-[#FDC800]" : "bg-white"}
          ${!disabled && "cursor-pointer"}
        `}
			>
				<div
					className={`
            absolute top-0.5
            ${sizes[size].knob}
            bg-[#1C293C]
            transition-all duration-150
            ${sizes[size].translate}
          `}
				/>
			</div>
			{label && <span className="text-[#1C293C] text-[15px]">{label}</span>}
		</label>
	);
};

export default Switch;
