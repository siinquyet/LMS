import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Button, Card } from '../components/common';

interface QuizResult {
  score: number;
  total: number;
  answers: number[];
}

const mockQuiz = {
  id: 1,
  title: 'Quiz chương 1: Giới thiệu React',
  questions: [
    { id: 1, question: 'React được phát triển bởi?', options: ['Google', 'Facebook', 'Microsoft', 'Apple'], correct: 1 },
    { id: 2, question: 'React sử dụng mô hình nào?', options: ['Object-Oriented', 'Component-based', 'Functional', 'Procedural'], correct: 1 },
    { id: 3, question: 'Virtual DOM là gì?', options: ['Bản sao của DOM trong bộ nhớ', 'Ngôn ngữ lập trình', 'Thư viện CSS', 'Database'], correct: 0 },
    { id: 4, question: 'JSX là viết tắt của?', options: ['JavaScript XML', 'Java Syntax Extension', 'JavaScript Extra', 'JSON XML'], correct: 0 },
    { id: 5, question: 'Hàm nào dùng để render React?', options: ['React.render()', 'ReactDOM.render()', 'render()', 'React.renderDOM()'], correct: 1 },
  ]
};

export const QuizReviewPage: React.FC = () => {
  const { courseId, lessonId } = useParams();
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('quizResult');
    if (saved) {
      const data = JSON.parse(saved);
      setResult(data.result);
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-[#F8F6F3] p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="font-['Comfortaa', cursive] text-[#6B7280] mb-4">Không có kết quả</p>
          <Link to={`/quiz/${courseId}/${lessonId}/do`}>
            <Button variant="primary">Làm bài</Button>
          </Link>
        </div>
      </div>
    );
  }

  const questions = mockQuiz.questions;

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      {/* Header */}
      <div className="bg-white border-b-2 border-[#263D5B] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Link to={`/quiz/${courseId}/${lessonId}/result`} className="flex items-center gap-2 text-[#263D5B]">
          <ChevronLeft className="w-5 h-5" />
          <span className="font-['Comfortaa', cursive]">Kết quả</span>
        </Link>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="font-['Comfortaa', cursive] text-red-500">{result.total - result.score} câu sai</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {questions.map((q, idx) => {
          const userAnswer = result.answers[idx];
          const isCorrect = userAnswer === q.correct;
          
          return (
            <Card 
              key={q.id} 
              className={`p-4 ${!isCorrect ? 'border-red-300 bg-red-50' : ''}`}
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className={`font-['Comfortaa', cursive] text-sm ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                  {isCorrect ? 'Đúng' : 'Sai'}
                </span>
                <span className="font-['Comfortaa', cursive] text-xs text-[#6B7280] ml-auto">
                  Câu {idx + 1}
                </span>
              </div>

              {/* Question */}
              <h3 className="font-['Comfortaa', cursive] text-[#263D5B] mb-3">
                {q.question}
              </h3>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((option, optIdx) => {
                  const isSelected = userAnswer === optIdx;
                  const isCorrectOption = q.correct === optIdx;
                  
                  return (
                    <div
                      key={optIdx}
                      className={`p-3 rounded-[8px] text-sm font-['Comfortaa', cursive] ${
                        isCorrectOption 
                          ? 'bg-green-50 border border-green-500 text-green-700' 
                          : isSelected 
                            ? 'bg-red-50 border border-red-500 text-red-700'
                            : 'bg-white border border-[#E5E1DC] text-[#6B7280]'
                      }`}
                    >
                      <span className="mr-2 font-semibold">{String.fromCharCode(65 + optIdx)}.</span>
                      {option}
                      {isCorrectOption && <CheckCircle className="w-4 h-4 inline ml-2" />}
                      {!isCorrect && isSelected && <XCircle className="w-4 h-4 inline ml-2" />}
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}

        {/* Actions */}
        <div className="flex gap-3">
          <Link to={`/quiz/${courseId}/${lessonId}/result`} className="flex-1">
            <Button variant="secondary" className="w-full">
              <ChevronLeft className="w-4 h-4 mr-1" /> Kết quả
            </Button>
          </Link>
          <Link to={`/quiz/${courseId}/${lessonId}/do`} className="flex-1">
            <Button variant="primary" className="w-full">
              Làm lại
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizReviewPage;