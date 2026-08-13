from pydantic import BaseModel
from typing import List
from app.schemas.resume import ParsedResume


class AnalyzeResumeRequest(BaseModel):
    jobDescription: str
    resume: ParsedResume


class ScoreBreakdown(BaseModel):
    skills: int
    experience: int
    education: int
    projects: int


class AnalyzeResumeResponse(BaseModel):
    matchScore: int
    scoreBreakdown: ScoreBreakdown
    matchedSkills: List[str]
    missingSkills: List[str]
    strengths: List[str]
    weaknesses: List[str]
    recommendation: str


class CandidateInput(BaseModel):
    id: str
    name: str
    resume: ParsedResume


class RankCandidatesRequest(BaseModel):
    jobId: str
    jobDescription: str
    candidates: List[CandidateInput]


class RankedCandidate(BaseModel):
    rank: int
    id: str
    name: str
    matchScore: int


class RankCandidatesResponse(BaseModel):
    jobId: str
    candidates: List[RankedCandidate]


class JobInput(BaseModel):
    jobId: str
    title: str
    description: str = ""
    skills: List[str] = []


class RecommendJobsRequest(BaseModel):
    resume: ParsedResume
    jobs: List[JobInput]


class JobRecommendation(BaseModel):
    jobId: str
    title: str
    matchScore: int


class RecommendJobsResponse(BaseModel):
    recommendations: List[JobRecommendation]
