from fastapi import APIRouter, HTTPException

from app.schemas.analysis import RecommendJobsRequest, RecommendJobsResponse
from app.services.job_recommender import recommend_jobs

router = APIRouter(prefix="/api/ai", tags=["Job Recommendation"])


@router.post("/recommend-jobs", response_model=RecommendJobsResponse)
async def recommend_jobs_endpoint(payload: RecommendJobsRequest):
    if not payload.jobs:
        raise HTTPException(status_code=400, detail="jobs list cannot be empty.")

    recommendations = recommend_jobs(payload.resume, payload.jobs)
    return RecommendJobsResponse(recommendations=recommendations)
