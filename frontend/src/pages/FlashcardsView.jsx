import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '../components/Navigation';

function FlashcardsView() {
  const { noteId } = useParams();
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Mock data - will be replaced with API call
  const flashcards = [
    { question: 'What is React?', answer: 'A JavaScript library for building user interfaces' },
    { question: 'What is a component?', answer: 'A reusable piece of UI' },
    { question: 'What is JSX?', answer: 'JavaScript XML - syntax extension for JavaScript' }
  ];

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
        </div>
      </div>
    </div>
  );
}

export default FlashcardsView;
