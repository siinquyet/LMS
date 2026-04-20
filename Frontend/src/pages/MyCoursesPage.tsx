import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Play, Award, GraduationCap, Search, X, ChevronDown, ChevronRight, User } from 'lucide-react';
import { Card, Button, Avatar, Progress, Badge, EmptyState } from '../components/common';

interface Course {
  id: number;
  title: string;
  instructor: string;
  thumbnail: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

const myCourses: Course[] = [
  { id: 1, title: 'React & Next.js Full Course', instructor: 'Nguyen Van A', thumbnail: 'https://picsum.photos/seed/react/300/200', progress: 35, totalLessons: 20, completedLessons: 7 },
  { id: 2, title: 'TypeScript Fundamentals', instructor: 'Tran Thi B', thumbnail: 'https://picsum.photos/seed/ts/300/200', progress: 80, totalLessons: 15, completedLessons: 12 },
  { id: 3, title: 'Node.js Backend Development', instructor: 'Le Van C', thumbnail: 'https://picsum.photos/seed/node/300/200', progress: 0, totalLessons: 25, completedLessons: 0 },
  { id: 4, title: 'Python for Data Science', instructor: 'Pham Thi D', thumbnail: 'https://picsum.photos/seed/python/300/200', progress: 100, totalLessons: 30, completedLessons: 30 },
  { id: 5, title: 'React & Next.js Full Course', instructor: 'Nguyen Van A', thumbnail: 'https://picsum.photos/seed/react2/300/200', progress: 50, totalLessons: 20, completedLessons: 10 },
  { id: 6, title: 'TypeScript Fundamentals', instructor: 'Tran Thi B', thumbnail: 'https://picsum.photos/seed/ts2/300/200', progress: 25, totalLessons: 15, completedLessons: 4 },
];

const instructors = [...new Set(myCourses.map(c => c.instructor))].map(instructor => ({
  instructor,
  name: instructor
}));

export const MyCoursesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState<string | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'not_started' | 'completed'>('all');
  const [expandedInstructors, setExpandedInstructors] = useState<Set<string>>(new Set(instructors.map(i => i.instructor)));

  const filteredCourses = useMemo(() => {
    return myCourses.filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesInstructor = selectedInstructor === 'all' || c.instructor === selectedInstructor;
      let matchesStatus = true;
      if (statusFilter === 'in_progress') matchesStatus = c.progress > 0 && c.progress < 100;
      else if (statusFilter === 'not_started') matchesStatus = c.progress === 0;
      else if (statusFilter === 'completed') matchesStatus = c.progress === 100;
      return matchesSearch && matchesInstructor && matchesStatus;
    });
  }, [searchQuery, selectedInstructor, statusFilter]);

  const toggleInstructor = (instructor: string) => {
    setExpandedInstructors(prev => {
      const next = new Set(prev);
      if (next.has(instructor)) next.delete(instructor);
      else next.add(instructor);
      return next;
    });
  };

  const inProgressCount = myCourses.filter(c => c.progress > 0 && c.progress < 100).length;
  const notStartedCount = myCourses.filter(c => c.progress === 0).length;
  const completedCount = myCourses.filter(c => c.progress === 100).length;

  const groupedByInstructor = useMemo(() => {
    const groups: Record<string, Course[]> = {};
    for (const c of filteredCourses) {
      if (!groups[c.instructor]) groups[c.instructor] = [];
      groups[c.instructor].push(c);
    }
    return groups;
  }, [filteredCourses]);

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
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-[#6B7280]" />
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedInstructor}
                onChange={(e) => setSelectedInstructor(e.target.value)}
                className="px-4 py-2 border-2 border-[#263D5B] rounded-[8px] font-['Comfortaa', cursive] text-sm focus:border-[#49B6E5] outline-none"
              >
                <option value="all">Tất cả giáo viên</option>
                {instructors.map(i => (
                  <option key={i.instructor} value={i.instructor}>{i.name}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="px-4 py-2 border-2 border-[#263D5B] rounded-[8px] font-['Comfortaa', cursive] text-sm focus:border-[#49B6E5] outline-none"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="in_progress">Đang học</option>
                <option value="not_started">Chưa học</option>
                <option value="completed">Hoàn thành</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 mt-4 pt-4 border-t border-[#E5E1DC]">
            <button type="button" onClick={() => setStatusFilter('all')} className={`px-4 py-2 rounded-[8px] font-['Comfortaa', cursive] text-sm ${statusFilter === 'all' ? 'bg-[#263D5B] text-white' : 'bg-gray-100 text-[#6B7280]'}`}>
              Tất cả ({myCourses.length})
            </button>
            <button type="button" onClick={() => setStatusFilter('in_progress')} className={`px-4 py-2 rounded-[8px] font-['Comfortaa', cursive] text-sm ${statusFilter === 'in_progress' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-[#6B7280]'}`}>
              Đang học ({inProgressCount})
            </button>
            <button type="button" onClick={() => setStatusFilter('not_started')} className={`px-4 py-2 rounded-[8px] font-['Comfortaa', cursive] text-sm ${statusFilter === 'not_started' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-[#6B7280]'}`}>
              Chưa học ({notStartedCount})
            </button>
            <button type="button" onClick={() => setStatusFilter('completed')} className={`px-4 py-2 rounded-[8px] font-['Comfortaa', cursive] text-sm ${statusFilter === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-100 text-[#6B7280]'}`}>
              Hoàn thành ({completedCount})
            </button>
          </div>
        </Card>

        <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280] mb-4">
          Tìm thấy {filteredCourses.length} khóa học
        </p>

        {Object.keys(groupedByInstructor).length === 0 ? (
          <EmptyState
            title="Không tìm thấy khóa học"
            description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
            action={{ label: 'Khám phá khóa học', onClick: () => {} }}
          />
        ) : (
          Object.entries(groupedByInstructor).map(([instructor, coursesList]) => {
            const isExpanded = expandedInstructors.has(instructor);
            
            return (
              <Card key={instructor} className="mb-4 overflow-hidden">
                <button type="button" onClick={() => toggleInstructor(instructor)} className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronDown className="w-5 h-5 text-[#263D5B]" /> : <ChevronRight className="w-5 h-5 text-[#263D5B]" />}
                    <Avatar name={instructor} size="sm" />
                    <span className="font-['Comfortaa', cursive] text-[#263D5B] font-semibold">{instructor}</span>
                    <Badge variant="primary">{coursesList.length} khóa</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">
                      {coursesList.filter(c => c.progress === 100).length} hoàn thành
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-[#E5E1DC]">
                    {coursesList.map(course => (
                      <div key={course.id} className="flex flex-col md:flex-row gap-6 p-6 border-b border-[#E5E1DC] hover:bg-gray-50 last:border-b-0">
                        <div className="w-full md:w-64 flex-shrink-0">
                          <img src={course.thumbnail} alt={course.title} className="w-full h-36 object-cover rounded-[12px] border-2 border-[#263D5B]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-['Comfortaa', cursive] text-xl text-[#263D5B]">
                              {course.title}
                            </h3>
                            {course.progress === 100 && (
                              <Badge variant="success"><Award className="w-3 h-3 mr-1" /> Hoàn thành</Badge>
                            )}
                            {course.progress === 0 && (
                              <Badge variant="warning">Chưa học</Badge>
                            )}
                            {course.progress > 0 && course.progress < 100 && (
                              <Badge variant="primary">Đang học</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-4">
                            <User className="w-4 h-4 text-[#6B7280]" />
                            <span className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">{course.instructor}</span>
                          </div>
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">
                                {course.completedLessons}/{course.totalLessons} bài học
                              </span>
                              <span className="font-['Comfortaa', cursive] text-sm text-[#263D5B]">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} variant={course.progress === 100 ? 'success' : 'default'} />
                          </div>
                          <Link to={`/learn/${course.id}`}>
                            <Button variant={course.progress === 0 ? 'primary' : 'secondary'}>
                              <Play className="w-4 h-4" />
                              {course.progress === 0 ? 'Bắt đầu học' : 'Tiếp tục học'}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;