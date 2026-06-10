from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey
)

from datetime import datetime

from sqlalchemy.orm import relationship

from app.db.database import Base

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    role = Column(
        String,
        nullable=False
    )

    difficulty = Column(
        String,
        nullable=False
    )

    status = Column(String, default="active")

    current_question = Column(String,nullable=True)

    question_count = Column(Integer,default=0)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    completed_at = Column(DateTime,nullable=True)

    messages = relationship(
        "InterviewMessage",
        back_populates="session"
    )
