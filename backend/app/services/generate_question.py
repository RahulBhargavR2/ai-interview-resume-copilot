import json
from fastapi import HTTPException

from app.core.logger import logger
from app.core.llm import client
from app.core.config import settings
from app.prompts.question_generation import (
    BASE_QUESTION_PROMPT,
    RESUME_GENERATION,
    QUESTION_TEMPLATES,
    get_criteria
)
from app.core.llmResponse import(generateResponse)


def generate_question(session, resume_data=None, history=None):

    history = history or []


    history_text = (
        "This is the first question." if not history else json.dumps(history, indent=2)
    )


    criteria = get_criteria(session.role,session.interview_type == 'resume')

    if resume_data:

        criteria += "\n\n" + RESUME_GENERATION.format(
            skills=resume_data.get('skills', []),
            projects=resume_data.get('projects',  []),
            experience=resume_data.get('experience', []),
        )

    prompt = BASE_QUESTION_PROMPT.format(
        role=session.role,
        interview_type=session.interview_type,
        difficulty=session.difficulty,
        previous_questions=history_text,
        criteria=criteria,
    )

    try:
        response = generateResponse(prompt=prompt)
        return response

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
