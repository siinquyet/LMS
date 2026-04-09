import React from 'react';

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
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
          w-12 h-7
          border-2
          border-[#263D5B]
          rounded-full
          relative
          transition-all
          duration-150
          ${checked ? 'bg-[#49B6E5]' : 'bg-white'}
          ${!disabled && 'cursor-pointer'}
        `}
      >
        <div
          className={`
            absolute top-0.5
            w-5 h-5
            bg-[#263D5B]
            rounded-full
            transition-all
            duration-150
            ${checked ? 'left-6' : 'left-0.5'}
          `}
        />
      </div>
      {label && (
        <span className="font-['Comfortaa', cursive] text-[#263D5B] text-base">
          {label}
        </span>
      )}
    </label>
  );
};

export default Switch;