import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

function QuizResults() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  // Mock data - will be replaced with API call
  const result = {
    score: 75,
    totalQuestions: 2,
    correctAnswers: 1,
    noteId: '123'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Quiz Results</h1>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-12 rounded-lg shadow-md text-center mb-6">
            <div className="text-6xl font-bold text-blue-600 mb-4">
              {result.score}%
            </div>
            <p className="text-2xl text-gray-700 mb-2">
              {result.correctAnswers} out of {result.totalQuestions} correct
            </p>
            <p className="text-gray-600">
              {result.score >= 80 ? 'Excellent work!' : result.score >= 60 ? 'Good job!' : 'Keep practicing!'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate(`/notes/${result.noteId}/flashcards`)}
              className="bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Generate Flashcards
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-gray-700 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizResults;
