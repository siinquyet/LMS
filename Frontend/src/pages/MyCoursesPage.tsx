import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Award, GraduationCap, Search, X, User } from 'lucide-react';
import { Card, Button, Avatar, Progress, Badge, EmptyState, Loader } from '../components/common';
import { useAuth } from '../contexts/AuthContext';
import { getMyCourses } from '../api';

export const MyCoursesPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const { courses: data } = await getMyCourses(user.id);
        setCourses(data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user?.id]);

  const filteredCourses = useMemo(() => {
    return courses.filter((c: any) => {
      const matchesSearch = c.tieu_de?.toLowerCase().includes(searchQuery.toLowerCase()); 
      return !searchQuery || matchesSearch;
    });
  }, [searchQuery, courses]);

  const inProgressCount = courses.filter((c: any) => c.tien_do > 0 && c.tien_do < 100).length;
  const notStartedCount = courses.filter((c: any) => c.tien_do === 0).length;
  const completedCount = courses.filter((c: any) => c.tien_do === 100).length;

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#F8F6F3] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <GraduationCap className="w-8 h-8 text-[#263D5B]" />
          <h1 className="font-['Comfortaa', cursive] text-3xl text-[#263D5B]">Khóa học của tôi</h1>
        </div>

        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-[#263D5B] rounded-[8px] font-['Comfortaa', cursive] focus:border-[#49B6E5] outline-none"
              />
            </div>
          </div>
        </Card>

        {filteredCourses.length === 0 ? (
          <EmptyState
            title="Không tìm thấy khóa học"
            description="Bạn chưa đăng ký khóa học nào"
          />
        ) : (
          <div className="space-y-4">
            {filteredCourses.map((course: any) => (
              <Card key={course.id} className="p-4">
                <div className="flex gap-4">
                  <img 
                    src={course.thumbnail || 'https://picsum.photos/seed/course/200/150'} 
                    alt={course.tieu_de} 
                    className="w-48 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-['Comfortaa', cursive] text-xl text-[#263D5B]">{course.tieu_de}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {course.giang_vien?.ten ? `${course.giang_vien.ho} ${course.giang_vien.ten}` : 'Instructor'}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">
                          {course.bai_hoc_hoan_thanh || 0}/{course.tong_bai_hoc || 0} bài học
                        </span>
                        <span className="text-[#263D5B]">{course.tien_do || 0}%</span>
                      </div>
                      <Progress value={course.tien_do || 0} />
                    </div>
                    <Link to={`/learn/${course.id}`}>
                      <Button variant={course.tien_do === 0 ? 'primary' : 'secondary'} className="mt-3">
                        <Play className="w-4 h-4" />
                        {course.tien_do === 0 ? 'Bắt đầu học' : 'Tiếp tục học'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;