import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
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
  Bell
} from 'lucide-react';
import Avatar from '../common/Avatar';
import { useAuth } from '../../contexts/AuthContext';

interface TeacherLayoutProps {
  children?: React.ReactNode;
}

const menuItems = [
  { path: '/teacher', icon: <BarChart3 className="w-5 h-5" />, label: 'Tổng quan' },
  { path: '/teacher/courses', icon: <BookOpen className="w-5 h-5" />, label: 'Khóa học' },
  { path: '/teacher/students', icon: <Users className="w-5 h-5" />, label: 'Học viên' },
  { path: '/teacher/analytics', icon: <Star className="w-5 h-5" />, label: 'Thống kê' },
  { path: '/teacher/settings', icon: <Settings className="w-5 h-5" />, label: 'Cài đặt' },
];

export const TeacherLayout: React.FC<TeacherLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/teacher') {
      return location.pathname === '/teacher';
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
      `} style={{ WebkitTapHighlightColor: 'transparent' }}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-8 h-8 text-[#49B6E5]" />
                <span className="font-['Comfortaa', cursive] text-lg">LMS Doodle</span>
              </div>
              <button 
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#49B6E5]/70"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-white/60 mt-1">Giảng viên</p>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors outline-none
                  ${isActive(item.path) 
                    ? 'bg-[#49B6E5] text-white' 
                    : 'text-white/70 hover:bg-white/10 active:bg-white/10 hover:text-white'}
                `}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {item.icon}
                <span className="font-['Comfortaa', cursive] text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Avatar name={user?.ten || user?.ten_dang_nhap || 'GV'} size="sm" />
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 active:bg-white/10 hover:text-white transition-colors mb-2 outline-none"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-['Comfortaa', cursive] text-sm">Xem học viên</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 active:bg-white/10 hover:text-white transition-colors outline-none"
              style={{ WebkitTapHighlightColor: 'transparent' }}
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
            <GraduationCap className="w-6 h-6 text-[#49B6E5]" />
            <span className="font-['Comfortaa', cursive] text-lg">LMS Doodle</span>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#49B6E5]/70"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 overflow-auto">
          {children || <Outlet />}
        </main>
      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default TeacherLayout;
