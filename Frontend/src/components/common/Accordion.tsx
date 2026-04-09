import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className = '',
}) => {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) => 
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => prev.includes(id) ? [] : [id]);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div 
            key={item.id}
            className="border-2 border-[#263D5B] rounded-[12px] overflow-hidden"
          >
            <button
              onClick={() => !item.disabled && toggle(item.id)}
              disabled={item.disabled}
              className={`
                w-full px-4 py-3
                flex items-center justify-between
                font-['Comfortaa', cursive]
                text-base
                bg-white
                transition-colors
                ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#F8F6F3]'}
              `}
            >
              <span className="text-[#263D5B]">{item.title}</span>
              <ChevronDown 
                className={`w-5 h-5 text-[#263D5B] transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              />
            </button>
            {isOpen && (
              <div className="px-4 py-3 bg-[#F8F6F3] border-t-2 border-dashed border-[#E5E1DC]">
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