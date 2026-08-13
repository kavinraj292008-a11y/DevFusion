import pytest
from app.services.resume_extractor import extract_resume_data
from app.services.pdf_parser import extract_text_from_pdf
from app.utils.exceptions import InvalidPDFError, EmptyPDFError

SAMPLE_RESUME_TEXT = """Arun Kumar
arun@gmail.com
9876543210

Skills
React, Node.js, MongoDB, TypeScript

Education
B.Tech Computer Science, 2024

Experience
Software Engineer Intern - built React dashboards and Node.js APIs

Projects
E-commerce platform using React and MongoDB

Certifications
AWS Certified Cloud Practitioner
"""


def test_extract_resume_data_valid_text():
    resume = extract_resume_data(SAMPLE_RESUME_TEXT)
    assert resume.name == "Arun Kumar"
    assert resume.email == "arun@gmail.com"
    assert resume.phone == "9876543210"
    assert "React" in resume.skills
    assert "MongoDB" in resume.skills
    assert len(resume.education) > 0
    assert len(resume.experience) > 0
    assert len(resume.projects) > 0
    assert len(resume.certifications) > 0


def test_extract_resume_data_missing_fields_are_empty():
    resume = extract_resume_data("Just some random text with no structure.")
    assert resume.education == []
    assert resume.certifications == []
    assert resume.email == ""


def test_invalid_file_not_a_pdf():
    with pytest.raises(InvalidPDFError):
        extract_text_from_pdf(b"this is not a pdf file")


def test_empty_file():
    with pytest.raises(EmptyPDFError):
        extract_text_from_pdf(b"")
