import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import axios from 'axios';

function FlashcardsView() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/notes/${noteId}/flashcards`
        );
        setFlashcards(response.data);
      } catch {
        setError('Failed to load flashcards.');
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, [noteId]);

  const handleNext = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setFlipped(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setGeneratingQuiz(true);
    try {
      const response = await axios.post(
        `http://localhost:8000/api/notes/${noteId}/quiz`
      );
      navigate(`/quizzes/${response.data.quizId}`);
    } catch {
      alert('Failed to generate quiz');
      setGeneratingQuiz(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-20 text-gray-600">Loading flashcards...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-6 py-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">No Flashcards Yet</h1>
          <p className="text-gray-600 mb-6">Generate flashcards from your note first.</p>
          <button
            onClick={() => navigate(`/notes/${noteId}`)}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Back to Note
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Flashcards</h1>

        <div className="max-w-2xl mx-auto">
          <div className="mb-4 text-center text-gray-600">
            Card {currentCard + 1} of {flashcards.length}
          </div>

          <div
            onClick={() => setFlipped(!flipped)}
            className="bg-white p-12 rounded-lg shadow-lg cursor-pointer min-h-[300px] flex items-center justify-center hover:shadow-xl transition"
          >
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                {flipped ? 'Answer' : 'Question'} (Click to flip)
              </p>
              <p className="text-2xl">
                {flipped ? flashcards[currentCard].answer : flashcards[currentCard].question}
              </p>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentCard === 0}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition disabled:bg-gray-300"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentCard === flashcards.length - 1}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-300"
            >
              Next
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleGenerateQuiz}
              disabled={generatingQuiz}
              className="bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {generatingQuiz ? 'Generating...' : 'Generate Quiz from Same Notes'}
            </button>
            <button
              onClick={() => navigate(`/notes/${noteId}`)}
              className="bg-gray-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-gray-700 transition"
            >
              Back to Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlashcardsView;
