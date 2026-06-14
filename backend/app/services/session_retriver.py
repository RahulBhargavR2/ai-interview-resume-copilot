from app.models.interview_session import InterviewSession


def get_sessions(session_id,db):
    interview_session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
    return interview_session
