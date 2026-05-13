import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Select, type SelectOption } from "./Select";
import { Button } from "./Button";
import { Switch } from "./Switch";
import { VideoUpload } from "./VideoUpload";
import { ResourceUploader } from "./ResourceUploader";
import { Loader } from "./Loader";
import {
	Video,
	FileText,
	HelpCircle,
	Clipboard,
	Save,
	Trash2,
} from "lucide-react";
import {
	getLessonResources,
	uploadLessonResource,
	deleteLessonResource,
} from "../../api";

export interface LessonEditorData {
	id?: number;
	chapterId: number;
	tieu_de: string;
	loai: "video" | "document" | "quiz" | "exercise";
	thoi_luong?: string;
	video_url?: string;
	noi_dung?: string;
	preview_content?: string;
	thu_tu?: number;
}

export interface LessonEditorProps {
	open: boolean;
	onClose: () => void;
	lesson?: LessonEditorData;
	onSave: (data: Partial<LessonEditorData>, chapterId: number) => Promise<void>;
	onDelete?: (lessonId: number) => Promise<void>;
}

const lessonTypes: SelectOption[] = [
	{ value: "video", label: "Video bài giảng" },
	{ value: "document", label: "Tài liệu" },
	{ value: "quiz", label: "Bài kiểm tra" },
	{ value: "exercise", label: "Bài tập" },
];

export const LessonEditor: React.FC<LessonEditorProps> = ({
	open,
	onClose,
	lesson,
	onSave,
	onDelete,
}) => {
	const [loading, setLoading] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [form, setForm] = useState({
		tieu_de: "",
		loai: "video" as LessonEditorData["loai"],
		thoi_luong: "",
		video_url: "",
		noi_dung: "",
		preview_content: "",
	});
	const [resources, setResources] = useState<any[]>([]);
	const [uploading, setUploading] = useState(false);

	const isEdit = !!lesson?.id;

	useEffect(() => {
		if (open) {
			if (lesson) {
				setForm({
					tieu_de: lesson.tieu_de || "",
					loai: lesson.loai || "video",
					thoi_luong: lesson.thoi_luong || "",
					video_url: lesson.video_url || "",
					noi_dung: lesson.noi_dung || "",
					preview_content: lesson.preview_content || "",
				});
				if (lesson.id) {
					loadResources(lesson.id);
				}
			} else {
				setForm({
					tieu_de: "",
					loai: "video",
					thoi_luong: "",
					video_url: "",
					noi_dung: "",
					preview_content: "",
				});
				setResources([]);
			}
		}
	}, [open, lesson]);

	const loadResources = async (lessonId: number) => {
		try {
			const data = await getLessonResources(lessonId);
			setResources(data.media || data || []);
		} catch (e) {
			window.dispatchEvent(new CustomEvent("app:error", { detail: { source: "LessonEditor", message: "Tải tài liệu bài học thất bại", status: 0 } }));
			setResources([]);
		}
	};

	const handleUploadResource = async (file: File) => {
		if (!lesson?.id) return;
		setUploading(true);
		try {
			const data = await uploadLessonResource(lesson.id, file);
			setResources((prev) => [...prev, data.media || data]);
		} catch (e) {
			window.dispatchEvent(new CustomEvent("app:error", { detail: { source: "LessonEditor", message: "Tải tài nguyên bài học thất bại", status: 0 } }));
		} finally {
			setUploading(false);
		}
	};

	const handleDeleteResource = async (mediaId: number) => {
		if (!lesson?.id) return;
		try {
			await deleteLessonResource(lesson.id, mediaId);
			setResources((prev) => prev.filter((r) => r.id !== mediaId));
		} catch (e) {
			window.dispatchEvent(new CustomEvent("app:error", { detail: { source: "LessonEditor", message: "Xóa tài nguyên bài học thất bại", status: 0 } }));
		}
	};

	const handleSave = async () => {
		if (!form.tieu_de.trim()) {
			alert("Vui lòng nhập tiêu đề bài học");
			return;
		}
		if (lesson?.loai === "video" && !form.video_url) {
			alert("Vui lòng tải lên video bài giảng");
			return;
		}

		setLoading(true);
		try {
			await onSave(form, lesson?.chapterId || 0);
			onClose();
		} catch (e) {
			alert("Lưu thất bại: " + (e as Error).message);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async () => {
		if (!lesson?.id || !onDelete) return;
		if (!confirm("Xóa bài học này? Hành động này không thể hoàn tác.")) return;
		setDeleting(true);
		try {
			await onDelete(lesson.id);
			onClose();
		} catch (e) {
			alert("Xóa thất bại: " + (e as Error).message);
		} finally {
			setDeleting(false);
		}
	};

	const typeIcon = {
		video: <Video className="w-4 h-4" />,
		document: <FileText className="w-4 h-4" />,
		quiz: <HelpCircle className="w-4 h-4" />,
		exercise: <Clipboard className="w-4 h-4" />,
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={isEdit ? "Sửa bài học" : "Thêm bài học"}
			size="xl"
			footer={
				<>
					{isEdit && onDelete && (
						<Button
							variant="danger"
							size="sm"
							onClick={handleDelete}
							disabled={deleting}
							className="mr-auto"
						>
							{deleting ? <Loader size="sm" /> : <Trash2 className="w-4 h-4" />}
							Xóa
						</Button>
					)}
					<Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
						Hủy
					</Button>
					<Button
						variant="primary"
						size="sm"
						onClick={handleSave}
						disabled={loading}
					>
						{loading ? <Loader size="sm" /> : <Save className="w-4 h-4" />}
						{isEdit ? "Cập nhật" : "Tạo mới"}
					</Button>
				</>
			}
		>
			<div className="space-y-5">
				<div className="grid grid-cols-2 gap-4">
					<Input
						label="Tiêu đề bài học"
						placeholder="Nhập tiêu đề bài học"
						value={form.tieu_de}
						onChange={(v) => setForm((f) => ({ ...f, tieu_de: v }))}
					/>
					<Select
						label="Loại bài học"
						options={lessonTypes}
						value={form.loai}
						onChange={(v) =>
							setForm((f) => ({ ...f, loai: v as LessonEditorData["loai"] }))
						}
						disabled={isEdit}
					/>
				</div>

				{(form.loai === "video" || form.loai === "document") && (
					<div>
						<label className="block font-semibold text-[#1C293C] text-[15px] mb-2">
							Nội dung bài học
						</label>
						{form.loai === "video" ? (
							<VideoUpload
								value={form.video_url}
								onChange={(url) =>
									setForm((f) => ({ ...f, video_url: url }))
								}
							/>
						) : (
							<Textarea
								placeholder="Nhập nội dung tài liệu (Markdown hoặc HTML)..."
								value={form.noi_dung}
								onChange={(e) =>
									setForm((f) => ({
										...f,
										noi_dung: (e.target as any).value,
									}))
								}
								rows={8}
							/>
						)}
					</div>
				)}

				{(form.loai === "quiz" || form.loai === "exercise") && (
					<div>
						<label className="block font-semibold text-[#1C293C] text-[15px] mb-2">
							Nội dung bài {form.loai === "quiz" ? "kiểm tra" : "tập"}
						</label>
						<Textarea
							placeholder={`Nhập nội dung bài ${form.loai === "quiz" ? "kiểm tra" : "tập"}...`}
							value={form.noi_dung}
							onChange={(e) =>
								setForm((f) => ({
									...f,
									noi_dung: (e.target as any).value,
								}))
							}
							rows={6}
						/>
					</div>
				)}

				{form.loai !== "document" && (
					<Input
						label="Thời lượng"
						placeholder="VD: 15 phút"
						value={form.thoi_luong}
						onChange={(v) => setForm((f) => ({ ...f, thoi_luong: v }))}
					/>
				)}

				<div className="border-[3px] border-dashed border-[#1C293C] p-4 rounded-lg space-y-3">
					<div className="flex items-center gap-2">
						<FileText className="w-4 h-4 text-[#1C293C]" />
						<span className="font-semibold text-[#1C293C] text-[15px]">
							Tài liệu đính kèm
						</span>
					</div>
					<ResourceUploader
						resources={resources}
						onUpload={handleUploadResource}
						onDelete={handleDeleteResource}
						uploading={uploading}
					/>
				</div>

				<Switch
					checked={!!form.preview_content}
					onChange={(v) =>
						setForm((f) => ({
							...f,
							preview_content: v ? f.tieu_de : "",
						}))
					}
					label="Cho phép xem trước (preview)"
				/>
			</div>
		</Modal>
	);
};

export default LessonEditor;