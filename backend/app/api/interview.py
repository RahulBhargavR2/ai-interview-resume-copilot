from fastapi import APIRouter,Depends,HTTPException, Body

from sqlalchemy.orm import Session

from app.db.database import SessionLocal

from app.services.interview_service import (start_interview,submit_answer)

from app.schemas.interview import  InterviewStartRequest, AnswerRequest
print(InterviewStartRequest)

router = APIRouter(
    prefix="/interview",
    tags=['interview']
)

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/start")
def start(request: InterviewStartRequest = Body(...), db: Session = Depends(get_db)):
    print(InterviewStartRequest)
    return start_interview(
        user_id=request.user_id, role=request.role, difficulty=request.difficulty, db=db
    )


@router.post("/answer")
def answer(request:AnswerRequest, db: Session = Depends(get_db)):
    return submit_answer(session_id=request.session_id, answer=request.answer, db=db)


@router.get('/sessions')
def get_interview_sessions(
    db : Session = Depends(get_db)
):
    sessions = db.query(InterviewSession).all()
    return sessions
