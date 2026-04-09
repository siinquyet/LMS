import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Search...',
  className = '',
}) => {
  const [inputValue, setInputValue] = useState(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(inputValue);
  };

  const handleClear = () => {
    setInputValue('');
    onChange?.('');
    onSearch?.('');
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onChange?.(e.target.value);
        }}
        placeholder={placeholder}
        className="
          w-full
          px-4 py-3 pl-11
          bg-white
          border-2
          border-[#263D5B]
          rounded-[12px]
          font-['Comfortaa', cursive]
          text-base
          text-[#111827]
          placeholder:text-[#6B7280]
          placeholder:italic
          outline-none
          transition-all
          duration-150
          focus:border-[#49B6E5]
          focus:shadow-[3px_3px_0px_#49B6E5]
        "
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
        <Search className="w-5 h-5" />
      </div>
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#263D5B]"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </form>
  );
};

export default SearchInput;