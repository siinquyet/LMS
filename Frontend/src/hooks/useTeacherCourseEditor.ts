import { useState, useEffect } from 'react';
import { useCourse, Course } from './useCourse';
import { useChapters, Chapter } from './useChapters';
import { useModals, ModalType } from './useModals';
import { useForm } from './useForm';

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

export interface EditingLesson {
  chapterId: number;
  lesson?: Lesson;
}

export interface EditingQuiz {
  id?: number;
  tieu_de: string;
  thoi_gian_lam: number;
  so_cau_hoi: number;
}

export interface EditingAssignment {
  id?: number;
  tieu_de: string;
  mo_ta: string;
  bat_buoc: boolean;
  han_nop: string;
}

export interface ChapterFormData {
  tieu_de: string;
  thu_tu: number;
}

export interface LessonFormData {
  tieu_de: string;
  loai: Lesson['loai'];
  thoi_luong: string;
  video_url: string;
  noi_dung: string;
}

export interface QuizFormData {
  tieu_de: string;
  thoi_gian_lam: number;
  so_cau_hoi: number;
}

export interface AssignmentFormData {
  tieu_de: string;
  mo_ta: string;
  bat_buoc: boolean;
  han_nop: string;
}

export function useTeacherCourseEditor(courseId: number) {
  const course = useCourse(courseId);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const chaptersHook = useChapters(courseId, chapters, setChapters);
  const modals = useModals();

  const [editingLesson, setEditingLesson] = useState<EditingLesson | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<EditingQuiz | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<EditingAssignment | null>(null);

  const chapterForm = useForm<ChapterFormData>({ tieu_de: '', thu_tu: 1 });
  const lessonForm = useForm<LessonFormData>({ tieu_de: '', loai: 'video', thoi_luong: '', video_url: '', noi_dung: '' });
  const quizForm = useForm<QuizFormData>({ tieu_de: '', thoi_gian_lam: 10, so_cau_hoi: 5 });
  const assignmentForm = useForm<AssignmentFormData>({ tieu_de: '', mo_ta: '', bat_buoc: false, han_nop: '' });

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    course.loadCourse();
    fetchCategories();
  }, [courseId]);

  const fetchCategories = async () => {
    try {
      const { categories: data } = await import('../api').then(m => m.getCategories());
      setCategories(data || []);
    } catch (e) {
      console.error('Failed to fetch categories:', e);
    }
  };

  const canSubmitForApproval = course.course &&
    course.course.trang_thai === 'draft' &&
    chapters.length > 0 &&
    chapters.reduce((acc: number, ch: Chapter) => acc + (ch.bai_hoc?.length || 0), 0) > 0;

  const openLessonModal = (chapterId: number, lesson?: Lesson) => {
    setEditingLesson({ chapterId, lesson });
    if (lesson) {
      lessonForm.setFields({
        tieu_de: lesson.tieu_de || '',
        loai: lesson.loai || 'video',
        thoi_luong: lesson.thoi_luong || '',
        video_url: lesson.video_url || '',
        noi_dung: lesson.noi_dung || '',
      });
    } else {
      lessonForm.reset();
    }
    modals.openModal('lesson');
  };

  const openQuizModal = (quiz?: EditingQuiz) => {
    setEditingQuiz(quiz || null);
    if (quiz) {
      quizForm.setFields({
        tieu_de: quiz.tieu_de,
        thoi_gian_lam: quiz.thoi_gian_lam,
        so_cau_hoi: quiz.so_cau_hoi,
      });
    } else {
      quizForm.reset();
    }
    modals.openModal('quiz');
  };

  const openAssignmentModal = (assignment?: EditingAssignment) => {
    setEditingAssignment(assignment || null);
    if (assignment) {
      assignmentForm.setFields({
        tieu_de: assignment.tieu_de,
        mo_ta: assignment.mo_ta,
        bat_buoc: assignment.bat_buoc,
        han_nop: assignment.han_nop,
      });
    } else {
      assignmentForm.reset();
    }
    modals.openModal('assignment');
  };

  const handleSubmitForApproval = () => course.submitForApproval();
  const handleRevertToDraft = () => course.revertToDraft();
  const handleSaveCourse = () => course.saveCourse(course.course!);

  return {
    course: course.course,
    courseField: course.setCourseField,
    chapters,
    ...chaptersHook,
    loading: course.loading,
    saving: course.saving,
    error: course.error,
    categories,
    canSubmitForApproval,
    handleSaveCourse,
    handleSubmitForApproval,
    handleRevertToDraft,
    activeModal: modals.activeModal,
    modalData: modals.modalData,
    openModal: modals.openModal,
    closeModal: () => {
      lessonForm.reset();
      setEditingLesson(null);
      quizForm.reset();
      setEditingQuiz(null);
      assignmentForm.reset();
      setEditingAssignment(null);
      modals.closeModal();
    },
    editingLesson,
    setEditingLesson,
    editingQuiz,
    setEditingQuiz,
    editingAssignment,
    setEditingAssignment,
    chapterForm,
    lessonForm,
    quizForm,
    assignmentForm,
    openLessonModal,
    openQuizModal,
    openAssignmentModal,
  };
}