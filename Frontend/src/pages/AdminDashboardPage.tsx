import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowUpRight, BookOpen, Check, DollarSign, FileText, ShoppingCart, UserCheck, Users, X } from 'lucide-react';
import { Badge, Button, Card, Loader } from '../components/common';
import { getAdminOverview, getAnalytics, getCourses, getOrders } from '../api';

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price);

const statusMeta = {
  approved: { label: 'Đã duyệt', variant: 'success' as const },
  pending: { label: 'Chờ duyệt', variant: 'warning' as const },
  rejected: { label: 'Từ chối', variant: 'danger' as const },
  draft: { label: 'Bản nháp', variant: 'default' as const },
  success: { label: 'Thành công', variant: 'success' as const },
  failed: { label: 'Thất bại', variant: 'danger' as const },
};

export const AdminDashboardPage: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [overviewData, analyticsData, coursesData, ordersData] = await Promise.all([
          getAdminOverview(),
          getAnalytics(),
          getCourses(),
          getOrders()
        ]);
        setOverview(overviewData.overview);
        setAnalytics(analyticsData);
        setCourses(coursesData.courses || []);
        setOrders(ordersData.orders || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  const pendingCourses = courses.filter((c: any) => c.trang_thai === 'pending');
  const successOrders = orders.filter((o: any) => o.trang_thai === 'success');
  const totalRevenue = successOrders.reduce((sum: number, o: any) => sum + o.tong_tien, 0);
  const monthlyRevenue = successOrders.filter((o: any) => o.ngay_dat?.startsWith('2024-07')).reduce((sum: number, o: any) => sum + o.tong_tien, 0);
  const recentOrders = [...orders].sort((a: any, b: any) => new Date(b.ngay_dat).getTime() - new Date(a.ngay_dat).getTime()).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex gap-4 lg:gap-6 overflow-x-auto pb-2">
          <Card className="min-w-[200px] p-6 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-['Comfortaa', cursive] text-gray-500 text-sm">Tổng người dùng</span>
            </div>
            <p className="font-['Comfortaa', cursive] text-3xl text-[#263D5B]">{overview?.users || 0}</p>
          </Card>
          <Card className="min-w-[200px] p-6 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <span className="font-['Comfortaa', cursive] text-gray-500 text-sm">Tổng khóa học</span>
            </div>
            <p className="font-['Comfortaa', cursive] text-3xl text-[#263D5B]">{overview?.courses || 0}</p>
          </Card>
          <Card className="min-w-[200px] p-6 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="font-['Comfortaa', cursive] text-gray-500 text-sm">Tổng doanh thu</span>
            </div>
            <p className="font-['Comfortaa', cursive] text-3xl text-[#263D5B]">{formatPrice(overview?.revenue || 0)}</p>
          </Card>
          <Card className="min-w-[200px] p-6 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-purple-600" />
              </div>
              <span className="font-['Comfortaa', cursive] text-gray-500 text-sm">Chờ duyệt</span>
            </div>
            <p className="font-['Comfortaa', cursive] text-3xl text-[#263D5B]">{overview?.pending_courses || 0}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B]">Khóa học chờ duyệt</h2>
              <Link to="/admin/courses">
                <Button variant="outline" size="sm">Xem tất cả</Button>
              </Link>
            </div>
            <div className="space-y-3">
              {pendingCourses.length === 0 ? (
                <p className="font-['Comfortaa', cursive] text-gray-500 text-sm">Không có khóa học nào chờ duyệt</p>
              ) : (
                pendingCourses.slice(0, 4).map((course: any) => (
                  <div key={course.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <img src={course.thumbnail || 'https://picsum.photos/seed/course/100/100'} alt={course.tieu_de} className="w-16 h-12 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-['Comfortaa', cursive] text-[#263D5B] text-sm truncate">{course.tieu_de}</h3>
                      <p className="font-['Comfortaa', cursive] text-xs text-gray-500">{course.giang_vien?.ten}</p>
                    </div>
                    <Badge variant="warning">{course.trang_thai}</Badge>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B]">Đơn hàng gần đây</h2>
              <Link to="/admin/orders">
                <Button variant="outline" size="sm">Xem tất cả</Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-['Comfortaa', cursive] text-[#263D5B] text-sm">#{order.id} - {order.items?.[0]?.khoa_hoc?.tieu_de}</h3>
                    <p className="font-['Comfortaa', cursive] text-xs text-gray-500">{order.user?.ho} {order.user?.ten}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-['Comfortaa', cursive] text-[#263D5B] text-sm">{formatPrice(order.tong_tien)}</p>
                    <Badge variant={order.trang_thai === 'success' ? 'success' : 'default'}>{order.trang_thai}</Badge>
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