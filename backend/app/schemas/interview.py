from pydantic import BaseModel



class InterviewStartRequest(BaseModel):
    user_id: int
    role: str
    difficulty: str
    interview_type: str


class InterviewSessionResponse(BaseModel):
    id: int
    role: str
    difficulty:str

    class Config:
        from_attributes = True


class AnswerRequest(BaseModel):
    session_id: int
    answer: str


class InterviewMessageResponse(BaseModel):
    id: int
    question: str
    answer: str

    class Config:
        from_attributes = True


class InterviewSessionResponse(BaseModel):
    id: int
    status: str
    role: str
    difficulty: str
    question_count:int
    summary: dict | None = None
 

    class Config:
        from_attributes = True
