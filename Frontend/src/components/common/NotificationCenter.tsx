import React from 'react';
import { Bell, X, Check, Info, AlertTriangle, AlertCircle } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  time?: string;
  read?: boolean;
}

export interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  className = '',
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <Check className="w-5 h-5 text-[#16A34A]" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-[#D97706]" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-[#DC2626]" />;
      default: return <Info className="w-5 h-5 text-[#49B6E5]" />;
    }
  };

  const getBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'bg-[#ECFDF5]';
      case 'warning': return 'bg-[#FFFBEB]';
      case 'error': return 'bg-[#FEF2F2]';
      default: return 'bg-[#E8F6FC]';
    }
  };

  return (
    <div className={`bg-white border-2 border-[#263D5B] rounded-[12px] overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-dashed border-[#E5E1DC]">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#263D5B]" />
          <span className="font-['Comfortaa', cursive] text-lg text-[#263D5B]">
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-[#DC2626] text-white text-xs rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="font-['Comfortaa', cursive] text-sm text-[#49B6E5] hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <Bell className="w-8 h-8 text-[#E5E1DC] mx-auto mb-2" />
            <span className="font-['Comfortaa', cursive] text-[#6B7280]">
              No notifications
            </span>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`
                flex items-start gap-3 p-4 border-b border-dashed border-[#E5E1DC] last:border-b-0
                ${!notification.read ? 'bg-[#F8F6F3]' : ''}
              `}
            >
              <div className={`p-2 rounded-[8px] ${getBgColor(notification.type)}`}>
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-['Comfortaa', cursive] text-sm text-[#263D5B]">
                    {notification.title}
                  </span>
                  {!notification.read && (
                    <span className="w-2 h-2 bg-[#49B6E5] rounded-full" />
                  )}
                </div>
                {notification.message && (
                  <p className="font-['Comfortaa', cursive] text-xs text-[#6B7280] mt-1 truncate">
                    {notification.message}
                  </p>
                )}
                {notification.time && (
                  <span className="font-['Comfortaa', cursive] text-xs text-[#6B7280]">
                    {notification.time}
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                {!notification.read && (
                  <button
                    onClick={() => onMarkAsRead?.(notification.id)}
                    className="p-1 text-[#6B7280] hover:text-[#49B6E5]"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onDelete?.(notification.id)}
                  className="p-1 text-[#6B7280] hover:text-[#DC2626]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;