import { useState } from 'react';
import { Bell, Lock, CreditCard, Globe, Palette, Trash2, AlertTriangle } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { Switch } from './Switch';

export interface SettingsPageProps {
  className?: string;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ className = '' }) => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: true,
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [language, setLanguage] = useState('vi');
  const [theme, setTheme] = useState('light');

  return (
    <div className={`min-h-screen bg-[#F8F6F3] p-4 md:p-8 ${className}`}>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="font-['Comfortaa', cursive] text-2xl text-[#263D5B]">Cài đặt</h1>

        {/* Thông báo */}
        <div className="bg-white p-6 rounded-[12px] border-2 border-[#263D5B]">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-[#263D5B]" />
            <h2 className="font-['Comfortaa', cursive] text-lg text-[#263D5B]">Thông báo</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#F8F6F3] rounded-[8px]">
              <div>
                <h4 className="font-['Comfortaa', cursive] text-[#263D5B]">Thông báo qua email</h4>
                <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">Nhận cập nhật qua email</p>
              </div>
              <Switch
                checked={notifications.email}
                onChange={(checked) => setNotifications({ ...notifications, email: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-[#F8F6F3] rounded-[8px]">
              <div>
                <h4 className="font-['Comfortaa', cursive] text-[#263D5B]">Thông báo đẩy</h4>
                <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">Nhận thông báo đẩy</p>
              </div>
              <Switch
                checked={notifications.push}
                onChange={(checked) => setNotifications({ ...notifications, push: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-[#F8F6F3] rounded-[8px]">
              <div>
                <h4 className="font-['Comfortaa', cursive] text-[#263D5B]">Tiếp thị</h4>
                <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">Nhận email tiếp thị</p>
              </div>
              <Switch
                checked={notifications.marketing}
                onChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
              />
            </div>
          </div>
        </div>

        {/* Bảo mật */}
        <div className="bg-white p-6 rounded-[12px] border-2 border-[#263D5B]">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-[#263D5B]" />
            <h2 className="font-['Comfortaa', cursive] text-lg text-[#263D5B]">Bảo mật</h2>
          </div>
          <div className="space-y-4">
            <Input 
              type="password" 
              label="Mật khẩu hiện tại" 
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              placeholder="Nh���p mật khẩu hiện tại"
            />
            <Input 
              type="password" 
              label="Mật khẩu mới" 
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              placeholder="Nhập mật khẩu mới"
            />
            <Input 
              type="password" 
              label="Xác nhận mật khẩu" 
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              placeholder="Xác nhận mật khẩu mới"
            />
            <Button variant="primary">Cập nhật mật khẩu</Button>
          </div>
        </div>

        {/* Thanh toán */}
        <div className="bg-white p-6 rounded-[12px] border-2 border-[#263D5B]">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-5 h-5 text-[#263D5B]" />
            <h2 className="font-['Comfortaa', cursive] text-lg text-[#263D5B]">Thanh toán</h2>
          </div>
          <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280] mb-4">
            Chưa có phương thức thanh toán
          </p>
          <Button variant="outline">Thêm phương thức</Button>
        </div>

        {/* Ngôn ngữ */}
        <div className="bg-white p-6 rounded-[12px] border-2 border-[#263D5B]">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-[#263D5B]" />
            <h2 className="font-['Comfortaa', cursive] text-lg text-[#263D5B]">Ngôn ngữ</h2>
          </div>
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-3 border-2 border-[#263D5B] rounded-[8px] font-['Comfortaa', cursive]"
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* Giao diện */}
        <div className="bg-white p-6 rounded-[12px] border-2 border-[#263D5B]">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-[#263D5B]" />
            <h2 className="font-['Comfortaa', cursive] text-lg text-[#263D5B]">Giao diện</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <button 
              type="button" 
              onClick={() => setTheme('light')}
              className={`p-4 rounded-[8px] border-2 font-['Comfortaa', cursive] text-sm ${theme === 'light' ? 'border-[#263D5B] bg-[#E8F6FC]' : 'border-[#E5E1DC]'}`}
            >
              Sáng
            </button>
            <button 
              type="button" 
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-[8px] border-2 font-['Comfortaa', cursive] text-sm ${theme === 'dark' ? 'border-[#263D5B] bg-[#263D5B] text-white' : 'border-[#E5E1DC]'}`}
            >
              Tối
            </button>
            <button 
              type="button" 
              onClick={() => setTheme('system')}
              className={`p-4 rounded-[8px] border-2 font-['Comfortaa', cursive] text-sm ${theme === 'system' ? 'border-[#263D5B] bg-[#E8F6FC]' : 'border-dashed border-[#E5E1DC]'}`}
            >
              Hệ thống
            </button>
          </div>
        </div>

        {/* Xóa tài khoản */}
        <div className="bg-red-50 p-6 rounded-[12px] border-2 border-red-500">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="font-['Comfortaa', cursive] text-lg text-red-600">Xóa tài khoản</h2>
          </div>
          <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280] mb-4">
            Khi xóa tài khoản, tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
          </p>
          <Button variant="danger">
            <Trash2 className="w-4 h-4" /> Xóa tài khoản
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;