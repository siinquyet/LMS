import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
  children?: SidebarItem[];
}

export interface SidebarProps {
  items: SidebarItem[];
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  collapsed = false,
  onToggle,
  className = '',
}) => {
  const location = useLocation();

  const isActive = (href?: string) => href && location.pathname === href;

  const renderItems = (items: SidebarItem[], depth = 0) => {
    return items.map((item) => {
      const active = isActive(item.href);
      return (
        <div key={item.id}>
          {item.href ? (
            <Link
              to={item.href}
              className={`
                flex items-center gap-3 px-4 py-3
                font-['Comfortaa', cursive] text-base
                border-l-4 transition-all duration-150
                ${active 
                  ? 'bg-[#E8F6FC] text-[#49B6E5] border-[#49B6E5]' 
                  : 'text-[#263D5B] border-transparent hover:bg-[#F8F6F3]'
                }
                ${depth > 0 ? 'ml-4' : ''}
              `}
            >
              {item.icon && <span className="w-5 flex-shrink-0">{item.icon}</span>}
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="px-2 py-0.5 bg-[#263D5B] text-white text-xs rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ) : (
            <button
              onClick={item.onClick}
              className={`
                flex items-center gap-3 px-4 py-3 w-full
                font-['Comfortaa', cursive] text-base
                text-[#263D5B]
                border-l-4 border-transparent
                hover:bg-[#F8F6F3]
                ${depth > 0 ? 'ml-4' : ''}
              `}
            >
              {item.icon && <span className="w-5 flex-shrink-0">{item.icon}</span>}
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="px-2 py-0.5 bg-[#263D5B] text-white text-xs rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          )}
          {item.children && !collapsed && renderItems(item.children, depth + 1)}
        </div>
      );
    });
  };

  return (
    <aside className={`
      bg-white border-r-2 border-[#263D5B]
      flex flex-col
      transition-all duration-300
      ${collapsed ? 'w-16' : 'w-64'}
      ${className}
    `}>
      <div className="flex-1 py-4 overflow-y-auto">
        {renderItems(items)}
      </div>
      {onToggle && (
        <button
          onClick={onToggle}
          className="p-4 border-t-2 border-dashed border-[#E5E1DC] flex justify-center"
        >
          {collapsed 
            ? <ChevronRight className="w-5 h-5 text-[#263D5B]" />
            : <ChevronLeft className="w-5 h-5 text-[#263D5B]" />
          }
        </button>
      )}
    </aside>
  );
};

export default Sidebar;