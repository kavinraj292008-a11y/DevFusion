import re
from functools import lru_cache
from app.services.parser import extract_skills

_model = None


@lru_cache(maxsize=1)
def get_embedding_model():
    """Lazy-load the sentence-transformer model once (keeps cold start fast)."""
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def semantic_similarity(resume_text: str, jd_text: str) -> float:
    """Cosine similarity between resume and JD embeddings, 0-1. Falls back to
    a simple keyword-overlap ratio if the embedding model can't be loaded
    (e.g. no internet on a locked-down machine)."""
    try:
        from sklearn.metrics.pairwise import cosine_similarity
        model = get_embedding_model()
        vectors = model.encode([resume_text, jd_text])
        score = cosine_similarity([vectors[0]], [vectors[1]])[0][0]
        return float(max(0.0, min(1.0, score)))
    except Exception:
        resume_words = set(re.findall(r"\w+", resume_text.lower()))
        jd_words = set(re.findall(r"\w+", jd_text.lower()))
        if not jd_words:
            return 0.0
        return len(resume_words & jd_words) / len(jd_words)


def compute_match(resume_text: str, job_description: str) -> dict:
    resume_skills = set(extract_skills(resume_text))
    jd_skills = set(extract_skills(job_description))

    matched = sorted(resume_skills & jd_skills)
    missing = sorted(jd_skills - resume_skills)

    skill_coverage = len(matched) / len(jd_skills) if jd_skills else 0.5
    semantic_score = semantic_similarity(resume_text, job_description)

    # Weighted blend: explicit skill overlap matters more than free-text similarity.
    final_score = round((0.7 * skill_coverage + 0.3 * semantic_score) * 100)
    final_score = max(0, min(100, final_score))

    strengths, weaknesses = [], []
    if matched:
        strengths.append(f"Strong match on {', '.join(matched[:4])}")
    if len(resume_text.split()) > 300:
        strengths.append("Detailed, well-documented experience")
    if not missing:
        strengths.append("Covers all required skills for this role")
    if missing:
        weaknesses.append(f"Limited or no experience in {', '.join(missing[:3])}")
    if skill_coverage < 0.5:
        weaknesses.append("Overall skill overlap with job description is low")

    if final_score >= 85:
        recommendation = "SHORTLIST"
    elif final_score >= 60:
        recommendation = "CONSIDER"
    else:
        recommendation = "REJECT"

    return {
        "matchScore": final_score,
        "matchedSkills": matched,
        "missingSkills": missing,
        "strengths": strengths or ["Resume aligns reasonably with the role"],
        "weaknesses": weaknesses or ["No major gaps identified"],
        "recommendation": recommendation,
    }
