import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Award,
  RefreshCcw,
  Eye,
  CheckCircle
} from 'lucide-react';
import { Button, Card } from '../components/common';
import { learningQuizMock as mockQuiz } from '../mockData';

interface QuizResult {
  score: number;
  total: number;
  answers: number[];
}

export const QuizResultPage: React.FC = () => {
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

  const percentage = Math.round((result.score / result.total) * 100);
  const passed = percentage >= 70;
  const wrongCount = result.total - result.score;

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      {/* Header */}
      <div className="bg-white border-b-2 border-[#263D5B] px-4 py-3">
        <Link to={`/learn/${courseId}/${lessonId}`} className="flex items-center gap-2 text-[#263D5B]">
          <ChevronLeft className="w-5 h-5" />
          <span className="font-['Comfortaa', cursive]">Quay lại bài học</span>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Score Card */}
        <Card className="p-8 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? 'bg-green-100' : 'bg-orange-100'}`}>
            <Award className={`w-10 h-10 ${passed ? 'text-green-600' : 'text-orange-500'}`} />
          </div>
          <h2 className="font-['Comfortaa', cursive] text-xl text-[#263D5B] mb-2">Kết quả bài làm</h2>
          <p className="font-['Comfortaa', cursive] text-4xl font-bold text-[#263D5B] mb-2">
            {result.score}/{result.total}
          </p>
          <p className={`font-['Comfortaa', cursive] text-2xl mb-4 ${passed ? 'text-green-600' : 'text-orange-500'}`}>
            {percentage}% {passed ? 'Đạt' : 'Chưa đạt'}
          </p>
          <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">{mockQuiz.title}</p>
        </Card>

        {/* Stats */}
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-[8px]">
              <p className="font-['Comfortaa', cursive] text-2xl text-green-600 font-bold">{result.score}</p>
              <p className="font-['Comfortaa', cursive] text-xs text-[#6B7280]">Đúng</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-[8px]">
              <p className="font-['Comfortaa', cursive] text-2xl text-red-500 font-bold">{wrongCount}</p>
              <p className="font-['Comfortaa', cursive] text-xs text-[#6B7280]">Sai</p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Link to={`/quiz/${courseId}/${lessonId}/review`} className="block">
            <Button variant="primary" className="w-full">
              <Eye className="w-4 h-4 mr-2" /> Xem câu sai ({wrongCount})
            </Button>
          </Link>
          
          <div className="flex gap-3">
            <Link to={`/learn/${courseId}/${lessonId}`} className="flex-1">
              <Button variant="secondary" className="w-full">
                <ChevronLeft className="w-4 h-4 mr-1" /> Bài học
              </Button>
            </Link>
            <Link to={`/quiz/${courseId}/${lessonId}/do`} className="flex-1">
              <Button variant="outline" className="w-full">
                <RefreshCcw className="w-4 h-4 mr-1" /> Làm lại
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResultPage;
