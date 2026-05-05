import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { Card, Button, Input } from '../components/common';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (success) {
      const userJson = localStorage.getItem('lms_auth_user');
      if (userJson) {
        const user = JSON.parse(userJson);
        if (user.vai_tro === 'giang_vien') {
          navigate('/teacher');
        } else if (user.vai_tro === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    } else {
      setError('Email hoặc mật khẩu không đúng');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="font-['Comfortaa', cursive] text-3xl text-[#263D5B] mb-2 flex items-center justify-center gap-2">
              <LogIn className="w-8 h-8 text-[#49B6E5]" />
              Đăng nhập
            </h1>
            <p className="font-['Comfortaa', cursive] text-[#6B7280]">
              Chào mừng trở lại!
            </p>
            <p className="font-['Comfortaa', cursive] text-xs text-red-500 mt-2">
              
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[8px]">
              <p className="font-['Comfortaa', cursive] text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
            />

            <div className="relative">
              <Input
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[42px] text-[#6B7280] hover:text-[#263D5B]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">Ghi nhớ</span>
              </label>
              <Link to="/forgot-password" className="font-['Comfortaa', cursive] text-sm text-[#49B6E5] hover:underline">
                Quên mật khẩu?
              </Link>
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Đăng nhập
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-['Comfortaa', cursive] text-[#6B7280]">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-[#49B6E5] hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-[#F8F6F3] rounded-[12px] border-2 border-dashed border-[#E5E1DC]">
            <p className="font-['Comfortaa', cursive] text-xs text-[#6B7280] text-center mb-2">
              Tài khoản demo:
            </p>
            <div className="font-['Comfortaa', cursive] text-xs text-[#6B7280] space-y-1">
              <p>Học viên: user </p>
              <p>Giảng viên: teacher </p>
              <p>Admin: admin </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;