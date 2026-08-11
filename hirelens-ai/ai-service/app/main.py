from fastapi import FastAPI
app = FastAPI(title="HireLens AI Service")

@app.get("/health")
def health():
    return {"ok": True, "service": "hirelens-ai"}
