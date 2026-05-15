import { useEffect, useRef, useState } from "react";
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
  AlertTriangle,
  Zap,
  AlertCircle,
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getCourse,
  getLesson,
  getMyEnrollments,
  getUserProgress,
  updateProgress,
  getCourseQuizScores,
} from "../../api";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Progress,
  VideoPlayer,
  DiscussionSection,
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
  const { id, courseId: courseIdFromRoute, lessonId } = useParams();
  const courseId = courseIdFromRoute || id;
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [realCourse, setRealCourse] = useState<any>(null);
  const [realLesson, setRealLesson] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "resources" | "discussion" | "notes">("overview");
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Quiz scores
  const [quizScores, setQuizScores] = useState<Map<number, { diem: number; trang_thai: string; lan_lam_cuoi_id: number | null }>>(new Map());
  const [showQuizConfirm, setShowQuizConfirm] = useState<{ lessonId: number; title: string; questionCount: number } | null>(null);
  
  // Notes feature
  const [notes, setNotes] = useState<Array<{id: number; timestamp: number; content: string; createdAt: string}>>([]);
  const [newNote, setNewNote] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const maxProgressRef = useRef(0); // Track max progress for completion

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId || isNaN(Number(courseId))) {
        setErrorMessage("ID khóa học không hợp lệ");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage(null);
        
        const courseData = await getCourse(Number(courseId));
        if (!courseData.course) {
          setErrorMessage("Không tìm thấy khóa học");
          setLoading(false);
          return;
        }
        
        setRealCourse(courseData.course);

        // Local variable to track completed lessons (sync, unlike React state)
        let completedSet = new Set<number>();

        // Check enrollment first
        if (user) {
          try {
            const enrollmentCheck = await getMyEnrollments();
            const isEnrolled = enrollmentCheck.enrollments?.some(
              (e: any) => e.khoa_hoc_id === Number(courseId)
            );
            if (!isEnrolled) {
              setErrorMessage("Bạn chưa đăng ký khóa học này");
              setLoading(false);
              return;
            }

            // Get enrolled lessons with progress
            try {
              const progressData = await getUserProgress(user.id, Number(courseId));
              if (progressData.progress) {
                const completed = new Set<number>(
                  progressData.progress
                    .filter((p: any) => p.da_hoan_thanh)
                    .map((p: any) => p.bai_hoc_id)
                );
                setCompletedLessons(completed);
                completedSet = completed; // Update local variable for sync use below
              }
            } catch (progressError) {
              console.warn("Could not fetch progress:", progressError);
            }

            // Fetch quiz scores
            try {
              const scoresData = await getCourseQuizScores(Number(courseId), user.id);
              if (scoresData.quiz_scores) {
                const scoresMap = new Map<number, { diem: number; trang_thai: string; lan_lam_cuoi_id: number | null }>();
                for (const s of scoresData.quiz_scores) {
                  scoresMap.set(s.bai_hoc_id, { diem: s.diem, trang_thai: s.trang_thai, lan_lam_cuoi_id: s.lan_lam_cuoi_id });
                }
                setQuizScores(scoresMap);
              }
            } catch (scoresError) {
              console.warn("Could not fetch quiz scores:", scoresError);
            }
          } catch (enrollError) {
            console.warn("Could not check enrollment:", enrollError);
          }
        }

        // Get current lesson - only if not already set (avoid infinite loop)
        if (lessonId && !isNaN(Number(lessonId)) && !realLesson) {
          const lessonData = await getLesson(Number(lessonId));
          setRealLesson(lessonData.lesson);
        } else if (!lessonId || lessonId === 'undefined') {
          // No lessonId - find first incomplete lesson or first lesson
          const allLessons: any[] = [];
          for (const chapter of courseData.course.chuong_hoc || []) {
            for (const lesson of chapter.bai_hoc || []) {
              allLessons.push(lesson);
            }
          }
          
          // Use local variable (not state) since React state updates are async
          let targetLesson = allLessons.find((l: any) => !completedSet.has(l.id));
          
          // If all completed, use first lesson
          if (!targetLesson && allLessons.length > 0) {
            targetLesson = allLessons[0];
          }
          
          if (targetLesson) {
            navigate(`/learn/${courseId}/${targetLesson.id}`, { replace: true });
          }
        }

        // Expand first chapter by default
        if (courseData.course.chuong_hoc?.length > 0) {
          setExpandedChapters(new Set([courseData.course.chuong_hoc[0].id]));
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        setErrorMessage("Đã xảy ra lỗi khi tải khóa học");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]); // Only run when courseId changes, not when lessonId changes via navigation

  // Separate effect for loading lesson when lessonId changes
  useEffect(() => {
    const loadLesson = async () => {
      // Need both course and lesson id to load
      if (!lessonId || isNaN(Number(lessonId))) return;
      
      // Try to get lesson from course data first (faster)
      let lessonFromCourse: any = null;
      if (realCourse?.chuong_hoc) {
        for (const ch of realCourse.chuong_hoc) {
          const found = ch.bai_hoc?.find((l: any) => l.id === Number(lessonId));
          if (found) {
            lessonFromCourse = found;
            break;
          }
        }
      }
      
      if (lessonFromCourse) {
        setRealLesson(lessonFromCourse);
        return;
      }
      
      // Fallback to API call
      if (!realCourse) return;
      
      try {
        const lessonData = await getLesson(Number(lessonId));
        if (lessonData?.lesson) {
          setRealLesson(lessonData.lesson);
        }
      } catch (error) {
        console.error("Error loading lesson:", error);
      }
    };

    loadLesson();
  }, [lessonId, realCourse]); // Run when lessonId changes

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) next.delete(chapterId);
      else next.add(chapterId);
      return next;
    });
  };

  const handleCompleteLesson = async () => {
    if (!lessonId || !courseId || !user) return;
    try {
      await updateProgress(user.id, Number(lessonId), true);
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
          <p className="text-red-500 mb-4 text-lg font-medium">
            {errorMessage || "Đã xảy ra lỗi"}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate("/my-courses")}>
              Khóa học của tôi
            </Button>
            <Button variant="outline" onClick={() => navigate("/store")}>
              Đăng ký khóa học
            </Button>
          </div>
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
                    <div className="mt-1 ml-2 space-y-1">                          {chapter.bai_hoc?.map((lesson: any) => {
                        const isCompleted = completedLessons.has(lesson.id);
                        const isCurrent = lesson.id === Number(lessonId);
                        const quizScore = quizScores.get(lesson.id);
                        return (
                          <button
                            key={lesson.id}
                            onClick={(e) => {
                              if (lesson.loai === 'quiz') {
                                e.preventDefault();
                                const questionCount = realLesson.quizzes?.[0]?.so_cau_hoi || 1;
                                setShowQuizConfirm({
                                  lessonId: lesson.id,
                                  title: lesson.tieu_de,
                                  questionCount,
                                });
                              } else {
                                navigate(`/learn/${courseId}/${lesson.id}`);
                              }
                            }}
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
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-gray-400 flex items-center gap-1 shrink-0">
                                  <Clock className="w-3 h-3" />
                                  {lesson.thoi_luong || lesson.loai}
                                </p>
                                {lesson.loai === 'quiz' && quizScore && (
                                  <span className={`text-xs font-bold ${
                                    quizScore.diem >= 5 ? "text-green-600" : quizScore.diem >= 3 ? "text-yellow-600" : "text-red-600"
                                  }`}>
                                    {quizScore.diem}/10
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
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
                        <VideoPlayer
                          ref={videoRef}
                          videoUrl={realLesson.video_url}
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          onComplete={handleCompleteLesson}
                        />
                      </div>
                    ) : realLesson.loai === "quiz" ? (
                      <Card className="p-8 text-center border-3 border-[#1C293C] shadow-[6px_6px_0px_#E5E1DC]">
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <HelpCircle className="w-16 h-16 text-yellow-500" />
                          {(() => {
                            const qs = quizScores.get(realLesson.id);
                            if (qs) {
                              return (
                                <div className={`px-4 py-2 rounded-[12px] ${
                                  qs.diem >= 5 ? "bg-green-100 text-green-700" : qs.diem >= 3 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                                }`}>
                                  <p className="text-xs font-medium">Điểm gần nhất</p>
                                  <p className="text-2xl font-bold">{qs.diem}/10</p>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                        <h3 className="font-['Inter', sans-serif] text-xl font-bold text-[#1C293C] mb-2">
                          Quiz: {realLesson.tieu_de}
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Kiểm tra kiến thức của bạn
                        </p>
                        <div className="flex items-center justify-center gap-3">
                          {(() => {
                            const qs = quizScores.get(realLesson.id);
                            if (qs) {
                              return (
                                <div className="flex items-center justify-center gap-3">
                                  <Button variant="primary" size="lg" onClick={() => setShowQuizConfirm({
                                    lessonId: realLesson.id,
                                    title: realLesson.tieu_de,
                                    questionCount: qs.diem >= 0 ? (realLesson.quizzes?.[0]?.so_cau_hoi || 1) : 1,
                                  })}>
                                    Làm lại
                                  </Button>
                                  {qs.lan_lam_cuoi_id && (
                                    <Link to={`/quiz/${courseId}/${realLesson.id}/review?attemptId=${qs.lan_lam_cuoi_id}`}>
                                      <Button variant="outline" size="lg">
                                        Xem lại
                                      </Button>
                                    </Link>
                                  )}
                                </div>
                              );
                            }
                            return (
                              <Button variant="primary" size="lg" onClick={() => setShowQuizConfirm({
                                lessonId: realLesson.id,
                                title: realLesson.tieu_de,
                                questionCount: realLesson.quizzes?.[0]?.so_cau_hoi || 1,
                              })}>
                                Làm bài quiz
                              </Button>
                            );
                          })()}
                        </div>
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
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {[
                      { key: "overview", label: "Tổng quan", icon: BookOpen },
                      { key: "resources", label: "Tài liệu", icon: FileText },
                      { key: "notes", label: "Ghi chú", icon: FileText },
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
                      <div>
                        <h3 className="font-['Inter', sans-serif] text-lg font-bold text-[#1C293C] mb-4">
                          Tài liệu bài học
                        </h3>
                        <div className="space-y-3">
                          <a
                            href="/uploads/documents/du-an-tlhk.docx"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-[8px] hover:border-[#49B6E5] transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-[8px] bg-[#1C293C] flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-['Inter', sans-serif] text-sm font-bold text-[#1C293C] group-hover:text-[#49B6E5] transition-colors truncate">
                                Dự án TLHKT
                              </p>
                              <p className="font-['Inter', sans-serif] text-xs text-gray-500">
                                Tài liệu Microsoft Word (.docx)
                              </p>
                            </div>
                            <svg
                              className="w-5 h-5 text-gray-400 group-hover:text-[#49B6E5] transition-colors shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </a>
                        </div>
                      </div>
                    )}
                    {activeTab === "discussion" && realLesson && (
                      <DiscussionSection lessonId={realLesson.id} />
                    )}
                    {activeTab === "notes" && (
                      <div>
                        <div className="mb-4">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newNote}
                              onChange={(e) => setNewNote(e.target.value)}
                              placeholder="Nhập ghi chú..."
                              className="flex-1 px-4 py-2 border-2 border-[#1C293C] rounded-[8px] font-['Inter', sans-serif] text-sm focus:border-[#49B6E5] outline-none"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && newNote.trim()) {
                                  const currentTime = videoRef?.current?.currentTime || 0;
                                  const minutes = Math.floor(currentTime / 60);
                                  const seconds = Math.floor(currentTime % 60);
                                  const timestamp = currentTime;
                                  
                                  const note = {
                                    id: Date.now(),
                                    timestamp,
                                    content: newNote.trim(),
                                    createdAt: new Date().toISOString()
                                  };
                                  setNotes([...notes, note]);
                                  setNewNote("");
                                }
                              }}
                            />
                            <Button 
                              variant="primary"
                              onClick={() => {
                                if (newNote.trim()) {
                                  const currentTime = videoRef?.current?.currentTime || 0;
                                  const note = {
                                    id: Date.now(),
                                    timestamp: currentTime,
                                    content: newNote.trim(),
                                    createdAt: new Date().toISOString()
                                  };
                                  setNotes([...notes, note]);
                                  setNewNote("");
                                }
                              }}
                            >
                              Thêm
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2 font-['Inter', sans-serif]">
                            Nhấn Enter hoặc nút Thêm để lưu ghi chú tại thời điểm hiện tại
                          </p>
                        </div>
                        
                        {notes.length === 0 ? (
                          <div className="text-center py-8">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 font-['Inter', sans-serif]">
                              Chưa có ghi chú. Thêm ghi chú để đánh dấu thời điểm quan trọng!
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-[300px] overflow-y-auto">
                            {notes
                              .sort((a, b) => a.timestamp - b.timestamp)
                              .map((note) => {
                                const minutes = Math.floor(note.timestamp / 60);
                                const seconds = Math.floor(note.timestamp % 60);
                                const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                                
                                return (
                                  <div 
                                    key={note.id}
                                    className="p-3 bg-gray-50 rounded-[8px] border-2 border-gray-200 hover:border-[#49B6E5] cursor-pointer transition-colors"
                                    onClick={() => {
                                      if (videoRef?.current) {
                                        videoRef.current.currentTime = note.timestamp;
                                        videoRef.current.play();
                                      }
                                    }}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-[#49B6E5] font-['Inter', sans-serif] text-sm font-bold">
                                        ⏱️ {timeStr}
                                      </span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setNotes(notes.filter(n => n.id !== note.id));
                                        }}
                                        className="text-red-500 hover:text-red-700 text-xs"
                                      >
                                        Xóa
                                      </button>
                                    </div>
                                    <p className="text-gray-700 font-['Inter', sans-serif] text-sm">
                                      {note.content}
                                    </p>
                                  </div>
                                );
                              })}
                          </div>
                        )}
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

      {/* Quiz Confirmation Modal */}
      {showQuizConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowQuizConfirm(null)}>
          <div
            className="bg-white rounded-[12px] border-3 border-[#1C293C] shadow-[6px_6px_0px_#E5E1DC] p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="font-['Inter', sans-serif] text-xl font-bold text-[#1C293C] mb-2">
                Làm bài kiểm tra
              </h3>
              <p className="font-['Inter', sans-serif] text-gray-500">
                Bạn sắp bắt đầu làm bài quiz "{showQuizConfirm.title}"
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-[8px] border-2 border-gray-200">
                <span className="font-['Inter', sans-serif] text-sm text-gray-600">Số câu hỏi</span>
                <span className="font-['Inter', sans-serif] font-bold text-[#1C293C]">{showQuizConfirm.questionCount} câu</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-[8px] border-2 border-gray-200">
                <span className="font-['Inter', sans-serif] text-sm text-gray-600">Điểm tối đa</span>
                <span className="font-['Inter', sans-serif] font-bold text-[#1C293C]">10 điểm</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-[8px] border-2 border-amber-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <p className="font-['Inter', sans-serif] text-xs text-amber-700">
                    Bài kiểm tra sẽ được chấm điểm ngay sau khi bạn nộp bài. Bạn có thể làm lại nhiều lần để cải thiện điểm số.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowQuizConfirm(null)}
              >
                Hủy
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  const lessonId = showQuizConfirm.lessonId;
                  setShowQuizConfirm(null);
                  navigate(`/quiz/${courseId}/${lessonId}/do`);
                }}
              >
                <Zap className="w-4 h-4 mr-2" />
                Bắt đầu
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPageRedesign;