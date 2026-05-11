import type React from "react";
import { useEffect, useRef, useState } from "react";

export interface TooltipProps {
	content: string;
	children: React.ReactNode;
	position?: "top" | "bottom" | "left" | "right";
	className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
	content,
	children,
	position = "top",
	className = "",
}) => {
	const [visible, setVisible] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const positions = {
		top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
		bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
		left: "right-full top-1/2 -translate-y-1/2 mr-2",
		right: "left-full top-1/2 -translate-y-1/2 ml-2",
	};

	return (
		<div ref={ref} className="relative inline-block">
			<div
				onMouseEnter={() => setVisible(true)}
				onMouseLeave={() => setVisible(false)}
				onFocus={() => setVisible(true)}
				onBlur={() => setVisible(false)}
				className={className}
			>
				{children}
			</div>
			{visible && (
				<div
					role="tooltip"
					className={`
          absolute z-50
          px-3 py-2
          bg-[#1C293C] text-white
          border-[3px] border-[#1C293C]
          shadow-[4px_4px_0_#1C293C]
          text-[13px] font-['Inter'] font-semibold
          whitespace-nowrap
          pointer-events-none
          ${positions[position]}
        `}
				>
					{content}
				</div>
			)}
		</div>
	);
};

export default Tooltip;
