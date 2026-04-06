import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import axios from 'axios';

function QuizResults() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`quiz_result_${quizId}`);
    if (stored) setResult(JSON.parse(stored));
  }, [quizId]);

  const handleRetake = async () => {
    if (!result) return;
    setGeneratingQuiz(true);
    try {
      const r = await axios.post(`http://localhost:8000/api/notes/${result.noteId}/quiz`);
      navigate(`/quizzes/${r.data.quizId}`);
    } catch { alert('Failed to generate quiz'); setGeneratingQuiz(false); }
  };

  if (!result) return (
    <div style={{ minHeight: '100vh', background: '#080818' }}><Navigation />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'rgba(255,255,255,0.4)' }}>No results found.</div>
    </div>
  );

  const { score, correctAnswers, totalQuestions, noteId } = result;
  const getColor = () => score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#f87171';
  const getMessage = () => score >= 80 ? 'Excellent work! 🎉' : score >= 60 ? 'Good job! 👍' : 'Keep practicing! 💪';

  return (
    <div style={{ minHeight: '100vh', background: '#080818' }}>
      <Navigation />
      <div className="container mx-auto px-6 py-12" style={{ maxWidth: 600 }}>
        <h1 style={{
          fontSize: '2rem', fontWeight: 800, marginBottom: '2rem',
          background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.6))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>Quiz Results</h1>

        {/* Score card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '1.5rem', padding: '3rem 2rem',
          textAlign: 'center', marginBottom: '1.5rem',
        }}>
          {/* Circular score */}
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            background: `conic-gradient(${getColor()} ${score * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: `0 0 30px ${getColor()}40`,
          }}>
            <div style={{
              width: 94, height: 94, borderRadius: '50%',
              background: '#080818',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column',
            }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: getColor() }}>{score}%</span>
            </div>
          </div>

          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
            {correctAnswers} / {totalQuestions} correct
          </p>
          <p style={{ color: getColor(), fontWeight: 600, fontSize: '1rem' }}>{getMessage()}</p>
        </div>

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          <button onClick={() => navigate(`/notes/${noteId}/flashcards`)}
            style={{
              padding: '1rem', borderRadius: '0.875rem',
              background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
              color: '#93c5fd', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem',
            }}>🃏 Flashcards</button>

          <button onClick={handleRetake} disabled={generatingQuiz}
            style={{
              padding: '1rem', borderRadius: '0.875rem',
              background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
              color: '#6ee7b7', fontWeight: 600, cursor: generatingQuiz ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem', opacity: generatingQuiz ? 0.6 : 1,
            }}>{generatingQuiz ? 'Loading...' : '🔄 Retake'}</button>

          <button onClick={() => navigate('/dashboard')}
            style={{
              padding: '1rem', borderRadius: '0.875rem',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
              color: 'rgba(255,255,255,0.6)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem',
            }}>🏠 Dashboard</button>
        </div>
      </div>
    </div>
  );
}

export default QuizResults;
