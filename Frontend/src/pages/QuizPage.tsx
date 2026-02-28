import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
	ArrowLeft,
	Check,
	ChevronLeft,
	ChevronRight,
	Clock,
	Home,
	X,
} from "lucide-react";
import ActionButton from "../components/common/ActionButton";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useMyCourses, type Lesson } from "../contexts/MyCoursesContext";

interface QuizAnswer {
	questionId: number;
	selectedOption: string;
}

const QuizPage = () => {
	const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const isTest = searchParams.get("test") === "true";
	const { getCourse } = useMyCourses();

	const course = getCourse(Number(courseId));

	const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
	const [quizzes, setQuizzes] = useState<{ id: number; question: string; options: { id: string; text: string }[]; correctAnswer: string }[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		if (course) {
			for (const chapter of course.chapters) {
				const lesson = chapter.lessons.find((l) => l.id === Number(lessonId));
				if (lesson) {
					setCurrentLesson(lesson);
					const lessonQuizzes = lesson.quizzes || [];
					setQuizzes(lessonQuizzes);
					
					if (isTest && lessonQuizzes.length > 0) {
						const testAnswers = lessonQuizzes.map((q) => ({
							questionId: q.id,
							selectedOption: q.options[0]?.id || "a"
						}));
						setAnswers(testAnswers);
						setShowResults(true);
					}
					break;
				}
			}
		}
		setIsLoading(false);
	}, [course, lessonId, isTest]);

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState<QuizAnswer[]>([]);
	const [showResults, setShowResults] = useState(false);
	const [timeLeft, setTimeLeft] = useState(600);
	const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

	useEffect(() => {
		if (showResults || timeLeft <= 0) return;
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					setShowResults(true);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
		return () => clearInterval(timer);
	}, [showResults, timeLeft]);

	const currentQuestion = quizzes[currentQuestionIndex];
	const currentAnswer = answers.find((a) => a.questionId === currentQuestion?.id);

	const handleSelectOption = (optionId: string) => {
		setAnswers((prev) => {
			const existing = prev.find((a) => a.questionId === currentQuestion.id);
			if (existing) {
				return prev.map((a) =>
					a.questionId === currentQuestion.id ? { ...a, selectedOption: optionId } : a
				);
			}
			return [...prev, { questionId: currentQuestion.id, selectedOption: optionId }];
		});
	};

	const handleNext = () => {
		if (currentQuestionIndex < quizzes.length - 1) {
			setCurrentQuestionIndex((prev) => prev + 1);
		}
	};

	const handlePrev = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex((prev) => prev - 1);
		}
	};

	const handleSubmit = () => {
		setShowResults(true);
	};

	const calculateScore = () => {
		let correct = 0;
		for (const answer of answers) {
			const question = quizzes.find((q) => q.id === answer.questionId);
			if (question && question.correctAnswer === answer.selectedOption) {
				correct++;
			}
		}
		return correct;
	};

	const score = calculateScore();
	const percentage = Math.round((score / quizzes.length) * 100);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-slate-50 flex flex-col">
				<Header />
				<div className="flex-1 flex items-center justify-center">
					<div className="text-center">
						<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
						<p className="text-slate-600">Đang tải...</p>
					</div>
				</div>
				<Footer />
			</div>
		);
	}

	if (!course || !currentLesson || quizzes.length === 0) {
		return (
			<div className="min-h-screen bg-slate-50 flex flex-col">
				<Header />
				<div className="flex-1 flex items-center justify-center">
					<div className="text-center">
						<h2 className="text-2xl font-bold text-slate-900 mb-4">Không tìm thấy quiz</h2>
						<ActionButton onClick={() => navigate(`/learn/${courseId}`)}>
							Quay lại
						</ActionButton>
					</div>
				</div>
				<Footer />
			</div>
		);
	}

	if (showResults) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
				<Header />
				<div className="max-w-2xl mx-auto px-6 py-12">
					<div className="bg-white rounded-2xl shadow-xl p-8">
						<div className="text-center mb-8">
							<div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
								percentage >= 70 ? "bg-green-100" : percentage >= 40 ? "bg-yellow-100" : "bg-red-100"
							}`}>
								{percentage >= 70 ? (
									<Check className="w-12 h-12 text-green-600" />
								) : percentage >= 40 ? (
									<Clock className="w-12 h-12 text-yellow-600" />
								) : (
									<X className="w-12 h-12 text-red-600" />
								)}
							</div>
							<h1 className="text-3xl font-bold text-slate-900 mb-2">Kết quả bài quiz</h1>
							<p className="text-slate-600">{currentLesson?.title}</p>
						</div>

						<div className="bg-slate-50 rounded-xl p-6 mb-8">
							<div className="flex items-center justify-between mb-4">
								<span className="text-lg font-medium text-slate-700">Điểm số</span>
								<span className={`text-3xl font-bold ${
									percentage >= 70 ? "text-green-600" : percentage >= 40 ? "text-yellow-600" : "text-red-600"
								}`}>{percentage}%</span>
							</div>
							<div className="w-full bg-slate-200 rounded-full h-4 mb-4">
								<div
									className={`h-4 rounded-full transition-all duration-500 ${
										percentage >= 70 ? "bg-green-500" : percentage >= 40 ? "bg-yellow-500" : "bg-red-500"
									}`}
									style={{ width: `${percentage}%` }}
								></div>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="text-slate-600">Đúng: <span className="font-semibold text-green-600">{score}</span> / {quizzes.length}</span>
								<span className="text-slate-600">Sai: <span className="font-semibold text-red-600">{quizzes.length - score}</span></span>
							</div>
						</div>

						<div className="mb-8">
							<button
								type="button"
								onClick={() => {
									if (expandedQuestions.size === quizzes.length) {
										setExpandedQuestions(new Set());
									} else {
										setExpandedQuestions(new Set(quizzes.map(q => q.id)));
									}
								}}
								className="w-full flex items-center justify-between p-4 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
							>
								<h3 className="font-semibold text-slate-900">Chi tiết đáp án</h3>
								<ChevronRight className={`w-5 h-5 text-slate-600 transition-transform ${expandedQuestions.size === quizzes.length ? 'rotate-90' : ''}`} />
							</button>
							
							{expandedQuestions.size > 0 && (
								<div className="space-y-3 mt-3">
									{quizzes.map((question, index) => {
										const answer = answers.find((a) => a.questionId === question.id);
										const isCorrect = answer?.selectedOption === question.correctAnswer;
										const isExpanded = expandedQuestions.has(question.id);
										
										return (
											<div key={question.id}>
												<button
													type="button"
													onClick={() => {
														setExpandedQuestions(prev => {
															const next = new Set(prev);
															if (next.has(question.id)) {
																next.delete(question.id);
															} else {
																next.add(question.id);
															}
															return next;
														});
													}}
													className={`w-full p-4 rounded-lg border text-left transition-all ${
														isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
													}`}
												>
													<div className="flex items-center gap-3">
														<div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
															isCorrect ? "bg-green-500" : "bg-red-500"
														}`}>
															{isCorrect ? (
																<Check className="w-4 h-4 text-white" />
															) : (
																<X className="w-4 h-4 text-white" />
															)}
														</div>
														<div className="flex-1">
															<p className="font-medium text-slate-900">
																Câu {index + 1}: {question.question}
															</p>
														</div>
														<ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
													</div>
												</button>
												
												{isExpanded && (
													<div className="mt-2 ml-9 p-3 bg-white rounded-lg border border-slate-200">
														{answer && (
															<p className="text-sm mb-2">
																<span className="text-slate-600">Bạn chọn: </span>
																<span className={isCorrect ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
																	{question.options.find((o) => o.id === answer.selectedOption)?.text}
																</span>
															</p>
														)}
														{!isCorrect && (
															<p className="text-sm">
																<span className="text-slate-600">Đáp án đúng: </span>
																<span className="text-green-600 font-medium">
																	{question.options.find((o) => o.id === question.correctAnswer)?.text}
																</span>
															</p>
														)}
													</div>
												)}
											</div>
										);
									})}
								</div>
							)}
						</div>

						<div className="flex gap-4">
							<ActionButton
								variant="outline"
								className="flex-1"
								onClick={() => navigate(`/learn/${courseId}`)}
							>
								<Home className="w-4 h-4 mr-2" />
								Quay lại bài học
							</ActionButton>
							<ActionButton
								className="flex-1"
								onClick={() => {
									setShowResults(false);
									setCurrentQuestionIndex(0);
									setAnswers([]);
								}}
							>
								Làm lại
							</ActionButton>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col">
			<Header />
			<div className="flex-1">
			<header className="bg-white border-b border-slate-200 sticky top-0 z-10">
				<div className="max-w-4xl mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<button
								type="button"
								onClick={() => navigate(`/learn/${courseId}`)}
								className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
							>
								<ArrowLeft className="w-5 h-5" />
								<span>Quay lại</span>
							</button>
							<div className="h-6 w-px bg-slate-200"></div>
							<div>
								<h1 className="font-semibold text-slate-900">{currentLesson?.title}</h1>
								<p className="text-sm text-slate-500">Quiz - {quizzes.length} câu</p>
							</div>
						</div>
						<div className="flex items-center gap-2 text-slate-600">
							<Clock className="w-5 h-5" />
							<span className="font-medium">
								{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
							</span>
						</div>
					</div>
				</div>
			</header>

			<div className="max-w-3xl mx-auto px-6 py-8">
				<div className="mb-6">
					<div className="flex items-center justify-between text-sm text-slate-600 mb-2">
						<span>Câu {currentQuestionIndex + 1} / {quizzes.length}</span>
						<span>{answers.length} / {quizzes.length} đã trả lời</span>
					</div>
					<div className="w-full bg-slate-200 rounded-full h-2">
						<div
							className="h-2 bg-blue-600 rounded-full transition-all duration-300"
							style={{ width: `${((currentQuestionIndex + 1) / quizzes.length) * 100}%` }}
						></div>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
					<h2 className="text-xl font-semibold text-slate-900 mb-6">
						{currentQuestion?.question}
					</h2>

					<div className="space-y-3">
						{currentQuestion?.options.map((option) => (
							<button
								key={option.id}
								type="button"
								onClick={() => handleSelectOption(option.id)}
								className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
									currentAnswer?.selectedOption === option.id
										? "border-blue-500 bg-blue-50"
										: "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
								}`}
							>
								<div className="flex items-center gap-3">
									<div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
										currentAnswer?.selectedOption === option.id
											? "border-blue-500 bg-blue-500"
											: "border-slate-300"
									}`}>
										{currentAnswer?.selectedOption === option.id && (
											<div className="w-2 h-2 bg-white rounded-full"></div>
										)}
									</div>
									<span className="text-slate-900">{option.text}</span>
								</div>
							</button>
						))}
					</div>
				</div>

				<div className="flex items-center justify-between">
					<ActionButton
						variant="outline"
						disabled={currentQuestionIndex === 0}
						onClick={handlePrev}
					>
						<ChevronLeft className="w-4 h-4 mr-2" />
						Câu trước
					</ActionButton>

					<div className="flex gap-2">
						{quizzes.map((_, index) => (
							<button
								key={index}
								type="button"
								onClick={() => setCurrentQuestionIndex(index)}
								className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
									index === currentQuestionIndex
										? "bg-blue-600 text-white"
										: answers.find((a) => a.questionId === quizzes[index].id)
											? "bg-green-100 text-green-700"
											: "bg-slate-100 text-slate-600 hover:bg-slate-200"
								}`}
							>
								{index + 1}
							</button>
						))}
					</div>

					{currentQuestionIndex === quizzes.length - 1 ? (
						<ActionButton
							disabled={answers.length < quizzes.length}
							onClick={handleSubmit}
						>
							Nộp bài
							<Check className="w-4 h-4 ml-2" />
						</ActionButton>
					) : (
						<ActionButton onClick={handleNext}>
							Câu tiếp
							<ChevronRight className="w-4 h-4 ml-2" />
						</ActionButton>
					)}
				</div>
			</div>
			</div>
			<Footer />
		</div>
	);
};

export default QuizPage;
