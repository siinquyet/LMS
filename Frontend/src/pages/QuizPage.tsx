import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  CheckCircle, 
  XCircle, 
  Clock,
  Award,
  RefreshCcw,
  BookOpen,
  Target,
  Zap
} from 'lucide-react';
import { Button, Card, Progress } from '../components/common';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

interface QuizResult {
  quizId: number;
  score: number;
  total: number;
  answers: number[];
  completedAt: string;
}

const mockQuiz = {
  id: 1,
  title: 'Quiz chương 1: Giới thiệu React',
  courseName: 'React & Next.js Full Course',
  timeLimit: 600,
  questions: [
    {
      id: 1,
      question: 'React được phát triển bởi?',
      options: ['Google', 'Facebook', 'Microsoft', 'Apple'],
      correct: 1
    },
    {
      id: 2,
      question: 'React sử dụng mô hình nào?',
      options: ['Object-Oriented', 'Component-based', 'Functional', 'Procedural'],
      correct: 1
    },
    {
      id: 3,
      question: 'Virtual DOM là gì?',
      options: [
        'Một bản sao của DOM trong bộ nhớ',
        'Một ngôn ngữ lập trình',
        'Một thư viện CSS',
        'Một database'
      ],
      correct: 0
    },
    {
      id: 4,
      question: 'JSX là viết tắt của?',
      options: ['JavaScript XML', 'Java Syntax Extension', 'JavaScript Extra', 'JSON XML'],
      correct: 0
    },
    {
      id: 5,
      question: 'Hàm nào dùng để render React vào DOM?',
      options: ['React.render()', 'ReactDOM.render()', 'render()', 'React.renderDOM()'],
      correct: 1
    }
  ] as QuizQuestion[]
};

const mockResults: QuizResult[] = [
  { quizId: 1, score: 8, total: 10, answers: [1, 1, 1, 0, 1], completedAt: '2024-01-15 10:30' },
  { quizId: 1, score: 6, total: 10, answers: [1, 0, 1, 0, 1], completedAt: '2024-01-10 14:20' },
];

export const QuizPage: React.FC = () => {
  const { courseId, lessonId } = useParams();
  const [quizMode, setQuizMode] = useState<'list' | 'doing' | 'result'>('list');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(mockQuiz.timeLimit);

  const questions = mockQuiz.questions;
  const currentQ = questions[currentQuestion];

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
    let score = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correct) score++;
    });
    setShowResult(true);
    setQuizMode('result');
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setQuizMode('doing');
  };

  const score = answers.filter((a, i) => a === questions[i].correct).length;
  const percentage = Math.round((score / questions.length) * 100);

  // View result mode
  if (quizMode === 'list') {
    return (
      <div className="min-h-screen bg-[#F8F6F3] p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Link to={`/learn/${courseId}`} className="flex items-center gap-2 text-[#263D5B]">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-['Comfortaa', cursive]">Quay lại bài học</span>
          </Link>

          <h1 className="font-['Comfortaa', cursive] text-2xl text-[#263D5B]">Bài tập Quiz</h1>

          {/* Quiz Info */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-[#E8F6FC] rounded-full flex items-center justify-center">
                <Zap className="w-7 h-7 text-[#49B6E5]" />
              </div>
              <div>
                <h2 className="font-['Comfortaa', cursive] text-lg text-[#263D5B]">{mockQuiz.title}</h2>
                <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">{mockQuiz.courseName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-[#6B7280] mb-4">
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" /> {questions.length} câu
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {Math.floor(mockQuiz.timeLimit / 60)} phút
              </span>
            </div>
            <Button variant="primary" onClick={() => setQuizMode('doing')} className="w-full">
              Làm bài
            </Button>
          </Card>

          {/* History */}
          <div>
            <h2 className="font-['Comfortaa', cursive] text-lg text-[#263D5B] mb-4">Lịch sử làm bài</h2>
            <div className="space-y-3">
              {mockResults.length === 0 ? (
                <p className="font-['Comfortaa', cursive] text-[#6B7280] text-center py-4">Chưa có lịch sử</p>
              ) : (
                mockResults.map((result, idx) => (
                  <Card key={idx} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-['Comfortaa', cursive] text-[#263D5B]">{result.completedAt}</p>
                        <p className="font-['Comfortaa', cursive] text-xs text-[#6B7280]">{result.total} câu</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-['Comfortaa', cursive] text-xl font-bold ${result.score >= 7 ? 'text-green-600' : 'text-red-500'}`}>
                          {result.score}/{result.total}
                        </p>
                        <p className="font-['Comfortaa', cursive] text-xs text-[#6B7280]">
                          {Math.round((result.score / result.total) * 100)}%
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Doing quiz
  if (quizMode === 'doing') {
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-[#F8F6F3] p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link to="/learn/1" className="flex items-center gap-2 text-[#263D5B]">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">
                {currentQuestion + 1}/{questions.length}
              </span>
            </div>
          </div>

          {/* Progress */}
          <Progress value={progress} className="h-2" />

          {/* Question */}
          <Card className="p-6">
            <div className="mb-4">
              <span className="font-['Comfortaa', cursive] text-xs text-[#6B7280]">Câu {currentQuestion + 1}</span>
              <h2 className="font-['Comfortaa', cursive] text-lg text-[#263D5B] mt-1">
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
                    className={`w-full p-4 text-left rounded-[8px] border-2 font-['Comfortaa', cursive] transition-colors ${
                      isSelected 
                        ? 'border-[#49B6E5] bg-[#E8F6FC] text-[#263D5B]' 
                        : 'border-[#E5E1DC] text-[#6B7280] hover:border-[#263D5B]'
                    }`}
                  >
                    <span className="mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex gap-3 mt-6">
              <Button 
                variant="secondary" 
                onClick={handlePrev}
                disabled={currentQuestion === 0}
              >
                <ChevronLeft className="w-4 h-4" /> Trước
              </Button>
              {currentQuestion < questions.length - 1 ? (
                <Button variant="primary" onClick={handleNext} className="flex-1">
                  Tiếp <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={handleSubmit}
                  disabled={answers.length !== questions.length}
                  className="flex-1"
                >
                  Nộp bài
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Result
  return (
    <div className="min-h-screen bg-[#F8F6F3] p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Score Card */}
        <Card className="p-8 text-center">
          <div className="w-20 h-20 bg-[#E8F6FC] rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-[#49B6E5]" />
          </div>
          <h2 className="font-['Comfortaa', cursive] text-2xl text-[#263D5B] mb-2">Kết quả</h2>
          <p className="font-['Comfortaa', cursive] text-4xl font-bold text-[#263D5B] mb-2">
            {score}/{questions.length}
          </p>
          <p className={`font-['Comfortaa', cursive] text-lg mb-4 ${percentage >= 70 ? 'text-green-600' : 'text-orange-500'}`}>
            {percentage >= 70 ? 'Đạt!' : 'Chưa đạt'}
          </p>
          <p className="font-['Comfortaa', cursive] text-sm text-[#6B7280]">
            {mockQuiz.title}
          </p>
        </Card>

        {/* Review */}
        <div>
          <h3 className="font-['Comfortaa', cursive] text-lg text-[#263D5B] mb-4">Xem lại</h3>
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const userAnswer = answers[idx];
              const isCorrect = userAnswer === q.correct;
              return (
                <Card key={q.id} className="p-4">
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-['Comfortaa', cursive] text-sm text-[#263D5B] mb-2">
                        {idx + 1}. {q.question}
                      </p>
                      <div className="space-y-1 text-sm">
                        <p className="text-[#6B7280]">
                          <span className="font-['Comfortaa', cursive]">Chọn: </span>
                          <span className={isCorrect ? 'text-green-600' : 'text-red-500'}>
                            {q.options[userAnswer]}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-green-600">
                            <span className="font-['Comfortaa', cursive]">Đúng: </span>
                            {q.options[q.correct]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setQuizMode('list')} className="flex-1">
            <BookOpen className="w-4 h-4" /> Danh sách
          </Button>
          <Button variant="primary" onClick={handleRetry} className="flex-1">
            <RefreshCcw className="w-4 h-4" /> Làm lại
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;