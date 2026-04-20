import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = `
    font-['Comfortaa', cursive]
    font-normal
    border-2
    border-[#263D5B]
    rounded-[12px]
    cursor-pointer
    transition-all
    duration-150
    ease-out
    relative
    inline-flex
    items-center
    justify-center
    gap-2
    whitespace-nowrap
  `;

  const variantStyles = {
    primary: 'bg-[#49B6E5] text-white hover:bg-[#3A9BC7] shadow-[3px_3px_0px_#E5E1DC] hover:shadow-[4px_4px_0px_#E5E1DC] hover:translate-x-[-2px] hover:translate-y-[-2px]',
    secondary: 'bg-white text-[#263D5B] shadow-[3px_3px_0px_#E5E1DC] hover:shadow-[4px_4px_0px_#E5E1DC] hover:translate-x-[-2px] hover:translate-y-[-2px]',
    danger: 'bg-[#DC2626] text-white hover:bg-[#B91C1C] shadow-[3px_3px_0px_#E5E1DC] hover:shadow-[4px_4px_0px_#E5E1DC] hover:translate-x-[-2px] hover:translate-y-[-2px]',
    outline: 'bg-transparent text-[#263D5B] border-dashed hover:bg-[#F8F6F3]',
    ghost: 'bg-transparent text-gray-300 hover:bg-[#475569]',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  };

  const activeStyles = 'active:translate-x-0 active:translate-y-0 active:shadow-none';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${activeStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;