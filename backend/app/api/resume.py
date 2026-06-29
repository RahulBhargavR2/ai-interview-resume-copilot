import os
import shutil
import contextlib

from fastapi import (APIRouter,UploadFile,File,HTTPException,Depends)

from app.services.resume_parser import (extract_text_from_docx, extract_text_from_pdf)
from app.services.ai_service import (analyze_resume)
from app.core.logger import logger
from app.db.dependencies import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.resume import Resume


from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/resume",
    tags=["resume"]
)

UPLOAD_FOLDER = "uploads"

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user),
    db:Session = Depends(get_db)

):
    try:
        if file.size and file.size > 5 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="File too large"
            )

        allowed_extensions = [".pdf",".docx"]

        extension = os.path.splitext(file.filename)[1]

        if extension not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail="Only pdf and DOCX files allowed"
            )

        file_path = os.path.join(
            UPLOAD_FOLDER,
            file.filename
        )
        os.makedirs("uploads", exist_ok=True)
        with open(file_path,"wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer
            )

        extracted_text = ""


        if extension == '.pdf':
            extracted_text = (
                extract_text_from_pdf(file_path)
            )
        elif extension == '.docx':
            extracted_text = (
                extract_text_from_docx(file_path)
            )

        ai_analysis = analyze_resume(extracted_text)

        # user = db.query(User).filter(User.id == current_user.id).first()
        resume = Resume(
            user_id=current_user.id,
            filename=file.filename,
            raw_text=extracted_text,
            analysis=ai_analysis
        )
        db.add(resume)
        db.commit()
        db.refresh(resume)



        # user.skills = ai_analysis.get('skills',[])
        # user.projects = ai_analysis.get('projects',[])
        # user.experience = ai_analysis.get('experience',[])
        # db.commit()

        return {
            "filename":file.filename,
            "text":extracted_text[:500],
            "analysis":ai_analysis
        }
    except Exception as e:
        logger.exception('Unable to upload resume')
        return HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.post('/analyze')
async def analyze(
    file: UploadFile = File(...),
):
    return {
        "filename": "RahulLatest.pdf",
        "analysis": {
            "ats_score": 85,
            "skills": [
                "Python",
                "Java",
                "JavaScript",
                "FastAPI",
                "PostgreSQL",
                "Docker",
                "Git",
                "VS Code",
                "Postman",
                "Linear Algebra",
                "Probability",
                "Neural Networks",
                "Backpropagation",
                "Gradient Descent",
                "Computational Graphs",
                "Automatic Differentiation",
                "Arrays",
                "Strings",
                "Bit Manipulation",
                "LinkedList",
                "Stack",
                "Queues",
                "Binary Trees",
                "LeetCode",
                "CodeChef",
                "GeeksforGeeks",
                "Generative AI",
            ],
            "projects": [
                {
                    "title": "Autograd Engine + Neural Network",
                    "description": "Engineered a custom automatic differentiation engine implementing reverse-mode autodiff with a Tensor class supporting broad-casting, matrix multiplication, and gradient propagation; built a neural network framework with linear layers, activation functions, and gradient descent optimization.",
                    "tech_stack": [
                        "Python",
                        "NumPy",
                        "Linear Algebra",
                        "Backpropagation",
                        "Neural Networks",
                        "Computational Graphs",
                    ],
                },
                {
                    "title": "Intelligent Document Understanding System (RAG-based AI Assistant)",
                    "description": "Built a production-style Retrieval-Augmented Generation (RAG) platform for querying real-world documents using hybrid retrieval (FAISS + BM25), reranking, and LLM-based response generation; implemented semantic chunking, monitoring, multi-chat frontend architecture, and Dockerized deployment.",
                    "tech_stack": [
                        "Python",
                        "FastAPI",
                        "React",
                        "FAISS",
                        "BM25",
                        "SentenceTransformers",
                        "OpenRouter",
                        "Docker",
                        "NLP",
                        "RAG",
                        "LLMs",
                    ],
                },
                {
                    "title": "AI Interview and Resume Copilot",
                    "description": "Developed a full-stack AI platform for ATS resume analysis, AI-driven mock interviews, and role-based interview preparation with secure authentication, scalable APIs, real-time feedback, and Dockerized deployment.",
                    "tech_stack": [
                        "Python",
                        "FastAPI",
                        "PostgreSQL",
                        "JWT Authentication",
                        "Docker",
                        "OpenRouter",
                        "NLP",
                        "REST APIs",
                        "RBAC",
                        "System",
                    ],
                },
            ],
            "experience": [
                {
                    "title": "Python with GenAi Internship at Dhee Coding Labs.",
                    "description": "Gaining hands-on experience with generative AI tools, while also gaining exposure to web development technologies.",
                }
            ],
            "missing_keywords": [],
            "strengths": [
                "Experience in full-stack development and AI applications",
                "Strong foundation in data structures, algorithms, and machine learning",
                "Hands-on experience with Docker, Git, VS Code, and Postman",
            ],
            "weaknesses": [
                "Limited work experience outside of internships",
                "No direct experience with Java or JavaScript for backend development",
            ],
            "suggestions": [
                "Consider adding more projects to showcase full-stack development skills",
                "Highlight any contributions or achievements in competitive programming competitions",
                "Include a section on personal projects or open-source contributions",
            ],
        },
    }
    try:
        if file.size and file.size > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large")

        allowed_extensions = [".pdf", ".docx"]

        extension = os.path.splitext(file.filename)[1]

        if extension not in allowed_extensions:
            raise HTTPException(
                status_code=400, detail="Only pdf and DOCX files allowed"
            )

        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        os.makedirs("temp_uploads", exist_ok=True)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        extracted_text = ""

        if extension == ".pdf":
            extracted_text = extract_text_from_pdf(file_path)
        elif extension == ".docx":
            extracted_text = extract_text_from_docx(file_path)

        ai_analysis = analyze_resume(extracted_text)

        with contextlib.suppress(FileNotFoundError):
            os.remove(file_path)

        return {
            "filename": file.filename,
            "analysis": ai_analysis,
        }

    except Exception as e:
        logger.exception("Unable to analyze resume")
        return HTTPException(status_code=500, detail=str(e))
