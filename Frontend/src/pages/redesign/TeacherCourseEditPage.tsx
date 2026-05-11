import { useState, useEffect } from "react";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Settings,
  Upload,
  Save,
  Plus,
  ChevronRight,
  Trash2,
  Edit2,
  Video,
  FileText,
  HelpCircle,
  FileQuestion,
  LayoutGrid,
  DollarSign,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  ImageUpload,
  Input,
  Loader,
  Modal,
  Progress,
  VideoUpload,
  QuizBuilder,
  type QuizFormData,
} from "../../components/common";
import { useTeacherCourseEditor } from "../../hooks/useTeacherCourseEditor";

const TeacherCourseEditPageRedesign = () => {
  const { id: paramsId } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  console.log("[DEBUG-location] pathname =", location.pathname);
  console.log("[DEBUG-useParams] id =", paramsId, "type:", typeof paramsId);
  
  // Manual parse from URL as fallback
  const pathParts = location.pathname.split('/').filter(Boolean);
  const courseIndex = pathParts.indexOf('courses');
  const idFromPath = courseIndex >= 0 && pathParts[courseIndex + 1] ? pathParts[courseIndex + 1] : null;
  
  console.log("[DEBUG-manual] idFromPath =", idFromPath, "pathParts =", pathParts);
  
  const id = paramsId || (idFromPath !== 'new' ? idFromPath : null);
  const isNewCourse = id === 'new' || location.pathname.includes('/new');
  let courseId = 0;
  
  if (id && !isNewCourse) {
    const parsed = Number(id);
    courseId = isNaN(parsed) ? 0 : parsed;
  }
  
  console.log("[DEBUG-courseId] final courseId =", courseId, "isNaN:", isNaN(courseId), "isNewCourse:", isNewCourse);
  
  // Redirect if invalid courseId and not new course
  useEffect(() => {
    if (!isNewCourse && (!id || isNaN(Number(id)))) {
      console.log("[DEBUG-redirect] Invalid id, redirecting to courses list");
      navigate("/teacher/courses", { replace: true });
    }
  }, [id, isNewCourse, navigate]);
  
  const editor = useTeacherCourseEditor(courseId, isNewCourse);

  const [activeSection, setActiveSection] = useState<
    "basic" | "content" | "pricing" | "settings"
  >("basic");

  const [chapterTabs, setChapterTabs] = useState<Record<number, "video" | "exercise">>({});

  const getActiveTab = (chapterId: number) => chapterTabs[chapterId] || "video";

  const setActiveTab = (chapterId: number, tab: "video" | "exercise") => {
    setChapterTabs((prev) => ({ ...prev, [chapterId]: tab }));
  };

  const sections = [
    { key: "basic", label: "Thông tin cơ bản", icon: BookOpen },
    { key: "content", label: "Nội dung", icon: LayoutGrid },
    { key: "pricing", label: "Giá & Danh mục", icon: DollarSign },
    { key: "settings", label: "Cài đặt nâng cao", icon: Settings },
  ] as const;

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "document":
        return <FileText className="w-4 h-4" />;
      case "quiz":
        return <HelpCircle className="w-4 h-4" />;
      case "exercise":
        return <FileQuestion className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const totalLessons = editor.chapters.reduce(
    (sum, ch) => sum + (ch.bai_hoc?.length || 0),
    0,
  );

  // New Course Form
  if (isNewCourse) {
    return (
      <div className="min-h-screen bg-[#F8F6F3]">
        <div className="max-w-4xl mx-auto p-8">
          <button
            onClick={() => navigate("/teacher/courses")}
            className="flex items-center gap-2 text-gray-600 mb-6 hover:text-[#1C293C]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-['Inter', sans-serif]">Quay lại</span>
          </button>

          <Card className="p-8 border-3 border-[#1C293C] shadow-[6px_6px_0px_#E5E1DC]">
            <h1 className="font-['Inter', sans-serif] text-2xl font-bold text-[#1C293C] mb-6">
              Tạo khóa học mới
            </h1>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-['Inter', sans-serif] font-bold text-[#1C293C] mb-2">
                  Tên khóa học *
                </label>
                <Input
                  value={editor.course.tieu_de || ""}
                  onChange={(value) => editor.courseField("tieu_de", value)}
                  className="border-2 border-[#1C293C] rounded-[12px] p-4"
                  placeholder="VD: React & Next.js Full Course"
                />
              </div>

              <div>
                <label className="block text-sm font-['Inter', sans-serif] font-bold text-[#1C293C] mb-2">
                  Mô tả *
                </label>
                <textarea
                  value={editor.course.mo_ta || ""}
                  onChange={(e) => editor.courseField("mo_ta", e.target.value)}
                  className="w-full p-4 border-2 border-[#1C293C] rounded-[12px] font-['Inter', sans-serif] min-h-[150px]"
                  placeholder="Mô tả chi tiết về khóa học..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-['Inter', sans-serif] font-bold text-[#1C293C] mb-2">
                    Danh mục
                  </label>
                  <select
                    value={editor.course.danh_muc_id || ""}
                    onChange={(e) =>
                      editor.courseField("danh_muc_id", Number(e.target.value))
                    }
                    className="w-full p-4 border-2 border-[#1C293C] rounded-[12px] font-['Inter', sans-serif]"
                  >
                    <option value="">Chọn danh mục</option>
                    {editor.categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.ten}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-['Inter', sans-serif] font-bold text-[#1C293C] mb-2">
                    Cấp độ
                  </label>
                  <select
                    value={editor.course.muc_do || ""}
                    onChange={(e) => editor.courseField("muc_do", e.target.value)}
                    className="w-full p-4 border-2 border-[#1C293C] rounded-[12px] font-['Inter', sans-serif]"
                  >
                    <option value="">Chọn cấp độ</option>
                    <option value="beginner">Người mới</option>
                    <option value="intermediate">Trung cấp</option>
                    <option value="advanced">Nâng cao</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={editor.handleSaveCourse}
                  disabled={editor.saving}
                >
                  <Save className="w-5 h-5 mr-2" />
                  {editor.saving ? "Đang lưu..." : "Tạo khóa học"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/teacher/courses")}
                >
                  Hủy
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (editor.loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (editor.error || !editor.course) {
    return (
      <div className="min-h-screen bg-[#F8F6F3] p-8">
        <Card className="p-8 text-center border-3 border-[#1C293C]">
          <p className="text-red-500 mb-4">
            {editor.error || "Không tìm thấy khóa học"}
          </p>
          <Button onClick={() => navigate("/teacher/courses")}>
            Quay lại
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      {/* Header with Navigation Tabs */}
      <div className="bg-white border-b-3 border-[#1C293C] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/teacher/courses")}
                className="p-2 hover:bg-gray-100 rounded-[8px] border-2 border-[#1C293C]"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-['Inter', sans-serif] text-xl font-bold text-[#1C293C]">
                  {editor.course.tieu_de || "Khóa học mới"}
                </h1>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-gray-500">
                    {editor.chapters.length} chương • {totalLessons} bài học • {editor.course.thoi_luong || "0 phút"}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={editor.handleSaveCourse}
              disabled={editor.saving}
            >
              <Save className="w-4 h-4 mr-2" />
              {editor.saving ? "Đang lưu..." : "Lưu khóa học"}
            </Button>
          </div>

          {/* Horizontal Navigation Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.key;
              return (
                <button
                  key={section.key}
                  onClick={() =>
                    setActiveSection(section.key as typeof activeSection)
                  }
                  className={`px-4 py-2 rounded-[8px] flex items-center gap-2 font-['Inter', sans-serif] text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[#1C293C] text-white shadow-[3px_3px_0px_#49B6E5]"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-[#1C293C]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Section: Basic Info */}
          {activeSection === "basic" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-8 h-8 text-[#49B6E5]" />
                <h2 className="font-['Inter', sans-serif] text-2xl font-bold text-[#1C293C]">
                  Thông tin cơ bản
                </h2>
              </div>

              <Card className="p-6 border-3 border-[#1C293C] shadow-[4px_4px_0px_#E5E1DC]">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-['Inter', sans-serif] font-bold text-[#1C293C] mb-2">
                      Tên khóa học
                    </label>
                    <Input
                      value={editor.course.tieu_de || ""}
                      onChange={(value) => editor.courseField("tieu_de", value)}
                      className="border-2 border-[#1C293C] rounded-[8px]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-['Inter', sans-serif] font-bold text-[#1C293C] mb-2">
                      Mô tả chi tiết
                    </label>
                    <textarea
                      value={editor.course.mo_ta || ""}
                      onChange={(e) => editor.courseField("mo_ta", e.target.value)}
                      className="w-full p-3 border-2 border-[#1C293C] rounded-[8px] font-['Inter', sans-serif] min-h-[200px]"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-3 border-[#1C293C] shadow-[4px_4px_0px_#E5E1DC]">
                <h3 className="font-['Inter', sans-serif] text-lg font-bold text-[#1C293C] mb-4">
                  Ảnh thumbnail
                </h3>
                <ImageUpload
                  value={editor.course.thumbnail || ""}
                  onChange={(url) => editor.courseField("thumbnail", url)}
                  placeholder="Tải ảnh thumbnail"
                />
              </Card>
            </div>
          )}

          {/* Section: Content */}
          {activeSection === "content" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <LayoutGrid className="w-8 h-8 text-[#49B6E5]" />
                  <h2 className="font-['Inter', sans-serif] text-2xl font-bold text-[#1C293C]">
                    Nội dung khóa học
                  </h2>
                </div>
                <Button variant="primary" onClick={editor.chapterForm.open}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm chương mới
                </Button>
              </div>

              {editor.chapters.map((chapter: any, idx: number) => {
                const videoLessons = (chapter.bai_hoc || []).filter((l: any) => l.loai === "video");
                const exerciseLessons = (chapter.bai_hoc || []).filter((l: any) => l.loai === "exercise");
                
                return (
                  <Card
                    key={chapter.id}
                    className="border-2 border-[#1C293C] shadow-[3px_3px_0px_#E5E1DC] overflow-hidden"
                  >
                    <div className="p-4 bg-[#1C293C] text-white rounded-t-[8px] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-['Inter', sans-serif] font-semibold">
                            {chapter.tieu_de}
                          </p>
                          <p className="text-xs text-white/60">
                            {videoLessons.length} video • {exerciseLessons.length} bài tập
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => editor.chapterForm.edit(chapter)}
                          className="p-2 hover:bg-white/10 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => editor.handleDeleteChapter(chapter.id)}
                          className="p-2 hover:bg-white/10 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>

                    {/* Tab Buttons for Video/Exercise */}
                    <div className="flex border-b-2 border-[#1C293C]">
                      <button
                        onClick={() => setActiveTab(chapter.id, "video")}
                        className={`flex-1 px-4 py-3 font-['Inter', sans-serif] text-sm font-medium border-b-3 transition-colors ${
                          getActiveTab(chapter.id) === "video"
                            ? "bg-blue-50 text-blue-600 border-blue-600"
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100 border-transparent"
                        }`}
                      >
                        <Video className="w-4 h-4 inline mr-2" />
                        Video ({videoLessons.length})
                      </button>
                      <button
                        onClick={() => setActiveTab(chapter.id, "exercise")}
                        className={`flex-1 px-4 py-3 font-['Inter', sans-serif] text-sm font-medium border-b-3 transition-colors ${
                          getActiveTab(chapter.id) === "exercise"
                            ? "bg-purple-50 text-purple-600 border-purple-600"
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100 border-transparent"
                        }`}
                      >
                        <FileQuestion className="w-4 h-4 inline mr-2" />
                        Bài tập ({exerciseLessons.length})
                      </button>
                    </div>

                    {/* Content based on active tab */}
                    <div className="p-4">
                      {getActiveTab(chapter.id) === "video" ? (
                        <div className="space-y-2">
                          {videoLessons.map((lesson: any, lessonIdx: number) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-3 bg-blue-50 rounded-[8px] border-2 border-[#1C293C]"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold">
                                  {lessonIdx + 1}
                                </div>
                                <div>
                                  <p className="font-['Inter', sans-serif] text-sm font-medium text-[#1C293C]">
                                    {lesson.tieu_de}
                                  </p>
                                  <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {lesson.thoi_luong || "0:00"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => editor.lessonForm.edit(lesson, chapter.id)}
                                  className="p-2 hover:bg-blue-100 rounded"
                                >
                                  <Edit2 className="w-4 h-4 text-blue-600" />
                                </button>
                                <button
                                  onClick={() => editor.handleDeleteLesson(lesson.id, chapter.id)}
                                  className="p-2 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={() => editor.lessonForm.openWithChapter(chapter.id, "video")}
                            className="w-full p-3 text-blue-600 hover:bg-blue-50 rounded-[8px] border-2 border-dashed border-blue-300 font-['Inter', sans-serif] text-sm flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Thêm video
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {exerciseLessons.map((lesson: any, lessonIdx: number) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-3 bg-purple-50 rounded-[8px] border-2 border-[#1C293C]"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center text-xs font-bold">
                                  {lessonIdx + 1}
                                </div>
                                <div>
                                  <p className="font-['Inter', sans-serif] text-sm font-medium text-[#1C293C]">
                                    {lesson.tieu_de}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Bài tập
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => editor.lessonForm.edit(lesson, chapter.id)}
                                  className="p-2 hover:bg-purple-100 rounded"
                                >
                                  <Edit2 className="w-4 h-4 text-purple-600" />
                                </button>
                                <button
                                  onClick={() => editor.handleDeleteLesson(lesson.id, chapter.id)}
                                  className="p-2 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={() => editor.lessonForm.openWithChapter(chapter.id, "exercise")}
                            className="w-full p-3 text-purple-600 hover:bg-purple-50 rounded-[8px] border-2 border-dashed border-purple-300 font-['Inter', sans-serif] text-sm flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Thêm bài tập
                          </button>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}

              {editor.chapters.length === 0 && (
                <Card className="p-8 text-center border-3 border-[#1C293C]">
                  <LayoutGrid className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">
                    Chưa có chương nào. Hãy thêm chương đầu tiên!
                  </p>
                  <Button variant="primary" onClick={editor.chapterForm.open}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm chương
</Button>
                </Card>
              )}
            </div>
          )}

          {/* Section: Pricing */}
          {activeSection === "pricing" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-8 h-8 text-[#49B6E5]" />
                <h2 className="font-['Inter', sans-serif] text-2xl font-bold text-[#1C293C]">
                  Giá & Danh mục
                </h2>
              </div>

              <Card className="p-6 border-3 border-[#1C293C] shadow-[4px_4px_0px_#E5E1DC]">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-['Inter', sans-serif] font-bold text-[#1C293C] mb-2">
                      Giá bán (VNĐ)
                    </label>
                    <Input
                      type="number"
                      value={editor.course.gia || ""}
                      onChange={(value) => editor.courseField("gia", Number(value))}
                      className="border-2 border-[#1C293C] rounded-[8px] text-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-['Inter', sans-serif] font-bold text-[#1C293C] mb-2">
                      Danh mục
                    </label>
                    <select
                      value={editor.course.danh_muc_id || ""}
                      onChange={(e) =>
                        editor.courseField("danh_muc_id", Number(e.target.value))
                      }
                      className="w-full p-3 border-2 border-[#1C293C] rounded-[8px] font-['Inter', sans-serif]"
                    >
                      <option value="">Chọn danh mục</option>
                      {editor.categories.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.ten}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-['Inter', sans-serif] font-bold text-[#1C293C] mb-2">
                      Cấp độ
                    </label>
                    <select
                      value={editor.course.muc_do || ""}
                      onChange={(e) => editor.courseField("muc_do", e.target.value)}
                      className="w-full p-3 border-2 border-[#1C293C] rounded-[8px] font-['Inter', sans-serif]"
                    >
                      <option value="">Chọn cấp độ</option>
                      <option value="beginner">Người mới bắt đầu</option>
                      <option value="intermediate">Trung cấp</option>
                      <option value="advanced">Nâng cao</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-['Inter', sans-serif] font-bold text-[#1C293C] mb-2">
                      Số lượng tối đa
                    </label>
                    <Input
                      type="number"
                      value={editor.course.so_luong_toi_da || ""}
                      onChange={(value) =>
                        editor.courseField("so_luong_toi_da", Number(value))
                      }
                      className="border-2 border-[#1C293C] rounded-[8px]"
                      placeholder="Không giới hạn"
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Section: Settings */}
          {activeSection === "settings" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-8 h-8 text-[#49B6E5]" />
                <h2 className="font-['Inter', sans-serif] text-2xl font-bold text-[#1C293C]">
                  Cài đặt nâng cao
                </h2>
              </div>

              <Card className="p-6 border-3 border-[#1C293C] shadow-[4px_4px_0px_#E5E1DC]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border-2 border-[#1C293C] rounded-[8px]">
                    <div>
                      <p className="font-['Inter', sans-serif] font-medium text-[#1C293C]">
                        Cho phép đăng ký
                      </p>
                      <p className="text-sm text-gray-500">
                        Học viên có thể đăng ký khóa học
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 accent-[#49B6E5]"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border-2 border-[#1C293C] rounded-[8px]">
                    <div>
                      <p className="font-['Inter', sans-serif] font-medium text-[#1C293C]">
                        Hiển thị trong danh sách
                      </p>
                      <p className="text-sm text-gray-500">
                        Hiển thị trên cửa hàng
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 accent-[#49B6E5]"
                    />
                  </div>

                  {editor.course?.trang_thai === "draft" && (
                    <div className="pt-4">
                      <Button
                        variant="success"
                        onClick={editor.handleSubmitForApproval}
                        disabled={!editor.canSubmitForApproval}
                        className="w-full"
                      >
                        Gửi duyệt
                      </Button>
                    </div>
                  )}

                  {editor.course?.trang_thai === "rejected" && (
                    <div className="pt-4">
                      <Button
                        variant="outline"
                        onClick={editor.handleRevertToDraft}
                        className="w-full"
                      >
                        Chỉnh sửa lại
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Chapter Modal */}
        <Modal
          open={editor.activeModal === "chapter"}
          onClose={editor.closeModal}
          title="Thêm chương mới"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Tên chương</label>
              <Input
                value={editor.chapterForm.formData.tieu_de}
                onChange={(value) => editor.chapterForm.setField("tieu_de", value)}
                placeholder="VD: Chương 1 - Giới thiệu"
                className="border-2 border-[#1C293C]"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={editor.closeModal}>
                Hủy
              </Button>
              <Button
                variant="primary"
                onClick={async () => {
                  const title = editor.chapterForm.formData.tieu_de;
                  if (!title?.trim()) {
                    alert("Vui lòng nhập tên chương");
                    return;
                  }
                  if (courseId && courseId > 0) {
                    try {
                      const { chapter } = await import("../../api").then((m) =>
                        m.createChapter(courseId, title.trim(), editor.chapters.length + 1)
                      );
                      if (chapter) {
                        editor.addChapter(title.trim(), editor.chapters.length + 1);
                        editor.closeModal();
                        editor.chapterForm.reset();
                      }
                    } catch (e) {
                      alert("Thêm chương thất bại");
                    }
                  }
                }}
              >
                Lưu
              </Button>
            </div>
          </div>
        </Modal>

        {/* Lesson Modal */}
        <Modal
          open={editor.activeModal === "lesson"}
          onClose={editor.closeModal}
          title={editor.editingLesson?.lesson ? "Sửa bài học" : "Thêm bài học mới"}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Tiêu đề</label>
              <Input
                value={editor.lessonForm.formData.tieu_de}
                onChange={(value) => editor.lessonForm.setField("tieu_de", value)}
                placeholder="VD: Bài 1 - Giới thiệu React"
                className="border-2 border-[#1C293C]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Loại</label>
              <select
                value={editor.lessonForm.formData.loai}
                onChange={(e) => editor.lessonForm.setField("loai", e.target.value as any)}
                className="w-full p-3 border-2 border-[#1C293C] rounded-[8px]"
              >
                <option value="video">Video</option>
                <option value="exercise">Bài tập</option>
                <option value="document">Tài liệu</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>
            {editor.lessonForm.formData.loai === "video" && (
              <div>
                <label className="block text-sm font-bold mb-2">Video URL</label>
                <Input
                  value={editor.lessonForm.formData.video_url}
                  onChange={(value) => editor.lessonForm.setField("video_url", value)}
                  placeholder="https://youtube.com/..."
                  className="border-2 border-[#1C293C]"
                />
              </div>
            )}
            {editor.lessonForm.formData.loai === "video" && (
              <div>
                <label className="block text-sm font-bold mb-2">Thời lượng</label>
                <Input
                  value={editor.lessonForm.formData.thoi_luong}
                  onChange={(value) => editor.lessonForm.setField("thoi_luong", value)}
                  placeholder="VD: 10:00"
                  className="border-2 border-[#1C293C]"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-bold mb-2">Nội dung</label>
              <textarea
                value={editor.lessonForm.formData.noi_dung}
                onChange={(e) => editor.lessonForm.setField("noi_dung", e.target.value)}
                placeholder="Nội dung bài học..."
                className="w-full p-3 border-2 border-[#1C293C] rounded-[8px] min-h-[150px]"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={editor.closeModal}>
                Hủy
              </Button>
              <Button
                variant="primary"
                onClick={async () => {
                  const { tieu_de, loai, video_url, thoi_luong, noi_dung } = editor.lessonForm.formData;
                  if (!tieu_de?.trim()) {
                    alert("Vui lòng nhập tiêu đề");
                    return;
                  }
                  const chapterId = editor.editingLesson?.chapterId;
                  if (!chapterId) {
                    alert("Không có chương");
                    return;
                  }
                  try {
                    if (editor.editingLesson?.lesson) {
                      await editor.updateLesson(editor.editingLesson.lesson.id, {
                        tieu_de: tieu_de.trim(),
                        loai,
                        video_url,
                        thoi_luong,
                        noi_dung,
                      });
                    } else {
                      await editor.addLesson(chapterId, {
                        tieu_de: tieu_de.trim(),
                        loai,
                        video_url,
                        thoi_luong,
                        noi_dung,
                      });
                    }
                    editor.closeModal();
                    editor.lessonForm.reset();
                  } catch (e) {
                    alert("Lưu thất bại");
                  }
                }}
              >
                Lưu
              </Button>
            </div>
          </div>
        </Modal>
    </div>
  );
};

export default TeacherCourseEditPageRedesign;