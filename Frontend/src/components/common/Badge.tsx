import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    default: 'text-[#263D5B] border-[#263D5B] bg-[#F8F6F3]',
    primary: 'text-[#49B6E5] border-[#49B6E5] bg-[#E8F6FC]',
    success: 'text-[#16A34A] border-[#16A34A] bg-[#ECFDF5]',
    warning: 'text-[#D97706] border-[#D97706] bg-[#FFFBEB]',
    danger: 'text-[#DC2626] border-[#DC2626] bg-[#FEF2F2]',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`
        font-['Comfortaa', cursive]
        inline-flex
        items-center
        rounded-full
        border-2
        font-medium
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;