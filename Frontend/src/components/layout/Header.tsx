import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Bell, Menu, X, BookOpen, Store, MessageCircle, User, LogIn } from 'lucide-react';
import Avatar from '../common/Avatar';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common';

export const Header: React.FC = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) => `
    font-['Comfortaa', cursive] text-lg flex items-center gap-2 transition-colors
    ${isActive(path) ? 'text-[#49B6E5] underline decoration-wavy' : 'text-[#263D5B] hover:text-[#49B6E5]'}
  `;

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
                <button className="text-[#263D5B] hover:text-[#49B6E5]">
                  <Bell className="w-5 h-5" />
                </button>
                <Link to="/profile">
                  <Avatar name={user.ten || user.ten_dang_nhap} size="md" />
                </Link>
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
              <Link to="/forum" className={navLinkClass('/forum')} onClick={() => setMenuOpen(false)}>
                <MessageCircle className="w-5 h-5" /> Forum
              </Link>
              <Link to="/cart" className={navLinkClass('/cart')} onClick={() => setMenuOpen(false)}>
                <ShoppingCart className="w-5 h-5" /> Cart
              </Link>
              
              {user ? (
                <Link to="/profile" className={navLinkClass('/profile')} onClick={() => setMenuOpen(false)}>
                  <Avatar name={user.ten || user.ten_dang_nhap} size="sm" /> Profile
                </Link>
              ) : (
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