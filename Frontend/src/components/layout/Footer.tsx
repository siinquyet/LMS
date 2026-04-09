import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ExternalLink, Code, Palette, TrendingUp, Mail, Phone, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#263D5B] text-white w-full">
      <div className="h-10 w-full" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 40' preserveAspectRatio='none'%3E%3Cpath d='M0,0 Q250,40 500,0 T1000,0 L1000,40 L0,40 Z' fill='%23263D5B'/%3E%3C/svg%3E")`,
        backgroundSize: '100% 40px',
        backgroundRepeat: 'no-repeat',
      }} />
      
      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-8 h-8" strokeWidth={2} />
              <span className="font-['Comfortaa', cursive] text-2xl">
                LMS Doodle
              </span>
            </div>
            <p className="font-['Comfortaa', cursive] text-sm text-white/80">
              Nền tảng học tập với phong cách vẽ tay
            </p>
          </div>

          <div>
            <h4 className="font-['Comfortaa', cursive] text-lg mb-4 border-b-2 border-dashed border-white/30 pb-2 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/store" className="font-['Comfortaa', cursive] text-sm text-white/80 hover:text-white hover:underline decoration-wavy flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Store
                </Link>
              </li>
              <li>
                <Link to="/my-courses" className="font-['Comfortaa', cursive] text-sm text-white/80 hover:text-white hover:underline decoration-wavy flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> My Courses
                </Link>
              </li>
              <li>
                <Link to="/forum" className="font-['Comfortaa', cursive] text-sm text-white/80 hover:text-white hover:underline decoration-wavy flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Forum
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-['Comfortaa', cursive] text-lg mb-4 border-b-2 border-dashed border-white/30 pb-2 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> Categories
            </h4>
            <ul className="space-y-2">
              <li className="font-['Comfortaa', cursive] text-sm text-white/80 flex items-center gap-2">
                <Code className="w-4 h-4" /> Lập trình
              </li>
              <li className="font-['Comfortaa', cursive] text-sm text-white/80 flex items-center gap-2">
                <Palette className="w-4 h-4" /> Thiết kế
              </li>
              <li className="font-['Comfortaa', cursive] text-sm text-white/80 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Marketing
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-['Comfortaa', cursive] text-lg mb-4 border-b-2 border-dashed border-white/30 pb-2 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> Contact
            </h4>
            <ul className="space-y-2">
              <li className="font-['Comfortaa', cursive] text-sm text-white/80 flex items-center gap-2">
                <Mail className="w-4 h-4" /> email@lms.com
              </li>
              <li className="font-['Comfortaa', cursive] text-sm text-white/80 flex items-center gap-2">
                <Phone className="w-4 h-4" /> +84 123 456 789
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t-2 border-dashed border-white/20 text-center">
          <p className="font-['Comfortaa', cursive] text-sm text-white/60 flex items-center justify-center gap-2">
            <Heart className="w-4 h-4" /> © 2026 LMS Doodle | All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;