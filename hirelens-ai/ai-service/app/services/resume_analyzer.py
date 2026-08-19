"""
Deterministic resume/job-description scoring engine.

MASTER PROMPT section 7: the match score is NEVER produced by an LLM.
It's calculated by fixed, explainable weights:
    skillScore      * 0.60
  + experienceScore  * 0.20
  + educationScore   * 0.10
  + projectScore     * 0.10

The LLM (optional) is only used afterwards to phrase qualitative
strengths/weaknesses in plain English — it never touches the number.
"""

import re
from app.schemas.resume import ParsedResume
from app.utils.text_processing import extract_known_skills, normalize_skill_set
from app.utils.llm_client import ask_json

EDUCATION_KEYWORDS = [
    "b.tech", "btech", "b.e", "be", "bachelor", "computer science", "information technology",
    "m.tech", "mtech", "master", "engineering", "diploma",
]


def _words(text: str) -> set[str]:
    return set(re.findall(r"[a-zA-Z]{3,}", text.lower()))


def compute_skill_score(resume_skills: set[str], required_skills: set[str]) -> tuple[int, list[str], list[str]]:
    if not required_skills:
        # No explicit skills in the JD text — treat as a neutral baseline instead of 0,
        # so a well-matched resume isn't unfairly punished for a sparse JD.
        return 70, sorted(resume_skills), []

    matched = sorted(resume_skills & required_skills)
    missing = sorted(required_skills - resume_skills)
    score = round((len(matched) / len(required_skills)) * 100)
    return score, matched, missing


def compute_experience_score(experience: list[str], job_description: str) -> int:
    if not experience:
        return 0
    jd_words = _words(job_description)
    exp_words = _words(" ".join(experience))
    if not jd_words:
        return 60  # some experience exists, nothing to compare it against
    overlap = len(jd_words & exp_words) / len(jd_words)
    # Blend a base score (experience exists at all) with keyword relevance.
    return round(min(100, 40 + overlap * 60))


def compute_education_score(education: list[str], job_description: str) -> int:
    if not education:
        return 0
    edu_text = " ".join(education).lower()
    base = 70
    bonus = 30 if any(k in edu_text for k in EDUCATION_KEYWORDS) else 10
    return min(100, base - 20 + bonus) if bonus == 10 else min(100, base + 10)


def compute_project_score(projects: list[str], required_skills: set[str]) -> int:
    if not projects:
        return 0
    project_text = " ".join(projects)
    project_skills = normalize_skill_set(extract_known_skills(project_text))
    if not required_skills:
        return 60 if project_skills else 40
    overlap = len(project_skills & required_skills) / len(required_skills)
    return round(min(100, 40 + overlap * 60))


def get_recommendation(score: int) -> str:
    if score >= 90:
        return "STRONGLY SHORTLIST"
    if score >= 75:
        return "SHORTLIST"
    if score >= 60:
        return "REVIEW"
    return "LOW MATCH"


def _fallback_qualitative(matched: list[str], missing: list[str], breakdown: dict) -> tuple[list[str], list[str]]:
    strengths, weaknesses = [], []
    if matched:
        strengths.append(f"Strong alignment on {', '.join(matched[:4])}")
    if breakdown["experience"] >= 70:
        strengths.append("Relevant hands-on experience for this role")
    if breakdown["projects"] >= 70:
        strengths.append("Project work demonstrates the required skill set")
    if missing:
        weaknesses.append(f"Limited or no experience in {', '.join(missing[:3])}")
    if breakdown["education"] < 50:
        weaknesses.append("Education background not clearly aligned with the role")
    return (
        strengths or ["Resume shows reasonable alignment with the role"],
        weaknesses or ["No major gaps identified"],
    )


def analyze_resume(job_description: str, resume: ParsedResume) -> dict:
    required_skills = normalize_skill_set(extract_known_skills(job_description))
    resume_skills = normalize_skill_set(resume.skills)

    skill_score, matched, missing = compute_skill_score(resume_skills, required_skills)
    experience_score = compute_experience_score(resume.experience, job_description)
    education_score = compute_education_score(resume.education, job_description)
    project_score = compute_project_score(resume.projects, required_skills)

    final_score = round(
        skill_score * 0.60
        + experience_score * 0.20
        + education_score * 0.10
        + project_score * 0.10
    )
    final_score = max(0, min(100, final_score))

    breakdown = {
        "skills": skill_score,
        "experience": experience_score,
        "education": education_score,
        "projects": project_score,
    }

    # Ask the LLM only for phrasing — it's given the already-computed facts,
    # not asked to invent a score, so it can't hallucinate a different number.
    llm_result = ask_json(
        system_prompt=(
            "You write short, factual recruiter notes from resume-vs-job match data. "
            "Only use the facts given — never invent skills, employers, or experience "
            "that weren't provided. "
            'Respond ONLY with JSON: {"strengths": [...], "weaknesses": [...]}. '
            "2-4 short bullet points each."
        ),
        user_prompt=(
            f"Matched skills: {matched}\nMissing skills: {missing}\n"
            f"Score breakdown: {breakdown}\n"
            f"Experience entries: {resume.experience}\nProjects: {resume.projects}"
        ),
    )
    if llm_result and "strengths" in llm_result and "weaknesses" in llm_result:
        strengths, weaknesses = llm_result["strengths"], llm_result["weaknesses"]
    else:
        strengths, weaknesses = _fallback_qualitative(matched, missing, breakdown)

    return {
        "matchScore": final_score,
        "scoreBreakdown": breakdown,
        "matchedSkills": matched,
        "missingSkills": missing,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "recommendation": get_recommendation(final_score),
    }
