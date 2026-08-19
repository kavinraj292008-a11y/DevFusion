from app.services.llm_client import ask_json
from app.services.parser import extract_skills


def generate_questions(job_description: str, resume_text: str, skill_gaps: list[str]) -> dict:
    result = ask_json(
        system_prompt=(
            "You are a technical interviewer. Given a job description, a candidate's "
            "resume, and their skill gaps, generate interview questions. "
            'Respond ONLY with JSON: {"technical_questions": [...], '
            '"candidate_specific_questions": [...]}. 3-5 items each, concise.'
        ),
        user_prompt=(
            f"JOB DESCRIPTION:\n{job_description}\n\n"
            f"RESUME:\n{resume_text}\n\n"
            f"SKILL GAPS: {', '.join(skill_gaps) if skill_gaps else 'none'}"
        ),
    )
    if result:
        return result

    # Rule-based fallback (no API key needed) - keeps the demo working offline.
    jd_skills = extract_skills(job_description)[:3]
    resume_skills = extract_skills(resume_text)[:2]

    technical = [f"Can you explain your experience with {s}?" for s in jd_skills] or [
        "Walk me through your overall technical stack."
    ]
    candidate_specific = [f"Tell me more about a project using {s}." for s in resume_skills]
    for gap in skill_gaps[:2]:
        candidate_specific.append(f"You listed {gap} as a gap — how would you approach learning it quickly?")

    return {
        "technical_questions": technical,
        "candidate_specific_questions": candidate_specific or ["Tell me about your most challenging project."],
    }
