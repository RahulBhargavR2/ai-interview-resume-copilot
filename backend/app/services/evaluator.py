import json

from app.core.llm import client
from app.core.config import settings


#  use llm of evaluate the user answer 
#  use previous answered questions for better evaluating
def evaluate_answer(role, difficulty, question, answer):

    prompt = f"""
You are an expert technical interviewer.

Role: {role}
Difficulty: {difficulty}

Question:
{question}

Candidate Answer:
{answer}

Evaluate the answer.

Scoring Rules:
- Score from 0 to 10 based on performance.
- Consider correctness, completeness, clarity, and depth.
- Be strict according to the difficulty level.

Return STRICT JSON only.

{{
    "score": ,
    "feedback": "",
    "strengths": "",
    "improvements": ""
}}
"""
    response = client.generate(model=settings.LLM_MODEL,prompt=prompt)

    text = response["response"].replace("```json", "").replace("```", "").strip()
   

    try:
        return json.loads(text)

    except:
        return {
            "score": 0,
            "feedback": "Evaluation failed",
            "strengths": "",
            "improvements": "",
        }

