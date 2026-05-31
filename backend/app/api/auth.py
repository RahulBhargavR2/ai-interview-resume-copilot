from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer

from app.db.database import SessionLocal
from app.models.user import User
from app.schemas.user import (
    UserRegister,
    UserLogin
)
from app.core.config import settings

from app.core.security import(
    create_access_token,
    hash_password,
    verify_password
)
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"] 
)


security = HTTPBearer()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def get_current_user(token=Depends(security)):

    credentials_exception = HTTPException(status_code=401, detail="Invalid token")

    try:
        payload = jwt.decode(
            token.credentials, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )

        email = payload.get("sub")

        if email is None:
            raise credentials_exception

        return email

    except JWTError:
        raise credentials_exception


@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == user.email  
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email alerady exists"
        )
    
    new_user =  User(
        name = user.name,
        email = user.email,
        hashed_password = hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return{
        "message":"User registered successfully"
    }


@router.post("login")
def login(
    user: UserLogin,
    db : Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    valid_password = verify_password(
        user.password,
         existing_user.hashed_password
    )

    if not valid_password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(
        {
            "sub":existing_user.email
        }
    )

    return{
        "access_token":token,
        "token_type":"bearer"
    }


@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return {"email": current_user}
