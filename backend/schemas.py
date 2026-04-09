from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


# Note schemas
class NoteCreate(BaseModel):
    title: str
    source_type: str
    extracted_text: str
    user_id: Optional[int] = None


class NoteResponse(BaseModel):
    id: int
    title: str
    source_type: str
    extracted_text: str
    created_at: datetime

    class Config:
        from_attributes = True


class NoteUploadResponse(BaseModel):
    noteId: int
    title: str
    extractedText: str


# Flashcard schemas
class FlashcardCreate(BaseModel):
    note_id: int
    question: str
    answer: str


class FlashcardResponse(BaseModel):
    id: int
    question: str
    answer: str
    created_at: datetime

    class Config:
        from_attributes = True


# Quiz schemas
class QuizQuestionCreate(BaseModel):
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str


class QuizQuestionResponse(BaseModel):
    id: int
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str

    class Config:
        from_attributes = True


class QuizCreate(BaseModel):
    note_id: int
    title: str


class QuizCreateRequest(BaseModel):
    questionCount: Optional[int] = None


class QuizResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    questions: list[QuizQuestionResponse] = []

    class Config:
        from_attributes = True


# Quiz result schemas
class QuizCreateResponse(BaseModel):
    quizId: int
    title: str
    questions: List[QuizQuestionResponse] = []


class QuizOptionsResponse(BaseModel):
    maxQuestions: int


class QuizResultCreate(BaseModel):
    quiz_id: int
    user_id: Optional[int] = None
    score: float


class QuizResultResponse(BaseModel):
    id: int
    score: float
    taken_at: datetime

    class Config:
        from_attributes = True


class QuizAnswerSubmission(BaseModel):
    answers: List[str]


class QuizSubmitResponse(BaseModel):
    resultId: int
    score: float
    totalQuestions: int
    correctAnswers: int
    noteId: int


# Auth schemas
class UserRegister(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


# Progress history schemas
class QuizHistoryItem(BaseModel):
    quizId: int
    score: float
    takenAt: datetime
    noteTitle: str


class ProgressHistoryResponse(BaseModel):
    history: List[QuizHistoryItem]


# Spaced repetition schemas
class ReviewSubmission(BaseModel):
    quality: int  # 0-5


class ReviewResponse(BaseModel):
    flashcard_id: int
    interval: int
    ease_factor: float
    next_review_date: datetime

    class Config:
        from_attributes = True


class StudyFlashcardResponse(BaseModel):
    id: int
    question: str
    answer: str
    note_id: int
    interval: int
    ease_factor: float

    class Config:
        from_attributes = True
