import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play,
  FileText,
  HelpCircle,
  MessageSquare,
  Bookmark,
  Send,
  Heart,
  Reply,
  Clock,
  BookOpen,
  Menu,
  X,
  ClipboardList,
  CheckCircle,
  XCircle,
  Flag,
  ArrowUpDown,
  HeartOff
} from 'lucide-react';
import { Button, Card, Avatar, Badge, Sidebar, SidebarItem } from '../components/common';

interface Lesson {
  id: number;
  title: string;
  duration: string;
  type: 'video' | 'document' | 'quiz' | 'exercise';
  completed?: boolean;
}

interface Chapter {
  id: number;
  title: string;
  lessons: Lesson[];
}

type LessonType = 'video' | 'document' | 'quiz' | 'exercise';

interface Comment {
  id: number;
  user: string;
  avatar: string;
  content: string;
  time: string;
  replies?: Comment[];
}

interface Note {
  id: number;
  timestamp: string;
  content: string;
}

const courseData = {
  id: 1,
  title: 'React & Next.js Full Course',
  chapters: [
    {
      id: 1,
      title: 'Giới thiệu React',
      lessons: [
        { id: 1, title: 'React là gì?', duration: '10:00', type: 'video', completed: true },
        { id: 2, title: 'Cài đặt môi trường', duration: '15:00', type: 'video', completed: true },
        { id: 3, title: 'Tài liệu React', duration: '5:00', type: 'document', completed: false },
        { id: 4, title: 'Quiz chương 1', duration: '10:00', type: 'quiz', completed: false },
      ]
    },
    {
      id: 2,
      title: 'JSX và Component',
      lessons: [
        { id: 5, title: 'JSX là gì?', duration: '12:00', type: 'video', completed: false },
        { id: 6, title: 'Tạo Component', duration: '18:00', type: 'video', completed: false },
        { id: 7, title: 'Props và State', duration: '25:00', type: 'video', completed: false },
        { id: 8, title: 'Bài tập chương 2', duration: '30:00', type: 'exercise', completed: false },
      ]
    },
    {
      id: 3,
      title: 'Hooks trong React',
      lessons: [
        { id: 9, title: 'useState', duration: '20:00', type: 'video', completed: false },
        { id: 10, title: 'useEffect', duration: '25:00', type: 'video', completed: false },
        { id: 11, title: 'Tài liệu Hooks', duration: '10:00', type: 'document', completed: false },
        { id: 12, title: 'Quiz chương 3', duration: '20:00', type: 'quiz', completed: false },
      ]
    }
  ] as Chapter[],
  currentLesson: {
    id: 1,
    title: 'React là gì?',
    type: 'video',
    duration: '10:00',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content: `React là một thư viện JavaScript mã nguồn mở được phát triển bởi Facebook (Meta). 
Nó được sử dụng để xây dựng giao diện người dùng (UI) cho các ứng dụng web một cách nhanh chóng và hiệu quả.
React sử dụng mô hình component-based, cho phép chia nhỏ giao diện thành các phần độc lập có thể tái sử dụng.`,
    notes: [
      { id: 1, timestamp: '0:30', content: 'Giới thiệu về React' },
      { id: 2, timestamp: '2:15', content: 'Tại sao nên dùng React?' },
      { id: 3, timestamp: '5:00', content: 'Virtual DOM là gì?' },
    ] as Note[],
    documents: [
      { id: 1, title: 'React Documentation', size: '2.5 MB' },
      { id: 2, title: 'Getting Started Guide', size: '1.2 MB' },
    ],
    quiz: {
      questions: [
        {
          id: 1,
          question: 'React được phát triển bởi ai?',
          options: ['Google', 'Facebook', 'Microsoft', 'Apple'],
          correct: 1
        },
        {
          id: 2,
          question: 'React sử dụng mô hình n��o?',
          options: ['Object-Oriented', 'Component-based', 'Functional', 'Procedural'],
          correct: 1
        }
      ]
    },
    comments: [
      {
        id: 1,
        user: 'Nguyen Van A',
        avatar: 'NVA',
        content: 'Bài giảng rất dễ hiểu, cảm ơn thầy!',
        time: '2 giờ trước',
        replies: [
          {
            id: 2,
            user: 'Tran Thi B',
            avatar: 'TTB',
            content: 'Đồng ý, em cũng thấy dễ hiểu lắm!',
            time: '1 giờ trước'
          }
        ]
      },
      {
        id: 3,
        user: 'Le Van C',
        avatar: 'LVC',
        content: 'Cho em hỏi Virtual DOM khác gì Real DOM?',
        time: '30 phút trước'
      }
    ] as Comment[]
  }
};

export const LearningPage: React.FC = () => {
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'quiz' | 'notes' | 'documents' | 'discussion'>('discussion');
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number } | null>(null);
  const [quizReviewMode, setQuizReviewMode] = useState(false);
  const [reportModal, setReportModal] = useState<{ open: boolean; userId?: number; commentId?: number }>({ open: false });
  const [reportReason, setReportReason] = useState('');
  const [reportOther, setReportOther] = useState(false);
  const [sortComment, setSortComment] = useState<'newest' | 'oldest' | 'popular'>('newest');

  const quizHistory = [
    { id: 1, date: '2024-01-15', score: 8, total: 10, time: '15 phút' },
    { id: 2, date: '2024-01-10', score: 6, total: 10, time: '20 phút' },
  ];
  const [newComment, setNewComment] = useState('');
  const [newNote, setNewNote] = useState('');

  const currentLesson = courseData.currentLesson;

  const sortedComments = [...currentLesson.comments].sort((a, b) => {
    if (sortComment === 'newest') return b.id - a.id;
    if (sortComment === 'oldest') return a.id - b.id;
    return 0; // popular - giữ nguyên thứ tự
  });

  const buildSidebarItems = (): SidebarItem[] => {
    return courseData.chapters.map(chapter => ({
      id: `ch-${chapter.id}`,
      label: `${chapter.id}. ${chapter.title}`,
      icon: <BookOpen className="w-4 h-4" />,
      children: chapter.lessons.map(lesson => ({
        id: `lesson-${lesson.id}`,
        label: lesson.title,
        href: `/learn/${id}/${lesson.id}`,
        icon: lesson.type === 'video' ? <Play className="w-4 h-4" /> 
          : lesson.type === 'document' ? <FileText className="w-4 h-4" />
          : <HelpCircle className="w-4 h-4" />,
        badge: lesson.completed ? '✓' : undefined
      }))
    }));
  };

  const handleQuizSubmit = () => {
    const questions = currentLesson.quiz?.questions || [];
    const correct = quizAnswers.filter((ans, idx) => ans === questions[idx].correct).length;
    setQuizScore({ correct, total: questions.length });
    setShowQuizResult(true);
  };

  const handleStartQuiz = () => {
    setQuizMode(true);
    setShowQuizResult(false);
    setQuizScore(null);
    setQuizAnswers([]);
    setQuizReviewMode(false);
  };

  const handleReviewWrong = () => {
    setQuizReviewMode(true);
    setQuizMode(true);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setNewComment('');
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNewNote('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F3] flex">
      <Sidebar 
        items={buildSidebarItems()} 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="h-auto overflow-y-auto flex-shrink-0"
      />

      <div className="flex-1 flex flex-col">
        {/* Header with navigation */}
        <div className="bg-[#263D5B] text-white px-4 py-3 flex items-center justify-between shrink-0 z-10 gap-4">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-2 hover:bg-white/10 rounded-[8px]">
              {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
            <Link to="/my-courses" className="flex items-center gap-2 text-white/70 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
              <span className="font-['Comfortaa', cursive] hidden sm:inline">Quay lại</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="p-2 hover:bg-white/10 rounded-[8px]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-['Comfortaa', cursive] text-sm">{currentLesson.title}</span>
            <button type="button" className="p-2 hover:bg-white/10 rounded-[8px]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video section - fixed */}
        <div className="shrink-0">
          {currentLesson.type === 'video' && (
            <div className="bg-black">
              <div className="w-full aspect-video">
                <iframe src={currentLesson.videoUrl} title="Video player" className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
              <div className="p-4">
                <h2 className="font-['Comfortaa', cursive] text-xl text-white mb-2">{currentLesson.title}</h2>
                <p className="font-['Comfortaa', cursive] text-white/70 text-sm mb-3">{currentLesson.duration} • {courseData.title}</p>
                <p className="font-['Comfortaa', cursive] text-white/90 whitespace-pre-line">{currentLesson.content}</p>
              </div>
            </div>
          )}

          {/* Tabs - not scroll away */}
          <div className="border-b-2 border-[#263D5B] bg-white shrink-0">
            <div className="flex overflow-x-auto">
              <button type="button" onClick={() => setActiveTab('quiz')} className={`px-4 py-3 font-['Comfortaa', cursive] flex items-center gap-2 whitespace-nowrap ${activeTab === 'quiz' ? 'bg-[#E8F6FC] text-[#49B6E5] border-b-2 border-[#49B6E5]' : 'text-[#6B7280] hover:bg-gray-50'}`}>
                <ClipboardList className="w-4 h-4" /> Bài tập
              </button>
              <button type="button" onClick={() => setActiveTab('notes')} className={`px-4 py-3 font-['Comfortaa', cursive] flex items-center gap-2 whitespace-nowrap ${activeTab === 'notes' ? 'bg-[#E8F6FC] text-[#49B6E5] border-b-2 border-[#49B6E5]' : 'text-[#6B7280] hover:bg-gray-50'}`}>
                <Bookmark className="w-4 h-4" /> Ghi chú
              </button>
              <button type="button" onClick={() => setActiveTab('documents')} className={`px-4 py-3 font-['Comfortaa', cursive] flex items-center gap-2 whitespace-nowrap ${activeTab === 'documents' ? 'bg-[#E8F6FC] text-[#49B6E5] border-b-2 border-[#49B6E5]' : 'text-[#6B7280] hover:bg-gray-50'}`}>
                <FileText className="w-4 h-4" /> Tài liệu
              </button>
              <button type="button" onClick={() => setActiveTab('discussion')} className={`px-4 py-3 font-['Comfortaa', cursive] flex items-center gap-2 whitespace-nowrap ${activeTab === 'discussion' ? 'bg-[#E8F6FC] text-[#49B6E5] border-b-2 border-[#49B6E5]' : 'text-[#6B7280] hover:bg-gray-50'}`}>
                <MessageSquare className="w-4 h-4" /> Thảo luận
              </button>
            </div>
          </div>

          {/* Tab Content - scrollable */}
          <div className="flex-1 overflow-auto p-4">
            {activeTab === 'quiz' && (
              <div className="space-y-4">
                {/* Available Quiz */}
                {currentLesson.quiz ? (
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#E8F6FC] rounded-full flex items-center justify-center">
                          <ClipboardList className="w-6 h-6 text-[#49B6E5]" />
                        </div>
                        <div>
                          <h3 className="font-['Comfortaa', cursive] text-lg text-[#263D5B]">Bài tập Quiz</h3>
                          <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">{currentLesson.quiz.questions.length} câu hỏi</p>
                        </div>
                      </div>
                      <Link to={`/quiz/${id}/do`}>
                        <Button variant="primary">
                          Làm bài
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ) : (
                  <div className="text-center py-8 bg-white rounded-[12px] border-2 border-[#263D5B]">
                    <ClipboardList className="w-12 h-12 text-[#6B7280] mx-auto mb-4" />
                    <p className="font-['Comfortaa', cursive] text-[#6B7280]">Bài học này chưa có bài tập</p>
                  </div>
                )}

                {/* Quiz History */}
                <div className="mt-6">
                  <h3 className="font-['Comfortaa', cursive] text-lg text-[#263D5B] mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Lịch sử làm bài
                  </h3>
                  {quizHistory.length === 0 ? (
                    <p className="font-['Comfortaa', cursive] text-[#6B7280] text-center py-4">Chưa có lịch sử làm bài</p>
                  ) : (
                    <div className="space-y-3">
                      {quizHistory.map(h => (
                        <div key={h.id} className="flex items-center justify-between p-4 bg-white rounded-[12px] border-2 border-[#263D5B]">
                          <div>
                            <p className="font-['Comfortaa', cursive] text-[#263D5B]">{h.date}</p>
                            <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">Thời gian: {h.time}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Link to={`/quiz/${id}/review`} className="font-['Comfortaa', cursive] text-xs text-[#49B6E5] hover:underline">
                              Xem lại
                            </Link>
                            <div className="text-right">
                              <span className={`font-['Comfortaa', cursive] text-lg font-bold ${h.score >= 7 ? 'text-green-600' : 'text-red-500'}`}>
                                {h.score}/{h.total} điểm
                              </span>
                              <p className="font-['Comfortaa', cursive] text-xs text-[#6B7280]">
                                {Math.round(h.score / h.total * 100)}%
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quiz Mode - Full Screen */}
            {quizMode && currentLesson.quiz && (
              <div className="fixed inset-0 bg-white z-50 overflow-auto">
                <div className="max-w-3xl mx-auto p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="font-['Comfortaa', cursive] text-2xl text-[#263D5B]">{currentLesson.title}</h2>
                      {quizReviewMode && (
                        <p className="font-['Comfortaa', cursive] text-sm text-orange-500">Xem lại câu sai</p>
                      )}
                    </div>
                    <button type="button" onClick={() => setQuizMode(false)} className="p-2 hover:bg-gray-100 rounded-[8px]">
                      <X className="w-6 h-6 text-[#263D5B]" />
                    </button>
                  </div>

                  {showQuizResult && quizScore && (
                    <div className="mb-6 p-4 bg-[#F8F6F3] rounded-[12px] border-2 border-[#263D5B]">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-['Comfortaa', cursive] text-lg text-[#263D5B]">Điểm số</p>
                          <p className="font-['Comfortaa', cursive] text-3xl font-bold text-[#263D5B]">
                            {quizScore.correct}/{quizScore.total}
                          </p>
                          <p className={`font-['Comfortaa', cursive] ${quizScore.correct >= 7 ? 'text-green-600' : 'text-orange-500'}`}>
                            {Math.round(quizScore.correct / quizScore.total * 100)}%
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button variant="primary" onClick={handleReviewWrong}>
                            Xem câu sai
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {currentLesson.quiz.questions.map((q, idx) => {
                      const userAnswer = quizAnswers[idx];
                      const isWrong = showQuizResult && userAnswer !== q.correct;
                      if (quizReviewMode && !isWrong) return null;
                      
                      return (
                      <div key={q.id} className={`border-2 rounded-[12px] p-4 ${isWrong ? 'border-red-300 bg-red-50' : 'border-[#263D5B]'}`}>
                        <p className="font-['Comfortaa', cursive] text-lg text-[#263D5B] mb-3">
                          {quizReviewMode && <span className="text-red-500 mr-2">✗</span>}
                          {idx + 1}. {q.question}
                        </p>
                        <div className="space-y-2">
                          {q.options.map((option, optIdx) => {
                            const isSelected = userAnswer === optIdx;
                            const isCorrect = q.correct === optIdx;
                            let btnClass = 'bg-white border-[#E5E1DC] text-[#6B7280] hover:border-[#263D5B]';
                            if (showQuizResult) {
                              if (isCorrect) btnClass = 'bg-green-50 border-green-500 text-green-700';
                              else if (isSelected) btnClass = 'bg-red-50 border-red-500 text-red-700';
                            } else if (isSelected) {
                              btnClass = 'bg-[#E8F6FC] border-[#49B6E5] text-[#263D5B]';
                            }
                            return (
                              <button type="button" key={optIdx} onClick={() => { if (!showQuizResult) { const newAnswers = [...quizAnswers]; newAnswers[idx] = optIdx; setQuizAnswers(newAnswers); } }} className={`w-full p-3 rounded-[8px] text-left font-['Comfortaa', cursive] border-2 ${btnClass}`} disabled={showQuizResult}>
                                <span className="mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                                {option}
                                {showQuizResult && isCorrect && <CheckCircle className="w-5 h-5 inline ml-2 text-green-500" />}
                                {showQuizResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 inline ml-2 text-red-500" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                    })}
                  </div>
                  
                  <div className="mt-6 flex items-center gap-4">
                    {!showQuizResult ? (
                      <Button variant="primary" onClick={handleQuizSubmit} disabled={quizAnswers.length !== currentLesson.quiz.questions.length}>
                        Nộp bài
                      </Button>
                    ) : (
                      <div className="flex items-center gap-4">
                        <Button variant="secondary" onClick={handleStartQuiz}>Làm lại</Button>
                        <Button variant="secondary" onClick={() => setQuizMode(false)}>Thoát</Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input type="text" value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Thêm ghi chú..." className="flex-1 px-4 py-2 border-2 border-[#263D5B] rounded-[8px] font-['Comfortaa', cursive]" />
                  <Button variant="primary" onClick={handleAddNote}><Bookmark className="w-4 h-4" /></Button>
                </div>
                <div className="space-y-2">
                  {currentLesson.notes.map(note => (
                    <div key={note.id} className="flex items-start gap-3 p-3 bg-white rounded-[8px] border-2 border-dashed border-[#263D5B]">
                      <Badge variant="warning"><Clock className="w-3 h-3 mr-1" />{note.timestamp}</Badge>
                      <span className="font-['Comfortaa', cursive] text-[#263D5B] flex-1">{note.content}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-3">
                {currentLesson.documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-white rounded-[8px] border-2 border-[#263D5B]">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-[#263D5B]" />
                      <span className="font-['Comfortaa', cursive] text-[#263D5B]">{doc.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">{doc.size}</span>
                      <Button variant="secondary" size="sm">Tải</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'discussion' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Viết bình luận..." className="flex-1 px-4 py-2 border-2 border-[#263D5B] rounded-[8px] font-['Comfortaa', cursive]" />
                  <Button variant="primary" onClick={handleAddComment}><Send className="w-4 h-4" /></Button>
                </div>
                
                {/* Sort */}
                <div className="flex items-center justify-between">
                  <span className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">{currentLesson.comments.length} bình luận</span>
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-[#6B7280]" />
                    <select
                      value={sortComment}
                      onChange={(e) => setSortComment(e.target.value as typeof sortComment)}
                      className="px-2 py-1 border border-[#263D5B] rounded font-['Comfortaa', cursive] text-sm text-[#263D5B] bg-white"
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="oldest">Cũ nhất</option>
                      <option value="popular">Phổ biến</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {sortedComments.map(comment => (
                    <div key={comment.id} className="space-y-2">
                      <div className="flex items-start gap-3 p-3 bg-white rounded-[8px]">
                        <Avatar name={comment.avatar} size="md" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-['Comfortaa', cursive] font-semibold text-[#263D5B]">{comment.user}</span>
                            <span className="font-['Comfortaa', cursive] text-xs text-[#6B7280]">{comment.time}</span>
                          </div>
                          <p className="font-['Comfortaa', cursive] text-sm text-[#263D5B] mb-2">{comment.content}</p>
                          <div className="flex items-center gap-4">
                            <button type="button" className="flex items-center gap-1 text-[#6B7280] hover:text-red-500">
                              <Heart className="w-4 h-4" />
                              <span className="font-['Comfortaa', cursive] text-xs">Thích</span>
                            </button>
                            <button type="button" className="flex items-center gap-1 text-[#6B7280] hover:text-[#49B6E5]">
                              <Reply className="w-4 h-4" />
                              <span className="font-['Comfortaa', cursive] text-xs">Trả lời</span>
                            </button>
                            <button type="button" onClick={() => setReportModal({ open: true, userId: comment.id })} className="flex items-center gap-1 text-[#6B7280] hover:text-orange-500">
                              <Flag className="w-4 h-4" />
                              <span className="font-['Comfortaa', cursive] text-xs">Báo cáo</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="ml-10 space-y-2">
                          {comment.replies.map(reply => (
                            <div key={reply.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-[8px] border-l-2 border-[#263D5B]">
                              <Avatar name={reply.avatar} size="sm" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-['Comfortaa', cursive] font-semibold text-sm text-[#263D5B]">{reply.user}</span>
                                  <span className="font-['Comfortaa', cursive] text-xs text-[#6B7280]">{reply.time}</span>
                                </div>
                                <p className="font-['Comfortaa', cursive] text-sm text-[#263D5B]">{reply.content}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <button type="button" className="flex items-center gap-1 text-[#6B7280] hover:text-red-500">
                                    <Heart className="w-3 h-3" />
                                    <span className="font-['Comfortaa', cursive] text-xs">Thích</span>
                                  </button>
                                  <button type="button" onClick={() => setReportModal({ open: true, userId: reply.id })} className="flex items-center gap-1 text-[#6B7280] hover:text-orange-500">
                                    <Flag className="w-3 h-3" />
                                    <span className="font-['Comfortaa', cursive] text-xs">Báo cáo</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {reportModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[12px] p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Comfortaa', cursive] text-lg text-[#263D5B]">Báo cáo</h3>
              <button type="button" onClick={() => { setReportModal({ open: false }); setReportReason(''); setReportOther(false); }}>
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>
            <div className="space-y-3">
              <button type="button" onClick={() => setReportReason('spam')} className={`w-full p-3 text-left border-2 rounded-[8px] font-['Comfortaa', cursive] text-[#263D5B] ${reportReason === 'spam' ? 'border-[#263D5B] bg-[#E8F6FC]' : 'border-[#E5E1DC] hover:border-[#263D5B]'}`}>
                Spam hoặc quảng cáo
              </button>
              <button type="button" onClick={() => setReportReason('inappropriate')} className={`w-full p-3 text-left border-2 rounded-[8px] font-['Comfortaa', cursive] text-[#263D5B] ${reportReason === 'inappropriate' ? 'border-[#263D5B] bg-[#E8F6FC]' : 'border-[#E5E1DC] hover:border-[#263D5B]'}`}>
                Nội dung không phù hợp
              </button>
              <button type="button" onClick={() => setReportReason('abuse')} className={`w-full p-3 text-left border-2 rounded-[8px] font-['Comfortaa', cursive] text-[#263D5B] ${reportReason === 'abuse' ? 'border-[#263D5B] bg-[#E8F6FC]' : 'border-[#E5E1DC] hover:border-[#263D5B]'}`}>
                Lạm dụng hoặc quấy rối
              </button>
              <button type="button" onClick={() => setReportReason('false')} className={`w-full p-3 text-left border-2 rounded-[8px] font-['Comfortaa', cursive] text-[#263D5B] ${reportReason === 'false' ? 'border-[#263D5B] bg-[#E8F6FC]' : 'border-[#E5E1DC] hover:border-[#263D5B]'}`}>
                Thông tin sai sự thật
              </button>
              <button type="button" onClick={() => { setReportOther(true); setReportReason(''); }} className={`w-full p-3 text-left border-2 rounded-[8px] font-['Comfortaa', cursive] text-[#263D5B] ${reportOther ? 'border-[#263D5B] bg-[#E8F6FC]' : 'border-[#E5E1DC] hover:border-[#263D5B]'}`}>
                Lí do khác
              </button>
              {reportOther && (
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Nhập lí do của bạn..."
                  className="w-full p-3 border-2 border-[#263D5B] rounded-[8px] font-['Comfortaa', cursive] text-[#263D5B] resize-none"
                  rows={3}
                />
              )}
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="secondary" onClick={() => { setReportModal({ open: false }); setReportReason(''); setReportOther(false); }} className="flex-1">
                Hủy
              </Button>
              <Button variant="primary" onClick={() => { alert('Đã gửi báo cáo!'); setReportModal({ open: false }); setReportReason(''); setReportOther(false); }} className="flex-1" disabled={!reportReason}>
                Gửi báo cáo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LearningPage