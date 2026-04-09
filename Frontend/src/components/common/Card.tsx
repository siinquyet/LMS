import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = true,
}) => {
  return (
    <div
      className={`
        bg-white
        border-2
        border-[#263D5B]
        rounded-[16px]
        p-6
        shadow-[3px_3px_0px_#E5E1DC]
        transition-all
        duration-200
        ease-out
        overflow-visible
        ${hoverable ? 'hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[4px_4px_0px_#E5E1DC]' : ''}
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
  <div className={`font-['Comfortaa', cursive] text-[#263D5B] mb-4 ${className}`}>
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`text-[#111827] ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`mt-4 pt-4 border-t-2 border-dashed border-[#E5E1DC] ${className}`}>
    {children}
  </div>
);

export default Card;