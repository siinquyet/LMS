import { useState } from "react";
import { Plus, Trash2, Check, Save } from "lucide-react";
import { Button, Input } from "../common";

export interface QuizQuestion {
	id?: number;
	cau_hoi: string;
	lua_chon: string[];
	dap_an_dung: number;
}

export interface QuizFormData {
	tieu_de: string;
	thoi_gian_lam: number;
	so_cau_hoi: number;
	cau_hoi: QuizQuestion[];
}

export interface QuizBuilderProps {
	formData: QuizFormData;
	onChange: (data: QuizFormData) => void;
}

export const QuizBuilder: React.FC<QuizBuilderProps> = ({ formData, onChange }) => {
	const updateField = (field: keyof QuizFormData, value: any) => {
		onChange({ ...formData, [field]: value });
	};

	const addQuestion = () => {
		const newQuestion: QuizQuestion = {
			cau_hoi: "",
			lua_chon: ["", "", "", ""],
			dap_an_dung: 0,
		};
		updateField("cau_hoi", [...formData.cau_hoi, newQuestion]);
	};

	const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
		const updated = [...formData.cau_hoi];
		updated[index] = { ...updated[index], [field]: value };
		updateField("cau_hoi", updated);
	};

	const removeQuestion = (index: number) => {
		updateField("cau_hoi", formData.cau_hoi.filter((_, i) => i !== index));
	};

	const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
		const updated = [...formData.cau_hoi];
		const newOptions = [...updated[questionIndex].lua_chon];
		newOptions[optionIndex] = value;
		updated[questionIndex].lua_chon = newOptions;
		updateField("cau_hoi", updated);
	};

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-bold mb-2">Tiêu đề Quiz</label>
					<Input
						value={formData.tieu_de}
						onChange={(value) => updateField("tieu_de", value)}
						placeholder="VD: Quiz chương 1 - JavaScript cơ bản"
						className="border-2 border-[#1C293C]"
					/>
				</div>
				<div>
					<label className="block text-sm font-bold mb-2">Thời gian làm (phút)</label>
					<Input
						type="number"
						value={formData.thoi_gian_lam}
						onChange={(value) => updateField("thoi_gian_lam", parseInt(value) || 0)}
						placeholder="15"
						className="border-2 border-[#1C293C]"
					/>
				</div>
			</div>

			<div className="flex items-center justify-between">
				<h3 className="font-bold text-lg">
					Câu hỏi ({formData.cau_hoi.length})
				</h3>
				<Button variant="primary" onClick={addQuestion}>
					<Plus className="w-4 h-4 mr-2" />
					Thêm câu hỏi
				</Button>
			</div>

			{formData.cau_hoi.length === 0 && (
				<div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
					<p>Chưa có câu hỏi nào. Nhấn "Thêm câu hỏi" để bắt đầu.</p>
				</div>
			)}

			{formData.cau_hoi.map((question, qIdx) => (
				<div key={qIdx} className="border-2 border-[#1C293C] rounded-lg p-4 space-y-4">
					<div className="flex items-start justify-between">
						<span className="font-bold bg-blue-100 px-2 py-1 rounded">Câu {qIdx + 1}</span>
						<button
							type="button"
							onClick={() => removeQuestion(qIdx)}
							className="text-red-500 hover:text-red-700"
						>
							<Trash2 className="w-5 h-5" />
						</button>
					</div>

					<div>
						<label className="block text-sm font-bold mb-2">Câu hỏi</label>
						<textarea
							value={question.cau_hoi}
							onChange={(e) => updateQuestion(qIdx, "cau_hoi", e.target.value)}
							placeholder="Nhập nội dung câu hỏi..."
							className="w-full p-3 border-2 border-[#1C293C] rounded-lg min-h-[80px]"
						/>
					</div>

					<div className="space-y-2">
						<label className="block text-sm font-bold">Đáp án (chọn đáp án đúng)</label>
						{question.lua_chon.map((option, oIdx) => (
							<div key={oIdx} className="flex items-center gap-2">
								<button
									type="button"
									onClick={() => updateQuestion(qIdx, "dap_an_dung", oIdx)}
									className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
										question.dap_an_dung === oIdx
											? "bg-green-500 border-green-500 text-white"
											: "border-gray-400 hover:border-green-500"
									}`}
								>
									{question.dap_an_dung === oIdx && <Check className="w-4 h-4" />}
								</button>
								<input
									type="text"
									value={option}
									onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
									placeholder={`Đáp án ${oIdx + 1}`}
									className={`flex-1 p-2 border-2 rounded-lg ${
										option.trim().length === 0
											? "border-red-400 bg-red-50"
											: "border-[#1C293C]"
									}`}
								/>
							</div>
						))}
						{question.lua_chon.filter(o => o.trim().length > 0).length < 2 && (
							<p className="text-xs text-red-500 mt-1">
								Cần ít nhất 2 đáp án không được để trống
							</p>
						)}
					</div>

					<p className="text-xs text-gray-500">
						Đáp án đúng: {String.fromCharCode(65 + question.dap_an_dung)}
					</p>
				</div>
			))}
		</div>
	);
};

export default QuizBuilder;