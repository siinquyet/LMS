import { Award, AlertCircle, ChevronLeft, Eye, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getCurrentUser, getLatestQuizAttempt, getLesson, getQuizAttemptReview } from "../api";
import { Button, Card, Loader } from "../components/common";

export const QuizResultPage: React.FC = () => {
	const { courseId, lessonId } = useParams();
	const [searchParams] = useSearchParams();
	const attemptIdParam = searchParams.get('attemptId');

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [attemptData, setAttemptData] = useState<{
		attempt: { id: number; diem: number };
		questions: Array<{ id: number; cau_hoi: string; lua_chon: string[]; dap_an_dung: string; cau_tra_loi_cua_toi: string | null; dung_sai: boolean }>;
	} | null>(null);

	useEffect(() => {
		const fetchResult = async () => {
			try {
				setLoading(true);
				setError(null);

				let attemptId: number | null = attemptIdParam ? Number(attemptIdParam) : null;

				// If no attemptId in URL, get latest attempt
				if (!attemptId && lessonId) {
					const user = getCurrentUser();
					if (!user) {
						setError("Vui lòng đăng nhập");
						return;
					}

					const lessonData = await getLesson(Number(lessonId));
					const quiz = lessonData?.lesson?.quizzes?.[0];
					if (quiz) {
						const latestData = await getLatestQuizAttempt(quiz.id, user.id);
						attemptId = latestData?.attempt?.id || null;
					}
				}

				if (!attemptId) {
					setError("Không tìm thấy kết quả bài làm");
					return;
				}

				const reviewData = await getQuizAttemptReview(attemptId);
				setAttemptData(reviewData);
			} catch (err) {
				console.error("Error fetching result:", err);
				setError("Không thể tải kết quả");
			} finally {
				setLoading(false);
			}
		};
		fetchResult();
	}, [lessonId, attemptIdParam]);

	if (loading) return (
		<div className="min-h-screen bg-[#F8F6F3] p-4 flex items-center justify-center">
			<Loader />
		</div>
	);

	if (error || !attemptData) {
		return (
			<div className="min-h-screen bg-[#F8F6F3] p-4 flex items-center justify-center">
				<Card className="p-8 text-center max-w-md">
					<AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
					<p className="font-['Inter', sans-serif] text-[#6B7280] mb-4">{error || "Không có kết quả"}</p>
					<Link to={`/quiz/${courseId}/${lessonId}/do`}>
						<Button variant="primary">Làm bài</Button>
					</Link>
				</Card>
			</div>
		);
	}

	const { attempt, questions } = attemptData;
	const total = questions.length;
	const correctCount = questions.filter(q => q.dung_sai).length;
	const wrongCount = total - correctCount;

	// Convert 10-point scale to percentage for display
	const displayScore = correctCount;
	const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
	const passed = percentage >= 70;

	return (
		<div className="min-h-screen bg-[#F8F6F3]">
			<div className="bg-white border-b-2 border-[#1C293C] px-4 py-3">
				<Link
					to={`/learn/${courseId}/${lessonId}`}
					className="flex items-center gap-2 text-[#1C293C]"
				>
					<ChevronLeft className="w-5 h-5" />
					<span className="font-['Inter', sans-serif]">Quay lại bài học</span>
				</Link>
			</div>

			<div className="max-w-2xl mx-auto p-4 space-y-6">
				<Card className="p-8 text-center">
					<div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? "bg-green-100" : "bg-orange-100"}`}>
						<Award className={`w-10 h-10 ${passed ? "text-green-600" : "text-orange-500"}`} />
					</div>
					<h2 className="font-['Inter', sans-serif] text-xl text-[#1C293C] mb-2">Kết quả bài làm</h2>
					<p className="font-['Inter', sans-serif] text-4xl font-bold text-[#1C293C] mb-2">
						{displayScore}/{total}
					</p>
					<p className={`font-['Inter', sans-serif] text-2xl mb-4 ${passed ? "text-green-600" : "text-orange-500"}`}>
						{percentage}% {passed ? "Đạt" : "Chưa đạt"}
					</p>
				</Card>

				<Card className="p-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="text-center p-3 bg-green-50 rounded-[8px]">
							<p className="font-['Inter', sans-serif] text-2xl text-green-600 font-bold">{correctCount}</p>
							<p className="font-['Inter', sans-serif] text-xs text-[#6B7280]">Đúng</p>
						</div>
						<div className="text-center p-3 bg-red-50 rounded-[8px]">
							<p className="font-['Inter', sans-serif] text-2xl text-red-500 font-bold">{wrongCount}</p>
							<p className="font-['Inter', sans-serif] text-xs text-[#6B7280]">Sai</p>
						</div>
					</div>
				</Card>

				<div className="space-y-3">
					<Link to={`/quiz/${courseId}/${lessonId}/review?attemptId=${attempt.id}`} className="block">
						<Button variant="primary" className="w-full">
							<Eye className="w-4 h-4 mr-2" /> Xem chi tiết
						</Button>
					</Link>

					<div className="flex gap-3">
						<Link to={`/learn/${courseId}/${lessonId}`} className="flex-1">
							<Button variant="secondary" className="w-full">
								<ChevronLeft className="w-4 h-4 mr-1" /> Bài học
							</Button>
						</Link>
						<Link to={`/quiz/${courseId}/${lessonId}/do`} className="flex-1">
							<Button variant="outline" className="w-full">
								<RefreshCcw className="w-4 h-4 mr-1" /> Làm lại
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default QuizResultPage;
