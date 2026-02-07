import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import axios from 'axios';

function NoteView() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    // For now, we'll store the note data in localStorage since we don't have a GET endpoint yet
    const storedNote = localStorage.getItem(`note_${noteId}`);
    if (storedNote) {
      setNote(JSON.parse(storedNote));
    }
    setLoading(false);
  }, [noteId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await axios.post(`http://localhost:8000/api/notes/${noteId}/flashcards`);
      navigate(`/notes/${noteId}/flashcards`);
    } catch (error) {
      alert('Failed to generate flashcards');
      setGenerating(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setGenerating(true);
    try {
      const response = await axios.post(`http://localhost:8000/api/notes/${noteId}/quiz`);
      navigate(`/quizzes/${response.data.quizId}`);
    } catch (error) {
      alert('Failed to generate quiz');
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (!note) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Note not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{note.title}</h1>
        <p className="text-gray-600 mb-8">Note ID: {noteId}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            Generate Flashcards
          </button>

          <button
            onClick={handleGenerateQuiz}
            disabled={generating}
            className="bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
          >
            Generate Quiz
          </button>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Extracted Text</h2>
          <div className="whitespace-pre-wrap text-gray-700 border-t pt-4">
            {note.extractedText}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteView;
