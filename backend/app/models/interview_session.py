from datetime import datetime
from enum import Enum

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    JSON,
    Enum as SqlEnum,
)

from sqlalchemy.orm import relationship

from app.db.database import Base


class InterviewStatus(str, Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class DifficultyLevel(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class InterviewType(str, Enum):
    GENERAL = "general"
    RESUME = "resume"
    TECHNICAL = "technical"
    BEHAVIORAL = "behavioral"
    SYSTEM_DESIGN = "system_design"


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=True)

    role = Column(String, nullable=False)

    difficulty = Column(SqlEnum(DifficultyLevel), nullable=False)

    interview_type = Column(
        SqlEnum(InterviewType), nullable=False, default=InterviewType.GENERAL
    )

    status = Column(
        SqlEnum(InterviewStatus), nullable=False, default=InterviewStatus.ACTIVE
    )

    current_question = Column(String, nullable=True)

    question_count = Column(Integer, default=0, nullable=False)

    overall_score = Column(Integer, nullable=True)

    summary = Column(JSON, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="interview_sessions")

    resume = relationship("Resume", back_populates="interview_sessions")

    messages = relationship(
        "InterviewMessage", back_populates="session", cascade="all, delete-orphan"
    )
