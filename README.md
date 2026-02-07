# Study Buddy - Smart Study Material Generator

**Capstone II Project - Group T25 - Week 5 MVP**

Study Buddy is a web application that helps students create flashcards and quizzes from their study notes. Upload PDF or TXT files, extract text automatically, and generate study materials to improve learning efficiency.

## Features

- Upload PDF and TXT files
- Automatic text extraction (PyPDF2)
- Generate flashcards from notes (rule/keyword-based)
- Generate quizzes from notes (multiple choice, rule-based)
- Take quizzes and view scored results
- Generate flashcards or quiz from the same notes without re-uploading
- Track progress with dashboard (flashcards created, quizzes taken, avg score)
- Responsive UI with TailwindCSS

## Tech Stack

### Frontend
- **React** (JavaScript) - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Chart.js** - Data visualization (placeholder ready)

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
│   ├── utils.py       # Helper functions (text extraction + generation logic)
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

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

The backend will run at: `http://localhost:8000`

API documentation (Swagger UI): `http://localhost:8000/docs`

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend

# Install npm dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run at: `http://localhost:5173`

### 4. Test the Application

1. Open your browser and navigate to `http://localhost:5173`
2. Click "Get Started" to go to the dashboard
3. Click "Upload Notes" and select a PDF or TXT file
4. View the extracted text on the note page
5. Click "Generate Flashcards" — flip through the cards
6. Click "Generate Quiz from Same Notes" — answer the questions
7. Submit the quiz and view your score
8. Visit the Progress page to see your stats

## API Endpoints

### Health Check
```
GET /api/health
→ { "status": "healthy", "message": "Study Buddy API is running", "version": "1.0.0" }
```

### Upload Notes
```
POST /api/notes/upload
Content-Type: multipart/form-data
Parameters: file (PDF/TXT), title (optional)
→ { "noteId": 1, "title": "My Notes", "extractedText": "..." }
```

### Get Note
```
GET /api/notes/{noteId}
→ { "id": 1, "title": "My Notes", "source_type": "txt", "extracted_text": "...", "created_at": "..." }
```

### Generate Flashcards
```
POST /api/notes/{noteId}/flashcards
→ [{ "id": 1, "question": "What is ...?", "answer": "...", "created_at": "..." }, ...]
```

### Get Flashcards
```
GET /api/notes/{noteId}/flashcards
→ [{ "id": 1, "question": "...", "answer": "...", "created_at": "..." }, ...]
```

### Generate Quiz
```
POST /api/notes/{noteId}/quiz
→ { "quizId": 1, "title": "Quiz: ...", "questions": [{ "id": 1, "question": "...", "option_a": "...", "option_b": "...", "option_c": "...", "option_d": "...", "correct_option": "A" }] }
```

### Get Quiz
```
GET /api/quizzes/{quizId}
→ { "id": 1, "title": "...", "created_at": "...", "questions": [...] }
```

### Submit Quiz Results
```
POST /api/quizzes/{quizId}/results
Body: { "answers": ["A", "C", "B", "D", "A"] }
→ { "resultId": 1, "score": 80.0, "totalQuestions": 5, "correctAnswers": 4, "noteId": 1 }
```

### Get Progress
```
GET /api/progress
→ { "totalFlashcards": 9, "totalQuizzes": 1, "averageScore": 80, "studyStreak": 0 }
```

## Database Schema

The SQLite database includes the following tables:

- **users** - User accounts (for future authentication)
- **notes** - Uploaded notes and extracted text
- **flashcards** - Generated flashcards (question + answer)
- **quizzes** - Generated quizzes
- **quiz_questions** - Multiple choice questions (A/B/C/D options)
- **quiz_results** - Quiz attempt results with scores

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/dashboard` | Main dashboard with navigation cards |
| `/upload` | Upload PDF/TXT notes |
| `/notes/:noteId` | View extracted text + generate flashcards/quiz |
| `/notes/:noteId/flashcards` | Study flashcards (flip cards) + generate quiz |
| `/quizzes/:quizId` | Take quiz (multiple choice) |
| `/quizzes/:quizId/results` | View score + generate flashcards/retake quiz |
| `/progress` | Progress dashboard (stats from DB) |
| `/settings` | Settings and about |

## Demo Flow

```
Upload → View Extracted Text
  ├─→ Generate Flashcards → Flip through cards → Generate Quiz from Same Notes
  └─→ Generate Quiz → Answer MCQs → Submit → See Score
        ├─→ Flashcards from Same Notes
        ├─→ Retake Quiz (New Questions)
        └─→ Back to Dashboard
Progress → Real stats (flashcards created, quizzes taken, avg score)
```

## Running Both Servers

You need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Development Notes

- The SQLite database (`study_buddy.db`) is auto-created on first server start
- Delete `study_buddy.db` and restart the backend if you change database models
- Uploaded files are stored in `backend/uploads/`
- Flashcard generation uses rule/keyword-based logic (no AI/NLP in Phase 1)
- Quiz questions are multiple choice with distractors from other flashcard answers

## Next Steps

- AI/NLP-powered flashcard and quiz generation
- User authentication and authorization
- Chart.js visualizations on progress page
- PostgreSQL for production deployment
- Study sessions with spaced repetition
- Export flashcards to Anki/Quizlet

## Team — Group T25

| Name | Role |
|------|------|
| **Parsa Mollahoseini** | Project Lead / Full-Stack Developer |
| **Mehrad Bayat** | Backend Developer |
| **Kevin George Buhain** | Frontend Developer |

## License

MIT License - Educational project for Capstone II

---

**Built by Group T25 — Parsa Mollahoseini, Mehrad Bayat, Kevin George Buhain**
