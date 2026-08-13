from pydantic import BaseModel
from typing import List


class ParsedResume(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    education: List[str] = []
    skills: List[str] = []
    experience: List[str] = []
    projects: List[str] = []
    certifications: List[str] = []


class ParseResumeResponse(BaseModel):
    success: bool
    resume: ParsedResume
