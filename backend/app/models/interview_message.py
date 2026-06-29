from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Text,
)

from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship

from app.db.database import Base


class InterviewMessage(Base):
    __tablename__ = "interview_messages"

    id = Column(Integer, primary_key=True, index=True)

    session_id = Column(
        Integer, ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=False
    )

    question = Column(Text, nullable=False)

    answer = Column(Text, nullable=True)

    score = Column(Integer, nullable=True)

    feedback = Column(Text, nullable=True)

    strengths = Column(ARRAY(String), nullable=False, default=list)

    improvements = Column(ARRAY(String), nullable=False, default=list)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    session = relationship("InterviewSession", back_populates="messages")
