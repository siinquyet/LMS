import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, X } from 'lucide-react';

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  action: () => void;
  group?: string;
}

export interface CommandPaletteProps {
  items: CommandItem[];
  open: boolean;
  onClose: () => void;
  className?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  items,
  open,
  onClose,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.description?.toLowerCase().includes(query.toLowerCase())
  );

  const groupedItems = filteredItems.reduce((acc, item) => {
    const group = item.group || 'General';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filteredItems.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        filteredItems[selectedIndex]?.action();
        onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, filteredItems, selectedIndex, onClose]);

  if (!open) return null;

  let flatIndex = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="absolute inset-0 bg-[#263D5B]/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`
        relative w-full max-w-lg
        bg-white border-2 border-[#263D5B]
        rounded-[16px] shadow-[4px_4px_0px_#E5E1DC]
        overflow-hidden
        ${className}
      `}>
        <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-dashed border-[#E5E1DC]">
          <Search className="w-5 h-5 text-[#6B7280]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search commands..."
            className="flex-1 bg-transparent outline-none font-['Comfortaa', cursive] text-[#263D5B]"
          />
          <div className="flex items-center gap-1 text-[#6B7280]">
            <Command className="w-4 h-4" />
            <span className="text-xs">K</span>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {Object.keys(groupedItems).length === 0 ? (
            <div className="px-4 py-8 text-center">
              <span className="font-['Comfortaa', cursive] text-[#6B7280]">
                No results found
              </span>
            </div>
          ) : (
            Object.entries(groupedItems).map(([group, items]) => (
              <div key={group}>
                <div className="px-3 py-2 font-['Comfortaa', cursive] text-xs text-[#6B7280] uppercase">
                  {group}
                </div>
                {items.map((item) => {
                  const currentIndex = flatIndex++;
                  const isSelected = currentIndex === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.action();
                        onClose();
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-[8px]
                        font-['Comfortaa', cursive] text-sm text-left
                        transition-colors
                        ${isSelected ? 'bg-[#E8F6FC]' : 'hover:bg-[#F8F6F3]'}
                      `}
                    >
                      {item.icon && <span className="text-[#263D5B]">{item.icon}</span>}
                      <div className="flex-1">
                        <span className="text-[#263D5B]">{item.label}</span>
                        {item.description && (
                          <span className="block text-xs text-[#6B7280]">{item.description}</span>
                        )}
                      </div>
                      {item.shortcut && (
                        <div className="flex gap-1">
                          {item.shortcut.map((key, i) => (
                            <kbd key={i} className="px-1.5 py-0.5 bg-[#F8F6F3] border border-[#E5E1DC] rounded text-xs">
                              {key}
                            </kbd>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;