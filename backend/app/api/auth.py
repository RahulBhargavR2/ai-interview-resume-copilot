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
from app.db.dependencies import get_db
from app.core.security import get_current_user
from app.core.logger import logger


from app.core.security import(
    create_access_token,
    hash_password,
    verify_password
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"] 
)


@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):
    try:
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
    except Exception as e:
        logger.exception('Unable to register user')
        raise HTTPException(
        status_code=500,
        detail= str(e)
    )


@router.post("/login")
def login(
    user: UserLogin,
    db : Session = Depends(get_db)
):
    try:

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
                "sub":str(existing_user.id)
            }
        )

        return{
            "access_token":token,
            "token_type":"bearer"
        }
    except Exception as e:
        logger.exception('Unable to log in ')
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return {"name":current_user.name,"email":current_user.email,"role":current_user.role}
