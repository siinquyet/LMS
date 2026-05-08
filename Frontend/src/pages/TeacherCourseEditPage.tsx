import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Plus, Trash2, Edit2, ChevronDown, ChevronRight,
  Video, FileText, HelpCircle, FileQuestion, Play, CheckCircle 
} from 'lucide-react';
import { Button, Card, Input, Badge, Loader, Modal, ImageUpload } from '../components/common';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../api';

const TeacherCourseEditPage = () => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { categories: data } = await api.getCategories();
        setCategories(data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleAddChapter = async () => {
    console.log('handleAddChapter called, isNew:', isNew, 'courseId:', courseId, 'newChapterTitle:', newChapterTitle);
    if (!newChapterTitle.trim()) {
      alert('Vui lòng nhập tên chương');
      return;
    }
    if (isNew || !courseId || courseId === 0) {
      alert('Vui lòng lưu khóa học trước khi thêm chương! isNew=' + isNew + ', courseId=' + courseId);
      return;
    }
    try {
      console.log('Adding chapter:', courseId, { tieu_de: newChapterTitle, thu_tu: newChapterOrder });
      const { chapter } = await api.createChapter(courseId, newChapterTitle.trim(), newChapterOrder);
      console.log('Chapter response:', chapter);
      if (chapter) {
        setChapters([...chapters, { ...chapter, bai_hoc: [] }]);
        setOpenChapters([...openChapters, chapter.id]);
        alert('Thêm chương thành công!');
      }
      setNewChapterTitle('');
      setNewChapterOrder(1);
      setShowChapterModal(false);
    } catch (err) {
      console.error('Failed to add chapter:', err);
      alert('Thêm chương thất bại: ' + err);
    }
  };

  const handleDeleteChapter = async (chapterId: number) => {
    if (!confirm('Xóa chương này sẽ xóa tất cả bài học trong chương. Tiếp tục?')) return;
    try {
      console.log('Deleting chapter:', chapterId);
      await api.deleteChapter(chapterId);
      setChapters(chapters.filter(c => c.id !== chapterId));
      setOpenChapters(openChapters.filter(id => id !== chapterId));
      alert('Xóa chương thành công!');
    } catch (err) {
      console.error('Failed to delete chapter:', err);
      alert('Xóa chương thất bại: ' + err);
    }
  };

  const handleAddLesson = async () => {
    console.log('handleAddLesson called, editingChapter:', editingChapter, 'newLessonTitle:', newLessonTitle);
    
    if (!newLessonTitle.trim()) {
      alert('Vui lòng nhập tên bài học');
      return;
    }
    
    // Get chapterId to use
    let targetChapterId = editingChapter?.chapterId;
    if (!targetChapterId && chapters.length > 0) {
      targetChapterId = chapters[0].id;
    }
    if (!targetChapterId) {
      alert('Không có chương nào');
      return;
    }
    
    console.log('Using chapterId:', targetChapterId);
    try {
      // If in edit mode, update lesson
      if (isLessonEditMode && editingLessonId) {
        console.log('Updating lesson:', editingLessonId);
        await api.updateLesson(editingLessonId, {
          tieu_de: newLessonTitle.trim(),
          video_url: newLessonVideoUrl.trim(),
          thoi_luong: newLessonDuration.trim(),
          loai: newLessonType,
          noi_dung: newLessonContent.trim(),
        });
        alert('Cập nhật bài học thành công!');
        // Reset and reload
        setNewLessonTitle('');
        setNewLessonDuration('');
        setNewLessonVideoUrl('');
        setNewLessonType('video');
        setNewLessonContent('');
        setIsLessonEditMode(false);
        setEditingLessonId(null);
        setShowLessonModal(false);
        return;
      }
      
      console.log('Adding lesson:', targetChapterId, {
        tieu_de: newLessonTitle.trim(),
        video_url: newLessonVideoUrl.trim(),
        thoi_luong: newLessonDuration.trim(),
        loai: newLessonType,
        noi_dung: newLessonContent.trim(),
      });
      const { lesson } = await api.createLesson(targetChapterId, {
        tieu_de: newLessonTitle.trim(),
        video_url: newLessonVideoUrl.trim(),
        thoi_luong: newLessonDuration.trim(),
        loai: newLessonType,
        noi_dung: newLessonContent.trim(),
      });
      console.log('Lesson response:', lesson);
      if (lesson) {
        setChapters(chapters.map(ch => 
          ch.id === targetChapterId 
            ? { ...ch, bai_hoc: [...(ch.bai_hoc || []), { ...lesson, quizzes: [], assignments: [] }] }
            : ch
        ));
        alert('Thêm bài học thành công!');
      }
      // Reset form
      setNewLessonTitle('');
      setNewLessonDuration('');
      setNewLessonVideoUrl('');
      setNewLessonType('video');
      setNewLessonContent('');
      setShowLessonModal(false);
      setEditingLesson(null);
    } catch (err) {
      console.error('Failed to add lesson:', err);
      alert('Thêm bài học thất bại: ' + err);
    }
  };

  const handleDeleteLesson = async (chapterId: number, lessonId: number) => {
    if (!confirm('Xóa bài học này?')) return;
    try {
      await api.deleteLesson(lessonId);
      setChapters(chapters.map(ch => 
        ch.id === chapterId 
          ? { ...ch, bai_hoc: (ch.bai_hoc || []).filter((l: Lesson) => l.id !== lessonId) }
          : ch
      ));
    } catch (err) {
      console.error('Failed to delete lesson:', err);
    }
  };

  const handleReorderChapters = async (newOrder: Chapter[]) => {
    const chapterIds = newOrder.map(ch => ch.id);
    try {
      await api.updateCourse(courseId, { 
        trang_thai: course.trang_thai,
        chapterIds 
      } as any);
      setChapters(newOrder);
    } catch (err) {
      console.error('Failed to reorder:', err);
      alert('Sắp xếp thất bại');
    }
  };

  const handleMoveChapter = (index: number, direction: 'up' | 'down') => {
    const newChapters = [...chapters];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newChapters.length) return;
    [newChapters[index], newChapters[targetIndex]] = [newChapters[targetIndex], newChapters[index]];
    handleReorderChapters(newChapters);
  };

  const handleMoveLesson = (chapterId: number, lessonIndex: number, direction: 'up' | 'down') => {
    const chapter = chapters.find(ch => ch.id === chapterId);
    if (!chapter || !chapter.bai_hoc) return;
    const targetIndex = direction === 'up' ? lessonIndex - 1 : lessonIndex + 1;
    if (targetIndex < 0 || targetIndex >= chapter.bai_hoc.length) return;
    
    const newLessons = [...chapter.bai_hoc];
    [newLessons[lessonIndex], newLessons[targetIndex]] = [newLessons[targetIndex], newLessons[lessonIndex]];
    
    setChapters(chapters.map(ch => 
      ch.id === chapterId ? { ...ch, bai_hoc: newLessons } : ch
    ));

    api.updateChapter(chapterId, { lessonIds: newLessons.map((l: Lesson) => l.id) } as any).catch(console.error);
  };

  // Get chapter name helper
  const getChapterName = (chapterId: number) => {
    const ch = chapters.find(c => c.id === chapterId);
    return ch ? ch.tieu_de : 'Chương ' + chapterId;
  };

  // Quiz & Assignment handlers (placeholder)
  const handleAddQuiz = async () => {
    alert('Để thêm Quiz, cần tạo bài học loại Quiz trước!');
    setShowQuizModal(false);
  };

  const handleEditQuiz = async (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setNewQuizTitle(quiz.tieu_de);
    setNewQuizTimeLimit(quiz.thoi_gian_lam || 10);
    setNewQuizQuestionCount(quiz.so_cau_hoi || 5);
    setShowQuizModal(true);
  };

  const handleAddAssignment = async () => {
    alert('Để thêm Bài tập, cần tạo bài học loại Exercise trước!');
    setShowAssignmentModal(false);
  };

  const handleEditAssignment = async (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setNewAssignmentTitle(assignment.tieu_de);
    setNewAssignmentDescription(assignment.mo_ta || '');
    setNewAssignmentRequired(assignment.bat_buoc);
    setNewAssignmentDeadline(assignment.han_nop || '');
    setShowAssignmentModal(true);
  };

  const toggleChapter = (chapterId: number) => {
    setOpenChapters(openChapters.includes(chapterId)
      ? openChapters.filter(id => id !== chapterId)
      : [...openChapters, chapterId]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[#F8F6F3] p-8">
        <Card className="p-8 text-center">
          <p className="text-red-500 mb-4">{error || 'Không tìm thấy khóa học'}</p>
          <Button onClick={() => navigate('/teacher/courses')}>Quay lại</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      {/* Header */}
      <div className="bg-white border-b-2 border-[#263D5B] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/teacher/courses')}>
              <ArrowLeft className="w-6 h-6 text-[#263D5B]" />
            </button>
            <div>
              <h1 className="font-['Comfortaa', cursive] text-xl text-[#263D5B]">
                {course.tieu_de || 'Khóa học mới'}
              </h1>
              <p className="text-sm text-gray-500">
                {chapters.length} chương • {chapters.reduce((acc: number, ch: Chapter) => acc + (ch.bai_hoc?.length || 0), 0)} bài học
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {course?.trang_thai === 'draft' && (
              <Button variant="success" onClick={handleSubmitForApproval} disabled={!canSubmitForApproval}>
                Gửi duyệt
              </Button>
            )}
            {course?.trang_thai === 'pending' && (
              <Badge variant="warning">Đang chờ duyệt</Badge>
            )}
            {course?.trang_thai === 'rejected' && (
              <>
                <Badge variant="danger">Bị từ chối</Badge>
                <Button variant="outline" onClick={handleRevertToDraft}>
                  Chỉnh sửa lại
                </Button>
              </>
            )}
            {course?.trang_thai === 'approved' && (
              <Badge variant="success">Đã duyệt</Badge>
            )}
            <Button variant="outline" onClick={() => navigate(`/learn/${courseId}`)}>
              Xem trước
            </Button>
            <Button variant="primary" onClick={handleSaveCourse} disabled={saving}>
              <Save className="w-4 h-4" />
              {saving ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] mb-4">
                Thông tin khóa học
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Tiêu đề</label>
                  <Input
                    value={course.tieu_de || ''}
                    onChange={(e) => setCourse({ ...course, tieu_de: e.target.value })}
                    placeholder="Nhập tiêu đề khóa học"
                  />
                </div>
                <div>
                  <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Mô tả</label>
                  <textarea
                    value={course.mo_ta || ''}
                    onChange={(e) => setCourse({ ...course, mo_ta: e.target.value })}
                    placeholder="Mô tả khóa học"
                    className="w-full p-3 border-2 border-[#263D5B] rounded-[8px] font-['Comfortaa', cursive]"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Giá (VNĐ)</label>
                    <Input
                      type="number"
                      value={course.gia || 0}
                      onChange={(e) => setCourse({ ...course, gia: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Mức độ</label>
                    <select
                      value={course.muc_do || ''}
                      onChange={(e) => setCourse({ ...course, muc_do: e.target.value })}
                      className="w-full p-3 border-2 border-[#263D5B] rounded-[8px] font-['Comfortaa', cursive]"
                    >
                      <option value="">Chọn mức độ</option>
                      <option value="Cơ bản">Cơ bản</option>
                      <option value="Trung cấp">Trung cấp</option>
                      <option value="Nâng cao">Nâng cao</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Danh mục</label>
                    <select
                      value={course.danh_muc_id || ''}
                      onChange={(e) => setCourse({ ...course, danh_muc_id: Number(e.target.value) })}
                      className="w-full p-3 border-2 border-[#263D5B] rounded-[8px] font-['Comfortaa', cursive]"
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>{cat.ten}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Thời lượng</label>
                    <Input
                      value={course.thoi_luong || ''}
                      onChange={(e) => setCourse({ ...course, thoi_luong: e.target.value })}
                      placeholder="VD: 40 giờ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Ảnh thumbnail</label>
                    <ImageUpload
                      value={course.thumbnail || ''}
                      onChange={(url) => setCourse({ ...course, thumbnail: url })}
                      placeholder="Tải ảnh thumbnail"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Chapters */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B]">
                  Nội dung khóa học
                </h2>
                <Button variant="outline" size="sm" onClick={() => setShowChapterModal(true)}>
                  <Plus className="w-4 h-4" />
                  Thêm chương
                </Button>
              </div>

              {chapters.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Chưa có chương nào. Thêm chương đầu tiên!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {chapters.map((chapter, index) => (
                    <div key={chapter.id} className="border-2 border-[#263D5B] rounded-[8px] overflow-hidden">
                      <div 
                        className="flex items-center justify-between p-4 bg-[#F8F6F3] cursor-pointer"
                        onClick={() => toggleChapter(chapter.id)}
                      >
                        <div className="flex items-center gap-3">
                          {openChapters.includes(chapter.id) ? (
                            <ChevronDown className="w-5 h-5 text-[#263D5B]" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-[#263D5B]" />
                          )}
                          <span className="font-['Comfortaa', cursive] font-medium text-[#263D5B]">
                            Chương {index + 1}: {chapter.tieu_de}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-sm text-gray-500">
                            {chapter.bai_hoc?.length || 0} bài
                          </span>
                          <button 
                            type="button"
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                            disabled={index === 0}
                            onClick={(e) => { e.stopPropagation(); handleMoveChapter(index, 'up'); }}
                            title="Di chuyển lên"
                          >
                            ↑↑
                          </button>
                          <button 
                            type="button"
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                            disabled={index === chapters.length - 1}
                            onClick={(e) => { e.stopPropagation(); handleMoveChapter(index, 'down'); }}
                            title="Di chuyển xuống"
                          >
                            ↓↓
                          </button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Plus click, chapter.id:', chapter.id);
                              setEditingLesson({ chapterId: chapter.id });
                              setShowLessonModal(true);
                              console.log('After set, showLessonModal:', true);
                            }}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChapter(chapter.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {openChapters.includes(chapter.id) && (
                        <div className="p-4 space-y-2">
                          {(!chapter.bai_hoc || chapter.bai_hoc.length === 0) ? (
                            <p className="text-sm text-gray-500 text-center py-2">
                              Chưa có bài học
                            </p>
                          ) : (
                            chapter.bai_hoc.map((lesson: Lesson, lessonIndex: number) => (
                              <div 
                                key={lesson.id}
                                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-[8px] group"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <span className="text-gray-400 text-xs">#{lessonIndex + 1}</span>
                                  <Video className="w-5 h-5 text-[#49B6E5]" />
                                  <div>
                                    <p className="font-['Comfortaa', cursive] text-sm text-[#263D5B]">
                                      {lesson.tieu_de}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {lesson.thoi_luong || '0:00'} • {lesson.loai}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <button 
                                    type="button"
                                    className="p-1 hover:bg-gray-100 rounded text-xs"
                                    onClick={() => handleMoveLesson(chapter.id, lessonIndex, 'up')}
                                    title="Di chuyển lên"
                                    disabled={lessonIndex === 0}
                                  >
                                    ↑
                                  </button>
                                  <button 
                                    type="button"
                                    className="p-1 hover:bg-gray-100 rounded text-xs"
                                    onClick={() => handleMoveLesson(chapter.id, lessonIndex, 'down')}
                                    title="Di chuyển xuống"
                                    disabled={lessonIndex === chapter.bai_hoc.length - 1}
                                  >
                                    ↓
                                  </button>
                                  <Button variant="outline" size="sm" onClick={() => {
                                    setEditingLesson({ chapterId: chapter.id, lesson: lesson });
                                    setNewLessonTitle(lesson.tieu_de || '');
                                    setNewLessonDuration(lesson.thoi_luong || '');
                                    setNewLessonVideoUrl(lesson.video_url || '');
                                    setNewLessonType(lesson.loai || 'video');
                                    setNewLessonContent(lesson.noi_dung || '');
                                    setIsLessonEditMode(true);
                                    setEditingLessonId(lesson.id);
                                    setShowLessonModal(true);
                                  }}>
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleDeleteLesson(chapter.id, lesson.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-['Comfortaa', cursive] text-lg text-[#263D5B] mb-4">
                Thống kê
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Học viên</span>
                  <span className="font-['Comfortaa', cursive] font-medium">
                    {course.so_luong_da_dang_ky || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Đánh giá</span>
                  <span className="font-['Comfortaa', cursive] font-medium">
                    {course.xep_hang || 0} ★
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái</span>
                  <Badge variant={course.trang_thai === 'approved' ? 'success' : 'warning'}>
                    {course.trang_thai === 'approved' ? 'Đã duyệt' : course.trang_thai || 'Nháp'}
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-['Comfortaa', cursive] text-lg text-[#263D5B] mb-4">
                Quiz & Bài tập
              </h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="w-4 h-4" />
                  Quản lý Quiz
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileQuestion className="w-4 h-4" />
                  Quản lý Bài tập
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Chapter Modal */}
      <Modal open={showChapterModal} onClose={() => setShowChapterModal(false)} title="Thêm chương mới">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Tên chương</label>
            <Input
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              placeholder="Nhập tên chương"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Thứ tự</label>
            <Input
              type="number"
              value={newChapterOrder || ''}
              onChange={(e) => setNewChapterOrder(Number(e.target.value))}
              placeholder="VD: 1"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowChapterModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleAddChapter}>
              Thêm chương
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Lesson Modal */}
      <Modal open={showLessonModal} onClose={() => { setShowLessonModal(false); setEditingLesson(null); setIsLessonEditMode(false); setEditingLessonId(null); }} title={isLessonEditMode ? 'Sửa bài học' : 'Thêm bài học vào ' + getChapterName(editingChapter?.chapterId || chapters[0]?.id || 0)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Tên bài học *</label>
            <Input
              value={newLessonTitle}
              onChange={(e) => { console.log('Input change:', e.target.value); setNewLessonTitle(e.target.value); }}
              placeholder="Nhập tên bài học"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Loại</label>
              <select
                value={newLessonType}
                onChange={(e) => setNewLessonType(e.target.value)}
                className="w-full p-3 border-2 border-[#263D5B] rounded-[8px] font-['Comfortaa', cursive]"
              >
                <option value="video">Video</option>
                <option value="document">Tài liệu</option>
                <option value="quiz">Quiz</option>
                <option value="exercise">Bài tập</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Thời lượng</label>
              <Input
                value={newLessonDuration}
                onChange={(e) => setNewLessonDuration(e.target.value)}
                placeholder="VD: 10:00"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Video</label>
            <ImageUpload
              value={newLessonVideoUrl}
              onChange={(url) => setNewLessonVideoUrl(url)}
              accept="video/*"
              placeholder="Tải video lên"
            />
          </div>
          <div>
            <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Nội dung</label>
            <textarea
              value={newLessonContent}
              onChange={(e) => setNewLessonContent(e.target.value)}
              placeholder="Nội dung bài học..."
              className="w-full p-3 border-2 border-[#263D5B] rounded-[8px] font-['Comfortaa', cursive]"
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => { setShowLessonModal(false); setEditingLesson(null); }}>
              Hủy
            </Button>
            <Button variant="primary" onClick={() => { console.log('Add lesson click, title:', newLessonTitle, 'editMode:', isLessonEditMode); handleAddLesson(); }}>
              {isLessonEditMode ? 'Cập nhật' : 'Thêm bài học'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Quiz Modal */}
      <Modal open={showQuizModal} onClose={() => { setShowQuizModal(false); setEditingQuiz(null); }} title={editingQuiz ? 'Sửa Quiz' : 'Thêm Quiz'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Tiêu đề Quiz *</label>
            <Input
              value={newQuizTitle}
              onChange={(e) => setNewQuizTitle(e.target.value)}
              placeholder="Nhập tiêu đề Quiz"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Thời gian làm (phút)</label>
              <Input
                type="number"
                value={newQuizTimeLimit || ''}
                onChange={(e) => setNewQuizTimeLimit(Number(e.target.value))}
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Số câu hỏi</label>
              <Input
                type="number"
                value={newQuizQuestionCount || ''}
                onChange={(e) => setNewQuizQuestionCount(Number(e.target.value))}
                placeholder="5"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => { setShowQuizModal(false); setEditingQuiz(null); }}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleAddQuiz}>
              {editingQuiz ? 'Lưu' : 'Thêm Quiz'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Assignment Modal */}
      <Modal open={showAssignmentModal} onClose={() => { setShowAssignmentModal(false); setEditingAssignment(null); }} title={editingAssignment ? 'Sửa Bài tập' : 'Thêm Bài tập'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Tiêu đề *</label>
            <Input
              value={newAssignmentTitle}
              onChange={(e) => setNewAssignmentTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài tập"
            />
          </div>
          <div>
            <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Mô tả</label>
            <textarea
              value={newAssignmentDescription}
              onChange={(e) => setNewAssignmentDescription(e.target.value)}
              placeholder="Mô tả bài tập..."
              className="w-full p-3 border-2 border-[#263D5B] rounded-[8px] font-['Comfortaa', cursive]"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Bắt buộc</label>
              <select
                value={newAssignmentRequired ? 'true' : 'false'}
                onChange={(e) => setNewAssignmentRequired(e.target.value === 'true')}
                className="w-full p-3 border-2 border-[#263D5B] rounded-[8px] font-['Comfortaa', cursive]"
              >
                <option value="false">Không bắt buộc</option>
                <option value="true">Bắt buộc</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-['Comfortaa', cursive] text-gray-600 mb-1">Hạn nộp</label>
              <Input
                type="datetime-local"
                value={newAssignmentDeadline || ''}
                onChange={(e) => setNewAssignmentDeadline(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => { setShowAssignmentModal(false); setEditingAssignment(null); }}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleAddAssignment}>
              {editingAssignment ? 'Lưu' : 'Thêm Bài tập'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeacherCourseEditPage;