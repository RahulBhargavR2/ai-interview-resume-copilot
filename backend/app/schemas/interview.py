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


# helper
class EvaluationResponse(BaseModel):
    score: int
    feedback: str
    strengths: list[str]
    improvements: list[str]


# helper
class Summary(BaseModel):
    overall_score: int
    technical_rating:int
    communication_rating:int
    problem_solving_rating:int
    overall_feedback: str
    strengths: list[str]
    weaknesses: list[str]
    recommendations: list[str]
    hire_recommendation:str

# helper
class SummaryResponse(BaseModel):
    average_score:int
    overall_score: int
    summary:Summary
    questions_answered:int


# main
class SubmitAnswerResponse(BaseModel):
    session_id: int
    completed: bool
    evaluation: EvaluationResponse
    next_question: str | None = None
    report: SummaryResponse | None = None

class StartInterviewResponse(BaseModel):
    session_id:int
    question:str

