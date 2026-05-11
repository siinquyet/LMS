import { Plus, Edit3, Trash2, GripVertical, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getForumCategories, createForumCategory, updateForumCategory, deleteForumCategory } from "../api";
import { Avatar, Badge, Button, Card, Input, Modal, Loader } from "../components/common";

interface Category {
  id: number;
  ten: string;
  slug: string;
  mo_ta: string;
  icon: string;
  mau_sac: string;
  so_bai_viet: number;
  thu_tu: number;
}

export const AdminForumTopicsPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState({ ten: "", mo_ta: "", icon: "💬", mau_sac: "#432DD7" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    setLoading(true);
    getForumCategories()
      .then((data) => setCategories(data.danh_muc || []))
      .catch((err) => console.error("Error loading categories:", err))
      .finally(() => setLoading(false));
  };

  const openCreate = () => {
    setEditingCategory(null);
    setForm({ ten: "", mo_ta: "", icon: "💬", mau_sac: "#432DD7" });
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setForm({ ten: cat.ten, mo_ta: cat.mo_ta || "", icon: cat.icon, mau_sac: cat.mau_sac });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.ten.trim()) return;
    setSaving(true);
    try {
      if (editingCategory) {
        await updateForumCategory(editingCategory.id, form);
      } else {
        await createForumCategory(form);
      }
      setShowModal(false);
      loadCategories();
    } catch (err) {
      console.error("Error saving category:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xóa chủ đề này?")) return;
    try {
      await deleteForumCategory(id);
      loadCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#F8F6F3] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-['Inter', sans-serif] text-2xl text-[#1C293C]">Quản lý chủ đề forum</h1>
          <Button variant="primary" onClick={openCreate} className="border-[3px] border-[#1C293C] shadow-[4px_4px_0_#1C293C]">
            <Plus className="w-4 h-4 mr-2" />
            Thêm chủ đề
          </Button>
        </div>

        <Card className="border-[3px] border-[#1C293C] shadow-[6px_6px_0_#1C293C] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#FDC800]">
              <tr>
                <th className="p-4 text-left border-b-[3px] border-[#1C293C] font-bold text-[#1C293C]">Thứ tự</th>
                <th className="p-4 text-left border-b-[3px] border-[#1C293C] font-bold text-[#1C293C]">Biểu tượng</th>
                <th className="p-4 text-left border-b-[3px] border-[#1C293C] font-bold text-[#1C293C]">Tên</th>
                <th className="p-4 text-left border-b-[3px] border-[#1C293C] font-bold text-[#1C293C]">Màu sắc</th>
                <th className="p-4 text-left border-b-[3px] border-[#1C293C] font-bold text-[#1C293C]">Bài viết</th>
                <th className="p-4 text-left border-b-[3px] border-[#1C293C] font-bold text-[#1C293C]">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, idx) => (
                <tr key={cat.id} className="border-b-[2px] border-[#1C293C]">
                  <td className="p-4">
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                  </td>
                  <td className="p-4 text-2xl">{cat.icon}</td>
                  <td className="p-4">
                    <span className="font-bold text-[#1C293C]">{cat.ten}</span>
                    {cat.mo_ta && <p className="text-sm text-gray-500">{cat.mo_ta}</p>}
                  </td>
                  <td className="p-4">
                    <span className="inline-block w-8 h-8 border-[2px] border-[#1C293C]" style={{ backgroundColor: cat.mau_sac }} />
                  </td>
                  <td className="p-4">{cat.so_bai_viet}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(cat)} className="border-[2px] border-[#1C293C]">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(cat.id)} className="border-[2px] border-[#1C293C]">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">Chưa có chủ đề nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>

        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <Card className="p-6 border-[3px] border-[#1C293C] shadow-[8px_8px_0_#1C293C] w-[450px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Inter', sans-serif] text-xl text-[#1C293C]">
                {editingCategory ? "Sửa chủ đề" : "Thêm chủ đề mới"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-2 text-[#1C293C]">Tên chủ đề</label>
                <Input value={form.ten} onChange={(e) => setForm({ ...form, ten: e })} className="border-[3px] border-[#1C293C]" />
              </div>

              <div>
                <label className="block font-bold mb-2 text-[#1C293C]">Mô tả</label>
                <textarea value={form.mo_ta} onChange={(e) => setForm({ ...form, mo_ta: e.target.value })} rows={3} className="w-full border-[3px] border-[#1C293C] px-4 py-2" />
              </div>

              <div>
                <label className="block font-bold mb-2 text-[#1C293C]">Biểu tượng (emoji)</label>
                <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e })} className="border-[3px] border-[#1C293C]" />
              </div>

              <div>
                <label className="block font-bold mb-2 text-[#1C293C]">Màu sắc</label>
                <input type="color" value={form.mau_sac} onChange={(e) => setForm({ ...form, mau_sac: e.target.value })} className="w-full h-12 border-[3px] border-[#1C293C] cursor-pointer" />
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1 border-[3px] border-[#1C293C]">Hủy</Button>
                <Button variant="primary" onClick={handleSave} disabled={!form.ten.trim() || saving} className="flex-1 border-[3px] border-[#1C293C] shadow-[4px_4px_0_#1C293C]">
                  {saving ? "Đang lưu..." : (editingCategory ? "Cập nhật" : "Tạo mới")}
                </Button>
              </div>
            </div>
          </Card>
        </Modal>
      </div>
    </div>
  );
};

export default AdminForumTopicsPage;
