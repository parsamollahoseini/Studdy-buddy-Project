# Study Buddy - Smart Study Material Generator

**Capstone II Project - Week 1 MVP**

Study Buddy is a web application that helps students create flashcards and quizzes from their study notes. Upload PDF or TXT files, extract text automatically, and generate study materials to improve learning efficiency.

## Team

- **Parsa Mollahoseini** - Project Lead / Full-Stack Developer
- **Mehrad Bayat** - Backend Developer
- **Kevin George Buhain** - Frontend Developer

## Features (Week 1 MVP)

- Upload PDF and TXT files
- Automatic text extraction (PyPDF2)
- Page skeleton for flashcards, quizzes, results, and progress
- Responsive UI with TailwindCSS
- RESTful API with FastAPI

## Tech Stack

### Frontend
- **React** (JavaScript) - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Chart.js** - Data visualization (coming soon)

### Backend
- **Python FastAPI** - REST API framework
- **Uvicorn** - ASGI server
- **SQLAlchemy** - ORM for database
- **SQLite** - Database (local development, Postgres target for deployment)
- **PyPDF2** - PDF text extraction

## Project Structure

```
study-buddy/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── pages/     # Page components
│   │   ├── components/ # Reusable components
│   │   ├── App.jsx    # Main app with routing
│   │   └── index.css  # Tailwind styles
│   └── package.json
├── backend/           # FastAPI backend application
│   ├── main.py        # FastAPI app and routes
│   ├── models.py      # Database models
│   ├── schemas.py     # Pydantic schemas
│   ├── database.py    # Database configuration
│   ├── utils.py       # Helper functions
│   ├── uploads/       # Uploaded files directory
│   └── requirements.txt
└── README.md
```

## Setup Instructions

### Prerequisites
- **Node.js** (v16+) and npm
- **Python** (3.8+) and pip
- **Git**

### 1. Clone the Repository

```bash
cd ~/Documents
git clone <your-repo-url>
cd study-buddy
```

### 2. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The backend will run at: `http://localhost:8000`

API documentation (Swagger UI): `http://localhost:8000/docs`

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at: `http://localhost:5173`

### 4. Test the Application

1. Open your browser and navigate to `http://localhost:5173`
2. Click "Get Started" to go to the dashboard
3. Click "Upload Notes"
4. Select a PDF or TXT file
5. View the extracted text

## API Endpoints

### Health Check
```
GET /api/health
```

### Upload Notes
```
POST /api/notes/upload
Content-Type: multipart/form-data
Parameters: file (PDF/TXT), title (optional)
Response: { "noteId": 1, "title": "My Notes", "extractedText": "..." }
```

## Database Schema

- **users** - User accounts
- **notes** - Uploaded notes and extracted text
- **flashcards** - Generated flashcards
- **quizzes** - Generated quizzes
- **quiz_questions** - Questions for each quiz
- **quiz_results** - Quiz attempt results

## Pages

- `/` - Landing page
- `/dashboard` - Main dashboard
- `/upload` - Upload notes
- `/notes/:noteId` - View extracted text and generate materials
- `/notes/:noteId/flashcards` - Study flashcards
- `/quizzes/:quizId` - Take quiz
- `/quizzes/:quizId/results` - View quiz results
- `/progress` - Progress tracker
- `/settings` - Settings and about

## Next Steps (Week 2+)

- Implement flashcard generation logic (keyword-based)
- Implement quiz generation logic (rule-based)
- Add quiz submission and scoring
- Implement progress tracking API
- Wire frontend pages to real API data
- Add Chart.js visualizations

## License

MIT License - Educational project for Capstone II

---

**Built by the Study Buddy Team**
