import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Star, 
  Clock, 
  Play, 
  Award, 
  ShoppingCart,
  CheckCircle,
  GraduationCap,
  FileText,
  Video,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import { Button, Card, Avatar, Badge } from '../components/common';
import { useCart } from '../contexts/CartContext';

const courseData = {
  id: 1,
  title: 'React & Next.js Full Course',
  instructor: 'Nguyen Van A',
  instructorAvatar: 'NVA',
  price: 699000,
  originalPrice: 999000,
  rating: 4.8,
  students: 1250,
  thumbnail: 'https://picsum.photos/seed/react/800/400',
  category: 'Lập trình',
  level: 'Nâng cao',
  duration: '40 giờ',
  lessons: 120,
  description: 'Khóa học toàn diện về React và Next.js, từ cơ bản đến nâng cao. Bạn sẽ học cách xây dựng ứng dụng web hiện đại với React, quản lý state, routing, và triển khai ứng dụng với Next.js.',
  whatYouLearn: [
    'Xây dựng ứng dụng React từ đầu',
    'Quản lý state với Redux và Context API',
    'Tạo API với Next.js',
    'Triển khai ứng dụng lên production',
    'Responsive design và UI/UX tốt',
    'Testing và debug ứng dụng'
  ],
  requirements: [
    'Biết cơ bản HTML, CSS, JavaScript',
    'Máy tính có kết nối internet',
    'Đam mê học lập trình web'
  ],
  chapters: [
    {
      id: 1,
      title: 'Giới thiệu React',
      lessons: [
        { id: 1, title: 'React là gì?', duration: '10:00', type: 'video', free: true },
        { id: 2, title: 'Cài đặt môi trường', duration: '15:00', type: 'video', free: true },
        { id: 3, title: 'Tạo project đầu tiên', duration: '20:00', type: 'video', free: false },
      ]
    },
    {
      id: 2,
      title: 'JSX và Component',
      lessons: [
        { id: 4, title: 'JSX là gì?', duration: '12:00', type: 'video', free: false },
        { id: 5, title: 'Tạo Component', duration: '18:00', type: 'video', free: false },
        { id: 6, title: 'Props và State', duration: '25:00', type: 'video', free: false },
        { id: 7, title: 'Bài tập chương', duration: '30:00', type: 'exercise', free: false },
      ]
    },
    {
      id: 3,
      title: 'Hooks trong React',
      lessons: [
        { id: 8, title: 'useState', duration: '20:00', type: 'video', free: false },
        { id: 9, title: 'useEffect', duration: '25:00', type: 'video', free: false },
        { id: 10, title: 'useContext', duration: '15:00', type: 'video', free: false },
        { id: 11, title: 'Quiz chương', duration: '20:00', type: 'quiz', free: false },
      ]
    },
    {
      id: 4,
      title: 'Next.js Fundamentals',
      lessons: [
        { id: 12, title: 'Giới thiệu Next.js', duration: '15:00', type: 'video', free: false },
        { id: 13, title: 'Routing trong Next.js', duration: '20:00', type: 'video', free: false },
        { id: 14, title: 'API Routes', duration: '25:00', type: 'video', free: false },
        { id: 15, title: 'Deployment', duration: '30:00', type: 'video', free: false },
      ]
    }
  ],
  instructorBio: 'Giảng viên Nguyễn Văn A với hơn 10 năm kinh nghiệm trong lĩnh vực phát triển web. Đã làm việc tại nhiều công ty công nghệ hàng đầu và có kinh nghiệm giảng dạy cho hàng nghìn học viên.'
};

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const [openChapters, setOpenChapters] = useState<number[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  const toggleChapter = (chapterId: number) => {
    setOpenChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleAddToCart = () => {
    addItem({
      id: courseData.id,
      title: courseData.title,
      thumbnail: courseData.thumbnail,
      instructor: courseData.instructor,
      price: courseData.price,
      originalPrice: courseData.originalPrice
    });
  };

  return (
    <div className="w-full bg-[#F8F6F3]">
      {/* Hero Section */}
      <div className="bg-[#263D5B] text-white py-12">
        <div className="w-full px-4">
          <Link to="/store" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-['Comfortaa', cursive] text-sm">Quay lại cửa hàng</span>
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left - Course Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="primary">{courseData.category}</Badge>
                <Badge variant="warning">{courseData.level}</Badge>
              </div>
              
              <h1 className="font-['Comfortaa', cursive] text-3xl md:text-4xl mb-4">
                {courseData.title}
              </h1>
              
              <p className="font-['Comfortaa', cursive] text-white/80 mb-6 text-lg">
                {courseData.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#D97706] fill-[#D97706]" />
                  <span className="font-['Comfortaa', cursive] font-semibold">{courseData.rating}</span>
                  <span className="font-['Comfortaa', cursive] text-white/70">({courseData.students} học viên)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-['Comfortaa', cursive]">{courseData.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <span className="font-['Comfortaa', cursive]">{courseData.lessons} bài học</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Avatar name={courseData.instructorAvatar} size="lg" />
                <div>
                  <p className="font-['Comfortaa', cursive] text-sm text-white/70">Giảng viên</p>
                  <p className="font-['Comfortaa', cursive] font-semibold">{courseData.instructor}</p>
                </div>
              </div>
            </div>
            
            {/* Right - Purchase Card */}
            <div className="w-full lg:w-96">
              <Card className="bg-white p-0 overflow-hidden">
                <img 
                  src={courseData.thumbnail} 
                  alt={courseData.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-end gap-2 mb-4">
                    <span className="font-['Comfortaa', cursive] text-3xl font-bold text-[#263D5B]">
                      {courseData.price.toLocaleString()}đ
                    </span>
                    <span className="font-['Comfortaa', cursive] text-lg text-[#6B7280] line-through">
                      {courseData.originalPrice.toLocaleString()}đ
                    </span>
                  </div>
                  
                  <p className="font-['Comfortaa', cursive] text-sm text-[#16A34A] mb-4">
                    ⚡ Giảm 30% - Chỉ còn hôm nay!
                  </p>
                  
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-full mb-3"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Thêm vào giỏ
                  </Button>
                  
                  <Link to="/my-courses">
                    <Button variant="secondary" size="lg" className="w-full">
                      <Play className="w-5 h-5" />
                      Học thử miễn phí
                    </Button>
                  </Link>
                  
                  <p className="font-['Comfortaa', cursive] text-xs text-[#6B7280] text-center mt-4">
                    🔒 30 ngày hoàn tiền nếu không hài lòng
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course Content */}
      <div className="w-full px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* What You'll Learn */}
            <Card className="mb-8">
              <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] mb-4 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-[#49B6E5]" />
                Bạn sẽ học được gì?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {courseData.whatYouLearn.map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                    <span className="font-['Comfortaa', cursive] text-sm text-[#263D5B]">{item}</span>
                  </div>
                ))}
              </div>
            </Card>
            
            {/* Course Content */}
            <Card className="mb-8">
              <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#49B6E5]" />
                Nội dung khóa học
              </h2>
              <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280] mb-4">
                {courseData.chapters.length} chương • {courseData.lessons} bài học • {courseData.duration} tổng thời lượng
              </p>
               
              <div className="space-y-2">
                {courseData.chapters.map((chapter) => (
                  <div key={chapter.id} className="border-2 border-[#263D5B] rounded-[12px] overflow-hidden">
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-[#F8F6F3] transition-colors"
                    >
                      <span className="font-['Comfortaa', cursive] text-[#263D5B]">
                        {chapter.id}. {chapter.title} ({chapter.lessons.length} bài)
                      </span>
                      <ChevronDown 
                        className={`w-5 h-5 text-[#263D5B] transition-transform ${openChapters.includes(chapter.id) ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {openChapters.includes(chapter.id) && (
                      <div className="px-4 py-3 bg-[#F8F6F3] border-t-2 border-dashed border-[#E5E1DC] space-y-2">
                        {chapter.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between p-2 hover:bg-white rounded-[8px]">
                            <div className="flex items-center gap-2">
                              {lesson.type === 'video' && <Video className="w-4 h-4 text-[#6B7280]" />}
                              {lesson.type === 'exercise' && <FileText className="w-4 h-4 text-[#6B7280]" />}
                              {lesson.type === 'quiz' && <Star className="w-4 h-4 text-[#6B7280]" />}
                              <span className="font-['Comfortaa', cursive] text-sm text-[#263D5B]">{lesson.title}</span>
                              {lesson.free && (
                                <Badge variant="success" size="sm">Free</Badge>
                              )}
                            </div>
                            <span className="font-['Comfortaa', cursive] text-xs text-[#6B7280]">{lesson.duration}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
            
            {/* Requirements */}
            <Card className="mb-8">
              <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-[#49B6E5]" />
                Yêu cầu
              </h2>
              <ul className="space-y-2">
                {courseData.requirements.map((req, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#263D5B] rounded-full" />
                    <span className="font-['Comfortaa', cursive] text-sm text-[#263D5B]">{req}</span>
                  </li>
                ))}
              </ul>
            </Card>
            
            {/* Instructor */}
            <Card>
              <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-[#49B6E5]" />
                Giảng viên
              </h2>
              <div className="flex items-start gap-4">
                <Avatar name={courseData.instructorAvatar} size="xl" />
                <div>
                  <h3 className="font-['Comfortaa', cursive] text-lg text-[#263D5B] font-semibold">
                    {courseData.instructor}
                  </h3>
                  <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280] mb-2">
                    Senior Web Developer
                  </p>
                  <p className="font-['Comfortaa', cursive] text-sm text-[#263D5B]">
                    {courseData.instructorBio}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
