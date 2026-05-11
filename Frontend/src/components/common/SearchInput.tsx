import { Search, X } from "lucide-react";
import type React from "react";
import { useState } from "react";

export interface SearchInputProps {
	value?: string;
	onChange?: (value: string) => void;
	onSearch?: (value: string) => void;
	placeholder?: string;
	className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
	value = "",
	onChange,
	onSearch,
	placeholder = "Search...",
	className = "",
}) => {
	const [inputValue, setInputValue] = useState(value);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch?.(inputValue);
	};

	const handleClear = () => {
		setInputValue("");
		onChange?.("");
		onSearch?.("");
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
          border-[3px]
          border-[#1C293C]
          font-['Inter', sans-serif]
          text-[17px]
          text-[#1C293C]
          placeholder:text-[#6B7280]
          outline-none
          transition-all
          duration-100
          focus:border-[#432DD7]
          focus:shadow-[4px_4px_0_#432DD7]
        "
			/>
			<div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
				<Search className="w-5 h-5" />
			</div>
			{inputValue && (
				<button
					type="button"
					onClick={handleClear}
					className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#1C293C]"
				>
					<X className="w-5 h-5" />
				</button>
			)}
		</form>
	);
};

export default SearchInput;
