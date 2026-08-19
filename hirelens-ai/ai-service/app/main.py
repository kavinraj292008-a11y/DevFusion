from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.routes import resume, analysis, ranking, interview, recommendation

app = FastAPI(
    title="HireLens AI - Resume Intelligence Service",
    description="Member 3's microservice: resume parsing, analysis, ranking, "
                 "interview intelligence, and job recommendations.",
    version="1.0.0",
)

# Dev-time CORS so Member 1's frontend and Member 2's backend can call this
# service directly while testing. Lock this down before deploying.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router)
app.include_router(analysis.router)
app.include_router(ranking.router)
app.include_router(interview.router)
app.include_router(recommendation.router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    # Keep error messages useful but generic — never leak internals or API keys.
    return JSONResponse(
        status_code=422,
        content={"success": False, "detail": "Invalid request body.", "errors": exc.errors()},
    )


@app.get("/health")
async def health():
    return {"status": "ok", "service": "ai"}
