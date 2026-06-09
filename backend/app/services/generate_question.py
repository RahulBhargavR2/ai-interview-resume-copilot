import json

from app.core.llm import client
from app.core.config import settings


# generated interview question
# generates based on priveously generated questions if present
# based on role and difficulty

def generate_question(role, difficulty, history=None):
    history = history or []

    if not history:
        context = "This is the first question."
    else:
        context = f"""
Previous Interview History:

{history}

Generate the next question.
Do not repeat previous questions.
Adapt difficulty based on previous scores.
"""

    prompt = f"""
You are an expert technical interviewer

Role:
{role}

Difficulty:
{difficulty}

{context}

Return STRICT JSON.

{{
    "question": ""
}}
"""

    response = client.generate(
        model=settings.LLM_MODEL,
        prompt=prompt
        )

    text = response["response"].replace("```json", "").replace("```", "").strip()

    return text
