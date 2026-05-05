import { useState, useEffect } from 'react';
import { RotateCcw, TrendingUp } from 'lucide-react';
import { Card, Badge, Button, Loader } from '../components/common';
import { getOrders, refundOrder } from '../api';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price);
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN');
};

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { orders: data } = await getOrders();
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleRefund = async (id: number) => {
    if (!confirm('Bạn có chắc muốn hoàn tiền đơn hàng này?')) return;
    try {
      await refundOrder(id);
      setOrders(orders.map(o => o.id === id ? { ...o, trang_thai: 'refunded' } : o));
    } catch (error) {
      console.error('Error refunding:', error);
    }
  };

  const filteredOrders = orders.filter((o: any) => {
    const matchesSearch = o.user?.ten?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items?.[0]?.khoa_hoc?.tieu_de?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesDate = true;
    if (startDate && o.ngay_dat < startDate) matchesDate = false;
    if (endDate && o.ngay_dat > endDate) matchesDate = false;
    
    return matchesSearch && matchesDate;
  });

  const totalRevenue = filteredOrders.filter((o: any) => o.trang_thai === 'success').reduce((sum, o) => sum + o.tong_tien, 0);
  const monthlyRevenue = orders.filter((o: any) => o.trang_thai === 'success' && o.ngay_dat?.startsWith('2024-07')).reduce((sum, o) => sum + o.tong_tien, 0);

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
          <p className="font-['Comfortaa', cursive] text-sm text-green-600">{orders.filter((o: any) => o.trang_thai === 'refunded').length} đơn đã hoàn</p>
        </Card>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm đơn hàng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg font-['Comfortaa', cursive] text-sm focus:outline-none focus:border-[#49B6E5]"
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

      {loading ? <Loader /> : (
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
              {filteredOrders.map((order: any) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-['Comfortaa', cursive] text-[#263D5B] text-sm">#{order.id}</td>
                  <td className="py-3 px-4 font-['Comfortaa', cursive] text-gray-600 text-sm">
                    {order.user?.ho} {order.user?.ten}
                  </td>
                  <td className="py-3 px-4 font-['Comfortaa', cursive] text-gray-600 text-sm">
                    {order.items?.[0]?.khoa_hoc?.tieu_de}
                  </td>
                  <td className="py-3 px-4 font-['Comfortaa', cursive] text-gray-600 text-sm">{formatPrice(order.tong_tien)}</td>
                  <td className="py-3 px-4">
                    <Badge variant={order.trang_thai === 'success' ? 'success' : order.trang_thai === 'refunded' ? 'warning' : 'default'}>
                      {order.trang_thai === 'success' ? 'Thành công' : order.trang_thai === 'refunded' ? 'Đã hoàn' : 'Chờ'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-['Comfortaa', cursive] text-gray-600 text-sm">{formatDate(order.ngay_dat)}</td>
                  <td className="py-3 px-4">
                    {order.trang_thai === 'success' && (
                      <Button variant="outline" size="sm" onClick={() => handleRefund(order.id)}>
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Hoàn tiền
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      )}
    </div>
  );
};

export default AdminOrdersPage;