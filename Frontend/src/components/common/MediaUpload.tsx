import type React from "react";
import { useRef, useState } from "react";
import { uploadMedia } from "../../api";
import { Loader } from "./Loader";

export interface MediaUploadProps {
	value?: string;
	onChange: (url: string) => void;
	accept?: string;
	placeholder?: string;
	className?: string;
	entityType?: string;
	entityId?: number;
	maxSizeMB?: number;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
	value,
	onChange,
	accept = "image/*,video/*",
	placeholder = "Nhấn để tải file lên",
	className = "",
	entityType = "course",
	entityId,
	maxSizeMB = 500,
}) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const getMediaUrl = (url: string) => {
		if (!url) return "";
		if (url.startsWith("http") || url.startsWith("data:")) return url;
		return url;
	};

	const isVideo = (url: string) => {
		return url.match(/\.(mp4|mov|avi|webm|mkv)$/i) || url.includes("video");
	};

	const isImage = (url: string) => {
		return url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) || url.includes("image") || (!isVideo(url) && !url.startsWith("blob:"));
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > maxSizeMB * 1024 * 1024) {
			setError(`File quá lớn. Tối đa ${maxSizeMB}MB`);
			return;
		}

		setError(null);
		setUploading(true);

		try {
			const data = await uploadMedia(file, entityType, entityId);
			if (data.success && data.url) {
				onChange(data.url);
			}
		} catch (err) {
			console.error("Upload failed:", err);
			setError("Tải file thất bại");
		} finally {
			setUploading(false);
		}

		if (inputRef.current) inputRef.current.value = "";
	};

	const renderPreview = () => {
		if (!value) return null;

		if (value.startsWith("blob:")) {
			if (isVideo(value)) {
				return <video src={value} className="w-full h-full object-cover" />;
			}
			return <img src={value} alt="Preview" className="w-full h-full object-cover" />;
		}

		if (isVideo(value)) {
			return (
				<video
					src={getMediaUrl(value)}
					className="w-full h-full object-cover"
					controls
				/>
			);
		}

		return (
			<img
				src={getMediaUrl(value)}
				alt="Preview"
				className="w-full h-full object-cover"
			/>
		);
	};

	return (
		<div className={className}>
			<input
				ref={inputRef}
				type="file"
				accept={accept}
				onChange={handleFileChange}
				className="hidden"
			/>
			<div
				onClick={() => !uploading && inputRef.current?.click()}
				className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-colors ${
					uploading
						? "border-gray-300 bg-gray-50"
						: "border-[#263D5B] hover:bg-gray-50"
				}`}
			>
				{uploading ? (
					<Loader />
				) : value ? (
					renderPreview()
				) : (
					<>
						<span className="text-3xl text-[#263D5B]">+</span>
						<span className="text-sm text-gray-500 mt-1 font-['Comfortaa', cursive]">
							{placeholder}
						</span>
					</>
				)}
			</div>
			{error && <p className="text-xs text-red-500 mt-1">{error}</p>}
			{value && (
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onChange("");
					}}
					className="text-xs text-red-500 hover:underline mt-1"
				>
					Xóa
				</button>
			)}
		</div>
	);
};

export default MediaUpload;