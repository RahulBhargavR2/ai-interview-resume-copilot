import json
from fastapi import HTTPException

from app.core.logger import logger
from app.core.llm import client
from app.core.config import settings
from app.prompts.question_generation import (
    BASE_QUESTION_PROMPT,
    RESUME_GENERATION,
    QUESTION_TEMPLATES,
)


def generate_question(session, resume_data=None, history=None):

    history = history or []

    history_text = (
        "This is the first question." if not history else json.dumps(history, indent=2)
    )

    criteria = QUESTION_TEMPLATES.get(session.interview_type, "")

    if resume_data:

        criteria += "\n\n" + RESUME_GENERATION.format(
            skills=resume_data.skills or [],
            projects=resume_data.projects or [],
            experience=resume_data.experience or [],
        )

    prompt = BASE_QUESTION_PROMPT.format(
        role=session.role,
        interview_type=session.interview_type,
        difficulty=session.difficulty,
        previous_questions=history_text,
        criteria=criteria,
    )

    try:

        response = client.generate(model=settings.LLM_MODEL, prompt=prompt)

        text = response.get("response","").replace("```json", "").replace("```", "").strip()

        return text

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

  
   
