import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Progress() {
  const [stats, setStats] = useState({ totalFlashcards: 0, totalQuizzes: 0, averageScore: 0, studyStreak: 0 });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8000/api/progress'),
      axios.get('http://localhost:8000/api/progress/history'),
    ])
      .then(([s, h]) => { setStats(s.data); setHistory(h.data.history || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const barColors = history.map(item =>
    item.score >= 80 ? 'rgba(59,130,246,0.8)' : item.score >= 60 ? 'rgba(245,158,11,0.8)' : 'rgba(239,68,68,0.8)'
  );

  const chartData = {
    labels: history.map(item => new Date(item.takenAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Score (%)',
      data: history.map(i => i.score),
      backgroundColor: barColors,
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15,15,40,0.95)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: 'rgba(255,255,255,0.5)',
        bodyColor: 'white',
        callbacks: {
          title: items => history[items[0].dataIndex]?.noteTitle || '',
          label: item => ` Score: ${item.raw}%`,
        },
      },
    },
    scales: {
      y: {
        min: 0, max: 100,
        ticks: { color: 'rgba(255,255,255,0.35)', callback: v => `${v}%` },
        grid: { color: 'rgba(255,255,255,0.05)' },
        border: { display: false },
      },
      x: {
        ticks: { color: 'rgba(255,255,255,0.35)' },
        grid: { display: false },
        border: { display: false },
      },
    },
  };

  const getTrend = () => {
    if (history.length < 4) return null;
    const mid = Math.floor(history.length / 2);
    const first = history.slice(0, mid).reduce((s, h) => s + h.score, 0) / mid;
    const second = history.slice(mid).reduce((s, h) => s + h.score, 0) / (history.length - mid);
    const diff = Math.round(second - first);
    if (diff > 2) return { label: `↑ +${diff}% trend`, color: '#34d399' };
    if (diff < -2) return { label: `↓ ${diff}% trend`, color: '#f87171' };
    return { label: '→ Steady', color: 'rgba(255,255,255,0.4)' };
  };

  const trend = getTrend();

  const statCards = [
    { icon: '🃏', value: stats.totalFlashcards, label: 'Flashcards', color: '#3b82f6' },
    { icon: '✅', value: stats.totalQuizzes, label: 'Quizzes Taken', color: '#10b981' },
    { icon: '📊', value: `${stats.averageScore}%`, label: 'Avg Score', color: '#8b5cf6' },
    { icon: '🔥', value: stats.studyStreak, label: 'Day Streak', color: '#f59e0b' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#080818' }}>
      <Navigation />
      <div className="container mx-auto px-6 py-12">
        <h1 style={{
          fontSize: '2rem', fontWeight: 800, marginBottom: '2rem',
          background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.6))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>Your Progress</h1>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', padding: '4rem' }}>Loading...</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {statCards.map(({ icon, value, label, color }) => (
                <div key={label} style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '1.25rem', padding: '1.5rem',
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{icon}</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color, marginBottom: '0.25rem' }}>{value}</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '1.25rem', padding: '1.75rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
                  Quiz Score History
                </h2>
                {trend && <span style={{ fontSize: '0.8rem', fontWeight: 600, color: trend.color }}>{trend.label}</span>}
              </div>

              {history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.25)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📈</div>
                  <p>Take a quiz to see your progress chart</p>
                </div>
              ) : (
                <div style={{ height: 280 }}>
                  <Bar data={chartData} options={chartOptions} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Progress;
