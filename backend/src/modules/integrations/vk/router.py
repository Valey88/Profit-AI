from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from src.database import get_db
from src.modules.integrations.vk.schemas import VKEvent
from src.modules.integrations.vk.service import VKService

router = APIRouter(prefix="/integrations/vk", tags=["Integrations: VK"])

@router.post("/webhook")
async def vk_webhook(event: VKEvent, db: AsyncSession = Depends(get_db)):
    service = VKService(db)
    
    if event.type == "confirmation":
        # TODO: Retrieve actual confirmation code from DB using event.group_id
        # For now return a dummy or logged one
        return "c841e05d" # Example code
        
    await service.handle_event(event)
    return "ok"
