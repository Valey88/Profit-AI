from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from src.models.base import BaseModel
import enum
from datetime import datetime


class PlanType(str, enum.Enum):
    STARTER = "starter"
    BUSINESS = "business"
    ENTERPRISE = "enterprise"


class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "active"
    CANCELED = "canceled"
    PAST_DUE = "past_due"
    TRIAL = "trial"


class Plan(BaseModel):
    __tablename__ = "plans"

    name = Column(String, nullable=False)
    type = Column(SQLEnum(PlanType), unique=True, nullable=False)
    price_monthly = Column(Integer, nullable=False)
    price_yearly = Column(Integer, nullable=False)
    features = Column(String, nullable=False)  # JSON string or comma-separated


class Subscription(BaseModel):
    __tablename__ = "subscriptions"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("plans.id"), nullable=False)
    status = Column(SQLEnum(SubscriptionStatus), default=SubscriptionStatus.TRIAL)
    current_period_end = Column(DateTime, nullable=False)
    cancel_at_period_end = Column(Integer, default=0)  # Boolean 0/1

    # Relationships
    plan = relationship("Plan")
    user = relationship("src.models.user.User")
