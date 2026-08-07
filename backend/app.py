from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.analyze import router as analyze_router
from routes.health import router as health_router
from routes.upload import router as upload_router

from utils.helpers import get_env

app = FastAPI(
    title="DevPilot AI Backend",
    version="1.0.0",
    description="AI-powered code review and repository analysis API",
)

# Configure CORS to allow frontend communication securely
origins_env = get_env("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allowed_origins = [origin.strip() for origin in origins_env.split(",") if origin.strip()]

# Starlette CORSMiddleware requires explicit origins when allow_credentials is True
allow_credentials = True
if "*" in allowed_origins:
    allow_credentials = False

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=allow_credentials,
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