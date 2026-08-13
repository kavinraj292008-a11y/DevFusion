from fastapi import APIRouter, HTTPException

from app.schemas.analysis import RankCandidatesRequest, RankCandidatesResponse
from app.services.ranking_engine import rank_candidates

router = APIRouter(prefix="/api/ai", tags=["Candidate Ranking"])


@router.post("/rank-candidates", response_model=RankCandidatesResponse)
async def rank_candidates_endpoint(payload: RankCandidatesRequest):
    if not payload.candidates:
        raise HTTPException(status_code=400, detail="candidates list cannot be empty.")
    if not payload.jobDescription.strip():
        raise HTTPException(status_code=400, detail="jobDescription is required.")

    ranked = rank_candidates(payload.jobDescription, payload.candidates)
    return RankCandidatesResponse(jobId=payload.jobId, candidates=ranked)
