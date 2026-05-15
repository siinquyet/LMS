import { useState, useRef } from "react";
import { uploadMedia } from "../../api";
import { Loader } from "./Loader";
import { Video, X, Upload, FileText } from "lucide-react";

export interface VideoUploadProps {
	value?: string;
	onChange: (url: string) => void;
	onDurationChange?: (duration: string) => void;
	thumbnail?: string;
	onThumbnailChange?: (url: string) => void;
	documents?: string[];
	onDocumentsChange?: (urls: string[]) => void;
	className?: string;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
	value,
	onChange,
	onDurationChange,
	thumbnail,
	onThumbnailChange,
	documents = [],
	onDocumentsChange,
	className = "",
}) => {
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const videoInputRef = useRef<HTMLInputElement>(null);
	const docInputRef = useRef<HTMLInputElement>(null);

	const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > 500 * 1024 * 1024) {
			alert("Video quá lớn. Giới hạn: 500MB");
			return;
		}

		const allowedTypes = ["video/mp4", "video/webm", "video/ogg", "video/mov", "video/avi"];
		if (!allowedTypes.includes(file.type)) {
			alert("Định dạng không được hỗ trợ. Sử dụng MP4, WebM, OGG, MOV, AVI");
			return;
		}

		setUploading(true);
		setProgress(0);

		try {
			const data = await uploadMedia(file, "lesson");
			if (data.url) {
				onChange(data.url);
				
				// Auto-extract video duration
				const videoUrl = data.url.startsWith('http') ? data.url : `${window.location.origin}${data.url}`;
				const video = document.createElement('video');
				video.preload = 'metadata';
				video.onloadedmetadata = () => {
					const duration = video.duration;
					const minutes = Math.floor(duration / 60);
					const seconds = Math.floor(duration % 60);
					const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
					if (onDurationChange) {
						onDurationChange(formattedDuration);
					}
					URL.revokeObjectURL(video.src);
				};
				video.onerror = () => {
					URL.revokeObjectURL(video.src);
				};
				video.src = videoUrl;
			}
		} catch (err: any) {
			console.error("Upload failed:", err);
			alert(err.message || "Tải video thất bại");
		} finally {
			setUploading(false);
			setProgress(0);
		}
	};

	const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		setUploading(true);

		try {
			const uploadedUrls: string[] = [];
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				if (file.size > 50 * 1024 * 1024) {
					alert(`File ${file.name} quá lớn. Giới hạn: 50MB`);
					continue;
				}

				const data = await uploadMedia(file, "lesson");
				if (data.url) {
					uploadedUrls.push(data.url);
				}
			}

			if (onDocumentsChange) {
				onDocumentsChange([...documents, ...uploadedUrls]);
			}
		} catch (err: any) {
			console.error("Upload failed:", err);
			alert(err.message || "Tải tài liệu thất bại");
		} finally {
			setUploading(false);
		}
	};

	const getFileName = (url: string) => {
		return url.split("/").pop() || "file";
	};

	const removeDoc = (index: number) => {
		if (onDocumentsChange) {
			onDocumentsChange(documents.filter((_, i) => i !== index));
		}
	};

	return (
		<div className={className}>
			<input
				ref={videoInputRef}
				type="file"
				accept="video/mp4,video/webm,video/ogg,video/mov,video/avi"
				onChange={handleVideoUpload}
				className="hidden"
			/>
			<input
				ref={docInputRef}
				type="file"
				accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
				multiple
				onChange={handleDocUpload}
				className="hidden"
			/>

			{!value ? (
				<div
					onClick={() => videoInputRef.current?.click()}
					className="w-full h-40 border-2 border-dashed border-[#263D5B] rounded-lg cursor-pointer hover:bg-gray-50 flex flex-col items-center justify-center"
				>
					{uploading ? (
						<>
							<Loader size="md" />
							<span className="text-sm text-gray-500 mt-2">Đang tải video... {progress}%</span>
						</>
					) : (
						<>
							<Upload className="w-10 h-10 text-[#263D5B]" />
							<span className="text-sm text-gray-500 mt-2">Nhấn để tải video lên (max 500MB)</span>
						</>
					)}
				</div>
			) : (
				<div className="space-y-3">
					<div className="relative rounded-lg overflow-hidden bg-black">
						<video
							src={value}
							className="w-full h-48 object-contain"
							controls
						/>
						<button
							type="button"
							onClick={() => onChange("")}
							className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
						>
							<X className="w-4 h-4" />
						</button>
					</div>

					<div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
						<div className="flex items-center justify-between mb-3">
							<span className="font-medium text-sm">Tài liệu đính kèm</span>
							<button
								type="button"
								onClick={() => docInputRef.current?.click()}
								className="text-sm text-blue-600 hover:underline"
								disabled={uploading}
							>
								+ Thêm tài liệu
							</button>
						</div>

						{documents.length > 0 && (
							<div className="space-y-2 mb-3">
								{documents.map((url, idx) => (
									<div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
										<div className="flex items-center gap-2">
											<FileText className="w-4 h-4 text-gray-500" />
											<span className="text-sm truncate max-w-[200px]">
												{getFileName(url)}
											</span>
										</div>
										<button
											type="button"
											onClick={() => removeDoc(idx)}
											className="text-red-500 hover:text-red-700"
										>
											<X className="w-4 h-4" />
										</button>
									</div>
								))}
							</div>
						)}

						{uploading && (
							<div className="text-sm text-gray-500">Đang tải tài liệu...</div>
						)}

						<p className="text-xs text-gray-400">PDF, DOC, TXT, PPT (max 50MB/file)</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default VideoUpload;