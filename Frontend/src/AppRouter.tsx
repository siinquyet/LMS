import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import AssignmentsPage from "./pages/AssignmentsPage";
import CartPage from "./pages/CartPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ForumPage from "./pages/ForumPage";
import Home from "./pages/Home";
import LearningPage from "./pages/LearningPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import QuizPage from "./pages/QuizPage";
import MyCoursesPage from "./pages/MyCoursesPage";
import Register from "./pages/Register";
import SettingsPage from "./pages/SettingsPage";
import StorePage from "./pages/StorePage";

const AppRouter = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={
						<AppShell>
							<Home />
						</AppShell>
					}
				/>
				<Route
					path="/courses/*"
					element={
						<AppShell>
							<div>Khóa học</div>
						</AppShell>
					}
				/>
				<Route
					path="/course/:id"
					element={
						<AppShell>
							<CourseDetailPage />
						</AppShell>
					}
				/>
				<Route path="/learn/:id" element={<LearningPage />} />
				<Route path="/quiz/:courseId/:lessonId" element={<QuizPage />} />
				<Route
					path="/my-courses"
					element={
						<AppShell>
							<MyCoursesPage />
						</AppShell>
					}
				/>
				<Route
					path="/assignments/*"
					element={
						<AppShell>
							<AssignmentsPage />
						</AppShell>
					}
				/>
				<Route
					path="/store/*"
					element={
						<AppShell>
							<StorePage />
						</AppShell>
					}
				/>
				<Route
					path="/cart/*"
					element={
						<AppShell>
							<CartPage />
						</AppShell>
					}
				/>
				<Route
					path="/forum/*"
					element={
						<AppShell>
							<ForumPage />
						</AppShell>
					}
				/>
				<Route
					path="/register"
					element={
						<AppShell>
							<Register />
						</AppShell>
					}
				/>
				<Route
					path="/login"
					element={
						<AppShell>
							<LoginPage />
						</AppShell>
					}
				/>
				<Route
					path="/forgot-password"
					element={
						<AppShell>
							<ForgotPasswordPage />
						</AppShell>
					}
				/>
				<Route
					path="/profile"
					element={
						<AppShell>
							<ProfilePage />
						</AppShell>
					}
				/>
				<Route
					path="/settings"
					element={
						<AppShell>
							<SettingsPage />
						</AppShell>
					}
				/>
				<Route
					path="*"
					element={
						<AppShell>
							<Home />
						</AppShell>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
};

export default AppRouter;
