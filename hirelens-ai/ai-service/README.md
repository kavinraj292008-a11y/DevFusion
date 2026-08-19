# HireLens AI — AI + Resume Intelligence Service (Member 3)

Standalone FastAPI microservice covering everything under **AI + Resume Intelligence +
Candidate Ranking + Interview Intelligence**. It does not handle auth, the database, or
any UI — that's Member 2 (Node/Express/MongoDB) and Member 1 (React) respectively.

## Why this is more than a normal ATS

- **Deterministic, explainable scoring** — the match score is never left to an LLM's
  whim. It's a fixed weighted formula (see below), so the same inputs always produce
  the same score, and every score comes with a skills/experience/education/projects
  breakdown a recruiter can actually audit.
- **Skill normalization** — "React.js", "ReactJS", and "react" are all recognized as
  the same skill, so match scores aren't wrong just because of formatting differences.
- **Offline-safe** — every LLM-backed feature (question generation, feedback summary,
  qualitative strengths/weaknesses) has a rule-based fallback, so a demo never breaks
  because of a missing API key or a flaky network on stage.
- **No fabrication** — the resume parser never invents fields, and prompts explicitly
  instruct the LLM to use only the facts it's given.

## Fairness (important — read before demoing)

This system does **not** use gender, religion, caste, race, ethnicity, age, disability,
marital status, political affiliation, photographs, or any other protected/sensitive
attribute anywhere in scoring or ranking. The data schemas (`ParsedResume`,
`CandidateInput`) don't even have fields for these — there's nothing sensitive to
accidentally weight. Ranking depends only on **skills, experience, education, and
projects**, matched directly against job requirements.

## Score breakdown (explainability)

Every `/analyze-resume` response includes a `scoreBreakdown` so recruiters can see
*why* a candidate got their score, not just the final number:

```
Match Score: 91%

Score Breakdown:
  Skills       95%
  Experience   90%
  Education    85%
  Projects     92%

Weighted formula:
  finalScore = skills*0.60 + experience*0.20 + education*0.10 + projects*0.10
```

## Folder structure

```
ai/
├── app/
│   ├── main.py                    # FastAPI app, routers, error handlers, /health
│   ├── routes/                    # HTTP layer only — validation + calling services
│   │   ├── resume.py              # POST /api/ai/parse-resume
│   │   ├── analysis.py            # POST /api/ai/analyze-resume
│   │   ├── ranking.py             # POST /api/ai/rank-candidates
│   │   ├── interview.py           # POST /api/ai/generate-interview, /interview-feedback
│   │   └── recommendation.py      # POST /api/ai/recommend-jobs
│   ├── services/                  # All business logic lives here
│   │   ├── pdf_parser.py          # PDF -> raw text, validates file
│   │   ├── resume_extractor.py    # raw text -> structured ParsedResume
│   │   ├── resume_analyzer.py     # deterministic scoring engine
│   │   ├── ranking_engine.py      # sorts candidates by score
│   │   ├── interview_generator.py # technical / candidate-specific / skill-gap Qs
│   │   ├── feedback_analyzer.py   # interviewer notes -> structured summary
│   │   └── job_recommender.py     # resume -> ranked job matches
│   ├── schemas/                   # Pydantic request/response models
│   │   ├── resume.py
│   │   ├── analysis.py
│   │   └── interview.py
│   └── utils/
│       ├── text_processing.py     # clean_text, skill normalization/aliasing
│       ├── llm_client.py          # OpenAI wrapper with offline fallback
│       ├── exceptions.py          # InvalidPDFError, EmptyPDFError
│       └── skills_db.json         # known-skills dictionary
├── tests/                         # pytest suite, see "Testing" below
├── uploads/                       # scratch space for uploaded PDFs (gitignored)
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

## Setup

```bash
cd ai
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # add OPENAI_API_KEY if you want LLM-backed
                                 # phrasing — everything works without it too
uvicorn app.main:app --reload --port 8000
```

Visit `http://localhost:8000/docs` for interactive Swagger UI.

## API Reference

### `POST /api/ai/parse-resume`
Multipart file upload (`file`, PDF only).

**Response:**
```json
{
  "success": true,
  "resume": {
    "name": "Arun Kumar",
    "email": "arun@gmail.com",
    "phone": "9876543210",
    "education": ["B.Tech Computer Science, 2024"],
    "skills": ["MongoDB", "React", "TypeScript"],
    "experience": ["Software Engineer Intern - built React dashboards"],
    "projects": ["E-commerce platform using React and MongoDB"],
    "certifications": ["AWS Certified Cloud Practitioner"]
  }
}
```

### `POST /api/ai/analyze-resume`
```json
{
  "jobDescription": "Looking for a Full Stack Developer with React, Node, MongoDB, TypeScript, AWS, Docker.",
  "resume": {
    "skills": ["React", "Node", "MongoDB", "TypeScript"],
    "experience": ["Built full-stack apps using React and Node with MongoDB"],
    "projects": ["E-commerce platform using React, Node and MongoDB"],
    "education": ["B.Tech Computer Science"]
  }
}
```
**Response:**
```json
{
  "matchScore": 68,
  "scoreBreakdown": { "skills": 67, "experience": 65, "education": 80, "projects": 70 },
  "matchedSkills": ["MongoDB", "Node", "React", "TypeScript"],
  "missingSkills": ["AWS", "Docker"],
  "strengths": ["Strong alignment on MongoDB, Node, React, TypeScript", "Project work demonstrates the required skill set"],
  "weaknesses": ["Limited or no experience in AWS, Docker"],
  "recommendation": "REVIEW"
}
```

### `POST /api/ai/rank-candidates`
```json
{
  "jobId": "job123",
  "jobDescription": "Full Stack Developer needed with React, Node, MongoDB, TypeScript, AWS, Docker.",
  "candidates": [
    { "id": "c1", "name": "Arun Kumar", "resume": { "skills": ["React", "Node", "MongoDB", "TypeScript", "AWS", "Docker"] } },
    { "id": "c2", "name": "Priya Sharma", "resume": { "skills": ["React", "Node", "MongoDB"] } }
  ]
}
```
**Response:**
```json
{
  "jobId": "job123",
  "candidates": [
    { "rank": 1, "id": "c1", "name": "Arun Kumar", "matchScore": 70 },
    { "rank": 2, "id": "c2", "name": "Priya Sharma", "matchScore": 38 }
  ]
}
```

### `POST /api/ai/generate-interview`
```json
{
  "jobDescription": "Full Stack Developer needed with React, Node, MongoDB, AWS, Docker.",
  "resume": { "skills": ["React", "Node"], "projects": ["Built an e-commerce app"] },
  "skillGaps": ["AWS", "Docker"]
}
```
**Response:**
```json
{
  "technicalQuestions": ["Explain your experience with React and how you've used it in production."],
  "candidateSpecificQuestions": ["Tell me more about this project: \"Built an e-commerce app\""],
  "skillGapQuestions": ["How familiar are you with AWS, and how would you approach ramping up quickly?"]
}
```

### `POST /api/ai/interview-feedback`
```json
{ "feedbackNotes": "Strong technical knowledge.\nGood communication.\nWeak AWS knowledge.\nGood problem solving." }
```
**Response:**
```json
{
  "overallAssessment": "Strong Candidate",
  "strengths": ["Strong technical knowledge", "Good communication", "Good problem solving"],
  "areasToImprove": ["Weak AWS knowledge"],
  "recommendation": "Proceed to next round"
}
```

### `POST /api/ai/recommend-jobs`
```json
{
  "resume": { "skills": ["React", "TypeScript", "CSS"] },
  "jobs": [
    { "jobId": "job01", "title": "Frontend Developer", "skills": ["React", "TypeScript", "CSS"] },
    { "jobId": "job02", "title": "Backend Developer", "skills": ["Node", "MongoDB", "AWS"] }
  ]
}
```
**Response:**
```json
{
  "recommendations": [
    { "jobId": "job01", "title": "Frontend Developer", "matchScore": 100 },
    { "jobId": "job02", "title": "Backend Developer", "matchScore": 0 }
  ]
}
```

### `GET /health`
```json
{ "status": "ok", "service": "ai" }
```

## Error handling

| Situation | Status | Response |
|---|---|---|
| Non-PDF file uploaded | 400 | `{"detail": "Only PDF files are supported."}` |
| PDF has no extractable text | 422 | `{"detail": "No extractable text found in this PDF..."}` |
| File isn't a real PDF | 400 | `{"detail": "The uploaded file is not a valid PDF."}` |
| Missing `jobDescription` | 400 | `{"detail": "jobDescription is required."}` |
| Empty `candidates` list | 400 | `{"detail": "candidates list cannot be empty."}` |
| Empty `jobs` list | 400 | `{"detail": "jobs list cannot be empty."}` |
| Malformed request body | 422 | `{"success": false, "detail": "Invalid request body.", "errors": [...]}` |
| OpenAI call fails / no API key | — | silently falls back to rule-based logic, never a 500 |

API keys are never included in responses or error messages.

## Testing

```bash
pytest tests/ -v
```

15 tests covering:
- **Resume parser** — valid text extraction, missing fields stay empty, invalid file, empty file
- **Skill matching** — React/ReactJS/react.js normalize identically, Node.js/NodeJS too,
  100% match, 0% match, partial match, missing-skills detection
- **Ranking** — descending order guaranteed for 4 candidates
- **Interview generation** — all three question categories present, skill-gap questions
  actually reference the given gaps
- **Feedback** — strengths/weaknesses/recommendation all populated, correct recommendation
  for mostly-positive notes

## Security

- Only `application/pdf` content-type accepted for uploads
- 10MB file size cap
- Magic-byte check (`%PDF`) before parsing, so malformed/malicious files fail fast
- No file execution — uploaded bytes only ever go through `pdfplumber`'s text extractor
- `.env` is gitignored; `.env.example` has placeholder values only
- Generic error messages — internals and API keys are never echoed back

## Integration with Member 2 (Node backend)

```
Node Backend  →  Python AI Service  →  AI result  →  Node Backend  →  MongoDB
```

The Node backend owns auth, users, jobs, candidates, applications, and the database.
This service only computes AI results — it never touches Mongo. Example call from Node:

```javascript
const axios = require("axios");
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

const { data } = await axios.post(`${AI_SERVICE_URL}/api/ai/analyze-resume`, {
  jobDescription: job.description,
  resume: candidate.parsedResume,
});
```

## Demo scenario (matches MASTER PROMPT section 23)

1. Upload **Arun Kumar's** resume (React, Node, MongoDB, TypeScript) against a
   **Full Stack Developer** job requiring React, Node, MongoDB, TypeScript, AWS, Docker.
2. `/analyze-resume` returns a match score with `missingSkills: ["AWS", "Docker"]`.
3. `/generate-interview` produces candidate-specific + skill-gap questions about AWS/Docker.
4. Interviewer submits notes: *"Strong technical knowledge. Good problem solving. Weak AWS knowledge."*
5. `/interview-feedback` returns `overallAssessment: "Strong Candidate"`,
   `areasToImprove: ["Weak AWS knowledge"]`, `recommendation: "Proceed to next round"`.

*(Actual match-score numbers will differ slightly from the illustrative example in the
spec, since real scores follow the fully-weighted formula rather than a rounded example.)*
