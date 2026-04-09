import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navigation() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      background: 'rgba(8,8,24,0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
            }}>⚡</div>
            <span style={{
              fontWeight: 700, fontSize: '1.2rem',
              background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Study Buddy</span>
          </Link>

          <div className="flex items-center gap-1">
            {[
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/upload', label: 'Upload' },
              { to: '/study', label: 'Study' },
              { to: '/settings', label: 'Settings' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} style={{
                color: 'rgba(255,255,255,0.6)',
                padding: '0.4rem 0.75rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'all 0.15s',
                textDecoration: 'none',
              }}
              onMouseEnter={e => { e.target.style.color = 'white'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
              onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.6)'; e.target.style.background = 'transparent'; }}>
                {label}
              </Link>
            ))}

            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', margin: '0 0.75rem' }} />

            {token ? (
              <div className="flex items-center gap-3">
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                  {user?.name || 'User'}
                </span>
                <button onClick={handleLogout} style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)',
                  padding: '0.35rem 0.9rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}>
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" style={{
                background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
                color: 'white',
                padding: '0.4rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 0 16px rgba(99,102,241,0.35)',
              }}>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
