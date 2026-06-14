from sqlalchemy import (
    Integer,
    String,
    DateTime,
    Column,
    ForeignKey,
    Text,
    Sequence,
)

from datetime import datetime

from app.db.database import Base

from sqlalchemy.orm import relationship

class InterviewMessage(Base):
    __tablename__ = "interview_messages"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    session_id = Column(
        Integer,
        ForeignKey('interview_sessions.id')

    )
    question = Column(
        Text,
        nullable=False
    )
    answer = Column(
        Text,
        nullable=True
    )

    feedback = Column(
        Text,
        nullable=True
    )

    score = Column(
        Integer,
        nullable=True
    )
    strengths = Column(
        Text,
        nullable=True
    )
    improvements = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    session = relationship(
        "InterviewSession",
        back_populates='messages'
    )
