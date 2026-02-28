import {
	ArrowLeft,
	BookOpen,
	Calendar,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	Clock,
	FileText,
	Play,
	Upload,
	User,
	X,
	Check,
	ThumbsUp,
	ThumbsDown
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ActionButton from "../components/common/ActionButton";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import {
	type LessonExercise,
	type QuizQuestion,
	useMyCourses,
} from "../contexts/MyCoursesContext";

type TabType = "overview" | "docs" | "comments" | "notes" | "exercises" | "quiz" | "recommended" | "quizHistory";

const LearningPage = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { getCourse, updateProgress } = useMyCourses();
	const course = getCourse(Number(id));

	const [currentLessonId, setCurrentLessonId] = useState<number | null>(
		course?.chapters[0]?.lessons[0]?.id || null,
	);
	const [activeTab, setActiveTab] = useState<TabType>("overview");
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [collapsedChapters, setCollapsedChapters] = useState<Set<number>>(new Set());

	const toggleChapter = (chapterId: number) => {
		const newCollapsed = new Set(collapsedChapters);
		if (newCollapsed.has(chapterId)) {
			newCollapsed.delete(chapterId);
		} else {
			newCollapsed.add(chapterId);
		}
		setCollapsedChapters(newCollapsed);
	};

	const [quizHistory] = useState([
		{
			id: 1,
			quizTitle: "React Fundamentals",
			score: 70,
			totalQuestions: 10,
			completedAt: "2 ngày trước",
			wrongAnswers: [
				{
					question: "Cái nào không phải là lifecycle method trong React?",
					yourAnswer: "componentDidMount",
					correctAnswer: "onMount",
					explanation: "componentDidMount, componentDidUpdate, componentWillUnmount là các lifecycle methods. onMount không tồn tại trong React.",
				},
				{
					question: "useState dùng để làm gì?",
					yourAnswer: "Gọi API",
					correctAnswer: "Quản lý state trong component",
					explanation: "useState dùng để quản lý local state trong functional component.",
				},
				{
					question: "Cách nào để pass data từ parent xuống child?",
					yourAnswer: "useContext",
					correctAnswer: "Props",
					explanation: "Props là cách chính để pass data từ parent component xuống child component.",
				},
			],
		},
		{
			id: 2,
			quizTitle: "JavaScript Basics",
			score: 85,
			totalQuestions: 10,
			completedAt: "5 ngày trước",
			wrongAnswers: [
				{
					question: "Cái nào là closure?",
					yourAnswer: "function được khai báo",
					correctAnswer: "Function có quyền truy cập biến từ scope bên ngoài",
					explanation: "Closure là function có quyền truy cập variables từ outer scope ngay cả khi outer function đã return.",
				},
			],
		},
	]);

	const recommendedCourses = [
		{
			id: 1,
			title: "React Advanced Patterns",
			instructor: "Nguyễn Văn A",
			rating: 4.8,
			students: 1230,
			price: 299000,
			image: "from-purple-500 to-indigo-600",
		},
		{
			id: 2,
			title: "TypeScript for React",
			instructor: "Trần Thị B",
			rating: 4.9,
			students: 890,
			price: 199000,
			image: "from-cyan-500 to-blue-600",
		},
		{
			id: 3,
			title: "Next.js 14 Complete Guide",
			instructor: "Lê Văn C",
			rating: 4.7,
			students: 2100,
			price: 399000,
			image: "from-green-500 to-teal-600",
		},
	];

	const [selectedQuizResult, setSelectedQuizResult] = useState<number | null>(null);
	
	const [comments, setComments] = useState([
		{
			id: 1,
			user: "Nguyễn Văn A",
			avatar: "from-blue-500 to-indigo-600",
			time: "2 giờ trước",
			content: "Bài giảng rất hay, cảm ơn thầy!",
			likes: 12,
			dislikes: 0,
			replies: [
				{
					id: 101,
					user: "Giảng viên",
					avatar: "from-green-500 to-teal-600",
					time: "1 giờ trước",
					content: "Cảm ơn bạn! Chúc bạn học tốt!",
					likes: 3,
					dislikes: 0,
				},
			],
		},
		{
			id: 2,
			user: "Trần Thị B",
			avatar: "from-pink-500 to-rose-600",
			time: "5 giờ trước",
			content: "Cho mình hỏi useState và useEffect khác nhau như thế nào?",
			likes: 5,
			dislikes: 0,
			replies: [],
		},
	]);
	const [newComment, setNewComment] = useState("");
	const [replyingTo, setReplyingTo] = useState<number | null>(null);
	const [replyContent, setReplyContent] = useState("");
	const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
	const [dislikedComments, setDislikedComments] = useState<Set<number>>(new Set());

	const [completedLessons, setCompletedLessons] = useState<Set<number>>(() => {
		const completed = new Set<number>();
		if (course) {
			for (const ch of course.chapters) {
				for (const l of ch.lessons) {
					if (l.completed) completed.add(l.id);
				}
			}
		}
		return completed;
	});

	if (!course) {
		return (
			<div className="min-h-screen bg-slate-50 flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-slate-900 mb-2">
						Không tìm thấy khóa học
					</h2>
					<p className="text-slate-500 mb-4">Bạn chưa mua khóa học này</p>
					<ActionButton>
						<Link to="/my-courses">Khóa học của tôi</Link>
					</ActionButton>
				</div>
			</div>
		);
	}

	const currentLesson = course.chapters
		.flatMap((ch) => ch.lessons)
		.find((l) => l.id === currentLessonId);

	const totalLessons = course.chapters.reduce(
		(acc, ch) => acc + ch.lessons.length,
		0,
	);
	const completedCount = completedLessons.size;
	const progress = Math.round((completedCount / totalLessons) * 100);

	const handleMarkComplete = () => {
		if (currentLessonId) {
			const newCompleted = new Set(completedLessons);
			if (newCompleted.has(currentLessonId)) {
				newCompleted.delete(currentLessonId);
			} else {
				newCompleted.add(currentLessonId);
			}
			setCompletedLessons(newCompleted);
			updateProgress(
				course.id,
				currentLessonId,
				!completedLessons.has(currentLessonId),
			);
		}
	};

	const getNextLesson = () => {
		const allLessons = course.chapters.flatMap((ch) => ch.lessons);
		const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);
		if (currentIndex < allLessons.length - 1) {
			return allLessons[currentIndex + 1];
		}
		return null;
	};

	const handleNextLesson = () => {
		const next = getNextLesson();
		if (next) {
			setCurrentLessonId(next.id);
		}
	};

	const quizzes: QuizQuestion[] = currentLesson?.quizzes || [
		{
			id: 1,
			question: "React là gì?",
			options: [
				{ id: "a", text: "A. Một ngôn ngữ lập trình" },
				{ id: "b", text: "B. Một thư viện JavaScript" },
				{ id: "c", text: "C. Một framework PHP" },
				{ id: "d", text: "D. Một database" },
			],
			correctAnswer: "b",
		},
		{
			id: 2,
			question: "useState dùng để làm gì?",
			options: [
				{ id: "a", text: "A. Gọi API" },
				{ id: "b", text: "B. Quản lý state trong component" },
				{ id: "c", text: "C. Routing" },
				{ id: "d", text: "D. Styling" },
			],
			correctAnswer: "b",
		},
	];

	const exercises: LessonExercise[] = currentLesson?.exercises || [
		{
			id: 1,
			title: "Giới thiệu bản thân",
			description: "Viết một đoạn giới thiệu về bản thân bạn",
			required: true,
			deadline: "2026-04-05",
		},
	];

	const [uploadedFiles, setUploadedFiles] = useState<Record<number, { name: string; size: number }>>({});
	const [submittedExercises, setSubmittedExercises] = useState<Set<number>>(new Set());

	const handleFileChange = (exerciseId: number, event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setUploadedFiles((prev) => ({
				...prev,
				[exerciseId]: { name: file.name, size: file.size },
			}));
		}
	};

	const handleSubmitExercise = (exerciseId: number) => {
		if (uploadedFiles[exerciseId]) {
			setSubmittedExercises((prev) => new Set(prev).add(exerciseId));
			alert(`Đã nộp bài tập: ${uploadedFiles[exerciseId].name}`);
		} else {
			alert("Vui lòng chọn file trước khi nộp!");
		}
	};

	const handleCancelSubmit = (exerciseId: number) => {
		setSubmittedExercises((prev) => {
			const newSet = new Set(prev);
			newSet.delete(exerciseId);
			return newSet;
		});
		setUploadedFiles((prev) => {
			const newFiles = { ...prev };
			delete newFiles[exerciseId];
			return newFiles;
		});
	};

	const tabs: { key: TabType; label: string }[] = [
		{ key: "overview", label: "Tổng quan" },
		{ key: "docs", label: "Tài liệu" },
		{ key: "comments", label: "Bình luận" },
		{ key: "notes", label: "Ghi chú" },
		{ key: "exercises", label: "Bài tập" },
		{ key: "quiz", label: "Quiz" },
		{ key: "quizHistory", label: "Lịch sử" },
	];

	const renderTabContent = () => {
		switch (activeTab) {
			case "overview":
				return (
					<div>
						<h3 className="text-lg font-semibold text-slate-900 mb-4">
							Về bài học này
						</h3>
						<p className="text-slate-600 leading-relaxed">
							Đây là nội dung bài học. Video bài giảng giúp bạn hiểu rõ hơn về
							chủ đề được học. Hãy chú ý theo dõi và hoàn thành các bài tập để
							củng cố kiến thức.
						</p>
					</div>
				);
			case "docs":
				return (
					<div>
						<h3 className="text-lg font-semibold text-slate-900 mb-4">
							Tài liệu bài học
						</h3>
						<div className="space-y-3">
							<div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
								<FileText className="w-8 h-8 text-blue-500" />
								<div className="flex-1">
									<p className="text-slate-900 font-medium">Tài liệu slide</p>
									<p className="text-slate-500 text-sm">PDF - 2.5 MB</p>
								</div>
								<button
									type="button"
									className="text-blue-600 hover:text-blue-700 font-medium"
								>
									Tải
								</button>
							</div>
							<div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
								<BookOpen className="w-8 h-8 text-green-500" />
								<div className="flex-1">
									<p className="text-slate-900 font-medium">Sách tham khảo</p>
									<p className="text-slate-500 text-sm">PDF - 5.2 MB</p>
								</div>
								<button
									type="button"
									className="text-blue-600 hover:text-blue-700 font-medium"
								>
									Tải
								</button>
							</div>
						</div>
					</div>
				);
			case "comments": {
				const handleLike = (commentId: number) => {
					if (likedComments.has(commentId)) {
						setLikedComments((prev) => {
							const next = new Set(prev);
							next.delete(commentId);
							return next;
						});
						setComments((prev) =>
							prev.map((c) =>
								c.id === commentId ? { ...c, likes: c.likes - 1 } : c
							)
						);
					} else {
						setLikedComments((prev) => new Set(prev).add(commentId));
						setDislikedComments((prev) => {
							const next = new Set(prev);
							next.delete(commentId);
							return next;
						});
						setComments((prev) =>
							prev.map((c) =>
								c.id === commentId
									? { ...c, likes: c.likes + 1, dislikes: dislikedComments.has(commentId) ? c.dislikes - 1 : c.dislikes }
									: c
							)
						);
					}
				};

				const handleDislike = (commentId: number) => {
					if (dislikedComments.has(commentId)) {
						setDislikedComments((prev) => {
							const next = new Set(prev);
							next.delete(commentId);
							return next;
						});
						setComments((prev) =>
							prev.map((c) =>
								c.id === commentId ? { ...c, dislikes: c.dislikes - 1 } : c
							)
						);
					} else {
						setDislikedComments((prev) => new Set(prev).add(commentId));
						setLikedComments((prev) => {
							const next = new Set(prev);
							next.delete(commentId);
							return next;
						});
						setComments((prev) =>
							prev.map((c) =>
								c.id === commentId
									? { ...c, dislikes: c.dislikes + 1, likes: likedComments.has(commentId) ? c.likes - 1 : c.likes }
									: c
							)
						);
					}
				};

				const handleReply = (commentId: number) => {
					if (replyingTo === commentId) {
						setReplyingTo(null);
						setReplyContent("");
					} else {
						setReplyingTo(commentId);
						setReplyContent("");
					}
				};

				const handleSubmitReply = (commentId: number) => {
					if (!replyContent.trim()) return;
					setComments((prev) =>
						prev.map((c) =>
							c.id === commentId
								? {
										...c,
										replies: [
											...c.replies,
											{
												id: Date.now(),
												user: "Bạn",
												avatar: "from-blue-500 to-indigo-600",
												time: "Vừa xong",
												content: replyContent,
												likes: 0,
												dislikes: 0,
											},
										],
								  }
								: c
						)
					);
					setReplyingTo(null);
					setReplyContent("");
				};

				const handleReport = (_commentId: number) => {
					alert("Đã báo cáo bình luận. Cảm ơn bạn!");
				};

				const handleSubmitComment = () => {
					if (!newComment.trim()) return;
					setComments((prev) => [
						...prev,
						{
							id: Date.now(),
							user: "Bạn",
							avatar: "from-blue-500 to-indigo-600",
							time: "Vừa xong",
							content: newComment,
							likes: 0,
							dislikes: 0,
							replies: [],
						},
					]);
					setNewComment("");
				};

				return (
					<div>
						<h3 className="text-lg font-semibold text-slate-900 mb-4">
							Bình luận ({comments.length})
						</h3>
						<div className="space-y-4 mb-6">
							{comments.map((comment) => (
								<div key={comment.id} className="border-b border-slate-100 pb-4 last:border-0">
									<div className="flex gap-3">
										<div className={`w-10 h-10 bg-gradient-to-r ${comment.avatar} rounded-full flex items-center justify-center shrink-0`}>
											<User className="w-5 h-5 text-white" />
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<span className="font-medium text-slate-900">{comment.user}</span>
												<span className="text-xs text-slate-400">- {comment.time}</span>
											</div>
											<p className="text-slate-600 text-sm mb-2">{comment.content}</p>
											<div className="flex items-center gap-4">
												<button
													type="button"
													onClick={() => handleLike(comment.id)}
													className={`flex items-center gap-1 text-sm ${
														likedComments.has(comment.id)
															? "text-blue-600"
															: "text-slate-400 hover:text-blue-600"
													}`}
												>
													<ThumbsUp className="w-4 h-4" />
													<span>{comment.likes}</span>
												</button>
												<button
													type="button"
													onClick={() => handleDislike(comment.id)}
													className={`flex items-center gap-1 text-sm ${
														dislikedComments.has(comment.id)
															? "text-red-600"
															: "text-slate-400 hover:text-red-600"
													}`}
												>
													<ThumbsDown className="w-4 h-4" />
													<span>{comment.dislikes}</span>
												</button>
												<button
													type="button"
													onClick={() => handleReply(comment.id)}
													className="text-sm text-slate-400 hover:text-blue-600"
												>
													Trả lời
												</button>
												<button
													type="button"
													onClick={() => handleReport(comment.id)}
													className="text-sm text-slate-400 hover:text-red-600"
												>
													Báo cáo
												</button>
											</div>
											{replyingTo === comment.id && (
												<div className="mt-3 ml-4">
													<textarea
														placeholder="Viết trả lời..."
														value={replyContent}
														onChange={(e) => setReplyContent(e.target.value)}
														className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm"
														rows={2}
													/>
													<div className="flex gap-2 mt-2">
														<ActionButton size="sm" onClick={() => handleSubmitReply(comment.id)}>
															Gửi
														</ActionButton>
														<button
															type="button"
															onClick={() => setReplyingTo(null)}
															className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700"
														>
															Hủy
														</button>
													</div>
												</div>
											)}
											{comment.replies.length > 0 && (
												<div className="mt-3 ml-4 space-y-3 border-l-2 border-slate-200 pl-4">
													{comment.replies.map((reply) => (
														<div key={reply.id} className="flex gap-2">
															<div className={`w-8 h-8 bg-gradient-to-r ${reply.avatar} rounded-full flex items-center justify-center shrink-0`}>
																<User className="w-4 h-4 text-white" />
															</div>
															<div className="flex-1">
																<div className="flex items-center gap-2 mb-1">
																	<span className="font-medium text-slate-900 text-sm">{reply.user}</span>
																	<span className="text-xs text-slate-400">- {reply.time}</span>
																</div>
																<p className="text-slate-600 text-sm">{reply.content}</p>
															</div>
														</div>
													))}
												</div>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
						<textarea
							placeholder="Viết bình luận..."
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							className="w-full p-4 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
							rows={4}
						/>
						<ActionButton className="mt-3" onClick={handleSubmitComment}>
							Gửi bình luận
						</ActionButton>
					</div>
				);
			}
			case "notes":
				return (
					<div>
						<h3 className="text-lg font-semibold text-slate-900 mb-4">
							Ghi chú theo thời gian video
						</h3>
						<div className="space-y-3">
							<button type="button" className="w-full text-left p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-colors">
								<div className="flex items-center gap-2 mb-1">
									<span className="text-blue-600 font-medium text-sm">02:15</span>
									<span className="text-slate-500 text-xs">- Khái niệm cơ bản</span>
								</div>
								<p className="text-slate-700 text-sm">React sử dụng Virtual DOM để tối ưu hóa việc render</p>
							</button>
							<button type="button" className="w-full text-left p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-colors">
								<div className="flex items-center gap-2 mb-1">
									<span className="text-blue-600 font-medium text-sm">05:30</span>
									<span className="text-slate-500 text-xs">- Component lifecycle</span>
								</div>
								<p className="text-slate-700 text-sm">Các giai đoạn: mount, update, unmount</p>
							</button>
							<button type="button" className="w-full text-left p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-colors">
								<div className="flex items-center gap-2 mb-1">
									<span className="text-blue-600 font-medium text-sm">10:45</span>
									<span className="text-slate-500 text-xs">- useState hook</span>
								</div>
								<p className="text-slate-700 text-sm">Dùng để quản lý state trong functional component</p>
							</button>
						</div>
						<div className="mt-4 pt-4 border-t border-slate-200">
							<textarea
								placeholder="Thêm ghi chú tại thời điểm hiện tại..."
								className="w-full p-4 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
								rows={3}
							/>
							<div className="flex items-center justify-between mt-3">
								<span className="text-sm text-slate-500">Thời điểm: 00:00</span>
								<ActionButton size="sm">Lưu ghi chú</ActionButton>
							</div>
						</div>
					</div>
				);
			case "exercises":
				return (
					<div>
						<h3 className="text-lg font-semibold text-slate-900 mb-4">
							Bài tập
						</h3>
						<div className="space-y-4">
							{exercises.map((exercise) => (
								<div
									key={exercise.id}
									className="p-4 bg-slate-50 rounded-lg border border-slate-200"
								>
									<div className="flex items-center gap-2 mb-2">
										<h4 className="font-medium text-slate-900">
											{exercise.title}
										</h4>
										{exercise.required && (
											<span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded">
												Bắt buộc
											</span>
										)}
									</div>
									<p className="text-slate-600 text-sm mb-4">
										{exercise.description}
									</p>
									{exercise.deadline && (
										<div className="flex items-center gap-2 mb-4 text-sm">
											<Calendar className="w-4 h-4 text-orange-600" />
											<span className="text-orange-600 font-medium">
												Hạn nộp: {new Date(exercise.deadline).toLocaleDateString("vi-VN")}
											</span>
											<span className="text-slate-400 text-xs">
												({Math.ceil((new Date(exercise.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} ngày còn lại)
											</span>
										</div>
									)}
									<div className={`border-2 border-dashed rounded-lg p-4 text-center ${
										uploadedFiles[exercise.id] ? "border-green-300 bg-green-50" : "border-slate-300"
									}`}>
										{uploadedFiles[exercise.id] ? (
											<>
												<CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
												<p className="text-green-600 text-sm font-medium mb-1">
													{uploadedFiles[exercise.id].name}
												</p>
												<p className="text-green-500 text-xs mb-3">
													{(uploadedFiles[exercise.id].size / 1024).toFixed(1)} KB
												</p>
											</>
										) : (
											<>
												<Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
												<p className="text-slate-600 text-sm mb-2">Tải lên file bài làm</p>
												<p className="text-slate-400 text-xs mb-3">
													Chấp nhận: .pdf, .doc, .docx, .zip
												</p>
											</>
										)}
										<input
											type="file"
											className="hidden"
											id={`file-upload-${exercise.id}`}
											onChange={(e) => handleFileChange(exercise.id, e)}
											accept=".pdf,.doc,.docx,.zip"
										/>
										<label 
											htmlFor={`file-upload-${exercise.id}`}
											className="inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 px-4 py-2 text-sm min-h-[36px] bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-lg hover:shadow-xl"
										>
											{uploadedFiles[exercise.id] ? "Đổi file" : "Chọn file"}
										</label>
									</div>
									{uploadedFiles[exercise.id] && (
										<div className="mt-3 flex gap-2">
											{submittedExercises.has(exercise.id) ? (
												<button
													type="button"
													onClick={() => handleCancelSubmit(exercise.id)}
													className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
												>
													<X className="w-4 h-4" />
													Huỷ nộp
												</button>
											) : (
												<button
													type="button"
													onClick={() => handleSubmitExercise(exercise.id)}
													className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
												>
													<CheckCircle className="w-4 h-4" />
													Nộp bài
												</button>
											)}
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				);
			case "quiz": {
				const lessonIndex = currentLesson?.id || 1;
				return (
					<div>
						<h3 className="text-lg font-semibold text-slate-900 mb-4">
							Quiz - Ôn tập
						</h3>
						<div className="space-y-3">
							{quizzes.length > 0 ? (
								<button
									type="button"
									onClick={() => navigate(`/quiz/${course?.id}/${currentLessonId}`)}
									className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition-all"
								>
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
											<FileText className="w-6 h-6 text-blue-600" />
										</div>
										<div className="text-left">
											<h4 className="font-semibold text-slate-900">
												Bài {lessonIndex}
											</h4>
											<p className="text-sm text-slate-600">
												{quizzes.length} câu hỏi
											</p>
										</div>
									</div>
									<div className="flex items-center gap-2 text-blue-600 font-medium">
										<span>Làm bài</span>
										<ChevronRight className="w-5 h-5" />
									</div>
								</button>
							) : (
								<div className="text-center p-6 text-slate-500">
									Chưa có quiz cho bài học này
								</div>
							)}
						</div>
					</div>
				);
			}
			case "recommended": {
				return (
					<div>
						<h3 className="text-lg font-semibold text-slate-900 mb-4">
							Khóa học gợi ý cho bạn
						</h3>
						<p className="text-slate-500 text-sm mb-4">
							Dựa trên khóa học bạn đang học, chúng tôi gợi ý:
						</p>
						<div className="space-y-4">
							{recommendedCourses.map((course) => (
								<div
									key={course.id}
									className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors"
								>
									<div className={`w-24 h-16 bg-gradient-to-r ${course.image} rounded-lg flex items-center justify-center shrink-0`}>
										<BookOpen className="w-8 h-8 text-white" />
									</div>
									<div className="flex-1">
										<h4 className="font-medium text-slate-900 mb-1">{course.title}</h4>
										<p className="text-sm text-slate-500 mb-2">{course.instructor}</p>
										<div className="flex items-center gap-3 text-sm">
											<span className="flex items-center gap-1 text-yellow-500">
												<span className="text-yellow-500">★</span>
												{course.rating}
											</span>
											<span className="text-slate-400">{course.students.toLocaleString()} học viên</span>
										</div>
									</div>
									<div className="text-right">
										<p className="font-semibold text-slate-900">{course.price.toLocaleString()}đ</p>
										<button
											type="button"
											className="mt-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
										>
											Xem chi tiết
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				);
			}
			case "quizHistory": {
				return (
					<div>
						<h3 className="text-lg font-semibold text-slate-900 mb-4">
							Lịch sử làm bài Quiz
						</h3>
						{quizHistory.length > 0 ? (
							<div className="space-y-4">
								{quizHistory.map((quiz) => (
									<div key={quiz.id} className="border border-slate-200 rounded-xl overflow-hidden">
										<button
											type="button"
											onClick={() => setSelectedQuizResult(selectedQuizResult === quiz.id ? null : quiz.id)}
											className="w-full p-4 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between"
										>
											<div className="text-left">
												<h4 className="font-medium text-slate-900">{quiz.quizTitle}</h4>
												<p className="text-sm text-slate-500">{quiz.completedAt}</p>
											</div>
											<div className="flex items-center gap-4">
												<div className={`px-3 py-1 rounded-full text-sm font-medium ${
													quiz.score >= 80 ? "bg-green-100 text-green-700" :
													quiz.score >= 60 ? "bg-yellow-100 text-yellow-700" :
													"bg-red-100 text-red-700"
												}`}>
													{quiz.score}%
												</div>
												<ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${
													selectedQuizResult === quiz.id ? "rotate-90" : ""
												}`} />
											</div>
										</button>
										
										{selectedQuizResult === quiz.id && (
											<div className="p-4 border-t border-slate-200">
												<p className="text-sm text-slate-600 mb-4">
													Bạn đã trả lời đúng {Math.round(quiz.totalQuestions * quiz.score / 100)}/{quiz.totalQuestions} câu
												</p>
												{quiz.wrongAnswers.length > 0 ? (
													<div className="space-y-4">
														<h5 className="font-medium text-red-600">Câu trả lời sai ({quiz.wrongAnswers.length}):</h5>
														{quiz.wrongAnswers.map((wrong, idx) => (
															<div key={`q-${quiz.id}-wrong-${idx}`} className="p-4 bg-red-50 rounded-lg border border-red-200">
																<p className="font-medium text-slate-900 mb-2">Câu {idx + 1}: {wrong.question}</p>
																<div className="grid grid-cols-2 gap-3 text-sm mb-2">
																	<div className="p-2 bg-red-100 rounded">
																		<p className="text-red-600 font-medium">Bạn chọn:</p>
																		<p className="text-red-700">{wrong.yourAnswer}</p>
																		<p className="text-red-500">❌</p>
																	</div>
																	<div className="p-2 bg-green-100 rounded">
																		<p className="text-green-600 font-medium">Đáp án đúng:</p>
																		<p className="text-green-700">{wrong.correctAnswer}</p>
																		<p className="text-green-500">✓</p>
																	</div>
																</div>
																<p className="text-sm text-slate-600 bg-white p-2 rounded">
																	<span className="font-medium">Giải thích:</span> {wrong.explanation}
																</p>
															</div>
														))}
														<button
															type="button"
															className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
														>
															Làm lại Quiz
														</button>
													</div>
												) : (
													<div className="text-center py-4">
														<p className="text-green-600 font-medium">Chúc mừng! Bạn đã trả lời đúng tất cả câu hỏi!</p>
													</div>
												)}
											</div>
										)}
									</div>
								))}
							</div>
						) : (
							<div className="text-center p-6 text-slate-500">
								Chưa có lịch sử làm bài quiz
							</div>
						)}
					</div>
				);
			}
			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-white flex flex-col">
			<div className="flex flex-1">
			{/* Sidebar */}
			<aside
				className={`bg-slate-50 border-r border-slate-200 flex flex-col fixed h-full transition-all duration-300 ${
					isSidebarOpen ? "w-80" : "w-0"
				}`}
			>
				<div className={`${isSidebarOpen ? "w-80" : "w-0"} overflow-hidden`}>
				{/* Header */}
				<div className="p-4 border-b border-slate-200 bg-white shrink-0 flex items-center justify-between">
					<Link
						to="/my-courses"
						className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
					>
						<ArrowLeft className="w-4 h-4" />
						<span className="text-sm">Quay lại</span>
					</Link>
					<button
						type="button"
						onClick={() => setIsSidebarOpen(false)}
						className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
						title="Ẩn sidebar"
					>
						<ChevronLeft className="w-4 h-4" />
					</button>
				</div>

				{/* Course Info */}
				<div className="p-4 border-b border-slate-200 bg-white shrink-0">
					<h3 className="font-semibold text-slate-900 line-clamp-2 mb-2">
						{course.title}
					</h3>
					<div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
						<div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
							<User className="w-3.5 h-3.5 text-white" />
						</div>
						<span>{course.instructor}</span>
					</div>
					<div className="mb-2">
						<div className="flex items-center justify-between text-sm mb-1">
							<span className="text-slate-500">Tiến độ</span>
							<span className="font-medium text-slate-700">
								{completedCount}/{totalLessons}
							</span>
						</div>
						<div className="h-2 bg-slate-200 rounded-full overflow-hidden">
							<div
								className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>
				</div>

				{/* Chapter List */}
				<div className="overflow-y-auto flex-1 bg-white">
					{course.chapters.map((chapter, chapterIndex) => (
						<div key={chapter.id} className="border-b border-slate-200">
							<button
								type="button"
								onClick={() => toggleChapter(chapter.id)}
								className="w-full p-4 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between"
							>
								<div className="text-left">
									<div className="flex items-center gap-2 text-sm font-medium">
										<span className="text-slate-500">
											Chương {chapterIndex + 1}:
										</span>
										<span>{chapter.title}</span>
									</div>
									<div className="text-xs text-slate-400 mt-1">
										{
											chapter.lessons.filter((l) => completedLessons.has(l.id))
												.length
										}
										/{chapter.lessons.length} bài đã hoàn thành
									</div>
								</div>
								<ChevronRight
									className={`w-5 h-5 text-slate-400 transition-transform ${
										collapsedChapters.has(chapter.id) ? "" : "rotate-90"
									}`}
								/>
							</button>
							{!collapsedChapters.has(chapter.id) && (
								<div>
									{chapter.lessons.map((lesson) => (
										<button
											type="button"
											key={lesson.id}
											onClick={() => setCurrentLessonId(lesson.id)}
											className={`w-full p-3 flex items-center gap-3 text-left transition-colors ${
												currentLessonId === lesson.id
													? "bg-blue-50 border-l-2 border-blue-500"
													: "hover:bg-slate-50"
											}`}
										>
											<div
												className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
													completedLessons.has(lesson.id)
														? "bg-green-500"
														: currentLessonId === lesson.id
															? "bg-blue-500"
															: "border border-slate-400"
												}`}
											>
												{completedLessons.has(lesson.id) ? (
													<Check className="w-3 h-3 text-white" />
												) : (
													<Play className="w-3 h-3 text-white" />
												)}
											</div>
											<div className="flex-1 min-w-0">
												<p
													className={`text-sm truncate ${
														currentLessonId === lesson.id
															? "text-slate-900 font-medium"
															: "text-slate-600"
													}`}
												>
													{lesson.title}
												</p>
												<p className="text-xs text-slate-400">
													{lesson.duration}
												</p>
											</div>
										</button>
									))}
								</div>
							)}
						</div>
					))}
				</div>
				</div>
			</aside>

			{/* Toggle Sidebar Button */}
			{!isSidebarOpen && (
				<button
					type="button"
					onClick={() => setIsSidebarOpen(true)}
					className="fixed left-0 top-1/2 -translate-y-1/2 z-40 p-2 bg-white border border-r-0 border-slate-200 rounded-r-lg shadow-md hover:bg-slate-50"
					title="Hiện sidebar"
				>
					<ChevronRight className="w-4 h-4 text-slate-600" />
				</button>
			)}

			{/* Main Content */}
			<main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-80" : "ml-0"}`}>
				<div className="sticky top-0 z-30">
					<Header />
				</div>

				{/* Main Content Area - Scrollable */}
				<div className="flex-1 overflow-auto">
				{/* Video Player */}
				<div className="aspect-video bg-slate-900 flex items-center justify-center shrink-0 max-w-full">
					<div className="text-center">
						<Play className="w-20 h-20 text-slate-600 mx-auto mb-4" />
						<p className="text-slate-400">
							Video player - {currentLesson?.title}
						</p>
						<p className="text-slate-500 text-sm mt-2">
							Nội dung video sẽ hiển thị ở đây
						</p>
					</div>
				</div>

				{/* Lesson Info */}
				<div className="bg-white flex-1 overflow-auto">
					<div className="w-full px-6 pt-6">
						<div className="flex items-start justify-between mb-6">
							<div>
								<h1 className="text-2xl font-bold text-slate-900 mb-2">
									{currentLesson?.title}
								</h1>
								<div className="flex items-center gap-4 text-slate-500 text-sm">
									<span className="flex items-center gap-1">
										<Clock className="w-4 h-4" />
										{currentLesson?.duration}
									</span>
									<span className="flex items-center gap-1">
										<BookOpen className="w-4 h-4" />
										{course.title}
									</span>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<ActionButton
									variant={
										completedLessons.has(currentLessonId || 0)
											? "primary"
											: "outline"
									}
									onClick={handleMarkComplete}
									className={
										completedLessons.has(currentLessonId || 0)
											? "!bg-green-600 !border-green-600 hover:!bg-green-700"
											: ""
									}
								>
									{completedLessons.has(currentLessonId || 0) ? (
										<>
											<Check className="w-4 h-4 mr-2" />
											Đã hoàn thành
										</>
									) : (
										"Đánh dấu hoàn thành"
									)}
								</ActionButton>
								{getNextLesson() && (
									<ActionButton onClick={handleNextLesson}>
										Bài tiếp theo
										<ChevronRight className="w-4 h-4 ml-2" />
									</ActionButton>
								)}
							</div>
						</div>

						{/* Tabs */}
						<div className="border-t border-slate-200 pt-6">
							<div className="flex gap-6 border-b border-slate-200 pb-3 overflow-x-auto">
								{tabs.map((tab) => (
									<button
										key={tab.key}
										type="button"
										onClick={() => setActiveTab(tab.key)}
										className={`pb-2 text-sm font-medium whitespace-nowrap ${
											activeTab === tab.key
												? "text-blue-600 border-b-2 border-blue-600"
												: "text-slate-500 hover:text-slate-900"
										}`}
									>
										{tab.label}
									</button>
								))}
							</div>

							<div className="mt-6 px-6 pb-6">{renderTabContent()}</div>
						</div>
					</div>
				</div>
				</div>

				{/* Recommended Courses */}
				<div className="bg-slate-50 border-t border-slate-200">
					<div className="px-6 py-8">
						<h2 className="text-xl font-bold text-slate-900 mb-6">Khóa học gợi ý cho bạn</h2>
						<p className="text-slate-500 text-sm mb-4">
							Dựa trên khóa học bạn đang học, chúng tôi gợi ý:
						</p>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{recommendedCourses.map((recCourse) => (
								<Link
									key={recCourse.id}
									to={`/course/${recCourse.id}`}
									className="group relative bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out overflow-hidden"
								>
									<div className="relative mb-6">
										<div className="aspect-[16/9] bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
											<div className={`w-full h-full bg-gradient-to-br ${recCourse.image} flex items-center justify-center`}>
												<BookOpen className="w-16 h-16 text-white/80" />
											</div>
										</div>
										<div className="absolute top-3 left-3">
											<span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
												Web Development
											</span>
										</div>
									</div>
									<div>
										<h3 className="font-bold text-slate-900 text-lg leading-tight line-clamp-2 mb-3 group-hover:text-indigo-600 transition-colors duration-200">
											{recCourse.title}
										</h3>
										<div className="flex items-center mb-4">
											<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
												<User className="w-4 h-4 text-white" />
											</div>
											<span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors duration-200">
												{recCourse.instructor}
											</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-2xl font-bold text-slate-900">
												{recCourse.price.toLocaleString()}đ
											</span>
											<ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors duration-200" />
										</div>
									</div>
								</Link>
							))}
						</div>
					</div>
				</div>
			</main>
			</div>

			<Footer />
		</div>
	);
};

export default LearningPage;
