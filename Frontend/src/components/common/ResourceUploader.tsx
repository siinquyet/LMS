import { useCallback, useState } from "react";
import { Upload, FileText, X, CheckCircle, Loader, File, Image, Film, Archive } from "lucide-react";
import { Button } from "./Button";
import { formatFileSize, getFileIcon } from "../../utils/format";
import { useToast } from "./Toast";

interface Resource {
  id: number;
  url: string;
  ten_file: string;
  loai: string;
  kich_thuoc: number;
  mime_type?: string;
  ngay_tai: string;
  nguoi_tai?: { id: number; ten: string; ho: string };
}

interface ResourceUploaderProps {
  lessonId?: number;
  resources: Resource[];
  onUploadSuccess?: () => void;
  onUpload?: (file: File) => Promise<void>;
  onDelete?: (mediaId: number) => Promise<void>;
  uploading?: boolean;
}

export const ResourceUploader: React.FC<ResourceUploaderProps> = ({
  lessonId,
  resources,
  onUploadSuccess,
  onUpload,
  onDelete,
  uploading: externalUploading,
}) => {
  const { addToast } = useToast();
  const [internalUploading, setInternalUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uploading = externalUploading ?? internalUploading;

  const getMimeIcon = (resource: Resource) => {
    const mime = resource.mime_type || '';
    if (mime.includes('pdf')) return <File className="w-8 h-8 text-red-500" />;
    if (mime.includes('word') || mime.includes('document')) return <FileText className="w-8 h-8 text-blue-500" />;
    if (mime.includes('sheet') || mime.includes('excel')) return <FileText className="w-8 h-8 text-green-600" />;
    if (mime.includes('presentation') || mime.includes('powerpoint')) return <FileText className="w-8 h-8 text-orange-500" />;
    if (mime.includes('image')) return <Image className="w-8 h-8 text-green-500" />;
    if (mime.includes('video')) return <Film className="w-8 h-8 text-purple-500" />;
    if (mime.includes('zip') || mime.includes('rar') || mime.includes('archive')) return <Archive className="w-8 h-8 text-yellow-500" />;
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (onUpload) {
      for (const file of Array.from(files)) {
        await onUpload(file);
      }
      onUploadSuccess?.();
      return;
    }
    if (!lessonId) return;

    setInternalUploading(true);
    setError(null);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('entityType', 'lesson');
        formData.append('entityId', String(lessonId));

        const token = localStorage.getItem('token');
        const res = await fetch('/api/media/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Upload failed');
        }
      }

      onUploadSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setInternalUploading(false);
    }
  }, [lessonId, onUpload, onUploadSuccess]);

  const handleDelete = async (mediaId: number) => {
    if (onDelete) {
      await onDelete(mediaId);
      onUploadSuccess?.();
      return;
    }
    if (!lessonId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/media/lesson/${lessonId}/${mediaId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        onUploadSuccess?.();
      } else {
        const data = await res.json().catch(() => ({}));
        addToast("error", `[ResourceUploader] Xóa tài liệu thất bại: ${data.error || res.statusText}`);
      }
    } catch (err) {
      addToast("error", `[ResourceUploader] Xóa tài liệu thất bại`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? 'border-[#49B6E5] bg-[#49B6E5]/5'
            : 'border-[#E5E1DC] hover:border-[#1C293C]'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleUpload(e.dataTransfer.files);
        }}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar,.mp4,.mp3"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => handleUpload(e.target.files)}
          disabled={uploading}
        />
        
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-[#49B6E5]">
            <Loader className="w-6 h-6 animate-spin" />
            <span className="font-medium">Đang tải lên...</span>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className={`w-10 h-10 mx-auto ${dragOver ? 'text-[#49B6E5]' : 'text-gray-400'}`} />
            <div>
              <p className="text-[#1C293C] font-medium">
                Kéo thả file hoặc <span className="text-[#49B6E5]">nhấn để chọn</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, DOC, PPT, XLS, TXT, ZIP, MP4, MP3 (tối đa 100MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Resources List */}
      {resources.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Tài liệu đính kèm ({resources.length})
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="flex items-center gap-3 p-3 bg-white border border-[#E5E1DC] rounded-lg hover:border-[#1C293C] transition-colors group"
              >
                <div className="flex-shrink-0">
                  {getMimeIcon(resource)}
                </div>
                <div className="flex-1 min-w-0">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-[#1C293C] hover:text-[#49B6E5] truncate block"
                    title={resource.ten_file}
                  >
                    {resource.ten_file}
                  </a>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span>{formatFileSize(resource.kich_thuoc)}</span>
                    {resource.mime_type && (
                      <>
                        <span>•</span>
                        <span className="uppercase">{resource.mime_type.split('/')[1]}</span>
                      </>
                    )}
                    {resource.nguoi_tai && (
                      <>
                        <span>•</span>
                        <span>{resource.nguoi_tai.ho} {resource.nguoi_tai.ten}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(resource.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                  title="Xóa tài liệu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {resources.length === 0 && !uploading && (
        <div className="text-center py-4 text-sm text-gray-500">
          Chưa có tài liệu nào
        </div>
      )}
    </div>
  );
};

export default ResourceUploader;
