"""Candidate ranking: runs the deterministic analyzer per candidate, sorts descending.

MASTER PROMPT section 21 (fairness): ranking only ever looks at skills,
experience, education, and projects — the schemas don't even have fields for
gender/age/photos/etc, so there's nothing sensitive to accidentally use.
"""

from app.schemas.analysis import CandidateInput, RankedCandidate
from app.services.resume_analyzer import analyze_resume


def rank_candidates(job_description: str, candidates: list[CandidateInput]) -> list[RankedCandidate]:
    scored = []
    for candidate in candidates:
        result = analyze_resume(job_description, candidate.resume)
        scored.append({
            "id": candidate.id,
            "name": candidate.name,
            "matchScore": result["matchScore"],
        })

    scored.sort(key=lambda c: c["matchScore"], reverse=True)

    return [
        RankedCandidate(rank=i + 1, id=c["id"], name=c["name"], matchScore=c["matchScore"])
        for i, c in enumerate(scored)
    ]
