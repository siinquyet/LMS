import React from 'react';

export interface DataListItem {
  id: string;
  title: string;
  description?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export interface DataListProps {
  items: DataListItem[];
  onItemClick?: (item: DataListItem) => void;
  className?: string;
}

export const DataList: React.FC<DataListProps> = ({
  items,
  onItemClick,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onItemClick?.(item)}
          className={`
            flex items-center gap-4 p-4
            bg-white border-2 border-[#263D5B] rounded-[12px]
            shadow-[2px_2px_0px_#E5E1DC]
            transition-all duration-150
            ${onItemClick ? 'cursor-pointer hover:translate-x-[-2px] hover:shadow-[3px_3px_0px_#E5E1DC]' : ''}
          `}
        >
          {item.leftElement && (
            <div className="flex-shrink-0 text-[#263D5B]">
              {item.leftElement}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-['Comfortaa', cursive] text-[#263D5B] text-base truncate">
              {item.title}
            </h4>
            {item.description && (
              <p className="font-['Comfortaa', cursive] text-[#6B7280] text-sm truncate">
                {item.description}
              </p>
            )}
          </div>
          {item.rightElement && (
            <div className="flex-shrink-0 text-[#263D5B]">
              {item.rightElement}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DataList;