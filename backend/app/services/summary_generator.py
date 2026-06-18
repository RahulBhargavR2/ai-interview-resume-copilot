from app.core.llm import client
from app.core.config import settings
from app.prompts.interview_template import (
    SUMMARY_OUTPUT_FORMAT,
    BASE_SUMMARY_PROMPT,
    RESUME_AWARE_CONTEXT,
    get_criteria,
)

import json


def generate_summary(
    session,
    resume_data=None,
):

    history = [
        {
            "question": m.question,
            "answer": m.answer,
            "score": m.score,
            "feedback": m.feedback,
        }
        for m in session.messages
    ]

    criteria = get_criteria(interview_type=session.interview_type, resume_aware=session.interview_type=='resume')
    context = ""
    if session.interview_session == 'resume':
        context = RESUME_AWARE_CONTEXT.format(
            skills=resume_data.skills,
            projects=resume_data.projects,
            experience=resume_data.experience,
        )

    prompt = BASE_SUMMARY_PROMPT.format(
        role=session.role,
        interview_type=session.interview_type,
        difficulty=session.difficulty,
        context=context,
        history=history,
        criteria=criteria,
    )+ SUMMARY_OUTPUT_FORMAT

    response = client.generate(model=settings.LLM_MODEL, prompt=prompt)

    text = response["response"].replace("```json", "").replace("```", "").strip()

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
