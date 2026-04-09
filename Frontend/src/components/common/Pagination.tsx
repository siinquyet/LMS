import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  className = '',
}) => {
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getVisiblePages();

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          p-2 border-2 border-[#263D5B] rounded-[8px]
          font-['Comfortaa', cursive] text-lg
          transition-all duration-150
          ${currentPage === 1 
            ? 'opacity-50 cursor-not-allowed bg-white' 
            : 'bg-white hover:bg-[#F8F6F3] cursor-pointer'
          }
        `}
      >
        <ChevronLeft className="w-5 h-5 text-[#263D5B]" />
      </button>

      {pages.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="font-['Comfortaa', cursive] text-[#6B7280] px-2">
              ...
            </span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={`
                w-10 h-10
                border-2 border-[#263D5B] rounded-[8px]
                font-['Comfortaa', cursive] text-base
                transition-all duration-150
                ${currentPage === page 
                  ? 'bg-[#49B6E5] text-white' 
                  : 'bg-white text-[#263D5B] hover:bg-[#F8F6F3] cursor-pointer'
                }
              `}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          p-2 border-2 border-[#263D5B] rounded-[8px]
          font-['Comfortaa', cursive] text-lg
          transition-all duration-150
          ${currentPage === totalPages 
            ? 'opacity-50 cursor-not-allowed bg-white' 
            : 'bg-white hover:bg-[#F8F6F3] cursor-pointer'
          }
        `}
      >
        <ChevronRight className="w-5 h-5 text-[#263D5B]" />
      </button>
    </div>
  );
};

export default Pagination;