import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Bell, Menu, X, BookOpen, Store, MessageCircle, User, LogIn, FileText, ChevronDown, LogOut, Settings, User as UserIcon, Check, AlertCircle, Info, Shield, Users, BarChart, ArrowLeftRight, GraduationCap } from 'lucide-react';
import Avatar from '../common/Avatar';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common';
import { notifications as mockNotifications } from '../../mockData';

interface LocalNotification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const headerNotifications: LocalNotification[] = mockNotifications.slice(0, 5).map(n => ({
  id: n.id,
  type: n.loai,
  title: n.tieu_de,
  message: n.noi_dung,
  time: n.ngay_tao,
  read: n.da_doc,
}));

export const Header: React.FC = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notiRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(headerNotifications);
  const [switchedRole, setSwitchedRole] = useState<string | null>(null);

  // Get the role to display (either switched or original)
  const displayRole = switchedRole || user?.vai_tro || 'hoc_vien';
  const isDisplaySwitched = switchedRole !== null;

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
        setNotiOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotiIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <Check className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'error': return <X className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
  };

  const navLinkClass = (path: string) => `
    font-['Comfortaa', cursive] text-lg flex items-center gap-2 transition-colors
    ${isActive(path) ? 'text-[#49B6E5] underline decoration-wavy' : 'text-[#263D5B] hover:text-[#49B6E5]'}
  `;

  const switchUI = (newRole: string) => {
    setSwitchedRole(newRole);
    setProfileOpen(false);
  };

  const switchBack = () => {
    setSwitchedRole(null);
    setProfileOpen(false);
  };

  const originalRoleName = user?.vai_tro === 'giang_vien' ? 'Giảng viên' : user?.vai_tro === 'admin' ? 'Admin' : 'Học viên';
  const displayRoleName = displayRole === 'giang_vien' ? 'Giảng viên' : displayRole === 'admin' ? 'Admin' : 'Học viên';

  return (
    <header className="bg-white border-b-2 border-[#263D5B] sticky top-0 z-50 w-full">
      <div className="w-full px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <BookOpen className="w-8 h-8 text-[#263D5B] group-hover:text-[#49B6E5] transition-colors" strokeWidth={2} />
            <span className="font-['Comfortaa', cursive] text-2xl text-[#263D5B] group-hover:text-[#49B6E5] transition-colors">
              LMS Doodle
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/store" className={navLinkClass('/store')}>
              <Store className="w-5 h-5" />
              Store
            </Link>
            <Link to="/my-courses" className={navLinkClass('/my-courses')}>
              <BookOpen className="w-5 h-5" />
              My Courses
            </Link>
            <Link to="/assignments" className={navLinkClass('/assignments')}>
              <FileText className="w-5 h-5" />
              Assignments
            </Link>
            <Link to="/forum" className={navLinkClass('/forum')}>
              <MessageCircle className="w-5 h-5" />
              Forum
            </Link>
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/cart" className="font-['Comfortaa', cursive] text-lg text-[#263D5B] hover:text-[#49B6E5] relative flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Cart
            </Link>
            
            {user ? (
              <>
                <div className="relative" ref={notiRef}>
                <button type="button" onClick={() => setNotiOpen(!notiOpen)} className="text-[#263D5B] hover:text-[#49B6E5] relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {notiOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border-2 border-[#263D5B] rounded-[8px] shadow-lg overflow-hidden z-50">
                    <div className="p-3 border-b border-[#E5E1DC] flex items-center justify-between">
                      <span className="font-['Comfortaa', cursive] text-sm text-[#263D5B] font-semibold">Thông báo</span>
                      {unreadCount > 0 && (
                        <button type="button" onClick={markAllAsRead} className="font-['Comfortaa', cursive] text-xs text-[#49B6E5] hover:underline">
                          Đánh dấu đã đọc
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-[#6B7280] font-['Comfortaa', cursive] text-sm">
                          Không có thông báo
                        </div>
                      ) : (
                        notifications.map(noti => (
                          <button
                            key={noti.id}
                            type="button"
                            onClick={() => markAsRead(noti.id)}
                            className={`w-full p-3 text-left border-b border-[#E5E1DC] hover:bg-gray-50 ${!noti.read ? 'bg-blue-50' : ''}`}
                          >
                            <div className="flex items-start gap-2">
                              {getNotiIcon(noti.type)}
                              <div className="flex-1 min-w-0">
                                <p className="font-['Comfortaa', cursive] text-sm text-[#263D5B] truncate">{noti.title}</p>
                                <p className="font-['Comfortaa', cursive] text-xs text-[#6B7280] truncate">{noti.message}</p>
                                <p className="font-['Comfortaa', cursive] text-xs text-[#6B7280] mt-1">{noti.time}</p>
                              </div>
                              {!noti.read && <div className="w-2 h-2 bg-[#49B6E5] rounded-full shrink-0 mt-1" />}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
                <div className="relative" ref={profileRef}>
                  <button type="button" onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2">
                    <Avatar name={user.ten || user.ten_dang_nhap} size="md" interactive />
                    <ChevronDown className={`w-4 h-4 text-[#263D5B] transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-[#263D5B] rounded-[8px] shadow-lg overflow-hidden z-50">
                      <div className="p-3 border-b border-[#E5E1DC]">
                        <p className="font-['Comfortaa', cursive] text-sm text-[#263D5B] font-semibold">{user.ten || user.ten_dang_nhap}</p>
                        <p className="font-['Comfortaa', cursive] text-xs text-[#6B7280]">{user.email}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {displayRole === 'admin' && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded font-['Comfortaa', cursive]">Admin</span>
                          )}
                          {displayRole === 'giang_vien' && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded font-['Comfortaa', cursive]">Giảng viên</span>
                          )}
                          {displayRole === 'hoc_vien' && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded font-['Comfortaa', cursive]">Học viên</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Admin menu */}
                      {displayRole === 'admin' && (
                        <>
                          <Link to="/admin" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-[#263D5B]" onClick={() => setProfileOpen(false)}>
                            <BarChart className="w-4 h-4" />
                            <span className="font-['Comfortaa', cursive] text-sm">Dashboard</span>
                          </Link>
                          <Link to="/admin/users" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-[#263D5B]" onClick={() => setProfileOpen(false)}>
                            <Users className="w-4 h-4" />
                            <span className="font-['Comfortaa', cursive] text-sm">Quản lý user</span>
                          </Link>
                          <Link to="/admin/courses" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-[#263D5B]" onClick={() => setProfileOpen(false)}>
                            <BookOpen className="w-4 h-4" />
                            <span className="font-['Comfortaa', cursive] text-sm">Quản lý khóa học</span>
                          </Link>
                          <div className="border-t border-[#E5E1DC]" />
                        </>
                      )}
                      
                      <Link to="/profile" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-[#263D5B]" onClick={() => setProfileOpen(false)}>
                        <UserIcon className="w-4 h-4" />
                        <span className="font-['Comfortaa', cursive] text-sm">Hồ sơ</span>
                      </Link>
                      <Link to="/settings" className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-[#263D5B]" onClick={() => setProfileOpen(false)}>
                        <Settings className="w-4 h-4" />
                        <span className="font-['Comfortaa', cursive] text-sm">Cài đặt</span>
                      </Link>
                      
                      {/* Switch Role - show option to switch to user's actual role */}
                      {user?.vai_tro && user?.vai_tro !== 'hoc_vien' && displayRole === 'hoc_vien' && (
                        <div className="border-t border-[#E5E1DC] pt-2 mt-2">
                          <button type="button" onClick={() => switchUI(user.vai_tro)} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-[#263D5B]">
                            {user.vai_tro === 'giang_vien' ? <GraduationCap className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                            <span className="font-['Comfortaa', cursive] text-sm">Sang giao diện {originalRoleName}</span>
                          </button>
                        </div>
                      )}
                      
                      <button type="button" onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600">
                        <LogOut className="w-4 h-4" />
                        <span className="font-['Comfortaa', cursive] text-sm">Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="secondary" size="sm">
                    <LogIn className="w-4 h-4" />
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    <User className="w-4 h-4" />
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            type="button"
            className="md:hidden p-2 text-[#263D5B]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t-2 border-dashed border-[#E5E1DC] pt-4">
            <div className="flex flex-col gap-3">
              <Link to="/store" className={navLinkClass('/store')} onClick={() => setMenuOpen(false)}>
                <Store className="w-5 h-5" /> Store
              </Link>
              <Link to="/my-courses" className={navLinkClass('/my-courses')} onClick={() => setMenuOpen(false)}>
                <BookOpen className="w-5 h-5" /> My Courses
              </Link>
              <Link to="/assignments" className={navLinkClass('/assignments')} onClick={() => setMenuOpen(false)}>
                <FileText className="w-5 h-5" /> Assignments
              </Link>
              <Link to="/forum" className={navLinkClass('/forum')} onClick={() => setMenuOpen(false)}>
                <MessageCircle className="w-5 h-5" /> Forum
              </Link>
              <Link to="/cart" className={navLinkClass('/cart')} onClick={() => setMenuOpen(false)}>
                <ShoppingCart className="w-5 h-5" /> Cart
              </Link>
              
              {user && (
                <>
                  <Link to="/profile" className={navLinkClass('/profile')} onClick={() => setMenuOpen(false)}>
                    <Avatar name={user.ten || user.ten_dang_nhap} size="sm" /> Profile
                  </Link>
                </>
              )}
              {!user && (
                <div className="flex gap-2 mt-2">
                  <Link to="/login" className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">Đăng nhập</Button>
                  </Link>
                  <Link to="/register" className="flex-1">
                    <Button variant="primary" size="sm" className="w-full">Đăng ký</Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;