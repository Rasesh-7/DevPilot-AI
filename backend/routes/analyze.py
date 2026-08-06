from fastapi import APIRouter
from models.request_models import AnalyzeRequest
router = APIRouter()
@router.post("/analyze")
def analyze(request: AnalyzeRequest):
    return {
        "message": "Repository received successfully",
        "github_url": request.github_url
    }