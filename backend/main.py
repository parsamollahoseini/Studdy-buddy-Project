from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
import shutil
from typing import Optional, List

from database import engine, get_db, Base
from models import Note, Flashcard
from schemas import NoteUploadResponse, NoteResponse, FlashcardResponse
from utils import extract_text_from_pdf, extract_text_from_txt, determine_file_type, generate_flashcards

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(title="Study Buddy API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "Study Buddy API is running",
        "version": "1.0.0"
    }


@app.post("/api/notes/upload", response_model=NoteUploadResponse)
async def upload_note(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Upload a PDF or TXT file, extract text, and save to database.

    Args:
        file: The uploaded file (PDF or TXT)
        title: Optional title for the note
        db: Database session

    Returns:
        NoteUploadResponse with noteId and extracted text
    """
    # Validate file type
    file_type, is_valid = determine_file_type(file.filename)

    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only PDF and TXT files are supported."
        )

    # Generate file path
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Save uploaded file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save file: {str(e)}"
        )

    # Extract text based on file type
    try:
        if file_type == 'pdf':
            extracted_text = extract_text_from_pdf(file_path)
        else:  # txt
            extracted_text = extract_text_from_txt(file_path)
    except Exception as e:
        # Clean up the uploaded file if extraction fails
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract text: {str(e)}"
        )

    # Use provided title or default to filename without extension
    note_title = title if title else file.filename.rsplit('.', 1)[0]

    # Save to database
    try:
        new_note = Note(
            title=note_title,
            source_type=file_type,
            extracted_text=extracted_text,
            user_id=None  # No user authentication in MVP
        )
        db.add(new_note)
        db.commit()
        db.refresh(new_note)
    except Exception as e:
        # Clean up the uploaded file if database save fails
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save note to database: {str(e)}"
        )

    return NoteUploadResponse(
        noteId=new_note.id,
        title=new_note.title,
        extractedText=extracted_text
    )


@app.get("/api/notes/{noteId}", response_model=NoteResponse)
async def get_note(noteId: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == noteId).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
