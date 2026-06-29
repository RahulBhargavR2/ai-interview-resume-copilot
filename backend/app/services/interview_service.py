from app.models.interview_session import InterviewSession
from app.models.interview_message import InterviewMessage
from app.services.generate_question import generate_question
from app.services.evaluator import evaluate_answer
from app.services.summary_generator import generate_summary
from app.services.session_retriver import get_session_by_id
from app.models.user import User

from datetime import datetime
from fastapi import HTTPException


# start the session
def start_interview(
    user_id,
    role,
    difficulty,
    interview_type,
    db,
):


    #   create new session
    session = InterviewSession(user_id=user_id, role=role, difficulty=difficulty,interview_type=interview_type)
    resume_data = get_resume_data(session.interview_type, user_id, db)
    if resume_data:
        session.resume_id = resume_data.id
    # add it to db commit
    db.add(session)
    db.commit()
    # refresh so that we can use it immediately
    db.refresh(session)

    resume_data = resume_data.analysis if resume_data is not None else None

    # generate new question
    question = generate_question(session=session,resume_data=resume_data)
    session.current_question = question
    session.question_count += 1
    db.commit()
    db.refresh(session)

    return {"session_id": session.id, "question": question}


# retrieve all the previous questions of that session
def retrieve_history(session_id, db):

    messages = (
        db.query(InterviewMessage)
        .filter(InterviewMessage.session_id == session_id)
        .order_by(InterviewMessage.id)
        .all()
    )
    # converting sqlobject to json so llm understands
    history = [
        {
            "question": m.question,
            # "answer": m.answer,
            # "score": m.score,
            # "feedback": m.feedback,
            # "strengths": m.strengths,
            # "improvements": m.improvements,
        }
        for m in messages
    ]

    return history


#  submit user answer, evaluate it , generate report
# then generate next question
def submit_answer(
    session_id,
    user_id,
    answer,
    db,
    max_questions: int = 3,
):
    # retrieve the current session
    session = get_session_by_id(session_id, user_id, db)

    # if no session is generated
    if not session:
        raise HTTPException(
            status_code=404,
            detail='No session found'
        )

    # if no question is generated raise error
    if not session.current_question:
        raise HTTPException(
            status_code=404,
            detail='No active question found'
        )

    # if session is already completed
    if session.status == "completed":
        raise HTTPException(status_code=400,
        detail="Interview already completed"
        )

    resume_data = get_resume_data(session.interview_type, user_id, db)
    resume_data = resume_data.analysis if resume_data is not None else None

    # evaluate the users answer to the current question
    evaluation = evaluate_answer(
        session=session,
        question=session.current_question,
        answer=answer,
        resume_data=resume_data,
    )

    # store the evaluated result into database
    message = InterviewMessage(
        session_id=session_id,
        question=session.current_question,
        answer=answer,
        score=evaluation["score"],
        feedback=evaluation["feedback"],
        strengths=evaluation["strengths"],
        improvements=evaluation["improvements"],
    )

    db.add(message)
    db.commit()

    # if num of questions exceede the limit
    # if is_interview_completed(db, session_id):
    if session.question_count >= max_questions:
        report = complete_interview(
            session,
            db,
            resume_data,
        )
        return {"session_id": session_id,"completed":True, "evaluation": evaluation, "report": report}

    history = retrieve_history(session_id, db)
    # generate next question of next state
    next_question = generate_question(
        session=session,resume_data=resume_data, history=history
    )

    session.current_question = next_question
    session.question_count += 1
    db.commit()

    return {
        "session_id": session_id,
        "completed":False,
        "evaluation": evaluation,
        "next_question": next_question,
    }


# end the interview session and generate report
def complete_interview(
    session,
    db,
    resume_data=None,
):



    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found")

    messages = session.messages

    scores = [m.score for m in messages if m.score is not None]

    average_score = sum(scores) / len(scores) if scores else 0

    summary = generate_summary(
        session,
        resume_data=resume_data
    )

    session.overall_score = summary.get("overall_score", average_score)

    summary_for_storage = summary.copy()
    summary_for_storage.pop("overall_score", None)

    session.summary = summary_for_storage

    session.status = "completed"
    session.current_question = None
    session.completed_at = datetime.utcnow()

    db.commit()

    return {
        "average_score": average_score,
        "overall_score": session.overall_score,
        "summary": session.summary,
        "questions_answered": len(scores),
    }


def get_resume_data(interview_type, user_id, db):
    if interview_type != "resume":
        return None

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return  user.resumes[-1] if user.resumes else None
