import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, FileText, DollarSign, Check, X, TrendingUp, AlertTriangle, ShoppingCart, UserCheck, Eye, Calendar } from 'lucide-react';
import { Card, Badge, Avatar } from '../components/common';

interface Course {
  id: number;
  title: string;
  instructor: string;
  thumbnail: string;
  students: number;
  price: number;
  status: 'approved' | 'pending' | 'rejected' | 'draft';
}

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: 'hoc_vien' | 'giang_vien' | 'admin';
  status: 'active' | 'inactive' | 'banned';
  joinedDate: string;
}

interface Order {
  id: number;
  user: string;
  course: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  date: string;
}

interface Report {
  id: number;
  reporterId: number;
  reporterName: string;
  reportedUserId: number;
  reportedUserName: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const mockCourses: Course[] = [
  { id: 1, title: 'React & Next.js Full Course', instructor: 'Trần Thị B', thumbnail: 'https://picsum.photos/seed/react/300/200', students: 1250, price: 699000, status: 'approved' },
  { id: 2, title: 'TypeScript Fundamentals', instructor: 'Trần Thị B', thumbnail: 'https://picsum.photos/seed/ts/300/200', students: 890, price: 499000, status: 'approved' },
  { id: 3, title: 'Node.js Backend', instructor: 'Lê Văn C', thumbnail: 'https://picsum.photos/seed/node/300/200', students: 200, price: 799000, status: 'pending' },
  { id: 4, title: 'Vue.js Complete', instructor: 'Lê Văn C', thumbnail: 'https://picsum.photos/seed/vue/300/200', students: 0, price: 599000, status: 'draft' },
];

const mockUsers: UserItem[] = [
  { id: 1, name: 'Nguyễn Văn A', email: 'user@example.com', role: 'hoc_vien', status: 'active', joinedDate: '2024-01-15' },
  { id: 2, name: 'Trần Thị B', email: 'teacher@example.com', role: 'giang_vien', status: 'active', joinedDate: '2024-02-20' },
  { id: 3, name: 'Lê Văn C', email: 'levanc@example.com', role: 'giang_vien', status: 'active', joinedDate: '2024-02-25' },
  { id: 4, name: 'Phạm Thị D', email: 'phamt@example.com', role: 'hoc_vien', status: 'banned', joinedDate: '2024-03-10' },
];

const mockOrders: Order[] = [
  { id: 1, user: 'Nguyễn Văn A', course: 'React & Next.js', amount: 699000, status: 'success', date: '2024-04-15' },
  { id: 2, user: 'Trần Thị B', course: 'TypeScript', amount: 499000, status: 'success', date: '2024-04-14' },
  { id: 3, user: 'Lê Văn C', course: 'Node.js', amount: 799000, status: 'pending', date: '2024-04-14' },
  { id: 4, user: 'Phạm Thị D', course: 'Vue.js', amount: 599000, status: 'success', date: '2024-04-13' },
];

const mockReports: Report[] = [
  { id: 1, reporterId: 1, reporterName: 'Nguyễn Văn A', reportedUserId: 4, reportedUserName: 'Phạm Thị D', reason: 'Spam nội dung không phù hợp', status: 'pending', createdAt: '2024-04-15' },
  { id: 2, reporterId: 2, reporterName: 'Trần Thị B', reportedUserId: 1, reportedUserName: 'Nguyễn Văn A', reason: 'Quấy rối trong khóa học', status: 'pending', createdAt: '2024-04-14' },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price);
};

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  active: 'success', inactive: 'default', banned: 'danger', approved: 'success', pending: 'warning', rejected: 'danger', draft: 'default', success: 'success', failed: 'danger',
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  change?: number;
  link?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, change, link }) => (
  <Link to={link || '#'} className="block">
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        {change !== undefined && (
          <span className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <h3 className="font-['Comfortaa', cursive] text-gray-500 text-sm mb-1">{title}</h3>
      <p className="font-['Comfortaa', cursive] text-3xl text-[#263D5B] font-bold">{value}</p>
    </Card>
  </Link>
);

interface QuickActionProps {
  title: string;
  description: string;
  count: number;
  link: string;
  icon: React.ReactNode;
  color: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, description, count, link, icon, color }) => (
  <Link to={link} className="block">
    <div className="p-4 border-2 border-[#263D5B] rounded-lg hover:bg-[#263D5B] hover:text-white transition-colors group">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color} group-hover:bg-white group-hover:text-[#263D5B]`}>{icon}</div>
        <div className="flex-1">
          <p className="font-['Comfortaa', cursive] font-medium">{title}</p>
          <p className="font-['Comfortaa', cursive] text-sm opacity-70">{description}</p>
        </div>
        <div className="text-right">
          <span className="font-['Comfortaa', cursive] text-2xl font-bold">{count}</span>
        </div>
      </div>
    </div>
  </Link>
);

export const AdminDashboardPage: React.FC = () => {
  const [courses, setCourses] = useState(mockCourses);
  const [users, setUsers] = useState(mockUsers);
  const [orders, setOrders] = useState(mockOrders);
  const [reports, setReports] = useState(mockReports);

  const pendingCourses = courses.filter(c => c.status === 'pending');
  const pendingReports = reports.filter(r => r.status === 'pending');
  const activeUsers = users.filter(u => u.status === 'active');
  const bannedUsers = users.filter(u => u.status === 'banned');
  const teachers = users.filter(u => u.role === 'giang_vien');
  const totalRevenue = orders.filter(o => o.status === 'success').reduce((sum, o) => sum + o.amount, 0);
  const monthlyRevenue = orders.filter(o => o.status === 'success' && o.date.startsWith('2024-04')).reduce((sum, o) => sum + o.amount, 0);

  const handleApproveCourse = (id: number) => {
    setCourses(courses.map(c => c.id === id ? { ...c, status: 'approved' } : c));
  };

  const handleRejectCourse = (id: number) => {
    setCourses(courses.map(c => c.id === id ? { ...c, status: 'rejected' } : c));
  };

  const handleApproveReport = (id: number) => {
    const report = reports.find(r => r.id === id);
    if (report) {
      setUsers(users.map(u => u.id === report.reportedUserId ? { ...u, status: 'banned' } : u));
      setReports(reports.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    }
  };

  const handleRejectReport = (id: number) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="font-['Comfortaa', cursive] text-3xl text-[#263D5B]">Tổng quan</h1>
        <p className="font-['Comfortaa', cursive] text-gray-500 mt-1">Chào mừng quản trị viên! Đây là tổng quan hệ thống.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Tổng khóa học" value={courses.length} icon={<BookOpen className="w-6 h-6" />} color="bg-blue-500" link="/admin/courses" />
        <StatCard title="Tổng người dùng" value={users.length} icon={<Users className="w-6 h-6" />} color="bg-green-500" link="/admin/users" />
        <StatCard title="Giảng viên" value={teachers.length} icon={<UserCheck className="w-6 h-6" />} color="bg-purple-500" link="/admin/users" />
        <StatCard title="Doanh thu" value={formatPrice(totalRevenue)} icon={<DollarSign className="w-6 h-6" />} color="bg-yellow-500" change={18} link="/admin/orders" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] font-semibold">
              Cần xử lý
            </h2>
          </div>
          <div className="space-y-3">
            <QuickAction title="Khóa học chờ duyệt" description="Khóa học mới từ giảng viên" count={pendingCourses.length} link="/admin/courses" icon={<BookOpen className="w-6 h-6" />} color="bg-orange-500" />
            <QuickAction title="Báo cáo vi phạm" description="Báo cáo từ người dùng" count={pendingReports.length} link="/admin/reports" icon={<AlertTriangle className="w-6 h-6" />} color="bg-red-500" />
            <QuickAction title="Đơn hàng chờ" description="Đơn hàng chưa thanh toán" count={orders.filter(o => o.status === 'pending').length} link="/admin/orders" icon={<ShoppingCart className="w-6 h-6" />} color="bg-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] font-semibold">
              Thống kê nhanh
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-['Comfortaa', cursive] text-gray-500 text-sm">Tổng học viên</p>
              <p className="font-['Comfortaa', cursive] text-2xl text-[#263D5B] font-bold">{users.filter(u => u.role === 'hoc_vien').length}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-['Comfortaa', cursive] text-gray-500 text-sm">User bị cấm</p>
              <p className="font-['Comfortaa', cursive] text-2xl text-red-500 font-bold">{bannedUsers.length}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-['Comfortaa', cursive] text-gray-500 text-sm">Doanh thu tháng</p>
              <p className="font-['Comfortaa', cursive] text-2xl text-green-500 font-bold">{formatPrice(monthlyRevenue)}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-['Comfortaa', cursive] text-gray-500 text-sm">Đơn hàng thành công</p>
              <p className="font-['Comfortaa', cursive] text-2xl text-[#263D5B] font-bold">{orders.filter(o => o.status === 'success').length}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] font-semibold">
              Khóa học chờ duyệt ({pendingCourses.length})
            </h2>
            <Link to="/admin/courses" className="font-['Comfortaa', cursive] text-sm text-[#49B6E5] hover:underline">Xem tất cả</Link>
          </div>
          <div className="space-y-3">
            {pendingCourses.length === 0 && <p className="font-['Comfortaa', cursive] text-gray-400 text-center py-4">Không có khóa học chờ duyệt</p>}
            {pendingCourses.map((course) => (
              <div key={course.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <img src={course.thumbnail} alt={course.title} className="w-16 h-10 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="font-['Comfortaa', cursive] text-sm text-[#263D5B] truncate">{course.title}</p>
                  <p className="font-['Comfortaa', cursive] text-xs text-gray-400">{course.instructor}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => handleApproveCourse(course.id)} className="p-2 bg-green-500 hover:bg-green-600 rounded"><Check className="w-4 h-4 text-white" /></button>
                  <button type="button" onClick={() => handleRejectCourse(course.id)} className="p-2 bg-red-500 hover:bg-red-600 rounded"><X className="w-4 h-4 text-white" /></button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] font-semibold">
              Báo cáo vi phạm ({pendingReports.length})
            </h2>
            <Link to="/admin/reports" className="font-['Comfortaa', cursive] text-sm text-[#49B6E5] hover:underline">Xem tất cả</Link>
          </div>
          <div className="space-y-3">
            {pendingReports.length === 0 && <p className="font-['Comfortaa', cursive] text-gray-400 text-center py-4">Không có báo cáo</p>}
            {pendingReports.map((report) => (
              <div key={report.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-['Comfortaa', cursive] text-sm">
                      <span className="text-red-500">{report.reportedUserName}</span>
                    </p>
                    <p className="font-['Comfortaa', cursive] text-xs text-gray-400 mt-1">{report.reason}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleApproveReport(report.id)} className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">Cấm</button>
                    <button type="button" onClick={() => handleRejectReport(report.id)} className="px-2 py-1 bg-gray-300 text-[#263D5B] rounded text-xs hover:bg-gray-400">Bỏ</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;