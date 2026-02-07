from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from .schemas import CompanyResponse, CompanyUpdate, ChannelCreate, ChannelResponse
from .service import OnboardingService


router = APIRouter(prefix="/onboarding", tags=["Onboarding"])


@router.get("/company", response_model=CompanyResponse)
async def get_company(
    company_id: int = 1, # Mock ID
    db: AsyncSession = Depends(get_db)
):
    """Get company and channels info."""
    service = OnboardingService(db)
    return await service.get_company(company_id)


@router.put("/company", response_model=CompanyResponse)
async def update_company(
    update_data: CompanyUpdate,
    company_id: int = 1, # Mock ID
    db: AsyncSession = Depends(get_db)
):
    """Update company info."""
    service = OnboardingService(db)
    return await service.update_company(company_id, update_data.model_dump(exclude_unset=True))


@router.post("/channels", response_model=ChannelResponse)
async def connect_channel(
    channel_data: ChannelCreate,
    company_id: int = 1, # Mock ID
    db: AsyncSession = Depends(get_db)
):
    """
    Connect a channel.
    
    For Telegram: validates bot token and sets up webhook automatically.
    For Widget: saves configuration (color, position, etc.).
    """
    service = OnboardingService(db)
    try:
        return await service.connect_channel(
            company_id, 
            channel_data.type, 
            channel_data.config or {}
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/channels/{channel_id}")
async def disconnect_channel(
    channel_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Disconnect a channel."""
    service = OnboardingService(db)
    result = await service.disconnect_channel(channel_id)
    if not result:
        raise HTTPException(status_code=404, detail="Channel not found")
    return {"status": "success"}
