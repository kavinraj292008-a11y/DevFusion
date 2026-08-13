from fastapi import APIRouter, HTTPException

from app.schemas.analysis import AnalyzeResumeRequest, AnalyzeResumeResponse
from app.services.resume_analyzer import analyze_resume

router = APIRouter(prefix="/api/ai", tags=["Resume Analysis"])


@router.post("/analyze-resume", response_model=AnalyzeResumeResponse)
async def analyze_resume_endpoint(payload: AnalyzeResumeRequest):
    if not payload.jobDescription.strip():
        raise HTTPException(status_code=400, detail="jobDescription is required.")

    result = analyze_resume(payload.jobDescription, payload.resume)
    return AnalyzeResumeResponse(**result)
