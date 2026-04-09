import React from 'react';

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface ChartProps {
  data: ChartData[];
  type?: 'bar' | 'line' | 'pie';
  height?: number;
  showValues?: boolean;
  className?: string;
}

export const Chart: React.FC<ChartProps> = ({
  data,
  type = 'bar',
  height = 200,
  showValues = true,
  className = '',
}) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  const colors = ['#49B6E5', '#263D5B', '#16A34A', '#D97706', '#DC2626', '#8B5CF6'];

  const renderBarChart = () => (
    <div className="flex items-end justify-between gap-2 h-full">
      {data.map((item, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
          {showValues && (
            <span className="font-['Comfortaa', cursive] text-xs text-[#6B7280]">
              {item.value}
            </span>
          )}
          <div
            className="w-full rounded-t-[8px] border-2 border-[#263D5B] transition-all hover:opacity-80"
            style={{
              height: `${(item.value / maxValue) * (height - 40)}px`,
              backgroundColor: item.color || colors[idx % colors.length],
            }}
          />
          <span className="font-['Comfortaa', cursive] text-xs text-[#263D5B] truncate max-w-full">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );

  const renderLineChart = () => {
    const points = data.map((item, idx) => {
      const x = (idx / (data.length - 1 || 1)) * 100;
      const y = 100 - (item.value / maxValue) * 80;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="relative h-full">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <polyline
            points={points}
            fill="none"
            stroke="#49B6E5"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          {data.map((item, idx) => {
            const x = (idx / (data.length - 1 || 1)) * 100;
            const y = 100 - (item.value / maxValue) * 80;
            return (
              <circle
                key={idx}
                cx={`${x}%`}
                cy={`${y}%`}
                r="2"
                fill="#263D5B"
              />
            );
          })}
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between">
          {data.map((item, idx) => (
            <span key={idx} className="font-['Comfortaa', cursive] text-xs text-[#263D5B]">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <div className="flex items-center justify-center gap-4">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {data.map((item, idx) => {
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360;
              const startAngle = currentAngle;
              currentAngle += angle;

              const startX = 50 + 40 * Math.cos((Math.PI * startAngle) / 180);
              const startY = 50 + 40 * Math.sin((Math.PI * startAngle) / 180);
              const endX = 50 + 40 * Math.cos((Math.PI * (startAngle + angle)) / 180);
              const endY = 50 + 40 * Math.sin((Math.PI * (startAngle + angle)) / 180);

              const largeArc = angle > 180 ? 1 : 0;

              return (
                <path
                  key={idx}
                  d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`}
                  fill={item.color || colors[idx % colors.length]}
                  stroke="#fff"
                  strokeWidth="1"
                />
              );
            })}
          </svg>
        </div>
        <div className="space-y-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm border border-[#263D5B]"
                style={{ backgroundColor: item.color || colors[idx % colors.length] }}
              />
              <span className="font-['Comfortaa', cursive] text-xs text-[#263D5B]">
                {item.label} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white border-2 border-[#263D5B] rounded-[12px] p-4 ${className}`} style={{ height }}>
      {type === 'bar' && renderBarChart()}
      {type === 'line' && renderLineChart()}
      {type === 'pie' && renderPieChart()}
    </div>
  );
};

export default Chart;