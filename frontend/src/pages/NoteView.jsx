import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import axios from 'axios';

function NoteView() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/notes/${noteId}`)
      .then(r => setNote({ title: r.data.title, extractedText: r.data.extracted_text }))
      .catch(() => {
        const stored = localStorage.getItem(`note_${noteId}`);
        if (stored) setNote(JSON.parse(stored));
      })
      .finally(() => setLoading(false));
  }, [noteId]);

  const handleFlashcards = async () => {
    setGenerating('flashcards');
    try {
      await axios.post(`http://localhost:8000/api/notes/${noteId}/flashcards`);
      navigate(`/notes/${noteId}/flashcards`);
    } catch { alert('Failed to generate flashcards'); setGenerating(null); }
  };

  const handleQuiz = async () => {
    setGenerating('quiz');
    try {
      const r = await axios.post(`http://localhost:8000/api/notes/${noteId}/quiz`);
      navigate(`/quizzes/${r.data.quizId}`);
    } catch { alert('Failed to generate quiz'); setGenerating(null); }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#080818' }}>
      <Navigation />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'rgba(255,255,255,0.4)' }}>
        Loading note...
      </div>
    </div>
  );

  if (!note) return (
    <div style={{ minHeight: '100vh', background: '#080818' }}>
      <Navigation />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'rgba(255,255,255,0.4)' }}>
        Note not found
      </div>
    </div>
  );

  const actions = [
    { key: 'flashcards', icon: '🃏', label: 'Generate Flashcards', onClick: handleFlashcards, color: '#3b82f6', glow: 'rgba(59,130,246,0.3)' },
    { key: 'quiz', icon: '🧠', label: 'Generate Quiz', onClick: handleQuiz, color: '#10b981', glow: 'rgba(16,185,129,0.3)' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#080818' }}>
      <Navigation />
      <div className="container mx-auto px-6 py-10" style={{ maxWidth: 860 }}>
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Note #{noteId}</p>
          <h1 style={{
            fontSize: '2rem', fontWeight: 800,
            background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.6))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>{note.title}</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          {actions.map(({ key, icon, label, onClick, color, glow }) => (
            <button key={key} onClick={onClick} disabled={!!generating} style={{
              background: `${color}18`,
              border: `1px solid ${color}40`,
              borderRadius: '1rem', padding: '1.25rem',
              color: 'white', fontWeight: 600, fontSize: '1rem',
              cursor: generating ? 'not-allowed' : 'pointer',
              opacity: generating && generating !== key ? 0.5 : 1,
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              justifyContent: 'center',
            }}
            onMouseEnter={e => { if (!generating) e.currentTarget.style.boxShadow = `0 0 20px ${glow}`; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}>
              <span style={{ fontSize: '1.25rem' }}>{icon}</span>
              {generating === key ? 'Generating...' : label}
            </button>
          ))}
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '1.25rem', padding: '1.75rem',
        }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
            Extracted Text
          </h2>
          <div style={{
            whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75,
            fontSize: '0.9rem', maxHeight: '400px', overflowY: 'auto',
          }}>
            {note.extractedText}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteView;
