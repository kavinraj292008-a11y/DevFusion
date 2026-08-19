from typing import Optional
import re
import json
from pathlib import Path
from app.models.schemas import ParsedResume

SKILLS_DB_PATH = Path(__file__).resolve().parent.parent / "data" / "skills_db.json"
with open(SKILLS_DB_PATH, "r") as f:
    SKILLS_DB = json.load(f)

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
PHONE_RE = re.compile(r"(\+?\d{1,3}[-.\s]?)?\(?\d{3,5}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}")

SECTION_HEADERS = {
    "education": ["education", "academic background"],
    "experience": ["experience", "work experience", "employment history"],
    "projects": ["projects", "academic projects"],
    "certifications": ["certifications", "certificates", "licenses"],
}


def extract_email(text: str) -> Optional[str]:
    match = EMAIL_RE.search(text)
    return match.group(0) if match else None


def extract_phone(text: str) -> Optional[str]:
    match = PHONE_RE.search(text)
    return match.group(0).strip() if match else None


def extract_name(text: str) -> Optional[str]:
    # Heuristic: first non-empty line that isn't an email/phone/URL is usually the name.
    for line in text.strip().splitlines()[:5]:
        line = line.strip()
        if not line or EMAIL_RE.search(line) or PHONE_RE.search(line):
            continue
        if len(line.split()) <= 5:
            return line
    return None


def extract_skills(text: str) -> list[str]:
    text_lower = text.lower()
    found = []
    for skill in SKILLS_DB:
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"
        if re.search(pattern, text_lower):
            found.append(skill)
    return sorted(set(found))


def extract_section(text: str, keywords: list[str]) -> list[str]:
    lines = text.splitlines()
    lower_lines = [l.lower().strip() for l in lines]
    start_idx = None
    for i, line in enumerate(lower_lines):
        if any(line.startswith(k) for k in keywords):
            start_idx = i + 1
            break
    if start_idx is None:
        return []

    end_idx = len(lines)
    all_headers = [h for group in SECTION_HEADERS.values() for h in group]
    for i in range(start_idx, len(lines)):
        if any(lower_lines[i].startswith(h) for h in all_headers):
            end_idx = i
            break

    section_lines = [l.strip("•-* \t") for l in lines[start_idx:end_idx] if l.strip()]
    return section_lines


def parse_resume(raw_text: str) -> ParsedResume:
    return ParsedResume(
        name=extract_name(raw_text),
        email=extract_email(raw_text),
        phone=extract_phone(raw_text),
        education=extract_section(raw_text, SECTION_HEADERS["education"]),
        skills=extract_skills(raw_text),
        experience=extract_section(raw_text, SECTION_HEADERS["experience"]),
        projects=extract_section(raw_text, SECTION_HEADERS["projects"]),
        certifications=extract_section(raw_text, SECTION_HEADERS["certifications"]),
        raw_text=raw_text,
    )
