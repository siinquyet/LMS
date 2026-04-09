import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = '',
}) => {
  return (
    <nav className={`flex items-center gap-2 ${className}`}>
      <Link 
        to="/"
        className="font-['Comfortaa', cursive] text-[#6B7280] hover:text-[#49B6E5] text-sm flex items-center gap-1"
      >
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-[#E5E1DC]" />
          {item.href ? (
            <Link 
              to={item.href}
              className="font-['Comfortaa', cursive] text-[#6B7280] hover:text-[#49B6E5] text-sm"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-['Comfortaa', cursive] text-[#263D5B] text-sm">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;