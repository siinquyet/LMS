const API_BASE = 'http://localhost:3001';

const getHeaders = (includeAuth = true) => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  return res.json();
};

// Auth
export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(res);
  if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

export const register = async (name: string, email: string, password: string, role?: string) => {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role }),
  });
  return handleResponse(res);
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Users
export const getUsers = async () => {
  const res = await fetch(`${API_BASE}/api/users`, { headers: getHeaders() });
  return handleResponse(res);
};

export const getUser = async (id: number) => {
  const res = await fetch(`${API_BASE}/api/users/${id}`, { headers: getHeaders() });
  return handleResponse(res);
};

export const updateUser = async (id: number, data: Record<string, unknown>) => {
  const res = await fetch(`${API_BASE}/api/users/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

// Categories
export const getCategories = async () => {
  const res = await fetch(`${API_BASE}/api/categories`);
  return handleResponse(res);
};

export const createCategory = async (ten: string) => {
  const res = await fetch(`${API_BASE}/api/categories`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ ten }),
  });
  return handleResponse(res);
};

export const updateCategory = async (id: number, ten: string) => {
  const res = await fetch(`${API_BASE}/api/categories/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ ten }),
  });
  return handleResponse(res);
};

export const deleteCategory = async (id: number) => {
  const res = await fetch(`${API_BASE}/api/categories/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return res.ok ? {} : handleResponse(res);
};

// Courses
export const getCourses = async (params?: { categoryId?: number; instructorId?: number; search?: string; status?: string }) => {
  const query = new URLSearchParams();
  if (params?.categoryId) query.set('categoryId', String(params.categoryId));
  if (params?.instructorId) query.set('instructorId', String(params.instructorId));
  if (params?.search) query.set('search', params.search);
  if (params?.status) query.set('status', params.status);
  const res = await fetch(`${API_BASE}/api/courses?${query}`);
  return handleResponse(res);
};

export const getCourse = async (id: number) => {
  const res = await fetch(`${API_BASE}/api/courses/${id}`);
  return handleResponse(res);
};

export const createCourse = async (data: Record<string, unknown>) => {
  const res = await fetch(`${API_BASE}/api/courses`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const updateCourse = async (id: number, data: Record<string, unknown>) => {
  const res = await fetch(`${API_BASE}/api/courses/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const deleteCourse = async (id: number) => {
  const res = await fetch(`${API_BASE}/api/courses/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return res.ok ? {} : handleResponse(res);
};

export const updateCourseStatus = async (id: number, trang_thai: string) => {
  const res = await fetch(`${API_BASE}/api/courses/${id}/status`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ trang_thai }),
  });
  return handleResponse(res);
};

// Chapters
export const createChapter = async (courseId: number, tieu_de: string, thu_tu?: number) => {
  const res = await fetch(`${API_BASE}/api/courses/${courseId}/chapters`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ tieu_de, thu_tu }),
  });
  return handleResponse(res);
};

export const updateChapter = async (id: number, data: { tieu_de?: string; thu_tu?: number }) => {
  const res = await fetch(`${API_BASE}/api/chapters/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const deleteChapter = async (id: number) => {
  const res = await fetch(`${API_BASE}/api/chapters/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return res.ok ? {} : handleResponse(res);
};

// Lessons
export const createLesson = async (chapterId: number, data: Record<string, unknown>) => {
  const res = await fetch(`${API_BASE}/api/chapters/${chapterId}/lessons`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const updateLesson = async (id: number, data: Record<string, unknown>) => {
  const res = await fetch(`${API_BASE}/api/lessons/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const deleteLesson = async (id: number) => {
  const res = await fetch(`${API_BASE}/api/lessons/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return res.ok ? {} : handleResponse(res);
};

// Comments
export const getComments = async (lessonId: number) => {
  const res = await fetch(`${API_BASE}/api/lessons/${lessonId}/comments`);
  return handleResponse(res);
};

export const createComment = async (lessonId: number, nguoi_dung_id: number, noi_dung: string, parent_id?: number) => {
  const res = await fetch(`${API_BASE}/api/lessons/${lessonId}/comments`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ nguoi_dung_id, noi_dung, parent_id }),
  });
  return handleResponse(res);
};

export const deleteComment = async (id: number) => {
  const res = await fetch(`${API_BASE}/api/comments/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return res.ok ? {} : handleResponse(res);
};

// Enrollments
export const enrollCourse = async (nguoi_dung_id: number, khoa_hoc_id: number) => {
  const res = await fetch(`${API_BASE}/api/enrollments`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ nguoi_dung_id, khoa_hoc_id }),
  });
  return handleResponse(res);
};

// My Courses
export const getMyCourses = async (userId: number) => {
  const res = await fetch(`${API_BASE}/api/my-courses/${userId}`);
  return handleResponse(res);
};

// Progress
export const getUserProgress = async (userId: number, courseId?: number) => {
  const query = courseId ? `?courseId=${courseId}` : '';
  const res = await fetch(`${API_BASE}/api/users/${userId}/progress${query}`);
  return handleResponse(res);
};

export const updateProgress = async (nguoi_dung_id: number, bai_hoc_id: number, da_hoan_thanh: boolean) => {
  const res = await fetch(`${API_BASE}/api/progress`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ nguoi_dung_id, bai_hoc_id, da_hoan_thanh }),
  });
  return handleResponse(res);
};

// Forum
export const getForumTopics = async (courseId?: number, search?: string) => {
  const query = new URLSearchParams();
  if (courseId) query.set('courseId', String(courseId));
  if (search) query.set('search', search);
  const res = await fetch(`${API_BASE}/api/forum/topics?${query}`);
  return handleResponse(res);
};

export const getForumTopic = async (id: number) => {
  const res = await fetch(`${API_BASE}/api/forum/topics/${id}`);
  return handleResponse(res);
};

export const createForumTopic = async (data: Record<string, unknown>) => {
  const res = await fetch(`${API_BASE}/api/forum/topics`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const updateForumTopic = async (id: number, data: Record<string, unknown>) => {
  const res = await fetch(`${API_BASE}/api/forum/topics/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const deleteForumTopic = async (id: number) => {
  const res = await fetch(`${API_BASE}/api/forum/topics/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return res.ok ? {} : handleResponse(res);
};

export const createForumReply = async (topicId: number, nguoi_dung_id: number, noi_dung: string) => {
  const res = await fetch(`${API_BASE}/api/forum/topics/${topicId}/replies`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ nguoi_dung_id, noi_dung }),
  });
  return handleResponse(res);
};

export const deleteForumReply = async (id: number) => {
  const res = await fetch(`${API_BASE}/api/forum/replies/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return res.ok ? {} : handleResponse(res);
};

// Quizzes
export const getQuiz = async (id: number) => {
  const res = await fetch(`${API_BASE}/api/quizzes/${id}`);
  return handleResponse(res);
};

export const getQuizQuestions = async (quizId: number) => {
  const res = await fetch(`${API_BASE}/api/quizzes/${quizId}/questions`);
  return handleResponse(res);
};

export const createQuizQuestion = async (quizId: number, cau_hoi: string, lua_chon: string[], dap_an_dung: string) => {
  const res = await fetch(`${API_BASE}/api/quizzes/${quizId}/questions`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ cau_hoi, lua_chon, dap_an_dung }),
  });
  return handleResponse(res);
};

export const updateQuizQuestion = async (quizId: number, questionId: number, data: Record<string, unknown>) => {
  const res = await fetch(`${API_BASE}/api/quizzes/${quizId}/questions/${questionId}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const deleteQuizQuestion = async (quizId: number, questionId: number) => {
  const res = await fetch(`${API_BASE}/api/quizzes/${quizId}/questions/${questionId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return res.ok ? {} : handleResponse(res);
};

export const submitQuizAttempt = async (quizId: number, nguoi_dung_id: number, answers: Array<{ questionId: number; answer: string }>) => {
  const res = await fetch(`${API_BASE}/api/quizzes/${quizId}/attempts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ nguoi_dung_id, answers }),
  });
  return handleResponse(res);
};

export const gradeQuizAttempt = async (quizId: number, attemptId: number, diem: number, nhan_xet?: string) => {
  const res = await fetch(`${API_BASE}/api/quizzes/${quizId}/attempts/${attemptId}/grade`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ diem, nhan_xet }),
  });
  return handleResponse(res);
};

// Assignments
export const getAssignments = async (userId?: number, courseId?: number) => {
  const query = new URLSearchParams();
  if (userId) query.set('userId', String(userId));
  if (courseId) query.set('courseId', String(courseId));
  const res = await fetch(`${API_BASE}/api/assignments?${query}`);
  return handleResponse(res);
};

export const submitAssignment = async (assignmentId: number, nguoi_dung_id: number, noi_dung: string, file_dinh_kem?: string) => {
  const res = await fetch(`${API_BASE}/api/assignments/${assignmentId}/submissions`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ nguoi_dung_id, noi_dung, file_dinh_kem }),
  });
  return handleResponse(res);
};

// Notifications
export const getNotifications = async (userId: number) => {
  const res = await fetch(`${API_BASE}/api/notifications/${userId}`);
  return handleResponse(res);
};

export const markNotificationRead = async (id: number) => {
  const res = await fetch(`${API_BASE}/api/notifications/${id}/read`, {
    method: 'PATCH',
    headers: getHeaders(),
  });
  return handleResponse(res);
};

export const markAllNotificationsRead = async (userId: number) => {
  const res = await fetch(`${API_BASE}/api/notifications/users/${userId}/read-all`, {
    method: 'PATCH',
    headers: getHeaders(),
  });
  return handleResponse(res);
};

// Orders
export const getOrders = async (userId?: number, startDate?: string, endDate?: string) => {
  const query = new URLSearchParams();
  if (userId) query.set('userId', String(userId));
  if (startDate) query.set('startDate', startDate);
  if (endDate) query.set('endDate', endDate);
  const res = await fetch(`${API_BASE}/api/orders?${query}`);
  return handleResponse(res);
};

export const refundOrder = async (id: number) => {
  const res = await fetch(`${API_BASE}/api/orders/${id}/refund`, {
    method: 'PATCH',
    headers: getHeaders(),
  });
  return handleResponse(res);
};

// Admin
export const getAdminOverview = async () => {
  const res = await fetch(`${API_BASE}/api/admin/overview`);
  return handleResponse(res);
};

export const getAnalytics = async () => {
  const res = await fetch(`${API_BASE}/api/analytics`);
  return handleResponse(res);
};

// Instructors
export const getInstructors = async () => {
  const res = await fetch(`${API_BASE}/api/instructors`);
  return handleResponse(res);
};

export const getInstructorStudents = async (instructorId: number) => {
  const res = await fetch(`${API_BASE}/api/instructors/${instructorId}/students`);
  return handleResponse(res);
};

export const getInstructorAnalytics = async (instructorId: number) => {
  const res = await fetch(`${API_BASE}/api/instructors/${instructorId}/analytics`);
  return handleResponse(res);
};