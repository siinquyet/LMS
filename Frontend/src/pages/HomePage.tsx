import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Award, 
  Star, 
  ArrowRight,
  Code,
  Palette,
  TrendingUp,
  Book,
  Zap,
  Clock,
  BadgeCheck,
  PlayCircle,
  Sparkles,
  Heart,
  MessageSquare,
  GraduationCap,
  FolderOpen,
  Rocket
} from 'lucide-react';
import { Button, Card, Avatar, Badge, Input } from '../components/common';
import { homeBenefits, homeCategories, homeDemoCourses, homeReviews, homeStats } from '../mockData';

const benefitIcons = [Zap, Clock, BadgeCheck, PlayCircle];
const statIcons = [Users, BookOpen, Award, Star];
const categoryIcons = [Code, Palette, TrendingUp, Book];

export const HomePage: React.FC = () => {
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register:', { email: registerEmail, password: registerPassword });
  };

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      {/* Hero Section */}
      <section className="relative bg-[#263D5B] text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 left-8 w-20 h-20 border-4 border-white rounded-full animate-pulse" />
          <div className="absolute bottom-12 right-16 w-16 h-16 border-4 border-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-1/3 right-1/4 w-12 h-12 border-4 border-white rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/3 left-1/4 w-8 h-8 border-4 border-white rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-[#49B6E5]" />
              <span className="font-['Comfortaa', cursive] text-sm text-white/90">
                Nền tảng giáo dục trực tuyến uy tín
              </span>
            </div>
            <h1 className="font-['Comfortaa', cursive] text-4xl md:text-5xl lg:text-6xl mb-4 leading-tight">
              Nền tảng học tập trực tuyến hàng đầu
            </h1>
            <p className="font-['Comfortaa', cursive] text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Trao cơ hội tiếp cận kiến thức chất lượng cao cho mọi người, mọi nơi
            </p>
          </div>

          {/* Benefits Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {homeBenefits.map((benefit, index) => {
              const Icon = benefitIcons[index];
              return (
              <div key={index} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                <Icon className="w-4 h-4 text-[#49B6E5]" />
                <span className="font-['Comfortaa', cursive] text-sm text-white">{benefit.title}</span>
              </div>
            )})}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link to="/register">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                <Zap className="w-5 h-5" />
                Đăng ký miễn phí
              </Button>
            </Link>
            <Link to="/store">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-white text-[#263D5B]">
                <PlayCircle className="w-5 h-5" />
                Xem khóa học demo
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {homeStats.map((stat, index) => {
              const Icon = statIcons[index];
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-white/10 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#49B6E5]" />
                  </div>
                  <div className="font-['Comfortaa', cursive] text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="font-['Comfortaa', cursive] text-xs md:text-sm text-white/70">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-6" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 24' preserveAspectRatio='none'%3E%3Cpath d='M0,0 Q250,24 500,0 T1000,0 L1000,24 L0,24 Z' fill='%23F8F6F3'/%3E%3C/svg%3E")`,
          backgroundSize: '1000px 24px',
        }} />
      </section>

      {/* Free Trial Banner */}
      <section className="py-8 max-w-7xl mx-auto px-4 -mt-2 relative z-20">
        <Card className="bg-gradient-to-r from-[#E8F6FC] to-[#F0FDF4] border-[#49B6E5] border-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#49B6E5] rounded-full flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] font-semibold">Free Trial 7 ngày</h3>
                <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">Truy cập không giới hạn tất cả khóa học</p>
              </div>
            </div>
            <Link to="/register">
              <Button variant="primary" size="md">
                Dùng thử ngay <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Demo Courses Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-['Comfortaa', cursive] text-3xl text-[#263D5B] flex items-center gap-2">
                <GraduationCap className="w-8 h-8 text-[#49B6E5]" />
                Khóa học nổi bật
              </h2>
              <p className="font-['Comfortaa', cursive] text-[#6B7280] mt-1">Những khóa học được yêu thích nhất</p>
            </div>
            <Link to="/store" className="font-['Comfortaa', cursive] text-[#49B6E5] flex items-center gap-2 hover:gap-3 transition-all">
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {homeDemoCourses.map((course) => (
              <Card key={course.id} hoverable className="overflow-hidden p-0">
                <div className="relative">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="primary" size="sm">Demo</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-['Comfortaa', cursive] text-[#263D5B] text-lg mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar name={course.instructor} size="sm" />
                    <span className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">{course.instructor}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[#D97706] fill-[#D97706]" />
                      <span className="font-['Comfortaa', cursive] text-sm text-[#263D5B] font-semibold">{course.rating}</span>
                      <span className="font-['Comfortaa', cursive] text-xs text-[#6B7280]">({course.students})</span>
                    </div>
                    <span className="font-['Comfortaa', cursive] text-xl text-[#263D5B] font-semibold">
                      {course.price.toLocaleString()}đ
                    </span>
                  </div>
                  <Button variant="primary" className="w-full">
                    Xem chi tiết
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <h2 className="font-['Comfortaa', cursive] text-3xl text-[#263D5B] text-center mb-8 flex items-center justify-center gap-2">
          <FolderOpen className="w-8 h-8 text-[#49B6E5]" />
          Danh mục khóa học
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {homeCategories.map((cat, index) => {
            const Icon = categoryIcons[index];
            return (
              <Link key={cat.id} to={`/store?category=${cat.id}`}>
                <Card hoverable className="text-center py-6">
                  <div className={`w-14 h-14 mx-auto mb-3 ${cat.color} rounded-full flex items-center justify-center`}>
                    <Icon className="w-7 h-7 text-[#263D5B]" />
                  </div>
                  <h3 className="font-['Comfortaa', cursive] text-lg text-[#263D5B] mb-1">{cat.name}</h3>
                  <span className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">{cat.count} khóa học</span>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-['Comfortaa', cursive] text-3xl text-[#263D5B] mb-2 flex items-center justify-center gap-2">
              <MessageSquare className="w-8 h-8 text-[#49B6E5]" />
              Đánh giá từ học viên
            </h2>
            <p className="font-['Comfortaa', cursive] text-[#6B7280]">Hơn 10,000+ học viên đã tin tưởng và lựa chọn</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {homeReviews.map((review) => (
              <Card key={review.id} hoverable className="relative">
                <div className="absolute -top-3 left-4">
                  <div className="bg-[#FFFBEB] border-2 border-[#D97706] rounded-full px-3 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 text-[#D97706] fill-[#D97706]" />
                    <span className="font-['Comfortaa', cursive] text-xs text-[#D97706]">{review.rating}.0</span>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar name={review.avatar} size="md" />
                    <div>
                      <h4 className="font-['Comfortaa', cursive] text-[#263D5B] text-sm font-semibold">{review.name}</h4>
                      <span className="font-['Comfortaa', cursive] text-xs text-[#6B7280]">{review.course}</span>
                    </div>
                  </div>
                  <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280] leading-relaxed">
                    "{review.comment}"
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t-2 border-dashed border-[#E5E1DC] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#6B7280]" />
                  <span className="font-['Comfortaa', cursive] text-xs text-[#6B7280]">Review thực tế</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA & Registration Section */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="bg-[#263D5B] text-white overflow-hidden relative rounded-[20px] border-4 border-[#263D5B]" style={{ boxShadow: '4px 4px 0px #E5E1DC' }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-16 h-16 border-4 border-white rounded-full" />
            <div className="absolute bottom-4 right-4 w-20 h-20 border-4 border-white rounded-full" />
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 p-8">
            <div className="flex-1 text-center lg:text-left">
              <h2 className="font-['Comfortaa', cursive] text-3xl mb-4 flex items-center justify-center lg:justify-start gap-2">
                <Rocket className="w-8 h-8 text-[#49B6E5]" />
                Bắt đầu hành trình học tập
              </h2>
              <p className="font-['Comfortaa', cursive] text-white/80 mb-6 max-w-lg">
                Tham gia cộng đồng hơn 10,000 học viên. Đăng ký ngay hôm nay để nhận <span className="text-[#49B6E5] font-semibold">7 ngày dùng thử miễn phí</span> và khám phá kho tài liệu học tập chất lượng cao.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#DC2626]" />
                  <span className="font-['Comfortaa', cursive] text-sm text-white/80">Không cần thẻ tín dụng</span>
                </div>
                  <div className="flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-[#16A34A]" />
                  <span className="font-['Comfortaa', cursive] text-sm text-white/80">Chứng nhận hoàn thành</span>
                </div>
              </div>
            </div>

            <div className="w-full max-w-md">
              <div className="bg-white p-6 rounded-[16px] border-2 border-[#263D5B]" style={{ boxShadow: '3px 3px 0px #E5E1DC' }}>
                <h3 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] text-center mb-1">
                  Đăng ký nhanh
                </h3>
                <p className="font-['Comfortaa', cursive] text-xs text-[#6B7280] text-center mb-6">
                  Chỉ cần email để bắt đầu
                </p>
                <form onSubmit={handleRegister} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Email của bạn"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Mật khẩu"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                  <Button type="submit" variant="primary" size="lg" className="w-full">
                    <Zap className="w-5 h-5" />
                    Đăng ký miễn phí
                  </Button>
                  <p className="font-['Comfortaa', cursive] text-xs text-[#6B7280] text-center">
                    Đã có tài khoản? <Link to="/login" className="text-[#49B6E5] hover:underline">Đăng nhập</Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 max-w-3xl mx-auto px-4 text-center">
        <h3 className="font-['Comfortaa', cursive] text-2xl text-[#263D5B] mb-4">
          Còn chờ gì nữa?
        </h3>
        <p className="font-['Comfortaa', cursive] text-[#6B7280] mb-6">
          Bắt đầu hành trình học tập của bạn ngay hôm nay
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button variant="primary" size="lg">
              Đăng ký ngay <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/store">
            <Button variant="outline" size="lg">
              Khám phá khóa học
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
