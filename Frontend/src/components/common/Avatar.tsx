import React from 'react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  onClick?: () => void;
  onChange?: (file: File) => void;
  interactive?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  className = '',
  onClick,
  onChange,
  interactive,
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
    '2xl': 'w-24 h-24 text-2xl',
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onChange) {
      onChange(file);
    }
  };

  const isInteractive = onClick || onChange || interactive;

  if (onChange) {
    return (
      <label className={`${sizeStyles[size]} relative cursor-pointer group`}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {src || name ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover rounded-full border-2 border-[#263D5B]"
          />
        ) : (
          <div className={`
            ${sizeStyles[size]}
            border-2
            border-[#263D5B]
            rounded-full
            overflow-hidden
            bg-[#F8F6F3]
            flex
            items-center
            justify-center
            font-['Comfortaa', cursive]
            font-semibold
            text-[#263D5B]
            shrink-0
          `}>
            <span>{getInitials(name)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-white text-xs font-['Comfortaa', cursive]">Đổi</span>
        </div>
      </label>
    );
  }

  const Wrapper = isInteractive ? 'button' : 'div';

  return (
    <Wrapper
      type={isInteractive ? 'button' : undefined}
      onClick={onClick}
      className={`
        ${sizeStyles[size]}
        border-2
        border-[#263D5B]
        rounded-full
        overflow-hidden
        bg-[#F8F6F3]
        flex
        items-center
        justify-center
        font-['Comfortaa', cursive]
        font-semibold
        text-[#263D5B]
        shrink-0
        ${isInteractive ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
        ${className}
      `}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </Wrapper>
  );
};

export default Avatar;