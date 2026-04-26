import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, BookOpen, Users, Tag, X, Save, ChevronRight, Play, FileText, Upload, File, Pill } from 'lucide-react';
import { Card, Button, Badge, SearchInput, Modal, Input, Select, Textarea } from '../components/common';
import { teacherCourses as mockCourses } from '../mockData';

interface QuizQuestion {
  id: number;
  question: string;
  options: { id: number; text: string }[];
  correctOptionId: number;
}

interface Document {
  id: number;
  title: string;
  fileUrl: string;
  fileType: string;
}

interface Exercise {
  id: number;
  title: string;
  description: string;
  type: 'quiz' | 'assignment';
  questions?: QuizQuestion[];
  deadline?: string;
}

interface VideoItem {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  order: number;
  freePreview: boolean;
  documents: Document[];
  exercises: Exercise[];
}

interface Chapter {
  id: number;
  title: string;
  order: number;
  videos: VideoItem[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  category: string;
  level: string;
  duration: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed';
  students: number;
  rating: number;
  chapters: Chapter[];
  requirements: string[];
  whatYouLearn: string[];
}

const categories = [
  { value: 'programming', label: 'Lập trình' },
  { value: 'design', label: 'Thiết kế' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'business', label: 'Kinh doanh' },
];

const levels = [
  { value: 'Cơ bản', label: 'Cơ bản' },
  { value: 'Trung cấp', label: 'Trung cấp' },
  { value: 'Nâng cao', label: 'Nâng cao' },
];

const statusLabels = {
  draft: { label: 'Bản nháp', color: 'default' as const },
  pending: { label: 'Chờ duyệt', color: 'warning' as const },
  approved: { label: 'Đã duyệt', color: 'success' as const },
  rejected: { label: 'Từ chối', color: 'danger' as const },
  completed: { label: 'Hoàn thành', color: 'success' as const },
};

const getStatusLabel = (status: string) => statusLabels[status as keyof typeof statusLabels] || { label: status, color: 'default' as const };

const initialCourse: Partial<Course> = { title: '', description: '', price: 0, thumbnail: '', category: 'programming', level: 'Cơ bản', duration: '0 giờ', status: 'draft', chapters: [], requirements: [], whatYouLearn: [] };

export const TeacherCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [editCourse, setEditCourse] = useState<Partial<Course>>(initialCourse);
  const [isEditing, setIsEditing] = useState(false);
  const [delConfirm, setDelConfirm] = useState<number | null>(null);
  // Chapter & Video states
  const [chapterModalOpen, setChapterModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [exModalOpen, setExModalOpen] = useState(false);
  const [editCh, setEditCh] = useState<Partial<Chapter>>({});
  const [editVid, setEditVid] = useState<Partial<VideoItem>>({});
  const [editDoc, setEditDoc] = useState<{ title: string; file?: File; fileType: string }>({ title: '', fileType: '' });
  const [docFileRef, setDocFileRef] = useState<HTMLInputElement | null>(null);
  const [editEx, setEditEx] = useState<{ ex?: Exercise; newQuestion?: string; newOptions: { text: string }[]; correctOption: number }>({ newOptions: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }], correctOption: 0 });
  const [expandedVideo, setExpandedVideo] = useState<number | null>(null);
  const [addDocVideoId, setAddDocVideoId] = useState<number | null>(null);
  const [addExVideoId, setAddExVideoId] = useState<number | null>(null);
  const [docEditMode, setDocEditMode] = useState<number | null>(null);
  const [exEditMode, setExEditMode] = useState<number | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = courses.filter(c => (!search || c.title.toLowerCase().includes(search.toLowerCase())) && (!statusFilter || c.status === statusFilter));

  const openCourseModal = (c?: Course) => { setEditCourse(c || initialCourse); setIsEditing(!!c); setCourseModalOpen(true); };
  const saveCourse = () => {
    if (!editCourse.title || !editCourse.price) return;
    if (isEditing && editCourse.id) setCourses(prev => prev.map(c => c.id === editCourse.id ? { ...c, ...editCourse } as Course : c));
    else setCourses(prev => [...prev, { id: Date.now(), title: editCourse.title || '', description: editCourse.description || '', price: editCourse.price || 0, thumbnail: editCourse.thumbnail || '', category: editCourse.category || 'programming', level: editCourse.level || 'Cơ bản', duration: editCourse.duration || '0 giờ', status: editCourse.status || 'draft', students: 0, rating: 0, chapters: [] }]);
    setCourseModalOpen(false);
  };
  const delCourse = (id: number) => { setCourses(prev => prev.filter(c => c.id !== id)); setDelConfirm(null); };
  const openCourseDetail = (course: Course) => setSelectedCourse(course);

  const saveCh = () => {
    if (!selectedCourse || !editCh.title) return;
    const newCh: Chapter = { id: editCh.id || Date.now(), title: editCh.title || '', order: editCh.order || 1, videos: [] };
    setCourses(prev => prev.map(c => {
      if (c.id !== selectedCourse.id) return c;
      const chs = c.chapters;
      const i = chs.findIndex(x => x.id === newCh.id);
      if (i >= 0) chs[i] = newCh;
      else chs.push(newCh);
      return { ...c, chapters: chs };
    }));
    setChapterModalOpen(false);
  };
  const delCh = (chId: number) => {
    if (!selectedCourse) return;
    setCourses(prev => prev.map(c => c.id === selectedCourse.id ? { ...c, chapters: c.chapters.filter(x => x.id !== chId) } : c));
  };

  const saveVid = () => {
    if (!selectedCourse || !selectedChapter || !editVid.title) return;
    const newVid: VideoItem = { id: editVid.id || Date.now(), title: editVid.title || '', description: editVid.description || '', videoUrl: editVid.videoUrl || '', duration: editVid.duration || '00:00', order: editVid.order || 1, freePreview: editVid.freePreview || false, documents: [], exercises: [] };
    setCourses(prev => prev.map(c => {
      if (c.id !== selectedCourse.id) return c;
      return { ...c, chapters: c.chapters.map(ch => {
        if (ch.id !== selectedChapter.id) return ch;
        const vids = ch.videos;
        const i = vids.findIndex(x => x.id === newVid.id);
        if (i >= 0) vids[i] = newVid;
        else vids.push(newVid);
        return { ...ch, videos: vids };
      })};
    }));
    setVideoModalOpen(false);
  };
  const delVid = (vidId: number) => {
    if (!selectedCourse || !selectedChapter) return;
    setCourses(prev => prev.map(c => c.id === selectedCourse.id ? { ...c, chapters: c.chapters.map(ch => ch.id !== selectedChapter.id ? ch : { ...ch, videos: ch.videos.filter(v => v.id !== vidId) }) } : c));
  };

  const handleDocFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const ext = f.name.split('.').pop()?.toUpperCase() || '';
      setEditDoc({ ...editDoc, file: f, fileType: ext, title: f.name });
    }
  };

  const saveDoc = () => {
    if (!selectedCourse || !selectedChapter || !editVid.title || !editDoc.title) return;
    const fileUrl = editDoc.file ? URL.createObjectURL(editDoc.file) : '';
    const newDoc: Document = { id: Date.now(), title: editDoc.title, fileUrl, fileType: editDoc.fileType };
    setCourses(prev => prev.map(c => {
      if (c.id !== selectedCourse.id) return c;
      return { ...c, chapters: c.chapters.map(ch => {
        if (ch.id !== selectedChapter.id) return ch;
        return { ...ch, videos: ch.videos.map(v => v.id !== editVid.id ? v : { ...v, documents: [...v.documents, newDoc] }) };
      })};
    }));
    setDocModalOpen(false);
    setEditDoc({ title: '', fileType: '' });
  };
  const delDoc = (vidId: number, docId: number) => {
    if (!selectedCourse || !selectedChapter) return;
    setCourses(prev => prev.map(c => c.id === selectedCourse.id ? { ...c, chapters: c.chapters.map(ch => ch.id !== selectedChapter.id ? ch : { ...ch, videos: ch.videos.map(v => v.id !== vidId ? v : { ...v, documents: v.documents.filter(d => d.id !== docId) }) }) } : c));
  };

  const addQuestion = () => {
    const validOpts = editEx.newOptions.filter(o => o.text.trim());
    if (!editEx.newQuestion?.trim() || validOpts.length < 2) return;
    const newQ: QuizQuestion = { id: Date.now(), question: editEx.newQuestion, options: validOpts.map((o, i) => ({ id: i, text: o.text })), correctOptionId: editEx.correctOption };
    setEditEx({ ...editEx, ex: { ...editEx.ex, questions: [...(editEx.ex?.questions || []), newQ] } as Exercise[], newQuestion: '', newOptions: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }], correctOption: 0 });
  };

  const addOption = () => {
    if (editEx.newOptions.length >= 6) return;
    setEditEx({ ...editEx, newOptions: [...editEx.newOptions, { text: '' }] });
  };

  const removeOption = (index: number) => {
    if (editEx.newOptions.length <= 2) return;
    const opts = editEx.newOptions.filter((_, i) => i !== index);
    setEditEx({ ...editEx, newOptions: opts, correctOption: editEx.correctOption >= opts.length ? opts.length - 1 : editEx.correctOption });
  };

  const saveEx = () => {
    if (!selectedCourse || !selectedChapter || !editVid.title || !editEx.ex?.title) return;
    setCourses(prev => prev.map(c => {
      if (c.id !== selectedCourse.id) return c;
      return { ...c, chapters: c.chapters.map(ch => {
        if (ch.id !== selectedChapter.id) return ch;
        return { ...ch, videos: ch.videos.map(v => v.id !== editVid.id ? v : { ...v, exercises: [...v.exercises, { ...editEx.ex, id: Date.now() } as Exercise] }) };
      })};
    }));
    setExModalOpen(false);
  };
  const delEx = (vidId: number, exId: number) => {
    if (!selectedCourse || !selectedChapter) return;
    setCourses(prev => prev.map(c => c.id === selectedCourse.id ? { ...c, chapters: c.chapters.map(ch => ch.id !== selectedChapter.id ? ch : { ...ch, videos: ch.videos.map(v => v.id !== vidId ? v : { ...v, exercises: v.exercises.filter(e => e.id !== exId) }) }) } : c));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && editVid) setEditVid({ ...editVid, videoUrl: URL.createObjectURL(f) } as any);
  };

  const fmtPrice = (p: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  // ==================== COURSE LIST VIEW ====================
  if (!selectedCourse) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-['Comfortaa', cursive] text-2xl text-[#263D5B]">Quản lý khóa học</h1>
          <Button size="sm" onClick={() => openCourseModal()}><Plus className="w-4 h-4" /> Thêm khóa học</Button>
        </div>

        <Card className="mb-4">
          <div className="flex gap-4">
            <SearchInput value={search} onChange={setSearch} placeholder="Tìm khóa học..." className="flex-1" />
            <Select options={[{ value: '', label: 'Tất cả' }, { value: 'draft', label: 'Bản nháp' }, { value: 'pending', label: 'Chờ duyệt' }, { value: 'approved', label: 'Đã duyệt' }, { value: 'rejected', label: 'Từ chối' }, { value: 'completed', label: 'Hoàn thành' }]} value={statusFilter} onChange={setStatusFilter} className="w-40" />
          </div>
        </Card>

        <p className="text-sm text-gray-600 mb-4">Tìm thấy {filtered.length} khóa học</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(course => (
            <Card key={course.id} className="flex flex-col">
              <img src={course.thumbnail} alt={course.title} className="w-full h-32 object-cover rounded-lg mb-3" />
              <Badge variant={getStatusLabel(course.status).color} className="self-start mb-2">{getStatusLabel(course.status).label}</Badge>
              <h3 className="font-['Comfortaa', cursive] text-lg mb-1">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{course.description}</p>
              <div className="flex gap-4 text-sm text-gray-600 mb-3">
                <span><Users className="w-4 h-4 inline" /> {course.students}</span>
                <span><Tag className="w-4 h-4 inline" /> {course.level}</span>
              </div>
              <div className="font-['Comfortaa', cursive] text-xl text-[#49B6E5] mb-4">{fmtPrice(course.price)}</div>
              <div className="flex gap-2 mt-auto">
                <Button size="sm" variant="secondary" onClick={() => openCourseModal(course)} className="flex-1"><Edit2 className="w-3 h-3" />Sửa</Button>
                <Button size="sm" variant="secondary" onClick={() => openCourseDetail(course)} className="flex-1"><ChevronRight className="w-3 h-3" />Nội dung</Button>
                {delConfirm === course.id ? (
                  <><Button size="sm" variant="danger" onClick={() => delCourse(course.id)}>Xóa</Button><Button size="sm" variant="outline" onClick={() => setDelConfirm(null)}>Hủy</Button></>
                ) : (<Button size="sm" variant="outline" onClick={() => setDelConfirm(course.id)}><Trash2 className="w-3 h-3" /></Button>)}
              </div>
            </Card>
          ))}
        </div>

        <Modal open={courseModalOpen} onClose={() => setCourseModalOpen(false)} size="lg">
          <div className="p-6">
            <h2 className="font-['Comfortaa', cursive] text-xl mb-4">{isEditing ? 'Sửa' : 'Thêm'} khóa học</h2>
            <div className="space-y-3">
              <Input label="Tên khóa học *" value={editCourse.title || ''} onChange={e => setEditCourse({ ...editCourse, title: e.target.value })} placeholder="Nhập tên khóa học" />
              <Textarea label="Mô tả" value={editCourse.description || ''} onChange={e => setEditCourse({ ...editCourse, description: e.target.value })} rows={2} />
              <Textarea 
                label="Yêu cầu (mỗi dòng là một mục)" 
                value={editCourse.requirements?.join('\n') || ''} 
                onChange={e => setEditCourse({ ...editCourse, requirements: e.target.value.split('\n').filter(r => r.trim()) })} 
                rows={3} 
                placeholder="Biết cơ bản HTML, CSS&#10;Máy tính có kết nối internet"
              />
              <Textarea 
                label="Bạn sẽ học được gì (mỗi dòng là một mục)" 
                value={editCourse.whatYouLearn?.join('\n') || ''} 
                onChange={e => setEditCourse({ ...editCourse, whatYouLearn: e.target.value.split('\n').filter(r => r.trim()) })} 
                rows={3} 
                placeholder="Xây dựng ứng dụng React&#10;Quản lý state với Redux"
              />
              <Input label="Giá *" type="number" value={editCourse.price || ''} onChange={e => setEditCourse({ ...editCourse, price: +e.target.value })} placeholder="0" />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                <label className="text-sm font-medium text-[#263D5B]">Ảnh khóa học</label>
                <div className="flex items-center gap-4">
                  {editCourse.thumbnail ? (
                    <img src={editCourse.thumbnail} alt="Preview" className="w-24 h-16 object-cover rounded-lg" />
                  ) : (
                    <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">Chưa có ảnh</div>
                  )}
                  <label className="cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            setEditCourse({ ...editCourse, thumbnail: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <span className="px-3 py-2 bg-[#49B6E5] text-white rounded-lg text-sm hover:bg-[#3a9fd4]">
                      Chọn ảnh
                    </span>
                  </label>
                </div>
              </div>
                <Input label="Thời lượng" value={editCourse.duration || ''} onChange={e => setEditCourse({ ...editCourse, duration: e.target.value })} placeholder="40 giờ" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select label="Danh mục" options={categories} value={editCourse.category || ''} onChange={e => setEditCourse({ ...editCourse, category: e.target.value })} />
                <Select label="Cấp độ" options={levels} value={editCourse.level || ''} onChange={e => setEditCourse({ ...editCourse, level: e.target.value })} />
              </div>
               {isEditing && <Select label="Trạng thái" options={[{ value: 'draft', label: 'Bản nháp' }, { value: 'pending', label: 'Chờ duyệt' }, { value: 'approved', label: 'Đã duyệt' }, { value: 'rejected', label: 'Từ chối' }, { value: 'completed', label: 'Hoàn thành' }]} value={editCourse.status || ''} onChange={e => setEditCourse({ ...editCourse, status: e.target.value as Course['status'] })} />}
              <div className="flex gap-2 pt-3"><Button onClick={saveCourse}><Save className="w-4 h-4" />Lưu</Button><Button variant="secondary" onClick={() => setCourseModalOpen(false)}>Hủy</Button></div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  // ==================== COURSE DETAIL VIEW ====================
  const currentCourse = courses.find(c => c.id === selectedCourse.id) || selectedCourse;

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button size="sm" variant="secondary" onClick={() => setSelectedCourse(null)}>← Quay lại</Button>
        <h1 className="font-['Comfortaa', cursive] text-2xl text-[#263D5B]">{currentCourse.title}</h1>
        <Badge variant={getStatusLabel(currentCourse.status).color}>{getStatusLabel(currentCourse.status).label}</Badge>
      </div>

      <div className="space-y-4">
        <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-['Comfortaa', cursive] text-xl">Chương học</h2>
              <Button size="sm" variant="secondary" onClick={() => { setEditCh({}); setChapterModalOpen(true); }}><Plus className="w-4 h-4" /> Thêm chương</Button>
            </div>
            {currentCourse.chapters.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Chưa có chương nào</p>
                <p className="text-sm">Click "Thêm chương" để bắt đầu</p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentCourse.chapters.map(ch => (
                  <div key={ch.id} className="border rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between p-3 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{ch.title}</span>
                        <Badge variant="default" size="sm">{ch.videos.length} video</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => { setSelectedChapter(ch); setEditVid({}); setVideoModalOpen(true); }}><Plus className="w-3 h-3" />Video</Button>
                        <Button size="sm" variant="secondary" onClick={() => { setEditCh(ch); setChapterModalOpen(true); }}><Edit2 className="w-3 h-3" /></Button>
                        <Button size="sm" variant="outline" onClick={() => delCh(ch.id)}><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    </div>
                    <div className="divide-y">
                      {ch.videos.map(vid => (
                        <div key={vid.id}>
                          <div className="flex items-center justify-between p-3 cursor-pointer" onClick={() => setExpandedVideo(expandedVideo === vid.id ? null : vid.id)}>
                            <div className="flex items-center gap-3">
                              <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expandedVideo === vid.id ? 'rotate-90' : ''}`} />
                              <Play className="w-5 h-5 text-blue-500" />
                              <div>
                                <p className="font-medium text-sm">{vid.title}</p>
                                <p className="text-xs text-gray-500">{vid.duration}</p>
                              </div>
                              {vid.freePreview && <Badge variant="success" size="sm">Free</Badge>}
                              <Badge variant="default" size="sm">{vid.documents.length} file</Badge>
                              <Badge variant="default" size="sm">{vid.exercises.length} BT</Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); setSelectedChapter(ch); setEditVid(vid); setVideoModalOpen(true); }}><Edit2 className="w-3 h-3" /></Button>
                              <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); delVid(vid.id); }}><Trash2 className="w-3 h-3" /></Button>
                            </div>
                          </div>
                          
                          {expandedVideo === vid.id && (
                            <div className="p-4 bg-gray-50 border-t">
                              <div className="grid grid-cols-2 gap-4">
                              {/* Tài liệu section */}
                              <div className="bg-white p-4 rounded-lg border h-full">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-medium text-base">📄 Tài liệu ({vid.documents.length})</h4>
                                </div>
                                
                                {vid.documents.length === 0 && (
                                  <p className="text-sm text-gray-500 p-2">Chưa có tài liệu</p>
                                )}

                                {vid.documents.length > 0 && (
                                  <div className="space-y-2">
                                    {vid.documents.map(doc => (
                                      <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                                        <div className="flex items-center gap-2">
                                          <File className="w-4 h-4 text-gray-500" />
                                          <span>{doc.title}</span>
                                          <Badge variant="default" size="sm">{doc.fileType}</Badge>
                                        </div>
                                        <Button size="sm" variant="outline" onClick={() => delDoc(vid.id, doc.id)}><Trash2 className="w-3 h-3" /></Button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              {/* Bài tập section */}
                              <div className="bg-white p-4 rounded-lg border h-full">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-medium text-base">📝 Bài tập ({vid.exercises.length})</h4>
                                </div>

                                {vid.exercises.length === 0 && (
                                  <p className="text-sm text-gray-500 p-2">Chưa có bài tập</p>
                                )}

                                {vid.exercises.length > 0 && (
                                  <div className="space-y-2">
                                    {vid.exercises.map(ex => (
                                      <div key={ex.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                                        <div className="flex items-center gap-2">
                                          <FileText className="w-4 h-4 text-gray-500" />
                                          <span>{ex.title}</span>
                                          <Badge variant={ex.type === 'quiz' ? 'success' : 'warning'} size="sm">{ex.type === 'quiz' ? 'Quiz' : 'BT'}</Badge>
                                          {ex.questions && <Badge variant="default" size="sm" className="ml-1">{ex.questions?.length} câu</Badge>}
                                        </div>
                                        <div className="flex gap-1">
                                          <Button size="sm" variant="outline" onClick={() => { setSelectedChapter(ch); setEditVid(vid); setEditEx({ ex, newOptions: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }], correctOption: 0 }); setAddExVideoId(vid.id); }}><Edit2 className="w-3 h-3" /></Button>
                                          <Button size="sm" variant="outline" onClick={() => delEx(vid.id, ex.id)}><Trash2 className="w-3 h-3" /></Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              </div>

                              {/* Divider with Add buttons */}
                              <div className="border-t mt-4 pt-4">
                                {addDocVideoId === vid.id ? (
                                  <div className="bg-white p-4 rounded-lg border">
                                    <div className="flex items-center justify-between mb-3">
                                      <h4 className="font-medium text-base">📄 Thêm tài liệu</h4>
                                      <Button size="sm" variant="outline" onClick={() => { setAddDocVideoId(null); setEditDoc({ title: '', fileType: '' }); }}>✕</Button>
                                    </div>
                                    <div className="space-y-2">
                                      <div>
                                        <label className="text-sm font-medium mb-1 block">Chọn file tài liệu:</label>
                                        <input type="file" onChange={handleDocFile} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" className="text-sm" />
                                      </div>
                                      <div className="flex gap-2">
                                        <Button size="sm" onClick={() => {
                                          if (editDoc.file) {
                                            const newDoc: Document = { id: Date.now(), title: editDoc.file.name, fileUrl: URL.createObjectURL(editDoc.file), fileType: editDoc.file.name.split('.').pop()?.toUpperCase() || '' };
                                            setCourses(prev => prev.map(c => c.id === selectedCourse?.id ? { ...c, chapters: c.chapters.map(ch => ch.id === selectedChapter?.id ? { ...ch, videos: ch.videos.map(v => v.id === vid.id ? { ...v, documents: [...v.documents, newDoc] } : v) } : ch) } : c));
                                            setEditDoc({ title: '', fileType: '' });
                                          }
                                          setAddDocVideoId(null);
                                        }}>Lưu</Button>
                                        <Button size="sm" variant="secondary" onClick={() => { setAddDocVideoId(null); setEditDoc({ title: '', fileType: '' }); }}>Hủy</Button>
                                      </div>
                                    </div>
                                  </div>
                                ) : addExVideoId === vid.id ? (
                                  <div className="bg-white p-4 rounded-lg border">
                                    <div className="flex items-center justify-between mb-3">
                                      <h4 className="font-medium text-base">📝 Thêm bài tập</h4>
                                      <Button size="sm" variant="outline" onClick={() => { setAddExVideoId(null); }}>✕</Button>
                                    </div>
                                    <div className="space-y-3">
                                      <Input label="Tên bài tập/Quiz" value={editEx.ex?.title || ''} onChange={e => setEditEx({ ...editEx, ex: { ...editEx.ex, title: e.target.value } as any })} placeholder="Nhập tên" className="text-sm" />
                                      <Select label="Loại" options={[{ value: 'quiz', label: 'Quiz - Trắc nghiệm' }, { value: 'assignment', label: 'Bài tập về nhà' }]} value={editEx.ex?.type || 'quiz'} onChange={e => setEditEx({ ...editEx, ex: { ...editEx.ex, type: e.target.value } as any })} className="text-sm" />
                                      
                                      {editEx.ex?.type === 'quiz' && (
                                        <div className="border-t pt-3 mt-3">
                                          <p className="text-sm font-medium mb-2">Câu hỏi:</p>
                                          <Input label="Câu hỏi" value={editEx.newQuestion || ''} onChange={e => setEditEx({ ...editEx, newQuestion: e.target.value })} placeholder="Nhập câu hỏi" className="text-sm mb-2" />
                                          <div className="space-y-1">
                                            {editEx.newOptions.map((opt, oi) => (
                                              <div key={oi} className="flex items-center gap-2">
                                                <input type="radio" name={`correct-${vid.id}`} checked={editEx.correctOption === oi} onChange={() => setEditEx({ ...editEx, correctOption: oi })} className="w-4 h-4" />
                                                <span className="text-sm font-medium w-5">{String.fromCharCode(65 + oi)}</span>
                                                <Input value={opt.text} onChange={e => { const opts = [...editEx.newOptions]; opts[oi].text = e.target.value; setEditEx({ ...editEx, newOptions: opts }); }} placeholder={`Đáp án ${String.fromCharCode(65 + oi)}`} className="flex-1 text-sm" />
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      
                                      <div className="flex gap-2 pt-2">
                                        <Button size="sm" onClick={() => {
                                          if (!editEx.ex?.title) return;
                                          if (editEx.ex.type === 'quiz' && editEx.newQuestion?.trim()) {
                                            const newQ: QuizQuestion = { id: Date.now(), question: editEx.newQuestion, options: editEx.newOptions.map((o, i) => ({ id: i, text: o.text })), correctOptionId: editEx.correctOption };
                                            const newEx: Exercise = { id: Date.now(), title: editEx.ex.title, description: editEx.ex.description || '', type: 'quiz', questions: [newQ], deadline: '' };
                                            setCourses(prev => prev.map(c => c.id === selectedCourse?.id ? { ...c, chapters: c.chapters.map(ch => ch.id === selectedChapter?.id ? { ...ch, videos: ch.videos.map(v => v.id === vid.id ? { ...v, exercises: [...v.exercises, newEx] } : v) } : ch) } : c));
                                          } else if (editEx.ex?.type === 'assignment') {
                                            const newEx: Exercise = { id: Date.now(), title: editEx.ex.title, description: editEx.ex.description || '', type: 'assignment', deadline: '' };
                                            setCourses(prev => prev.map(c => c.id === selectedCourse?.id ? { ...c, chapters: c.chapters.map(ch => ch.id === selectedChapter?.id ? { ...ch, videos: ch.videos.map(v => v.id === vid.id ? { ...v, exercises: [...v.exercises, newEx] } : v) } : ch) } : c));
                                          }
                                          setEditEx({ ex: { title: '', description: '', type: 'quiz', questions: [], deadline: '' }, newOptions: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }], correctOption: 0 });
                                          setAddExVideoId(null);
                                        }}>Lưu</Button>
                                        <Button size="sm" variant="secondary" onClick={() => { setAddExVideoId(null); }}>Hủy</Button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-2 gap-4">
                                    <Button size="sm" variant="secondary" className="w-full" onClick={() => { setSelectedChapter(ch); setEditVid(vid); setEditDoc({}); setAddDocVideoId(vid.id); setAddExVideoId(null); }}>
                                      <Plus className="w-3 h-3" />Thêm tài liệu
                                    </Button>
                                    <Button size="sm" variant="secondary" className="w-full" onClick={() => { setSelectedChapter(ch); setEditVid(vid); setEditEx({ ex: { title: '', description: '', type: 'quiz', questions: [], deadline: '' }, newOptions: [{ text: '' }, { text: '' }, { text: '' }, { text: '' }], correctOption: 0 }); setAddExVideoId(vid.id); setAddDocVideoId(null); }}>
                                      <Plus className="w-3 h-3" />Thêm bài tập
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
        </Card>
      </div>

      {/* Chapter Modal */}
      <Modal open={chapterModalOpen} onClose={() => setChapterModalOpen(false)}>
        <div className="p-6">
          <h2 className="font-['Comfortaa', cursive] text-xl mb-4">{editCh.id ? 'Sửa' : 'Thêm'} chương</h2>
          <div className="space-y-3">
            <Input label="Tên chương" value={editCh.title || ''} onChange={e => setEditCh({ ...editCh, title: e.target.value })} />
            <Input label="Thứ tự" type="number" value={editCh.order || 1} onChange={e => setEditCh({ ...editCh, order: +e.target.value })} />
            <div className="flex gap-2 pt-3"><Button onClick={saveCh}><Save className="w-4 h-4" />Lưu</Button><Button variant="secondary" onClick={() => setChapterModalOpen(false)}>Hủy</Button></div>
          </div>
        </div>
      </Modal>

      {/* Video Modal */}
      <Modal open={videoModalOpen} onClose={() => setVideoModalOpen(false)}>
        <div className="p-6">
          <h2 className="font-['Comfortaa', cursive] text-xl mb-4">{editVid.id ? 'Sửa' : 'Thêm'} video</h2>
          <div className="space-y-3">
            <Input label="Tiêu đề video *" value={editVid.title || ''} onChange={e => setEditVid({ ...editVid, title: e.target.value })} />
            <Textarea label="Mô tả" value={editVid.description || ''} onChange={e => setEditVid({ ...editVid, description: e.target.value })} rows={2} />
            <div><label className="block text-sm font-medium mb-2">Upload video</label><input type="file" ref={fileRef} onChange={handleFile} accept="video/*" className="hidden" /><Button variant="secondary" onClick={() => fileRef.current?.click()}><Upload className="w-4 h-4" /> Chọn file</Button>{editVid.videoUrl && <span className="ml-2 text-sm text-green-600">✓</span>}</div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Thời lượng" value={editVid.duration || ''} onChange={e => setEditVid({ ...editVid, duration: e.target.value })} placeholder="00:00" />
              <Input label="Thứ tự" type="number" value={editVid.order || 1} onChange={e => setEditVid({ ...editVid, order: +e.target.value })} />
            </div>
            <div className="flex items-center gap-2"><input type="checkbox" id="free" checked={editVid.freePreview || false} onChange={e => setEditVid({ ...editVid, freePreview: e.target.checked })} /><label htmlFor="free" className="text-sm">Cho xem miễn phí</label></div>
            <div className="flex gap-2 pt-3"><Button onClick={saveVid}><Save className="w-4 h-4" />Lưu</Button><Button variant="secondary" onClick={() => setVideoModalOpen(false)}>Hủy</Button></div>
          </div>
        </div>
      </Modal>

      {/* Document Modal */}
      <Modal open={docModalOpen} onClose={() => setDocModalOpen(false)}>
        <div className="p-6"><h2 className="font-['Comfortaa', cursive] text-xl mb-4">Thêm tài liệu</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">Chọn file tài liệu</label>
              <input type="file" ref={r => setDocFileRef(r)} onChange={handleDocFile} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" className="hidden" />
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => docFileRef?.click()}><Upload className="w-4 h-4" /> Chọn file</Button>
                {editDoc.file && <span className="text-sm text-green-600">{editDoc.file.name}</span>}
              </div>
            </div>
            <div className="flex gap-2 pt-3"><Button onClick={saveDoc}><Save className="w-4 h-4" />Lưu</Button><Button variant="secondary" onClick={() => setDocModalOpen(false)}>Hủy</Button></div>
          </div>
        </div>
      </Modal>

      {/* Exercise Modal */}
<Modal open={exModalOpen} onClose={() => setExModalOpen(false)} size="xl">
        <div className="p-6"><h2 className="font-['Comfortaa', cursive] text-xl mb-4">{editEx.ex?.title ? 'Sửa' : 'Thêm'} bài tập</h2>
          <div className="space-y-3">
            <Input label="Tên bài tập/Quiz" value={editEx.ex?.title || ''} onChange={e => setEditEx({ ...editEx, ex: { ...editEx.ex, title: e.target.value } as any })} placeholder="Nhập tên" />
            <Select label="Loại" options={[{ value: 'quiz', label: 'Quiz - Trắc nghiệm' }, { value: 'assignment', label: 'Bài tập về nhà' }]} value={editEx.ex?.type || 'quiz'} onChange={e => setEditEx({ ...editEx, ex: { ...editEx.ex, type: e.target.value } as any })} />
            
            {editEx.ex?.type === 'quiz' && (
              <div className="mt-4 space-y-4">
                <h3 className="font-medium text-base">📝 Câu hỏi Quiz đã thêm ({(editEx.ex.questions || []).length})</h3>
                {(editEx.ex.questions || []).length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {(editEx.ex.questions || []).map((q, i) => (
                      <div key={q.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">Câu {i+1}: {q.question}</p>
                            <div className="mt-1 space-y-1">
                              {q.options.map((o, oi) => (
                                <p key={o.id} className={`text-xs ${o.id === q.correctOptionId ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                                  {String.fromCharCode(65 + oi)}. {o.text} {o.id === q.correctOptionId && '✓'}
                                </p>
                              ))}
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => {
                            const qFilter = (editEx.ex?.questions || []).filter(x => x.id !== q.id);
                            setEditEx({ ...editEx, ex: { ...editEx.ex, questions: qFilter } as any });
                          }}>Xóa</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 p-3">Chưa có câu hỏi nào</p>
                )}
                
                <div className="border-t pt-4">
                  <p className="font-medium text-sm mb-2">➕ Thêm câu hỏi mới:</p>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <Input label="Câu hỏi" value={editEx.newQuestion || ''} onChange={e => setEditEx({ ...editEx, newQuestion: e.target.value })} placeholder="Nhập nội dung câu hỏi" />
                    <p className="text-sm font-medium">Các đáp án (chọn radio đáp án đúng):</p>
                    <div className="space-y-2">
                      {editEx.newOptions.map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-2">
                          <input type="radio" name="correctOption" checked={editEx.correctOption === oi} onChange={() => setEditEx({ ...editEx, correctOption: oi })} className="w-4 h-4" />
                          <span className="text-sm font-medium w-6">{String.fromCharCode(65 + oi)}</span>
                          <Input value={opt.text} onChange={e => { const opts = [...editEx.newOptions]; opts[oi].text = e.target.value; setEditEx({ ...editEx, newOptions: opts }); }} placeholder={`Đáp án ${String.fromCharCode(65 + oi)}`} className="flex-1" />
                          {editEx.newOptions.length > 2 && <Button size="sm" variant="outline" onClick={() => removeOption(oi)}>✕</Button>}
                        </div>
                      ))}
                    </div>
                    {editEx.newOptions.length < 6 && <Button size="sm" variant="secondary" onClick={addOption}>+ Thêm đáp án</Button>}
                    <Button size="sm" variant="primary" onClick={addQuestion} className="block">+ Thêm câu hỏi</Button>
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-2 pt-3">
              <Button onClick={saveEx}><Save className="w-4 h-4" />Lưu bài tập</Button>
              <Button variant="secondary" onClick={() => setExModalOpen(false)}>Hủy</Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeacherCoursesPage;
