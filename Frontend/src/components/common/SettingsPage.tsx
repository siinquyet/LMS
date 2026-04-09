import React, { useState } from 'react';
import { User, Bell, Lock, CreditCard, Globe, Palette, Save } from 'lucide-react';
import { Tabs } from './Tabs';
import { Input } from './Input';
import { Button } from './Button';
import { Switch } from './Switch';
import { Avatar } from './Avatar';

export interface SettingsPageProps {
  className?: string;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ className = '' }) => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Learning enthusiast',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: true,
  });

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      content: (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar name={profile.name} size="xl" />
            <Button variant="outline" size="sm">Change Avatar</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              icon={<User className="w-5 h-5" />}
            />
            <Input
              label="Email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
          <Input
            label="Bio"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
          <Button variant="primary">
            <Save className="w-4 h-4" /> Save Changes
          </Button>
        </div>
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#F8F6F3] rounded-[12px] border-2 border-[#263D5B]">
              <div>
                <h4 className="font-['Comfortaa', cursive] text-[#263D5B]">Email Notifications</h4>
                <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">Receive updates via email</p>
              </div>
              <Switch
                checked={notifications.email}
                onChange={(checked) => setNotifications({ ...notifications, email: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-[#F8F6F3] rounded-[12px] border-2 border-[#263D5B]">
              <div>
                <h4 className="font-['Comfortaa', cursive] text-[#263D5B]">Push Notifications</h4>
                <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">Receive push notifications</p>
              </div>
              <Switch
                checked={notifications.push}
                onChange={(checked) => setNotifications({ ...notifications, push: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-[#F8F6F3] rounded-[12px] border-2 border-[#263D5B]">
              <div>
                <h4 className="font-['Comfortaa', cursive] text-[#263D5B]">Marketing</h4>
                <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">Receive marketing emails</p>
              </div>
              <Switch
                checked={notifications.marketing}
                onChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'security',
      label: 'Security',
      content: (
        <div className="space-y-6">
          <div className="p-4 bg-[#F8F6F3] rounded-[12px] border-2 border-[#263D5B]">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-5 h-5 text-[#263D5B]" />
              <h4 className="font-['Comfortaa', cursive] text-[#263D5B]">Change Password</h4>
            </div>
            <div className="space-y-4">
              <Input type="password" label="Current Password" placeholder="Enter current password" />
              <Input type="password" label="New Password" placeholder="Enter new password" />
              <Input type="password" label="Confirm Password" placeholder="Confirm new password" />
              <Button variant="primary">Update Password</Button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'billing',
      label: 'Billing',
      content: (
        <div className="space-y-6">
          <div className="p-4 bg-[#F8F6F3] rounded-[12px] border-2 border-[#263D5B]">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-[#263D5B]" />
              <h4 className="font-['Comfortaa', cursive] text-[#263D5B]">Payment Methods</h4>
            </div>
            <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280] mb-4">
              No payment methods added yet
            </p>
            <Button variant="outline">Add Payment Method</Button>
          </div>
        </div>
      ),
    },
    {
      id: 'language',
      label: 'Language',
      content: (
        <div className="space-y-6">
          <div className="p-4 bg-[#F8F6F3] rounded-[12px] border-2 border-[#263D5B]">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-[#263D5B]" />
              <h4 className="font-['Comfortaa', cursive] text-[#263D5B]">Language Settings</h4>
            </div>
            <select className="w-full px-4 py-3 border-2 border-[#263D5B] rounded-[12px] font-['Comfortaa', cursive]">
              <option value="vi">Vietnamese</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      ),
    },
    {
      id: 'appearance',
      label: 'Appearance',
      content: (
        <div className="space-y-6">
          <div className="p-4 bg-[#F8F6F3] rounded-[12px] border-2 border-[#263D5B]">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-[#263D5B]" />
              <h4 className="font-['Comfortaa', cursive] text-[#263D5B]">Theme</h4>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <button className="p-4 border-2 border-[#263D5B] rounded-[12px] bg-white">
                <span className="font-['Comfortaa', cursive] text-sm">Light</span>
              </button>
              <button className="p-4 border-2 border-[#263D5B] rounded-[12px] bg-[#263D5B]">
                <span className="font-['Comfortaa', cursive] text-sm text-white">Dark</span>
              </button>
              <button className="p-4 border-2 border-dashed border-[#263D5B] rounded-[12px]">
                <span className="font-['Comfortaa', cursive] text-sm">System</span>
              </button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <h1 className="font-['Comfortaa', cursive] text-3xl text-[#263D5B] mb-8">
        Settings
      </h1>
      <Tabs tabs={tabs} />
    </div>
  );
};

export default SettingsPage;