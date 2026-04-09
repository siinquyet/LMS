import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Image, File } from 'lucide-react';

export interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  onUpload?: (files: File[]) => void;
  className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  accept,
  multiple = false,
  maxSize = 5 * 1024 * 1024,
  maxFiles = 5,
  onUpload,
  className = '',
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    setError('');

    const fileArray = Array.from(newFiles);
    
    if (files.length + fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles = fileArray.filter((file) => {
      if (file.size > maxSize) {
        setError(`File "${file.name}" is too large (max ${maxSize / 1024 / 1024}MB)`);
        return false;
      }
      return true;
    });

    setFiles((prev) => [...prev, ...validFiles]);
    onUpload?.([...files, ...validFiles]);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onUpload?.(newFiles);
  };

  const getIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-8 h-8 text-[#49B6E5]" />;
    if (type.startsWith('text/')) return <FileText className="w-8 h-8 text-[#D97706]" />;
    return <File className="w-8 h-8 text-[#6B7280]" />;
  };

  return (
    <div className={className}>
      <div
        onClick={() => inputRef.current?.click()}
        className="
          border-2 border-dashed border-[#263D5B] rounded-[12px]
          p-8 text-center cursor-pointer
          hover:bg-[#F8F6F3] hover:border-[#49B6E5]
          transition-colors
        "
      >
        <Upload className="w-10 h-10 text-[#6B7280] mx-auto mb-3" />
        <p className="font-['Comfortaa', cursive] text-[#263D5B] mb-1">
          Click to upload or drag and drop
        </p>
        <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">
          {accept ? `Accepted: ${accept}` : 'Any file'} (max {maxSize / 1024 / 1024}MB)
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

      {error && (
        <p className="mt-2 font-['Comfortaa', cursive] text-sm text-[#DC2626]">
          ✏️ {error}
        </p>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="
                flex items-center gap-3 p-3
                bg-white border-2 border-[#263D5B] rounded-[8px]
                shadow-[2px_2px_0px_#E5E1DC]
              "
            >
              {getIcon(file.type)}
              <span className="flex-1 font-['Comfortaa', cursive] text-sm text-[#263D5B] truncate">
                {file.name}
              </span>
              <span className="font-['Comfortaa', cursive] text-xs text-[#6B7280]">
                {(file.size / 1024).toFixed(1)}KB
              </span>
              <button
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