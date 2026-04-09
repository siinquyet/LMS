import React from 'react';

export interface RadioProps {
  name: string;
  value: string;
  checked?: boolean;
  onChange?: (value: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Radio: React.FC<RadioProps> = ({
  name,
  value,
  checked = false,
  onChange,
  label,
  disabled,
  className = '',
}) => {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div
        className={`
          w-6 h-6
          border-2
          border-[#263D5B]
          rounded-full
          flex items-center justify-center
          transition-all
          duration-150
          ${checked ? 'bg-[#49B6E5]' : 'bg-white'}
        `}
      >
        {checked && (
          <div className="w-3 h-3 bg-white rounded-full" />
        )}
      </div>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => !disabled && onChange?.(value)}
        disabled={disabled}
        className="sr-only"
      />
      {label && (
        <span className="font-['Comfortaa', cursive] text-[#263D5B] text-base">
          {label}
        </span>
      )}
    </label>
  );
};

export default Radio;