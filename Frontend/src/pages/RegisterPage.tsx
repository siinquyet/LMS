import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, UserPlus } from 'lucide-react';
import { Card, Button, Input } from '../components/common';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp!');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    console.log('Register:', { name, email, password });
    alert('Đăng ký thành công! Vui lòng đăng nhập.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="font-['Comfortaa', cursive] text-3xl text-[#263D5B] mb-2 flex items-center justify-center gap-2">
              <UserPlus className="w-8 h-8 text-[#49B6E5]" />
              Đăng ký
            </h1>
            <p className="font-['Comfortaa', cursive] text-[#6B7280]">
              Tạo tài khoản mới
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[8px]">
              <p className="font-['Comfortaa', cursive] text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Họ và tên"
              placeholder="Nhập họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="w-5 h-5" />}
            />

            <Input
              label="Email"
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
            />

            <div className="relative">
              <Input
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <Input
              label="Xác nhận mật khẩu"
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
            />

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 mt-1" required />
              <span className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">
                Tôi đồng ý với{' '}
                <Link to="/terms" className="text-[#49B6E5] hover:underline">Điều khoản</Link>
                {' '}và{' '}
                <Link to="/privacy" className="text-[#49B6E5] hover:underline">Chính sách</Link>
              </span>
            </label>

            <Button type="submit" variant="primary" className="w-full">
              Tạo tài khoản
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-['Comfortaa', cursive] text-[#6B7280]">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-[#49B6E5] hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;