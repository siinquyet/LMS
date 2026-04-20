import React, { useState } from 'react';
import { Check, X, Search } from 'lucide-react';
import { Card, Badge, Avatar } from '../components/common';

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: 'hoc_vien' | 'giang_vien' | 'admin';
  status: 'active' | 'inactive' | 'banned';
  joinedDate: string;
}

const mockUsers: UserItem[] = [
  { id: 1, name: 'Nguyễn Văn A', email: 'user@example.com', role: 'hoc_vien', status: 'active', joinedDate: '2024-01-15' },
  { id: 2, name: 'Trần Thị B', email: 'teacher@example.com', role: 'giang_vien', status: 'active', joinedDate: '2024-02-20' },
  { id: 3, name: 'Lê Văn C', email: 'levanc@example.com', role: 'hoc_vien', status: 'banned', joinedDate: '2024-03-10' },
];

const roleLabels: Record<string, string> = {
  hoc_vien: 'Học viên',
  giang_vien: 'Giảng viên',
  admin: 'Admin',
};

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  active: 'success', inactive: 'default', banned: 'danger',
};

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const toggleStatus = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u));
  };

  const changeRole = (id: number, newRole: 'hoc_vien' | 'giang_vien' | 'admin') => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-['Comfortaa', cursive] text-3xl text-[#263D5B]">Quản lý người dùng</h1>
          <p className="font-['Comfortaa', cursive] text-gray-500 mt-1">Phân quyền và quản lý tài khoản</p>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg font-['Comfortaa', cursive] text-sm focus:outline-none focus:border-[#49B6E5]"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg font-['Comfortaa', cursive] text-sm"
        >
          <option value="all">Tất cả vai trò</option>
          <option value="hoc_vien">Học viên</option>
          <option value="giang_vien">Giảng viên</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg font-['Comfortaa', cursive] text-sm"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="banned">Cấm</option>
        </select>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-['Comfortaa', cursive] text-gray-500 text-sm">Người dùng</th>
                <th className="text-left py-3 px-4 font-['Comfortaa', cursive] text-gray-500 text-sm">Email</th>
                <th className="text-left py-3 px-4 font-['Comfortaa', cursive] text-gray-500 text-sm">Vai trò</th>
                <th className="text-left py-3 px-4 font-['Comfortaa', cursive] text-gray-500 text-sm">Trạng thái</th>
                <th className="text-left py-3 px-4 font-['Comfortaa', cursive] text-gray-500 text-sm">Ngày tham gia</th>
                <th className="text-left py-3 px-4 font-['Comfortaa', cursive] text-gray-500 text-sm">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} size="sm" />
                      <span className="font-['Comfortaa', cursive] text-[#263D5B] text-sm">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-['Comfortaa', cursive] text-gray-600 text-sm">{user.email}</td>
                  <td className="py-3 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => changeRole(user.id, e.target.value as 'hoc_vien' | 'giang_vien' | 'admin')}
                      className="px-2 py-1 border border-gray-300 rounded font-['Comfortaa', cursive] text-sm"
                    >
                      <option value="hoc_vien">Học viên</option>
                      <option value="giang_vien">Giảng viên</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={statusColors[user.status]}>
                      {user.status === 'active' ? 'Hoạt động' : user.status === 'inactive' ? 'Khóa' : 'Cấm'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-['Comfortaa', cursive] text-gray-600 text-sm">{user.joinedDate}</td>
                  <td className="py-3 px-4">
                    <button type="button" onClick={() => toggleStatus(user.id)} className={`p-1 ${user.status === 'active' ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'}`}>
                      {user.status === 'active' ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminUsersPage;