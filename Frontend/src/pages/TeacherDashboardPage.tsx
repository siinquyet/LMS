import type { FC } from 'react';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  Star,
  Plus,
  ArrowUpRight,
  Calendar,
  TrendingUp,
  CheckCircle,
  Search,
  Filter
} from 'lucide-react';
import { Card, Button, Badge, Avatar, Input, Select } from '../components/common';
import { teacherDashboardCourses, teacherDashboardStudents, teacherRevenueData } from '../mockData';

interface Student {
  id: number;
  name: string;
  avatar: string;
  course: string;
  progress: number;
  enrolledDate: string;
}

interface Course {
  id: number;
  title: string;
  thumbnail: string;
  students: number;
  revenue: number;
  rating: number;
  lessons: number;
  status: 'completed' | 'draft';
}

const statusColors = {
  approved: 'success',
  pending: 'warning',
  draft: 'default',
} as const;

const maxRevenue = Math.max(...teacherRevenueData.map(d => d.value));

export const TeacherDashboardPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  
  const filteredStudents = useMemo(() => {
      return teacherDashboardStudents.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.course.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCourse = courseFilter === 'all' || s.course === courseFilter;
      return matchesSearch && matchesCourse;
    });
  }, [searchQuery, courseFilter]);
  
  const courseOptions = useMemo(() => {
    const courses = [...new Set(teacherDashboardStudents.map(s => s.course))];
    return ['all', ...courses];
  }, []);
  
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price);
  };

  const stats = [
    { title: 'Tổng khóa học', value: teacherDashboardCourses.length, icon: <BookOpen className="w-6 h-6" />, color: 'bg-blue-500', change: 2 },
    { title: 'Tổng học viên', value: 2340, icon: <Users className="w-6 h-6" />, color: 'bg-green-500', change: 12 },
    { title: 'Doanh thu tháng', value: '52.4M', icon: <DollarSign className="w-6 h-6" />, color: 'bg-yellow-500', change: 8 },
    { title: 'Tỉ lệ hoàn thành', value: '72%', icon: <CheckCircle className="w-6 h-6" />, color: 'bg-purple-500', change: 5 },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-['Comfortaa', cursive] text-4xl text-[#263D5B]">
              Tổng quan
            </h1>
            <p className="text-gray-600 mt-1">Chào mừng quay lại!</p>
          </div>
          <div className="flex gap-2">
            <Link to="/teacher/analytics">
              <Button variant="secondary">
                <TrendingUp className="w-5 h-5" />
                Xem doanh thu
              </Button>
            </Link>
            <Link to="/teacher/students">
              <Button variant="secondary">
                <Users className="w-5 h-5" />
                Quản lý học viên
              </Button>
            </Link>
            <Link to="/teacher/courses">
              <Button variant="secondary">
                <BookOpen className="w-5 h-5" />
                Quản lý khóa học
              </Button>
            </Link>
          </div>
        </div>

        {/* Thẻ thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} hoverable={false}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-['Comfortaa', cursive] text-2xl text-[#263D5B]">
                      {stat.value}
                    </span>
                    {stat.change !== null && (
                      <span className={`flex items-center text-sm ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <ArrowUpRight className="w-3 h-3" />
                        {Math.abs(stat.change)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quản lý học viên */}
        <Card hoverable={false} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-['Comfortaa', cursive] text-xl text-[#263D5B]">
              Danh sách học viên
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-48"
                />
              </div>
              <Select
                options={courseOptions.map(c => ({ value: c, label: c === 'all' ? 'Tất cả khóa học' : c }))}
                value={courseFilter}
                onChange={setCourseFilter}
                className="w-48"
              />
              <span className="text-sm text-gray-500">
                {filteredStudents.length} học viên
              </span>
            </div>
          </div>
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b-2 border-dashed border-[#E5E1DC]">
                  <th className="text-left py-3 px-3 font-['Comfortaa', cursive] text-[#263D5B] text-sm">Học viên</th>
                  <th className="text-left py-3 px-3 font-['Comfortaa', cursive] text-[#263D5B] text-sm">Khóa học</th>
                  <th className="text-left py-3 px-3 font-['Comfortaa', cursive] text-[#263D5B] text-sm">Tiến độ</th>
                  <th className="text-left py-3 px-3 font-['Comfortaa', cursive] text-[#263D5B] text-sm">Ngày đăng ký</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-[#E5E1DC]">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={student.name} size="sm" />
                          <span className="font-['Comfortaa', cursive] text-sm">{student.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-600">{student.course}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#49B6E5] rounded-full"
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-['Comfortaa', cursive]">{student.progress}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {student.enrolledDate}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      Không tìm thấy học viên nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Thống kê & Doanh thu */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doanh thu theo tháng */}
          <Card hoverable={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Comfortaa', cursive] text-xl text-[#263D5B]">
                Doanh thu theo tháng
              </h3>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                +8%
              </span>
            </div>
            <div className="flex items-end gap-2 h-40">
              {teacherRevenueData.map((item) => (
                <div key={item.label} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-[#49B6E5] rounded-t-md hover:bg-[#3aa8d4] transition-colors"
                    style={{ height: `${(item.value / maxRevenue) * 100}%` }}
                    title={`${item.value}M`}
                  />
                  <span className="text-xs text-gray-500">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-dashed border-[#E5E1DC]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Tổng doanh thu</p>
                  <p className="font-['Comfortaa', cursive] text-xl text-[#263D5B]">
                    {teacherRevenueData.reduce((a, b) => a + b.value, 0).toFixed(1)}M
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Học viên mới tháng này</p>
                  <p className="font-['Comfortaa', cursive] text-xl text-green-600">
                    +124
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Khóa học */}
          <Card hoverable={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Comfortaa', cursive] text-xl text-[#263D5B]">
                Khóa học của bạn
              </h3>
              <Link to="/teacher/courses">
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                  Thêm khóa học
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {teacherDashboardCourses.map((course) => (
                <div key={course.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-20 h-14 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-['Comfortaa', cursive] text-sm text-[#263D5B] truncate">
                      {course.title}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {course.students}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {course.rating}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={statusColors[course.status]}>
                      {course.status === 'completed' ? 'Hoàn thành' : 'Bản nháp'}
                    </Badge>
                    <p className="font-['Comfortaa', cursive] text-sm text-[#49B6E5] mt-1">
                      {formatPrice(course.revenue)}
                    </p>
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

export default TeacherDashboardPage;
