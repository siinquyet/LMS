import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-['Comfortaa', cursive] text-[#263D5B] text-base">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
            {icon}
          </div>
        )}
        <input
          className={`
            font-['Comfortaa', cursive]
            w-full
            px-4 py-3
            bg-white
            border-2
            border-[#263D5B]
            rounded-[12px]
            text-[#111827]
            text-base
            placeholder:text-[#6B7280]
            placeholder:italic
            outline-none
            transition-all
            duration-150
            focus:border-[#49B6E5]
            focus:shadow-[3px_3px_0px_#49B6E5]
            disabled:opacity-50
            disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-[#DC2626] focus:border-[#DC2626] focus:shadow-[3px_3px_0px_#DC2626]' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <span className="font-['Comfortaa', cursive] text-[#DC2626] text-sm">
          ✏️ {error}
        </span>
      )}
    </div>
  );
};

export default Input;