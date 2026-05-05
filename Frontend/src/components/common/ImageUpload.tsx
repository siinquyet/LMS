import React, { useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

export interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  placeholder?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  accept = 'image/*',
  placeholder = 'Nhấn để tải ảnh lên',
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const getMediaUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `${API_BASE}${url}`;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Tải file thất bại');
    }
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
        onClick={() => inputRef.current?.click()}
        className="w-full h-32 border-2 border-dashed border-[#263D5B] rounded-lg cursor-pointer hover:bg-gray-50 flex flex-col items-center justify-center overflow-hidden"
      >
        {value ? (
          accept.startsWith('video') ? (
            <video src={getMediaUrl(value)} className="w-full h-full object-cover" controls={false} />
          ) : (
            <img src={getMediaUrl(value)} alt="Preview" className="w-full h-full object-cover" />
          )
        ) : (
          <>
            <span className="text-3xl text-[#263D5B]">+</span>
            <span className="text-sm text-gray-500 mt-1 font-['Comfortaa', cursive]">{placeholder}</span>
          </>
        )}
      </div>
      {value && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange('');
          }}
          className="text-xs text-red-500 hover:underline mt-1"
        >
          Xóa
        </button>
      )}
    </div>
  );
};

export default ImageUpload;