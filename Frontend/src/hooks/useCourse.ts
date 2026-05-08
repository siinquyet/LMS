import { useState, useCallback } from 'react';
import * as api from '../api';

export interface Course {
  id: number;
  tieu_de: string;
  mo_ta: string;
  gia: number;
  muc_do: string;
  danh_muc_id: number;
  thoi_luong: string;
  thumbnail: string;
  trang_thai: 'draft' | 'pending' | 'approved' | 'rejected';
  so_luong_da_dang_ky: number;
  xep_hang: number;
}

export function useCourse(courseId: number) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCourse = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { course: data } = await api.getTeacherCourse(courseId);
      setCourse(data);
    } catch (e) {
      setError((e as Error).message || 'Không tải được khóa học');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const updateCourse = useCallback(async (updates: Partial<Course>) => {
    setSaving(true);
    try {
      await api.updateCourse(courseId, updates);
      setCourse(prev => prev ? { ...prev, ...updates } : null);
    } catch (e) {
      alert('Lưu thất bại: ' + (e as Error).message);
      throw e;
    } finally {
      setSaving(false);
    }
  }, [courseId]);

  const saveCourse = updateCourse;

  const submitForApproval = useCallback(async () => {
    try {
      await api.submitCourse(courseId);
      setCourse(prev => prev ? { ...prev, trang_thai: 'pending' } : null);
      alert('Đã gửi khóa học để duyệt!');
    } catch (e) {
      alert('Gửi thất bại: ' + (e as Error).message);
      throw e;
    }
  }, [courseId]);

  const revertToDraft = useCallback(async () => {
    try {
      await api.updateCourse(courseId, { trang_thai: 'draft' });
      setCourse(prev => prev ? { ...prev, trang_thai: 'draft' } : null);
      alert('Đã chuyển về bản nháp');
    } catch (e) {
      alert('Thất bại: ' + (e as Error).message);
      throw e;
    }
  }, [courseId]);

  const setCourseField = useCallback(<K extends keyof Course>(field: K, value: Course[K]) => {
    setCourse(prev => prev ? { ...prev, [field]: value } : null);
  }, []);

  return {
    course, loading, saving, error,
    loadCourse, saveCourse, updateCourse, submitForApproval, revertToDraft, setCourseField,
  };
}