import { useMemo, useState } from 'react';
import { BarChart3, DollarSign, TrendingUp, Users } from 'lucide-react';
import { Badge, Card, SearchInput, Select } from '../components/common';
import { teacherAnalyticsRevenueData as revenueData } from '../mockData';

interface RevenueItem {
  id: number;
  course: string;
  category: string;
  period: string;
  status: 'draft' | 'pending' | 'approved' | 'completed';
  students: number;
  orders: number;
  revenue: number;
  growth: number;
}

const statusMeta = {
  draft: { label: 'Bản nháp', variant: 'default' as const },
  pending: { label: 'Chờ duyệt', variant: 'warning' as const },
  approved: { label: 'Đã duyệt', variant: 'success' as const },
  completed: { label: 'Hoàn thành', variant: 'primary' as const },
};

const formatPrice = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);

const formatPeriod = (period: string) => {
  const [year, month] = period.split('-');
  return `Tháng ${month}/${year}`;
};

export const TeacherAnalyticsPage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const periodOptions = useMemo(() => {
    const periods = revenueData.reduce<string[]>((items, item) => {
      if (!items.includes(item.period)) {
        items.push(item.period);
      }
      return items;
    }, []);

    return [{ value: 'all', label: 'Mọi kỳ báo cáo' }, ...periods.map((period) => ({ value: period, label: formatPeriod(period) }))];
  }, []);

  const categoryOptions = useMemo(() => {
    const categories = revenueData.reduce<string[]>((items, item) => {
      if (!items.includes(item.category)) {
        items.push(item.category);
      }
      return items;
    }, []);

    return [{ value: 'all', label: 'Mọi danh mục' }, ...categories.map((category) => ({ value: category, label: category }))];
  }, []);

  const filteredData = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return revenueData.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.course.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword) ||
        formatPeriod(item.period).toLowerCase().includes(keyword);
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesPeriod = periodFilter === 'all' || item.period === periodFilter;
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesPeriod && matchesCategory;
    });
  }, [categoryFilter, periodFilter, search, statusFilter]);

  const summary = useMemo(() => {
    const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0);
    const totalStudents = filteredData.reduce((sum, item) => sum + item.students, 0);
    const totalOrders = filteredData.reduce((sum, item) => sum + item.orders, 0);
    const avgGrowth = filteredData.length === 0 ? 0 : Math.round(filteredData.reduce((sum, item) => sum + item.growth, 0) / filteredData.length);

    return { totalRevenue, totalStudents, totalOrders, avgGrowth };
  }, [filteredData]);

  const topCourses = useMemo(() => {
    const grouped = filteredData.reduce<Record<string, { revenue: number; students: number }>>((acc, item) => {
      if (!acc[item.course]) {
        acc[item.course] = { revenue: 0, students: 0 };
      }

      acc[item.course].revenue += item.revenue;
      acc[item.course].students += item.students;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([course, data]) => ({ course, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4);
  }, [filteredData]);

  const maxRevenue = filteredData.length === 0 ? 0 : Math.max(...filteredData.map((item) => item.revenue));

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="font-['Comfortaa', cursive] text-3xl text-[#263D5B]">Thống kê doanh thu</h1>
          <p className="text-gray-600 mt-2">Theo dõi hiệu quả bán khóa học, đơn hàng và doanh thu theo từng kỳ.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card hoverable={false}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tổng doanh thu</p>
                <p className="font-['Comfortaa', cursive] text-2xl text-[#263D5B]">{formatPrice(summary.totalRevenue)}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#E8F6FC] text-[#49B6E5]"><DollarSign className="w-5 h-5" /></div>
            </div>
          </Card>
          <Card hoverable={false}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tổng đơn hàng</p>
                <p className="font-['Comfortaa', cursive] text-2xl text-[#263D5B]">{summary.totalOrders}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#EEF2FF] text-[#4F46E5]"><BarChart3 className="w-5 h-5" /></div>
            </div>
          </Card>
          <Card hoverable={false}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Học viên ghi nhận</p>
                <p className="font-['Comfortaa', cursive] text-2xl text-[#263D5B]">{summary.totalStudents}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#ECFDF5] text-[#16A34A]"><Users className="w-5 h-5" /></div>
            </div>
          </Card>
          <Card hoverable={false}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Tăng trưởng TB</p>
                <p className={`font-['Comfortaa', cursive] text-2xl ${summary.avgGrowth >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>{summary.avgGrowth}%</p>
              </div>
              <div className={`p-3 rounded-xl ${summary.avgGrowth >= 0 ? 'bg-[#ECFDF5] text-[#16A34A]' : 'bg-[#FEF2F2] text-[#DC2626]'}`}><TrendingUp className="w-5 h-5" /></div>
            </div>
          </Card>
        </div>

        <Card hoverable={false}>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] gap-4">
            <SearchInput value={search} onChange={setSearch} placeholder="Tìm theo tên khóa học, danh mục hoặc kỳ báo cáo..." />
            <Select options={categoryOptions} value={categoryFilter} onChange={setCategoryFilter} />
            <Select
              options={[
                { value: 'all', label: 'Mọi trạng thái' },
                { value: 'draft', label: 'Bản nháp' },
                { value: 'pending', label: 'Chờ duyệt' },
                { value: 'approved', label: 'Đã duyệt' },
                { value: 'completed', label: 'Hoàn thành' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
            />
            <Select options={periodOptions} value={periodFilter} onChange={setPeriodFilter} />
          </div>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2.1fr)_minmax(280px,1fr)] gap-6">
          <Card hoverable={false} className="overflow-hidden">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B]">Báo cáo doanh thu</h2>
                <p className="text-sm text-gray-500 mt-1">{filteredData.length} dòng dữ liệu phù hợp</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b-2 border-dashed border-[#E5E1DC] text-left">
                    <th className="py-3 pr-4 font-['Comfortaa', cursive] text-sm text-[#263D5B]">Khóa học</th>
                    <th className="py-3 pr-4 font-['Comfortaa', cursive] text-sm text-[#263D5B]">Kỳ báo cáo</th>
                    <th className="py-3 pr-4 font-['Comfortaa', cursive] text-sm text-[#263D5B]">Học viên</th>
                    <th className="py-3 pr-4 font-['Comfortaa', cursive] text-sm text-[#263D5B]">Đơn hàng</th>
                    <th className="py-3 pr-4 font-['Comfortaa', cursive] text-sm text-[#263D5B]">Doanh thu</th>
                    <th className="py-3 pr-4 font-['Comfortaa', cursive] text-sm text-[#263D5B]">Tăng trưởng</th>
                    <th className="py-3 font-['Comfortaa', cursive] text-sm text-[#263D5B]">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr key={item.id} className="border-b border-[#E5E1DC] last:border-b-0">
                        <td className="py-4 pr-4">
                          <p className="font-['Comfortaa', cursive] text-sm text-[#263D5B]">{item.course}</p>
                          <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                        </td>
                        <td className="py-4 pr-4 text-sm text-gray-600">{formatPeriod(item.period)}</td>
                        <td className="py-4 pr-4 text-sm text-gray-600">{item.students}</td>
                        <td className="py-4 pr-4 text-sm text-gray-600">{item.orders}</td>
                        <td className="py-4 pr-4 font-['Comfortaa', cursive] text-sm text-[#49B6E5]">{formatPrice(item.revenue)}</td>
                        <td className={`py-4 pr-4 text-sm font-['Comfortaa', cursive] ${item.growth >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>{item.growth >= 0 ? '+' : ''}{item.growth}%</td>
                        <td className="py-4"><Badge variant={statusMeta[item.status].variant}>{statusMeta[item.status].label}</Badge></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-500">Không có dữ liệu doanh thu phù hợp với bộ lọc hiện tại.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="space-y-6">
            <Card hoverable={false}>
              <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] mb-4">Khóa học doanh thu cao</h2>
              <div className="space-y-4">
                {topCourses.length > 0 ? topCourses.map((item) => (
                  <div key={item.course}>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <p className="font-['Comfortaa', cursive] text-sm text-[#263D5B] truncate">{item.course}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.students} học viên</p>
                      </div>
                      <span className="text-sm text-[#49B6E5] font-['Comfortaa', cursive]">{formatPrice(item.revenue)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
                      <div className="h-full rounded-full bg-[#263D5B]" style={{ width: `${maxRevenue === 0 ? 0 : Math.round((item.revenue / maxRevenue) * 100)}%` }} />
                    </div>
                  </div>
                )) : <p className="text-sm text-gray-500">Chưa có dữ liệu để hiển thị.</p>}
              </div>
            </Card>

            <Card hoverable={false}>
              <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] mb-4">Gợi ý theo dõi</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="rounded-xl border border-[#E5E1DC] p-4 bg-[#F8F6F3]">
                  <p className="font-['Comfortaa', cursive] text-[#263D5B]">Tối ưu khóa học tăng trưởng âm</p>
                  <p className="mt-2">Ưu tiên kiểm tra các khóa học có doanh thu giảm để cập nhật nội dung hoặc đẩy khuyến mãi.</p>
                </div>
                <div className="rounded-xl border border-[#E5E1DC] p-4 bg-[#F8F6F3]">
                  <p className="font-['Comfortaa', cursive] text-[#263D5B]">Theo dõi trạng thái duyệt</p>
                  <p className="mt-2">Các khóa học ở trạng thái chờ duyệt hoặc bản nháp chưa tận dụng được hết doanh thu tiềm năng.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAnalyticsPage;
