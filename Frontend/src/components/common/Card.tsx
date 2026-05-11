import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'outlined' | 'filled';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = true,
  onClick,
  variant = 'default',
}) => {
  const variantStyles = {
    default: 'border-[3px] border-[#1C293C] shadow-[6px_6px_0_#1C293C] bg-white',
    outlined: 'border-[3px] border-dashed border-[#1C293C] bg-white shadow-none',
    filled: 'border-[3px] border-[#1C293C] bg-[#FDC800] shadow-none',
  };

  const hoverStyles = hoverable 
    ? 'hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#1C293C]' 
    : '';

  return (
    <div
      onClick={onClick}
      className={`
        p-6
        transition-all
        duration-100
        ease-out
        overflow-visible
        ${variantStyles[variant]}
        ${hoverStyles}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`font-['Inter', sans-serif] font-semibold text-[#1C293C] mb-4 text-lg ${className}`}>
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`text-[#1C293C] ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`mt-4 pt-4 border-t-[3px] border-dashed border-[#1C293C] ${className}`}>
    {children}
  </div>
);

export default Card;