import { useState } from 'react';
import { RotateCcw, Search, TrendingUp } from 'lucide-react';
import { Card, Badge, Button } from '../components/common';
import { adminOrders } from '../mockData';

interface Order {
  id: number;
  user: string;
  course: string;
  amount: number;
  status: 'success' | 'refunded';
  date: string;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price);
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN');
};

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(adminOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.course.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesDate = true;
    if (startDate && o.date < startDate) matchesDate = false;
    if (endDate && o.date > endDate) matchesDate = false;
    
    return matchesSearch && matchesDate;
  });

  const totalRevenue = filteredOrders.filter((order) => order.status === 'success').reduce((sum, o) => sum + o.amount, 0);
  const monthlyRevenue = orders.filter((order) => order.status === 'success' && order.date.startsWith('2024-07')).reduce((sum, order) => sum + order.amount, 0);

  const handleRefund = (id: number) => {
    setOrders((current) => current.map((order) => (order.id === id ? { ...order, status: 'refunded' } : order)));
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-['Comfortaa', cursive] text-3xl text-[#263D5B]">Quản lý đơn hàng</h1>
          <p className="font-['Comfortaa', cursive] text-gray-500 mt-1">Theo dõi đơn hàng của học viên</p>
        </div>
        <div className="text-right">
          <p className="font-['Comfortaa', cursive] text-sm text-gray-500">Tổng doanh thu</p>
          <p className="font-['Comfortaa', cursive] text-2xl text-[#263D5B]">{formatPrice(totalRevenue)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="font-['Comfortaa', cursive] text-gray-500 text-sm">Doanh thu tháng này</span>
          </div>
          <p className="font-['Comfortaa', cursive] text-2xl text-[#263D5B]">{formatPrice(monthlyRevenue)}</p>
          <p className="font-['Comfortaa', cursive] text-sm text-green-600">{orders.filter((order) => order.status === 'refunded').length} đơn đã hoàn</p>
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
                <th className="text-left py-3 px-4 font-['Comfortaa', cursive] text-gray-500 text-sm">Thao tác</th>
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
                    <Badge variant={order.status === 'refunded' ? 'warning' : 'success'}>{order.status === 'refunded' ? 'Đã hoàn tiền' : 'Thành công'}</Badge>
                  </td>
                  <td className="py-3 px-4 font-['Comfortaa', cursive] text-gray-600 text-sm">{formatDate(order.date)}</td>
                  <td className="py-3 px-4">
                    {order.status === 'success' ? (
                      <Button size="sm" variant="outline" onClick={() => handleRefund(order.id)}>
                        <RotateCcw className="w-4 h-4" />
                        Hoàn tiền
                      </Button>
                    ) : (
                      <span className="font-['Comfortaa', cursive] text-xs text-gray-400">Đã xử lý</span>
                    )}
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

export default AdminOrdersPage;
