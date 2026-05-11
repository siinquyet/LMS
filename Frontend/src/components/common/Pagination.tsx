import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

export interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	maxVisible?: number;
	className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	totalPages,
	onPageChange,
	maxVisible = 5,
	className = "",
}) => {
	const getVisiblePages = () => {
		const pages: (number | string)[] = [];
		const half = Math.floor(maxVisible / 2);
		let start = Math.max(1, currentPage - half);
		const end = Math.min(totalPages, start + maxVisible - 1);

		if (end - start < maxVisible - 1) {
			start = Math.max(1, end - maxVisible + 1);
		}

		if (start > 1) {
			pages.push(1);
			if (start > 2) pages.push("...");
		}

		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		if (end < totalPages) {
			if (end < totalPages - 1) pages.push("...");
			pages.push(totalPages);
		}

		return pages;
	};

	const pages = getVisiblePages();

	if (totalPages <= 1) return null;

	return (
		<div className={`flex items-center gap-2 ${className}`}>
			<button
				type="button"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className={`
          w-10 h-10
          border-[3px] border-[#1C293C] shadow-[2px_2px_0_#1C293C]
          text-[15px] font-semibold
          transition-all duration-150
          ${
						currentPage === 1
							? "opacity-50 cursor-not-allowed bg-white"
							: "bg-white hover:shadow-[4px_4px_0_#1C293C] hover:-translate-x-[-1px] hover:-translate-y-[-1px] cursor-pointer"
					}
        `}
			>
				<ChevronLeft className="w-5 h-5 text-[#1C293C] mx-auto" />
			</button>

			{pages.map((page, index) => (
				<React.Fragment key={`${page}-${index}`}>
					{page === "..." ? (
						<span className="w-10 h-10 flex items-center justify-center text-[#6B7280] text-[15px]">
							...
						</span>
					) : (
						<button
							type="button"
							onClick={() => onPageChange(page as number)}
							className={`
                w-10 h-10
                border-[3px] border-[#1C293C] shadow-[2px_2px_0_#1C293C]
                text-[15px] font-semibold
                transition-all duration-150
                ${
									currentPage === page
										? "bg-[#FDC800] text-[#1C293C]"
										: "bg-white text-[#1C293C] hover:shadow-[4px_4px_0_#1C293C] hover:-translate-x-[-1px] hover:-translate-y-[-1px] cursor-pointer"
								}
              `}
						>
							{page}
						</button>
					)}
				</React.Fragment>
			))}

			<button
				type="button"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className={`
          w-10 h-10
          border-[3px] border-[#1C293C] shadow-[2px_2px_0_#1C293C]
          text-[15px] font-semibold
          transition-all duration-150
          ${
						currentPage === totalPages
							? "opacity-50 cursor-not-allowed bg-white"
							: "bg-white hover:shadow-[4px_4px_0_#1C293C] hover:-translate-x-[-1px] hover:-translate-y-[-1px] cursor-pointer"
					}
        `}
			>
				<ChevronRight className="w-5 h-5 text-[#1C293C] mx-auto" />
			</button>
		</div>
	);
};

export default Pagination;
