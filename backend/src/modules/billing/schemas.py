from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class PlanResponse(BaseModel):
    id: int
    name: str
    type: str
    price_monthly: int
    price_yearly: int
    features: str

    class Config:
        from_attributes = True


class SubscriptionResponse(BaseModel):
    id: int
    user_id: int
    plan: PlanResponse
    status: str
    current_period_end: datetime
    cancel_at_period_end: bool

    class Config:
        from_attributes = True


class CreateSubscriptionRequest(BaseModel):
    plan_id: int
    is_yearly: bool
