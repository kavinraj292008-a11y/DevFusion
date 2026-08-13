"""
Structured extraction from raw resume text.

Rule (MASTER PROMPT section 5): the parser must NOT invent information.
Every field defaults to "" or [] if it can't be found — we never guess.
"""

import re
from app.schemas.resume import ParsedResume
from app.utils.text_processing import extract_known_skills

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
PHONE_RE = re.compile(r"(\+?\d{1,3}[-.\s]?)?\(?\d{3,5}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}")

SECTION_HEADERS = {
    "education": ["education", "academic background", "academic qualification"],
    "experience": ["experience", "work experience", "employment history", "professional experience"],
    "projects": ["projects", "academic projects", "personal projects"],
    "certifications": ["certifications", "certificates", "licenses", "certification"],
}
ALL_HEADER_KEYWORDS = [h for group in SECTION_HEADERS.values() for h in group]


def _extract_email(text: str) -> str:
    match = EMAIL_RE.search(text)
    return match.group(0) if match else ""


def _extract_phone(text: str) -> str:
    match = PHONE_RE.search(text)
    return match.group(0).strip() if match else ""


def _extract_name(text: str) -> str:
    # Heuristic only: first short line at the top that isn't contact info.
    for line in text.strip().splitlines()[:5]:
        line = line.strip()
        if not line or EMAIL_RE.search(line) or PHONE_RE.search(line):
            continue
        if 0 < len(line.split()) <= 5:
            return line
    return ""


def _extract_section(text: str, keywords: list[str]) -> list[str]:
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
    for i in range(start_idx, len(lines)):
        if any(lower_lines[i].startswith(h) for h in ALL_HEADER_KEYWORDS):
            end_idx = i
            break

    return [l.strip("•-* \t") for l in lines[start_idx:end_idx] if l.strip()]


def extract_resume_data(raw_text: str) -> ParsedResume:
    """Pure function: raw resume text -> ParsedResume. No PDF/IO dependency,
    which makes it directly unit-testable (see tests/test_resume_parser.py)."""
    return ParsedResume(
        name=_extract_name(raw_text),
        email=_extract_email(raw_text),
        phone=_extract_phone(raw_text),
        education=_extract_section(raw_text, SECTION_HEADERS["education"]),
        skills=extract_known_skills(raw_text),
        experience=_extract_section(raw_text, SECTION_HEADERS["experience"]),
        projects=_extract_section(raw_text, SECTION_HEADERS["projects"]),
        certifications=_extract_section(raw_text, SECTION_HEADERS["certifications"]),
    )
