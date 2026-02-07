import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/upload" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-blue-600 text-5xl mb-4">📤</div>
            <h2 className="text-2xl font-semibold mb-2">Upload Notes</h2>
            <p className="text-gray-600">Upload PDF or TXT files to get started</p>
          </Link>

          <Link to="/progress" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-green-600 text-5xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold mb-2">Progress</h2>
            <p className="text-gray-600">View your learning statistics</p>
          </Link>

          <Link to="/settings" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-purple-600 text-5xl mb-4">⚙️</div>
            <h2 className="text-2xl font-semibold mb-2">Settings</h2>
            <p className="text-gray-600">Customize your experience</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
