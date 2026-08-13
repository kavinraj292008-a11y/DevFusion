from app.schemas.resume import ParsedResume
from app.services.interview_generator import generate_interview_questions

JOB_DESCRIPTION = "Full Stack Developer needed with React, Node, MongoDB, AWS, Docker."


def test_all_question_categories_present():
    resume = ParsedResume(
        skills=["React", "Node", "MongoDB"],
        experience=["Built a React + Node app"],
        projects=["E-commerce site using React and MongoDB"],
    )
    result = generate_interview_questions(JOB_DESCRIPTION, resume, skill_gaps=["AWS", "Docker"])

    assert len(result["technicalQuestions"]) > 0
    assert len(result["candidateSpecificQuestions"]) > 0
    assert len(result["skillGapQuestions"]) > 0


def test_skill_gap_questions_reference_the_gaps():
    resume = ParsedResume(skills=["React"], experience=[], projects=[])
    result = generate_interview_questions(JOB_DESCRIPTION, resume, skill_gaps=["Kubernetes"])
    joined = " ".join(result["skillGapQuestions"])
    assert "Kubernetes" in joined
