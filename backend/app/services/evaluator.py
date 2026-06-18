import json

from app.core.llm import client
from app.core.config import settings
from app.prompts.interview_template import (
    BASE_EVALUATION_PROMPT,
    EVALUATION_OUTPUT_FORMAT,
    RESUME_AWARE_CONTEXT,
    get_criteria,
)


#  use llm of evaluate the user answer
#  use previous answered questions for better evaluating
def evaluate_answer(
    session,
    question,
    answer,
    resume_data=None,
):

    criteria = get_criteria(
        interview_type=session.interview_type,
        resume_aware=session.interview_type == "resume",
    )

    context = ""

    if session.interview_type=='resume' and resume_data:
        context = RESUME_AWARE_CONTEXT.format(
            skills=resume_data.skills,
            projects=resume_data.projects,
            experience=resume_data.experience,
        )

    prompt = (
        BASE_EVALUATION_PROMPT.format(
            role=session.role,
            interview_type=session.interview_type,
            difficulty=session.difficulty,
            question=question,
            answer=answer,
            context=context,
            criteria=criteria,
        )
        + EVALUATION_OUTPUT_FORMAT
    )
    response = client.generate(model=settings.LLM_MODEL, prompt=prompt)

    text = response["response"].replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(text)

    except:
        return {
            "score": 0,
            "feedback": "Evaluation failed",
            "strengths": [],
            "improvements": [],
        }
