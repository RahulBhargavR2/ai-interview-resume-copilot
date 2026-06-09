from app.models.interview_session import InterviewSession
from app.models.interview_message import InterviewMessage
from app.services.generate_question import generate_question
from app.services.evaluator import evaluate_answer
from app.services.summary_generator import generate_summary


from sqlalchemy.orm import Session


# start the session
def start_interview(
    user_id,
    role,
    difficulty,
    db: Session,
):

#   create new session
    session = InterviewSession(user_id=user_id, role=role, difficulty=difficulty)
    # add it to db commit
    db.add(session)
    db.commit()
    # refresh so that we can use it immediately
    db.refresh(session)

    # generate new question
    question = generate_question(role=role, difficulty=difficulty)
    # add generated question to db
    message = InterviewMessage(session_id=session.id, question=question)
    db.add(message)
    db.commit()
    db.refresh(message)

    return {"session_id": session.id, "question": question}

# retrives latest unanswered question that has beed gnerated
def get_current_message(session_id, db: Session):
    return (
        db.query(InterviewMessage)
        .filter(
            InterviewMessage.session_id == session_id, InterviewMessage.answer.is_(None)
        )
        .first()
    )


#  checks whether the interview is completed by comparing the no fo questions asked
def is_interview_completed(db, session_id, max_questions=10):
    question_count = (
        db.query(InterviewMessage)
        .filter(
            InterviewMessage.session_id == session_id,
            InterviewMessage.answer.isnot(None),
        )
        .count()
    )

    return question_count >= max_questions


# retrive all the previous questions of that session
def retrive_history(session_id,db:Session):

    messages = (
        db.query(InterviewMessage)
        .filter(InterviewMessage.session_id == session_id)
        .all()
    )
    # converting sqlobject to json so llm understands 
    history = [
        {
            "question": m.question,
            "answer": m.answer,
            "score": m.score,
            "feedback": m.feedback,
            "strengths": m.strengths,
            "improvements": m.improvements,
        }
        for m in messages
    ]

    return history


#  submit user answer, evaluate it , generate report
# then generate next question
def submit_answer(session_id, answer, db: Session):
    # retrive the current session
    session = (
        db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
    )


    # if no session is generated
    if not session:
        raise ValueError("Interview session not found")

    
    
    # get the latest question
    current_message = get_current_message(session_id, db)

    # if no question is generated raise error
    if not current_message:
        raise ValueError("No active question found")

    # if session is already completed
    if session.status == "completed":
        raise ValueError("Interview already completed")
    
    
    # evaluate the users answer to the current question
    evaluation = evaluate_answer(
        role=session.role,
        difficulty=session.difficulty,
        question=current_message.question,
        answer=answer,
    )

    # store the evaluated result into database
    current_message.answer = answer
    current_message.score = evaluation["score"]
    current_message.feedback = evaluation["feedback"]
    current_message.strengths = evaluation["strengths"]
    current_message.improvements = evaluation["improvements"]
    db.commit()
    db.refresh(current_message)

    # if num of questions exceede the limit
    if is_interview_completed(db, session_id):
        session.status = "completed"
        db.commit()

        return complete_interview(session_id, session.role, session.difficulty, db)

    
    history = retrive_history(session_id,db)
    # generate next question of next state
    next_question = generate_question(
        role=session.role, difficulty=session.difficulty, history=history
    )
    next_message = InterviewMessage(session_id=session_id, question=next_question)

    db.add(next_message)
    db.commit()
    db.refresh(next_message)

    return {
        "session_id": session_id,
        "evaluation": evaluation,
        "next_question": next_question,
    }


# end the interview session and generate report
def complete_interview(session_id, role, difficulty, db: Session):
    messages = (
        db.query(InterviewMessage)
        .filter(InterviewMessage.session_id == session_id)
        .all()
    )

    scores = [m.score for m in messages if m.score is not None]

    average_score = sum(scores) / len(scores) if scores else 0

    summary = generate_summary(messages)

    return {
        "average_score": average_score,
        "summary": summary,
        "questions_answered": len(messages),
    }
