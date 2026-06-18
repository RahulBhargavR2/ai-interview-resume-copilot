import os
import shutil

from fastapi import (APIRouter,UploadFile,File,HTTPException,Depends)

from app.services.resume_parser import (extract_text_from_docx, extract_text_from_pdf)
from app.services.ai_service import (analyze_resume)
from app.core.logger import logger
from app.db.dependencies import get_db
from app.core.security import get_current_user
from app.models.user import User


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

        user = db.query(User).filter(User.id == current_user.id).first()

        user.skills = ai_analysis.get('skills',[])
        user.projects = ai_analysis.get('projects',[])
        user.experience = ai_analysis.get('experience',[])
        db.commit()

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

