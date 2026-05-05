import type { FC } from 'react';
import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  Star,
  Plus,
  TrendingUp
} from 'lucide-react';
import { Card, Button, Badge, Avatar, Loader } from '../components/common';
import { useAuth } from '../contexts/AuthContext';
import { getCourses, getInstructorAnalytics } from '../api';

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price);

export const TeacherDashboardPage: FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const [coursesData, analyticsData] = await Promise.all([
          getCourses({ instructorId: user.id }),
          getInstructorAnalytics(user.id)
        ]);
        setCourses(coursesData.courses || []);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-['Comfortaa', cursive] text-gray-500 text-sm">Tổng khóa học</span>
            </div>
            <p className="font-['Comfortaa', cursive] text-3xl text-[#263D5B]">{courses.length}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <span className="font-['Comfortaa', cursive] text-gray-500 text-sm">Tổng học viên</span>
            </div>
            <p className="font-['Comfortaa', cursive] text-3xl text-[#263D5B]">{analytics?.tong_hoc_vien || 0}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="font-['Comfortaa', cursive] text-gray-500 text-sm">Tổng doanh thu</span>
            </div>
            <p className="font-['Comfortaa', cursive] text-3xl text-[#263D5B]">{formatPrice(analytics?.tong_doanh_thu || 0)}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <span className="font-['Comfortaa', cursive] text-gray-500 text-sm">Đăng ký gần đây</span>
            </div>
            <p className="font-['Comfortaa', cursive] text-3xl text-[#263D5B]">{(analytics?.dang_ky_gan_day || []).length}</p>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B]">Khóa học của tôi</h2>
            <Link to="/teacher/courses">
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4" />
                Thêm khóa học
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course: any) => (
              <Link key={course.id} to={`/teacher/courses/${course.id}`}>
                <Card hoverable className="p-4">
                  <img 
                    src={course.thumbnail || 'https://picsum.photos/seed/course/300/200'} 
                    alt={course.tieu_de}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-['Comfortaa', cursive] text-[#263D5B] mb-2">{course.tieu_de}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{course.so_luong_da_dang_ky || 0} học viên</span>
                    <Badge variant={course.trang_thai === 'approved' ? 'success' : 'warning'}>
                      {course.trang_thai === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                    </Badge>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] mb-4">Đăng ký gần đây</h2>
          <div className="space-y-3">
            {(analytics?.dang_ky_gan_day || []).map(( enrollment: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar name={enrollment.ho_ten} size="sm" />
                  <div>
                    <p className="font-['Comfortaa', cursive] text-sm text-[#263D5B]">{enrollment.ho_ten}</p>
                    <p className="text-xs text-gray-500">{enrollment.khoa_hoc}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{enrollment.ngay_dang_ky}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboardPage;