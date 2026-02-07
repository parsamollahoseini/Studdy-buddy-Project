import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import NoteView from './pages/NoteView';
import FlashcardsView from './pages/FlashcardsView';
import QuizView from './pages/QuizView';
import QuizResults from './pages/QuizResults';
import Progress from './pages/Progress';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/notes/:noteId" element={<NoteView />} />
        <Route path="/notes/:noteId/flashcards" element={<FlashcardsView />} />
        <Route path="/quizzes/:quizId" element={<QuizView />} />
        <Route path="/quizzes/:quizId/results" element={<QuizResults />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
