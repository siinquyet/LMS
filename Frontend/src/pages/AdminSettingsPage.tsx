import { DollarSign, Save, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { getCommissionRate, updateCommissionRate } from "../api";
import { Button, Card, Loader } from "../components/common";

export const AdminSettingsPage: React.FC = () => {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [commissionRate, setCommissionRate] = useState(30);
	const [saved, setSaved] = useState(false);

	useEffect(() => {
		const fetchRate = async () => {
			try {
				const data = await getCommissionRate();
				setCommissionRate(Math.round((data.ty_le_hoa_hong || 0.3) * 100));
			} catch (error) {
				console.error("Error fetching commission rate:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchRate();
	}, []);

	const handleSave = async () => {
		setSaving(true);
		try {
			await updateCommissionRate(commissionRate / 100);
			setSaved(true);
			setTimeout(() => setSaved(false), 2000);
		} catch (error) {
			console.error("Error saving commission rate:", error);
			alert("Không thể lưu cài đặt");
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <Loader />;

	return (
		<div className="max-w-4xl mx-auto w-full">
			<div className="mb-6">
				<h1 className="font-['Inter', sans-serif] text-3xl text-[#1C293C] flex items-center gap-3">
					<Settings className="w-8 h-8" />
					Cài đặt hệ thống
				</h1>
				<p className="text-gray-500 mt-1">Quản lý cấu hình cho nền tảng</p>
			</div>

			<Card className="p-6">
				<div className="flex items-center gap-3 mb-4">
					<div className="p-2 bg-green-100 rounded-lg">
						<DollarSign className="w-5 h-5 text-green-600" />
					</div>
					<h2 className="font-['Inter', sans-serif] text-xl text-[#1C293C]">
						Cấu hình hoa hồng
					</h2>
				</div>

				<p className="text-gray-600 mb-4">
					Thiết lập tỷ lệ hoa hồng mà nền tảng sẽ giữ lại từ mỗi đơn hàng thành
					công. Phần còn lại sẽ được tính là thu nhập của giảng viên.
				</p>

				<div className="flex items-center gap-4 mb-6">
					<div className="flex-1">
						<label className="block text-sm text-gray-600 mb-2">
							Tỷ lệ hoa hồng (%)
						</label>
						<input
							type="number"
							min="0"
							max="100"
							value={commissionRate}
							onChange={(e) => setCommissionRate(Number(e.target.value))}
							className="w-full px-4 py-2 border-2 border-[#1C293C] rounded-lg font-['Inter', sans-serif] focus:border-[#49B6E5] outline-none"
						/>
					</div>
					<div className="text-right">
						<p className="text-sm text-gray-500">Giảng viên nhận</p>
						<p className="font-['Inter', sans-serif] text-2xl text-[#1C293C]">
							{100 - commissionRate}%
						</p>
					</div>
				</div>

				<div className="flex items-center gap-4">
					<Button onClick={handleSave} disabled={saving}>
						<Save className="w-4 h-4 mr-2" />
						{saving ? "Đang lưu..." : "Lưu cài đặt"}
					</Button>
					{saved && (
						<span className="text-green-600 font-['Inter', sans-serif]">
							Đã lưu!
						</span>
					)}
				</div>
			</Card>

			<Card className="p-6 mt-6">
				<h2 className="font-['Inter', sans-serif] text-xl text-[#1C293C] mb-4">
					Thông tin hệ thống
				</h2>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<p className="text-sm text-gray-500">Phiên bản</p>
						<p className="font-['Inter', sans-serif] text-[#1C293C]">1.0.0</p>
					</div>
					<div>
						<p className="text-sm text-gray-500">Số lượng khóa học</p>
						<p className="font-['Inter', sans-serif] text-[#1C293C]">-</p>
					</div>
				</div>
			</Card>
		</div>
	);
};

export default AdminSettingsPage;
