import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowUpRight, BookOpen, Check, DollarSign, FileText, ShoppingCart, UserCheck, Users, X } from 'lucide-react';
import { Badge, Button, Card } from '../components/common';
import { adminDashboardCourses, adminOrders, adminReports, adminUsers } from '../mockData';

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

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price);

const statusMeta = {
  approved: { label: 'Đã duyệt', variant: 'success' as const },
  pending: { label: 'Chờ duyệt', variant: 'warning' as const },
  rejected: { label: 'Từ chối', variant: 'danger' as const },
  draft: { label: 'Bản nháp', variant: 'default' as const },
  success: { label: 'Thành công', variant: 'success' as const },
  failed: { label: 'Thất bại', variant: 'danger' as const },
};

export const AdminDashboardPage = () => {
  const [courses, setCourses] = useState<Course[]>(adminDashboardCourses);
  const [users, setUsers] = useState<UserItem[]>(adminUsers);
  const [orders] = useState<Order[]>(adminOrders.map((order, index) => ({ ...order, status: index === 2 ? 'pending' : order.status })));
  const [reports, setReports] = useState<Report[]>(adminReports);

  const pendingCourses = courses.filter((course) => course.status === 'pending');
  const pendingReports = reports.filter((report) => report.status === 'pending');
  const pendingOrders = orders.filter((order) => order.status === 'pending');
  const successOrders = orders.filter((order) => order.status === 'success');
  const teachers = users.filter((user) => user.role === 'giang_vien');
  const students = users.filter((user) => user.role === 'hoc_vien');
  const totalRevenue = successOrders.reduce((sum, order) => sum + order.amount, 0);
  const monthlyRevenue = successOrders.filter((order) => order.date.startsWith('2024-04')).reduce((sum, order) => sum + order.amount, 0);

  const recentOrders = useMemo(() => [...orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4), [orders]);

  const stats = [
    { title: 'Tổng khóa học', value: courses.length, icon: <BookOpen className="w-6 h-6" />, color: 'bg-blue-500', change: pendingCourses.length },
    { title: 'Tổng người dùng', value: users.length, icon: <Users className="w-6 h-6" />, color: 'bg-green-500', change: students.length },
    { title: 'Giảng viên', value: teachers.length, icon: <UserCheck className="w-6 h-6" />, color: 'bg-purple-500', change: pendingReports.length },
    { title: 'Doanh thu tháng', value: formatPrice(monthlyRevenue), icon: <DollarSign className="w-6 h-6" />, color: 'bg-yellow-500', change: successOrders.length },
  ];

  const handleApproveCourse = (id: number) => {
    setCourses((current) => current.map((course) => (course.id === id ? { ...course, status: 'approved' } : course)));
  };

  const handleRejectCourse = (id: number) => {
    setCourses((current) => current.map((course) => (course.id === id ? { ...course, status: 'rejected' } : course)));
  };

  const handleApproveReport = (id: number) => {
    const report = reports.find((item) => item.id === id);
    if (!report) return;

    setUsers((current) => current.map((user) => (user.id === report.reportedUserId ? { ...user, status: 'banned' } : user)));
    setReports((current) => current.map((item) => (item.id === id ? { ...item, status: 'approved' } : item)));
  };

  const handleRejectReport = (id: number) => {
    setReports((current) => current.map((report) => (report.id === id ? { ...report, status: 'rejected' } : report)));
  };

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="font-['Comfortaa', cursive] text-4xl text-[#263D5B]">Tổng quan</h1>
            <p className="text-gray-600 mt-1">Theo dõi nhanh hệ thống và các mục cần xử lý.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link to="/admin/courses">
              <Button variant="secondary">
                <BookOpen className="w-5 h-5" />
                Quản lý khóa học
              </Button>
            </Link>
            <Link to="/admin/users">
              <Button variant="secondary">
                <Users className="w-5 h-5" />
                Quản lý người dùng
              </Button>
            </Link>
            <Link to="/admin/orders">
              <Button variant="secondary">
                <FileText className="w-5 h-5" />
                Xem đơn hàng
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} hoverable={false}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-['Comfortaa', cursive] text-2xl text-[#263D5B]">{stat.value}</span>
                    <span className="flex items-center text-sm text-green-600">
                      <ArrowUpRight className="w-3 h-3" />
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card hoverable={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Comfortaa', cursive] text-xl text-[#263D5B]">Cần xử lý</h3>
              <span className="text-sm text-gray-500">{pendingCourses.length + pendingReports.length + pendingOrders.length} mục</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-[#E5E1DC]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100 text-orange-600"><BookOpen className="w-5 h-5" /></div>
                  <div>
                    <p className="font-['Comfortaa', cursive] text-sm text-[#263D5B]">Khóa học</p>
                    <p className="text-sm text-gray-500">Khóa học mới từ giảng viên</p>
                  </div>
                </div>
                <span className="font-['Comfortaa', cursive] text-lg text-[#263D5B]">{pendingCourses.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-[#E5E1DC]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-100 text-red-600"><AlertTriangle className="w-5 h-5" /></div>
                  <div>
                    <p className="font-['Comfortaa', cursive] text-sm text-[#263D5B]">Báo cáo vi phạm</p>
                    <p className="text-sm text-gray-500">Nội dung và tài khoản cần xem xét</p>
                  </div>
                </div>
                <span className="font-['Comfortaa', cursive] text-lg text-[#263D5B]">{pendingReports.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-[#E5E1DC]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600"><ShoppingCart className="w-5 h-5" /></div>
                  <div>
                    <p className="font-['Comfortaa', cursive] text-sm text-[#263D5B]">Đơn hàng chờ</p>
                    <p className="text-sm text-gray-500">Giao dịch chưa hoàn tất</p>
                  </div>
                </div>
                <span className="font-['Comfortaa', cursive] text-lg text-[#263D5B]">{pendingOrders.length}</span>
              </div>
            </div>
          </Card>

          <Card hoverable={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Comfortaa', cursive] text-xl text-[#263D5B]">Thống kê nhanh</h3>
              <Link to="/admin/orders" className="text-sm text-[#49B6E5] hover:underline">Xem chi tiết</Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-[#E5E1DC]">
                <p className="text-gray-500 text-sm">Tổng học viên</p>
                <p className="font-['Comfortaa', cursive] text-2xl text-[#263D5B] mt-1">{students.length}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-[#E5E1DC]">
                <p className="text-gray-500 text-sm">Đơn thành công</p>
                <p className="font-['Comfortaa', cursive] text-2xl text-[#263D5B] mt-1">{successOrders.length}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-[#E5E1DC]">
                <p className="text-gray-500 text-sm">Doanh thu tổng</p>
                <p className="font-['Comfortaa', cursive] text-xl text-green-600 mt-1">{formatPrice(totalRevenue)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-[#E5E1DC]">
                <p className="text-gray-500 text-sm">Chờ xử lý</p>
                <p className="font-['Comfortaa', cursive] text-2xl text-[#263D5B] mt-1">{pendingCourses.length + pendingReports.length + pendingOrders.length}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card hoverable={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Comfortaa', cursive] text-xl text-[#263D5B]">Khóa học</h3>
              <Link to="/admin/courses" className="text-sm text-[#49B6E5] hover:underline">Xem tất cả</Link>
            </div>
            <div className="space-y-3">
              {pendingCourses.length > 0 ? pendingCourses.map((course) => (
                <div key={course.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-[#E5E1DC]">
                  <img src={course.thumbnail} alt={course.title} className="w-20 h-14 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-['Comfortaa', cursive] text-sm text-[#263D5B] truncate">{course.title}</p>
                      <Badge variant={statusMeta[course.status].variant}>{statusMeta[course.status].label}</Badge>
                    </div>
                    <p className="text-xs text-gray-500">{course.instructor}</p>
                    <p className="text-xs text-[#49B6E5] mt-1">{formatPrice(course.price)} • {course.students} học viên</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleApproveCourse(course.id)} className="p-2 bg-green-500 hover:bg-green-600 rounded"><Check className="w-4 h-4 text-white" /></button>
                    <button type="button" onClick={() => handleRejectCourse(course.id)} className="p-2 bg-red-500 hover:bg-red-600 rounded"><X className="w-4 h-4 text-white" /></button>
                  </div>
                </div>
              )) : <p className="text-center text-gray-500 py-8">Không có khóa học chờ duyệt</p>}
            </div>
          </Card>

          <Card hoverable={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Comfortaa', cursive] text-xl text-[#263D5B]">Báo cáo vi phạm</h3>
              <Link to="/admin/reports" className="text-sm text-[#49B6E5] hover:underline">Mở xử lý</Link>
            </div>
            <div className="space-y-3">
              {pendingReports.length > 0 ? pendingReports.map((report) => (
                <div key={report.id} className="p-3 bg-gray-50 rounded-lg border border-[#E5E1DC]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-['Comfortaa', cursive] text-sm text-[#263D5B]">{report.reportedUserName}</p>
                      <p className="text-xs text-gray-500 mt-1">Báo cáo bởi {report.reporterName}</p>
                      <p className="text-xs text-red-500 mt-2">{report.reason}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button type="button" onClick={() => handleApproveReport(report.id)} className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">Cấm</button>
                      <button type="button" onClick={() => handleRejectReport(report.id)} className="px-2 py-1 bg-gray-300 text-[#263D5B] rounded text-xs hover:bg-gray-400">Bỏ</button>
                    </div>
                  </div>
                </div>
              )) : <p className="text-center text-gray-500 py-4">Không có báo cáo chờ xử lý</p>}
            </div>
          </Card>

          <Card hoverable={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Comfortaa', cursive] text-xl text-[#263D5B]">Đơn hàng gần đây</h3>
              <Link to="/admin/orders" className="text-sm text-[#49B6E5] hover:underline">Xem tất cả</Link>
            </div>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg border border-[#E5E1DC]">
                  <div className="min-w-0">
                    <p className="font-['Comfortaa', cursive] text-sm text-[#263D5B]">{order.course}</p>
                    <p className="text-xs text-gray-500 mt-1">{order.user} • {order.date}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-['Comfortaa', cursive] text-sm text-[#49B6E5]">{formatPrice(order.amount)}</p>
                    <Badge variant={order.status === 'pending' ? 'warning' : statusMeta[order.status].variant}>
                      {order.status === 'pending' ? 'Chờ xử lý' : statusMeta[order.status].label}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
