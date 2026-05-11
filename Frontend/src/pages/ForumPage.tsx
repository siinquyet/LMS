import {
  Clock,
  Eye,
  MessageCircle,
  Plus,
  Reply,
  Search,
  ThumbsUp,
  User,
  Bookmark,
  ChevronLeft,
  Heart,
  Send,
  Edit3,
  Trash2,
  Image,
  X,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import {
  getForumCategories,
  getForumPosts,
  getForumPost,
  createForumPost,
  togglePostReaction,
  createPostComment,
  deletePostComment,
  toggleCommentLike,
  togglePostSave,
  deleteForumPost,
  updateForumPost,
  uploadMedia,
  getMedia,
} from "../api";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Input,
  Modal,
  Loader,
} from "../components/common";

const emojiMap: Record<string, string> = {
  like: "👍",
  love: "❤️",
  haha: "😂",
  wow: "😮",
  sad: "😢",
  angry: "😠",
};

interface Post {
  id: number;
  nguoi_dung_id: number;
  ten_nguoi_dung: string;
  anh_dai_dien: string;
  tieu_de: string;
  noi_dung: string;
  hinh_anh: string[];
  luot_xem: number;
  so_binh_luan: number;
  duoc_ghim: boolean;
  bi_khoa: boolean;
  ngay_tao: string;
  danh_muc: { id: number; ten: string; mau_sac: string; icon?: string } | null;
  da_luu: boolean;
  cam_xuc_cua_toi: string | null;
  cam_xuc: Record<string, number>;
}

interface Comment {
  id: number;
  nguoi_dung_id: number;
  ten_nguoi_dung: string;
  anh_dai_dien: string;
  noi_dung: string;
  so_lan_thich: number;
  parent_id: number | null;
  tra_loi: Comment[];
  ngay_tao: string;
}

interface Category {
  id: number;
  ten: string;
  mau_sac: string;
  icon: string;
}

export const ForumPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postDetail, setPostDetail] = useState<{ bai_viet: Post & { binh_luan: Comment[] } } | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({ danh_muc_id: "", tieu_de: "", noi_dung: "" });
  const [submitting, setSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<{ url: string; uploading: boolean }[]>([]);
  const [uploadingCount, setUploadingCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsData, postsData] = await Promise.all([
          getForumCategories(),
          getForumPosts(),
        ]);
        setCategories(catsData.danh_muc || []);
        setPosts(postsData.bai_viet || []);
      } catch (error) {
        console.error("Error fetching forum data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryClick = (catId: number | null) => {
    setSelectedCategory(catId);
    setLoading(true);
    getForumPosts({ danh_muc_id: catId || undefined, search: search || undefined })
      .then((data) => setPosts(data.bai_viet || []))
      .finally(() => setLoading(false));
  };

  const handleSearch = () => {
    setLoading(true);
    getForumPosts({ danh_muc_id: selectedCategory || undefined, search: search || undefined })
      .then((data) => setPosts(data.bai_viet || []))
      .finally(() => setLoading(false));
  };

  const handlePostClick = async (post: Post) => {
    setSelectedPost(post);
    try {
      const data = await getForumPost(post.id);
      setPostDetail(data);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const handleBack = () => {
    setSelectedPost(null);
    setPostDetail(null);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploadingCount(files.length);

    for (const file of files) {
      setAttachments(prev => [...prev, { url: URL.createObjectURL(file), uploading: true }]);

      try {
        const data = await uploadMedia(file, 'forum_post');
        if (data.success && data.url) {
          setAttachments(prev => prev.map((a, i) =>
            a.url.startsWith('blob:') && a.uploading
              ? { url: data.url, uploading: false }
              : a
          ));
        }
      } catch {
        setAttachments(prev => prev.filter(a => !a.url.startsWith('blob:') || a.url !== URL.createObjectURL(file)));
      }

      setUploadingCount(prev => Math.max(0, prev - 1));
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (url: string) => {
    setAttachments(prev => prev.filter(a => a.url !== url));
  };

  const handleCreatePost = async () => {
    if (!newPost.tieu_de.trim() || !newPost.noi_dung.trim()) return;
    setSubmitting(true);
    try {
      const uploadedUrls = attachments.filter(a => !a.uploading).map(a => a.url);
      await createForumPost({
        danh_muc_id: newPost.danh_muc_id ? Number(newPost.danh_muc_id) : undefined,
        tieu_de: newPost.tieu_de,
        noi_dung: newPost.noi_dung,
        hinh_anh: uploadedUrls,
      });
      setShowCreateModal(false);
      setNewPost({ danh_muc_id: "", tieu_de: "", noi_dung: "" });
      setAttachments([]);
      const data = await getForumPosts();
      setPosts(data.bai_viet || []);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReaction = async (postId: number, type: string) => {
    try {
      const data = await togglePostReaction(postId, type);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, cam_xuc: data.cam_xuc, cam_xuc_cua_toi: data.cam_xuc_cua_toi } : p))
      );
    } catch (error) {
      console.error("Error toggling reaction:", error);
    }
  };

  const handleSave = async (postId: number) => {
    try {
      const data = await togglePostSave(postId);
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, da_luu: data.da_luu } : p)));
    } catch (error) {
      console.error("Error toggling save:", error);
    }
  };

  if (loading && posts.length === 0) return <Loader />;

  if (selectedPost && postDetail) {
    return (
      <div className="min-h-screen bg-[#F8F6F3] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Button variant="ghost" onClick={handleBack} className="mb-4 flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" /> Quay lại
          </Button>

          <Card className="p-6 border-[3px] border-[#1C293C] shadow-[6px_6px_0_#1C293C]">
            <div className="flex items-center gap-3 mb-4">
              <Avatar src={postDetail.bai_viet.anh_dai_dien} name={postDetail.bai_viet.ten_nguoi_dung} />
              <div>
                <p className="font-bold text-[#1C293C]">{postDetail.bai_viet.ten_nguoi_dung}</p>
                <p className="text-sm text-gray-500">{new Date(postDetail.bai_viet.ngay_tao).toLocaleDateString("vi-VN")}</p>
              </div>
            </div>

            <h1 className="font-['Inter', sans-serif] text-2xl text-[#1C293C] mb-3">{postDetail.bai_viet.tieu_de}</h1>

            {postDetail.bai_viet.danh_muc && (
              <Badge style={{ backgroundColor: postDetail.bai_viet.danh_muc.mau_sac }} className="mb-4 text-white border-[2px] border-[#1C293C]">
                {postDetail.bai_viet.danh_muc.icon} {postDetail.bai_viet.danh_muc.ten}
              </Badge>
            )}

            <p className="text-gray-700 mb-6 whitespace-pre-wrap">{postDetail.bai_viet.noi_dung}</p>

            {postDetail.bai_viet.hinh_anh?.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-6">
                {postDetail.bai_viet.hinh_anh.map((img, i) => (
                  <img key={i} src={img} alt="" className="w-full border-[2px] border-[#1C293C] object-cover" />
                ))}
              </div>
            )}

            <div className="flex items-center gap-6 text-gray-500 text-sm border-t-[3px] border-[#1C293C] pt-4">
              <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {postDetail.bai_viet.luot_xem}</span>
              <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {postDetail.bai_viet.so_binh_luan}</span>
              <div className="flex items-center gap-3 ml-auto">
                {Object.entries(emojiMap).slice(0, 3).map(([type, emoji]) => (
                  <button
                    key={type}
                    onClick={() => handleReaction(postDetail.bai_viet.id, type)}
                    className={`flex items-center gap-1 px-2 py-1 border-[2px] border-[#1C293C] ${postDetail.bai_viet.cam_xuc_cua_toi === type ? "bg-yellow-200" : "bg-white"}`}
                  >
                    <span>{emoji}</span>
                    <span>{postDetail.bai_viet.cam_xuc[type] || 0}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <div className="mt-6">
            <h2 className="font-['Inter', sans-serif] text-xl text-[#1C293C] mb-4">
              Bình luận ({postDetail.bai_viet.binh_luan.length})
            </h2>

            {postDetail.bai_viet.binh_luan.map((comment) => (
              <Card key={comment.id} className="p-4 mb-4 border-[3px] border-[#1C293C] shadow-[4px_4px_0_#1C293C]">
                <div className="flex items-start gap-3">
                  <Avatar src={comment.anh_dai_dien} name={comment.ten_nguoi_dung} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[#1C293C]">{comment.ten_nguoi_dung}</span>
                      <span className="text-sm text-gray-500">{new Date(comment.ngay_tao).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <p className="text-gray-700">{comment.noi_dung}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <button
                        onClick={() => toggleCommentLike(comment.id)}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500"
                      >
                        <Heart className="w-4 h-4" /> {comment.so_lan_thich}
                      </button>
                    </div>

                    {comment.tra_loi?.map((reply) => (
                      <div key={reply.id} className="ml-8 mt-3 flex items-start gap-2">
                        <Avatar src={reply.anh_dai_dien} name={reply.ten_nguoi_dung} size="sm" />
                        <div className="flex-1 border-[2px] border-[#1C293C] p-3 bg-gray-50">
                          <span className="font-bold text-sm">{reply.ten_nguoi_dung}</span>
                          <p className="text-sm text-gray-700">{reply.noi_dung}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F3] py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-['Inter', sans-serif] text-3xl text-[#1C293C] flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-[#432DD7]" />
            Diễn đàn
          </h1>
          <Button variant="primary" onClick={() => setShowCreateModal(true)} className="border-[3px] border-[#1C293C] shadow-[4px_4px_0_#1C293C]">
            <Plus className="w-4 h-4 mr-2" />
            Tạo bài viết
          </Button>
        </div>

        <div className="flex gap-6">
          <div className="w-56 shrink-0">
            <Card className="p-4 border-[3px] border-[#1C293C] shadow-[4px_4px_0_#1C293C]">
              <h3 className="font-bold text-[#1C293C] mb-3">Chủ đề</h3>
              <button
                onClick={() => handleCategoryClick(null)}
                className={`w-full text-left px-3 py-2 mb-1 border-[2px] border-transparent ${!selectedCategory ? "bg-yellow-400 border-[#1C293C]" : "hover:bg-gray-100"}`}
              >
                Tất cả bài viết
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`w-full text-left px-3 py-2 mb-1 border-[2px] border-transparent flex items-center gap-2 ${selectedCategory === cat.id ? "bg-yellow-400 border-[#1C293C]" : "hover:bg-gray-100"}`}
                >
                  <span>{cat.icon}</span>
                  <span className="truncate">{cat.ten}</span>
                </button>
              ))}
            </Card>
          </div>

          <div className="flex-1">
            <div className="mb-4">
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={search}
                onChange={setSearch}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                icon={<Search className="w-4 h-4" />}
                className="border-[3px] border-[#1C293C] shadow-[4px_4px_0_#1C293C]"
              />
            </div>

            {loading ? (
              <Loader />
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card
                    key={post.id}
                    className="p-5 border-[3px] border-[#1C293C] shadow-[6px_6px_0_#1C293C] cursor-pointer hover:shadow-[8px_8px_0_#1C293C] transition-shadow"
                    onClick={() => handlePostClick(post)}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar src={post.anh_dai_dien} name={post.ten_nguoi_dung} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-[#1C293C]">{post.ten_nguoi_dung}</span>
                          {post.danh_muc && (
                            <Badge style={{ backgroundColor: post.danh_muc.mau_sac }} className="text-white border-[2px] border-[#1C293C]">
                              {post.danh_muc.icon} {post.danh_muc.ten}
                            </Badge>
                          )}
                          {post.duoc_ghim && <Badge className="bg-red-500 text-white border-[2px] border-[#1C293C]">📌</Badge>}
                        </div>
                        <h3 className="font-['Inter', sans-serif] text-lg text-[#1C293C] mb-1">{post.tieu_de}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.noi_dung}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(post.ngay_tao).toLocaleDateString("vi-VN")}</span>
                          <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {post.luot_xem}</span>
                          <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {post.so_binh_luan}</span>
                          <div className="flex items-center gap-2 ml-auto" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => handleReaction(post.id, "like")} className={`p-1 border-[2px] border-[#1C293C] ${post.cam_xuc_cua_toi === "like" ? "bg-yellow-200" : "bg-white"}`}>
                              {emojiMap.like} {post.cam_xuc.like || 0}
                            </button>
                            <button onClick={() => handleReaction(post.id, "love")} className={`p-1 border-[2px] border-[#1C293C] ${post.cam_xuc_cua_toi === "love" ? "bg-red-200" : "bg-white"}`}>
                              {emojiMap.love} {post.cam_xuc.love || 0}
                            </button>
                            <button onClick={() => handleSave(post.id)} className={`p-1 border-[2px] border-[#1C293C] ${post.da_luu ? "bg-purple-200" : "bg-white"}`}>
                              <Bookmark className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {posts.length === 0 && (
                  <div className="text-center py-12 border-[3px] border-dashed border-[#1C293C] p-8">
                    <MessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4">Chưa có bài viết nào</p>
                    <Button variant="primary" onClick={() => setShowCreateModal(true)} className="border-[3px] border-[#1C293C] shadow-[4px_4px_0_#1C293C]">
                      <Plus className="w-4 h-4 mr-2" />
                      Tạo bài viết đầu tiên
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <Card className="p-6 border-[3px] border-[#1C293C] shadow-[8px_8px_0_#1C293C] w-[500px]">
          <h3 className="font-['Inter', sans-serif] text-xl text-[#1C293C] mb-4">Tạo bài viết mới</h3>

          <div className="mb-4">
            <label className="block font-bold mb-2 text-[#1C293C]">Chủ đề</label>
            <select
              value={newPost.danh_muc_id}
              onChange={(e) => setNewPost({ ...newPost, danh_muc_id: e.target.value })}
              className="w-full border-[3px] border-[#1C293C] px-4 py-2 bg-white"
            >
              <option value="">Chọn chủ đề</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.ten}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-2 text-[#1C293C]">Tiêu đề</label>
            <Input
              value={newPost.tieu_de}
              onChange={(e) => setNewPost({ ...newPost, tieu_de: e })}
              placeholder="Nhập tiêu đề..."
              className="border-[3px] border-[#1C293C]"
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-2 text-[#1C293C]">Nội dung</label>
            <textarea
              value={newPost.noi_dung}
              onChange={(e) => setNewPost({ ...newPost, noi_dung: e.target.value })}
              placeholder="Bạn muốn chia sẻ gì?"
              rows={5}
              className="w-full border-[3px] border-[#1C293C] px-4 py-3 resize-none"
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-2 text-[#1C293C]">Đính kèm</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => alert('Tính năng upload đang bảo trì')}
              className="flex items-center gap-2 px-4 py-2 border-[3px] border-[#1C293C] bg-white hover:bg-gray-50"
            >
              <Image className="w-4 h-4" />
              Thêm ảnh/video
            </button>
            {uploadingCount > 0 && (
              <span className="ml-3 text-sm text-gray-500">Đang tải lên...</span>
            )}
          </div>

          {attachments.length > 0 && (
            <div className="mb-4 grid grid-cols-3 gap-2">
              {attachments.map((att, i) => (
                <div key={i} className="relative border-[2px] border-[#1C293C]">
                  {att.url.startsWith('blob:') ? (
                    <div className="aspect-square bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Đang tải...</span>
                    </div>
                  ) : att.url.match(/\.(mp4|mov|avi)$/i) ? (
                    <video src={att.url} className="w-full h-24 object-cover" />
                  ) : (
                    <img src={att.url} alt="" className="w-full h-24 object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => removeAttachment(att.url)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1 border-[3px] border-[#1C293C]">
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={handleCreatePost}
              disabled={!newPost.tieu_de.trim() || !newPost.noi_dung.trim() || submitting}
              className="flex-1 border-[3px] border-[#1C293C] shadow-[4px_4px_0_#1C293C]"
            >
              {submitting ? "Đang gửi..." : "Đăng bài"}
            </Button>
          </div>
        </Card>
      </Modal>
    </div>
  );
};

export default ForumPage;
