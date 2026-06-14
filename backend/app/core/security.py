from datetime import datetime, timedelta
from fastapi import Depends, HTTPException
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session
# from fastapi.security import OAuth2PasswordBearer
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.config import settings
from app.db.dependencies import get_db
from app.core.config import settings
from app.models.user import User


pwd_context = CryptContext(
    schemes=['bcrypt'],
    deprecated="auto"
)

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password,hashed_password)


def create_access_token(data:dict):
    to_encode = data.copy()
    
    expire = datetime.utcnow() + timedelta(settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp":expire})

    return jwt.encode(
        to_encode,
        settings.JWT_SECRETE,
        algorithm=settings.JWT_ALGORITHM
    )


security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=401,
        detail='Invalid credentials'
    )

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRETE,
            algorithms=[settings.JWT_ALGORITHM]
        )

        user_id = int(payload.get('sub'))

        if user_id is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise credentials_exception

    return user
