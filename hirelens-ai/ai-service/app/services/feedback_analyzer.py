"""Turns raw interviewer notes into a structured assessment (section 12).

Rule: never fabricate interviewer observations that weren't in the notes.
"""

from app.utils.llm_client import ask_json

POSITIVE_KEYWORDS = ["strong", "good", "excellent", "great", "solid", "confident"]
NEGATIVE_KEYWORDS = ["weak", "poor", "limited", "lacking", "struggled", "unclear"]


def _fallback_feedback(notes: str) -> dict:
    strengths, weaknesses = [], []
    for line in [l.strip() for l in notes.splitlines() if l.strip()]:
        lower = line.lower()
        if any(k in lower for k in NEGATIVE_KEYWORDS):
            weaknesses.append(line.rstrip("."))
        elif any(k in lower for k in POSITIVE_KEYWORDS):
            strengths.append(line.rstrip("."))

    if len(strengths) >= len(weaknesses) and strengths:
        assessment, recommendation = "Strong Candidate", "Proceed to next round"
    elif weaknesses and not strengths:
        assessment, recommendation = "Needs Improvement", "Hold"
    else:
        assessment, recommendation = "Mixed Signals", "Hold"

    return {
        "overallAssessment": assessment,
        "strengths": strengths or ["No specific strengths noted in feedback"],
        "areasToImprove": weaknesses or ["No specific concerns noted in feedback"],
        "recommendation": recommendation,
    }


def analyze_feedback(feedback_notes: str) -> dict:
    result = ask_json(
        system_prompt=(
            "You summarize raw interviewer notes into structured hiring feedback. "
            "Use ONLY what the interviewer actually wrote — never invent observations "
            "that weren't stated. "
            'Respond ONLY with JSON: {"overallAssessment": "...", "strengths": [...], '
            '"areasToImprove": [...], "recommendation": "..."}. '
            "recommendation must be exactly one of: 'Proceed to next round', 'Hold', 'Reject'."
        ),
        user_prompt=f"INTERVIEWER NOTES:\n{feedback_notes}",
    )
    required_keys = ("overallAssessment", "strengths", "areasToImprove", "recommendation")
    if result and all(k in result for k in required_keys):
        return result

    return _fallback_feedback(feedback_notes)
