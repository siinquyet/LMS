import React from 'react';
import { FileQuestion } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`
      flex flex-col items-center justify-center
      py-12 px-4
      border-2 border-dashed border-[#E5E1DC]
      rounded-[16px]
      ${className}
    `}>
      <div className="w-16 h-16 mb-4 flex items-center justify-center bg-[#F8F6F3] rounded-full">
        {icon || <FileQuestion className="w-8 h-8 text-[#6B7280]" />}
      </div>
      <h3 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] mb-2">
        {title}
      </h3>
      {description && (
        <p className="font-['Comfortaa', cursive] text-[#6B7280] text-center mb-4 max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;