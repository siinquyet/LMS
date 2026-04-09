import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onChange,
  label,
  disabled,
  className = '',
}) => {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div
        onClick={() => !disabled && onChange?.(!checked)}
        className={`
          w-6 h-6
          border-2
          border-[#263D5B]
          rounded-[6px]
          flex items-center justify-center
          transition-all
          duration-150
          ${checked ? 'bg-[#49B6E5] border-[#49B6E5]' : 'bg-white'}
          ${!disabled && 'cursor-pointer'}
        `}
      >
        {checked && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
      </div>
      {label && (
        <span className="font-['Comfortaa', cursive] text-[#263D5B] text-base">
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;