import { useState, useCallback } from 'react';
import * as api from '../api';

export interface Lesson {
  id: number;
  tieu_de: string;
  loai: 'video' | 'document' | 'quiz' | 'exercise';
  video_url: string;
  thoi_luong: string;
  noi_dung: string;
  quizzes?: any[];
  assignments?: any[];
  thu_tu?: number;
}

export interface Chapter {
  id: number;
  tieu_de: string;
  thu_tu?: number;
  bai_hoc: Lesson[];
}

export function useChapters(courseId: number, chapters: Chapter[], setChapters: React.Dispatch<React.SetStateAction<Chapter[]>>) {
  const [openChapters, setOpenChapters] = useState<number[]>([]);

  const addChapter = useCallback(async (title: string, order: number) => {
    if (!title.trim()) {
      alert('Vui lòng nhập tên chương');
      return;
    }
    if (!courseId || courseId === 0) {
      alert('Không có khóa học');
      return;
    }
    try {
      const { chapter } = await api.createChapter(courseId, title.trim(), order);
      if (chapter) {
        setChapters(prev => [...prev, { ...chapter, bai_hoc: [] }]);
        setOpenChapters(prev => [...prev, chapter.id]);
        alert('Thêm chương thành công!');
      }
    } catch (e) {
      alert('Thêm chương thất bại: ' + (e as Error).message);
    }
  }, [courseId, setChapters]);

  const deleteChapter = useCallback(async (chapterId: number) => {
    if (!confirm('Xóa chương này sẽ xóa tất cả bài học trong chương. Tiếp tục?')) return;
    try {
      await api.deleteChapter(chapterId);
      setChapters(prev => prev.filter(c => c.id !== chapterId));
      setOpenChapters(prev => prev.filter(id => id !== chapterId));
      alert('Xóa chương thành công!');
    } catch (e) {
      alert('Xóa chương thất bại: ' + (e as Error).message);
    }
  }, [setChapters, setOpenChapters]);

  const moveChapter = useCallback(async (index: number, direction: 'up' | 'down') => {
    const newChapters = [...chapters];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newChapters.length) return;
    [newChapters[index], newChapters[targetIndex]] = [newChapters[targetIndex], newChapters[index]];
    setChapters(newChapters);
    try {
      await api.updateCourse(courseId, {
        chapterIds: newChapters.map(c => c.id),
      } as any);
    } catch (e) {
      alert('Sắp xếp thất bại');
      console.error(e);
    }
  }, [chapters, courseId, setChapters]);

  const addLesson = useCallback(async (chapterId: number, data: Partial<Lesson>) => {
    if (!data.tieu_de?.trim()) {
      alert('Vui lòng nhập tên bài học');
      return;
    }
    try {
      const { lesson } = await api.createLesson(chapterId, {
        tieu_de: data.tieu_de.trim(),
        loai: data.loai || 'video',
        video_url: data.video_url || '',
        thoi_luong: data.thoi_luong || '',
        noi_dung: data.noi_dung || '',
      });
      if (lesson) {
        setChapters(prev => prev.map(ch =>
          ch.id === chapterId
            ? { ...ch, bai_hoc: [...(ch.bai_hoc || []), { ...lesson, quizzes: [], assignments: [] }] }
            : ch
        ));
        alert('Thêm bài học thành công!');
      }
    } catch (e) {
      alert('Thêm bài học thất bại: ' + (e as Error).message);
    }
  }, [setChapters]);

  const updateLesson = useCallback(async (lessonId: number, data: Partial<Lesson>) => {
    try {
      await api.updateLesson(lessonId, data);
      setChapters(prev => prev.map(ch => ({
        ...ch,
        bai_hoc: (ch.bai_hoc || []).map(l =>
          l.id === lessonId ? { ...l, ...data } : l
        ),
      })));
      alert('Cập nhật bài học thành công!');
    } catch (e) {
      alert('Cập nhật thất bại: ' + (e as Error).message);
    }
  }, [setChapters]);

  const deleteLesson = useCallback(async (chapterId: number, lessonId: number) => {
    if (!confirm('Xóa bài học này?')) return;
    try {
      await api.deleteLesson(lessonId);
      setChapters(prev => prev.map(ch =>
        ch.id === chapterId
          ? { ...ch, bai_hoc: (ch.bai_hoc || []).filter(l => l.id !== lessonId) }
          : ch
      ));
    } catch (e) {
      console.error('Xóa thất bại:', e);
    }
  }, [setChapters]);

  const moveLesson = useCallback(async (chapterId: number, lessonIndex: number, direction: 'up' | 'down') => {
    const chapter = chapters.find(ch => ch.id === chapterId);
    if (!chapter?.bai_hoc) return;
    const newLessons = [...chapter.bai_hoc];
    const targetIndex = direction === 'up' ? lessonIndex - 1 : lessonIndex + 1;
    if (targetIndex < 0 || targetIndex >= newLessons.length) return;
    [newLessons[lessonIndex], newLessons[targetIndex]] = [newLessons[targetIndex], newLessons[lessonIndex]];
    setChapters(prev => prev.map(ch =>
      ch.id === chapterId ? { ...ch, bai_hoc: newLessons } : ch
    ));
    try {
      await api.updateChapter(chapterId, {
        lessonIds: newLessons.map((l: Lesson) => l.id),
      } as any);
    } catch (e) {
      console.error('Sắp xếp thất bại:', e);
    }
  }, [chapters, setChapters]);

  const toggleChapter = useCallback((id: number) => {
    setOpenChapters(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  }, []);

  const getChapterName = useCallback((chapterId: number) => {
    const ch = chapters.find(c => c.id === chapterId);
    return ch ? ch.tieu_de : 'Chương ' + chapterId;
  }, [chapters]);

  return {
    openChapters, setOpenChapters,
    addChapter, deleteChapter, moveChapter,
    addLesson, updateLesson, deleteLesson, moveLesson,
    toggleChapter, getChapterName,
  };
}