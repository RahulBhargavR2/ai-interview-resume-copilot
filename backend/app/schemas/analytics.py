from pydantic import BaseModel

# /overview

class OverviewResponse(BaseModel):
    total_interviews: int
    average_score: float
    best_score: int
    latest_score: int

class PerformanceResponse(BaseModel):
    date: str
    score: int

