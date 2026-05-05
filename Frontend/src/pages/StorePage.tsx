import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Grid, List, Store, ShoppingCart } from 'lucide-react';
import { Card, Button, Badge, Avatar, SearchInput, Select, Pagination, EmptyState, Loader } from '../components/common';
import { useCart } from '../contexts/CartContext';
import * as api from '../api';

interface Course {
  id: number;
  tieu_de: string;
  gia: number;
  thumbnail?: string;
  muc_do?: string;
  xep_hang?: number;
  so_luong_da_dang_ky: number;
  giang_vien?: {
    id: number;
    ten: string;
    ho: string;
    anh_dai_dien?: string;
  };
  danh_muc?: {
    id: number;
    ten: string;
  };
}

interface Category {
  id: number;
  ten: string;
}

const levels = [
  { value: 'Cơ bản', label: 'Cơ bản' },
  { value: 'Trung cấp', label: 'Trung cấp' },
  { value: 'Nâng cao', label: 'Nâng cao' },
];

export const StorePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { addItem } = useCart();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [coursesRes, categoriesRes] = await Promise.all([
        api.getCourses({ status: 'approved', ...(search ? { search } : {}) }),
        api.getCategories(),
      ]);
      setCourses(coursesRes.courses || []);
      setCategories(categoriesRes.categories || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredCourses = courses.filter((course) => {
    if (category && course.danh_muc?.ten !== category) return false;
    if (level && course.muc_do !== level) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F3] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Loader size="lg" />
        </div>
      </div>
    );
  }

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
                options={categories.map(c => ({ value: c.ten, label: c.ten }))}
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
                      <img 
                        src={course.thumbnail || 'https://picsum.photos/seed/course/300/200'} 
                        alt={course.tieu_de} 
                        className="w-full h-48 object-cover" 
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant={course.muc_do === 'Nâng cao' ? 'danger' : course.muc_do === 'Cơ bản' ? 'success' : 'warning'}>
                          {course.muc_do || 'Trung cấp'}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-['Comfortaa', cursive] text-[#263D5B] text-lg mb-2 line-clamp-2">
                        {course.tieu_de}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <Avatar 
                          name={course.giang_vien ? `${course.giang_vien.ho} ${course.giang_vien.ten}` : 'Instructor'} 
                          src={course.giang_vien?.anh_dai_dien}
                          size="sm" 
                        />
                        <span className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">
                          {course.giang_vien ? `${course.giang_vien.ho} ${course.giang_vien.ten}` : 'Giảng viên'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="font-['Comfortaa', cursive] text-sm text-[#D97706]">★ {course.xep_hang || 0}</span>
                          <span className="font-['Comfortaa', cursive] text-xs text-[#6B7280]">({course.so_luong_da_dang_ky || 0})</span>
                        </div>
                        <span className="font-['Comfortaa', cursive] text-xl text-[#263D5B] font-semibold">
                          {course.gia.toLocaleString()}đ
                        </span>
                      </div>
                      <div onClick={(e) => e.preventDefault()}>
                      <Button 
                        variant="primary" 
                        className="w-full mt-4"
                        onClick={() => addItem({
                          id: course.id,
                          title: course.tieu_de,
                          thumbnail: course.thumbnail || '',
                          instructor: course.giang_vien ? `${course.giang_vien.ho} ${course.giang_vien.ten}` : 'Giảng viên',
                          price: course.gia,
                          originalPrice: course.gia
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
              <Pagination currentPage={currentPage} totalPages={Math.ceil(filteredCourses.length / 9)} onPageChange={setCurrentPage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StorePage;