from datetime import datetime


from app.db.database import Base

from enum import Enum
class UserRole(str, Enum):
    CANDIDATE = "candidate"
    ADMIN = "admin"


from sqlalchemy import Column, Integer, String, DateTime, Enum, JSON
from sqlalchemy.dialects.postgresql import ARRAY


class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer,primary_key=True,index=True)

    name = Column(String,nullable=False)

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    hashed_password = Column(
        String,
        nullable=False
    )

    role = Column(
        Enum(UserRole),
        default=UserRole.CANDIDATE
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    skills = Column(
        ARRAY(String),
        nullable=True,
        default=list
    )

    projects = Column(
        JSON,
        nullable=True,
    )

    experience = Column(
        JSON,
        nullable=True,
    )


