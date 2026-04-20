import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ChevronDown, ChevronRight, BookOpen, ClipboardList, Search, X } from 'lucide-react';
import { Card, Button, Badge } from '../components/common';

interface Assignment {
  id: number;
  courseId: number;
  courseName: string;
  title: string;
  type: 'quiz' | 'exercise';
  questions: number;
  status: 'pending' | 'completed';
  score?: number;
}

const assignmentsData: Assignment[] = [
  { id: 1, courseId: 1, courseName: 'React & Next.js Full Course', title: 'Quiz chương 1: Giới thiệu React', type: 'quiz', questions: 10, status: 'pending' },
  { id: 2, courseId: 1, courseName: 'React & Next.js Full Course', title: 'Bài tập useState', type: 'exercise', questions: 5, status: 'pending' },
  { id: 3, courseId: 2, courseName: 'TypeScript Fundamentals', title: 'Quiz chương 2: Type System', type: 'quiz', questions: 15, status: 'pending' },
  { id: 4, courseId: 3, courseName: 'Node.js Backend Development', title: 'Bài tập Express Router', type: 'exercise', questions: 8, status: 'pending' },
  { id: 5, courseId: 1, courseName: 'React & Next.js Full Course', title: 'Quiz chương 2: JSX', type: 'quiz', questions: 12, status: 'completed', score: 8 },
  { id: 6, courseId: 2, courseName: 'TypeScript Fundamentals', title: 'Bài tập Generics', type: 'exercise', questions: 6, status: 'completed', score: 10 },
];

const courses = [...new Set(assignmentsData.map(a => a.courseId))].map(id => ({
  id,
  name: assignmentsData.find(a => a.courseId === id)?.courseName || ''
}));

export const AssignmentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [expandedCourses, setExpandedCourses] = useState<Set<number>>(new Set(courses.map(c => c.id)));

  const filteredAssignments = useMemo(() => {
    return assignmentsData.filter(a => {
      const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.courseName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCourse = selectedCourse === 'all' || a.courseId === selectedCourse;
      const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [searchQuery, selectedCourse, statusFilter]);

  const toggleCourse = (courseId: number) => {
    setExpandedCourses(prev => {
      const next = new Set(prev);
      if (next.has(courseId)) next.delete(courseId);
      else next.add(courseId);
      return next;
    });
  };

  const getStatusBadge = (status: string) => {
    return status === 'pending' ? <Badge variant="error">Chưa làm</Badge> : <Badge variant="success">Đã nộp</Badge>;
  };

  const pendingCount = assignmentsData.filter(a => a.status === 'pending').length;
  const completedCount = assignmentsData.filter(a => a.status === 'completed').length;

  const groupedByCourse = useMemo(() => {
    const groups: Record<number, Assignment[]> = {};
    for (const a of filteredAssignments) {
      if (!groups[a.courseId]) groups[a.courseId] = [];
      groups[a.courseId].push(a);
    }
    return groups;
  }, [filteredAssignments]);

  return (
    <div className="min-h-screen bg-[#F8F6F3] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-[#263D5B]" />
          <h1 className="font-['Comfortaa', cursive] text-3xl text-[#263D5B]">Bài tập</h1>
        </div>

        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Tìm kiếm bài tập..."
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
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="px-4 py-2 border-2 border-[#263D5B] rounded-[8px] font-['Comfortaa', cursive] text-sm focus:border-[#49B6E5] outline-none"
              >
                <option value="all">Tất cả khóa học</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="px-4 py-2 border-2 border-[#263D5B] rounded-[8px] font-['Comfortaa', cursive] text-sm focus:border-[#49B6E5] outline-none"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chưa làm</option>
                <option value="completed">Đã nộp</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 mt-4 pt-4 border-t border-[#E5E1DC]">
            <button type="button" onClick={() => setStatusFilter('all')} className={`px-4 py-2 rounded-[8px] font-['Comfortaa', cursive] text-sm ${statusFilter === 'all' ? 'bg-[#263D5B] text-white' : 'bg-gray-100 text-[#6B7280]'}`}>
              Tất cả ({assignmentsData.length})
            </button>
            <button type="button" onClick={() => setStatusFilter('pending')} className={`px-4 py-2 rounded-[8px] font-['Comfortaa', cursive] text-sm ${statusFilter === 'pending' ? 'bg-red-500 text-white' : 'bg-gray-100 text-[#6B7280]'}`}>
              Chưa làm ({pendingCount})
            </button>
            <button type="button" onClick={() => setStatusFilter('completed')} className={`px-4 py-2 rounded-[8px] font-['Comfortaa', cursive] text-sm ${statusFilter === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-100 text-[#6B7280]'}`}>
              Đã nộp ({completedCount})
            </button>
          </div>
        </Card>

        <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280] mb-4">
          Tìm thấy {filteredAssignments.length} bài tập
        </p>

        {Object.keys(groupedByCourse).length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-[#6B7280] mx-auto mb-4" />
            <h3 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] mb-2">Không tìm thấy b��i tập</h3>
            <p className="font-['Comfortaa', cursive] text-[#6B7280]">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : (
          Object.entries(groupedByCourse).map(([courseId, assignments]) => {
            const courseName = assignments[0].courseName;
            const courseIdNum = Number(courseId);
            const isExpanded = expandedCourses.has(courseIdNum);
            
            return (
              <Card key={courseId} className="mb-4 overflow-hidden">
                <button type="button" onClick={() => toggleCourse(courseIdNum)} className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronDown className="w-5 h-5 text-[#263D5B]" /> : <ChevronRight className="w-5 h-5 text-[#263D5B]" />}
                    <BookOpen className="w-5 h-5 text-[#49B6E5]" />
                    <span className="font-['Comfortaa', cursive] text-[#263D5B] font-semibold">{courseName}</span>
                    <Badge variant="primary">{assignments.length} bài</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">
                      {assignments.filter(a => a.status === 'pending').length} chưa làm
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-[#E5E1DC]">
                    {assignments.map(assignment => (
                      <div key={assignment.id} className="flex items-center gap-4 p-4 border-b border-[#E5E1DC] hover:bg-gray-50 last:border-b-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${assignment.type === 'quiz' ? 'bg-yellow-100 text-yellow-600' : 'bg-purple-100 text-purple-600'}`}>
                          {assignment.type === 'quiz' ? <ClipboardList className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-['Comfortaa', cursive] text-sm text-[#263D5B] truncate">{assignment.title}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="font-['Comfortaa', cursive] text-xs text-[#6B7280]">{assignment.questions} câu</span>
                            {assignment.status === 'completed' && assignment.score !== undefined && (
                              <span className="font-['Comfortaa', cursive] text-xs text-green-600 font-semibold">Điểm: {assignment.score}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="shrink-0">
                          {getStatusBadge(assignment.status)}
                        </div>
                        
                        <Link 
                          to={assignment.status === 'completed' 
                            ? `/quiz/${assignment.courseId}/1/review` 
                            : `/quiz/${assignment.courseId}/1/do`
                          } 
                          className="shrink-0"
                        >
                          <Button variant={assignment.status === 'completed' ? 'secondary' : 'primary'} size="sm">
                            {assignment.status === 'completed' ? 'Xem lại' : 'Làm bài'}
                          </Button>
                        </Link>
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

export default AssignmentsPage;