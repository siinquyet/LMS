import React from 'react';

export interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  variant = 'default',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const variantStyles = {
    default: 'bg-[#49B6E5]',
    success: 'bg-[#16A34A]',
    warning: 'bg-[#D97706]',
    danger: 'bg-[#DC2626]',
  };

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="font-['Comfortaa', cursive] text-[#263D5B] text-sm">
              {label}
            </span>
          )}
          {showValue && (
            <span className="font-['Comfortaa', cursive] text-[#263D5B] text-sm">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className="w-full h-4 bg-white border-2 border-[#263D5B] rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${variantStyles[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Progress;