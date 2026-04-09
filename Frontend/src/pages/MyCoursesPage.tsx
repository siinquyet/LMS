import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Play, Award, GraduationCap } from 'lucide-react';
import { Card, Button, Avatar, Progress, Badge, EmptyState } from '../components/common';

const myCourses = [
  { id: 1, title: 'React & Next.js Full Course', instructor: 'Nguyen Van A', thumbnail: 'https://picsum.photos/seed/react/300/200', progress: 35, totalLessons: 20, completedLessons: 7 },
  { id: 2, title: 'TypeScript Fundamentals', instructor: 'Tran Thi B', thumbnail: 'https://picsum.photos/seed/ts/300/200', progress: 80, totalLessons: 15, completedLessons: 12 },
  { id: 3, title: 'Node.js Backend Development', instructor: 'Le Van C', thumbnail: 'https://picsum.photos/seed/node/300/200', progress: 0, totalLessons: 25, completedLessons: 0 },
  { id: 4, title: 'Python for Data Science', instructor: 'Pham Thi D', thumbnail: 'https://picsum.photos/seed/python/300/200', progress: 100, totalLessons: 30, completedLessons: 30 },
];

export const MyCoursesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F6F3] py-8">
      <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-['Comfortaa', cursive] text-4xl text-[#263D5B] mb-8 flex items-center gap-3">
            <GraduationCap className="w-10 h-10 text-[#49B6E5]" />
            Khóa học của tôi
          </h1>

        {myCourses.length === 0 ? (
          <EmptyState
            title="Chưa có khóa học"
            description="Mua khóa học để bắt đầu học tập"
            action={{ label: 'Khám phá khóa học', onClick: () => {} }}
          />
        ) : (
          <div className="space-y-6">
            {myCourses.map((course) => (
              <Card key={course.id} hoverable className="flex flex-col md:flex-row gap-6 p-6">
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
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Avatar name={course.instructor} size="sm" />
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
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;