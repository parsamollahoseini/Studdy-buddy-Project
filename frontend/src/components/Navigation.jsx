import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
            Study Buddy
          </Link>

          <div className="flex space-x-6">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Dashboard
            </Link>
            <Link
              to="/upload"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Upload
            </Link>
            <Link
              to="/progress"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Progress
            </Link>
            <Link
              to="/settings"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
