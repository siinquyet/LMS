import { useState } from 'react';
import { User, Mail, Phone, MapPin, BookOpen, Calendar, Edit, Save, Globe, Linkedin, Briefcase, GraduationCap, Cake } from 'lucide-react';
import { Button, Avatar, Input, Card, Textarea } from '../components/common';

interface UserProfile {
  id: number;
  ten_dang_nhap: string;
  email: string;
  ho: string;
  ten: string;
  so_dien_thoai?: string;
  dia_chi?: string;
  gioi_thieu?: string;
  anh_dai_dien?: string;
  ngay_tham_gia: string;
  ngay_sinh?: string;
  gioi_tinh?: string;
  trinh_do?: string;
  nghe_nghiep?: string;
  website?: string;
  facebook?: string;
  linkedin?: string;
}

const mockUser: UserProfile = {
  id: 1,
  ten_dang_nhap: 'user',
  email: 'user@example.com',
  ho: 'Nguyễn',
  ten: 'Văn A',
  so_dien_thoai: '0123456789',
  dia_chi: 'Hà Nội, Việt Nam',
  gioi_thieu: 'Yêu thích học lập trình, đặc biệt là React và Node.js',
  anh_dai_dien: 'NVA',
  ngay_tham_gia: '2024-01-15',
  ngay_sinh: '2000-01-01',
  gioi_tinh: 'Nam',
  trinh_do: 'Đại học',
  nghe_nghiep: 'Lập trình viên',
  facebook: 'https://facebook.com/user',
  linkedin: 'https://linkedin.com/in/user',
};

const mockEnrolledCourses = [
  { id: 1, title: 'React & Next.js Full Course', progress: 75, thumbnail: '' },
  { id: 2, title: 'TypeScript Fundamentals', progress: 100, thumbnail: '' },
  { id: 3, title: 'Node.js Backend Development', progress: 45, thumbnail: '' },
];

export const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(mockUser);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleSave = () => {
    if (avatarPreview) {
      setUser({ ...editForm, anh_dai_dien: avatarPreview });
    } else {
      setUser(editForm);
    }
    setIsEditing(false);
    setAvatarPreview(null);
  };

  const handleCancel = () => {
    setEditForm(user);
    setIsEditing(false);
    setAvatarPreview(null);
  };

  const handleAvatarChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F3] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-['Comfortaa', cursive] text-2xl text-[#263D5B]">Hồ sơ cá nhân</h1>
          {!isEditing && (
            <Button variant="primary" onClick={() => { setEditForm(user); setIsEditing(true); }}>
              <Edit className="w-4 h-4" /> Chỉnh sửa
            </Button>
          )}
        </div>

        {/* Profile Card */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar 
                  src={avatarPreview || user.anh_dai_dien} 
                  name={user.ten} 
                  size="2xl" 
                  onChange={isEditing ? handleAvatarChange : undefined}
                />
              </div>
              {isEditing && (
                <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">Nhấn vào ảnh để đổi</p>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Họ"
                      value={editForm.ho}
                      onChange={(e) => setEditForm({ ...editForm, ho: e.target.value })}
                      icon={<User className="w-4 h-4" />}
                    />
                    <Input
                      label="Tên"
                      value={editForm.ten}
                      onChange={(e) => setEditForm({ ...editForm, ten: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    icon={<Mail className="w-4 h-4" />}
                  />
                  <Input
                    label="Số điện thoại"
                    value={editForm.so_dien_thoai || ''}
                    onChange={(e) => setEditForm({ ...editForm, so_dien_thoai: e.target.value })}
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <Input
                    label="Địa chỉ"
                    value={editForm.dia_chi || ''}
                    onChange={(e) => setEditForm({ ...editForm, dia_chi: e.target.value })}
                    icon={<MapPin className="w-4 h-4" />}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Ngày sinh"
                      type="date"
                      value={editForm.ngay_sinh || ''}
                      onChange={(e) => setEditForm({ ...editForm, ngay_sinh: e.target.value })}
                      icon={<Cake className="w-4 h-4" />}
                    />
                    <Input
                      label="Giới tính"
                      value={editForm.gioi_tinh || ''}
                      onChange={(e) => setEditForm({ ...editForm, gioi_tinh: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Trình độ"
                      value={editForm.trinh_do || ''}
                      onChange={(e) => setEditForm({ ...editForm, trinh_do: e.target.value })}
                      icon={<GraduationCap className="w-4 h-4" />}
                    />
                    <Input
                      label="Nghề nghiệp"
                      value={editForm.nghe_nghiep || ''}
                      onChange={(e) => setEditForm({ ...editForm, nghe_nghiep: e.target.value })}
                      icon={<Briefcase className="w-4 h-4" />}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Facebook"
                      value={editForm.facebook || ''}
                      onChange={(e) => setEditForm({ ...editForm, facebook: e.target.value })}
                      placeholder="https://facebook.com/..."
                    />
                    <Input
                      label="LinkedIn"
                      value={editForm.linkedin || ''}
                      onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <Textarea
                    label="Giới thiệu"
                    value={editForm.gioi_thieu || ''}
                    onChange={(e) => setEditForm({ ...editForm, gioi_thieu: e.target.value })}
                    placeholder="Giới thiệu về bản thân..."
                    rows={3}
                  />
                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={handleCancel}>Hủy</Button>
                    <Button variant="primary" onClick={handleSave}>
                      <Save className="w-4 h-4" /> Lưu
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B]">
                      {user.ho} {user.ten}
                    </h2>
                    <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">@{user.ten_dang_nhap}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[#6B7280]" />
                      <span className="font-['Comfortaa', cursive] text-[#263D5B]">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-[#6B7280]" />
                      <span className="font-['Comfortaa', cursive] text-[#263D5B]">{user.so_dien_thoai || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-[#6B7280]" />
                      <span className="font-['Comfortaa', cursive] text-[#263D5B]">{user.dia_chi || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Cake className="w-5 h-5 text-[#6B7280]" />
                      <span className="font-['Comfortaa', cursive] text-[#263D5B]">{user.ngay_sinh || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-[#6B7280]" />
                      <span className="font-['Comfortaa', cursive] text-[#263D5B]">{user.nghe_nghiep || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-[#6B7280]" />
                      <span className="font-['Comfortaa', cursive] text-[#263D5B]">Tham gia: {user.ngay_tham_gia}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-[#6B7280]" />
                      <span className="font-['Comfortaa', cursive] text-[#263D5B]">{user.trinh_do || 'Chưa cập nhật'}</span>
                    </div>
                  </div>

                  {/* Social Links */}
                  {(user.facebook || user.linkedin) && (
                    <div className="flex gap-4 mt-2">
                      {user.facebook && (
                        <a href={user.facebook} target="_blank" rel="noopener noreferrer" className="font-['Comfortaa', cursive] text-sm text-[#49B6E5] hover:underline">
                          Facebook
                        </a>
                      )}
                      {user.linkedin && (
                        <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="font-['Comfortaa', cursive] text-sm text-[#49B6E5] hover:underline">
                          LinkedIn
                        </a>
                      )}
                    </div>
                  )}

                  {user.gioi_thieu && (
                    <div className="p-4 bg-[#F8F6F3] rounded-[8px]">
                      <h3 className="font-['Comfortaa', cursive] text-sm text-[#6B7280] mb-1">Giới thiệu</h3>
                      <p className="font-['Comfortaa', cursive] text-[#263D5B]">{user.gioi_thieu}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Enrolled Courses */}
        <div>
          <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] mb-4">Khóa học của tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockEnrolledCourses.map((course) => (
              <Card key={course.id} className="p-4">
                <div className="aspect-video bg-[#263D5B] rounded-[8px] mb-3 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-['Comfortaa', cursive] text-sm text-[#263D5B] mb-2 line-clamp-2">{course.title}</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-['Comfortaa', cursive] text-[#6B7280]">Tiến độ</span>
                    <span className="font-['Comfortaa', cursive] text-[#263D5B]">{course.progress}%</span>
                  </div>
                  <div className="h-2 bg-[#E5E1DC] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#263D5B] rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;