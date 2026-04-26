import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, List, Store, ShoppingCart } from 'lucide-react';
import { Card, Button, Badge, Avatar, SearchInput, Select, Pagination, EmptyState } from '../components/common';
import { useCart } from '../contexts/CartContext';
import { storeCategories as categories, storeCourses as courses, storeLevels as levels } from '../mockData';

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
