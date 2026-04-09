import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { X as XIcon } from 'lucide-react';

export interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  onClose,
  className = '',
}) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const styles = {
    success: 'bg-[#ECFDF5] border-[#16A34A] text-[#16A34A]',
    error: 'bg-[#FEF2F2] border-[#DC2626] text-[#DC2626]',
    warning: 'bg-[#FFFBEB] border-[#D97706] text-[#D97706]',
    info: 'bg-[#E8F6FC] border-[#49B6E5] text-[#49B6E5]',
  };

  const bgStyles = {
    success: 'bg-[#ECFDF5]',
    error: 'bg-[#FEF2F2]',
    warning: 'bg-[#FFFBEB]',
    info: 'bg-[#E8F6FC]',
  };

  return (
    <div className={`
      flex gap-3 p-4
      border-2 border-l-4
      rounded-[12px]
      ${bgStyles[type]}
      ${className}
    `}>
      <div className={styles[type]}>
        {icons[type]}
      </div>
      <div className="flex-1">
        {title && (
          <h4 className="font-['Comfortaa', cursive] text-[#263D5B] font-semibold mb-1">
            {title}
          </h4>
        )}
        <div className="font-['Comfortaa', cursive] text-[#263D5B] text-sm">
          {children}
        </div>
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="text-[#6B7280] hover:text-[#263D5B]"
        >
          <XIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;