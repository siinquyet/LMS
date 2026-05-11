import { useEffect, useState } from "react";
import {
  Play,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Clock,
  Menu,
  X,
  MessageSquare,
  FileText,
  HelpCircle,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Send,
  Loader,
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getCourse,
  getLesson,
  getMyEnrollments,
  getUserProgress,
  updateProgress,
  submitQuiz,
} from "../../api";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Progress,
  YouTubePlayer,
} from "../../components/common";
import { useAuth } from "../../contexts/AuthContext";
import Footer from "../../components/layout/Footer";

interface Lesson {
  id: number;
  title: string;
  duration: string;
  type: "video" | "document" | "quiz" | "exercise";
  completed?: boolean;
}

interface Chapter {
  id: number;
  title: string;
  lessons: Lesson[];
}

const LearningPageRedesign = () => {
  const { id: courseId, lessonId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [realCourse, setRealCourse] = useState<any>(null);
  const [realLesson, setRealLesson] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "resources" | "discussion">("overview");
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const courseData = await getCourse(Number(courseId));
        setRealCourse(courseData.course);

        // Get enrolled lessons with progress
        const progressData = await getUserProgress(Number(courseId));
        if (progressData.progress) {
          const completed = new Set(
            progressData.progress
              .filter((p: any) => p.da_hoan_thanh)
              .map((p: any) => p.bai_hoc_id)
          );
          setCompletedLessons(completed);
        }

        // Get current lesson
        if (lessonId) {
          const lessonData = await getLesson(Number(lessonId));
          setRealLesson(lessonData.lesson);
        } else if (courseData.course.chuong_hoc?.[0]?.bai_hoc?.[0]) {
          const firstLesson = courseData.course.chuong_hoc[0].bai_hoc[0];
          navigate(`/learn/${courseId}/${firstLesson.id}`, { replace: true });
        }

        // Expand first chapter by default
        if (courseData.course.chuong_hoc?.length > 0) {
          setExpandedChapters(new Set([courseData.course.chuong_hoc[0].id]));
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchData();
  }, [courseId, lessonId]);

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) next.delete(chapterId);
      else next.add(chapterId);
      return next;
    });
  };

  const handleCompleteLesson = async () => {
    if (!lessonId || !courseId) return;
    try {
      await updateProgress(Number(lessonId), true);
      setCompletedLessons((prev) => new Set(prev).add(Number(lessonId)));
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const handlePrevLesson = () => {
    const allLessons = realCourse?.chuong_hoc?.flatMap((ch: any) =>
      ch.bai_hoc.map((l: any) => ({ ...l, chapterId: ch.id }))
    ) || [];
    const currentIndex = allLessons.findIndex((l: any) => l.id === Number(lessonId));
    if (currentIndex > 0) {
      const prevLesson = allLessons[currentIndex - 1];
      navigate(`/learn/${courseId}/${prevLesson.id}`);
    }
  };

  const handleNextLesson = () => {
    const allLessons = realCourse?.chuong_hoc?.flatMap((ch: any) =>
      ch.bai_hoc.map((l: any) => ({ ...l, chapterId: ch.id }))
    ) || [];
    const currentIndex = allLessons.findIndex((l: any) => l.id === Number(lessonId));
    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      navigate(`/learn/${courseId}/${nextLesson.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!realCourse) {
    return (
      <div className="min-h-screen bg-[#F8F6F3] p-8">
        <Card className="p-8 text-center border-3 border-[#1C293C]">
          <p className="text-red-500 mb-4">Không tìm thấy khóa học</p>
          <Button onClick={() => navigate("/my-courses")}>Quay lại</Button>
        </Card>
      </div>
    );
  }

  const completedCount = completedLessons.size;
  const totalCount = realCourse?.chuong_hoc?.reduce(
    (sum: number, ch: any) => sum + (ch.bai_hoc?.length || 0),
    0
  ) || 0;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isCurrentCompleted = realLesson && completedLessons.has(realLesson.id);

  const getLessonIcon = (type: string, completed: boolean) => {
    if (completed) return <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />;
    switch (type) {
      case "video":
        return <Play className="w-5 h-5 text-gray-400 shrink-0" />;
      case "quiz":
        return <HelpCircle className="w-5 h-5 text-yellow-500 shrink-0" />;
      case "exercise":
        return <FileText className="w-5 h-5 text-purple-500 shrink-0" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400 shrink-0" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F3] flex flex-col">
      {/* Top Bar */}
      <div className="bg-[#1C293C] text-white px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="p-2 hover:bg-white/10 rounded-[8px] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-['Inter', sans-serif] font-bold">
              {realCourse.tieu_de}
            </h1>
            <div className="flex items-center gap-3 text-xs text-white/60">
              <span>{completedCount}/{totalCount} completed</span>
              <Progress value={progress} className="w-24 h-2 bg-white/20" />
              <span>{progress}%</span>
            </div>
          </div>
        </div>
        <Badge variant={isCurrentCompleted ? "success" : "warning"}>
          {isCurrentCompleted ? "Hoàn thành" : "Đang học"}
        </Badge>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "w-80" : "w-0"
          } transition-all duration-300 bg-white border-r-3 border-[#1C293C] overflow-hidden flex flex-col`}
        >
          <div className="w-80 h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b-2 border-[#1C293C]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-['Inter', sans-serif] text-lg font-bold text-[#1C293C] line-clamp-1">
                  {realCourse.tieu_de}
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tiến độ</span>
                  <span className="font-['Inter', sans-serif] font-bold text-[#1C293C]">
                    {progress}%
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-gray-500">
                  {completedCount}/{totalCount} bài đã hoàn thành
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-2">
              {realCourse.chuong_hoc?.map((chapter: any) => (
                <div key={chapter.id} className="mb-2">
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className="w-full p-3 flex items-center justify-between bg-[#1C293C] text-white rounded-[8px] hover:bg-[#2a3a4d] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-white/20 text-xs font-bold flex items-center justify-center">
                        {chapter.thu_tu}
                      </span>
                      <span className="font-['Inter', sans-serif] text-sm font-medium line-clamp-1">
                        {chapter.tieu_de}
                      </span>
                    </div>
                    {expandedChapters.has(chapter.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {expandedChapters.has(chapter.id) && (
                    <div className="mt-1 ml-2 space-y-1">
                      {chapter.bai_hoc?.map((lesson: any) => {
                        const isCompleted = completedLessons.has(lesson.id);
                        const isCurrent = lesson.id === Number(lessonId);
                        return (
                          <Link
                            key={lesson.id}
                            to={`/learn/${courseId}/${lesson.id}`}
                            className={`w-full p-3 flex items-center gap-3 rounded-[8px] text-left transition-colors ${
                              isCurrent
                                ? "bg-[#49B6E5]/10 border-2 border-[#49B6E5]"
                                : "hover:bg-gray-50 border-2 border-transparent"
                            }`}
                          >
                            {getLessonIcon(lesson.loai, isCompleted)}
                            <div className="flex-1 min-w-0">
                              <p
                                className={`font-['Inter', sans-serif] text-sm line-clamp-1 ${
                                  isCurrent
                                    ? "text-[#1C293C] font-medium"
                                    : "text-gray-600"
                                }`}
                              >
                                {lesson.tieu_de}
                              </p>
                              <p className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {lesson.thoi_luong || lesson.loai}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Video/Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="mb-4 p-2 hover:bg-gray-100 rounded-[8px] border-2 border-[#1C293C]"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}

              {realLesson && (
                <>
                  {/* Video Player or Content */}
                  <div className="mb-6">
                    {realLesson.video_url ? (
                      <div className="aspect-video bg-black rounded-[12px] overflow-hidden shadow-[6px_6px_0px_#1C293C] border-3 border-[#1C293C]">
                        <YouTubePlayer
                          videoUrl={realLesson.video_url}
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                        />
                      </div>
                    ) : realLesson.loai === "quiz" ? (
                      <Card className="p-8 text-center border-3 border-[#1C293C] shadow-[6px_6px_0px_#E5E1DC]">
                        <HelpCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                        <h3 className="font-['Inter', sans-serif] text-xl font-bold text-[#1C293C] mb-2">
                          Quiz: {realLesson.tieu_de}
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Kiểm tra kiến thức của bạn
                        </p>
                        <Link to={`/quiz/${courseId}/${realLesson.id}/do`}>
                          <Button variant="primary" size="lg">
                            Làm bài quiz
                          </Button>
                        </Link>
                      </Card>
                    ) : (
                      <Card className="p-8 border-3 border-[#1C293C] shadow-[6px_6px_0px_#E5E1DC]">
                        <div className="prose max-w-none">
                          <h2 className="font-['Inter', sans-serif] text-xl font-bold text-[#1C293C] mb-4">
                            {realLesson.tieu_de}
                          </h2>
                          <div
                            className="font-['Inter', sans-serif] text-gray-600"
                            dangerouslySetInnerHTML={{
                              __html: realLesson.noi_dung || "",
                            }}
                          />
                        </div>
                      </Card>
                    )}
                  </div>

                  {/* Lesson Title & Tabs */}
                  <div className="mb-6">
                    <h1 className="font-['Inter', sans-serif] text-2xl font-bold text-[#1C293C] mb-2">
                      {realLesson.tieu_de}
                    </h1>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      {realLesson.loai === "video"
                        ? "Video"
                        : realLesson.loai === "quiz"
                        ? "Quiz"
                        : realLesson.loai === "exercise"
                        ? "Bài tập"
                        : "Tài liệu"}
                      <span>•</span>
                      <Clock className="w-4 h-4" />
                      {realLesson.thoi_luong || "0:00"}
                    </p>
                  </div>

                  {/* Tab Navigation */}
                  <div className="flex gap-2 mb-4">
                    {[
                      { key: "overview", label: "Tổng quan", icon: BookOpen },
                      { key: "resources", label: "Tài liệu", icon: FileText },
                      { key: "discussion", label: "Thảo luận", icon: MessageSquare },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.key;
                      return (
                        <button
                          key={tab.key}
                          onClick={() =>
                            setActiveTab(tab.key as typeof activeTab)
                          }
                          className={`px-4 py-2 rounded-[8px] flex items-center gap-2 font-['Inter', sans-serif] text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-[#1C293C] text-white shadow-[3px_3px_0px_#49B6E5]"
                              : "bg-white border-2 border-[#1C293C] text-[#1C293C] hover:bg-gray-50"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab Content */}
                  <Card className="p-6 border-3 border-[#1C293C] shadow-[4px_4px_0px_#E5E1DC] mb-6 min-h-[200px]">
                    {activeTab === "overview" && (
                      <div>
                        <h3 className="font-['Inter', sans-serif] text-lg font-bold text-[#1C293C] mb-3">
                          Giới thiệu bài học
                        </h3>
                        <p className="text-gray-600 font-['Inter', sans-serif] text-sm leading-relaxed">
                          {realLesson.mo_ta ||
                            "Nội dung chi tiết của bài học sẽ được hiển thị ở đây..."}
                        </p>
                      </div>
                    )}
                    {activeTab === "resources" && (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 font-['Inter', sans-serif]">
                          Chưa có tài liệu
                        </p>
                      </div>
                    )}
                    {activeTab === "discussion" && (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 font-['Inter', sans-serif] mb-3">
                          Chưa có thảo luận
                        </p>
                        <Button variant="outline">Bắt đầu thảo luận</Button>
                      </div>
                    )}
                  </Card>

                  {/* Navigation */}
                  <Card className="p-4 border-3 border-[#1C293C] shadow-[4px_4px_0px_#E5E1DC]">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={handlePrevLesson}
                        disabled={
                          !realCourse.chuong_hoc?.flatMap((ch: any) =>
                            ch.bai_hoc.map((l: any) => l.id)
                          ).indexOf(Number(lessonId))
                        }
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Bài trước
                      </Button>

                      {!isCurrentCompleted ? (
                        <Button variant="primary" onClick={handleCompleteLesson}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Hoàn thành
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 text-green-600 font-['Inter', sans-serif] font-medium">
                          <CheckCircle className="w-5 h-5" />
                          Hoàn thành
                        </div>
                      )}

                      <Button
                        variant="outline"
                        onClick={handleNextLesson}
                        disabled={
                          realCourse.chuong_hoc?.flatMap((ch: any) =>
                            ch.bai_hoc.map((l: any) => l.id)
                          ).indexOf(Number(lessonId)) ===
                          realCourse.chuong_hoc?.flatMap((ch: any) =>
                            ch.bai_hoc.map((l: any) => l.id)
                          ).length -
                            1
                        }
                      >
                        Bài sau
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPageRedesign;