from fastapi import APIRouter, Depends
from .models import AIRequest, AIResponse
from .service import ai_service, AIEngineService

router = APIRouter(prefix="/ai", tags=["AI Engine"])

@router.post("/process", response_model=AIResponse)
async def process_message(
    request: AIRequest,
    service: AIEngineService = Depends(lambda: ai_service)
):
    """
    Process a user message through the AI Engine.
    Returns generated text, intent, and suggested actions.
    """
    return await service.process_message(request)

@router.get("/health")
async def ai_health():
    return {"status": "AI Engine Online", "model": "Mock-v1"}
