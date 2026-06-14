from app.core.llm import client
from app.core.config import settings
import json

def generate_summary(role,difficulty,messages):
    history = []

    for message in messages:
        history.append(
            {
                "question": message.question,
                "answer": message.answer,
                "score": message.score,
                "feedback": message.feedback,
            }
        )

    prompt = f"""
You are a senior technical interviewer.

Role: {role}
Difficulty: {difficulty}

Interview History:
{history}

Evaluate the candidate across:

- Technical knowledge
- Problem solving
- Communication
- Depth of understanding

Return STRICT JSON.

{{
    "overall_score": ,
    "technical_rating": "",
    "communication_rating": "",
    "problem_solving_rating": "",
    "overall_feedback": "",
    "strengths": "",
    "weaknesses": "",
    "recommendations": "",
    "hire_recommendation": "Strong Hire | Hire | No Hire"
}}
"""

    response = client.generate(
        model=settings.LLM_MODEL,
        prompt=prompt
        )

    text = response['response'].replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(text)

    except:
        return {
            "overall_score": 0,
            "technical_rating": "",
            "communication_rating": "",
            "problem_solving_rating": "",
            "overall_feedback": "Summary generation failed",
            "strengths": "",
            "weaknesses": "",
            "recommendations": "",
            "hire_recommendation": "",
        }
