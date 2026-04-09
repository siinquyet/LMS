import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md',
  footer,
  className = '',
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  const positionClasses = {
    left: 'left-0 right-auto',
    right: 'right-0 left-auto',
  };

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-[#263D5B]/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`
        absolute top-0 bottom-0
        ${sizes[size]}
        ${positionClasses[position]}
        w-full
        bg-white
        border-2 border-[#263D5B]
        shadow-[4px_4px_0px_#E5E1DC]
        flex flex-col
        transform transition-transform duration-300
        ${open ? 'translate-x-0' : position === 'right' ? 'translate-x-full' : '-translate-x-full'}
        ${className}
      `}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b-2 border-dashed border-[#E5E1DC]">
            <h3 className="font-['Comfortaa', cursive] text-xl text-[#263D5B]">
              {title}
            </h3>
            <button 
              onClick={onClose}
              className="p-1 text-[#263D5B] hover:text-[#DC2626] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t-2 border-dashed border-[#E5E1DC]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Drawer;