from app.schemas.analysis import CandidateInput
from app.schemas.resume import ParsedResume
from app.services.ranking_engine import rank_candidates

JOB_DESCRIPTION = "Looking for a Full Stack Developer with React, Node, MongoDB, TypeScript, AWS, Docker."


def _candidate(id_, name, skills):
    return CandidateInput(id=id_, name=name, resume=ParsedResume(skills=skills, experience=["Built apps"]))


def test_ranking_is_descending_by_score():
    candidates = [
        _candidate("c1", "Arun Kumar", ["React", "Node", "MongoDB", "TypeScript", "AWS", "Docker"]),
        _candidate("c2", "Priya Sharma", ["React", "Node", "MongoDB", "TypeScript", "AWS"]),
        _candidate("c3", "Karthik", ["React", "Node", "MongoDB", "TypeScript"]),
        _candidate("c4", "Rahul", ["React"]),
    ]

    ranked = rank_candidates(JOB_DESCRIPTION, candidates)
    scores = [c.matchScore for c in ranked]

    assert scores == sorted(scores, reverse=True)
    assert ranked[0].name == "Arun Kumar"
    assert [c.rank for c in ranked] == [1, 2, 3, 4]
