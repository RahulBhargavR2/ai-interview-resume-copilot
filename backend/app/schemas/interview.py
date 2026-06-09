from pydantic import BaseModel


class InterviewStartRequest(BaseModel):
    user_id: int
    role: str
    difficulty: str


class InterviewSessionResponse(BaseModel):
    id: int
    role: str
    difficulty:str

    class Config:
        from_attributes = True


class AnswerRequest(BaseModel):
    session_id: int
    answer: str
