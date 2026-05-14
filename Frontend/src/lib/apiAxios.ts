import { axiosClient } from "./axiosClient";

export const apiAxios = {
	get: <T = unknown>(url: string, params?: Record<string, unknown>) =>
		axiosClient.get<T>(url, { params }),

	post: <T = unknown>(url: string, data?: unknown) =>
		axiosClient.post<T>(url, data),

	patch: <T = unknown>(url: string, data?: unknown) =>
		axiosClient.patch<T>(url, data),

	delete: <T = unknown>(url: string) =>
		axiosClient.delete<T>(url),
};

export default apiAxios;