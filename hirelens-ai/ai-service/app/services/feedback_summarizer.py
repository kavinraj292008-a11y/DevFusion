from app.services.llm_client import ask_json


def summarize_feedback(interviewer_notes: str) -> dict:
    result = ask_json(
        system_prompt=(
            "You summarize raw interviewer notes into structured hiring feedback. "
            'Respond ONLY with JSON: {"overall_assessment": "...", "strengths": [...], '
            '"areas_to_improve": [...], "recommendation": "..."}. '
            "recommendation must be one of: 'Proceed to next round', 'Hold', 'Reject'."
        ),
        user_prompt=f"INTERVIEWER NOTES:\n{interviewer_notes}",
    )
    if result:
        return result

    # Rule-based fallback: split notes into positive vs negative lines by simple keywords.
    positive_kw = ["strong", "good", "excellent", "great"]
    negative_kw = ["weak", "poor", "limited", "lacking"]

    strengths, weaknesses = [], []
    for line in [l.strip() for l in interviewer_notes.splitlines() if l.strip()]:
        lower = line.lower()
        if any(k in lower for k in negative_kw):
            weaknesses.append(line)
        elif any(k in lower for k in positive_kw):
            strengths.append(line)

    if len(strengths) >= len(weaknesses):
        assessment, recommendation = "Strong Candidate", "Proceed to next round"
    else:
        assessment, recommendation = "Needs Improvement", "Hold"

    return {
        "overall_assessment": assessment,
        "strengths": strengths or ["No specific strengths noted"],
        "areas_to_improve": weaknesses or ["No specific concerns noted"],
        "recommendation": recommendation,
    }
