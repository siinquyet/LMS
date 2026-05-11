import { useCallback, useState } from "react";
import * as api from "../api";

export interface Course {
	id: number;
	tieu_de: string;
	mo_ta: string;
	gia: number;
	muc_do: string;
	danh_muc_id: number;
	thoi_luong: string;
	thumbnail: string;
	trang_thai: "draft" | "pending" | "approved" | "rejected";
	so_luong_da_dang_ky: number;
	xep_hang: number;
	so_luong_toi_da?: number;
	chapters?: any[];
}

export function useCourse(courseId: number, isNewCourse = false) {
	const [course, setCourse] = useState<Course | null>(null);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadCourse = useCallback(async () => {
		console.log("[DEBUG-loadCourse] courseId:", courseId, "isNewCourse:", isNewCourse);
		
		if (isNewCourse) {
			setCourse({
				id: 0,
				tieu_de: "",
				mo_ta: "",
				gia: 0,
				muc_do: "",
				danh_muc_id: 0,
				thoi_luong: "",
				thumbnail: "",
				trang_thai: "draft",
				so_luong_da_dang_ky: 0,
				xep_hang: 0,
			});
			return;
		}
		
		if (!courseId || isNaN(courseId)) {
			console.error("[DEBUG-loadCourse] Invalid courseId:", courseId);
			setError("ID khóa học không hợp lệ");
			return;
		}
		
		setLoading(true);
		setError(null);
		try {
			console.log("[DEBUG-loadCourse] Calling API with courseId:", courseId);
			const { course: data } = await api.getTeacherCourse(courseId);
			console.log("[DEBUG-loadCourse] API response:", data);
			setCourse(data);
		} catch (e: any) {
			console.error("[DEBUG-loadCourse] Error:", {
				message: e?.message,
				status: e?.status,
				response: e?.response,
			});
			setError((e as Error).message || "Không tải được khóa học");
		} finally {
			setLoading(false);
		}
	}, [courseId, isNewCourse]);

	const updateCourse = useCallback(
		async (updates: Partial<Course>) => {
			setSaving(true);
			try {
				await api.updateCourse(courseId, updates);
				setCourse((prev) => (prev ? { ...prev, ...updates } : null));
			} catch (e) {
				alert("Lưu thất bại: " + (e as Error).message);
				throw e;
			} finally {
				setSaving(false);
			}
		},
		[courseId],
	);

	const saveCourse = useCallback(
		async (courseData: Course) => {
			if (isNewCourse) {
				setSaving(true);
				try {
					const { course: data } = await api.createCourse(courseData as unknown as Record<string, unknown>);
					setCourse(data);
					alert("Tạo khóa học thành công!");
				} catch (e) {
					alert("Tạo thất bại: " + (e as Error).message);
					throw e;
				} finally {
					setSaving(false);
				}
			} else {
				return updateCourse(courseData as Partial<Course>);
			}
		},
		[isNewCourse, updateCourse],
	);

	const submitForApproval = useCallback(async () => {
		try {
			await api.submitCourse(courseId);
			setCourse((prev) => (prev ? { ...prev, trang_thai: "pending" } : null));
			alert("Đã gửi khóa học để duyệt!");
		} catch (e) {
			alert("Gửi thất bại: " + (e as Error).message);
			throw e;
		}
	}, [courseId]);

	const revertToDraft = useCallback(async () => {
		try {
			await api.updateCourse(courseId, { trang_thai: "draft" });
			setCourse((prev) => (prev ? { ...prev, trang_thai: "draft" } : null));
			alert("Đã chuyển về bản nháp");
		} catch (e) {
			alert("Thất bại: " + (e as Error).message);
			throw e;
		}
	}, [courseId]);

	const setCourseField = useCallback(
		<K extends keyof Course>(field: K, value: Course[K]) => {
			setCourse((prev) => (prev ? { ...prev, [field]: value } : null));
		},
		[],
	);

	return {
		course,
		loading,
		saving,
		error,
		loadCourse,
		saveCourse,
		updateCourse,
		submitForApproval,
		revertToDraft,
		setCourseField,
	};
}
