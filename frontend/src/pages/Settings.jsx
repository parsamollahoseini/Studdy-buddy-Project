import Navigation from '../components/Navigation';

const stack = [
  { icon: '⚛️', label: 'React 19 + Vite', desc: 'Frontend framework & build tool' },
  { icon: '🎨', label: 'TailwindCSS v4', desc: 'Utility-first styling' },
  { icon: '🐍', label: 'FastAPI + SQLAlchemy', desc: 'Python REST API & ORM' },
  { icon: '🗄️', label: 'SQLite / PostgreSQL', desc: 'Local dev / production DB' },
  { icon: '📄', label: 'PyPDF2', desc: 'PDF text extraction' },
  { icon: '🔐', label: 'JWT Auth (python-jose)', desc: 'Secure token authentication' },
];

const team = [
  { name: 'Parsa Mollahoseini', role: 'Project Lead / Full-Stack' },
  { name: 'Mehrad Bayat', role: 'Backend Developer' },
  { name: 'Kevin George Buhain', role: 'Frontend Developer' },
];

function Settings() {
  return (
    <div style={{ minHeight: '100vh', background: '#080818' }}>
      <Navigation />
      <div className="container mx-auto px-6 py-12" style={{ maxWidth: 720 }}>
        <h1 style={{
          fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.6))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>Settings</h1>
        <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '2.5rem', fontSize: '0.9rem' }}>App info · Group T25 · Capstone II</p>

        {/* About */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '1.25rem', padding: '1.75rem', marginBottom: '1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem',
              boxShadow: '0 0 20px rgba(99,102,241,0.35)',
            }}>⚡</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'white' }}>Study Buddy</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>v2.0 · Capstone II Final Build</div>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.65 }}>
            Upload your notes and instantly generate flashcards, quizzes, and spaced repetition study sessions.
            Track your progress with real-time charts and export to Anki or Quizlet.
          </p>
        </div>

        {/* Tech stack */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '1.25rem', padding: '1.75rem', marginBottom: '1.25rem',
        }}>
          <h2 style={{ fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            Tech Stack
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {stack.map(({ icon, label, desc }) => (
              <div key={label} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '0.875rem', padding: '0.875rem 1rem',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
              }}>
                <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                <div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>{label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '1.25rem', padding: '1.75rem',
        }}>
          <h2 style={{ fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            Team — Group T25
          </h2>
          {team.map(({ name, role }) => (
            <div key={name} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.875rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{name}</span>
              <span style={{
                color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem',
                background: 'rgba(255,255,255,0.05)', borderRadius: '2rem',
                padding: '0.2rem 0.75rem',
              }}>{role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Settings;
