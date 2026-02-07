import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import axios from 'axios';

function QuizView() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/quizzes/${quizId}`);
        setQuiz(response.data);
      } catch {
        setError('Failed to load quiz.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleAnswer = (option) => {
    setAnswers({ ...answers, [currentQuestion]: option });
  };

  const handleNext = () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const answersArray = quiz.questions.map((_, idx) => answers[idx] || '');
      const response = await axios.post(
        `http://localhost:8000/api/quizzes/${quizId}/results`,
        { answers: answersArray }
      );
      localStorage.setItem(`quiz_result_${quizId}`, JSON.stringify(response.data));
      navigate(`/quizzes/${quizId}/results`);
    } catch {
      alert('Failed to submit quiz');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-20 text-gray-600">Loading quiz...</div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error || 'Quiz not found.'}</div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">{quiz.title}</h1>

        <div className="max-w-2xl mx-auto">
          <div className="mb-4 text-gray-600">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl mb-6">{question.question}</h2>

            <div className="space-y-3">
              {['A', 'B', 'C', 'D'].map((letter) => {
                const optionKey = `option_${letter.toLowerCase()}`;
                const optionText = question[optionKey];
                return (
                  <button
                    key={letter}
                    onClick={() => handleAnswer(letter)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                      selectedAnswer === letter
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <span className="font-semibold mr-2">{letter}.</span>
                    {optionText}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition disabled:bg-gray-300"
            >
              Previous
            </button>

            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== quiz.questions.length || submitting}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-300"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizView;
