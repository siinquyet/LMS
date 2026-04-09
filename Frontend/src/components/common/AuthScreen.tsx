import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

export interface AuthScreenProps {
  type: 'login' | 'register' | 'forgot-password';
  onSubmit?: (data: Record<string, string>) => void;
  onSwitch?: (type: 'login' | 'register' | 'forgot-password') => void;
  className?: string;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  type,
  onSubmit,
  onSwitch,
  className = '',
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const handleChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isLogin = type === 'login';
  const isRegister = type === 'register';
  const isForgot = type === 'forgot-password';

  return (
    <div className={`min-h-screen bg-[#F8F6F3] flex items-center justify-center p-4 ${className}`}>
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-[#263D5B] rounded-[16px] p-8 shadow-[4px_4px_0px_#E5E1DC]">
          <div className="text-center mb-8">
            <h1 className="font-['Comfortaa', cursive] text-3xl text-[#263D5B] mb-2">
              {isLogin ? 'Welcome Back!' : isRegister ? 'Join Us' : 'Reset Password'}
            </h1>
            <p className="font-['Comfortaa', cursive] text-[#6B7280]">
              {isLogin ? 'Sign in to continue learning' : isRegister ? 'Create your account' : 'Enter your email to reset'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <Input
                label="Full Name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange('name')}
                icon={<User className="w-5 h-5" />}
              />
            )}

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange('email')}
              icon={<Mail className="w-5 h-5" />}
            />

            {!isForgot && (
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange('password')}
                icon={<Lock className="w-5 h-5" />}
              />
            )}

            {isRegister && (
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                icon={<Lock className="w-5 h-5" />}
              />
            )}

            {isLogin && (
              <button
                type="button"
                onClick={() => onSwitch?.('forgot-password')}
                className="font-['Comfortaa', cursive] text-sm text-[#49B6E5] hover:underline"
              >
                Forgot password?
              </button>
            )}

            <Button type="submit" variant="primary" className="w-full">
              {isLogin ? 'Sign In' : isRegister ? 'Create Account' : 'Send Reset Link'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            {isLogin && (
              <p className="font-['Comfortaa', cursive] text-[#6B7280]">
                Don't have an account?{' '}
                <button
                  onClick={() => onSwitch?.('register')}
                  className="text-[#49B6E5] hover:underline"
                >
                  Sign up
                </button>
              </p>
            )}
            {isRegister && (
              <p className="font-['Comfortaa', cursive] text-[#6B7280]">
                Already have an account?{' '}
                <button
                  onClick={() => onSwitch?.('login')}
                  className="text-[#49B6E5] hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
            {isForgot && (
              <button
                onClick={() => onSwitch?.('login')}
                className="font-['Comfortaa', cursive] text-[#49B6E5] hover:underline flex items-center justify-center gap-2 w-full"
              >
                <ArrowLeft className="w-4 h-4" /> Back to login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;