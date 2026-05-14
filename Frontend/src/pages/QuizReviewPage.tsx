import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  XCircle,
  ArrowLeft,
  RefreshCcw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getCurrentUser, getLatestQuizAttempt, getQuizAttemptReview, getLesson } from "../api";
import { Button, Card, Loader } from "../components/common";

interface ReviewQuestion {
  id: number;
  quiz_id: number;
  cau_hoi: string;
  lua_chon: any[];
  dap_an_dung: string;
  cau_tra_loi_cua_toi: string | null;
  dung_sai: boolean;
}

const getOptionValue = (option: any): string =>
  typeof option === 'object' && option !== null ? option.id : String(option);
const getOptionText = (option: any): string =>
  typeof option === 'object' && option !== null ? option.text : String(option);

export const QuizReviewPage: React.FC = () => {
  const { courseId, lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const attemptIdParam = searchParams.get("attemptId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [attemptInfo, setAttemptInfo] = useState<{ id: number; diem: number; ngay_lam: string } | null>(null);
  const [showWrongOnly, setShowWrongOnly] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        setLoading(true);
        setError(null);

        let attemptId: number | null = attemptIdParam ? Number(attemptIdParam) : null;

        // If no attemptId in URL, try to get latest attempt
        if (!attemptId && lessonId) {
          const user = getCurrentUser();
          if (!user) {
            setError("Vui lòng đăng nhập");
            return;
          }		  const lessonData = await getLesson(Number(lessonId));
		  const quiz = lessonData?.lesson?.quizzes?.[0];
          if (quiz) {
            const latestData = await getLatestQuizAttempt(quiz.id, user.id);
            attemptId = latestData?.attempt?.id || null;
          }
        }

        if (!attemptId) {
          setError("Không tìm thấy kết quả bài làm để xem lại");
          return;
        }

        const reviewData = await getQuizAttemptReview(attemptId);
        setQuestions(reviewData.questions || []);
        setAttemptInfo(reviewData.attempt || null);
      } catch (err: any) {
        console.error("Error fetching review:", err);
        setError(err?.message || "Không thể tải chi tiết bài làm");
      } finally {
        setLoading(false);
      }
    };
    fetchReview();
  }, [lessonId, attemptIdParam]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F3] p-4 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F6F3] p-4 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="font-['Inter', sans-serif] text-[#6B7280] mb-4">{error}</p>
          <Link to={`/quiz/${courseId}/${lessonId}/do`}>
            <Button variant="primary">Làm bài</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const correctCount = questions.filter((q) => q.dung_sai).length;
  const wrongCount = questions.length - correctCount;
  const filteredQuestions = showWrongOnly
    ? questions.filter((q) => !q.dung_sai)
    : questions;

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      {/* Header */}
      <div className="bg-white border-b-2 border-[#1C293C] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Link
          to={`/quiz/${courseId}/${lessonId}/result${attemptIdParam ? `?attemptId=${attemptIdParam}` : ""}`}
          className="flex items-center gap-2 text-[#1C293C]"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-['Inter', sans-serif]">Kết quả</span>
        </Link>
        <div className="flex items-center gap-2">
          {wrongCount > 0 ? (
            <>
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="font-['Inter', sans-serif] text-red-500 text-sm">
                {wrongCount} câu sai
              </span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-['Inter', sans-serif] text-green-600 text-sm">
                Tất cả đúng!
              </span>
            </>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Summary */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="font-['Inter', sans-serif] text-2xl font-bold text-green-600">
                  {correctCount}
                </p>
                <p className="font-['Inter', sans-serif] text-xs text-[#6B7280]">Đúng</p>
              </div>
              <div className="text-center">
                <p className="font-['Inter', sans-serif] text-2xl font-bold text-red-500">
                  {wrongCount}
                </p>
                <p className="font-['Inter', sans-serif] text-xs text-[#6B7280]">Sai</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={showWrongOnly ? "primary" : "secondary"}
                size="sm"
                onClick={() => setShowWrongOnly(true)}
              >
                Chỉ câu sai
              </Button>
              <Button
                variant={!showWrongOnly ? "primary" : "secondary"}
                size="sm"
                onClick={() => setShowWrongOnly(false)}
              >
                Tất cả
              </Button>
            </div>
          </div>
        </Card>

        {/* Questions */}
        {filteredQuestions.length === 0 ? (
          <Card className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="font-['Inter', sans-serif] text-xl text-[#1C293C] mb-2">
              Không có câu sai
            </h3>
            <p className="font-['Inter', sans-serif] text-[#6B7280]">
              Bạn đã trả lời đúng tất cả các câu hỏi!
            </p>
          </Card>
        ) : (
          filteredQuestions.map((q, idx) => (
            <Card
              key={q.id}
              className={`p-4 ${!q.dung_sai ? "border-2 border-red-300 bg-red-50/50" : ""}`}
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                {q.dung_sai ? (
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                )}
                <span
                  className={`font-['Inter', sans-serif] text-sm font-medium ${
                    q.dung_sai ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {q.dung_sai ? "Đúng" : "Sai"}
                </span>
                <span className="font-['Inter', sans-serif] text-xs text-[#6B7280] ml-auto">
                  Câu {questions.indexOf(q) + 1}/{questions.length}
                </span>
              </div>

              {/* Question */}
              <h3 className="font-['Inter', sans-serif] font-semibold text-[#1C293C] mb-3">
                {q.cau_hoi}
              </h3>

              {/* Options */}
              <div className="space-y-2">
                {q.lua_chon.map((option, optIdx) => {
                  const optVal = getOptionValue(option);
                  const optText = getOptionText(option);
                  const isUserAnswer = q.cau_tra_loi_cua_toi === optVal;
                  const isCorrectOption = q.dap_an_dung === optVal;

                  let bgClass = "bg-white border-[#E5E1DC] text-[#6B7280]";
                  if (isCorrectOption && !q.dung_sai) {
                    bgClass = "bg-green-50 border-green-500 text-green-700";
                  } else if (isCorrectOption && q.dung_sai && isUserAnswer) {
                    bgClass = "bg-green-50 border-green-500 text-green-700";
                  } else if (isUserAnswer && !q.dung_sai) {
                    bgClass = "bg-red-50 border-red-500 text-red-700";
                  }

                  return (
                    <div
                      key={optIdx}
                      className={`p-3 rounded-[8px] text-sm font-['Inter', sans-serif] border-2 ${bgClass}`}
                    >
                      <span className="font-bold mr-2">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      {optText}
                      {isCorrectOption && (
                        <CheckCircle className="w-4 h-4 inline ml-2 text-green-500" />
                      )}
                      {isUserAnswer && !q.dung_sai && (
                        <XCircle className="w-4 h-4 inline ml-2 text-red-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          ))
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            to={`/quiz/${courseId}/${lessonId}/result${attemptIdParam ? `?attemptId=${attemptIdParam}` : ""}`}
            className="flex-1"
          >
            <Button variant="secondary" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-1" /> Kết quả
            </Button>
          </Link>
          <Link to={`/quiz/${courseId}/${lessonId}/do`} className="flex-1">
            <Button variant="primary" className="w-full">
              <RefreshCcw className="w-4 h-4 mr-1" /> Làm lại
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizReviewPage;
