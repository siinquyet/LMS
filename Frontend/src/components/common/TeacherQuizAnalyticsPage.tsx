import { useCallback, useEffect, useState } from "react";
import {
	ArrowLeft,
	Users,
	TrendingUp,
	CheckCircle,
	Clock,
	AlertTriangle,
	BarChart3,
	ListChecks,
	Loader,
	RefreshCw,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "./Card";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Progress } from "./Progress";
import { getQuizAnalytics, getQuizQuestionAnalytics } from "../../api";

interface QuestionAnalytics {
	id: number;
	cau_hoi: string;
	thu_tu: number;
	dap_an_dung: string;
	correct_count: number;
	correct_rate: number;
}

interface QuestionAnalyticsResponse {
	questions: QuestionAnalytics[];
}

interface AnalyticsOverview {
	total_attempts: number;
	unique_students: number;
	diem_trung_binh: number;
	pass_rate: number;
}

interface ScoreDistribution {
	"0-4": number;
	"5-6.9": number;
	"7-8.9": number;
	"9-10": number;
}

interface RecentAttempt {
	id: number;
	user: { id: number; ten: string; ho: string };
	diem: number;
	ngay_lam: string;
}

interface AnalyticsResponse {
	quiz: { id: number; tieu_de: string; so_cau_hoi: number };
	overview: AnalyticsOverview;
	score_distribution: ScoreDistribution;
	recent_attempts: RecentAttempt[];
}

export const TeacherQuizAnalyticsPage: React.FC = () => {
	const { quizId } = useParams<{ quizId: string }>();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
	const [questionAnalytics, setQuestionAnalytics] =
		useState<QuestionAnalyticsResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(
		new Set(),
	);

	const fetchAnalytics = useCallback(async () => {
		if (!quizId) return;
		setLoading(true);
		setError(null);

		try {
			const [analyticsData, questionData] = await Promise.all([
				getQuizAnalytics(Number(quizId)),
				getQuizQuestionAnalytics(Number(quizId)),
			]);
			setAnalytics(analyticsData);
			setQuestionAnalytics(questionData);
		} catch (e) {
			window.dispatchEvent(new CustomEvent("app:error", { detail: { source: "TeacherQuizAnalyticsPage", message: "Tải dữ liệu phân tích thất bại", status: 0 } }));
			setError("Không thể tải dữ liệu phân tích");
		} finally {
			setLoading(false);
		}
	}, [quizId]);

	useEffect(() => {
		fetchAnalytics();
	}, [fetchAnalytics]);

	const toggleQuestion = (id: number) => {
		setExpandedQuestions((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	const getDifficultyColor = (rate: number) => {
		if (rate >= 70) return "text-green-600 bg-green-50";
		if (rate >= 40) return "text-yellow-600 bg-yellow-50";
		return "text-red-600 bg-red-50";
	};

	const getDifficultyLabel = (rate: number) => {
		if (rate >= 70) return "Dễ";
		if (rate >= 40) return "Trung bình";
		return "Khó";
	};

	const getDifficultyBadge = (rate: number) => {
		if (rate < 30) return { variant: "danger" as const, label: "Cần xem lại" };
		if (rate < 40) return { variant: "warning" as const, label: "Khó" };
		if (rate < 60) return { variant: "warning" as const, label: "Trung bình" };
		return { variant: "success" as const, label: "Tốt" };
	};

	const maxDistribution = analytics
		? Math.max(...Object.values(analytics.score_distribution))
		: 1;

	if (loading) {
		return (
			<div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center">
				<Loader size="lg" />
			</div>
		);
	}

	if (error || !analytics) {
		return (
			<div className="min-h-screen bg-[#F8F6F3] p-8">
				<Card className="p-8 text-center border-3 border-[#1C293C]">
					<p className="text-red-500 mb-4">{error || "Không có dữ liệu"}</p>
					<Button onClick={() => navigate(-1)}>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Quay lại
					</Button>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F8F6F3]">
			<div className="bg-white border-b-3 border-[#1C293C] px-6 py-4 sticky top-0 z-10">
				<div className="max-w-6xl mx-auto flex items-center justify-between">
					<div className="flex items-center gap-4">
						<button
							onClick={() => navigate(-1)}
							className="p-2 hover:bg-gray-100 rounded-[8px] border-2 border-[#1C293C]"
						>
							<ArrowLeft className="w-5 h-5" />
						</button>
						<div>
							<h1 className="font-['Inter', sans-serif] text-xl font-bold text-[#1C293C]">
								{analytics.quiz.tieu_de}
							</h1>
							<p className="text-sm text-gray-500">
								{analytics.quiz.so_cau_hoi} câu hỏi • Quiz Analytics
							</p>
						</div>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={fetchAnalytics}
					>
						<RefreshCw className="w-4 h-4 mr-2" />
						Làm mới
					</Button>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
				<div className="grid grid-cols-4 gap-4">
					<Card className="p-5 border-3 border-[#1C293C] shadow-[4px_4px_0_#E5E1DC]">
						<div className="flex items-center gap-3 mb-2">
							<div className="p-2 bg-blue-100 rounded-[8px]">
								<Users className="w-5 h-5 text-blue-600" />
							</div>
							<span className="text-sm text-gray-500 font-['Inter', sans-serif]">
								Tổng lượt làm
							</span>
						</div>
						<p className="text-3xl font-bold text-[#1C293C] font-['Inter', sans-serif]">
							{analytics.overview.total_attempts}
						</p>
						<p className="text-xs text-gray-400 mt-1">
							{analytics.overview.unique_students} học viên
						</p>
					</Card>

					<Card className="p-5 border-3 border-[#1C293C] shadow-[4px_4px_0_#E5E1DC]">
						<div className="flex items-center gap-3 mb-2">
							<div className="p-2 bg-yellow-100 rounded-[8px]">
								<TrendingUp className="w-5 h-5 text-yellow-600" />
							</div>
							<span className="text-sm text-gray-500 font-['Inter', sans-serif]">
								Điểm trung bình
							</span>
						</div>
						<p className="text-3xl font-bold text-[#1C293C] font-['Inter', sans-serif]">
							{analytics.overview.diem_trung_binh.toFixed(1)}
							<span className="text-lg">/10</span>
						</p>
						<p className="text-xs text-gray-400 mt-1">Thang điểm 10</p>
					</Card>

					<Card className="p-5 border-3 border-[#1C293C] shadow-[4px_4px_0_#E5E1DC]">
						<div className="flex items-center gap-3 mb-2">
							<div className="p-2 bg-green-100 rounded-[8px]">
								<CheckCircle className="w-5 h-5 text-green-600" />
							</div>
							<span className="text-sm text-gray-500 font-['Inter', sans-serif]">
								Tỷ lệ đạt
							</span>
						</div>
						<p className="text-3xl font-bold text-[#1C293C] font-['Inter', sans-serif]">
							{analytics.overview.pass_rate}
							<span className="text-lg">%</span>
						</p>
						<p className="text-xs text-gray-400 mt-1">≥ 5 điểm</p>
					</Card>

					<Card className="p-5 border-3 border-[#1C293C] shadow-[4px_4px_0_#E5E1DC]">
						<div className="flex items-center gap-3 mb-2">
							<div className="p-2 bg-purple-100 rounded-[8px]">
								<Clock className="w-5 h-5 text-purple-600" />
							</div>
							<span className="text-sm text-gray-500 font-['Inter', sans-serif]">
								Lần làm gần nhất
							</span>
						</div>
						<p className="text-lg font-bold text-[#1C293C] font-['Inter', sans-serif]">
							{analytics.recent_attempts.length > 0
								? new Date(
										analytics.recent_attempts[0].ngay_lam,
									).toLocaleDateString("vi-VN", {
										day: "2-digit",
										month: "short",
									})
								: "Chưa có"}
						</p>
						<p className="text-xs text-gray-400 mt-1">
							{analytics.recent_attempts.length > 0
								? `${analytics.recent_attempts[0].user.ho} ${analytics.recent_attempts[0].user.ten}`
								: "Học viên chưa làm bài"}
						</p>
					</Card>
				</div>

				<div className="grid grid-cols-2 gap-6">
					<Card className="p-6 border-3 border-[#1C293C] shadow-[4px_4px_0_#E5E1DC]">
						<div className="flex items-center gap-2 mb-4">
							<BarChart3 className="w-5 h-5 text-[#1C293C]" />
							<h2 className="font-['Inter', sans-serif] text-lg font-bold text-[#1C293C]">
								Phân phối điểm số
							</h2>
						</div>
						<div className="space-y-3">
							{[
								{ label: "0 - 4.9", key: "0-4", color: "bg-red-500" },
								{
									label: "5 - 6.9",
									key: "5-6.9",
									color: "bg-yellow-500",
								},
								{
									label: "7 - 8.9",
									key: "7-8.9",
									color: "bg-blue-500",
								},
								{ label: "9 - 10", key: "9-10", color: "bg-green-500" },
							].map((range) => {
								const count = analytics.score_distribution[
									range.key as keyof ScoreDistribution
								] as number;
								const percentage =
									maxDistribution > 0 ? (count / maxDistribution) * 100 : 0;
								return (
									<div key={range.key} className="space-y-1">
										<div className="flex justify-between text-sm">
											<span className="text-gray-600 font-['Inter', sans-serif]">
												{range.label}
											</span>
											<span className="font-semibold text-[#1C293C] font-['Inter', sans-serif]">
												{count} người
											</span>
										</div>
										<div className="h-6 bg-gray-100 rounded-[4px] overflow-hidden">
											<div
												className={`h-full ${range.color} transition-all duration-500 rounded-[4px]`}
												style={{ width: `${percentage}%` }}
											/>
										</div>
									</div>
								);
							})}
						</div>
					</Card>

					<Card className="p-6 border-3 border-[#1C293C] shadow-[4px_4px_0_#E5E1DC]">
						<div className="flex items-center gap-2 mb-4">
							<ListChecks className="w-5 h-5 text-[#1C293C]" />
							<h2 className="font-['Inter', sans-serif] text-lg font-bold text-[#1C293C]">
								Lần làm gần đây
							</h2>
						</div>
						<div className="space-y-2 max-h-[200px] overflow-y-auto">
							{analytics.recent_attempts.length === 0 ? (
								<p className="text-gray-400 text-sm text-center py-4">
									Chưa có lượt làm bài nào
								</p>
							) : (
								analytics.recent_attempts.slice(0, 5).map((attempt) => (
									<div
										key={attempt.id}
										className="flex items-center justify-between p-3 bg-gray-50 rounded-[8px] border border-gray-200"
									>
										<div>
											<p className="text-sm font-medium text-[#1C293C] font-['Inter', sans-serif]">
												{attempt.user.ho} {attempt.user.ten}
											</p>
											<p className="text-xs text-gray-400">
												{new Date(attempt.ngay_lam).toLocaleDateString("vi-VN", {
													day: "2-digit",
													month: "short",
													hour: "2-digit",
													minute: "2-digit",
												})}
											</p>
										</div>
										<div
											className={`px-3 py-1 rounded-full font-bold text-sm ${
												attempt.diem >= 5
													? "bg-green-100 text-green-700"
													: "bg-red-100 text-red-700"
											}`}
										>
											{attempt.diem.toFixed(1)}
										</div>
									</div>
								))
							)}
						</div>
					</Card>
				</div>

				<Card className="p-6 border-3 border-[#1C293C] shadow-[4px_4px_0_#E5E1DC]">
					<div className="flex items-center gap-2 mb-4">
						<AlertTriangle className="w-5 h-5 text-[#1C293C]" />
						<h2 className="font-['Inter', sans-serif] text-lg font-bold text-[#1C293C]">
							Phân tích từng câu hỏi
						</h2>
					</div>

					{questionAnalytics?.questions && questionAnalytics.questions.length > 0 ? (
						<div className="space-y-2">
							{questionAnalytics.questions.map((q) => {
								const isExpanded = expandedQuestions.has(q.id);
								const badge = getDifficultyBadge(q.correct_rate);

								return (
									<div
										key={q.id}
										className="border-2 border-[#E5E1DC] rounded-[8px] overflow-hidden"
									>
										<button
											onClick={() => toggleQuestion(q.id)}
											className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
										>
											<div className="flex items-center gap-3 flex-1 min-w-0">
												<span className="w-8 h-8 rounded-full bg-gray-200 text-sm font-bold flex items-center justify-center text-gray-600">
													{q.thu_tu}
												</span>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium text-[#1C293C] font-['Inter', sans-serif] line-clamp-2">
														{q.cau_hoi}
													</p>
												</div>
											</div>

											<div className="flex items-center gap-4">
												<div
													className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
														q.correct_rate,
													)}`}
												>
													{q.correct_rate}% đúng
												</div>
												<Badge variant={badge.variant}>{badge.label}</Badge>
												{isExpanded ? (
													<ChevronUp className="w-4 h-4 text-gray-400" />
												) : (
													<ChevronDown className="w-4 h-4 text-gray-400" />
												)}
											</div>
										</button>

										{isExpanded && (
											<div className="px-4 pb-4 border-t-2 border-gray-100 pt-3 space-y-2">
												<div className="flex items-center gap-2 text-sm">
													<span className="text-gray-500">Đáp án đúng:</span>
													<span className="font-semibold text-green-600">
														{q.dap_an_dung}
													</span>
												</div>
												<div className="flex items-center gap-2 text-sm">
													<span className="text-gray-500">Số người trả lời đúng:</span>
													<span className="font-semibold text-[#1C293C]">
														{q.correct_count}/
														{analytics.overview.total_attempts}
													</span>
												</div>
												<div className="flex items-center gap-2">
													<span className="text-sm text-gray-500">Tỷ lệ đúng:</span>
													<div className="flex items-center gap-2 flex-1 max-w-[300px]">
														<Progress
															value={q.correct_rate}
															className="flex-1 h-2"
														/>
														<span className="text-sm font-semibold text-[#1C293C]">
															{q.correct_rate}%
														</span>
													</div>
												</div>
											</div>
										)}
									</div>
								);
							})}
						</div>
					) : (
						<div className="text-center py-8">
							<p className="text-gray-400">Chưa có dữ liệu phân tích câu hỏi</p>
							<p className="text-xs text-gray-400 mt-1">
								Cần có ít nhất 1 lượt làm bài để phân tích
							</p>
						</div>
					)}
				</Card>
			</div>
		</div>
	);
};

export default TeacherQuizAnalyticsPage;