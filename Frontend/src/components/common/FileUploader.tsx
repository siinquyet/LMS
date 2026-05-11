import { File, FileText, Image, Upload, X } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";

export interface FileUploaderProps {
	accept?: string;
	multiple?: boolean;
	maxSize?: number;
	maxFiles?: number;
	onUpload?: (files: File[]) => void;
	label?: string;
	error?: string;
	className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
	accept,
	multiple = false,
	maxSize = 5 * 1024 * 1024,
	maxFiles = 5,
	onUpload,
	label,
	error,
	className = "",
}) => {
	const [files, setFiles] = useState<File[]>([]);
	const [dragOver, setDragOver] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFiles = (newFiles: FileList | null) => {
		if (!newFiles) return;

		const fileArray = Array.from(newFiles);

		if (files.length + fileArray.length > maxFiles) {
			return;
		}

		const validFiles = fileArray.filter((file) => file.size <= maxSize);

		setFiles((prev) => [...prev, ...validFiles]);
		onUpload?.([...files, ...validFiles]);
	};

	const removeFile = (index: number) => {
		const newFiles = files.filter((_, i) => i !== index);
		setFiles(newFiles);
		onUpload?.(newFiles);
	};

	const getIcon = (type: string) => {
		if (type.startsWith("image/"))
			return <Image className="w-8 h-8 text-[#432DD7]" />;
		if (type.startsWith("text/"))
			return <FileText className="w-8 h-8 text-[#D97706]" />;
		return <File className="w-8 h-8 text-[#6B7280]" />;
	};

	return (
		<div className={`flex flex-col gap-2 ${className}`}>
			{label && (
				<label className="font-semibold text-[#1C293C] text-[15px]">
					{label}
				</label>
			)}
			<div
				onClick={() => inputRef.current?.click()}
				onDragOver={(e) => {
					e.preventDefault();
					setDragOver(true);
				}}
				onDragLeave={() => setDragOver(false)}
				onDrop={(e) => {
					e.preventDefault();
					setDragOver(false);
					handleFiles(e.dataTransfer.files);
				}}
				className={`
          border-[3px] border-dashed
          ${dragOver ? "border-[#432DD7] bg-[#E8F6FC]" : "border-[#1C293C] bg-white"}
          p-8 text-center cursor-pointer
          hover:border-[#432DD7] hover:bg-[#FBFBF9]
          transition-all duration-150
        `}
			>
				<Upload className="w-10 h-10 text-[#6B7280] mx-auto mb-3" />
				<p className="text-[15px] font-semibold text-[#1C293C] mb-1">
					Click to upload or drag and drop
				</p>
				<p className="text-[13px] text-[#6B7280]">
					{accept ? `Accepted: ${accept}` : "Any file"} (max{" "}
					{maxSize / 1024 / 1024}MB)
				</p>
				<input
					ref={inputRef}
					type="file"
					accept={accept}
					multiple={multiple}
					className="hidden"
					onChange={(e) => handleFiles(e.target.files)}
				/>
			</div>

			{error && <p className="text-[#DC2626] text-[13px]">{error}</p>}

			{files.length > 0 && (
				<div className="mt-4 space-y-2">
					{files.map((file, index) => (
						<div
							key={index}
							className="flex items-center gap-3 p-3 bg-white border-[3px] border-[#1C293C] shadow-[4px_4px_0_#1C293C]"
						>
							{getIcon(file.type)}
							<span className="flex-1 text-[15px] font-semibold text-[#1C293C] truncate">
								{file.name}
							</span>
							<span className="text-[13px] text-[#6B7280]">
								{(file.size / 1024).toFixed(1)}KB
							</span>
							<button
								type="button"
								onClick={() => removeFile(index)}
								className="p-1 text-[#6B7280] hover:text-[#DC2626]"
							>
								<X className="w-4 h-4" />
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default FileUploader;
