import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

function QuizView() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  // Mock data - will be replaced with API call
  const quiz = {
    title: 'React Basics Quiz',
    questions: [
      {
        id: 1,
        question: 'What is React?',
        options: ['A library', 'A framework', 'A language', 'A database'],
        correctOption: 'A'
      },
      {
        id: 2,
        question: 'What is JSX?',
        options: ['JavaScript XML', 'Java Syntax', 'JSON Extension', 'JavaScript Extra'],
        correctOption: 'A'
      }
    ]
  };

  const handleAnswer = (option) => {
    setAnswers({ ...answers, [currentQuestion]: option });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    // Submit answers to backend
    navigate(`/quizzes/${quizId}/results`);
  };

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
              {question.options.map((option, index) => {
                const optionLetter = String.fromCharCode(65 + index);
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(optionLetter)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                      selectedAnswer === optionLetter
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <span className="font-semibold mr-2">{optionLetter}.</span>
                    {option}
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
                disabled={Object.keys(answers).length !== quiz.questions.length}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-300"
              >
                Submit Quiz
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
