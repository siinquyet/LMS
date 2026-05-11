import { Home, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, EmptyState } from "../components/common";

export const NotFoundPage: React.FC = () => {
	return (
		<div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center p-4">
			<EmptyState
				icon={<Search className="w-8 h-8 text-[#1C293C]" />}
				title="Trang không tồn tại"
				description="Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển."
				action={{
					label: "Quay về trang chủ",
					onClick: () => (window.location.href = "/"),
				}}
				className="max-w-md"
			/>
		</div>
	);
};

export default NotFoundPage;