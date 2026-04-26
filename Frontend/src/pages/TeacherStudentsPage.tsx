import { useMemo, useState } from 'react';
import { BookOpen, Calendar, Mail, Phone, Users, TrendingUp } from 'lucide-react';
import { Avatar, Badge, Button, Card, SearchInput, Select } from '../components/common';
import { teacherStudents as mockStudents } from '../mockData';

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  course: string;
  progress: number;
  enrolledDate: string;
  lastActive: string;
  status: 'active' | 'at-risk' | 'completed';
}

const statusMeta = {
  active: { label: 'Đang học tốt', variant: 'success' as const },
  'at-risk': { label: 'Cần theo dõi', variant: 'warning' as const },
  completed: { label: 'Hoàn thành', variant: 'primary' as const },
};

const progressOptions = [
  { value: 'all', label: 'Mọi tiến độ' },
  { value: 'low', label: 'Dưới 30%' },
  { value: 'mid', label: '30% - 79%' },
  { value: 'high', label: 'Từ 80%' },
];

export const TeacherStudentsPage = () => {
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [progressFilter, setProgressFilter] = useState('all');

  const courseOptions = useMemo(() => {
    const courses = mockStudents.reduce<string[]>((items, student) => {
      if (!items.includes(student.course)) {
        items.push(student.course);
      }

      return items;
    }, []);

    return [
      { value: 'all', label: 'Tất cả khóa học' },
      ...courses.map((course) => ({ value: course, label: course })),
    ];
  }, []);

  const filteredStudents = useMemo(() => {
    return mockStudents.filter((student) => {
      const keyword = search.trim().toLowerCase();
      const matchesSearch =
        !keyword ||
        student.name.toLowerCase().includes(keyword) ||
        student.email.toLowerCase().includes(keyword) ||
        student.course.toLowerCase().includes(keyword);
      const matchesCourse = courseFilter === 'all' || student.course === courseFilter;
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
      const matchesProgress =
        progressFilter === 'all' ||
        (progressFilter === 'low' && student.progress < 30) ||
        (progressFilter === 'mid' && student.progress >= 30 && student.progress < 80) ||
        (progressFilter === 'high' && student.progress >= 80);

      return matchesSearch && matchesCourse && matchesStatus && matchesProgress;
    });
  }, [courseFilter, progressFilter, search, statusFilter]);

  const summary = useMemo(() => {
    const activeCount = mockStudents.filter((student) => student.status === 'active').length;
    const riskCount = mockStudents.filter((student) => student.status === 'at-risk').length;
    const avgProgress = Math.round(mockStudents.reduce((sum, student) => sum + student.progress, 0) / mockStudents.length);

    return {
      total: mockStudents.length,
      activeCount,
      riskCount,
      avgProgress,
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-['Comfortaa',_cursive] text-3xl text-[#263D5B]">Học viên</h1>
            <p className="text-gray-600 mt-2">Theo dõi danh sách học viên, tiến độ học và những trường hợp cần hỗ trợ.</p>
          </div>
          <Button variant="secondary">
            <Users className="w-4 h-4" />
            {filteredStudents.length} học viên hiển thị
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card hoverable={false}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tổng học viên</p>
                <p className="font-['Comfortaa',_cursive] text-2xl text-[#263D5B]">{summary.total}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#E8F6FC] text-[#49B6E5]"><Users className="w-5 h-5" /></div>
            </div>
          </Card>
          <Card hoverable={false}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Đang học tốt</p>
                <p className="font-['Comfortaa',_cursive] text-2xl text-[#263D5B]">{summary.activeCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#ECFDF5] text-[#16A34A]"><TrendingUp className="w-5 h-5" /></div>
            </div>
          </Card>
          <Card hoverable={false}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Cần theo dõi</p>
                <p className="font-['Comfortaa',_cursive] text-2xl text-[#263D5B]">{summary.riskCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#FFFBEB] text-[#D97706]"><Calendar className="w-5 h-5" /></div>
            </div>
          </Card>
          <Card hoverable={false}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tiến độ trung bình</p>
                <p className="font-['Comfortaa',_cursive] text-2xl text-[#263D5B]">{summary.avgProgress}%</p>
              </div>
              <div className="p-3 rounded-xl bg-[#EEF2FF] text-[#4F46E5]"><BookOpen className="w-5 h-5" /></div>
            </div>
          </Card>
        </div>

        <Card hoverable={false}>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] gap-4">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Tìm theo tên, email hoặc khóa học..."
            />
            <Select options={courseOptions} value={courseFilter} onChange={setCourseFilter} />
            <Select
              options={[
                { value: 'all', label: 'Mọi trạng thái' },
                { value: 'active', label: 'Đang học tốt' },
                { value: 'at-risk', label: 'Cần theo dõi' },
                { value: 'completed', label: 'Hoàn thành' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
            />
            <Select options={progressOptions} value={progressFilter} onChange={setProgressFilter} />
          </div>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2.2fr)_minmax(280px,1fr)] gap-6">
          <Card hoverable={false} className="overflow-hidden">
            <div className="flex items-center justify-between mb-4 gap-3">
              <div>
                <h2 className="font-['Comfortaa',_cursive] text-xl text-[#263D5B]">Danh sách học viên</h2>
                <p className="text-sm text-gray-500 mt-1">{filteredStudents.length} kết quả sau khi lọc</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px]">
                <thead>
                  <tr className="border-b-2 border-dashed border-[#E5E1DC] text-left">
                    <th className="py-3 pr-4 font-['Comfortaa',_cursive] text-sm text-[#263D5B]">Học viên</th>
                    <th className="py-3 pr-4 font-['Comfortaa',_cursive] text-sm text-[#263D5B]">Khóa học</th>
                    <th className="py-3 pr-4 font-['Comfortaa',_cursive] text-sm text-[#263D5B]">Tiến độ</th>
                    <th className="py-3 pr-4 font-['Comfortaa',_cursive] text-sm text-[#263D5B]">Ngày đăng ký</th>
                    <th className="py-3 font-['Comfortaa',_cursive] text-sm text-[#263D5B]">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr key={student.id} className="border-b border-[#E5E1DC] last:border-b-0 align-top">
                        <td className="py-4 pr-4">
                          <div className="flex items-start gap-3">
                            <Avatar name={student.name} size="sm" />
                            <div className="min-w-0">
                              <p className="font-['Comfortaa',_cursive] text-sm text-[#263D5B]">{student.name}</p>
                              <div className="mt-2 space-y-1 text-sm text-gray-500">
                                <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" />{student.email}</p>
                                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{student.phone}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 pr-4 text-sm text-gray-600">{student.course}</td>
                        <td className="py-4 pr-4">
                          <div className="min-w-[180px]">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-gray-500">Hoàn thành</span>
                              <span className="font-['Comfortaa',_cursive] text-[#263D5B]">{student.progress}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
                              <div className="h-full rounded-full bg-[#49B6E5]" style={{ width: `${student.progress}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 pr-4 text-sm text-gray-500">
                          <p>{student.enrolledDate}</p>
                          <p className="mt-1">Hoạt động: {student.lastActive}</p>
                        </td>
                        <td className="py-4">
                          <Badge variant={statusMeta[student.status].variant}>{statusMeta[student.status].label}</Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-500">
                        Không tìm thấy học viên phù hợp với bộ lọc hiện tại.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="space-y-6">
            <Card hoverable={false}>
              <h2 className="font-['Comfortaa',_cursive] text-xl text-[#263D5B] mb-4">Nhóm cần chú ý</h2>
              <div className="space-y-3">
                {mockStudents.filter((student) => student.status === 'at-risk').map((student) => (
                  <div key={student.id} className="rounded-xl border border-[#E5E1DC] p-4 bg-[#FFFBEB]">
                    <div className="flex items-start gap-3">
                      <Avatar name={student.name} size="sm" />
                      <div className="min-w-0">
                        <p className="font-['Comfortaa',_cursive] text-sm text-[#263D5B]">{student.name}</p>
                        <p className="text-sm text-gray-600 mt-1">{student.course}</p>
                        <p className="text-sm text-[#D97706] mt-2">Tiến độ {student.progress}% và hoạt động gần nhất {student.lastActive}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card hoverable={false}>
              <h2 className="font-['Comfortaa',_cursive] text-xl text-[#263D5B] mb-4">Phân bố theo khóa học</h2>
              <div className="space-y-4">
                {courseOptions.slice(1).map((courseOption) => {
                  const total = mockStudents.filter((student) => student.course === courseOption.value).length;
                  const width = summary.total === 0 ? 0 : Math.round((total / summary.total) * 100);

                  return (
                    <div key={courseOption.value}>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-[#263D5B]">{courseOption.label}</span>
                        <span className="font-['Comfortaa',_cursive] text-gray-500">{total} học viên</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
                        <div className="h-full rounded-full bg-[#263D5B]" style={{ width: `${width}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherStudentsPage;
