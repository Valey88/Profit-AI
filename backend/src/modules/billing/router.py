from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from src.database import get_db
from .schemas import PlanResponse, SubscriptionResponse, CreateSubscriptionRequest
from .service import BillingService


router = APIRouter(prefix="/billing", tags=["Billing"])


@router.get("/plans", response_model=List[PlanResponse])
async def get_plans(db: AsyncSession = Depends(get_db)):
    """Get all plans."""
    service = BillingService(db)
    return await service.get_plans()


@router.get("/subscription", response_model=SubscriptionResponse)
async def get_subscription(
    user_id: int = 1, # Mock user ID for now
    db: AsyncSession = Depends(get_db)
):
    """Get current user's subscription."""
    service = BillingService(db)
    sub = await service.get_subscription(user_id)
    if not sub:
        # Create default trial for new users (BUSINESS plan)
        plans = await service.get_plans()
        business_plan = next((p for p in plans if p.type == "business"), plans[0])
        sub = await service.create_subscription(user_id, business_plan.id, is_yearly=False)
    return sub


@router.post("/subscription", response_model=SubscriptionResponse)
async def create_subscription(
    request: CreateSubscriptionRequest,
    user_id: int = 1, # Mock user ID
    db: AsyncSession = Depends(get_db)
):
    """Upgrade or change subscription."""
    service = BillingService(db)
    return await service.create_subscription(user_id, request.plan_id, request.is_yearly)


@router.delete("/subscription", response_model=SubscriptionResponse)
async def cancel_subscription(
    user_id: int = 1, # Mock user ID
    db: AsyncSession = Depends(get_db)
):
    """Cancel subscription renewal."""
    service = BillingService(db)
    sub = await service.cancel_subscription(user_id)
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return sub
