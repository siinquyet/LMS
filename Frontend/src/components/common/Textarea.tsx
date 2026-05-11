import type React from "react";

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	error?: string;
	helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
	label,
	error,
	helperText,
	className = "",
	...props
}) => {
	return (
		<div className="flex flex-col gap-2">
			{label && (
				<label className="font-semibold text-[#1C293C] text-[15px]">
					{label}
				</label>
			)}
			<textarea
				className={`
          w-full px-4 py-3
          text-[15px] font-['Inter']
          border-[3px] border-[#1C293C]
          bg-white
          outline-none
          transition-all duration-150
          resize-none
          focus:border-[#432DD7] focus:shadow-[4px_4px_0_#432DD7]
          placeholder:text-[#6B7280]
          disabled:border-[#E5E7EB] disabled:bg-[#F3F4F6] disabled:cursor-not-allowed
          ${error ? "border-[#DC2626] focus:border-[#DC2626] focus:shadow-[4px_4px_0_#DC2626]" : ""}
          ${className}
        `}
				{...props}
			/>
			{error && <span className="text-[#DC2626] text-[13px]">{error}</span>}
			{helperText && !error && (
				<span className="text-[#6B7280] text-[13px]">{helperText}</span>
			)}
		</div>
	);
};

export default Textarea;
