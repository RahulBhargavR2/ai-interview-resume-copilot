from fastapi import APIRouter, Depends, HTTPException, Body

from sqlalchemy.orm import Session

from app.db.database import SessionLocal

from app.services.interview_service import start_interview, submit_answer

from app.schemas.interview import (
    InterviewStartRequest,
    AnswerRequest,
    InterviewSessionResponse,
)
from app.core.permissions import require_role
from app.core.permissions import get_current_user
from app.models.interview_session import InterviewSession
from app.db.dependencies import get_db
from app.services.session_retriver import get_user_sessions, get_session_by_id
from app.core.logger import logger


router = APIRouter(prefix="/interview", tags=["interview"])


@router.post("/start")
def start(
    request: InterviewStartRequest = Body(...),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:

        return start_interview(
            user_id=current_user.id,
            role=request.role,
            difficulty=request.difficulty,
            interview_type=request.interview_type,
            db=db,
        )
    except Exception as e:
        logger.exception("unable to start interview")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/answer")
def answer(
    request: AnswerRequest,
    current_user: Session = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return submit_answer(
            session_id=request.session_id,
            user_id=current_user.id,
            answer=request.answer,
            db=db,
        )
    except Exception as e:
        logger.exception("unable to submit answer")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/interviews", response_model=list[InterviewSessionResponse])
def get_interview_sessions(
    current_user=Depends(require_role("candidate")), db: Session = Depends(get_db)
):
    try:

        sessions = get_user_sessions(current_user.id, db)
        return sessions
    except Exception as e:
        logger.exception("unable to fetch all sessions")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{interview_id}")
def get_interviews(
    session_id: int,
    current_user=Depends(require_role("candidate")),
    db: Session = Depends(get_db),
):
    try:

        session = get_session_by_id(session_id, current_user.id, db)
        return session
    except Exception as e:
        logger.exception("unable to retrive interview details")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{interview_id}/report")
def get_interview_report(
    session_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        session = get_session_by_id(session_id, current_user.id, db)
        if session.status != "completed":
            raise HTTPException(status_code=400, detail="Interview is not complted yet")
        return {
            "session_id": session.id,
            "status": session.status,
            "report": session.summary,
        }
    except Exception as e:
        logger.exception("Unable to fetch interview report")
        raise HTTPException(status_code=500, detail=str(e))
