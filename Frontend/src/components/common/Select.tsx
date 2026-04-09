import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  error,
  disabled,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="font-['Comfortaa', cursive] text-[#263D5B] text-base">
          {label}
        </label>
      )}
      <div ref={ref} className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-4 py-3
            bg-white
            border-2
            border-[#263D5B]
            rounded-[12px]
            font-['Comfortaa', cursive]
            text-base
            text-left
            flex items-center justify-between
            transition-all
            duration-150
            ${error ? 'border-[#DC2626]' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[#49B6E5]'}
          `}
        >
          <span className={selected ? 'text-[#111827]' : 'text-[#6B7280] italic'}>
            {selected?.label || placeholder}
          </span>
          <ChevronDown className={`w-5 h-5 text-[#263D5B] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-[100] w-full mt-2 bg-white border-2 border-[#263D5B] rounded-[12px] shadow-[3px_3px_0px_#E5E1DC] max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                onClick={() => {
                  if (!option.disabled) {
                    onChange?.(option.value);
                    setIsOpen(false);
                  }
                }}
                className={`
                  w-full px-4 py-3 text-left
                  font-['Comfortaa', cursive]
                  text-base
                  border-b
                  border-dashed
                  border-[#E5E1DC]
                  last:border-b-0
                  transition-colors
                  ${option.value === value ? 'bg-[#E8F6FC] text-[#49B6E5]' : 'text-[#111827] hover:bg-[#F8F6F3]'}
                  ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && (
        <span className="font-['Comfortaa', cursive] text-[#DC2626] text-sm">
          ✏️ {error}
        </span>
      )}
    </div>
  );
};

export default Select;