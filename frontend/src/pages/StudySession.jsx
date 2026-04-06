import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navigation from '../components/Navigation';

const RATINGS = [
  { label: 'Again', quality: 1, color: '#ef4444', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', desc: 'Forgot' },
  { label: 'Hard',  quality: 2, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', desc: 'Difficult' },
  { label: 'Good',  quality: 4, color: '#10b981', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', desc: 'Recalled' },
  { label: 'Easy',  quality: 5, color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', desc: 'Perfect' },
];

function StudySession() {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/api/study/due')
      .then(r => setCards(r.data))
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, []);

  const handleRate = async (quality) => {
    if (submitting) return;
    setSubmitting(true);
    try { await axios.post(`http://localhost:8000/api/flashcards/${cards[index].id}/review`, { quality }); } catch {}
    const next = reviewed + 1;
    setReviewed(next);
    if (index + 1 >= cards.length) { setDone(true); }
    else { setIndex(i => i + 1); setRevealed(false); }
    setSubmitting(false);
  };

  const pageStyle = { minHeight: '100vh', background: '#080818' };
  const centeredStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' };

  if (loading) return <div style={pageStyle}><Navigation /><div style={{ ...centeredStyle, color: 'rgba(255,255,255,0.35)' }}>Loading cards...</div></div>;

  if (cards.length === 0) return (
    <div style={pageStyle}><Navigation />
      <div style={centeredStyle}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>All caught up!</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '2rem' }}>No cards due for review today. Come back tomorrow!</p>
        <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>Back to Dashboard</Link>
      </div>
    </div>
  );

  if (done) return (
    <div style={pageStyle}><Navigation />
      <div style={centeredStyle}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>Session Complete!</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '2rem' }}>
          Reviewed <strong style={{ color: 'white' }}>{reviewed}</strong> card{reviewed !== 1 ? 's' : ''} · intervals updated
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/study" onClick={() => window.location.reload()} className="btn-primary" style={{ textDecoration: 'none' }}>Study Again</Link>
          <Link to="/dashboard" style={{
            textDecoration: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.75rem',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.7)', fontWeight: 600,
          }}>Dashboard</Link>
        </div>
      </div>
    </div>
  );

  const card = cards[index];
  const progress = Math.round((index / cards.length) * 100);

  return (
    <div style={pageStyle}>
      <Navigation />
      <div className="container mx-auto px-6 py-10" style={{ maxWidth: 680 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{
            fontSize: '1.75rem', fontWeight: 800,
            background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.6))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Study Session</h1>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem' }}>{index + 1} / {cards.length}</span>
        </div>

        {/* Progress */}
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 4, height: 4, marginBottom: '2rem', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #7c3aed)', borderRadius: 4, transition: 'width 0.3s' }} />
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '1.5rem', padding: '2.5rem', marginBottom: '1.5rem', minHeight: 200,
        }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>Question</p>
          <p style={{ fontSize: '1.2rem', color: 'white', fontWeight: 500, lineHeight: 1.65 }}>{card.question}</p>

          {revealed && (
            <div style={{ marginTop: '1.75rem', paddingTop: '1.75rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <p style={{ color: 'rgba(99,102,241,0.8)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Answer</p>
              <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.65 }}>{card.answer}</p>
            </div>
          )}
        </div>

        {!revealed ? (
          <button onClick={() => setRevealed(true)} className="btn-primary" style={{ width: '100%', fontSize: '1rem' }}>
            Reveal Answer
          </button>
        ) : (
          <div>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', marginBottom: '0.875rem' }}>
              How well did you remember?
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem' }}>
              {RATINGS.map(({ label, quality, color, bg, border, desc }) => (
                <button key={quality} onClick={() => handleRate(quality)} disabled={submitting} style={{
                  padding: '0.875rem 0.5rem', borderRadius: '0.875rem',
                  background: bg, border: `1px solid ${border}`, color,
                  fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.5 : 1, transition: 'all 0.15s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
                }}>
                  <span style={{ fontSize: '1rem' }}>{label}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.75 }}>{desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudySession;
