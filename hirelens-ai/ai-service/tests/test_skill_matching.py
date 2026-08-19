from app.utils.text_processing import normalize_skill, normalize_skill_set
from app.services.resume_analyzer import compute_skill_score


def test_react_variants_normalize_the_same():
    assert normalize_skill("React.js") == normalize_skill("ReactJS") == normalize_skill("react")


def test_node_variants_normalize_the_same():
    assert normalize_skill("Node.js") == normalize_skill("NodeJS") == normalize_skill("node")


def test_100_percent_match():
    resume = normalize_skill_set(["React", "Node.js", "MongoDB"])
    required = normalize_skill_set(["React", "Node", "MongoDB"])
    score, matched, missing = compute_skill_score(resume, required)
    assert score == 100
    assert missing == []


def test_0_percent_match():
    resume = normalize_skill_set(["Photoshop", "Illustrator"])
    required = normalize_skill_set(["React", "Node", "MongoDB"])
    score, matched, missing = compute_skill_score(resume, required)
    assert score == 0
    assert len(missing) == 3


def test_partial_match():
    resume = normalize_skill_set(["React", "Node.js"])
    required = normalize_skill_set(["React", "Node", "MongoDB", "AWS"])
    score, matched, missing = compute_skill_score(resume, required)
    assert score == 50
    assert "AWS" in missing
    assert "MongoDB" in missing


def test_missing_skills_detected():
    resume = normalize_skill_set(["React"])
    required = normalize_skill_set(["React", "AWS", "Docker"])
    _, _, missing = compute_skill_score(resume, required)
    assert set(missing) == {"AWS", "Docker"}
