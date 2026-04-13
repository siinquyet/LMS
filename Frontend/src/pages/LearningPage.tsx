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
  X
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
  const [activeTab, setActiveTab] = useState<'video' | 'notes' | 'documents' | 'discussion'>('video');
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newNote, setNewNote] = useState('');

  const currentLesson = courseData.currentLesson;

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
    setShowQuizResult(true);
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
        className="h-screen sticky top-0"
      />

      <div className="flex-1 flex flex-col">
        {/* Header with navigation */}
        <div className="bg-[#263D5B] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-10 gap-4">
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

        {/* Content with video always visible */}
        <div className="flex-1 overflow-auto">
          {/* Video - Always visible */}
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

          {/* Tabs */}
          <div className="border-b-2 border-[#263D5B] bg-white">
            <div className="flex overflow-x-auto">
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

          {/* Tab Content */}
          <div className="p-4">
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
                <div className="space-y-4">
                  {currentLesson.comments.map(comment => (
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
    </div>
  );
};

export default LearningPage;