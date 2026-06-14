from fastapi import APIRouter,Depends,HTTPException, Body

from sqlalchemy.orm import Session

from app.db.database import SessionLocal

from app.services.interview_service import (start_interview,submit_answer)

from app.schemas.interview import  InterviewStartRequest, AnswerRequest, InterviewSessionResponse
from app.core.permissions import require_role
from app.core.permissions import get_current_user
from app.models.interview_session import InterviewSession
from app.db.dependencies import get_db



router = APIRouter(
    prefix="/interview",
    tags=['interview']
)



@router.post("/start")
def start(request: InterviewStartRequest = Body(...), current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    print(Depends(get_current_user))
    return start_interview(
        user_id=current_user.id    , role=request.role, difficulty=request.difficulty, db=db
    )


@router.post("/answer")
def answer(request:AnswerRequest, db: Session = Depends(get_db)):
    return submit_answer(session_id=request.session_id, answer=request.answer, db=db)


@router.get('/sessions',response_model=list[InterviewSessionResponse])
def get_interview_sessions(
    current_user = Depends(require_role('candidate')),
    db : Session = Depends(get_db)
):
    sessions = db.query(InterviewSession).filter(InterviewSession.user_id ==  current_user.id).all()
    return sessions

@router.get('/{session_id}')
def get_interviews(
    session_id:int,
    current_user = Depends(require_role('candidate')),
    db: Session=Depends(get_db)
):

   session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()

   if not session:
    raise HTTPException(
        status_code=404,
        detail="No Interview found"
    )
    return session;