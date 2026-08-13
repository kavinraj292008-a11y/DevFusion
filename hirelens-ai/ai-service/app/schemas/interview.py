from pydantic import BaseModel
from typing import List
from app.schemas.resume import ParsedResume


class GenerateInterviewRequest(BaseModel):
    jobDescription: str
    resume: ParsedResume
    skillGaps: List[str] = []


class GenerateInterviewResponse(BaseModel):
    technicalQuestions: List[str]
    candidateSpecificQuestions: List[str]
    skillGapQuestions: List[str]


class InterviewFeedbackRequest(BaseModel):
    feedbackNotes: str


class InterviewFeedbackResponse(BaseModel):
    overallAssessment: str
    strengths: List[str]
    areasToImprove: List[str]
    recommendation: str
