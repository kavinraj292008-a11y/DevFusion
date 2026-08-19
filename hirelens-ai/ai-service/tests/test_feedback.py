from app.services.feedback_analyzer import analyze_feedback

NOTES = """Strong technical knowledge.
Good communication.
Weak AWS knowledge.
Good problem solving."""


def test_feedback_has_strengths_and_weaknesses():
    result = analyze_feedback(NOTES)
    assert "overallAssessment" in result
    assert len(result["strengths"]) > 0
    assert len(result["areasToImprove"]) > 0
    assert result["recommendation"] in ("Proceed to next round", "Hold", "Reject")


def test_feedback_recommendation_is_positive_when_mostly_strong():
    result = analyze_feedback(NOTES)
    assert result["recommendation"] == "Proceed to next round"
    assert result["overallAssessment"] == "Strong Candidate"
