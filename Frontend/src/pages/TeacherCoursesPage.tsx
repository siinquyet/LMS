import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, BookOpen, Users, Eye } from 'lucide-react';
import { Card, Button, Badge, SearchInput, Loader } from '../components/common';
import { useAuth } from '../contexts/AuthContext';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../api';

export const TeacherCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const { courses: data } = await getCourses({ instructorId: user.id });
        setCourses(data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user?.id]);

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa khóa học này?')) return;
    try {
      await deleteCourse(id);
      setCourses(courses.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.tieu_de?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-['Comfortaa', cursive] text-3xl text-[#263D5B]">Khóa học</h1>
            <p className="text-gray-600 mt-2">Quản lý và tạo khóa học của bạn</p>
          </div>
          <Button variant="primary" onClick={() => navigate('/teacher/courses/new')}>
            <Plus className="w-4 h-4" />
            Tạo khóa học
          </Button>
        </div>

        <Card className="p-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Tìm kiếm khóa học..."
          />
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course: any) => (
            <Card key={course.id} hoverable className="overflow-hidden">
              <img 
                src={course.thumbnail || 'https://picsum.photos/seed/course/400/300'} 
                alt={course.tieu_de}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-['Comfortaa', cursive] text-[#263D5B] line-clamp-2">
                    {course.tieu_de}
                  </h3>
                  <Badge variant={course.trang_thai === 'approved' ? 'success' : course.trang_thai === 'completed' ? 'success' : course.trang_thai === 'pending' ? 'warning' : 'default'}>
                    {course.trang_thai === 'approved' ? 'Đã duyệt' : course.trang_thai === 'completed' ? 'Hoàn thành' : course.trang_thai === 'pending' ? 'Chờ duyệt' : 'Bản nháp'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Users className="w-4 h-4" />
                  <span>{course.so_luong_da_dang_ky || 0} học viên</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { console.log('Edit click, course id:', course.id); navigate(`/teacher/courses/${course.id}/edit`); }}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/learn/${course.id}`)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(course.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có khóa học nào</p>
            <Button variant="primary" className="mt-4" onClick={() => navigate('/teacher/courses/new')}>
              Tạo khóa học đầu tiên
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCoursesPage;