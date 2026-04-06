from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, Form, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from datetime import datetime, timedelta
import os
import shutil
import csv
import io
from typing import Optional, List

from database import engine, get_db, Base
from models import Note, Flashcard, Quiz, QuizQuestion, QuizResult, User, FlashcardReview
from schemas import (
    NoteUploadResponse, NoteResponse, FlashcardResponse,
    QuizCreateResponse, QuizQuestionResponse, QuizResponse,
    QuizAnswerSubmission, QuizSubmitResponse,
    UserRegister, UserLogin, TokenResponse, UserResponse,
    QuizHistoryItem, ProgressHistoryResponse,
    ReviewSubmission, ReviewResponse, StudyFlashcardResponse,
)
from utils import (
    extract_text_from_pdf, extract_text_from_txt, determine_file_type,
    generate_flashcards, generate_quiz_questions,
)
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user_optional, get_current_user,
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(title="Study Buddy API", version="2.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "Study Buddy API is running",
        "version": "2.0.0"
    }


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

@app.post("/api/auth/register", response_model=TokenResponse)
async def register(data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        name=data.name,
        email=data.email,
        password_hash=get_password_hash(data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": str(user.id)}, extra_claims={"name": user.name})
    return TokenResponse(access_token=token)


@app.post("/api/auth/login", response_model=TokenResponse)
async def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not user.password_hash or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"sub": str(user.id)}, extra_claims={"name": user.name})
    return TokenResponse(access_token=token)


@app.get("/api/auth/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# ---------------------------------------------------------------------------
# Notes
# ---------------------------------------------------------------------------

@app.post("/api/notes/upload", response_model=NoteUploadResponse)
async def upload_note(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    file_type, is_valid = determine_file_type(file.filename)
    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only PDF and TXT files are supported."
        )

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    try:
        if file_type == 'pdf':
            extracted_text = extract_text_from_pdf(file_path)
        else:
            extracted_text = extract_text_from_txt(file_path)
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Failed to extract text: {str(e)}")

    note_title = title if title else file.filename.rsplit('.', 1)[0]

    try:
        new_note = Note(
            title=note_title,
            source_type=file_type,
            extracted_text=extracted_text,
            user_id=current_user.id if current_user else None,
        )
        db.add(new_note)
        db.commit()
        db.refresh(new_note)
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Failed to save note to database: {str(e)}")

    return NoteUploadResponse(
        noteId=new_note.id,
        title=new_note.title,
        extractedText=extracted_text
    )


@app.get("/api/notes", response_model=List[NoteResponse])
async def list_notes(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    query = db.query(Note).order_by(Note.created_at.desc()).limit(10)
    if current_user:
        query = db.query(Note).filter(Note.user_id == current_user.id).order_by(Note.created_at.desc()).limit(10)
    return query.all()


@app.get("/api/notes/{noteId}", response_model=NoteResponse)
async def get_note(noteId: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == noteId).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


# ---------------------------------------------------------------------------
# Flashcards
# ---------------------------------------------------------------------------

@app.post("/api/notes/{noteId}/flashcards", response_model=List[FlashcardResponse])
async def create_flashcards(noteId: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == noteId).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    cards = generate_flashcards(note.extracted_text)

    db_cards = []
    for c in cards:
        fc = Flashcard(note_id=noteId, question=c["question"], answer=c["answer"])
        db.add(fc)
        db_cards.append(fc)

    db.commit()
    for fc in db_cards:
        db.refresh(fc)

    return db_cards


@app.get("/api/notes/{noteId}/flashcards", response_model=List[FlashcardResponse])
async def get_flashcards(noteId: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == noteId).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return db.query(Flashcard).filter(Flashcard.note_id == noteId).all()


# ---------------------------------------------------------------------------
# Quiz
# ---------------------------------------------------------------------------

@app.post("/api/notes/{noteId}/quiz", response_model=QuizCreateResponse)
async def create_quiz(noteId: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == noteId).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    existing = db.query(Flashcard).filter(Flashcard.note_id == noteId).all()
    if existing:
        fc_dicts = [{"question": fc.question, "answer": fc.answer} for fc in existing]
    else:
        fc_dicts = generate_flashcards(note.extracted_text)
        for c in fc_dicts:
            db.add(Flashcard(note_id=noteId, question=c["question"], answer=c["answer"]))

    quiz_questions = generate_quiz_questions(note.extracted_text, fc_dicts)

    quiz = Quiz(note_id=noteId, title=f"Quiz: {note.title}")
    db.add(quiz)
    db.flush()

    db_questions = []
    for q in quiz_questions:
        qq = QuizQuestion(
            quiz_id=quiz.id,
            question=q["question"],
            option_a=q["option_a"],
            option_b=q["option_b"],
            option_c=q["option_c"],
            option_d=q["option_d"],
            correct_option=q["correct_option"],
        )
        db.add(qq)
        db_questions.append(qq)

    db.commit()
    db.refresh(quiz)
    for qq in db_questions:
        db.refresh(qq)

    return QuizCreateResponse(
        quizId=quiz.id,
        title=quiz.title,
        questions=[QuizQuestionResponse.model_validate(qq) for qq in db_questions],
    )


@app.get("/api/quizzes/{quizId}", response_model=QuizResponse)
async def get_quiz(quizId: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quizId).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz


@app.post("/api/quizzes/{quizId}/results", response_model=QuizSubmitResponse)
async def submit_quiz(
    quizId: int,
    submission: QuizAnswerSubmission,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    quiz = db.query(Quiz).filter(Quiz.id == quizId).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    questions = db.query(QuizQuestion).filter(QuizQuestion.quiz_id == quizId).all()
    if len(submission.answers) != len(questions):
        raise HTTPException(
            status_code=400,
            detail=f"Expected {len(questions)} answers, got {len(submission.answers)}",
        )

    correct_count = sum(
        1 for q, a in zip(questions, submission.answers)
        if q.correct_option.upper() == a.upper()
    )
    total = len(questions)
    score = round((correct_count / total) * 100, 1) if total > 0 else 0

    result = QuizResult(
        quiz_id=quizId,
        user_id=current_user.id if current_user else None,
        score=score,
    )
    db.add(result)
    db.commit()
    db.refresh(result)

    return QuizSubmitResponse(
        resultId=result.id,
        score=score,
        totalQuestions=total,
        correctAnswers=correct_count,
        noteId=quiz.note_id,
    )


# ---------------------------------------------------------------------------
# Progress
# ---------------------------------------------------------------------------

@app.get("/api/progress")
async def get_progress(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    fc_query = db.query(func.count(Flashcard.id))
    qr_query = db.query(func.count(QuizResult.id))
    avg_query = db.query(func.avg(QuizResult.score))

    if current_user:
        # Scope flashcards via note ownership
        fc_query = fc_query.join(Note).filter(Note.user_id == current_user.id)
        qr_query = qr_query.filter(QuizResult.user_id == current_user.id)
        avg_query = avg_query.filter(QuizResult.user_id == current_user.id)

    total_flashcards = fc_query.scalar() or 0
    total_quizzes = qr_query.scalar() or 0
    avg_score = avg_query.scalar() or 0

    return {
        "totalFlashcards": total_flashcards,
        "totalQuizzes": total_quizzes,
        "averageScore": round(avg_score),
        "studyStreak": 0,
    }


@app.get("/api/progress/history", response_model=ProgressHistoryResponse)
async def get_progress_history(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    query = (
        db.query(QuizResult, Quiz, Note)
        .join(Quiz, QuizResult.quiz_id == Quiz.id)
        .join(Note, Quiz.note_id == Note.id)
        .order_by(QuizResult.taken_at.desc())
        .limit(10)
    )
    if current_user:
        query = query.filter(QuizResult.user_id == current_user.id)

    rows = query.all()
    history = [
        QuizHistoryItem(
            quizId=result.id,
            score=result.score,
            takenAt=result.taken_at,
            noteTitle=note.title,
        )
        for result, quiz, note in rows
    ]
    # Return in chronological order for the chart
    history.reverse()
    return ProgressHistoryResponse(history=history)


# ---------------------------------------------------------------------------
# Spaced Repetition
# ---------------------------------------------------------------------------

def _apply_sm2(review: FlashcardReview, quality: int) -> None:
    """Update SM-2 state in-place based on quality rating (0-5)."""
    if quality < 3:
        review.repetitions = 0
        review.interval = 1
    else:
        if review.repetitions == 0:
            review.interval = 1
        elif review.repetitions == 1:
            review.interval = 6
        else:
            review.interval = round(review.interval * review.ease_factor)
        review.ease_factor = max(
            1.3,
            review.ease_factor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02),
        )
        review.repetitions += 1
    review.next_review_date = datetime.utcnow() + timedelta(days=review.interval)


@app.get("/api/study/due", response_model=List[StudyFlashcardResponse])
async def get_due_flashcards(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    user_id_val = current_user.id if current_user else None

    rows = (
        db.query(Flashcard, FlashcardReview)
        .outerjoin(
            FlashcardReview,
            (FlashcardReview.flashcard_id == Flashcard.id)
            & (FlashcardReview.user_id == user_id_val),
        )
        .filter(
            or_(
                FlashcardReview.id == None,  # never reviewed
                FlashcardReview.next_review_date <= datetime.utcnow(),
            )
        )
        .all()
    )

    result = []
    for fc, review in rows:
        result.append(
            StudyFlashcardResponse(
                id=fc.id,
                question=fc.question,
                answer=fc.answer,
                note_id=fc.note_id,
                interval=review.interval if review else 1,
                ease_factor=review.ease_factor if review else 2.5,
            )
        )
    return result


@app.post("/api/flashcards/{flashcard_id}/review", response_model=ReviewResponse)
async def submit_review(
    flashcard_id: int,
    submission: ReviewSubmission,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    if not (0 <= submission.quality <= 5):
        raise HTTPException(status_code=400, detail="Quality must be between 0 and 5")

    fc = db.query(Flashcard).filter(Flashcard.id == flashcard_id).first()
    if not fc:
        raise HTTPException(status_code=404, detail="Flashcard not found")

    user_id_val = current_user.id if current_user else None

    review = (
        db.query(FlashcardReview)
        .filter(
            FlashcardReview.flashcard_id == flashcard_id,
            FlashcardReview.user_id == user_id_val,
        )
        .first()
    )

    if not review:
        review = FlashcardReview(flashcard_id=flashcard_id, user_id=user_id_val)
        db.add(review)
        db.flush()

    _apply_sm2(review, submission.quality)
    db.commit()
    db.refresh(review)

    return ReviewResponse(
        flashcard_id=review.flashcard_id,
        interval=review.interval,
        ease_factor=review.ease_factor,
        next_review_date=review.next_review_date,
    )


@app.get("/api/export/flashcards/{noteId}")
async def export_flashcards_csv(noteId: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == noteId).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    flashcards = db.query(Flashcard).filter(Flashcard.note_id == noteId).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["question", "answer"])
    for fc in flashcards:
        writer.writerow([fc.question, fc.answer])

    csv_content = output.getvalue()
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="flashcards_{noteId}.csv"'},
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
