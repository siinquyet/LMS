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
  type QuizQuestion,
} from "../../components/common";
import { useTeacherCourseEditor } from "../../hooks/useTeacherCourseEditor";
import * as api from "../../api";

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
      case "quiz":
        return <HelpCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const totalLessons = editor.chapters.reduce(
    (sum, ch) => sum + (ch.bai_hoc?.length || 0),
    0,
  );

  const [editingChapterId, setEditingChapterId] = useState<number | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

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
                  value={editor.course?.tieu_de || ""}
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
                  value={editor.course?.mo_ta || ""}
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
                    value={editor.course?.danh_muc_id || ""}
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
                    value={editor.course?.muc_do || ""}
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
                  onClick={async () => {
                    try {
                      const result: any = await editor.handleSaveCourse();
                      if (result?.course?.id) {
                        navigate(`/teacher/courses/${result.course.id}`, { replace: true });
                      }
                    } catch (e) {
                      // Error already handled in saveCourse
                    }
                  }}
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
                  Ảnh khóa học
                </h3>
                <ImageUpload
                  value={editor.course.hinh_anh || ""}
                  onChange={(url) => editor.courseField("hinh_anh", url)}
                  placeholder="Tải ảnh khóa học"
                />
              </Card>

              <Card className="p-6 border-3 border-[#1C293C] shadow-[4px_4px_0px_#E5E1DC]">
                <h3 className="font-['Inter', sans-serif] text-lg font-bold text-[#1C293C] mb-4">
                  Kiến thức đạt được
                </h3>
                <p className="text-sm text-gray-500 mb-3">Học viên sẽ học được gì từ khóa học này?</p>
                <div className="space-y-2">
                  {(editor.course.what_you_learn || []).map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        value={item}
                        onChange={(value) => {
                          const newList = [...(editor.course.what_you_learn || [])];
                          newList[idx] = value;
                          editor.courseField("what_you_learn", newList);
                        }}
                        className="border-2 border-[#1C293C] rounded-[8px] flex-1"
                        placeholder="VD: Xây dựng ứng dụng React từ đầu"
                      />
                      <button
                        onClick={() => {
                          const newList = (editor.course.what_you_learn || []).filter((_: any, i: number) => i !== idx);
                          editor.courseField("what_you_learn", newList);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newList = [...(editor.course.what_you_learn || []), ""];
                      editor.courseField("what_you_learn", newList);
                    }}
                    className="w-full p-3 text-blue-600 hover:bg-blue-50 rounded-[8px] border-2 border-dashed border-blue-300 font-['Inter', sans-serif] text-sm flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm mục tiêu
                  </button>
                </div>
              </Card>

              <Card className="p-6 border-3 border-[#1C293C] shadow-[4px_4px_0px_#E5E1DC]">
                <h3 className="font-['Inter', sans-serif] text-lg font-bold text-[#1C293C] mb-4">
                  Yêu cầu đầu vào
                </h3>
                <p className="text-sm text-gray-500 mb-3">Học viên cần có kiến thức gì trước khi tham gia?</p>
                <div className="space-y-2">
                  {(editor.course.requirements || []).map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        value={item}
                        onChange={(value) => {
                          const newList = [...(editor.course.requirements || [])];
                          newList[idx] = value;
                          editor.courseField("requirements", newList);
                        }}
                        className="border-2 border-[#1C293C] rounded-[8px] flex-1"
                        placeholder="VD: Biết cơ bản HTML, CSS, JavaScript"
                      />
                      <button
                        onClick={() => {
                          const newList = (editor.course.requirements || []).filter((_: any, i: number) => i !== idx);
                          editor.courseField("requirements", newList);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newList = [...(editor.course.requirements || []), ""];
                      editor.courseField("requirements", newList);
                    }}
                    className="w-full p-3 text-orange-600 hover:bg-orange-50 rounded-[8px] border-2 border-dashed border-orange-300 font-['Inter', sans-serif] text-sm flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm yêu cầu
                  </button>
                </div>
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
              </div>                {editor.chapters.map((chapter: any, idx: number) => {
                const allLessons = chapter.bai_hoc || [];
                
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
                            {allLessons.length} bài học
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingChapterId(chapter.id);
                            editor.chapterForm.edit(chapter);
                          }}
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

                    <div className="p-4 space-y-2">
                      {[...allLessons].sort((a: any, b: any) => (a.thu_tu || 0) - (b.thu_tu || 0)).map((lesson: any, lessonIdx: number) => {
                        const lessonIcon = lesson.loai === "video" ? "🎬" : lesson.loai === "quiz" ? "📝" : "📄";
                        const lessonColor = lesson.loai === "video" ? "bg-blue-50 border-blue-300" : lesson.loai === "quiz" ? "bg-purple-50 border-purple-300" : "bg-orange-50 border-orange-300";
                        const lessonLabel = lesson.loai === "video" ? "Video" : lesson.loai === "quiz" ? "Quiz" : "Tài liệu";
                        
                        return (
                          <div
                            key={lesson.id}
                            className={`flex items-center justify-between p-3 rounded-[8px] border-2 ${lessonColor}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white text-gray-700 flex items-center justify-center text-xs font-bold">
                                {lesson.thu_tu || lessonIdx + 1}
                              </div>
                              <div>
                                <p className="font-['Inter', sans-serif] text-sm font-medium text-[#1C293C]">
                                  <span className="mr-2">{lessonIcon}</span>
                                  {lesson.tieu_de}
                                </p>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  {lesson.loai === "video" && <><Clock className="w-3 h-3" /> {lesson.thoi_luong || "0:00"}</>}
                                  {lesson.loai === "quiz" && <>📝 {lesson.quizzes?.[0]?.so_cau_hoi || 0} câu hỏi</>}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border text-gray-500">
                                {lessonLabel}
                              </span>
                              <button
                                onClick={() => {
                                  editor.lessonForm.edit(lesson, chapter.id);
                                  // Load quiz questions when editing a quiz lesson
                                  if (lesson.loai === "quiz" && lesson.quizzes?.[0]) {
                                    api.getQuiz(lesson.quizzes[0].id).then((res: any) => {
                                      if (res?.quiz) {
                                        // Sync quiz title and time limit into lessonForm
                                        editor.lessonForm.setField("tieu_de", res.quiz.tieu_de || lesson.tieu_de);
                                        editor.lessonForm.setField("thoi_luong", String(res.quiz.thoi_gian_lam || 10));
                                        // Load quiz questions
                                        if (res.quiz.questions) {
                                          setQuizQuestions(res.quiz.questions.map((q: any) => {
                                            const dapAnIndex = Array.isArray(q.lua_chon) ? q.lua_chon.indexOf(q.dap_an_dung) : -1;
                                            return {
                                              id: q.id,
                                              cau_hoi: q.cau_hoi,
                                              lua_chon: q.lua_chon,
                                              dap_an_dung: dapAnIndex >= 0 ? dapAnIndex : 0,
                                            };
                                          }));
                                        }
                                      }
                                    }).catch(() => setQuizQuestions([]));
                                  } else {
                                    setQuizQuestions([]);
                                  }
                                }}
                                className="p-2 hover:bg-gray-200/50 rounded"
                              >
                                <Edit2 className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() => editor.handleDeleteLesson(lesson.id, chapter.id)}
                                className="p-2 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      <div className="flex gap-2">
                        <button
                          onClick={() => editor.lessonForm.openWithChapter(chapter.id, "video")}
                          className="flex-1 p-3 text-blue-600 hover:bg-blue-50 rounded-[8px] border-2 border-dashed border-blue-300 font-['Inter', sans-serif] text-sm flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Thêm video
                        </button>
                        <button
                          onClick={() => editor.lessonForm.openWithChapter(chapter.id, "quiz")}
                          className="flex-1 p-3 text-purple-600 hover:bg-purple-50 rounded-[8px] border-2 border-dashed border-purple-300 font-['Inter', sans-serif] text-sm flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Thêm quiz
                        </button>
                      </div>
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
          onClose={() => { editor.closeModal(); setEditingChapterId(null); }}
          title={editingChapterId ? "Sửa chương" : "Thêm chương mới"}
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
              <Button variant="outline" onClick={() => { editor.closeModal(); setEditingChapterId(null); }}>
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
                      if (editingChapterId) {
                        await api.updateChapter(editingChapterId, { tieu_de: title.trim() });
                        // Update local state instead of reloading
                        editor.setChapters((prev: any) =>
                          prev.map((ch: any) =>
                            ch.id === editingChapterId ? { ...ch, tieu_de: title.trim() } : ch
                          )
                        );
                        setEditingChapterId(null);
                        editor.closeModal();
                        editor.chapterForm.reset();
                      } else {
                        const { chapter } = await import("../../api").then((m) =>
                          m.createChapter(courseId, title.trim(), editor.chapters.length + 1)
                        );
                        if (chapter) {
                          editor.addChapter(title.trim(), editor.chapters.length + 1);
                          editor.closeModal();
                          editor.chapterForm.reset();
                        }
                      }
                    } catch (e: any) {
                      alert(e?.message || "Thêm chương thất bại");
                    }
                  }
                }}
              >
                {editingChapterId ? "Cập nhật" : "Lưu"}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Lesson Modal */}
        <Modal
          open={editor.activeModal === "lesson"}
          onClose={() => { editor.closeModal(); setQuizQuestions([]); }}
          title={editor.editingLesson?.lesson ? "Sửa bài học" : "Thêm bài học mới"}
        >
          <div className="space-y-4">
            {/* Tiêu đề - hide when quiz because QuizBuilder has its own title */}
            {editor.lessonForm.formData.loai !== "quiz" && (
              <div>
                <label className="block text-sm font-bold mb-2">Tiêu đề bài học</label>
                <Input
                  value={editor.lessonForm.formData.tieu_de}
                  onChange={(value) => editor.lessonForm.setField("tieu_de", value)}
                  placeholder="VD: Bài 1 - Giới thiệu React"
                  className="border-2 border-[#1C293C]"
                />
              </div>
            )}

            {/* Loại bài học - Type selector buttons */}
            <div>
              <label className="block text-sm font-bold mb-2">Loại bài học</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "video", label: "Video", icon: "🎬" },
                  { value: "quiz", label: "Quiz", icon: "📝" },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => {
                      editor.lessonForm.setField("loai", type.value as any);
                      if (type.value !== "quiz") setQuizQuestions([]);
                    }}
                    className={`p-4 rounded-[8px] border-2 text-center transition-all ${
                      editor.lessonForm.formData.loai === type.value
                        ? type.value === "video"
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-[2px_2px_0px_#49B6E5]"
                          : "border-purple-500 bg-purple-50 text-purple-700 shadow-[2px_2px_0px_#7C3AED]"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-3xl mb-1">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Video form */}
            {editor.lessonForm.formData.loai === "video" && (
              <>
                <div>
                  <label className="block text-sm font-bold mb-2">Tải video lên</label>
                  <VideoUpload
                    value={editor.lessonForm.formData.video_url}
                    onChange={(url) => editor.lessonForm.setField("video_url", url)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Thời lượng (phút:giây)</label>
                  <Input
                    value={editor.lessonForm.formData.thoi_luong}
                    onChange={(value) => editor.lessonForm.setField("thoi_luong", value)}
                    placeholder="VD: 10:00"
                    className="border-2 border-[#1C293C]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Mô tả nội dung</label>
                  <textarea
                    value={editor.lessonForm.formData.noi_dung}
                    onChange={(e) => editor.lessonForm.setField("noi_dung", e.target.value)}
                    placeholder="Mô tả nội dung video..."
                    className="w-full p-3 border-2 border-[#1C293C] rounded-[8px] min-h-[100px]"
                  />
                </div>
              </>
            )}

            {/* Quiz form */}
            {editor.lessonForm.formData.loai === "quiz" && (
              <QuizBuilder
                formData={{
                  tieu_de: editor.lessonForm.formData.tieu_de || "",
                  thoi_gian_lam: editor.lessonForm.formData.thoi_luong ? parseInt(editor.lessonForm.formData.thoi_luong) || 10 : 10,
                  so_cau_hoi: quizQuestions.length,
                  cau_hoi: quizQuestions,
                }}
                onChange={(data) => {
                  setQuizQuestions(data.cau_hoi);
                  editor.lessonForm.setField("thoi_luong", String(data.thoi_gian_lam));
                  editor.lessonForm.setField("tieu_de", data.tieu_de);
                }}
              />
            )}



            {/* Actions */}
            <div className="flex gap-2 justify-end pt-2 border-t-2 border-gray-100">
              <Button variant="outline" onClick={() => { editor.closeModal(); setQuizQuestions([]); }}>
                Hủy
              </Button>
              <Button
                variant="primary"
                onClick={async () => {
                  const { tieu_de, loai, video_url, thoi_luong, noi_dung } = editor.lessonForm.formData;
                  if (!tieu_de?.trim() && loai !== "quiz") {
                    alert("Vui lòng nhập tiêu đề");
                    return;
                  }
                  const chapterId = editor.editingLesson?.chapterId;
                  if (!chapterId) {
                    alert("Không có chương");
                    return;
                  }
                  try {                      if (editor.editingLesson?.lesson) {
                        await editor.updateLesson(editor.editingLesson.lesson.id, {
                          tieu_de: tieu_de.trim(),
                          loai,
                          video_url,
                          thoi_luong,
                          noi_dung,
                        });

                        // If editing a quiz lesson, update questions (even if empty - deletes all)
                        if (loai === "quiz" && editor.editingLesson.lesson.quizzes?.[0]) {
                          try {
                            await api.replaceQuizQuestions(
                              editor.editingLesson.lesson.quizzes[0].id,
                              quizQuestions.map((q) => ({
                                cau_hoi: q.cau_hoi,
                                lua_chon: q.lua_chon,
                                dap_an_dung: q.dap_an_dung,
                              })),
                            );
                          } catch (quizErr) {
                            console.error("Failed to update quiz questions:", quizErr);
                            alert("Cập nhật câu hỏi quiz thất bại. Vui lòng thử lại.");
                          }
                        }

                        editor.closeModal();
                        editor.lessonForm.reset();
                        setQuizQuestions([]);
                    } else {
                      const lessonTitle = tieu_de.trim() || "Bài kiểm tra";

                      const lesson = await editor.addLesson(chapterId, {
                        tieu_de: lessonTitle,
                        loai,
                        video_url,
                        thoi_luong,
                        noi_dung,
                      });

                      // If quiz type, create the quiz with questions
                      if (loai === "quiz" && lesson && quizQuestions.length > 0) {
                        try {
                          const quizResult = await api.createLessonQuiz(lesson.id, {
                            tieu_de: lessonTitle,
                            thoi_gian_lam: parseInt(thoi_luong) || 10,
                            questions: quizQuestions.map((q) => ({
                              cau_hoi: q.cau_hoi,
                              lua_chon: q.lua_chon,
                              dap_an_dung: q.dap_an_dung,
                            })),
                          });
                          // Update local state with quiz data so it shows immediately
                          if (quizResult?.quiz) {
                            editor.setChapters((prev: any) =>
                              prev.map((ch: any) => ({
                                ...ch,
                                bai_hoc: (ch.bai_hoc || []).map((l: any) =>
                                  l.id === lesson.id
                                    ? { ...l, tieu_de: lessonTitle, quizzes: [{ id: quizResult.quiz.id, so_cau_hoi: quizResult.quiz.so_cau_hoi, thoi_gian_lam: quizResult.quiz.thoi_gian_lam }] }
                                    : l
                                ),
                              }))
                            );
                          }
                        } catch (quizErr) {
                          console.error("Failed to create quiz questions:", quizErr);
                          alert("Bài học đã tạo nhưng tạo câu hỏi quiz thất bại. Bạn có thể thêm sau.");
                        }
                      }

                      alert("Thêm bài học thành công!");
                      editor.closeModal();
                      editor.lessonForm.reset();
                      setQuizQuestions([]);
                    }
                  } catch (e: any) {
                    alert(e?.message || "Lưu thất bại");
                  }
                }}
              >
                {editor.editingLesson?.lesson ? "Cập nhật" : "Thêm bài học"}
              </Button>
            </div>
          </div>
        </Modal>
    </div>
  );
};

export default TeacherCourseEditPageRedesign;