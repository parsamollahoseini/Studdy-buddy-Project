import Navigation from '../components/Navigation';

function Progress() {
  // Mock data - will be replaced with API call
  const stats = {
    totalFlashcards: 42,
    totalQuizzes: 8,
    averageScore: 78,
    studyStreak: 5
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Your Progress</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-4xl mb-2">📝</div>
            <div className="text-3xl font-bold text-gray-800">{stats.totalFlashcards}</div>
            <div className="text-gray-600">Flashcards Created</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-green-600 text-4xl mb-2">✅</div>
            <div className="text-3xl font-bold text-gray-800">{stats.totalQuizzes}</div>
            <div className="text-gray-600">Quizzes Taken</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-purple-600 text-4xl mb-2">📊</div>
            <div className="text-3xl font-bold text-gray-800">{stats.averageScore}%</div>
            <div className="text-gray-600">Average Score</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-orange-600 text-4xl mb-2">🔥</div>
            <div className="text-3xl font-bold text-gray-800">{stats.studyStreak}</div>
            <div className="text-gray-600">Day Streak</div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Chart Placeholder</h2>
          <p className="text-gray-600">Chart.js visualization will be added here to show progress over time.</p>
        </div>
      </div>
    </div>
  );
}

export default Progress;
