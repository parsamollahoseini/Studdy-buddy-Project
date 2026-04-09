import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import NoteView from './pages/NoteView';
import FlashcardsView from './pages/FlashcardsView';
import QuizView from './pages/QuizView';
import QuizResults from './pages/QuizResults';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import StudySession from './pages/StudySession';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/notes/:noteId" element={<NoteView />} />
        <Route path="/notes/:noteId/flashcards" element={<FlashcardsView />} />
        <Route path="/quizzes/:quizId" element={<QuizView />} />
        <Route path="/quizzes/:quizId/results" element={<QuizResults />} />
        <Route path="/progress" element={<Navigate to="/dashboard" replace />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/study" element={<StudySession />} />
      </Routes>
    </Router>
  );
}

export default App;
