import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = 'Select date',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value || new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(viewDate);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const isDisabled = (day: number) => {
    const checkDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    if (minDate && checkDate < minDate) return true;
    if (maxDate && checkDate > maxDate) return true;
    return false;
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    return value.getDate() === day && 
           value.getMonth() === viewDate.getMonth() && 
           value.getFullYear() === viewDate.getFullYear();
  };

  const selectDate = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onChange?.(newDate);
    setIsOpen(false);
  };

  const goPrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1));
  const goNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1));

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full px-4 py-3
          bg-white border-2 border-[#263D5B] rounded-[12px]
          font-['Comfortaa', cursive] text-base
          text-left flex items-center gap-3
          hover:border-[#49B6E5]
          transition-colors
        "
      >
        <Calendar className="w-5 h-5 text-[#6B7280]" />
        <span className={value ? 'text-[#111827]' : 'text-[#6B7280] italic'}>
          {value ? value.toLocaleDateString('vi-VN') : placeholder}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-72 bg-white border-2 border-[#263D5B] rounded-[12px] shadow-[3px_3px_0px_#E5E1DC] p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={goPrevMonth} className="p-1 hover:bg-[#F8F6F3] rounded">
              <ChevronLeft className="w-5 h-5 text-[#263D5B]" />
            </button>
            <span className="font-['Comfortaa', cursive] text-[#263D5B]">
              {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button onClick={goNextMonth} className="p-1 hover:bg-[#F8F6F3] rounded">
              <ChevronRight className="w-5 h-5 text-[#263D5B]" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <span key={i} className="font-['Comfortaa', cursive] text-xs text-[#6B7280]">
                {day}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const disabled = isDisabled(day);
              const selected = isSelected(day);
              return (
                <button
                  key={day}
                  onClick={() => !disabled && selectDate(day)}
                  disabled={disabled}
                  className={`
                    p-2 rounded-[8px] font-['Comfortaa', cursive] text-sm
                    transition-colors
                    ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#F8F6F3] cursor-pointer'}
                    ${selected ? 'bg-[#49B6E5] text-white' : 'text-[#263D5B]'}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;