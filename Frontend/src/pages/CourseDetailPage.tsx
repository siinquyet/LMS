import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  MessageSquare,
  Send,
  Heart,
  Reply,
  Flag,
  ArrowUpDown
} from 'lucide-react';
import { Button, Card, Avatar, Badge, Loader } from '../components/common';
import { useCart } from '../contexts/CartContext';
import { getCourse, enrollCourse } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { courseDetailMockData } from '../mockData';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openChapters, setOpenChapters] = useState<number[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { course: data } = await getCourse(Number(id));
        if (data && data.tieu_de) {
          setCourse(data);
        } else {
          setCourse(courseDetailMockData);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        setCourse(courseDetailMockData);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const isMock = !course?.tieu_de;
  const displayCourse = isMock ? {
    ...courseDetailMockData,
    id: Number(id),
    tieu_de: course?.tieu_de || courseDetailMockData.title,
    gia: course?.gia || courseDetailMockData.price,
    mo_ta: course?.mo_ta || courseDetailMockData.description,
    danh_muc: course?.danh_muc || { ten: courseDetailMockData.category },
    muc_do: course?.muc_do || courseDetailMockData.level,
    thoi_luong: course?.thoi_luong || courseDetailMockData.duration,
    so_bai_hoc: course?.so_bai_hoc || courseDetailMockData.lessons,
    xep_hang: course?.xep_hang || courseDetailMockData.rating,
    so_luong_da_dang_ky: course?.so_luong_da_dang_ky || courseDetailMockData.students,
    thumbnail: course?.thumbnail || courseDetailMockData.thumbnail,
    giang_vien: course?.giang_vien || { ten: courseDetailMockData.instructor, ho: '', gioi_thieu: courseDetailMockData.instructorBio },
    chuong_hoc: course?.chuong_hoc || courseDetailMockData.chapters,
  } : course;

  const handleSubmitRating = () => {
    if (userRating > 0 && ratingComment.trim()) {
      setUserRating(0);
      setRatingComment('');
    }
  };

  const toggleChapter = (chapterId: number) => {
    setOpenChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleAddToCart = () => {
    if (!course) return;
    addItem({
      id: course.id,
      title: course.tieu_de,
      thumbnail: course.thumbnail,
      instructor: course.giang_vien?.ten,
      price: course.gia,
      originalPrice: course.gia
    });
  };

  const handleEnroll = async () => {
    if (!course || !user) return;
    try {
      await enrollCourse(user.id, course.id);
      alert('Đăng ký thành công!');
    } catch (error) {
      console.error('Error enrolling:', error);
    }
  };

  if (loading) return <Loader />;
  if (!displayCourse) return <div>Không tìm thấy khóa học</div>;

  const courseData = displayCourse;

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
                <Badge variant="primary">{course.danh_muc?.ten || 'Lập trình'}</Badge>
                <Badge variant="warning">{course.muc_do || 'Trung cấp'}</Badge>
              </div>
              
              <h1 className="font-['Comfortaa', cursive] text-3xl md:text-4xl mb-4">
                {course.tieu_de}
              </h1>
              
              <p className="font-['Comfortaa', cursive] text-white/80 mb-6 text-lg">
                {course.mo_ta}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#D97706] fill-[#D97706]" />
                  <span className="font-['Comfortaa', cursive] font-semibold">{course.xep_hang || 0}</span>
                  <span className="font-['Comfortaa', cursive] text-white/70">({course.so_luong_da_dang_ky || 0} học viên)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-['Comfortaa', cursive]">{course.thoi_luong || '0 giờ'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <span className="font-['Comfortaa', cursive]">{course.so_bai_hoc || 0} bài học</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Avatar name={course.giang_vien?.ten ? `${course.giang_vien.ho} ${course.giang_vien.ten}` : 'Instructor'} size="lg" />
                <div>
                  <p className="font-['Comfortaa', cursive] text-sm text-white/70">Giảng viên</p>
                  <p className="font-['Comfortaa', cursive] font-semibold">{course.giang_vien?.ten ? `${course.giang_vien.ho} ${course.giang_vien.ten}` : 'Instructor'}</p>
                </div>
              </div>
            </div>
            
            {/* Right - Purchase Card */}
            <div className="w-full lg:w-96">
              <Card className="bg-white p-0 overflow-hidden">
                <img 
                  src={course.thumbnail || course.hinh_anh || 'https://picsum.photos/seed/course/800/400'} 
                  alt={course.tieu_de}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-end gap-2 mb-4">
                    <span className="font-['Comfortaa', cursive] text-3xl font-bold text-[#263D5B]">
                      {(course.gia || 0).toLocaleString()}đ
                    </span>
                  </div>
                  
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
                {(courseData.whatYouLearn || []).map((item, index) => (
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
                {(course.chuong_hoc || []).length} chương • {course.so_bai_hoc || 0} bài học • {course.thoi_luong || '0 giờ'} tổng thời lượng
              </p>
               
              <div className="space-y-2">
                {(course.chuong_hoc || []).map((chapter: any) => (
                  <div key={chapter.id} className="border-2 border-[#263D5B] rounded-[12px] overflow-hidden">
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-[#F8F6F3] transition-colors"
                    >
                      <span className="font-['Comfortaa', cursive] text-[#263D5B]">
                        {chapter.thu_tu}. {chapter.tieu_de} ({(chapter.bai_hoc || []).length} bài)
                      </span>
                      <ChevronDown 
                        className={`w-5 h-5 text-[#263D5B] transition-transform ${openChapters.includes(chapter.id) ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {openChapters.includes(chapter.id) && (
                      <div className="px-4 py-3 bg-[#F8F6F3] border-t-2 border-dashed border-[#E5E1DC] space-y-2">
                        {(chapter.bai_hoc || []).map((lesson: any) => (
                          <div key={lesson.id} className="flex items-center justify-between p-2 hover:bg-white rounded-[8px]">
                            <div className="flex items-center gap-2">
                              {lesson.loai === 'video' && <Video className="w-4 h-4 text-[#6B7280]" />}
                              {lesson.loai === 'exercise' && <FileText className="w-4 h-4 text-[#6B7280]" />}
                              {lesson.loai === 'quiz' && <Star className="w-4 h-4 text-[#6B7280]" />}
                              <span className="font-['Comfortaa', cursive] text-sm text-[#263D5B]">{lesson.tieu_de}</span>
                            </div>
                            <span className="font-['Comfortaa', cursive] text-xs text-[#6B7280]">{lesson.thoi_luong}</span>
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
                {(course.requirements || []).map((req: any, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#263D5B] rounded-full" />
                    <span className="font-['Comfortaa', cursive] text-sm text-[#263D5B]">{req}</span>
                  </li>
                ))}
              </ul>
            </Card>
            
            {/* Instructor */}
            <Card className="mb-8">
              <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-[#49B6E5]" />
                Giảng viên
              </h2>
              <div className="flex items-start gap-4">
                <Avatar name={course.giang_vien?.ten ? `${course.giang_vien.ho} ${course.giang_vien.ten}` : 'Instructor'} size="xl" />
                <div>
                  <h3 className="font-['Comfortaa', cursive] text-lg text-[#263D5B] font-semibold">
                    {course.giang_vien?.ten ? `${course.giang_vien.ho} ${course.giang_vien.ten}` : 'Instructor'}
                  </h3>
                  <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280] mb-2">
                    {course.giang_vien?.gioi_thieu || 'Giảng viên'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Ratings */}
            <Card className="mb-8">
              <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-[#D97706]" />
                Đánh giá ({courseData.ratings?.length || 0})
              </h2>
              
              <div className="mb-6 p-4 bg-[#F8F6F3] rounded-[12px] border-2 border-[#263D5B]">
                <div className="flex items-center gap-6">
                  <div className="text-center shrink-0">
                    <p className="font-['Comfortaa', cursive] text-4xl font-bold text-[#263D5B]">{courseData.rating}</p>
                    <div className="flex gap-0.5 mt-1 justify-center">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`w-4 h-4 ${star <= courseData.rating ? 'text-[#D97706] fill-[#D97706]' : 'text-[#E5E1DC]'}`} />
                      ))}
                    </div>
                    <p className="font-['Comfortaa', cursive] text-xs text-[#6B7280] mt-1">{courseData.students} đánh giá</p>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map(star => {
                      const pct = star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="font-['Comfortaa', cursive] text-xs text-[#6B7280] w-3">{star}</span>
                          <Star className="w-3 h-3 text-[#D97706] fill-[#D97706]" />
                          <div className="flex-1 h-2 bg-[#E5E1DC] rounded-full overflow-hidden">
                            <div className="h-full bg-[#D97706]" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="font-['Comfortaa', cursive] text-xs text-[#6B7280] w-8">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#F8F6F3] rounded-[12px] border-2 border-[#263D5B]">
                <p className="font-['Comfortaa', cursive] text-sm text-[#263D5B] mb-2">Chọn số sao:</p>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-8 h-8 ${star <= userRating ? 'text-[#D97706] fill-[#D97706]' : 'text-[#E5E1DC]'}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Viết đánh giá của bạn..."
                  className="w-full p-3 border-2 border-[#263D5B] rounded-[8px] font-['Comfortaa', cursive] text-[#263D5B] resize-none mb-3"
                  rows={3}
                />
                <Button variant="primary" onClick={handleSubmitRating} disabled={userRating === 0 || !ratingComment.trim()} className="w-full">
                  Gửi đánh giá
                </Button>
              </div>

              <div className="space-y-4">
                {(courseData.ratings || []).map(rating => (
                  <div key={rating.id} className="border-b border-[#E5E1DC] pb-4 last:border-0">
                    <div className="flex items-start gap-3">
                      <Avatar name={rating.avatar} size="md" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-['Comfortaa', cursive] font-semibold text-[#263D5B]">{rating.user}</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star key={star} className={`w-3 h-3 ${star <= rating.rating ? 'text-[#D97706] fill-[#D97706]' : 'text-[#E5E1DC]'}`} />
                            ))}
                          </div>
                          <span className="font-['Comfortaa', cursive] text-xs text-[#6B7280]">{rating.time}</span>
                        </div>
                        <p className="font-['Comfortaa', cursive] text-sm text-[#263D5B] mb-2">{rating.comment}</p>
                        <div className="flex items-center gap-4">
                          <button type="button" className="flex items-center gap-1 text-[#6B7280] hover:text-red-500">
                            <Heart className="w-4 h-4" />
                            <span className="font-['Comfortaa', cursive] text-xs">{rating.likes}</span>
                          </button>
                          <button type="button" className="flex items-center gap-1 text-[#6B7280] hover:text-[#49B6E5]">
                            <Reply className="w-4 h-4" />
                            <span className="font-['Comfortaa', cursive] text-xs">Trả lời</span>
                          </button>
                          <button type="button" className="flex items-center gap-1 text-[#6B7280] hover:text-orange-500">
                            <Flag className="w-4 h-4" />
                          </button>
                        </div>
                        {rating.replies && rating.replies.length > 0 && (
                          <div className="ml-8 mt-3 space-y-2">
                            {rating.replies.map(reply => (
                              <div key={reply.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded-[8px] border-l-2 border-[#263D5B]">
                                <Avatar name={reply.avatar} size="sm" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-['Comfortaa', cursive] font-semibold text-sm text-[#263D5B]">{reply.user}</span>
                                    <span className="font-['Comfortaa', cursive] text-xs text-[#6B7280]">{reply.time}</span>
                                  </div>
                                  <p className="font-['Comfortaa', cursive] text-sm text-[#263D5B]">{reply.comment}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
