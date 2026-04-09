import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import HomePage from "./pages/HomePage";
import StorePage from "./pages/StorePage";
import MyCoursesPage from "./pages/MyCoursesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import LearningPage from "./pages/LearningPage";

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
        <Route path="/forum" element={<AppShell><div>Forum Page</div></AppShell>} />
        <Route path="/profile" element={<AppShell><div>Profile Page</div></AppShell>} />
        <Route path="/settings" element={<AppShell><div>Settings Page</div></AppShell>} />
        <Route path="/forgot-password" element={<AppShell><div>Forgot Password</div></AppShell>} />
        <Route path="/learn/:id" element={<LearningPage />} />
        <Route path="/learn/:courseId/:lessonId" element={<LearningPage />} />
        <Route path="/quiz/:courseId/:lessonId" element={<AppShell><div>Quiz Page</div></AppShell>} />
        <Route path="/assignments" element={<AppShell><div>Assignments</div></AppShell>} />
        <Route path="*" element={<AppShell><HomePage /></AppShell>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;