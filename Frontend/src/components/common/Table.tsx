import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface TableColumn<T = unknown> {
  key: string;
  title: string;
  render?: (value: unknown, record: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface TableProps<T = unknown> {
  columns: TableColumn<T>[];
  data: T[];
  keyField?: keyof T;
  onRowClick?: (record: T) => void;
  emptyText?: string;
  className?: string;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  keyField = 'id' as keyof T,
  onRowClick,
  emptyText = 'No data',
  className = '',
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return prev.direction === 'asc' ? { key, direction: 'desc' } : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal === bVal) return 0;
      const cmp = aVal < bVal ? -1 : 1;
      return sortConfig.direction === 'asc' ? cmp : -cmp;
    });
  }, [data, sortConfig]);

  return (
    <div className={`overflow-hidden border-2 border-[#263D5B] rounded-[12px] ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F8F6F3] border-b-2 border-dashed border-[#E5E1DC]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`
                    px-4 py-3 text-left
                    font-['Comfortaa', cursive] text-[#263D5B] text-sm
                    ${col.sortable ? 'cursor-pointer hover:bg-[#E8F6FC] select-none' : ''}
                  `}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {col.title}
                    {col.sortable && sortConfig?.key === col.key && (
                      sortConfig.direction === 'asc' 
                        ? <ChevronUp className="w-4 h-4" />
                        : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center">
                  <span className="font-['Comfortaa', cursive] text-[#6B7280]">
                    {emptyText}
                  </span>
                </td>
              </tr>
            ) : (
              sortedData.map((row, idx) => (
                <tr
                  key={String(row[keyField]) || idx}
                  className={`
                    border-b border-dashed border-[#E5E1DC] last:border-b-0
                    ${onRowClick ? 'cursor-pointer hover:bg-[#F8F6F3]' : ''}
                  `}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <span className="font-['Comfortaa', cursive] text-[#111827] text-sm">
                        {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                      </span>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;