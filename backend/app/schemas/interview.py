from pydantic import BaseModel


# /start
class InterviewStartRequest(BaseModel):
    user_id: int
    role: str
    difficulty: str
    interview_type: str


class StartInterviewResponse(BaseModel):
    session_id: int
    question: str

# /answer


class AnswerRequest(BaseModel):
    session_id: int
    answer: str


# helper
class EvaluationResponse(BaseModel):
    score: int
    feedback: str
    strengths: list[str]
    improvements: list[str]


# helper
class Summary(BaseModel):
    # overall_score: int
    technical_rating: str
    communication_rating: str
    problem_solving_rating: str
    overall_feedback: str
    strengths: list[str]
    weaknesses: list[str]
    recommendations: list[str]
    hire_recommendation: str


# helper
class SummaryResponse(BaseModel):
    average_score: int
    overall_score: int
    summary: Summary
    questions_answered: int


# main
class SubmitAnswerResponse(BaseModel):
    session_id: int
    completed: bool
    evaluation: EvaluationResponse
    next_question: str | None = None
    report: SummaryResponse | None = None


# /interviews
class InterviewSessionResponse(BaseModel):
    id: int
    status: str
    role: str
    difficulty: str
    question_count: int
    summary: Summary | None = None

    class Config:
        from_attributes = True


# /{interview_id}/report
class InterviewSessionReportResponse(BaseModel):
    session_id: int
    status: str
    report: Summary
