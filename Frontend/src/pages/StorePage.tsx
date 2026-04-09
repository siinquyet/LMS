import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, List, Store, ShoppingCart } from 'lucide-react';
import { Card, Button, Badge, Avatar, SearchInput, Select, Pagination, EmptyState } from '../components/common';
import { useCart } from '../contexts/CartContext';

const courses = [
  { id: 1, title: 'React & Next.js Full Course', instructor: 'Nguyen Van A', price: 699000, rating: 4.8, students: 1250, thumbnail: 'https://picsum.photos/seed/react/300/200', category: 'programming', level: 'Nâng cao' },
  { id: 2, title: 'TypeScript Fundamentals', instructor: 'Tran Thi B', price: 499000, rating: 4.9, students: 890, thumbnail: 'https://picsum.photos/seed/ts/300/200', category: 'programming', level: 'Cơ bản' },
  { id: 3, title: 'UI/UX Design Master', instructor: 'Le Thi C', price: 599000, rating: 4.7, students: 2100, thumbnail: 'https://picsum.photos/seed/ux/300/200', category: 'design', level: 'Trung cấp' },
  { id: 4, title: 'Digital Marketing 2024', instructor: 'Pham Van D', price: 449000, rating: 4.6, students: 1560, thumbnail: 'https://picsum.photos/seed/marketing/300/200', category: 'marketing', level: 'Cơ bản' },
  { id: 5, title: 'Python for Data Science', instructor: 'Nguyen Thi E', price: 799000, rating: 4.8, students: 980, thumbnail: 'https://picsum.photos/seed/python/300/200', category: 'programming', level: 'Nâng cao' },
  { id: 6, title: 'Business Strategy', instructor: 'Tran Van F', price: 549000, rating: 4.5, students: 720, thumbnail: 'https://picsum.photos/seed/business/300/200', category: 'business', level: 'Trung cấp' },
  { id: 7, title: 'Vue.js 3 Complete Guide', instructor: 'Hoang Van G', price: 599000, rating: 4.7, students: 650, thumbnail: 'https://picsum.photos/seed/vue/300/200', category: 'programming', level: 'Trung cấp' },
  { id: 8, title: 'Figma for Beginners', instructor: 'Nguyen Thi H', price: 399000, rating: 4.9, students: 1800, thumbnail: 'https://picsum.photos/seed/figma/300/200', category: 'design', level: 'Cơ bản' },
  { id: 9, title: 'AWS Cloud Practitioner', instructor: 'Le Van I', price: 899000, rating: 4.6, students: 420, thumbnail: 'https://picsum.photos/seed/aws/300/200', category: 'programming', level: 'Nâng cao' },
  { id: 10, title: 'Content Marketing SEO', instructor: 'Tran Thi K', price: 349000, rating: 4.4, students: 920, thumbnail: 'https://picsum.photos/seed/seo/300/200', category: 'marketing', level: 'Cơ bản' },
  { id: 11, title: 'Financial Analysis', instructor: 'Pham Van L', price: 649000, rating: 4.5, students: 380, thumbnail: 'https://picsum.photos/seed/finance/300/200', category: 'business', level: 'Nâng cao' },
  { id: 12, title: 'Flutter Mobile Development', instructor: 'Nguyen Van M', price: 749000, rating: 4.8, students: 560, thumbnail: 'https://picsum.photos/seed/flutter/300/200', category: 'programming', level: 'Trung cấp' },
];

const categories = [
  { value: '', label: 'Tất cả danh mục' },
  { value: 'programming', label: 'Lập trình' },
  { value: 'design', label: 'Thiết kế' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'business', label: 'Kinh doanh' },
];

const levels = [
  { value: '', label: 'Tất cả cấp độ' },
  { value: 'basic', label: 'Cơ bản' },
  { value: 'intermediate', label: 'Trung cấp' },
  { value: 'advanced', label: 'Nâng cao' },
];

export const StorePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { addItem } = useCart();

  const filteredCourses = courses.filter((course) => {
    if (search && !course.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (category && course.category !== category) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8F6F3] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="font-['Comfortaa', cursive] text-4xl text-[#263D5B] mb-8 flex items-center gap-3">
          <Store className="w-10 h-10 text-[#49B6E5]" />
          Cửa hàng khóa học
        </h1>

        {/* Filters */}
        <div className="relative z-10 mb-8">
        <Card>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Tìm kiếm khóa học..."
              />
            </div>
            <div className="flex gap-4">
              <Select
                options={categories}
                value={category}
                onChange={setCategory}
                placeholder="Danh mục"
              />
              <Select
                options={levels}
                value={level}
                onChange={setLevel}
                placeholder="Cấp độ"
              />
              <div className="flex border-2 border-[#263D5B] rounded-[12px] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${viewMode === 'grid' ? 'bg-[#49B6E5] text-white' : 'bg-white'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${viewMode === 'list' ? 'bg-[#49B6E5] text-white' : 'bg-white'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </Card>
        </div>

        {/* Results */}
        <div className="mb-4">
          <span className="font-['Comfortaa', cursive] text-[#6B7280]">
            Tìm thấy {filteredCourses.length} khóa học
          </span>
        </div>

        {filteredCourses.length === 0 ? (
          <EmptyState
            title="Không tìm thấy khóa học"
            description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
          />
        ) : (
          <>
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredCourses.map((course) => (
                <Link key={course.id} to={`/course/${course.id}`} className="block">
                  <Card hoverable className="overflow-hidden p-0 cursor-pointer h-full">
                    <div className="relative">
                      <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
                      <div className="absolute top-2 right-2">
                        <Badge variant={course.level === 'Nâng cao' ? 'danger' : course.level === 'Cơ bản' ? 'success' : 'warning'}>
                          {course.level}
                        </Badge>
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="font-['Comfortaa', cursive] text-sm text-[#D97706]">★ {course.rating}</span>
                          <span className="font-['Comfortaa', cursive] text-xs text-[#6B7280]">({course.students})</span>
                        </div>
                        <span className="font-['Comfortaa', cursive] text-xl text-[#263D5B] font-semibold">
                          {course.price.toLocaleString()}đ
                        </span>
                      </div>
                      <div onClick={(e) => e.preventDefault()}>
                      <Button 
                        variant="primary" 
                        className="w-full mt-4"
                        onClick={() => addItem({
                          id: course.id,
                          title: course.title,
                          thumbnail: course.thumbnail,
                          instructor: course.instructor,
                          price: course.price,
                          originalPrice: course.price
                        })}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Thêm vào giỏ
                      </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Pagination currentPage={currentPage} totalPages={3} onPageChange={setCurrentPage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StorePage;