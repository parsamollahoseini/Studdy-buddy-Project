import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import axios from 'axios';

function QuizResults() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`quiz_result_${quizId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setResult(parsed);
      if (parsed.quiz) {
        setQuiz(parsed.quiz);
      }
    }
  }, [quizId]);

  useEffect(() => {
    if (quiz || !result) return;

    axios.get(`http://localhost:8000/api/quizzes/${quizId}`)
      .then(r => setQuiz(r.data))
      .catch(() => {});
  }, [quiz, result, quizId]);

  const handleRetake = async () => {
    if (!result) return;
    setGeneratingQuiz(true);
    try {
      const r = await axios.post(`http://localhost:8000/api/notes/${result.noteId}/quiz`, {
        questionCount: result.totalQuestions,
      });
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
  const getOptionText = (question, letter) => {
    if (!question || !letter) return 'No answer selected';
    return question[`option_${letter.toLowerCase()}`] || 'No answer selected';
  };
  const getChoiceStyle = (letter, userAnswer, correctAnswer) => {
    const isUserChoice = userAnswer === letter;
    const isCorrectChoice = correctAnswer === letter;

    if (isCorrectChoice) {
      return {
        background: 'rgba(16,185,129,0.14)',
        border: '1px solid rgba(16,185,129,0.3)',
        color: '#d1fae5',
      };
    }

    if (isUserChoice) {
      return {
        background: 'rgba(239,68,68,0.14)',
        border: '1px solid rgba(239,68,68,0.28)',
        color: '#fecaca',
      };
    }

    return {
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      color: 'rgba(255,255,255,0.72)',
    };
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080818' }}>
      <Navigation />
      <div className="container mx-auto px-6 py-12" style={{ maxWidth: 760 }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <button onClick={() => setShowReview(current => !current)}
            style={{
              padding: '1rem', borderRadius: '0.875rem',
              background: showReview ? 'rgba(168,85,247,0.18)' : 'rgba(168,85,247,0.12)',
              border: '1px solid rgba(168,85,247,0.3)',
              color: '#d8b4fe', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem',
            }}>{showReview ? 'Hide Review' : 'Show Quiz Review'}</button>

          <button onClick={() => navigate(`/notes/${noteId}/flashcards`)}
            style={{
              padding: '1rem', borderRadius: '0.875rem',
              background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
              color: '#93c5fd', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem',
            }}>🃏 Flashcards</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
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

        {showReview && quiz && (
          <div style={{
            marginTop: '1.5rem',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: '1.5rem',
            padding: '1.25rem',
          }}>
            <h2 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Quiz Review
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {quiz.questions.map((question, index) => {
                const userAnswer = result.answers?.[index] || '';
                const correctAnswer = question.correct_option;
                const isCorrect = userAnswer === correctAnswer;

                return (
                  <div key={question.id || index} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isCorrect ? 'rgba(52,211,153,0.22)' : 'rgba(248,113,113,0.22)'}`,
                    borderRadius: '1rem',
                    padding: '1rem',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
                      <div style={{ color: 'white', fontWeight: 600, lineHeight: 1.6 }}>
                        {index + 1}. {question.question}
                      </div>
                      <div style={{
                        color: isCorrect ? '#6ee7b7' : '#fca5a5',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                      }}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gap: '0.55rem' }}>
                      <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem' }}>
                        <strong style={{ color: '#93c5fd' }}>Your answer:</strong>{' '}
                        {userAnswer ? `${userAnswer}. ${getOptionText(question, userAnswer)}` : 'No answer selected'}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem' }}>
                        <strong style={{ color: '#6ee7b7' }}>Correct answer:</strong>{' '}
                        {correctAnswer}. {getOptionText(question, correctAnswer)}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gap: '0.55rem', marginTop: '0.9rem' }}>
                      {['A', 'B', 'C', 'D'].map(letter => {
                        const choiceStyle = getChoiceStyle(letter, userAnswer, correctAnswer);
                        const isUserChoice = userAnswer === letter;
                        const isCorrectChoice = correctAnswer === letter;

                        return (
                          <div key={letter} style={{
                            ...choiceStyle,
                            borderRadius: '0.85rem',
                            padding: '0.8rem 0.95rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '1rem',
                            alignItems: 'center',
                          }}>
                            <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'flex-start' }}>
                              <span style={{ fontWeight: 800, minWidth: 18 }}>{letter}.</span>
                              <span style={{ lineHeight: 1.5 }}>{getOptionText(question, letter)}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                              {isUserChoice && (
                                <span style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  color: '#93c5fd',
                                  background: 'rgba(59,130,246,0.16)',
                                  border: '1px solid rgba(59,130,246,0.25)',
                                  borderRadius: '999px',
                                  padding: '0.2rem 0.5rem',
                                }}>
                                  Your choice
                                </span>
                              )}
                              {isCorrectChoice && (
                                <span style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  color: '#6ee7b7',
                                  background: 'rgba(16,185,129,0.16)',
                                  border: '1px solid rgba(16,185,129,0.25)',
                                  borderRadius: '999px',
                                  padding: '0.2rem 0.5rem',
                                }}>
                                  Correct
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizResults;
