import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button, Card, Avatar } from '../components/common';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../api';

type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

export const CartPage: React.FC = () => {
  const { items, removeItem, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [countdown, setCountdown] = useState(5);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = () => {
    if (!user) {
      setError('Vui lòng đăng nhập để thanh toán');
      return;
    }

    setPaymentStatus('processing');
    setCountdown(5);
    setError(null);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          
          // Enroll each course after payment - move logic outside callback
          (async () => {
            try {
              for (const item of items) {
                await api.enrollCourse(user.id, item.id);
              }
              setPaymentStatus('success');
              clearCart();
            } catch (err) {
              console.error('Enrollment failed:', err);
              setPaymentStatus('failed');
              setError('Đăng ký khóa học thất bại. Vui lòng thử lại.');
            }
          })();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F6F3] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-['Comfortaa', cursive] text-4xl text-[#263D5B] mb-8 flex items-center gap-3">
            <ShoppingCart className="w-10 h-10" />
            Giỏ hàng
          </h1>
          <Card className="text-center py-12">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-[#6B7280]" />
            <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] mb-2">
              Giỏ hàng trống
            </h2>
            <p className="font-['Comfortaa', cursive] text-[#6B7280] mb-6">
              Bạn chưa có khóa học nào trong giỏ
            </p>
            <Link to="/store">
              <Button variant="primary" size="lg">
                Khám phá khóa học
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F3] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-['Comfortaa', cursive] text-4xl text-[#263D5B] mb-8 flex items-center gap-3">
          <ShoppingCart className="w-10 h-10" />
          Giỏ hàng
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="flex gap-4">
                <img
                  src={item.thumbnail || 'https://picsum.photos/seed/course/300/200'}
                  alt={item.title}
                  className="w-32 h-24 object-cover rounded-[12px] border-2 border-[#263D5B]"
                />
                <div className="flex-1">
                  <h3 className="font-['Comfortaa', cursive] text-[#263D5B] text-lg mb-1 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar name={item.instructor} size="sm" />
                    <span className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">
                      {item.instructor}
                    </span>
                  </div>
                  <span className="font-['Comfortaa', cursive] text-xl text-[#263D5B] font-semibold">
                    {item.price.toLocaleString()}đ
                  </span>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="self-start p-2 text-[#DC2626] hover:bg-[#FEF2F2] rounded-[8px] transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </Card>
            ))}
          </div>

          {/* Payment Section */}
          <div>
            <Card className="sticky top-24">
              <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] mb-4">
                Thanh toán
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="font-['Comfortaa', cursive] text-[#6B7280]">
                    Tạm tính ({items.length} khóa học)
                  </span>
                  <span className="font-['Comfortaa', cursive] text-[#263D5B]">
                    {totalPrice.toLocaleString()}đ
                  </span>
                </div>
                <div className="border-t-2 border-dashed border-[#E5E1DC] pt-3">
                  <div className="flex justify-between">
                    <span className="font-['Comfortaa', cursive] text-[#263D5B] font-semibold">
                      Tổng cộng
                    </span>
                    <span className="font-['Comfortaa', cursive] text-2xl text-[#263D5B] font-bold">
                      {totalPrice.toLocaleString()}đ
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-[#FEF2F2] rounded-[8px]">
                  <p className="font-['Comfortaa', cursive] text-sm text-[#DC2626]">{error}</p>
                </div>
              )}

              {paymentStatus === 'idle' && (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleCheckout}
                >
                  <Clock className="w-5 h-5" />
                  Thanh toán ngay
                </Button>
              )}

              {paymentStatus === 'processing' && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#49B6E5] border-t-transparent rounded-full animate-spin" />
                  <p className="font-['Comfortaa', cursive] text-[#263D5B] mb-2">
                    Đang xử lý thanh toán...
                  </p>
                  <p className="font-['Comfortaa', cursive] text-3xl text-[#49B6E5] font-bold">
                    {countdown}s
                  </p>
                  <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280] mt-2">
                    Vui lòng chờ trong giây lát
                  </p>
                </div>
              )}

              {paymentStatus === 'success' && (
                <div className="text-center py-4">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-[#16A34A]" />
                  <p className="font-['Comfortaa', cursive] text-xl text-[#16A34A] font-semibold mb-2">
                    Thanh toán thành công!
                  </p>
                  <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280] mb-4">
                    Bạn đã được đăng ký khóa học thành công
                  </p>
                  <Link to="/my-courses">
                    <Button variant="primary" size="lg" className="w-full">
                      Xem khóa học của tôi
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              )}

              {paymentStatus === 'failed' && (
                <div className="text-center py-4">
                  <AlertCircle className="w-16 h-16 mx-auto mb-4 text-[#DC2626]" />
                  <p className="font-['Comfortaa', cursive] text-[#DC2626] mb-4">
                    Thanh toán thất bại
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => setPaymentStatus('idle')}
                  >
                    Thử lại
                  </Button>
                </div>
              )}

              <p className="font-['Comfortaa', cursive] text-xs text-[#6B7280] text-center mt-4">
                🔒 Thanh toán an toàn (giả lập)
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;