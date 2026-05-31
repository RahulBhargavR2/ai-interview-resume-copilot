import os
import shutil

from fastapi import (APIRouter,UploadFile,File,HTTPException)

from app.services.resume_parser import (extract_text_from_docx, extract_text_from_pdf)
from app.services.ai_service import (analyze_resume)

router = APIRouter(
    prefix="/resume",
    tags=["resume"]
)

UPLOAD_FOLDER = "uploads"

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...)
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
        

        return {
            "filename":file.filename,
            "text":extracted_text[:500],
            "analysis":ai_analysis
        }
    except Exception as e:
        return HTTPException(
            status_code=500,
            detail=e
        )

