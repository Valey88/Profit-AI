from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from datetime import datetime, timedelta

from src.models.billing import Plan, Subscription, PlanType, SubscriptionStatus
from src.models.user import User


class BillingService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_plans(self) -> List[Plan]:
        """Get all available plans."""
        # Check if plans exist, if not create defaults (mocking seed data)
        result = await self.db.execute(select(Plan))
        plans = result.scalars().all()
        
        if not plans:
            plans = [
                Plan(
                    name="Starter",
                    type=PlanType.STARTER,
                    price_monthly=0,
                    price_yearly=0,
                    features="Basic AI, 100 messages/mo, Standard support"
                ),
                Plan(
                    name="Business",
                    type=PlanType.BUSINESS,
                    price_monthly=2900,
                    price_yearly=29000,
                    features="Advanced AI, Unlimited messages, Priority support, CRM integrations"
                ),
                Plan(
                    name="Enterprise",
                    type=PlanType.ENTERPRISE,
                    price_monthly=9900,
                    price_yearly=99000,
                    features="Custom AI training, Dedicated manager, SLA, Custom integrations"
                )
            ]
            self.db.add_all(plans)
            await self.db.commit()
            
            result = await self.db.execute(select(Plan))
            plans = result.scalars().all()
            
        return plans

    async def get_subscription(self, user_id: int) -> Optional[Subscription]:
        """Get user's current subscription."""
        result = await self.db.execute(
            select(Subscription)
            .where(Subscription.user_id == user_id)
            .join(Subscription.plan)
        )
        return result.scalar_one_or_none()

    async def create_subscription(self, user_id: int, plan_id: int, is_yearly: bool) -> Subscription:
        """Create or update a subscription."""
        # Check if user exists (mock check since we don't have full auth context yet)
        # In real app, we would strip payment here
        
        # Determine duration
        duration = timedelta(days=365 if is_yearly else 30)
        current_period_end = datetime.utcnow() + duration
        
        # Check for existing subscription
        existing_sub = await self.get_subscription(user_id)
        
        if existing_sub:
            existing_sub.plan_id = plan_id
            existing_sub.status = SubscriptionStatus.ACTIVE
            existing_sub.current_period_end = current_period_end
            existing_sub.cancel_at_period_end = 0
            await self.db.commit()
            await self.db.refresh(existing_sub)
            return existing_sub
        else:
            new_sub = Subscription(
                user_id=user_id,
                plan_id=plan_id,
                status=SubscriptionStatus.ACTIVE,
                current_period_end=current_period_end
            )
            self.db.add(new_sub)
            await self.db.commit()
            await self.db.refresh(new_sub)
            # Need to reload to get plan details relation loaded
            return await self.get_subscription(user_id)
            
    async def cancel_subscription(self, user_id: int) -> Optional[Subscription]:
        """Cancel subscription (at period end)."""
        sub = await self.get_subscription(user_id)
        if sub:
            sub.cancel_at_period_end = 1
            await self.db.commit()
            await self.db.refresh(sub)
        return sub
