import { useCallback, useEffect, useState } from "react";
import {
	Plus,
	Trash2,
	Clock,
	MessageSquare,
	ChevronRight,
	Save,
	X,
} from "lucide-react";
import { Avatar } from "./Avatar";
import { Card } from "./Card";
import { Button } from "./Button";
import { Textarea } from "./Textarea";
import { formatSeconds } from "../../utils/format";
import { useToast } from "./Toast";

interface Note {
	id: number;
	bai_hoc_id: number;
	noi_dung: string;
	thoi_diem: number | null;
	ngay_tao: string;
}

export type { Note };

interface NoteListProps {
	lessonId: number;
	videoRef?: React.RefObject<HTMLVideoElement>;
	onNotesChange?: (notes: Note[]) => void;
}

export const NoteList: React.FC<NoteListProps> = ({
	lessonId,
	videoRef,
	onNotesChange,
}) => {
	const { addToast } = useToast();
	const [notes, setNotes] = useState<Note[]>([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [newContent, setNewContent] = useState("");
	const [currentTimestamp, setCurrentTimestamp] = useState<number | null>(null);

	const fetchNotes = useCallback(async () => {
		try {
			const res = await fetch(`/api/lessons/${lessonId}/notes`, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});
			const data = await res.json();
			setNotes(data.ghi_chu || []);
			onNotesChange?.(data.ghi_chu || []);
		} catch (error) {
			addToast("error", `[NoteList] Tải ghi chú thất bại`);
		} finally {
			setLoading(false);
		}
	}, [lessonId, onNotesChange]);

	useEffect(() => {
		fetchNotes();
	}, [fetchNotes]);

	const handleSeekToNote = (note: Note) => {
		if (note.thoi_diem != null && videoRef?.current) {
			videoRef.current.currentTime = note.thoi_diem;
			videoRef.current.play();
		}
	};

	const handleAddNote = async () => {
		if (!newContent.trim()) return;

		try {
			const res = await fetch(`/api/lessons/${lessonId}/notes`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({
					noi_dung: newContent.trim(),
					thoi_diem: currentTimestamp,
				}),
			});

			if (res.ok) {
				const data = await res.json();
				setNotes((prev) => [data.ghi_chu, ...prev]);
				setNewContent("");
				setShowForm(false);
				setCurrentTimestamp(null);
			} else {
				const data = await res.json().catch(() => ({}));
				addToast("error", `[NoteList] Thêm ghi chú thất bại: ${data.error || ''}`);
			}
		} catch (error) {
			addToast("error", `[NoteList] Thêm ghi chú thất bại`);
		}
	};

	const handleDeleteNote = async (noteId: number) => {
		try {
			const res = await fetch(`/api/notes/${noteId}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});

			if (res.ok) {
				setNotes((prev) => prev.filter((n) => n.id !== noteId));
			}
		} catch (error) {
			addToast("error", `[NoteList] Xóa ghi chú thất bại`);
		}
	};

	const captureTimestamp = () => {
		if (videoRef?.current) {
			setCurrentTimestamp(Math.floor(videoRef.current.currentTime));
		}
	};

	const openAddForm = () => {
		captureTimestamp();
		setShowForm(true);
	};

	if (loading) {
		return (
			<div className="p-4 text-center text-gray-500">
				<div className="animate-pulse">Đang tải ghi chú...</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full bg-white">
			<div className="p-4 border-b-2 border-[#1C293C]">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<MessageSquare className="w-5 h-5 text-[#1C293C]" />
						<h3 className="font-semibold text-[#1C293C] font-['Inter',sans-serif]">
							Ghi chú ({notes.length})
						</h3>
					</div>
					<button
						onClick={openAddForm}
						className="p-2 bg-[#1C293C] text-white rounded-[8px] hover:bg-[#2a3a4d] transition-colors"
						title="Thêm ghi chú"
					>
						<Plus className="w-4 h-4" />
					</button>
				</div>
			</div>

			{showForm && (
				<div className="p-4 border-b-2 border-[#E5E1DC] bg-[#FBFBF9]">
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<button
								onClick={captureTimestamp}
								className="px-3 py-1.5 text-xs bg-[#FDC800] text-[#1C293C] rounded-[6px] font-medium hover:bg-[#e6c400] transition-colors flex items-center gap-1"
							>
								<Clock className="w-3 h-3" />
								{currentTimestamp != null
									? formatSeconds(currentTimestamp)
									: "Lấy thời điểm"}
							</button>
							{currentTimestamp != null && (
								<span className="text-xs text-gray-500 font-medium">
									{formatSeconds(currentTimestamp)}
								</span>
							)}
						</div>
						<Textarea
							value={newContent}
							onChange={(e) => setNewContent(e.target.value)}
							placeholder="Viết ghi chú của bạn..."
							className="min-h-[80px] font-['Inter',sans-serif] text-sm resize-none"
						/>
						<div className="flex gap-2 justify-end">
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									setShowForm(false);
									setNewContent("");
									setCurrentTimestamp(null);
								}}
							>
								Hủy
							</Button>
							<Button
								variant="primary"
								size="sm"
								onClick={handleAddNote}
								disabled={!newContent.trim()}
							>
								<Save className="w-3 h-3 mr-1" />
								Lưu
							</Button>
						</div>
					</div>
				</div>
			)}

			<div className="flex-1 overflow-y-auto p-3 space-y-2">
				{notes.length === 0 ? (
					<div className="text-center py-8">
						<MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
						<p className="text-sm text-gray-400 font-['Inter',sans-serif]">
							Chưa có ghi chú nào
						</p>
						<p className="text-xs text-gray-400 mt-1">
							Nhấn + để thêm ghi chú gắn với thời điểm video
						</p>
					</div>
				) : (
					notes.map((note) => (
						<div
							key={note.id}
							className="group relative p-3 bg-white border-2 border-[#E5E1DC] rounded-[8px] hover:border-[#1C293C] transition-colors cursor-pointer"
							onClick={() => handleSeekToNote(note)}
						>
							<div className="flex items-start justify-between gap-2">
								<div className="flex-1 min-w-0">
									{note.thoi_diem != null && (
										<div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#49B6E5]/10 text-[#49B6E5] rounded-[4px] text-xs font-medium mb-2">
											<Clock className="w-3 h-3" />
											{formatSeconds(note.thoi_diem)}
										</div>
									)}
									<p className="text-sm text-[#1C293C] font-['Inter',sans-serif] leading-relaxed whitespace-pre-wrap">
										{note.noi_dung}
									</p>
									<p className="text-xs text-gray-400 mt-2">
										{new Date(note.ngay_tao).toLocaleDateString("vi-VN", {
											day: "2-digit",
											month: "2-digit",
											hour: "2-digit",
											minute: "2-digit",
										})}
									</p>
								</div>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleDeleteNote(note.id);
									}}
									className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-[6px] opacity-0 group-hover:opacity-100 transition-all"
								>
									<Trash2 className="w-4 h-4" />
								</button>
							</div>
							<ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default NoteList;