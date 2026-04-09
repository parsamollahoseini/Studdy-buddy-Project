import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import axios from 'axios';

function FlashcardsView() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/notes/${noteId}/flashcards`)
      .then(r => {
        setFlashcards(r.data);
        const max = Math.max(1, r.data.length || 1);
        const minimum = Math.min(5, max);
        setQuestionCount(current => Math.min(Math.max(current, minimum), max));
      })
      .catch(() => setError('Failed to load flashcards.'))
      .finally(() => setLoading(false));
  }, [noteId]);

  const handleGenerateQuiz = async () => {
    setGeneratingQuiz(true);
    try {
      const r = await axios.post(`http://localhost:8000/api/notes/${noteId}/quiz`, { questionCount });
      navigate(`/quizzes/${r.data.quizId}`);
    } catch { alert('Failed to generate quiz'); setGeneratingQuiz(false); }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/export/flashcards/${noteId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `flashcards_${noteId}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to export flashcards');
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#080818' }}><Navigation />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'rgba(255,255,255,0.4)' }}>Loading flashcards...</div>
    </div>
  );

  if (error || flashcards.length === 0) return (
    <div style={{ minHeight: '100vh', background: '#080818' }}><Navigation />
      <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'rgba(255,255,255,0.5)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🃏</div>
        <p style={{ marginBottom: '1.5rem' }}>{error || 'No flashcards yet. Generate them from your note.'}</p>
        <button onClick={() => navigate(`/notes/${noteId}`)} className="btn-primary">Back to Note</button>
      </div>
    </div>
  );

  const card = flashcards[current];
  const progress = ((current + 1) / flashcards.length) * 100;

  return (
    <div style={{ minHeight: '100vh', background: '#080818' }}>
      <Navigation />
      <div className="container mx-auto px-6 py-10" style={{ maxWidth: 700 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{
            fontSize: '1.75rem', fontWeight: 800,
            background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.6))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Flashcards</h1>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem' }}>
            {current + 1} / {flashcards.length}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 4, height: 4, marginBottom: '2rem', overflow: 'hidden' }}>
          <div style={{
            width: `${progress}%`, height: '100%', borderRadius: 4,
            background: 'linear-gradient(90deg, #3b82f6, #7c3aed)',
            transition: 'width 0.3s ease',
          }} />
        </div>

        {/* Card */}
        <div
          onClick={() => setFlipped(!flipped)}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1.5rem', padding: '3rem 2rem',
            minHeight: 280, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', transition: 'all 0.2s',
            boxShadow: flipped ? '0 0 30px rgba(99,102,241,0.15)' : 'none',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
          <div style={{
            display: 'inline-block',
            background: flipped ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${flipped ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '2rem', padding: '0.25rem 0.85rem',
            fontSize: '0.7rem', color: flipped ? '#a78bfa' : 'rgba(255,255,255,0.4)',
            marginBottom: '1.5rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            {flipped ? 'Answer' : 'Question'} · click to flip
          </div>
          <p style={{ fontSize: '1.25rem', color: 'white', lineHeight: 1.6, fontWeight: 500 }}>
            {flipped ? card.answer : card.question}
          </p>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', gap: '1rem' }}>
          <button onClick={() => { setCurrent(c => c - 1); setFlipped(false); }} disabled={current === 0}
            style={{
              flex: 1, padding: '0.75rem', borderRadius: '0.75rem',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: current === 0 ? 'rgba(255,255,255,0.2)' : 'white',
              cursor: current === 0 ? 'not-allowed' : 'pointer', fontWeight: 600,
            }}>← Previous</button>
          <button onClick={() => { setCurrent(c => c + 1); setFlipped(false); }} disabled={current === flashcards.length - 1}
            style={{
              flex: 1, padding: '0.75rem', borderRadius: '0.75rem',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: current === flashcards.length - 1 ? 'rgba(255,255,255,0.2)' : 'white',
              cursor: current === flashcards.length - 1 ? 'not-allowed' : 'pointer', fontWeight: 600,
            }}>Next →</button>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: '1rem', marginTop: '1.5rem', marginBottom: '1rem',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '1rem', padding: '0.9rem 1rem',
        }}>
          <div>
            <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.15rem' }}>Quiz length</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
              Choose between {Math.min(5, flashcards.length)} and {flashcards.length} question{flashcards.length === 1 ? '' : 's'}.
            </div>
          </div>
          <select
            value={questionCount}
            onChange={e => setQuestionCount(Number(e.target.value))}
            disabled={generatingQuiz}
            style={{
              background: 'rgba(8,8,24,0.9)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'white',
              borderRadius: '0.75rem',
              padding: '0.45rem 0.65rem',
              minWidth: 72,
              fontSize: '0.85rem',
            }}
          >
            {Array.from({ length: flashcards.length - Math.min(5, flashcards.length) + 1 }, (_, i) => i + Math.min(5, flashcards.length)).map(count => (
              <option key={count} value={count}>{count}</option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button onClick={handleGenerateQuiz} disabled={generatingQuiz}
            style={{
              padding: '0.875rem', borderRadius: '0.75rem',
              background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
              color: '#6ee7b7', fontWeight: 600, cursor: generatingQuiz ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem', opacity: generatingQuiz ? 0.6 : 1,
            }}>
            {generatingQuiz ? 'Generating...' : '🧠 Generate Quiz'}
          </button>
          <button onClick={handleExport}
            style={{
              padding: '0.875rem', borderRadius: '0.75rem',
              background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
              color: '#a5b4fc', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem',
            }}>
            📥 Export CSV
          </button>
          <button onClick={() => navigate(`/notes/${noteId}`)}
            style={{
              padding: '0.875rem', borderRadius: '0.75rem',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem',
            }}>
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default FlashcardsView;
