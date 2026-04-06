import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import axios from 'axios';

function QuizView() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/quizzes/${quizId}`)
      .then(r => setQuiz(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [quizId]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const answersArray = quiz.questions.map((_, i) => answers[i] || '');
      const r = await axios.post(`http://localhost:8000/api/quizzes/${quizId}/results`, { answers: answersArray });
      localStorage.setItem(`quiz_result_${quizId}`, JSON.stringify(r.data));
      navigate(`/quizzes/${quizId}/results`);
    } catch { alert('Failed to submit quiz'); setSubmitting(false); }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#080818' }}><Navigation />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'rgba(255,255,255,0.4)' }}>Loading quiz...</div>
    </div>
  );

  if (!quiz) return (
    <div style={{ minHeight: '100vh', background: '#080818' }}><Navigation />
      <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.4)' }}>Quiz not found.</div>
    </div>
  );

  const q = quiz.questions[currentQ];
  const selected = answers[currentQ];
  const allAnswered = Object.keys(answers).length === quiz.questions.length;
  const progress = ((currentQ + 1) / quiz.questions.length) * 100;

  const optionStyle = (letter) => ({
    width: '100%', textAlign: 'left', padding: '1rem 1.25rem',
    borderRadius: '0.875rem', marginBottom: '0.75rem',
    border: selected === letter
      ? '1px solid rgba(99,102,241,0.6)'
      : '1px solid rgba(255,255,255,0.08)',
    background: selected === letter
      ? 'rgba(99,102,241,0.18)'
      : 'rgba(255,255,255,0.03)',
    color: selected === letter ? '#c4b5fd' : 'rgba(255,255,255,0.7)',
    cursor: 'pointer', fontWeight: selected === letter ? 600 : 400,
    transition: 'all 0.15s', fontSize: '0.95rem',
    boxShadow: selected === letter ? '0 0 16px rgba(99,102,241,0.2)' : 'none',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#080818' }}>
      <Navigation />
      <div className="container mx-auto px-6 py-10" style={{ maxWidth: 680 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h1 style={{
            fontSize: '1.5rem', fontWeight: 800,
            background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.5))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>{quiz.title}</h1>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>
            {currentQ + 1} / {quiz.questions.length}
          </span>
        </div>

        {/* Progress */}
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 4, height: 4, marginBottom: '2rem', overflow: 'hidden' }}>
          <div style={{
            width: `${progress}%`, height: '100%', borderRadius: 4,
            background: 'linear-gradient(90deg, #3b82f6, #7c3aed)', transition: 'width 0.3s',
          }} />
        </div>

        {/* Question card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '1.5rem', padding: '2rem', marginBottom: '1.5rem',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Question {currentQ + 1}
          </p>
          <h2 style={{ fontSize: '1.2rem', color: 'white', fontWeight: 600, lineHeight: 1.6, marginBottom: '1.75rem' }}>
            {q.question}
          </h2>

          {['A', 'B', 'C', 'D'].map(letter => (
            <button key={letter} onClick={() => setAnswers({ ...answers, [currentQ]: letter })}
              style={optionStyle(letter)}
              onMouseEnter={e => { if (selected !== letter) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; } }}
              onMouseLeave={e => { if (selected !== letter) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; } }}>
              <span style={{ fontWeight: 700, marginRight: '0.75rem', color: selected === letter ? '#818cf8' : 'rgba(255,255,255,0.3)' }}>{letter}.</span>
              {q[`option_${letter.toLowerCase()}`]}
            </button>
          ))}
        </div>

        {/* Nav buttons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setCurrentQ(q => q - 1)} disabled={currentQ === 0}
            style={{
              flex: 1, padding: '0.875rem', borderRadius: '0.75rem',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
              color: currentQ === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
              cursor: currentQ === 0 ? 'not-allowed' : 'pointer', fontWeight: 600,
            }}>← Previous</button>

          {currentQ === quiz.questions.length - 1 ? (
            <button onClick={handleSubmit} disabled={!allAnswered || submitting}
              className="btn-primary" style={{ flex: 2 }}>
              {submitting ? 'Submitting...' : allAnswered ? 'Submit Quiz ✓' : 'Answer all questions'}
            </button>
          ) : (
            <button onClick={() => setCurrentQ(q => q + 1)}
              style={{
                flex: 1, padding: '0.875rem', borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
                border: 'none', color: 'white', cursor: 'pointer', fontWeight: 600,
                boxShadow: '0 0 16px rgba(99,102,241,0.25)',
              }}>Next →</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizView;
