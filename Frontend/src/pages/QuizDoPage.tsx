import { AlertCircle, ChevronLeft, Clock, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCurrentUser, getLesson, getQuizQuestions, submitQuizAttempt } from "../api";
import { Button, Card, Loader, Progress } from "../components/common";

export const QuizDoPage: React.FC = () => {
	const { courseId, lessonId } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [quizId, setQuizId] = useState<number | null>(null);
	const [questions, setQuestions] = useState<any[]>([]);
	const [answers, setAnswers] = useState<(string | undefined)[]>([]);

	const getOptionValue = (option: any): string =>
		typeof option === 'object' && option !== null ? option.id : String(option);
	const getOptionText = (option: any): string =>
		typeof option === 'object' && option !== null ? option.text : String(option);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchQuiz = async () => {
			if (!lessonId) {
				setLoading(false);
				return;
			}
			try {
				setError(null);
				const lessonData = await getLesson(Number(lessonId));
				const lesson = lessonData.lesson;

				if (lesson.quizzes && lesson.quizzes.length > 0) {
					const quiz = lesson.quizzes[0];
					setQuizId(quiz.id);
					const questionsData = await getQuizQuestions(quiz.id);
					const qs = questionsData.cau_hoi || [];
					setQuestions(qs);
					setAnswers(new Array(qs.length).fill(undefined));
				} else {
					setError("Không tìm thấy bài kiểm tra cho bài học này");
				}
			} catch (error) {
				console.error("Error fetching quiz:", error);
				setError("Không thể tải bài kiểm tra");
			} finally {
				setLoading(false);
			}
		};
		fetchQuiz();
	}, [lessonId]);

	if (loading) return <Loader />;

	if (error) {
		return (
			<div className="min-h-screen bg-[#F8F6F3] p-4 flex items-center justify-center">
				<Card className="p-8 text-center max-w-md">
					<AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
					<p className="font-['Inter', sans-serif] text-red-500 mb-4">{error}</p>
					<Link to={`/learn/${courseId}/${lessonId}`}>
						<Button variant="primary">Quay lại bài học</Button>
					</Link>
				</Card>
			</div>
		);
	}

	const currentQ = questions[currentQuestion];
	const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

	const handleSelectAnswer = (optionText: string) => {
		const newAnswers = [...answers];
		newAnswers[currentQuestion] = optionText;
		setAnswers(newAnswers);
	};

	const handleNext = () => {
		if (currentQuestion < questions.length - 1) {
			setCurrentQuestion(currentQuestion + 1);
		}
	};

	const handlePrev = () => {
		if (currentQuestion > 0) {
			setCurrentQuestion(currentQuestion - 1);
		}
	};

	const handleSubmit = async () => {
		if (!quizId || submitting) return;
		const user = getCurrentUser();
		if (!user) {
			setError("Vui lòng đăng nhập để nộp bài");
			return;
		}

		setSubmitting(true);
		setError(null);

		try {
			const formattedAnswers = questions.map((q: any, i: number) => ({
				questionId: q.id,
				answer: answers[i] || '',
			}));

			const data = await submitQuizAttempt(quizId, user.id, formattedAnswers);
			navigate(`/quiz/${courseId}/${lessonId}/result?attemptId=${data.attempt.id}`);
		} catch (err: any) {
			const message = err?.message || '';
			if (message.includes('cần hoàn thành')) {
				setError('Bạn cần hoàn thành bài học trước để làm bài kiểm tra này');
			} else {
				setError(message || 'Không thể nộp bài. Vui lòng thử lại');
			}
		} finally {
			setSubmitting(false);
		}
	};

	const answeredCount = answers.filter((a) => a !== undefined).length;

	return (
		<div className="min-h-screen bg-[#F8F6F3]">
			{/* Header */}
			<div className="bg-white border-b-2 border-[#1C293C] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
				<Link
					to={`/learn/${courseId}/${lessonId}`}
					className="flex items-center gap-2 text-[#1C293C]"
				>
					<ChevronLeft className="w-5 h-5" />
					<span className="font-['Inter', sans-serif]">Thoát</span>
				</Link>
				<div className="flex items-center gap-2 text-[#6B7280]">
					<Clock className="w-4 h-4" />
					<span className="font-['Inter', sans-serif] text-sm">
						{questions.length} câu hỏi
					</span>
				</div>
			</div>

			<div className="max-w-2xl mx-auto p-4 space-y-6">
				{/* Progress */}
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="font-['Inter', sans-serif] text-sm text-[#6B7280]">
							Câu {currentQuestion + 1}/{questions.length}
						</span>
						<span className="font-['Inter', sans-serif] text-sm text-[#6B7280]">
							{answeredCount}/{questions.length} đã trả lời
						</span>
					</div>
					<Progress value={progress} className="h-2" />
				</div>

				{/* Question */}
				<Card className="p-6">
					<div className="mb-4">
						<div className="flex items-center gap-2 mb-2">
							<Zap className="w-5 h-5 text-[#49B6E5]" />
							<span className="font-['Inter', sans-serif] text-xs text-[#6B7280]">
								Câu hỏi
							</span>
						</div>
						<h2 className="font-['Inter', sans-serif] text-lg text-[#1C293C]">
							{currentQ.question}
						</h2>
					</div>

					<div className="space-y-3">
						{currentQ.lua_chon.map((option: any, optIdx: number) => {
							const optVal = getOptionValue(option);
							const optText = getOptionText(option);
							const isSelected = answers[currentQuestion] === optVal;
							return (
								<button
									key={optIdx}
									type="button"
									onClick={() => handleSelectAnswer(optVal)}
									className={`w-full p-4 text-left rounded-[8px] border-2 font-['Inter', sans-serif] transition-colors ${
										isSelected
											? "border-[#49B6E5] bg-[#E8F6FC] text-[#1C293C]"
											: "border-[#E5E1DC] text-[#6B7280] hover:border-[#1C293C]"
									}`}
								>
									<span className="mr-3 font-semibold">
										{String.fromCharCode(65 + optIdx)}.
									</span>
									{optText}
								</button>
							);
						})}
					</div>
				</Card>

				{/* Navigation */}
				<div className="flex gap-3">
					<Button
						variant="secondary"
						onClick={handlePrev}
						disabled={currentQuestion === 0}
						className="flex-1"
					>
						<ChevronLeft className="w-4 h-4 mr-1" /> Trước
					</Button>

					{currentQuestion < questions.length - 1 ? (
						<Button variant="primary" onClick={handleNext} className="flex-1">
							Tiếp <ChevronLeft className="w-4 h-4 mr-1 rotate-180" />
						</Button>
					) : (
						<Button
							variant="primary"
							onClick={handleSubmit}
							disabled={answeredCount !== questions.length || submitting}
							className="flex-1"
						>
							{submitting ? 'Đang nộp...' : 'Nộp bài'}
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};

export default QuizDoPage;
