import {
  ArrowUpDown,
  CheckCircle,
  Grid,
  List,
  Search,
  ShoppingCart,
  Store,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../api";
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  LazyImage,
  Loader,
  Pagination,
  Select,
} from "../components/common";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

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

const sortOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "popular", label: "Phổ biến nhất" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
];

const levels = [
  { value: "Cơ bản", label: "Cơ bản" },
  { value: "Trung cấp", label: "Trung cấp" },
  { value: "Nâng cao", label: "Nâng cao" },
];

export const StorePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { addItem } = useCart();
  const { user } = useAuth();
  const [addedCourseId, setAddedCourseId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [coursesRes, categoriesRes] = await Promise.all([
        api.getCourses({
          status: "approved",
          search: search || undefined,
          categoryId: category ? Number(category) : undefined,
          minPrice: priceMin ? Number(priceMin) : undefined,
          maxPrice: priceMax ? Number(priceMax) : undefined,
          sortBy: sortBy as any,
          page: currentPage,
          limit: 12,
        }),
        api.getCategories(),
      ]);
      setCourses(coursesRes.courses || []);
      setCategories(categoriesRes.categories || []);
      setTotal(coursesRes.total || 0);
      setTotalPages(coursesRes.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, [search, category, sortBy, priceMin, priceMax, currentPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, level, sortBy, priceMin, priceMax]);

  const handleAddToCart = async (course: Course) => {
    try {
      if (user) {
        await api.addToCart(course.id);
        setAddedCourseId(course.id);
        setTimeout(() => setAddedCourseId(null), 2000);
      } else {
        addItem({
          id: course.id,
          title: course.tieu_de,
          thumbnail: course.thumbnail || "",
          instructor: course.giang_vien
            ? `${course.giang_vien.ho} ${course.giang_vien.ten}`
            : "Giảng viên",
          price: course.gia,
          originalPrice: course.gia,
        });
        setAddedCourseId(course.id);
        setTimeout(() => setAddedCourseId(null), 2000);
      }
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen bg-[#FBFBF9] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Loader size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBF9] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-[35px] font-bold text-[#1C293C] mb-8 flex items-center gap-3">
          <Store className="w-10 h-10 text-[#FDC800]" strokeWidth={2} />
          Cửa hàng khóa học
        </h1>

        <div className="relative z-10 mb-8">
          <Card>
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    iconLeft={<Search className="w-5 h-5" />}
                    value={search}
                    onChange={setSearch}
                    placeholder="Tìm kiếm khóa học..."
                  />
                </div>
                <div className="flex gap-2">
                  <Select
                    options={[
                      { value: "", label: "Tất cả danh mục" },
                      ...categories.map((c) => ({
                        value: String(c.id),
                        label: c.ten,
                      })),
                    ]}
                    value={category}
                    onChange={setCategory}
                  />
                  <Select
                    options={[{ value: "", label: "Tất cả cấp độ" }, ...levels]}
                    value={level}
                    onChange={setLevel}
                  />
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex gap-4 items-center">
                  <span className="text-[15px] font-semibold text-[#1C293C] whitespace-nowrap">
                    Giá:
                  </span>
                  <Input
                    type="number"
                    placeholder="Từ"
                    value={priceMin}
                    onChange={(v) => setPriceMin(v)}
                    className="w-24"
                  />
                  <span className="text-[#6B7280]">-</span>
                  <Input
                    type="number"
                    placeholder="Đến"
                    value={priceMax}
                    onChange={(v) => setPriceMax(v)}
                    className="w-24"
                  />
                </div>
                <div className="flex gap-4 items-center">
                  <Select
                    options={sortOptions}
                    value={sortBy}
                    onChange={setSortBy}
                  />
                  <div className="flex border-[3px] border-[#1C293C]">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={`p-3 ${viewMode === "grid" ? "bg-[#FDC800]" : "bg-white"}`}
                    >
                      <Grid className="w-5 h-5 text-[#1C293C]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={`p-3 ${viewMode === "list" ? "bg-[#FDC800]" : "bg-white"}`}
                    >
                      <List className="w-5 h-5 text-[#1C293C]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-4">
          <span className="text-[15px] font-semibold text-[#6B7280]">
            Tìm thấy {total} khóa học
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            icon={<Store className="w-8 h-8" />}
            title="Không tìm thấy khóa học"
            description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
            action={{
              label: "Xóa bộ lọc",
              onClick: () => {
                setSearch("");
                setCategory("");
                setLevel("");
                setPriceMin("");
                setPriceMax("");
                setCurrentPage(1);
              }
            }}
          />
        ) : (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {courses.map((course) => (
                <Link
                  key={course.id}
                  to={`/course/${course.id}`}
                  className="block"
                >
                  <Card
                    hoverable
                    className="overflow-hidden p-0 cursor-pointer h-full"
                  >
                    <div className="relative">
                      <LazyImage
                        src={
                          course.thumbnail ||
                          "https://picsum.photos/seed/course/300/200"
                        }
                        alt={course.tieu_de}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={
                            course.muc_do === "Nâng cao"
                              ? "danger"
                              : course.muc_do === "Cơ bản"
                                ? "success"
                                : "warning"
                          }
                        >
                          {course.muc_do || "Trung cấp"}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-[17px] font-bold text-[#1C293C] mb-2 line-clamp-2">
                        {course.tieu_de}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <Avatar
                          name={
                            course.giang_vien
                              ? `${course.giang_vien.ho} ${course.giang_vien.ten}`
                              : "Instructor"
                          }
                          src={course.giang_vien?.anh_dai_dien}
                          size="sm"
                        />
                        <span className="text-[13px] text-[#6B7280]">
                          {course.giang_vien
                            ? `${course.giang_vien.ho} ${course.giang_vien.ten}`
                            : "Giảng viên"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-[15px] font-bold text-[#D97706]">
                            ★ {course.xep_hang || 0}
                          </span>
                          <span className="text-[13px] text-[#6B7280]">
                            ({course.so_luong_da_dang_ky || 0})
                          </span>
                        </div>
                        <span className="text-[17px] font-bold text-[#1C293C] bg-[#FDC800] border-[3px] border-[#1C293C] px-3 py-1">
                          {course.gia.toLocaleString()}đ
                        </span>
                      </div>
                      <div onClick={(e) => e.preventDefault()}>
                        {addedCourseId === course.id ? (
                          <Button
                            variant="success"
                            className="w-full mt-4"
                            disabled
                          >
                            <CheckCircle className="w-4 h-4" />
                            Đã thêm
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            className="w-full mt-4"
                            onClick={() => handleAddToCart(course)}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Thêm vào giỏ
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StorePage;
