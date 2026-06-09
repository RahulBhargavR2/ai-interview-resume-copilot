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

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    messages = relationship(
        "InterviewMessage",
        back_populates="session"
    )

    status = Column(String, default="active")
