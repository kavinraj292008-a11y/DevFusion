from fastapi import APIRouter, HTTPException

from app.schemas.interview import (
    GenerateInterviewRequest, GenerateInterviewResponse,
    InterviewFeedbackRequest, InterviewFeedbackResponse,
)
from app.services.interview_generator import generate_interview_questions
from app.services.feedback_analyzer import analyze_feedback

router = APIRouter(prefix="/api/ai", tags=["Interview Intelligence"])


@router.post("/generate-interview", response_model=GenerateInterviewResponse)
async def generate_interview_endpoint(payload: GenerateInterviewRequest):
    if not payload.jobDescription.strip():
        raise HTTPException(status_code=400, detail="jobDescription is required.")

    result = generate_interview_questions(payload.jobDescription, payload.resume, payload.skillGaps)
    return GenerateInterviewResponse(**result)


@router.post("/interview-feedback", response_model=InterviewFeedbackResponse)
async def interview_feedback_endpoint(payload: InterviewFeedbackRequest):
    if not payload.feedbackNotes.strip():
        raise HTTPException(status_code=400, detail="feedbackNotes is required.")

    result = analyze_feedback(payload.feedbackNotes)
    return InterviewFeedbackResponse(**result)
