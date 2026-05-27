from fastapi import FastAPI

from app.db.database import engine, Base
from app.api.auth import router as auth_router

from app.models.user import User

from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.get("/")
def home():
    return {"message": "AI Interview Copilot Backend Running"}
