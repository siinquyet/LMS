import { ChevronLeft, Clock, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getLesson, getQuizQuestions } from "../api";
import { Button, Card, Loader, Progress } from "../components/common";
import { learningQuizMock as mockQuiz } from "../mockData";

interface QuizQuestion {
	id: number;
	question: string;
	options: string[];
	correct: number;
}

interface Quiz {
	id: number;
	title: string;
	courseName: string;
	timeLimit: number;
	questions: QuizQuestion[];
}

export const QuizDoPage: React.FC = () => {
	const { courseId, lessonId } = useParams();
	const [loading, setLoading] = useState(true);
	const [quizData, setQuizData] = useState<any>(null);
	const [answers, setAnswers] = useState<number[]>([]);
	const [currentQuestion, setCurrentQuestion] = useState(0);

	useEffect(() => {
		const fetchQuiz = async () => {
			if (!lessonId) {
				setLoading(false);
				return;
			}
			try {
				const lessonData = await getLesson(Number(lessonId));
				const lesson = lessonData.bai_hoc;

				if (lesson.quizzes && lesson.quizzes.length > 0) {
					const quiz = lesson.quizzes[0];
					const questionsData = await getQuizQuestions(quiz.id);
					setQuizData({
						...quiz,
						questions: questionsData.cau_hoi || [],
					});
				} else {
					setQuizData(mockQuiz);
				}
			} catch (error) {
				console.error("Error fetching quiz:", error);
				setQuizData(mockQuiz);
			} finally {
				setLoading(false);
			}
		};
		fetchQuiz();
	}, [lessonId]);

	if (loading) return <Loader />;

	const questions = quizData?.questions || mockQuiz.questions;
	const currentQ = questions[currentQuestion];
	const progress = ((currentQuestion + 1) / questions.length) * 100;

	const handleSelectAnswer = (optionIndex: number) => {
		const newAnswers = [...answers];
		newAnswers[currentQuestion] = optionIndex;
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

	const handleSubmit = () => {
		const score = answers.filter(
			(ans, idx) => ans === questions[idx].correct,
		).length;
		const result = { score, total: questions.length };
		localStorage.setItem(
			"quizResult",
			JSON.stringify({ answers, result, quizId: mockQuiz.id }),
		);
		window.location.href = `/quiz/${courseId}/${lessonId}/result`;
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
						{mockQuiz.timeLimit / 60} phút
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
						{currentQ.options.map((option, optIdx) => {
							const isSelected = answers[currentQuestion] === optIdx;
							return (
								<button
									key={optIdx}
									type="button"
									onClick={() => handleSelectAnswer(optIdx)}
									className={`w-full p-4 text-left rounded-[8px] border-2 font-['Inter', sans-serif] transition-colors ${
										isSelected
											? "border-[#49B6E5] bg-[#E8F6FC] text-[#1C293C]"
											: "border-[#E5E1DC] text-[#6B7280] hover:border-[#1C293C]"
									}`}
								>
									<span className="mr-3 font-semibold">
										{String.fromCharCode(65 + optIdx)}.
									</span>
									{option}
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
							disabled={answeredCount !== questions.length}
							className="flex-1"
						>
							Nộp bài
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};

export default QuizDoPage;
