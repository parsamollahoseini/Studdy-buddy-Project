import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/progress')
      .then(r => setStats(r.data))
      .finally(() => setLoadingStats(false));

    axios.get('http://localhost:8000/api/notes')
      .then(r => setNotes(r.data))
      .finally(() => setLoadingNotes(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ minHeight: '100vh', background: '#080818' }}>
      <Navigation />

      {/* Ambient blobs */}
      <div style={{ position: 'fixed', top: '-5%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '0', left: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
            {greeting}{user?.name ? `, ${user.name}` : ''} 👋
          </p>
          <h1 style={{
            fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0,
            background: 'linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.5))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Dashboard</h1>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Flashcards', value: stats?.totalFlashcards ?? '—', icon: '🃏', color: '#60a5fa' },
            { label: 'Quizzes Taken', value: stats?.totalQuizzes ?? '—', icon: '✅', color: '#34d399' },
            { label: 'Avg Score', value: stats ? `${stats.averageScore}%` : '—', icon: '📊', color: '#a78bfa' },
            { label: 'Day Streak', value: stats?.studyStreak ?? '—', icon: '🔥', color: '#fbbf24' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '1rem', padding: '1.25rem 1.5rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
              <span style={{ fontSize: '1.5rem' }}>{icon}</span>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color, lineHeight: 1 }}>
                  {loadingStats ? <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '1rem' }}>—</span> : value}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', marginTop: '0.2rem' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main 2-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem', alignItems: 'start' }}>

          {/* Recent Notes */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Recent Notes</h2>
              <Link to="/upload" style={{
                fontSize: '0.75rem', color: '#818cf8', textDecoration: 'none', fontWeight: 600,
                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
                padding: '0.25rem 0.75rem', borderRadius: '2rem',
              }}>+ Upload new</Link>
            </div>

            {loadingNotes ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.875rem' }}>Loading...</div>
            ) : notes.length === 0 ? (
              <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📂</div>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>No notes yet. Upload your first file to get started.</p>
                <Link to="/upload" style={{
                  display: 'inline-block', textDecoration: 'none',
                  background: 'linear-gradient(135deg, #3b82f6, #7c3aed)', color: 'white',
                  padding: '0.6rem 1.25rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.875rem',
                }}>Upload Notes →</Link>
              </div>
            ) : (
              <div>
                {notes.map((note, i) => (
                  <div key={note.id}
                    onClick={() => navigate(`/notes/${note.id}`)}
                    style={{
                      padding: '1rem 1.5rem',
                      borderBottom: i < notes.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      cursor: 'pointer', transition: 'background 0.15s', display: 'flex', alignItems: 'center', gap: '1rem',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '0.625rem', flexShrink: 0,
                      background: note.source_type === 'pdf' ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)',
                      border: note.source_type === 'pdf' ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(59,130,246,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
                    }}>
                      {note.source_type === 'pdf' ? '📄' : '📝'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {note.title}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '0.15rem' }}>
                        {note.source_type?.toUpperCase()} · {timeAgo(note.created_at)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/notes/${note.id}/flashcards`); }}
                        style={{
                          padding: '0.3rem 0.7rem', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: 600,
                          background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)',
                          color: '#93c5fd', cursor: 'pointer',
                        }}>Cards</button>
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/notes/${note.id}`); }}
                        style={{
                          padding: '0.3rem 0.7rem', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: 600,
                          background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
                          color: '#6ee7b7', cursor: 'pointer',
                        }}>Quiz</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Quick Actions */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.25rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>Quick Actions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {[
                  { to: '/upload', icon: '📤', label: 'Upload Notes', sub: 'PDF or TXT', color: '#60a5fa', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
                  { to: '/study', icon: '🔁', label: 'Study Session', sub: 'Spaced repetition', color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
                ].map(({ to, icon, label, sub, color, bg, border }) => (
                  <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.875rem',
                      padding: '0.75rem', borderRadius: '0.875rem',
                      background: bg, border: `1px solid ${border}`,
                      transition: 'all 0.15s', cursor: 'pointer',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.filter = 'none'; }}>
                      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                      <div>
                        <div style={{ color, fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.2 }}>{label}</div>
                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>{sub}</div>
                      </div>
                      <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.2)', fontSize: '0.875rem' }}>›</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tip card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: '1.25rem', padding: '1.25rem',
            }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>💡</div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', lineHeight: 1.6, margin: 0 }}>
                <strong style={{ color: 'white' }}>Pro tip:</strong> Use the Study Session to review cards with spaced repetition — it schedules reviews right when you're about to forget.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
