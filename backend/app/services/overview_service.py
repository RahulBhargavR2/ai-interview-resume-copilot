from app.models.interview_session import InterviewSession

from sqlalchemy import func
from collections import Counter
from sqlalchemy.orm import selectinload

def get_overview(user_id, db):

    stats = (
        db.query(
            func.count(InterviewSession.id).label("total"),
            func.avg(InterviewSession.overall_score).label("avg_score"),
            func.max(InterviewSession.overall_score).label("best_score"),
        )
        .filter(
            InterviewSession.user_id == user_id, InterviewSession.status == "completed"
        )
        .first()
    )

    latest_session = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.user_id == user_id, InterviewSession.status == "completed"
        )
        .order_by(InterviewSession.created_at.desc())
        .first()
    )

    return {
        "total_interviews": stats.total or 0,
        "average_score": round(float(stats.avg_score or 0), 2),
        "best_score": stats.best_score or 0,
        "latest_score": latest_session.overall_score if latest_session else 0,
    }


def get_performance(user_id, db):

    sessions = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.user_id == user_id, InterviewSession.status == "completed"
        )

        .order_by(InterviewSession.completed_at)
        .all()
    )

    return [
        {
            "date": session.completed_at,
             "score": session.summary.get("overall_score", 0)
        }
        for session in sessions
        if session.summary
    ]


def get_improvements(user_id, db):

    sessions = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.user_id == user_id, 
            InterviewSession.status == "completed"
        )
        .all()
    )

    return [
        session.summary["recommendations"]
        for session in sessions
        if session.summary and session.summary.get("recommendations")
    ]

def get_strengths(user_id,db):
    sessions = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.user_id == user_id, InterviewSession.status == "completed"
        )
        .all()
    )

    return [
        session.summary["strengths"]
        for session in sessions
        if session.summary and session.summary.get("strengths")
    ]


def get_weakness(user_id, db):
    sessions = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.user_id == user_id, InterviewSession.status == "completed"
        )
        .all()
    )
    print(
        [(session.summary and session.summary.get("weaknesses")) for session in sessions]
    )

    return [
        session.summary["weaknesses"]
        for session in sessions
        if session.summary and session.summary.get("weaknesses")
    ]
