# 📚 Study Buddy – AI-Inspired Flashcard & Quiz Generator
## Overview
Study Buddy is a capstone web app that turns student notes (PDF/TXT) into interactive study tools:
- Flashcards
- Multiple-choice quizzes
- Concise summaries
- A progress dashboard (accuracy, time, streaks)

Phase 1 uses **rule-based automation** (no full AI), with room to add NLP/AI later.

## Features
- Upload PDF/TXT, extract text
- Auto-generate flashcards & MCQs
- Basic spaced review
- User auth (planned)
- Modern UI (React + Tailwind)

## Tech Stack
- **Frontend:** React, TailwindCSS  
- **Backend:** FastAPI (Python)  
- **DB:** PostgreSQL (SQLite in dev)  
- **Auth:** JWT (planned)

## Project Structure
Studdy-buddy-Project/
├── frontend/        # React app
├── backend/         # FastAPI app
├── docs/            # Diagrams, wireframes
├── .gitignore
└── README.md

## Setup
### Backend
cd backend
python -m venv venv
source venv/bin/activate    # macOS/Linux
# venv\Scripts\activate     # Windows
pip install -r requirements.txt
uvicorn main:app --reload

### Frontend
cd frontend
npm install
npm run dev

## Roadmap
- [x] Repo init, docs
- [x] Text extraction
- [ ] Flashcards/MCQs polish
- [ ] Dashboard & auth
- [ ] Cloud deploy
- [ ] NLP/AI (Phase 2)

## Contributors
- Parsa Molahosseini (Lead)
- Team G69

## License
MIT
