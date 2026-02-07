import Navigation from '../components/Navigation';

function Settings() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Settings</h1>

        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">About Study Buddy</h2>

          <div className="space-y-4 text-gray-700">
            <p>
              <strong>Study Buddy</strong> is a smart study material generator that helps you create
              flashcards and quizzes from your notes.
            </p>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Tech Stack</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Frontend: React + TailwindCSS + React Router</li>
                <li>Backend: Python FastAPI</li>
                <li>Database: PostgreSQL</li>
                <li>Text Extraction: PyPDF2</li>
              </ul>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Version</h3>
              <p className="text-gray-600">MVP - Week 5 Build</p>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Theme Settings</h3>
              <p className="text-gray-600">Theme customization coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
