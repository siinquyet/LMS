import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import TeacherLayout from "./components/layout/TeacherLayout";
import HomePage from "./pages/HomePage";
import StorePage from "./pages/StorePage";
import MyCoursesPage from "./pages/MyCoursesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import LearningPage from "./pages/LearningPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import ProfilePage from "./pages/ProfilePage";
import QuizPage from "./pages/QuizPage";
import QuizDoPage from "./pages/QuizDoPage";
import QuizResultPage from "./pages/QuizResultPage";
import QuizReviewPage from "./pages/QuizReviewPage";
import SettingsPage from "./components/common/SettingsPage";
import TeacherAnalyticsPage from "./pages/TeacherAnalyticsPage";
import TeacherCoursesPage from "./pages/TeacherCoursesPage";
import TeacherCourseEditPage from "./pages/TeacherCourseEditPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";
import TeacherStudentsPage from "./pages/TeacherStudentsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminCoursesPage from "./pages/AdminCoursesPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminReportsPage from "./pages/AdminReportsPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminLayout from "./components/layout/AdminLayout";
import ForumPage from "./pages/ForumPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell><HomePage /></AppShell>} />
        <Route path="/store" element={<AppShell><StorePage /></AppShell>} />
        <Route path="/my-courses" element={<AppShell><MyCoursesPage /></AppShell>} />
        <Route path="/login" element={<AppShell><LoginPage /></AppShell>} />
        <Route path="/register" element={<AppShell><RegisterPage /></AppShell>} />
        <Route path="/cart" element={<AppShell><CartPage /></AppShell>} />
        <Route path="/course/:id" element={<CourseDetailPage />} />
        <Route path="/forum" element={<AppShell><ForumPage /></AppShell>} />
        <Route path="/profile" element={<AppShell><ProfilePage /></AppShell>} />
        <Route path="/settings" element={<AppShell><SettingsPage /></AppShell>} />
        <Route path="/teacher" element={<TeacherLayout><TeacherDashboardPage /></TeacherLayout>} />
        <Route path="/teacher/courses" element={<TeacherLayout><TeacherCoursesPage /></TeacherLayout>} />
        <Route path="/teacher/courses/:id/edit" element={<TeacherLayout><TeacherCourseEditPage /></TeacherLayout>} />
        <Route path="/teacher/courses/new" element={<TeacherLayout><TeacherCourseEditPage /></TeacherLayout>} />
        <Route path="/teacher/students" element={<TeacherLayout><TeacherStudentsPage /></TeacherLayout>} />
        <Route path="/teacher/analytics" element={<TeacherLayout><TeacherAnalyticsPage /></TeacherLayout>} />
        <Route path="/teacher/settings" element={<TeacherLayout><SettingsPage /></TeacherLayout>} />
        <Route path="/admin" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
        <Route path="/admin/courses" element={<AdminLayout><AdminCoursesPage /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><AdminUsersPage /></AdminLayout>} />
        <Route path="/admin/reports" element={<AdminLayout><AdminReportsPage /></AdminLayout>} />
        <Route path="/admin/orders" element={<AdminLayout><AdminOrdersPage /></AdminLayout>} />
        <Route path="/forgot-password" element={<AppShell><div>Forgot Password</div></AppShell>} />
        <Route path="/learn/:id" element={<LearningPage />} />
        <Route path="/learn/:courseId/:lessonId" element={<LearningPage />} />
        <Route path="/quiz/:courseId/:lessonId" element={<QuizPage />} />
        <Route path="/quiz/:courseId/:lessonId/do" element={<QuizDoPage />} />
        <Route path="/quiz/:courseId/:lessonId/result" element={<QuizResultPage />} />
        <Route path="/quiz/:courseId/:lessonId/review" element={<QuizReviewPage />} />
        <Route path="/assignments" element={<AppShell><AssignmentsPage /></AppShell>} />
        <Route path="*" element={<AppShell><HomePage /></AppShell>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
