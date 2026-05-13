const API_BASE = "";

const getHeaders = (includeAuth = true) => {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};
	if (includeAuth) {
		const token = localStorage.getItem("token");
		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}
	}
	return headers;
};

const handleResponse = async (res: Response) => {
	if (!res.ok) {
		const error = await res.json().catch(() => ({ error: "Request failed" }));
		if (res.status === 401) {
			localStorage.removeItem("token");
			localStorage.removeItem("refreshToken");
			localStorage.removeItem("user");
			window.dispatchEvent(new CustomEvent("auth:expired"));
		}
		throw new Error(error.error || "Request failed");
	}
	return res.json();
};

export class ApiError extends Error {
	constructor(
		public status: number,
		message: string,
	) {
		super(message);
		this.name = "ApiError";
	}
}

// Auth
export const login = async (email: string, password: string) => {
	const res = await fetch(`${API_BASE}/api/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
	});
	if (!res.ok) {
		const error = await res.json().catch(() => ({ error: "Request failed" }));
		throw new ApiError(res.status, error.error || "Request failed");
	}
	const data = await res.json();
	if (data.user) {
		localStorage.setItem("user", JSON.stringify(data.user));
		if (data.accessToken) {
			localStorage.setItem("token", data.accessToken);
		}
	}
	return data;
};

export const register = async (
	name: string,
	email: string,
	password: string,
	role?: string,
) => {
	const res = await fetch(`${API_BASE}/api/auth/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ name, email, password, role }),
	});
	return handleResponse(res);
};

export const logout = () => {
	localStorage.removeItem("user");
	localStorage.removeItem("token");
};

export const getCurrentUser = () => {
	const user = localStorage.getItem("user");
	return user ? JSON.parse(user) : null;
};

// Users
export const getUsers = async () => {
	const res = await fetch(`${API_BASE}/api/users`, { headers: getHeaders() });
	return handleResponse(res);
};

export const getUser = async (id: number) => {
	const res = await fetch(`${API_BASE}/api/users/${id}`, {
		headers: getHeaders(),
	});
	return handleResponse(res);
};

export const updateUser = async (id: number, data: Record<string, unknown>) => {
	const res = await fetch(`${API_BASE}/api/users/${id}`, {
		method: "PATCH",
		headers: getHeaders(),
		body: JSON.stringify(data),
	});
	return handleResponse(res);
};

export const changePassword = async (
	mat_khau_cu: string,
	mat_khau_moi: string,
	xac_nhan_mat_khau: string,
) => {
	const res = await fetch(`${API_BASE}/api/users/change-password`, {
		method: "POST",
		headers: getHeaders(),
		body: JSON.stringify({ mat_khau_cu, mat_khau_moi, xac_nhan_mat_khau }),
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
		method: "POST",
		headers: getHeaders(),
		body: JSON.stringify({ ten }),
	});
	return handleResponse(res);
};

export const updateCategory = async (id: number, ten: string) => {
	const res = await fetch(`${API_BASE}/api/categories/${id}`, {
		method: "PATCH",
		headers: getHeaders(),
		body: JSON.stringify({ ten }),
	});
	return handleResponse(res);
};

export const deleteCategory = async (id: number) => {
	const res = await fetch(`${API_BASE}/api/categories/${id}`, {
		method: "DELETE",
		headers: getHeaders(),
	});
	return res.ok ? {} : handleResponse(res);
};

// Teacher Courses
export const getTeacherCourses = async () => {
	const res = await fetch(`${API_BASE}/api/teacher/courses`, {
		headers: getHeaders(),
	});
	return handleResponse(res);
};

export const getTeacherCourse = async (id: number) => {
	const res = await fetch(`${API_BASE}/api/teacher/courses/${id}`, {
		headers: getHeaders(),
	});
	return handleResponse(res);
};

// Courses
export const getCourses = async (params?: {
	categoryId?: number;
	instructorId?: number;
	search?: string;
	status?: string;
	minPrice?: number;
	maxPrice?: number;
	sortBy?: "newest" | "popular" | "price-asc" | "price-desc";
	page?: number;
	limit?: number;
	level?: string;
}) => {
	const query = new URLSearchParams();
	if (params?.categoryId) query.set("categoryId", String(params.categoryId));
	if (params?.instructorId)
		query.set("instructorId", String(params.instructorId));
	if (params?.search) query.set("search", params.search);
	if (params?.status) query.set("status", params.status);
	if (params?.minPrice !== undefined)
		query.set("minPrice", String(params.minPrice));
	if (params?.maxPrice !== undefined)
		query.set("maxPrice", String(params.maxPrice));
	if (params?.sortBy) query.set("sortBy", params.sortBy);
	if (params?.page) query.set("page", String(params.page));
	if (params?.limit) query.set("limit", String(params.limit));
	if (params?.level) query.set("level", params.level);

	const headers = getHeaders();
	const userItem = localStorage.getItem("user");
	if (userItem) {
		try {
			const user = JSON.parse(userItem);
			if (user?.id) headers["x-user-id"] = String(user.id);
		} catch {}
	}

	const res = await fetch(`${API_BASE}/api/courses?${query}`, { headers });
	return handleResponse(res);
};

export const getCourse = async (id: number) => {
	const res = await fetch(`${API_BASE}/api/courses/${id}`);
	return handleResponse(res);
};

export const getCourseLearning = async (courseId: number) => {
	const res = await fetch(`${API_BASE}/api/courses/${courseId}/learning`, {
		headers: getHeaders(),
	});
	return handleResponse(res);
};

export const searchAll = async (query: string, type = "all") => {
	const q = new URLSearchParams({ q: query, type });
	const res = await fetch(`${API_BASE}/api/search?${q}`);
	return handleResponse(res);
};

export const createCourse = async (data: Record<string, unknown>) => {
	const res = await fetch(`${API_BASE}/api/courses`, {
		method: "POST",
		headers: getHeaders(),
		body: JSON.stringify(data),
	});
	return handleResponse(res);
};

export const updateCourse = async (
	id: number,
	data: Record<string, unknown>,
) => {
	const res = await fetch(`${API_BASE}/api/courses/${id}`, {
		method: "PATCH",
		headers: getHeaders(),
		body: JSON.stringify(data),
	});
	return handleResponse(res);
};

export const deleteCourse = async (id: number) => {
	const res = await fetch(`${API_BASE}/api/courses/${id}`, {
		method: "DELETE",
		headers: getHeaders(),
	});
	return res.ok ? {} : handleResponse(res);
};

export const submitCourse = async (id: number) => {
	const res = await fetch(`${API_BASE}/api/courses/${id}/submit`, {
		method: "POST",
		headers: getHeaders(),
	});
	return handleResponse(res);
};

export const updateCourseStatus = async (id: number, trang_thai: string) => {
	const res = await fetch(`${API_BASE}/api/courses/${id}/status`, {
		method: "PATCH",
		headers: getHeaders(),
		body: JSON.stringify({ trang_thai }),
	});
	return handleResponse(res);
};

// Chapters
export const createChapter = async (
	courseId: number,
	tieu_de: string,
	thu_tu?: number,
) => {
	const res = await fetch(`${API_BASE}/api/courses/${courseId}/chapters`, {
		method: "POST",
		headers: getHeaders(),
		body: JSON.stringify({ tieu_de, thu_tu }),
	});
	return handleResponse(res);
};

export const updateChapter = async (
	id: number,
	data: { tieu_de?: string; thu_tu?: number },
) => {
	const res = await fetch(`${API_BASE}/api/chapters/${id}`, {
		method: "PATCH",
		headers: getHeaders(),
		body: JSON.stringify(data),
	});
	return handleResponse(res);
};

export const deleteChapter = async (id: number) => {
	const res = await fetch(`${API_BASE}/api/chapters/${id}`, {
		method: "DELETE",
		headers: getHeaders(),
	});
	return res.ok ? {} : handleResponse(res);
};

// Lessons
export const createLesson = async (
	chapterId: number,
	data: Record<string, unknown>,
) => {
	const res = await fetch(`${API_BASE}/api/chapters/${chapterId}/lessons`, {
		method: "POST",
		headers: getHeaders(),
		body: JSON.stringify(data),
	});
	return handleResponse(res);
};

export const updateLesson = async (
	id: number,
	data: Record<string, unknown>,
) => {
	const res = await fetch(`${API_BASE}/api/lessons/${id}`, {
		method: "PATCH",
		headers: getHeaders(),
		body: JSON.stringify(data),
	});
	return handleResponse(res);
};

export const deleteLesson = async (id: number) => {
	const res = await fetch(`${API_BASE}/api/lessons/${id}`, {
		method: "DELETE",
		headers: getHeaders(),
	});
	return res.ok ? {} : handleResponse(res);
};

export const getLesson = async (id: number) => {
	const res = await fetch(`${API_BASE}/api/lessons/${id}`);
	return handleResponse(res);
};

export const reorderChapters = async (
	courseId: number,
	chapterIds: number[],
) => {
	const res = await fetch(
		`${API_BASE}/api/courses/${courseId}/chapters/reorder`,
		{
			method: "PATCH",
			headers: getHeaders(),
			body: JSON.stringify({ chapterIds }),
		},
	);
	return handleResponse(res);
};

export const reorderLessons = async (
	chapterId: number,
	lessonIds: number[],
) => {
	const res = await fetch(
		`${API_BASE}/api/chapters/${chapterId}/lessons/reorder`,
		{
			method: "PATCH",
			headers: getHeaders(),
			body: JSON.stringify({ lessonIds }),
		},
	);
	return handleResponse(res);
};

// Comments
export const getComments = async (lessonId: number) => {
	const res = await fetch(`${API_BASE}/api/lessons/${lessonId}/comments`);
	return handleResponse(res);
};

export const createComment = async (
	lessonId: number,
	nguoi_dung_id: number,
	noi_dung: string,
	parent_id?: number,
) => {
	const res = await fetch(`${API_BASE}/api/lessons/${lessonId}/comments`, {
		method: "POST",
		headers: getHeaders(),
		body: JSON.stringify({ nguoi_dung_id, noi_dung, parent_id }),
	});
	return handleResponse(res);
};

export const deleteComment = async (id: number) => {
	const res = await fetch(`${API_BASE}/api/comments/${id}`, {
		method: "DELETE",
		headers: getHeaders(),
	});
	return res.ok ? {} : handleResponse(res);
};

// Enrollments
export const enrollCourse = async (
	nguoi_dung_id: number,
	khoa_hoc_id: number,
) => {
	const res = await fetch(`${API_BASE}/api/enrollments`, {
		method: "POST",
		headers: getHeaders(),
		body: JSON.stringify({ nguoi_dung_id, khoa_hoc_id }),
	});
	return handleResponse(res);
};

export const checkEnrollment = async (courseId: number) => {
	const res = await fetch(`${API_BASE}/api/enrollments/check/${courseId}`, {
		headers: getHeaders(),
	});
	return handleResponse(res);
};

// My Courses
export const getMyCourses = async (userId: number) => {
	const res = await fetch(`${API_BASE}/api/my-courses/${userId}`);
	return handleResponse(res);
};

export const getMyEnrollments = async () => {
	const res = await fetch(`${API_BASE}/api/my-enrollments`, {
		headers: getHeaders(),
	});
	return handleResponse(res);
};

// Progress
export const getUserProgress = async (userId: number, courseId?: number) => {
	const query = courseId ? `?courseId=${courseId}` : "";
	const res = await fetch(`${API_BASE}/api/users/${userId}/progress${query}`);
	return handleResponse(res);
};

export const updateProgress = async (
	nguoi_dung_id: number,
	bai_hoc_id: number,
	da_hoan_thanh: boolean,
) => {
	const res = await fetch(`${API_BASE}/api/progress`, {
		method: "PATCH",
		headers: getHeaders(),
		body: JSON.stringify({ nguoi_dung_id, bai_hoc_id, da_hoan_thanh }),
	});
	return handleResponse(res);
};

// Forum
export const getForumTopics = async (courseId?: number, search?: string) => {
	const query = new URLSearchParams();
	if (courseId) query.set("courseId", String(courseId));
	if (search) query.set("search", search);
	const res = await fetch(`${API_BASE}/api/forum/topics?${query}`);
	return handleResponse(res);
};

export const getForumTopic = async (id: number) => {
	const res = await fetch(`${API_BASE}/api/forum/topics/${id}`);
	return handleResponse(res);
};

export const createForumTopic = async (data: Record<string, unknown>) => {
	const res = await fetch(`${API_BASE}/api/forum/topics`, {
		method: "POST",
		headers: getHeaders(),
		body: JSON.stringify(data),
	});
	return handleResponse(res);
};

export const updateForumTopic = async (
	id: number,
	data: Record<string, unknown>,
) => {
	const res = await fetch(`${API_BASE}/api/forum/topics/${id}`, {
		method: "PATCH",
		headers: getHeaders(),
		body: JSON.stringify(data),
	});
	return handleResponse(res);
};

export const deleteForumTopic = async (id: number) => {
	const res = await fetch(`${API_BASE}/api/forum/topics/${id}`, {
		method: "DELETE",
		headers: getHeaders(),
	});
	return res.ok ? {} : handleResponse(res);
};

export const createForumReply = async (
	topicId: number,
	nguoi_dung_id: number,
	noi_dung: string,
) => {
	const res = await fetch(`${API_BASE}/api/forum/topics/${topicId}/replies`, {
		method: "POST",
		headers: getHeaders(),
		body: JSON.stringify({ nguoi_dung_id, noi_dung }),
	});
	return handleResponse(res);
};

export const deleteForumReply = async (id: number) => {
	const res = await fetch(`${API_BASE}/api/forum/replies/${id}`, {
		method: "DELETE",
		headers: getHeaders(),
	});
	return res.ok ? {} : handleResponse(res);
};

// Forum Posts
export const getForumPosts = async (params?: { danh_muc_id?: number; search?: string; page?: number; limit?: number }) => {
  const query = new URLSearchParams();
  if (params?.danh_muc_id) query.set('danh_muc_id', String(params.danh_muc_id));
  if (params?.search) query.set('search', params.search);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  const res = await fetch(`${API_BASE}/api/forum/posts?${query}`);
  return handleResponse(res);
};

export const getForumPost = async (id: number) => {
  const res = await fetch(`${API_BASE}/api/forum/posts/${id}`);
  return handleResponse(res);
};

export const createForumPost = async (data: { danh_muc_id?: number; tieu_de: string; noi_dung: string; hinh_anh?: string[] }) => {
  const res = await fetch(`${API_BASE}/api/forum/posts`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
  return handleResponse(res);
};

export const updateForumPost = async (id: number, data: { tieu_de?: string; noi_dung?: string; danh_muc_id?: number }) => {
  const res = await fetch(`${API_BASE}/api/forum/posts/${id}`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify(data) });
  return handleResponse(res);
};

export const deleteForumPost = async (id: number) => {
  const res = await fetch(`${API_BASE}/api/forum/posts/${id}`, { method: 'DELETE', headers: getHeaders() });
  return res.ok ? {} : handleResponse(res);
};

export const togglePostReaction = async (postId: number, loai: string) => {
  const res = await fetch(`${API_BASE}/api/forum/posts/${postId}/reactions`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ loai }) });
  return handleResponse(res);
};

export const createPostComment = async (postId: number, data: { noi_dung: string; parent_id?: number }) => {
  const res = await fetch(`${API_BASE}/api/forum/posts/${postId}/comments`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
  return handleResponse(res);
};

export const updatePostComment = async (id: number, noi_dung: string) => {
  const res = await fetch(`${API_BASE}/api/forum/comments/${id}`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ noi_dung }) });
  return handleResponse(res);
};

export const deletePostComment = async (id: number) => {
  const res = await fetch(`${API_BASE}/api/forum/comments/${id}`, { method: 'DELETE', headers: getHeaders() });
  return res.ok ? {} : handleResponse(res);
};

export const toggleCommentLike = async (commentId: number) => {
  const res = await fetch(`${API_BASE}/api/forum/comments/${commentId}/like`, { method: 'POST', headers: getHeaders() });
  return handleResponse(res);
};

export const togglePostSave = async (postId: number) => {
  const res = await fetch(`${API_BASE}/api/forum/posts/${postId}/save`, { method: 'POST', headers: getHeaders() });
  return handleResponse(res);
};

export const getSavedPosts = async () => {
  const res = await fetch(`${API_BASE}/api/forum/saved`, { headers: getHeaders() });
  return handleResponse(res);
};

export const getForumCategories = async () => {
  const res = await fetch(`${API_BASE}/api/forum/categories`);
  return handleResponse(res);
};

export const createForumCategory = async (data: { ten: string; mo_ta?: string; icon?: string; mau_sac?: string }) => {
  const res = await fetch(`${API_BASE}/api/forum/categories`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
  return handleResponse(res);
};

export const updateForumCategory = async (id: number, data: { ten?: string; mo_ta?: string; icon?: string; mau_sac?: string }) => {
  const res = await fetch(`${API_BASE}/api/forum/categories/${id}`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify(data) });
  return handleResponse(res);
};

export const deleteForumCategory = async (id: number) => {
  const res = await fetch(`${API_BASE}/api/forum/categories/${id}`, { method: 'DELETE', headers: getHeaders() });
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

export const createQuizQuestion = async (
	quizId: number,
	cau_hoi: string,
	lua_chon: string[],
	dap_an_dung: string,
) => {
	const res = await fetch(`${API_BASE}/api/quizzes/${quizId}/questions`, {
		method: "POST",
		headers: getHeaders(),
		body: JSON.stringify({ cau_hoi, lua_chon, dap_an_dung }),
	});
	return handleResponse(res);
};

export const updateQuizQuestion = async (
	quizId: number,
	questionId: number,
	data: Record<string, unknown>,
) => {
	const res = await fetch(
		`${API_BASE}/api/quizzes/${quizId}/questions/${questionId}`,
		{
			method: "PATCH",
			headers: getHeaders(),
			body: JSON.stringify(data),
		},
	);
	return handleResponse(res);
};

export const deleteQuizQuestion = async (
	quizId: number,
	questionId: number,
) => {
	const res = await fetch(
		`${API_BASE}/api/quizzes/${quizId}/questions/${questionId}`,
		{
			method: "DELETE",
			headers: getHeaders(),
		},
	);
	return res.ok ? {} : handleResponse(res);
};

export const submitQuizAttempt = async (
	quizId: number,
	nguoi_dung_id: number,
	answers: Array<{ questionId: number; answer: string }>,
) => {
	const res = await fetch(`${API_BASE}/api/quizzes/${quizId}/attempts`, {
		method: "POST",
		headers: getHeaders(),
		body: JSON.stringify({ nguoi_dung_id, answers }),
	});
	return handleResponse(res);
};

export const gradeQuizAttempt = async (
	quizId: number,
	attemptId: number,
	diem: number,
	nhan_xet?: string,
) => {
	const res = await fetch(
		`${API_BASE}/api/quizzes/${quizId}/attempts/${attemptId}/grade`,
		{
			method: "PATCH",
			headers: getHeaders(),
			body: JSON.stringify({ diem, nhan_xet }),
		},
	);
	return handleResponse(res);
};

// Assignments
export const getAssignments = async (userId?: number, courseId?: number) => {
	const query = new URLSearchParams();
	if (userId) query.set("userId", String(userId));
	if (courseId) query.set("courseId", String(courseId));
	const res = await fetch(`${API_BASE}/api/assignments?${query}`, {
		headers: getHeaders(),
	});
	return handleResponse(res);
};

export const submitAssignment = async (
	assignmentId: number,
	nguoi_dung_id: number,
	noi_dung: string,
	file_dinh_kem?: string,
) => {
	const res = await fetch(
		`${API_BASE}/api/assignments/${assignmentId}/submissions`,
		{
			method: "POST",
			headers: getHeaders(),
			body: JSON.stringify({ nguoi_dung_id, noi_dung, file_dinh_kem }),
		},
	);
	return handleResponse(res);
};

// Notifications
export const getNotifications = async (userId: number) => {
	const res = await fetch(`${API_BASE}/api/notifications/${userId}`);
	return handleResponse(res);
};

export const markNotificationRead = async (id: number) => {
	const res = await fetch(`${API_BASE}/api/notifications/${id}/read`, {
		method: "PATCH",
		headers: getHeaders(),
	});
	return handleResponse(res);
};

export const markAllNotificationsRead = async (userId: number) => {
	const res = await fetch(
		`${API_BASE}/api/notifications/users/${userId}/read-all`,
		{
			method: "PATCH",
			headers: getHeaders(),
		},
	);
	return handleResponse(res);
};

// Orders
export const getOrders = async (
	userId?: number,
	startDate?: string,
	endDate?: string,
) => {
	const query = new URLSearchParams();
	if (userId) query.set("userId", String(userId));
	if (startDate) query.set("startDate", startDate);
	if (endDate) query.set("endDate", endDate);
	const res = await fetch(`${API_BASE}/api/orders?${query}`, {
		headers: getHeaders(),
	});
	return handleResponse(res);
};

export const refundOrder = async (orderId: number) => {
	const res = await fetch(`${API_BASE}/api/orders/${orderId}/refund`, {
		method: "PATCH",
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
	const res = await fetch(
		`${API_BASE}/api/instructors/${instructorId}/students`,
	);
	return handleResponse(res);
};

export const getInstructorAnalytics = async (instructorId: number) => {
	const res = await fetch(
		`${API_BASE}/api/instructors/${instructorId}/analytics`,
	);
	return handleResponse(res);
};

// Cart
export const getCart = async () => {
	const res = await fetch(`${API_BASE}/api/cart`, {
		headers: getHeaders(),
	});
	return handleResponse(res);
};

export const addToCart = async (courseId: number) => {
	const res = await fetch(`${API_BASE}/api/cart`, {
		method: "POST",
		headers: getHeaders(),
		body: JSON.stringify({ khoa_hoc_id: courseId }),
	});
	return handleResponse(res);
};

export const removeFromCart = async (courseId: number) => {
	const res = await fetch(`${API_BASE}/api/cart/${courseId}`, {
		method: "DELETE",
		headers: getHeaders(),
	});
	return handleResponse(res);
};

export const clearCartApi = async () => {
	const res = await fetch(`${API_BASE}/api/cart`, {
		method: "DELETE",
		headers: getHeaders(),
	});
	return handleResponse(res);
};

// Checkout
export const checkout = async () => {
	const res = await fetch(`${API_BASE}/api/checkout`, {
		method: "POST",
		headers: getHeaders(),
	});
	return handleResponse(res);
};

export const getOrder = async (orderId: number) => {
	const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
		headers: getHeaders(),
	});
	return handleResponse(res);
};

export const payOrder = async (orderId: number, paymentMethod: string) => {
	const res = await fetch(`${API_BASE}/api/orders/${orderId}/pay`, {
		method: "POST",
		headers: getHeaders(),
		body: JSON.stringify({ payment_method: paymentMethod }),
	});
	return handleResponse(res);
};

export const getCommissionRate = async () => {
	const res = await fetch(`${API_BASE}/api/admin/commission`, {
		headers: getHeaders(),
	});
	return handleResponse(res);
};

export const updateCommissionRate = async (rate: number) => {
	const res = await fetch(`${API_BASE}/api/admin/commission`, {
		method: "PUT",
		headers: {
			...getHeaders(),
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ ty_le_hoa_hong: rate }),
	});
	return handleResponse(res);
};

export const getTeacherEarnings = async () => {
	const res = await fetch(`${API_BASE}/api/teacher/earnings`, {
		headers: getHeaders(),
	});
	return handleResponse(res);
};

export const getTeacherEarningsHistory = async () => {
	const res = await fetch(`${API_BASE}/api/teacher/earnings/history`, {
		headers: getHeaders(),
	});
	return handleResponse(res);
};

export const createPayoutRequest = async (
	amount: number,
	bankName: string,
	bankAccount: string,
) => {
	const res = await fetch(`${API_BASE}/api/teacher/payout-request`, {
		method: "POST",
		headers: {
			...getHeaders(),
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			so_tien: amount,
			ten_ngan_hang: bankName,
			so_tai_khoan: bankAccount,
		}),
	});
	return handleResponse(res);
};

export const getTeacherPayoutRequests = async () => {
	const res = await fetch(`${API_BASE}/api/teacher/payout-requests`, {
		headers: getHeaders(),
	});
	return handleResponse(res);
};

export const getAdminPayoutRequests = async () => {
	const res = await fetch(`${API_BASE}/api/admin/payout-requests`, {
		headers: getHeaders(),
	});
	return handleResponse(res);
};

export const approvePayoutRequest = async (id: number) => {
	const res = await fetch(
		`${API_BASE}/api/admin/payout-requests/${id}/approve`,
		{
			method: "PATCH",
			headers: getHeaders(),
		},
	);
	return handleResponse(res);
};

export const rejectPayoutRequest = async (id: number) => {
	const res = await fetch(
		`${API_BASE}/api/admin/payout-requests/${id}/reject`,
		{
			method: "PATCH",
			headers: getHeaders(),
		},
	);
	return handleResponse(res);
};

// Reviews
export const getCourseReviews = async (courseId: number) => {
	const res = await fetch(`${API_BASE}/api/courses/${courseId}/reviews`);
	return handleResponse(res);
};

export const createReview = async (
	khoa_hoc_id: number,
	danh_gia: number,
	binh_luan?: string,
) => {
	const res = await fetch(`${API_BASE}/api/reviews`, {
		method: "POST",
		headers: getHeaders(),
		body: JSON.stringify({ khoa_hoc_id, danh_gia, binh_luan }),
	});
	return handleResponse(res);
};

export const replyToReview = async (reviewId: number, phan_hoi: string) => {
	const res = await fetch(`${API_BASE}/api/reviews/${reviewId}`, {
		method: "PATCH",
		headers: getHeaders(),
		body: JSON.stringify({ phan_hoi }),
	});
	return handleResponse(res);
};

export const deleteReview = async (reviewId: number) => {
	const res = await fetch(`${API_BASE}/api/reviews/${reviewId}`, {
		method: "DELETE",
		headers: getHeaders(),
	});
	return handleResponse(res);
};

// Teacher Profile
export const getTeacherProfile = async (teacherId: number) => {
	const res = await fetch(`${API_BASE}/api/teachers/${teacherId}`);
	return handleResponse(res);
};

// User Profile
export const getUserProfile = async (userId: number) => {
	const res = await fetch(`${API_BASE}/api/users/${userId}`, {
		headers: getHeaders(),
	});
	return handleResponse(res);
};

export const updateUserProfile = async (userId: number, data: {
	ten?: string;
	ho?: string;
	email?: string;
	so_dien_thoai?: string;
	dia_chi?: string;
	gioi_thieu?: string;
	anh_dai_dien?: string;
}) => {
	const res = await fetch(`${API_BASE}/api/users/${userId}`, {
		method: "PATCH",
		headers: { ...getHeaders(), "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
	return handleResponse(res);
};

// Media Upload
export const uploadMedia = async (file: File, entityType: string = 'user', entityId?: number) => {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('entityType', entityType);
	if (entityId) formData.append('entityId', String(entityId));

	const res = await fetch(`${API_BASE}/api/media/upload`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
		body: formData,
	});
	return handleResponse(res);
};

export const uploadAvatar = async (file: File) => {
	return uploadMedia(file, 'user');
};

export const getMedia = async (params?: { entityType?: string; entityId?: number }) => {
	const query = new URLSearchParams();
	if (params?.entityType) query.set('entityType', params.entityType);
	if (params?.entityId) query.set('entityId', String(params.entityId));
	const res = await fetch(`${API_BASE}/api/media?${query}`, { headers: getHeaders() });
	return handleResponse(res);
};

export const deleteMedia = async (id: number) => {
	const res = await fetch(`${API_BASE}/api/media/${id}`, {
		method: 'DELETE',
		headers: getHeaders(),
	});
	return handleResponse(res);
};

export const getMediaByEntity = async (entityType: string, entityId: number) => {
	const res = await fetch(`${API_BASE}/api/media?entityType=${entityType}&entityId=${entityId}`, { headers: getHeaders() });
	return handleResponse(res);
};

export const getLessonResources = async (lessonId: number) => {
	const res = await fetch(`${API_BASE}/api/lessons/${lessonId}/resources`, { headers: getHeaders() });
	return handleResponse(res);
};

export const uploadLessonResource = async (lessonId: number, file: File) => {
	const formData = new FormData();
	formData.append('file', file);
	const res = await fetch(`${API_BASE}/api/lessons/${lessonId}/resources`, {
		method: 'POST',
		headers: { 'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '' },
		body: formData,
	});
	return handleResponse(res);
};

export const deleteLessonResource = async (resourceId: number) => {
	const res = await fetch(`${API_BASE}/api/lessons/resources/${resourceId}`, {
		method: 'DELETE',
		headers: getHeaders(),
	});
	return handleResponse(res);
};
