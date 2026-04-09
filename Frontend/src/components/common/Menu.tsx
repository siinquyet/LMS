import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
}

export interface MenuProps {
  trigger: React.ReactNode;
  items: MenuItem[];
  align?: 'left' | 'right';
  className?: string;
}

export const Menu: React.FC<MenuProps> = ({
  trigger,
  items,
  align = 'left',
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <div className={`
          absolute z-50 mt-2
          min-w-[180px]
          bg-white border-2 border-[#263D5B] rounded-[12px]
          shadow-[3px_3px_0px_#E5E1DC]
          py-2
          ${align === 'right' ? 'right-0' : 'left-0'}
        `}>
          {items.map((item) => (
            item.divider ? (
              <div key={item.id} className="border-t border-dashed border-[#E5E1DC] my-2" />
            ) : (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                disabled={item.disabled}
                className={`
                  w-full px-4 py-2
                  flex items-center gap-3
                  font-['Comfortaa', cursive] text-[#263D5B] text-sm
                  text-left
                  transition-colors
                  ${item.disabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-[#F8F6F3]'
                  }
                `}
              >
                {item.icon && <span className="w-5">{item.icon}</span>}
                {item.label}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;