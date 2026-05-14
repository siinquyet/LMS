import axios from "axios";

const API_BASE = "";

export const axiosClient = axios.create({
	baseURL: API_BASE,
	headers: {
		"Content-Type": "application/json",
	},
});

axiosClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

const SAFE_FALLBACKS: Record<string, unknown> = {
	"/api/courses": { courses: [], total: 0, page: 1, totalPages: 0 },
	"/api/courses/": { course: null },
	"/api/courses/-/reviews": { danh_gia: [], thong_tin: { trung_binh_xep_hang: 0, tong_danh_gia: 0 } },
	"/api/categories": { categories: [] },
	"/api/my-enrollments": { enrollments: [] },
	"/api/cart": { items: [], tong_tien: 0 },
	"/api/orders": { orders: [] },
	"/api/assignments": { assignments: [] },
	"/api/notifications/-": { notifications: [] },
	"/api/users": { users: [] },
	"/api/quizzes/-": { quiz: null },
	"/api/quizzes/-/questions": { cau_hoi: [] },
	"/api/quizzes/-/attempts": { lich_su: [], diem_cao_nhat: 0, so_lan_lam: 0 },
	"/api/forum/topics": { topics: [] },
	"/api/forum/posts": { posts: [] },
	"/api/forum/categories": { categories: [] },
	"/api/instructors": { instructors: [] },
	"/api/admin/overview": {
		overview: {
			tong_nguoi_dung: 0,
			tong_khoa_hoc: 0,
			tong_don_hang: 0,
			tong_doanh_thu: 0,
		},
	},
	"/api/teacher/courses": { courses: [] },
	"/api/teacher/earnings": { earnings: { tong_doanh_thu: 0, tong_rut_tien: 0, so_du: 0 }, history: [] },
	"/api/teacher/payout-requests": { requests: [] },
	"/api/admin/payout-requests": { requests: [] },
};

function getFallback(url: string): unknown {
	for (const pattern of Object.keys(SAFE_FALLBACKS)) {
		if (url.includes(pattern.replace("/-/", "/"))) {
			return SAFE_FALLBACKS[pattern];
		}
	}
	return {};
}

axiosClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response) {
			const status = error.response.status;
			const url = error.config?.url || "";

			if (status === 500 || status === 502 || status === 503) {
				console.warn(`[Axios Interceptor] 500 error on ${url}, returning safe fallback`);

				const fallback = getFallback(url);

				return Promise.resolve({
					data: fallback,
					status: 200,
					statusText: "OK (fallback)",
					headers: {},
					config: error.config,
				});
			}

			if (status === 401) {
				localStorage.removeItem("token");
				localStorage.removeItem("refreshToken");
				localStorage.removeItem("user");
				window.dispatchEvent(new CustomEvent("auth:expired"));
			}
		}

		return Promise.reject(error);
	}
);

export default axiosClient;