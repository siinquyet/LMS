import { useState, useEffect, useCallback } from 'react';
import * as api from '../api';

export interface Course {
  id: number;
  tieu_de: string;
  giang_vien_id: number;
  danh_muc_id: number;
  gia: number;
  gia_goc?: number;
  so_luong_toi_da?: number;
  so_luong_da_dang_ky: number;
  trang_thai: string;
  mo_ta?: string;
  thumbnail?: string;
  hinh_anh?: string;
  muc_do?: string;
  thoi_luong?: string;
  so_bai_hoc?: number;
  xep_hang?: number;
  giang_vien?: {
    id: number;
    ten: string;
    ho: string;
    anh_dai_dien?: string;
  };
  danh_muc?: {
    id: number;
    ten: string;
  };
}

export interface Category {
  id: number;
  ten: string;
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async (params?: { categoryId?: number; search?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCourses(params);
      setCourses(data.courses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.getCategories();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, [fetchCourses, fetchCategories]);

  return { courses, categories, loading, error, fetchCourses, fetchCategories };
};

export const useCourseDetail = (courseId: number) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCourse(courseId);
      setCourse(data.course || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch course');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  return { course, loading, error, refetch: fetchCourse };
};