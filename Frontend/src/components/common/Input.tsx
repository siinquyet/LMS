import React, { ChangeEvent } from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconLeft?: React.ReactNode;
  onChange?: ((value: string) => void) | ((e: ChangeEvent<HTMLInputElement>) => void);
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  iconLeft,
  className = '',
  onChange,
  ...props
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    (onChange as (value: string) => void)(e.target.value);
  };

  const baseInput = `
    font-['Inter', sans-serif]
    w-full
    px-4
    py-3
    bg-white
    border-[3px]
    text-[17px]
    text-[#1C293C]
    placeholder:text-[#6B7280]
    placeholder:italic
    outline-none
    transition-all
    duration-100
  `;

  const stateStyles = error 
    ? 'border-[#DC2626] focus:border-[#DC2626] focus:shadow-[4px_4px_0_#DC2626]' 
    : 'border-[#1C293C] focus:border-[#432DD7] focus:shadow-[4px_4px_0_#432DD7]';

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-['Inter', sans-serif] font-semibold text-[#1C293C] text-base">
          {label}
        </label>
      )}
      <div className="relative">
        {(icon || iconLeft) && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">
            {iconLeft || icon}
          </div>
        )}
        <input
          className={`
            ${baseInput}
            ${stateStyles}
            ${(icon || iconLeft) ? 'pl-12' : ''}
            ${className}
          `}
          onChange={handleChange}
          {...props}
        />
      </div>
      {error && (
        <span className="font-['Inter', sans-serif] font-medium text-[#DC2626] text-sm">
          ✏️ {error}
        </span>
      )}
    </div>
  );
};

export default Input;