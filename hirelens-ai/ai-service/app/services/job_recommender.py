"""Recommends jobs to a candidate by reusing the deterministic skill-match logic."""

from app.schemas.resume import ParsedResume
from app.schemas.analysis import JobInput
from app.utils.text_processing import normalize_skill_set, extract_known_skills


def recommend_jobs(resume: ParsedResume, jobs: list[JobInput]) -> list[dict]:
    resume_skills = normalize_skill_set(resume.skills)
    recommendations = []

    for job in jobs:
        jd_text = f"{job.title}\n{job.description}\n{', '.join(job.skills)}"
        required_skills = normalize_skill_set(job.skills) or normalize_skill_set(extract_known_skills(jd_text))

        if not required_skills:
            score = 50
        else:
            overlap = len(resume_skills & required_skills) / len(required_skills)
            score = round(overlap * 100)

        recommendations.append({"jobId": job.jobId, "title": job.title, "matchScore": score})

    return sorted(recommendations, key=lambda r: r["matchScore"], reverse=True)
