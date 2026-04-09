import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-[#263D5B]/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`
        relative bg-white
        border-2 border-[#263D5B]
        rounded-[16px]
        shadow-[4px_4px_0px_#E5E1DC]
        w-full max-w-lg mx-4
        max-h-[90vh] overflow-auto
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
        <div className="px-6 py-4">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t-2 border-dashed border-[#E5E1DC] flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;