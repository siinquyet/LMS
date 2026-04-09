import React from 'react';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = 'text',
  className = '',
}) => {
  const variantStyles = {
    text: 'rounded-[4px]',
    circular: 'rounded-full',
    rectangular: 'rounded-[8px]',
  };

  return (
    <div
      className={`
        bg-[#E5E1DC]
        animate-pulse
        ${variantStyles[variant]}
        ${className}
      `}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? '60%' : '100%'}
          height={16}
          variant="text"
        />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`p-4 bg-white border-2 border-[#263D5B] rounded-[12px] ${className}`}>
      <div className="flex gap-4">
        <Skeleton width={80} height={60} variant="rectangular" />
        <div className="flex-1 space-y-2">
          <Skeleton width="70%" height={16} variant="text" />
          <Skeleton width="40%" height={14} variant="text" />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;