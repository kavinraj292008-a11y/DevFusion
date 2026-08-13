"""Generates three distinct question categories (MASTER PROMPT section 11)."""

from app.schemas.resume import ParsedResume
from app.utils.text_processing import extract_known_skills
from app.utils.llm_client import ask_json


def _fallback_questions(job_description: str, resume: ParsedResume, skill_gaps: list[str]) -> dict:
    jd_skills = extract_known_skills(job_description)[:3]
    resume_skills = extract_known_skills(" ".join(resume.skills))[:2]

    technical = [f"Explain your experience with {s} and how you've used it in production."
                 for s in jd_skills] or ["Walk me through your overall technical stack."]

    candidate_specific = []
    for project in resume.projects[:2]:
        candidate_specific.append(f"Tell me more about this project: \"{project[:80]}\"")
    for exp in resume.experience[:1]:
        candidate_specific.append(f"Can you elaborate on this experience: \"{exp[:80]}\"")
    if not candidate_specific:
        candidate_specific = ["Tell me about your most challenging technical project."]

    skill_gap_questions = [
        f"How familiar are you with {gap}, and how would you approach ramping up quickly?"
        for gap in skill_gaps[:4]
    ] or ["Are there any technologies in the job description you haven't worked with yet?"]

    return {
        "technicalQuestions": technical,
        "candidateSpecificQuestions": candidate_specific,
        "skillGapQuestions": skill_gap_questions,
    }


def generate_interview_questions(job_description: str, resume: ParsedResume, skill_gaps: list[str]) -> dict:
    result = ask_json(
        system_prompt=(
            "You are a technical interviewer preparing questions for a candidate. "
            "Base every question ONLY on the job description, resume content, and skill "
            "gaps given — do not invent projects or experience the candidate didn't list. "
            'Respond ONLY with JSON: {"technicalQuestions": [...], '
            '"candidateSpecificQuestions": [...], "skillGapQuestions": [...]}. '
            "3-5 items per category."
        ),
        user_prompt=(
            f"JOB DESCRIPTION:\n{job_description}\n\n"
            f"CANDIDATE SKILLS: {resume.skills}\n"
            f"CANDIDATE EXPERIENCE: {resume.experience}\n"
            f"CANDIDATE PROJECTS: {resume.projects}\n\n"
            f"SKILL GAPS: {skill_gaps if skill_gaps else 'none'}"
        ),
    )
    if result and all(k in result for k in ("technicalQuestions", "candidateSpecificQuestions", "skillGapQuestions")):
        return result

    return _fallback_questions(job_description, resume, skill_gaps)
