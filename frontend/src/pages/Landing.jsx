import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Landing() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [demoLoading, setDemoLoading] = useState(false);

  const features = [
    { icon: '📤', title: 'Upload Notes', desc: 'PDF and TXT files extracted instantly' },
    { icon: '🃏', title: 'Smart Flashcards', desc: 'Auto-generated from your content' },
    { icon: '🧠', title: 'Adaptive Quizzes', desc: 'Multiple choice with scoring' },
    { icon: '🔁', title: 'Spaced Repetition', desc: 'SM-2 algorithm for retention' },
  ];

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/auth/demo');
      login(response.data.access_token);
      navigate('/dashboard');
    } catch {
      alert('Failed to open demo account');
      setDemoLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080818', color: 'white', overflow: 'hidden' }}>
      {/* Ambient glow blobs */}
      <div style={{
        position: 'fixed', top: '-20%', left: '-10%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-20%', right: '-10%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Nav */}
      <nav style={{
        padding: '1.25rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div className="flex items-center gap-2">
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>⚡</div>
          <span style={{
            fontWeight: 700, fontSize: '1.1rem',
            background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Study Buddy</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login" style={{
            color: 'rgba(255,255,255,0.6)', padding: '0.4rem 1rem',
            borderRadius: '0.5rem', textDecoration: 'none', fontSize: '0.875rem',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>Log in</Link>
          <Link to="/register" style={{
            background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
            color: 'white', padding: '0.4rem 1rem', borderRadius: '0.5rem',
            textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600,
            boxShadow: '0 0 20px rgba(99,102,241,0.4)',
          }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '6rem 2rem 4rem', position: 'relative' }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(99,102,241,0.12)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '2rem',
          padding: '0.35rem 1rem',
          fontSize: '0.8rem',
          color: '#a78bfa',
          marginBottom: '1.5rem',
          fontWeight: 500,
        }}>
          ✦ Capstone II · Group T25
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          letterSpacing: '-0.02em',
        }}>
          Study Smarter,<br />
          <span style={{
            background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Not Harder.</span>
        </h1>

        <p style={{
          fontSize: '1.15rem', color: 'rgba(255,255,255,0.5)',
          maxWidth: 520, margin: '0 auto 2.5rem', lineHeight: 1.7,
        }}>
          Upload your notes and instantly generate flashcards, quizzes,
          and personalized study sessions powered by spaced repetition.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/register" style={{
            background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
            color: 'white', padding: '0.85rem 2rem', borderRadius: '0.75rem',
            textDecoration: 'none', fontWeight: 700, fontSize: '1rem',
            boxShadow: '0 0 30px rgba(99,102,241,0.45)',
            display: 'inline-block',
          }}>
            Start for free →
          </Link>
          <button onClick={handleDemoLogin} disabled={demoLoading} style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.8)', padding: '0.85rem 2rem',
            borderRadius: '0.75rem', fontWeight: 600,
            fontSize: '1rem', display: 'inline-block', cursor: demoLoading ? 'wait' : 'pointer',
            opacity: demoLoading ? 0.75 : 1,
          }}>
            {demoLoading ? 'Opening Demo...' : 'View Demo'}
          </button>
        </div>
      </div>

      {/* Feature grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem', maxWidth: 900, margin: '0 auto', padding: '0 2rem 6rem',
      }}>
        {features.map(({ icon, title, desc }) => (
          <div key={title} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '1rem', padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            transition: 'border-color 0.2s',
          }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{icon}</div>
            <div style={{ fontWeight: 600, marginBottom: '0.4rem' }}>{title}</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', lineHeight: 1.5 }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Landing;
