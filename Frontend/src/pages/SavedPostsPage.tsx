import { Bookmark, ChevronLeft, MessageCircle, Eye, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { getSavedPosts, togglePostSave } from "../api";
import { Avatar, Badge, Button, Card, Loader } from "../components/common";

interface SavedPost {
  id: number;
  tieu_de: string;
  noi_dung: string;
  ngay_luu: string;
  nguoi_dung: { id: number; ten: string; anh_dai_dien: string };
  danh_muc: { id: number; ten: string; mau_sac: string } | null;
}

export const SavedPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSavedPosts()
      .then((data) => setPosts(data.bai_viet_da_luu || []))
      .catch((err) => console.error("Error fetching saved posts:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleUnsave = async (postId: number) => {
    try {
      await togglePostSave(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      console.error("Error unsaving post:", err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#F8F6F3] py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" onClick={() => window.history.back()} className="border-[2px] border-[#1C293C]">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-['Inter', sans-serif] text-2xl text-[#1C293C] flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-[#432DD7]" />
            Bài viết đã lưu
          </h1>
        </div>

        {posts.length === 0 ? (
          <Card className="p-12 text-center border-[3px] border-dashed border-[#1C293C]">
            <Bookmark className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">Bạn chưa lưu bài viết nào</p>
            <Button variant="primary" onClick={() => window.location.href = "/forum"} className="border-[3px] border-[#1C293C] shadow-[4px_4px_0_#1C293C]">
              Khám phá diễn đàn
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="p-5 border-[3px] border-[#1C293C] shadow-[6px_6px_0_#1C293C]">
                <div className="flex items-start gap-4">
                  <Avatar src={post.nguoi_dung.anh_dai_dien} name={post.nguoi_dung.ten} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-[#1C293C]">{post.nguoi_dung.ten}</span>
                      {post.danh_muc && (
                        <Badge style={{ backgroundColor: post.danh_muc.mau_sac }} className="text-white border-[2px] border-[#1C293C]">
                          {post.danh_muc.ten}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-['Inter', sans-serif] text-lg text-[#1C293C] mb-1">{post.tieu_de}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{post.noi_dung}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Đã lưu: {new Date(post.ngay_luu).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.location.href = `/forum/${post.id}`} className="border-[2px] border-[#1C293C]">
                      Xem
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => handleUnsave(post.id)} className="border-[2px] border-[#1C293C] shadow-[2px_2px_0_#1C293C]">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPostsPage;
