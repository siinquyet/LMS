import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const Stat: React.FC<StatProps> = ({
  label,
  value,
  change,
  changeLabel,
  icon,
  className = '',
}) => {
  const getTrendIcon = () => {
    if (!change) return <Minus className="w-4 h-4 text-[#6B7280]" />;
    return change > 0 
      ? <TrendingUp className="w-4 h-4 text-[#16A34A]" />
      : <TrendingDown className="w-4 h-4 text-[#DC2626]" />;
  };

  const getTrendColor = () => {
    if (!change) return 'text-[#6B7280]';
    return change > 0 ? 'text-[#16A34A]' : 'text-[#DC2626]';
  };

  return (
    <div className={`bg-white border-2 border-[#263D5B] rounded-[12px] p-4 ${className}`}>
      <div className="flex items-start justify-between mb-2">
        <span className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">
          {label}
        </span>
        {icon && <span className="text-[#263D5B]">{icon}</span>}
      </div>
      <div className="font-['Comfortaa', cursive] text-2xl text-[#263D5B] mb-1">
        {value}
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="font-['Comfortaa', cursive] text-sm">
            {change > 0 ? '+' : ''}{change}%
          </span>
          {changeLabel && (
            <span className="font-['Comfortaa', cursive] text-xs text-[#6B7280]">
              {changeLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export interface StatsGroupProps {
  stats: StatProps[];
  columns?: number;
  className?: string;
}

export const StatsGroup: React.FC<StatsGroupProps> = ({
  stats,
  columns = 4,
  className = '',
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols] || gridCols[4]} gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <Stat key={index} {...stat} />
      ))}
    </div>
  );
};

export default Stat;