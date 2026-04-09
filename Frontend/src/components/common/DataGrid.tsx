import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export interface DataGridColumn<T = unknown> {
  key: string;
  title: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface DataGridProps<T = unknown> {
  columns: DataGridColumn<T>[];
  data: T[];
  keyField?: keyof T;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  className?: string;
}

export function DataGrid<T extends Record<string, unknown>>({
  columns,
  data,
  keyField = 'id' as keyof T,
  pageSize = 10,
  onRowClick,
  loading = false,
  className = '',
}: DataGridProps<T>) {
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

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

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice((page - 1) * pageSize, page * pageSize);

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key) return <ArrowUpDown className="w-4 h-4 text-[#E5E1DC]" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-[#49B6E5]" />
      : <ArrowDown className="w-4 h-4 text-[#49B6E5]" />;
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  if (loading) {
    return (
      <div className={`border-2 border-[#263D5B] rounded-[12px] overflow-hidden ${className}`}>
        <div className="p-8 text-center">
          <span className="font-['Comfortaa', cursive] text-[#6B7280]">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`border-2 border-[#263D5B] rounded-[12px] overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F8F6F3] border-b-2 border-dashed border-[#E5E1DC]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`
                    px-4 py-3
                    font-['Comfortaa', cursive] text-sm text-[#263D5B]
                    ${alignClasses[col.align || 'left']}
                    ${col.sortable ? 'cursor-pointer hover:bg-[#E8F6FC]' : ''}
                  `}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-2 justify-between">
                    {col.title}
                    {col.sortable && getSortIcon(col.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center">
                  <span className="font-['Comfortaa', cursive] text-[#6B7280]">No data</span>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={String(row[keyField]) || idx}
                  className={`
                    border-b border-dashed border-[#E5E1DC] last:border-b-0
                    ${onRowClick ? 'cursor-pointer hover:bg-[#F8F6F3]' : ''}
                  `}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 ${alignClasses[col.align || 'left']}`}>
                      <span className="font-['Comfortaa', cursive] text-sm text-[#111827]">
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t-2 border-dashed border-[#E5E1DC] bg-[#F8F6F3]">
          <span className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, sortedData.length)} of {sortedData.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1 border-2 border-[#263D5B] rounded-[6px] disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 text-[#263D5B]" />
            </button>
            <span className="font-['Comfortaa', cursive] text-sm text-[#263D5B]">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1 border-2 border-[#263D5B] rounded-[6px] disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4 text-[#263D5B]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataGrid;