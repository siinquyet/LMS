import { useState } from 'react';
import { Check, X, Search, TrendingUp } from 'lucide-react';
import { Card, Badge } from '../components/common';
import { adminMonthRevenue, adminOrders } from '../mockData';

interface Order {
  id: number;
  user: string;
  course: string;
  amount: number;
  status: 'success';
  date: string;
}

const maxRevenue = Math.max(...adminMonthRevenue.map(m => m.revenue));

const formatPrice = (price: number) => {
  if (price >= 1000000) {
    return (price / 1000000).toFixed(1) + 'M';
  }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price);
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN');
};

export const AdminReportsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredOrders = adminOrders.filter(o => {
    const matchesSearch = o.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.course.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesDate = true;
    if (startDate && o.date < startDate) matchesDate = false;
    if (endDate && o.date > endDate) matchesDate = false;
    
    return matchesSearch && matchesDate;
  });

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.amount, 0);
  const currentMonthRevenue = adminMonthRevenue.find(m => m.month === 'T7')?.revenue || 0;
  const prevMonthRevenue = adminMonthRevenue.find(m => m.month === 'T6')?.revenue || 1;
  const percentChange = ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue * 100).toFixed(0);

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-['Comfortaa', cursive] text-3xl text-[#263D5B]">Báo cáo</h1>
          <p className="font-['Comfortaa', cursive] text-gray-500 mt-1">Thống kê doanh thu</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white border-2 border-[#263D5B] rounded-[16px] p-6 shadow-[3px_3px_0px_#E5E1DC] transition-all duration-200 ease-out overflow-visible">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-['Comfortaa', cursive] text-xl text-[#263D5B]">Doanh thu theo tháng</h3>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-600" />+{percentChange}%
            </span>
          </div>
          <div className="flex items-end gap-2 h-40">
            {adminMonthRevenue.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-[#49B6E5] rounded-t-md hover:bg-[#3aa8d4] transition-colors" 
                  style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                  title={formatPrice(item.revenue)}
                />
                <span className="text-xs text-gray-500">{item.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-dashed border-[#E5E1DC]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Tổng doanh thu</p>
                <p className="font-['Comfortaa', cursive] text-xl text-[#263D5B]">{formatPrice(totalRevenue)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Học viên mới tháng này</p>
                <p className="font-['Comfortaa', cursive] text-xl text-green-600">+124</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="font-['Comfortaa', cursive] text-gray-500 text-sm">Doanh thu tháng này</span>
          </div>
          <p className="font-['Comfortaa', cursive] text-2xl text-[#263D5B]">{formatPrice(currentMonthRevenue)}</p>
          <p className="font-['Comfortaa', cursive] text-sm text-green-600">+{percentChange}%</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-['Comfortaa', cursive] text-gray-500 text-sm">Tổng đơn hàng</span>
          </div>
          <p className="font-['Comfortaa', cursive] text-2xl text-[#263D5B]">{adminOrders.length}</p>
          <p className="font-['Comfortaa', cursive] text-sm text-gray-500">Đơn hàng thành công</p>
        </Card>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm đơn hàng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg font-['Comfortaa', cursive] text-sm focus:outline-none focus:border-[#49B6E5]"
          />
        </div>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg font-['Comfortaa', cursive] text-sm"
        />
        <span className="flex items-center text-gray-400">-</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg font-['Comfortaa', cursive] text-sm"
        />
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-['Comfortaa', cursive] text-gray-500 text-sm">Mã đơn</th>
                <th className="text-left py-3 px-4 font-['Comfortaa', cursive] text-gray-500 text-sm">Khách hàng</th>
                <th className="text-left py-3 px-4 font-['Comfortaa', cursive] text-gray-500 text-sm">Khóa học</th>
                <th className="text-left py-3 px-4 font-['Comfortaa', cursive] text-gray-500 text-sm">Số tiền</th>
                <th className="text-left py-3 px-4 font-['Comfortaa', cursive] text-gray-500 text-sm">Trạng thái</th>
                <th className="text-left py-3 px-4 font-['Comfortaa', cursive] text-gray-500 text-sm">Ngày</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-['Comfortaa', cursive] text-[#263D5B] text-sm">#{order.id}</td>
                  <td className="py-3 px-4 font-['Comfortaa', cursive] text-gray-600 text-sm">{order.user}</td>
                  <td className="py-3 px-4 font-['Comfortaa', cursive] text-gray-600 text-sm">{order.course}</td>
                  <td className="py-3 px-4 font-['Comfortaa', cursive] text-[#263D5B] text-sm">{formatPrice(order.amount)}</td>
                  <td className="py-3 px-4">
                    <Badge variant="success">Thành công</Badge>
                  </td>
                  <td className="py-3 px-4 font-['Comfortaa', cursive] text-gray-600 text-sm">{formatDate(order.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminReportsPage;
