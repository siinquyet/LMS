import { useMemo, useState, useEffect } from 'react';
import { BookOpen, Calendar, Mail, Phone, Users, TrendingUp } from 'lucide-react';
import { Avatar, Badge, Button, Card, SearchInput, Select, Loader } from '../components/common';
import { useAuth } from '../contexts/AuthContext';
import { getInstructorStudents } from '../api';

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
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [progressFilter, setProgressFilter] = useState('all');

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const { hoc_vien: data } = await getInstructorStudents(user.id);
        setStudents(data || []);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [user?.id]);

  const courseOptions = useMemo(() => {
    const courses = students.reduce<string[]>((items, student) => {
      (student.khoa_hoc || []).forEach((c: any) => {
        if (c.tieu_de && !items.includes(c.tieu_de)) items.push(c.tieu_de);
      });
      return items;
    }, []);
    return [{ value: 'all', label: 'Tất cả khóa học' }, ...courses.map(c => ({ value: c, label: c }))];
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((student: any) => {
      const name = `${student.ho} ${student.ten}`.trim();
      const keyword = search.trim().toLowerCase();
      const matchesSearch = !keyword || name.toLowerCase().includes(keyword) || student.email?.toLowerCase().includes(keyword);
      return matchesSearch;
    });
  }, [students, search]);

  const summary = useMemo(() => {
    const total = students.length;
    return { total, activeCount: total, riskCount: 0, avgProgress: 0 };
  }, [students]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-['Comfortaa', cursive] text-3xl text-[#263D5B]">Học viên</h1>
            <p className="text-gray-600 mt-2">Theo dõi danh sách học viên, tiến độ học và những trường hợp cần hỗ trợ.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card hoverable={false}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tổng học viên</p>
                <p className="font-['Comfortaa', cursive] text-2xl text-[#263D5B]">{summary.total}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#E8F6FC] text-[#49B6E5]"><Users className="w-5 h-5" /></div>
            </div>
          </Card>
        </div>

        <Card>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Tìm theo tên, email hoặc khóa học..."
          />
        </Card>

        <Card hoverable={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-dashed border-[#E5E1DC] text-left">
                  <th className="py-3 pr-4 font-['Comfortaa', cursive] text-sm text-[#263D5B]">Học viên</th>
                  <th className="py-3 pr-4 font-['Comfortaa', cursive] text-sm text-[#263D5B]">Khóa học</th>
                  <th className="py-3 pr-4 font-['Comfortaa', cursive] text-sm text-[#263D5B]">Tiến độ</th>
                  <th className="py-3 pr-4 font-['Comfortaa', cursive] text-sm text-[#263D5B]">Ngày đăng ký</th>
                  <th className="py-3 font-['Comfortaa', cursive] text-sm text-[#263D5B]">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student: any) => (
                    <tr key={student.id} className="border-b border-[#E5E1DC]">
                      <td className="py-4 pr-4">
                        <div className="flex items-start gap-3">
                          <Avatar name={`${student.ho} ${student.ten}`} size="sm" />
                          <div className="min-w-0">
                            <p className="font-['Comfortaa', cursive] text-sm text-[#263D5B]">{student.ho} {student.ten}</p>
                            <div className="mt-2 space-y-1 text-sm text-gray-500">
                              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" />{student.email}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-sm text-gray-600">
                        {student.khoa_hoc?.[0]?.tieu_de || 'N/A'}
                      </td>
                      <td className="py-4 pr-4">-</td>
                      <td className="py-4 pr-4 text-sm text-gray-500">
                        {student.khoa_hoc?.[0]?.ngay_dang_ky || 'N/A'}
                      </td>
                      <td className="py-4">
                        <Badge variant="success">Đang học</Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500">
                      Không tìm thấy học viên
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherStudentsPage;