# Study Buddy — Smart Study Material Generator

**Capstone II Project · Group T25**

Study Buddy is a full-stack web application that helps students turn their notes into interactive study materials. Upload a PDF or TXT file, auto-generate flashcards and quizzes, study with a spaced repetition scheduler, track your progress with charts, and export cards to Anki or Quizlet.

---

## Features

- **Upload Notes** — PDF and TXT files with automatic text extraction (PyPDF2)
- **Flashcard Generation** — Rule/keyword-based flashcard creation from extracted text
- **Quiz Generation** — Multiple choice quizzes with auto-generated distractors
- **Spaced Repetition** — SM-2 algorithm study sessions (Again / Hard / Good / Easy ratings)
- **Progress Dashboard** — Live stats and Chart.js score history visualization
- **User Authentication** — JWT-based register/login; data scoped per user
- **CSV Export** — Download flashcards as CSV for Anki or Quizlet import
- **Responsive UI** — Dark futuristic theme built with TailwindCSS

---

## Tech Stack

### Frontend
| Library | Purpose |
|---|---|
| React 19 + Vite | UI framework and build tool |
| TailwindCSS v4 | Utility-first styling |
| React Router v7 | Client-side routing |
| Axios | HTTP client |
| Chart.js + react-chartjs-2 | Score history visualization |

### Backend
| Library | Purpose |
|---|---|
| Python FastAPI | REST API framework |
| Uvicorn | ASGI server |
| SQLAlchemy 2.0 | ORM |
| SQLite | Database (local development) |
| PyPDF2 | PDF text extraction |
| python-jose | JWT token creation and verification |
| bcrypt | Password hashing |
| python-dotenv | Environment variable management |

---

## Project Structure

```
study-buddy/
├── frontend/
│   ├── src/
│   │   ├── context/        # AuthContext (JWT state)
│   │   ├── components/     # Navigation, ProtectedRoute
│   │   ├── pages/          # All page components
│   │   ├── App.jsx         # Routes
│   │   └── index.css       # Global styles
│   └── package.json
├── backend/
│   ├── main.py             # All API routes
│   ├── models.py           # SQLAlchemy models
│   ├── schemas.py          # Pydantic request/response schemas
│   ├── database.py         # DB engine and session
│   ├── auth.py             # JWT + bcrypt utilities
│   ├── utils.py            # Text extraction + generation logic
│   ├── .env                # Secret key (not committed)
│   ├── uploads/            # Uploaded files
│   └── requirements.txt
└── README.md
```

---

## Setup & Running

### Prerequisites
- **Node.js** v16+ and npm
- **Python** 3.8+ and pip
- **Git**

---

### 1. Clone the Repository

```bash
git clone https://github.com/parsamollahoseini/Studdy-buddy-Project.git
cd Studdy-buddy-Project
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate          # Mac/Linux
# venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_hex(32))')" > .env

# Start the server
uvicorn main:app --reload --port 8000
```

> Backend runs at **http://localhost:8000**  
> Swagger docs at **http://localhost:8000/docs**

> **Note:** If you change any database models, delete `study_buddy.db` and restart — the DB is auto-created on startup.

---

### 3. Frontend Setup

Open a **new terminal window**:

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

> Frontend runs at **http://localhost:5173**

---

### 4. First Run

1. Open **http://localhost:5173**
2. Click **Get Started** → **Create account** to register
3. Upload a PDF or TXT file
4. Generate Flashcards or a Quiz from your notes
5. Visit **Study Session** to review with spaced repetition
6. Check **Progress** to see your score chart

---

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user, returns JWT |
| `POST` | `/api/auth/login` | Login, returns JWT |
| `GET` | `/api/auth/me` | Get current user (requires token) |

### Notes
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notes` | List recent notes |
| `POST` | `/api/notes/upload` | Upload PDF/TXT file |
| `GET` | `/api/notes/{noteId}` | Get single note |

### Flashcards
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/notes/{noteId}/flashcards` | Generate flashcards |
| `GET` | `/api/notes/{noteId}/flashcards` | Get flashcards for a note |
| `POST` | `/api/flashcards/{id}/review` | Submit SM-2 review rating (0–5) |
| `GET` | `/api/export/flashcards/{noteId}` | Download flashcards as CSV |

### Quizzes
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/notes/{noteId}/quiz` | Generate quiz |
| `GET` | `/api/quizzes/{quizId}` | Get quiz with questions |
| `POST` | `/api/quizzes/{quizId}/results` | Submit answers, get score |

### Progress
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/progress` | Overall stats (flashcards, quizzes, avg score) |
| `GET` | `/api/progress/history` | Last 10 quiz results for chart |

### Study
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/study/due` | Get flashcards due for review today |

---

## Database Schema

| Table | Key Columns |
|---|---|
| `users` | id, name, email, password_hash |
| `notes` | id, user_id, title, source_type, extracted_text, created_at |
| `flashcards` | id, note_id, question, answer, created_at |
| `flashcard_reviews` | id, flashcard_id, user_id, interval, ease_factor, repetitions, next_review_date |
| `quizzes` | id, note_id, title, created_at |
| `quiz_questions` | id, quiz_id, question, option_a–d, correct_option |
| `quiz_results` | id, quiz_id, user_id, score, taken_at |

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/login` | Sign in |
| `/register` | Create account |
| `/dashboard` | Main dashboard — stats, recent notes, quick actions |
| `/upload` | Upload PDF/TXT notes |
| `/notes/:noteId` | View extracted text, generate flashcards or quiz |
| `/notes/:noteId/flashcards` | Study flashcards, export CSV |
| `/quizzes/:quizId` | Take quiz |
| `/quizzes/:quizId/results` | View score |
| `/study` | Spaced repetition study session |
| `/progress` | Progress charts and stats |
| `/settings` | App info and team |

---

## Development Notes

- The SQLite database (`study_buddy.db`) is auto-created on first server start
- Delete `study_buddy.db` if you change any model columns (no migration tool)
- Uploaded files are stored in `backend/uploads/`
- The `.env` file must contain `SECRET_KEY` — generate one with `python3 -c "import secrets; print(secrets.token_hex(32))"`
- Anonymous usage is supported — registration is optional; unregistered users can still upload and generate study materials

---

## Team — Group T25

| Name | Role |
|---|---|
| **Parsa Mollahoseini** | Project Lead / Full-Stack Developer |
| **Mehrad Bayat** | Backend Developer |
| **Kevin George Buhain** | Frontend Developer |

---

## License

MIT License — Educational project for Capstone II
