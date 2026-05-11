import { FileQuestion } from "lucide-react";
import type React from "react";
import { Button } from "./Button";

export interface EmptyStateProps {
	icon?: React.ReactNode;
	title: string;
	description?: string;
	action?: {
		label: string;
		onClick: () => void;
	};
	className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
	icon,
	title,
	description,
	action,
	className = "",
}) => {
	return (
		<div
			className={`
      flex flex-col items-center justify-center
      py-12 px-4
      border-[3px] border-dashed border-[#1C293C]
      ${className}
    `}
		>
			<div className="w-16 h-16 mb-4 flex items-center justify-center bg-[#FDC800]/20 border-[3px] border-[#1C293C]">
				{icon || <FileQuestion className="w-8 h-8 text-[#1C293C]" />}
			</div>
			<h3 className="font-['Inter', sans-serif] font-bold text-[21px] text-[#1C293C] mb-2">
				{title}
			</h3>
			{description && (
				<p className="font-['Inter', sans-serif] text-[15px] text-[#6B7280] text-center mb-4 max-w-sm">
					{description}
				</p>
			)}
			{action && (
				<Button variant="primary" onClick={action.onClick}>
					{action.label}
				</Button>
			)}
		</div>
	);
};

export default EmptyState;
