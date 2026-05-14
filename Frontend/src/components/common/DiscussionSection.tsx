import { useEffect, useState, useCallback } from "react";
import {
  MessageSquare,
  Send,
  Trash2,
  ChevronDown,
  ChevronUp,
  Heart,
  Loader,
} from "lucide-react";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { getComments, createComment, deleteComment } from "../../api";
import { useAuth } from "../../contexts/AuthContext";

interface CommentUser {
  id: number;
  ten: string;
  ho: string;
  anh_dai_dien: string | null;
}

interface Reply {
  id: number;
  bai_hoc_id: number;
  nguoi_dung_id: number;
  noi_dung: string;
  parent_id: number | null;
  ngay_tao: string;
  user: CommentUser;
}

interface Comment {
  id: number;
  bai_hoc_id: number;
  nguoi_dung_id: number;
  noi_dung: string;
  parent_id: number | null;
  ngay_tao: string;
  user: CommentUser;
  replies: Reply[];
}

interface DiscussionSectionProps {
  lessonId: number;
}

const getRelativeTime = (isoString: string): string => {
  const now = Date.now();
  const date = new Date(isoString).getTime();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) return "Vừa xong";
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} ngày trước`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `${diffWeeks} tuần trước`;
  return new Date(isoString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getFullName = (user: CommentUser): string => {
  return [user.ho, user.ten].filter(Boolean).join(" ") || "Người dùng";
};

export const DiscussionSection: React.FC<DiscussionSectionProps> = ({ lessonId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: number; user: CommentUser } | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getComments(lessonId);
      setComments(data.comments || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Không thể tải bình luận. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handlePostComment = async () => {
    if (!newComment.trim() || !user || submitting) return;

    try {
      setSubmitting(true);
      await createComment(lessonId, user.id, newComment.trim());
      setNewComment("");
      await fetchComments();
    } catch (err) {
      console.error("Error posting comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostReply = async (parentId: number) => {
    if (!replyContent.trim() || !user || replyingId !== null) return;

    try {
      setReplyingId(parentId);
      await createComment(lessonId, user.id, replyContent.trim(), parentId);
      setReplyContent("");
      setReplyTo(null);
      // Ensure parent replies are expanded
      setExpandedReplies((prev) => new Set(prev).add(parentId));
      await fetchComments();
    } catch (err) {
      console.error("Error posting reply:", err);
    } finally {
      setReplyingId(null);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (deletingIds.has(commentId)) return;

    try {
      setDeletingIds((prev) => new Set(prev).add(commentId));
      await deleteComment(commentId);
      await fetchComments();
    } catch (err) {
      console.error("Error deleting comment:", err);
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (replyTo) {
        handlePostReply(replyTo.id);
      } else {
        handlePostComment();
      }
    }
  };

  const sortedComments = [...comments].sort((a, b) => {
    const diff = new Date(a.ngay_tao).getTime() - new Date(b.ngay_tao).getTime();
    return sortBy === "newest" ? -diff : diff;
  });

  const totalComments = comments.reduce((sum, c) => sum + 1 + (c.replies?.length || 0), 0);

  const renderComment = (comment: Comment, isReply = false) => {
    const isOwn = user?.id === comment.nguoi_dung_id;
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isExpanded = expandedReplies.has(comment.id);
    const isDeleting = deletingIds.has(comment.id);

    return (
      <div
        key={comment.id}
        className={`${isReply ? "ml-12 pl-4 border-l-2 border-gray-200" : ""}`}
      >
        <div className="flex gap-3 group">
          {/* Avatar */}
          <div className="shrink-0">
            {comment.user?.anh_dai_dien ? (
              <img
                src={comment.user.anh_dai_dien}
                alt=""
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#1C293C] flex items-center justify-center text-white text-sm font-bold">
                {getFullName(comment.user).charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-['Inter',sans-serif] text-sm font-bold text-[#1C293C]">
                {getFullName(comment.user)}
              </span>
              <span className="text-xs text-gray-400">
                {getRelativeTime(comment.ngay_tao)}
              </span>
            </div>

            <p className="text-sm text-gray-700 font-['Inter',sans-serif] leading-relaxed whitespace-pre-wrap break-words">
              {comment.noi_dung}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-1.5">
              {!isReply && (
                <button
                  onClick={() => {
                    if (replyTo?.id === comment.id) {
                      setReplyTo(null);
                      setReplyContent("");
                    } else {
                      setReplyTo({ id: comment.id, user: comment.user });
                      setReplyContent("");
                    }
                  }}
                  className="text-xs text-gray-500 hover:text-[#49B6E5] font-medium transition-colors flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {replyTo?.id === comment.id ? "Hủy trả lời" : "Trả lời"}
                </button>
              )}

              {isOwn && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  disabled={isDeleting}
                  className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
                >
                  {isDeleting ? (
                    <Loader size="xs" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  Xóa
                </button>
              )}
            </div>

            {/* Inline reply form */}
            {replyTo?.id === comment.id && (
              <div className="mt-3 mb-2">
                <div className="flex gap-2">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Trả lời ${getFullName(comment.user)}...`}
                    rows={2}
                    className="flex-1 px-3 py-2 border-2 border-[#1C293C] rounded-[8px] font-['Inter',sans-serif] text-sm resize-none focus:border-[#49B6E5] outline-none"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handlePostReply(comment.id)}
                    disabled={!replyContent.trim() || replyingId === comment.id}
                  >
                    {replyingId === comment.id ? (
                      <Loader size="sm" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Replies toggle */}
            {hasReplies && (
              <button
                onClick={() => {
                  setExpandedReplies((prev) => {
                    const next = new Set(prev);
                    if (next.has(comment.id)) next.delete(comment.id);
                    else next.add(comment.id);
                    return next;
                  });
                }}
                className="mt-2 text-xs text-[#49B6E5] hover:text-[#3a9bd0] font-medium transition-colors flex items-center gap-1"
              >
                {isExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
                {isExpanded
                  ? "Ẩn trả lời"
                  : `${comment.replies.length} trả lời`}
              </button>
            )}
          </div>
        </div>

        {/* Nested replies */}
        {hasReplies && isExpanded && (
          <div className="mt-3 space-y-3">
            {comment.replies.map((reply) => renderComment(reply as Comment, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#1C293C]" />
          <h3 className="font-['Inter',sans-serif] text-lg font-bold text-[#1C293C]">
            Thảo luận
          </h3>
          {!loading && (
            <span className="text-sm text-gray-500 font-medium">
              ({totalComments})
            </span>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSortBy("newest")}
            className={`px-3 py-1.5 text-xs font-medium rounded-[6px] transition-colors ${
              sortBy === "newest"
                ? "bg-[#1C293C] text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Mới nhất
          </button>
          <button
            onClick={() => setSortBy("oldest")}
            className={`px-3 py-1.5 text-xs font-medium rounded-[6px] transition-colors ${
              sortBy === "oldest"
                ? "bg-[#1C293C] text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Cũ nhất
          </button>
        </div>
      </div>

      {/* New comment input */}
      {user ? (
        <div className="flex gap-3 mb-6">
          <div className="shrink-0">
            {user.anh_dai_dien ? (
              <img
                src={user.anh_dai_dien}
                alt=""
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#1C293C] flex items-center justify-center text-white text-sm font-bold">
                {(user.ten || user.email || "U").charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Thêm bình luận..."
              rows={2}
              className="w-full px-3 py-2 border-2 border-[#1C293C] rounded-[8px] font-['Inter',sans-serif] text-sm resize-none focus:border-[#49B6E5] outline-none"
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-400">
                Nhấn Enter để gửi, Shift+Enter để xuống dòng
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={handlePostComment}
                disabled={!newComment.trim() || submitting}
              >
                {submitting ? (
                  <Loader size="sm" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-1" />
                    Gửi
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-[8px] border-2 border-dashed border-gray-300 text-center">
          <p className="text-sm text-gray-500 font-['Inter',sans-serif]">
            Vui lòng đăng nhập để tham gia thảo luận
          </p>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 text-sm mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchComments}>
            Thử lại
          </Button>
        </div>
      ) : sortedComments.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-['Inter',sans-serif] text-sm mb-1">
            Chưa có bình luận nào
          </p>
          <p className="text-gray-400 font-['Inter',sans-serif] text-xs">
            Hãy là người đầu tiên thảo luận về bài học này!
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {sortedComments.map((comment) => renderComment(comment))}
        </div>
      )}
    </div>
  );
};

export default DiscussionSection;
