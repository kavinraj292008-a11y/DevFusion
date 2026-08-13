from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.pdf_parser import extract_text_from_pdf
from app.services.resume_extractor import extract_resume_data
from app.schemas.resume import ParseResumeResponse
from app.utils.exceptions import InvalidPDFError, EmptyPDFError

router = APIRouter(prefix="/api/ai", tags=["Resume Parser"])


@router.post("/parse-resume", response_model=ParseResumeResponse)
async def parse_resume(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    file_bytes = await file.read()

    try:
        raw_text = extract_text_from_pdf(file_bytes)
    except EmptyPDFError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except InvalidPDFError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    resume = extract_resume_data(raw_text)
    return ParseResumeResponse(success=True, resume=resume)
