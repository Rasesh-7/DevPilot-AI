from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.analyze import router as analyze_router
from routes.health import router as health_router
from routes.upload import router as upload_router

app = FastAPI(
    title="DevPilot AI Backend",
    version="1.0.0",
    description="AI-powered code review and repository analysis API",
)

# Configure CORS to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(analyze_router)
app.include_router(upload_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to DevPilot AI Backend",
        "version": "1.0.0",
        "docs": "/docs",
    }