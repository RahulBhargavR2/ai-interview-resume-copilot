from app.models.interview_session import InterviewSession
from fastapi import HTTPException

def get_user_sessions(user_id,db):
    interview_session = db.query(InterviewSession).filter(
        InterviewSession.user_id == user_id
        ).all()
    if not interview_session:
        raise HTTPException(
            status_code=404,
            detail="No interviews found"
        )
    return interview_session


def get_session_by_id(session_id,user_id,db):
    interview = db.query(InterviewSession).filter(
        InterviewSession.id == session_id,
        InterviewSession.user_id == user_id 
    ).first()

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="No interviews found"
        )
    return interview


