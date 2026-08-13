"""
Text cleaning + skill normalization.

Skill normalization matters because a resume might say "React.js" and a job
description might say "ReactJS" — without normalizing, these would be treated
as two different skills and the match score would be wrong.
"""

import re
import json
from pathlib import Path

SKILLS_DB_PATH = Path(__file__).resolve().parent / "skills_db.json"
with open(SKILLS_DB_PATH, "r") as f:
    SKILLS_DB: list[str] = json.load(f)

# Map common variants -> canonical skill name.
# Keys are lowercase, punctuation/space-stripped.
SKILL_ALIASES: dict[str, str] = {
    "react": "React",
    "reactjs": "React",
    "reactjs": "React",
    "nodejs": "Node",
    "node": "Node",
    "nextjs": "Next.js",
    "vuejs": "Vue",
    "vue": "Vue",
    "angularjs": "Angular",
    "angular": "Angular",
    "mongodb": "MongoDB",
    "mongo": "MongoDB",
    "postgresql": "PostgreSQL",
    "postgres": "PostgreSQL",
    "mysql": "MySQL",
    "typescript": "TypeScript",
    "javascript": "JavaScript",
    "js": "JavaScript",
    "expressjs": "Express",
    "express": "Express",
    "nestjs": "Nest.js",
    "python": "Python",
    "django": "Django",
    "fastapi": "FastAPI",
    "flask": "Flask",
    "java": "Java",
    "springboot": "Spring Boot",
    "spring": "Spring Boot",
    "aws": "AWS",
    "amazonwebservices": "AWS",
    "azure": "Azure",
    "gcp": "GCP",
    "googlecloud": "GCP",
    "docker": "Docker",
    "kubernetes": "Kubernetes",
    "k8s": "Kubernetes",
    "cicd": "CI/CD",
    "jenkins": "Jenkins",
    "git": "Git",
    "github": "GitHub",
    "gitlab": "GitLab",
    "restapi": "REST API",
    "rest": "REST API",
    "graphql": "GraphQL",
    "microservices": "Microservices",
    "html": "HTML",
    "html5": "HTML",
    "css": "CSS",
    "css3": "CSS",
    "tailwind": "Tailwind CSS",
    "tailwindcss": "Tailwind CSS",
    "bootstrap": "Bootstrap",
    "sass": "Sass",
    "scss": "Sass",
    "machinelearning": "Machine Learning",
    "ml": "Machine Learning",
    "deeplearning": "Deep Learning",
    "dl": "Deep Learning",
    "nlp": "NLP",
    "tensorflow": "TensorFlow",
    "pytorch": "PyTorch",
    "pandas": "Pandas",
    "numpy": "NumPy",
    "scikitlearn": "Scikit-learn",
    "sklearn": "Scikit-learn",
    "linux": "Linux",
    "bash": "Bash",
}


def clean_text(text: str) -> str:
    """Normalize whitespace and strip control characters from extracted PDF text."""
    text = text.replace("\x00", "")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _slug(value: str) -> str:
    """Lowercase, remove spaces/punctuation, for alias lookup."""
    return re.sub(r"[^a-z0-9]", "", value.lower())


def normalize_skill(raw_skill: str) -> str:
    """Map a raw skill string to its canonical display name.
    Falls back to a title-cased version of the input if it's not a known alias,
    so we never silently drop a skill the recruiter typed manually."""
    key = _slug(raw_skill)
    if key in SKILL_ALIASES:
        return SKILL_ALIASES[key]
    return raw_skill.strip()


def normalize_skill_set(skills: list[str]) -> set[str]:
    """Normalize a list of skills into a de-duplicated canonical set."""
    return {normalize_skill(s) for s in skills if s and s.strip()}


def extract_known_skills(text: str) -> list[str]:
    """Find which of our known SKILLS_DB entries appear in free text (resume or JD)."""
    text_lower = text.lower()
    found = []
    for skill in SKILLS_DB:
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"
        if re.search(pattern, text_lower):
            found.append(normalize_skill(skill))
    return sorted(set(found))
