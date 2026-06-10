from app.models.interview_session import InterviewSession
from app.models.interview_message import InterviewMessage
from app.services.generate_question import generate_question
from app.services.evaluator import evaluate_answer
from app.services.summary_generator import generate_summary


from sqlalchemy.orm import Session
from datetime import datetime


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
    session.current_question = question
    session.question_count += 1;
    db.commit()
    db.refresh(session)

    return {"session_id": session.id, "question": question}

# retrieve all the previous questions of that session
def retrieve_history(session_id,db:Session):

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
def submit_answer(session_id, answer, db: Session,max_questions:int=10):
    # retrieve the current session
    session = (
        db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
    )


    # if no session is generated
    if not session:
        raise ValueError("Interview session not found")


    # if no question is generated raise error
    if not session.current_question:
        raise ValueError("No active question found")

    # if session is already completed
    if session.status == "completed":
        raise ValueError("Interview already completed")
    
    
    # evaluate the users answer to the current question
    evaluation = evaluate_answer(
        role=session.role,
        difficulty=session.difficulty,
        question=session.current_question,
        answer=answer,
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
    

    # if num of questions exceede the limit
    # if is_interview_completed(db, session_id):
    if session.question_count >= max_questions:
        session.status = "completed"
        session.completed_at = datetime.utcnow()
        db.commit()

        return complete_interview(session_id, session.role, session.difficulty, db)

    
    history = retrieve_history(session_id,db)
    # generate next question of next state
    next_question = generate_question(
        role=session.role, difficulty=session.difficulty, history=history
    )

    session.current_question = next_question
    session.question_count += 1   
    db.commit()

    return {
        "session_id": session_id,
        "evaluation": evaluation,
        "next_question": next_question,
    }


# end the interview session and generate report
def complete_interview(session_id, role, difficulty, db: Session):
    messages = session.messages

    scores = [m.score for m in messages if m.score is not None]

    average_score = sum(scores) / len(scores) if scores else 0

    summary = generate_summary(role,difficulty,messages)

    return {
        "average_score": average_score,
        "summary": summary,
        "questions_answered": len(messages),
    }
