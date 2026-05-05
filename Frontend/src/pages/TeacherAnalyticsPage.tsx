import { useState, useEffect } from 'react';
import { BarChart3, DollarSign, TrendingUp, Users } from 'lucide-react';
import { Card, Badge, Loader } from '../components/common';
import { useAuth } from '../contexts/AuthContext';
import { getInstructorAnalytics } from '../api';

const formatPrice = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);

export const TeacherAnalyticsPage = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const data = await getInstructorAnalytics(user.id);
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [user?.id]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="font-['Comfortaa', cursive] text-3xl text-[#263D5B]">Thống kê</h1>
          <p className="text-gray-600 mt-2">Theo dõi doanh thu và hiệu suất khóa học</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <span className="font-['Comfortaa', cursive] text-gray-500 text-sm">Tổng doanh thu</span>
            </div>
            <p className="font-['Comfortaa', cursive] text-3xl text-[#263D5B]">{formatPrice(analytics?.tong_doanh_thu || 0)}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-['Comfortaa', cursive] text-gray-500 text-sm">Tổng học viên</span>
            </div>
            <p className="font-['Comfortaa', cursive] text-3xl text-[#263D5B]">{analytics?.tong_hoc_vien || 0}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <span className="font-['Comfortaa', cursive] text-gray-500 text-sm">Số khóa học</span>
            </div>
            <p className="font-['Comfortaa', cursive] text-3xl text-[#263D5B]">{analytics?.so_khoa_hoc || 0}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="font-['Comfortaa', cursive] text-gray-500 text-sm">Đăng ký gần đây</span>
            </div>
            <p className="font-['Comfortaa', cursive] text-3xl text-[#263D5B]">{(analytics?.dang_ky_gan_day || []).length}</p>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] mb-4">Doanh thu theo khóa học</h2>
          <div className="space-y-4">
            {(analytics?.khoa_hoc || []).map((course: any) => (
              <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-['Comfortaa', cursive] text-[#263D5B]">{course.tieu_de}</p>
                  <p className="text-sm text-gray-500">{course.so_luong_da_dang_ky} học viên</p>
                </div>
                <div className="text-right">
                  <p className="font-['Comfortaa', cursive] text-[#263D5B]">{formatPrice(course.doanh_thu)}</p>
                  <p className="text-sm text-gray-500">{formatPrice(course.gia)}/học viên</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherAnalyticsPage;