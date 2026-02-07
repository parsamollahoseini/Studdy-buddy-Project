import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="text-center text-white px-6">
        <h1 className="text-6xl font-bold mb-4">Study Buddy</h1>
        <p className="text-2xl mb-8">Smart Study Material Generator</p>
        <p className="text-lg mb-12 max-w-2xl mx-auto">
          Upload your notes and generate flashcards and quizzes instantly.
          Track your progress and improve your learning efficiency.
        </p>
        <Link
          to="/dashboard"
          className="bg-white text-blue-600 px-8 py-4 rounded-lg text-xl font-semibold hover:bg-gray-100 transition"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default Landing;
