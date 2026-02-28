import { useState } from "react";
import { Link } from "react-router-dom";
import {
	BookOpen,
	Calendar,
	Clock,
	Filter,
	AlertCircle,
	CheckCircle,
	ChevronRight,
	ClipboardList,
	FileQuestion,
	Search,
} from "lucide-react";

type TabType = "assignments" | "quizzes";

interface Assignment {
	id: number;
	title: string;
	courseName: string;
	courseId: number;
	deadline: string;
	daysLeft: number;
	status: "pending" | "urgent" | "overdue";
}

interface Quiz {
	id: number;
	title: string;
	courseName: string;
	courseId: number;
	lessonName: string;
	questions: number;
	timeLimit: number;
	status: "pending" | "available";
}

const AssignmentsPage = () => {
	const [activeTab, setActiveTab] = useState<TabType>("assignments");
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCourse, setSelectedCourse] = useState<string>("all");
	const [showFilters, setShowFilters] = useState(false);

	const assignments: Assignment[] = [
		{
			id: 1,
			title: "Bài tập React Hooks - useState & useEffect",
			courseName: "React & Next.js Full Course",
			courseId: 1,
			deadline: "2026-04-01",
			daysLeft: 3,
			status: "urgent",
		},
		{
			id: 2,
			title: "Xây dựng Component với TypeScript",
			courseName: "TypeScript Fundamentals",
			courseId: 2,
			deadline: "2026-04-05",
			daysLeft: 7,
			status: "pending",
		},
		{
			id: 3,
			title: "Tạo REST API với Express",
			courseName: "Node.js Backend Development",
			courseId: 3,
			deadline: "2026-03-30",
			daysLeft: -2,
			status: "overdue",
		},
		{
			id: 4,
			title: "Bài tập CSS Flexbox & Grid",
			courseName: "React & Next.js Full Course",
			courseId: 1,
			deadline: "2026-04-10",
			daysLeft: 12,
			status: "pending",
		},
	];

	const quizzes: Quiz[] = [
		{
			id: 1,
			title: "Quiz: React Components",
			courseName: "React & Next.js Full Course",
			courseId: 1,
			lessonName: "React Components cơ bản",
			questions: 10,
			timeLimit: 15,
			status: "available",
		},
		{
			id: 2,
			title: "Quiz: TypeScript Basic Types",
			courseName: "TypeScript Fundamentals",
			courseId: 2,
			lessonName: "Basic Types",
			questions: 15,
			timeLimit: 20,
			status: "available",
		},
		{
			id: 3,
			title: "Quiz: Express Middleware",
			courseName: "Node.js Backend Development",
			courseId: 3,
			lessonName: "Middleware trong Express",
			questions: 8,
			timeLimit: 10,
			status: "available",
		},
		{
			id: 4,
			title: "Quiz: React State Management",
			courseName: "React & Next.js Full Course",
			courseId: 1,
			lessonName: "State Management với useState",
			questions: 12,
			timeLimit: 18,
			status: "available",
		},
	];

	const courses = [
		{ id: 1, name: "React & Next.js Full Course" },
		{ id: 2, name: "TypeScript Fundamentals" },
		{ id: 3, name: "Node.js Backend Development" },
	];

	const filteredAssignments = assignments.filter((a) => {
		const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			a.courseName.toLowerCase().includes(searchQuery.toLowerCase());
		const matchCourse = selectedCourse === "all" || a.courseId === Number(selectedCourse);
		return matchSearch && matchCourse;
	});

	const filteredQuizzes = quizzes.filter((q) => {
		const matchSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			q.courseName.toLowerCase().includes(searchQuery.toLowerCase());
		const matchCourse = selectedCourse === "all" || q.courseId === Number(selectedCourse);
		return matchSearch && matchCourse;
	});

	const urgentCount = assignments.filter(a => a.status === "urgent" || a.status === "overdue").length;

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Header */}
			<div className="bg-white border-b border-slate-200">
				<div className="max-w-6xl mx-auto px-4 py-6">
					<h1 className="text-2xl font-bold text-slate-900 mb-2">Bài tập & Quiz</h1>
					<p className="text-slate-500">Theo dõi bài tập và bài kiểm tra của bạn</p>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-4 py-6">
				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<div className="bg-white rounded-xl p-4 border border-slate-200">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
								<ClipboardList className="w-5 h-5 text-blue-600" />
							</div>
							<div>
								<p className="text-2xl font-bold text-slate-900">{assignments.length}</p>
								<p className="text-sm text-slate-500">Bài tập chờ làm</p>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-xl p-4 border border-slate-200">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
								<AlertCircle className="w-5 h-5 text-orange-600" />
							</div>
							<div>
								<p className="text-2xl font-bold text-slate-900">{urgentCount}</p>
								<p className="text-sm text-slate-500">Cần hoàn thành sớm</p>
							</div>
						</div>
					</div>
					<div className="bg-white rounded-xl p-4 border border-slate-200">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
								<FileQuestion className="w-5 h-5 text-green-600" />
							</div>
							<div>
								<p className="text-2xl font-bold text-slate-900">{quizzes.length}</p>
								<p className="text-sm text-slate-500">Quiz có thể làm</p>
							</div>
						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className="bg-white rounded-xl border border-slate-200 mb-6">
					<div className="flex border-b border-slate-200">
						<button
							type="button"
							onClick={() => setActiveTab("assignments")}
							className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
								activeTab === "assignments"
									? "border-blue-600 text-blue-600"
									: "border-transparent text-slate-500 hover:text-slate-700"
							}`}
						>
							<ClipboardList className="w-4 h-4" />
							Bài tập
							{urgentCount > 0 && (
								<span className="ml-1 px-2 py-0.5 text-xs bg-orange-100 text-orange-600 rounded-full">
									{urgentCount}
								</span>
							)}
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("quizzes")}
							className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
								activeTab === "quizzes"
									? "border-blue-600 text-blue-600"
									: "border-transparent text-slate-500 hover:text-slate-700"
							}`}
						>
							<FileQuestion className="w-4 h-4" />
							Quiz
						</button>
					</div>

					{/* Search & Filter */}
					<div className="p-4 border-b border-slate-200">
						<div className="flex gap-3">
							<div className="relative flex-1">
								<Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
								<input
									type="text"
									placeholder="Tìm kiếm..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
								/>
							</div>
							<button
								type="button"
								onClick={() => setShowFilters(!showFilters)}
								className={`px-4 py-2 border rounded-lg flex items-center gap-2 text-sm ${
									showFilters || selectedCourse !== "all"
										? "border-blue-500 bg-blue-50 text-blue-600"
										: "border-slate-200 text-slate-600 hover:bg-slate-50"
								}`}
							>
								<Filter className="w-4 h-4" />
								Lọc
							</button>
						</div>

						{showFilters && (
							<div className="mt-3 pt-3 border-t border-slate-200">
								<div className="flex flex-wrap gap-2">
									<button
										type="button"
										onClick={() => setSelectedCourse("all")}
										className={`px-3 py-1.5 text-sm rounded-lg ${
											selectedCourse === "all"
												? "bg-blue-600 text-white"
												: "bg-slate-100 text-slate-600 hover:bg-slate-200"
										}`}
									>
										Tất cả
									</button>
									{courses.map((course) => (
										<button
											key={course.id}
											type="button"
											onClick={() => setSelectedCourse(course.id.toString())}
											className={`px-3 py-1.5 text-sm rounded-lg ${
												selectedCourse === course.id.toString()
													? "bg-blue-600 text-white"
													: "bg-slate-100 text-slate-600 hover:bg-slate-200"
											}`}
										>
											{course.name}
										</button>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Content */}
					<div className="p-4">
						{activeTab === "assignments" ? (
							<div className="space-y-4">
								{filteredAssignments.length === 0 ? (
									<div className="text-center py-8">
										<CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
										<p className="text-slate-600">Không có bài tập nào!</p>
									</div>
								) : (
									filteredAssignments.map((assignment) => (
										<div
											key={assignment.id}
											className={`p-4 rounded-xl border ${
												assignment.status === "overdue"
													? "bg-red-50 border-red-200"
													: assignment.status === "urgent"
													? "bg-orange-50 border-orange-200"
													: "bg-white border-slate-200 hover:border-blue-300"
											}`}
										>
											<div className="flex items-start justify-between">
												<div className="flex items-start gap-3">
													<div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
														assignment.status === "overdue"
															? "bg-red-100"
															: assignment.status === "urgent"
															? "bg-orange-100"
															: "bg-blue-100"
													}`}>
														<ClipboardList className={`w-5 h-5 ${
															assignment.status === "overdue"
																? "text-red-600"
																: assignment.status === "urgent"
																? "text-orange-600"
																: "text-blue-600"
														}`} />
													</div>
													<div>
														<h3 className="font-medium text-slate-900 mb-1">{assignment.title}</h3>
														<p className="text-sm text-slate-500 mb-2">{assignment.courseName}</p>
														<div className="flex items-center gap-4 text-xs">
															<span className="flex items-center gap-1 text-slate-500">
																<Calendar className="w-3 h-3" />
																Hạn: {assignment.deadline}
															</span>
															<span className={`flex items-center gap-1 ${
																assignment.status === "overdue"
																	? "text-red-600 font-medium"
																	: assignment.status === "urgent"
																	? "text-orange-600 font-medium"
																	: "text-slate-500"
															}`}>
																<Clock className="w-3 h-3" />
																{assignment.daysLeft < 0
																	? `Quá hạn ${Math.abs(assignment.daysLeft)} ngày`
																	: `${assignment.daysLeft} ngày còn lại`}
															</span>
														</div>
													</div>
												</div>
												<Link
													to={`/learn/${assignment.courseId}/assignment/${assignment.id}`}
													className={`p-2 rounded-lg ${
														assignment.status === "overdue"
															? "bg-red-600 text-white hover:bg-red-700"
															: "bg-blue-600 text-white hover:bg-blue-700"
													}`}
												>
													<ChevronRight className="w-5 h-5" />
												</Link>
											</div>
										</div>
									))
								)}
							</div>
						) : (
							<div className="space-y-4">
								{filteredQuizzes.length === 0 ? (
									<div className="text-center py-8">
										<CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
										<p className="text-slate-600">Không có quiz nào!</p>
									</div>
								) : (
									filteredQuizzes.map((quiz) => (
										<div
											key={quiz.id}
											className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 bg-white"
										>
											<div className="flex items-start justify-between">
												<div className="flex items-start gap-3">
													<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
														<FileQuestion className="w-5 h-5 text-green-600" />
													</div>
													<div>
														<h3 className="font-medium text-slate-900 mb-1">{quiz.title}</h3>
														<p className="text-sm text-slate-500 mb-2">{quiz.courseName}</p>
														<div className="flex items-center gap-4 text-xs text-slate-500">
															<span className="flex items-center gap-1">
																<BookOpen className="w-3 h-3" />
																{quiz.lessonName}
															</span>
															<span className="flex items-center gap-1">
																<ClipboardList className="w-3 h-3" />
																{quiz.questions} câu
															</span>
															<span className="flex items-center gap-1">
																<Clock className="w-3 h-3" />
																{quiz.timeLimit} phút
															</span>
														</div>
													</div>
												</div>
												<Link
													to={`/learn/${quiz.courseId}/quiz/${quiz.id}`}
													className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
												>
													Làm quiz
													<ChevronRight className="w-4 h-4" />
												</Link>
											</div>
										</div>
									))
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AssignmentsPage;
