import React, { useState } from 'react';
import { BookOpen, Check, X, Eye, Search } from 'lucide-react';
import { Card, Badge } from '../components/common';

interface Course {
  id: number;
  title: string;
  instructor: string;
  thumbnail: string;
  students: number;
  price: number;
  status: 'approved' | 'pending' | 'rejected' | 'draft';
  category: string;
}

const mockCourses: Course[] = [
  { id: 1, title: 'React & Next.js Full Course', instructor: 'Teacher', thumbnail: 'https://picsum.photos/seed/react/300/200', students: 1250, price: 699000, status: 'approved', category: 'Lập trình' },
  { id: 2, title: 'TypeScript Fundamentals', instructor: 'Teacher', thumbnail: 'https://picsum.photos/seed/ts/300/200', students: 890, price: 499000, status: 'approved', category: 'Lập trình' },
  { id: 3, title: 'Node.js Backend', instructor: 'Teacher', thumbnail: 'https://picsum.photos/seed/node/300/200', students: 200, price: 799000, status: 'pending', category: 'Lập trình' },
];

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger'> = {
  approved: 'success', pending: 'warning', rejected: 'danger', draft: 'default',
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price);
};

export const AdminCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState(mockCourses);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleApprove = (id: number) => {
    setCourses(courses.map(c => c.id === id ? { ...c, status: 'approved' } : c));
  };

  const handleReject = (id: number) => {
    setCourses(courses.map(c => c.id === id ? { ...c, status: 'rejected' } : c));
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCourses = courses.filter(c => c.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-['Comfortaa', cursive] text-3xl text-[#263D5B]">Quản lý khóa học</h1>
          <p className="font-['Comfortaa', cursive] text-gray-500 mt-1">Duyệt khóa học của giảng viên ({pendingCourses.length} chờ)</p>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg font-['Comfortaa', cursive] text-sm focus:outline-none focus:border-[#49B6E5]"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg font-['Comfortaa', cursive] text-sm"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Từ chối</option>
          <option value="draft">Nháp</option>
        </select>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-['Comfortaa', cursive] text-gray-500 text-sm">Khóa học</th>
                <th className="text-left py-3 px-4 font-['Comfortaa', cursive] text-gray-500 text-sm">Giảng viên</th>
                <th className="text-left py-3 px-4 font-['Comfortaa', cursive] text-gray-500 text-sm">Giá</th>
                <th className="text-left py-3 px-4 font-['Comfortaa', cursive] text-gray-500 text-sm">Trạng thái</th>
                <th className="text-left py-3 px-4 font-['Comfortaa', cursive] text-gray-500 text-sm">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={course.thumbnail} alt={course.title} className="w-12 h-8 object-cover rounded" />
                      <span className="font-['Comfortaa', cursive] text-[#263D5B] text-sm">{course.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-['Comfortaa', cursive] text-gray-600 text-sm">{course.instructor}</td>
                  <td className="py-3 px-4 font-['Comfortaa', cursive] text-[#263D5B] text-sm">{formatPrice(course.price)}</td>
                  <td className="py-3 px-4">
                    <Badge variant={statusColors[course.status]}>
                      {course.status === 'approved' ? 'Đã duyệt' : course.status === 'pending' ? 'Chờ duyệt' : course.status === 'rejected' ? 'Từ chối' : 'Nháp'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button type="button" className="p-1 text-gray-500 hover:text-[#49B6E5]"><Eye className="w-4 h-4" /></button>
                      {course.status === 'pending' && (
                        <>
                          <button type="button" onClick={() => handleApprove(course.id)} className="p-1 text-green-500 hover:text-green-600" title="Duyệt"><Check className="w-4 h-4" /></button>
                          <button type="button" onClick={() => handleReject(course.id)} className="p-1 text-red-500 hover:text-red-600" title="Từ chối"><X className="w-4 h-4" /></button>
                        </>
                      )}
                      {course.status === 'approved' && (
                        <button type="button" onClick={() => handleReject(course.id)} className="p-1 text-red-500 hover:text-red-600" title="Hủy duyệt"><X className="w-4 h-4" /></button>
                      )}
                      {course.status === 'rejected' && (
                        <button type="button" onClick={() => handleApprove(course.id)} className="p-1 text-green-500 hover:text-green-600" title="Duyệt lại"><Check className="w-4 h-4" /></button>
                      )}
                    </div>
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

export default AdminCoursesPage;