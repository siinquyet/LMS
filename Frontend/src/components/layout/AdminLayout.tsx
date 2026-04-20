import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Star,
  GraduationCap,
  DollarSign,
  FileText,
  UserCheck,
  Shield
} from 'lucide-react';
import Avatar from '../common/Avatar';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const menuItems = [
  { path: '/admin', icon: <BarChart3 className="w-5 h-5" />, label: 'Tổng quan', badge: 0 },
  { path: '/admin/courses', icon: <BookOpen className="w-5 h-5" />, label: 'Khóa học', badge: 1 },
  { path: '/admin/users', icon: <Users className="w-5 h-5" />, label: 'Người dùng', badge: 0 },
  { path: '/admin/reports', icon: <Star className="w-5 h-5" />, label: 'Báo cáo', badge: 2 },
  { path: '/admin/orders', icon: <FileText className="w-5 h-5" />, label: 'Đơn hàng', badge: 0 },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#263D5B] text-white transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-8 h-8 text-[#49B6E5]" />
                <span className="font-['Comfortaa', cursive] text-lg">LMS Admin</span>
              </div>
              <button 
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-white/60 mt-1">Quản trị viên</p>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                  ${isActive(item.path) 
                    ? 'bg-[#49B6E5] text-white' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'}
                `}
              >
                {item.icon}
                <span className="font-['Comfortaa', cursive] text-sm flex-1">{item.label}</span>
                {item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{item.badge}</span>
                )}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Avatar name={user?.ten || user?.ten_dang_nhap || 'Admin'} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="font-['Comfortaa', cursive] text-sm truncate">
                  {user?.ten || user?.ten_dang_nhap}
                </p>
                <p className="text-xs text-white/60 truncate">{user?.email}</p>
              </div>
            </div>
            <Link
              to="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors mb-2"
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-['Comfortaa', cursive] text-sm">Xem site</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-['Comfortaa', cursive] text-sm">Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#49B6E5]" />
            <span className="font-['Comfortaa', cursive] text-lg">LMS Admin</span>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <button 
          type="button"
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;