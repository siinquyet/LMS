import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, User, Mail, FileText, Shield } from 'lucide-react';
import { Card, Button, Input, Badge, Avatar, Loader, Modal, Select } from '../components/common';
import * as api from '../api';

interface UserData {
  id: number;
  ten_dang_nhap: string;
  email: string;
  ho: string;
  ten: string;
  vai_tro: string;
  anh_dai_dien?: string;
  bi_khoa: boolean;
  ngay_tham_gia: string;
}

const roleLabels: Record<string, string> = {
  hoc_vien: 'Học viên',
  giang_vien: 'Giảng viên',
  admin: 'Admin',
};

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    ten_dang_nhap: '',
    email: '',
    ho: '',
    ten: '',
    mat_khau: '',
    vai_tro: 'hoc_vien'
  });

  // Modal states for reset password
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { users: data } = await api.getUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      ten_dang_nhap: '',
      email: '',
      ho: '',
      ten: '',
      mat_khau: '',
      vai_tro: 'hoc_vien'
    });
    setShowModal(true);
  };

  const handleEdit = (user: UserData) => {
    setEditingUser(user);
    setFormData({
      ten_dang_nhap: user.ten_dang_nhap,
      email: user.email,
      ho: user.ho || '',
      ten: user.ten || '',
      mat_khau: '',
      vai_tro: user.vai_tro
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa người dùng này?')) return;
    try {
      await api.updateUser(id, { bi_khoa: true } as any);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleSave = async () => {
    if (!formData.email || !formData.ten_dang_nhap) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    try {
      if (editingUser) {
        // Update
        await api.updateUser(editingUser.id, {
          email: formData.email,
          ho: formData.ho,
          ten: formData.ten,
          vai_tro: formData.vai_tro
        });
      } else {
        // Create new
        await api.register(
          `${formData.ho} ${formData.ten}`,
          formData.email,
          formData.mat_khau || 'password123',
          formData.ten_dang_nhap,
          formData.vai_tro
        );
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Failed to save user:', error);
      alert('Lưu thất bại');
    }
  };

  const handleToggleLock = async (user: UserData) => {
    try {
      await api.updateUser(user.id, { bi_khoa: !user.bi_khoa } as any);
      fetchUsers();
    } catch (error) {
      console.error('Failed to toggle lock:', error);
    }
  };

  const filteredUsers = users.filter(u => {
    const name = `${u.ho || ''} ${u.ten || ''}`.trim().toLowerCase();
    const matchSearch = name.includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.ten_dang_nhap.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole === 'all' || u.vai_tro === filterRole;
    return matchSearch && matchRole;
  });

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-['Comfortaa', cursive] text-3xl text-[#263D5B]">Quản lý người dùng</h1>
          <p className="font-['Comfortaa', cursive] text-gray-500 mt-1">
            {users.length} người dùng
          </p>
        </div>
        <Button variant="primary" onClick={handleAdd}>
          <Plus className="w-4 h-4" />
          Thêm người dùng
        </Button>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-[#263D5B] rounded-[8px] font-['Comfortaa', cursive]"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border-2 border-[#263D5B] rounded-[8px] font-['Comfortaa', cursive]"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="hoc_vien">Học viên</option>
            <option value="giang_vien">Giảng viên</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </Card>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-[#263D5B]">
              <th className="text-left py-3 px-4 font-['Comfortaa', cursive] text-[#263D5B]">Người dùng</th>
              <th className="text-left py-3 px-4 font-['Comfortaa', cursive] text-[#263D5B]">Email</th>
              <th className="text-left py-3 px-4 font-['Comfortaa', cursive] text-[#263D5B]">Vai trò</th>
              <th className="text-left py-3 px-4 font-['Comfortaa', cursive] text-[#263D5B]">Trạng thái</th>
              <th className="text-left py-3 px-4 font-['Comfortaa', cursive] text-[#263D5B]">Ngày tham gia</th>
              <th className="text-right py-3 px-4 font-['Comfortaa', cursive] text-[#263D5B]">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar 
                      name={`${user.ho || ''} ${user.ten || ''}`.trim()} 
                      src={user.anh_dai_dien}
                      size="sm" 
                    />
                    <div>
                      <p className="font-['Comfortaa', cursive] text-[#263D5B]">
                        {user.ten_dang_nhap}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.ho} {user.ten}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-['Comfortaa', cursive] text-sm text-gray-600">
                    {user.email}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <Badge variant={user.vai_tro === 'admin' ? 'danger' : user.vai_tro === 'giang_vien' ? 'warning' : 'default'}>
                    {roleLabels[user.vai_tro] || user.vai_tro}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <Badge variant={user.bi_khoa ? 'danger' : 'success'}>
                    {user.bi_khoa ? 'Bị khóa' : 'Hoạt động'}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <span className="font-['Comfortaa', cursive] text-sm text-gray-500">
                    {user.ngay_tham_gia ? new Date(user.ngay_tham_gia).toLocaleDateString('vi-VN') : '-'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleToggleLock(user)}>
                      <Shield className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 mx-auto text-gray-300 mb-2" />
          <p className="font-['Comfortaa', cursive] text-gray-500">Không tìm thấy người dùng</p>
        </div>
      )}

      {/* Add/Edit User Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Tên đăng nhập *</label>
            <Input
              value={formData.ten_dang_nhap}
              onChange={(e) => setFormData({...formData, ten_dang_nhap: e.target.value})}
              placeholder="Nhập tên đăng nhập"
              disabled={!!editingUser}
            />
          </div>
          <div>
            <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Email *</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Nhập email"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Họ</label>
              <Input
                value={formData.ho}
                onChange={(e) => setFormData({...formData, ho: e.target.value})}
                placeholder="Họ"
              />
            </div>
            <div>
              <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Tên</label>
              <Input
                value={formData.ten}
                onChange={(e) => setFormData({...formData, ten: e.target.value})}
                placeholder="Tên"
              />
            </div>
          </div>
          {!editingUser && (
            <div>
              <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Mật khẩu</label>
              <Input
                type="password"
                value={formData.mat_khau}
                onChange={(e) => setFormData({...formData, mat_khau: e.target.value})}
                placeholder="Mật khẩu (mặc định: password123)"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Vai trò</label>
            <select
              value={formData.vai_tro}
              onChange={(e) => setFormData({...formData, vai_tro: e.target.value})}
              className="w-full p-3 border-2 border-[#263D5B] rounded-[8px] font-['Comfortaa', cursive]"
            >
              <option value="hoc_vien">Học viên</option>
              <option value="giang_vien">Giảng viên</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {editingUser ? 'Lưu' : 'Thêm'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsersPage;