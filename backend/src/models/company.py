from sqlalchemy import Column, String, Integer, ForeignKey, JSON, Enum as SQLEnum, Boolean
from sqlalchemy.orm import relationship
from src.models.base import BaseModel
import enum


class ChannelType(str, enum.Enum):
    TELEGRAM = "telegram"
    AVITO = "avito"
    WHATSAPP = "whatsapp"
    INSTAGRAM = "instagram"
    VK = "vk"
    WIDGET = "widget"



class ChannelStatus(str, enum.Enum):
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    ERROR = "error"


class Company(BaseModel):
    __tablename__ = "companies"

    name = Column(String, nullable=True)
    website = Column(String, nullable=True)
    description = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    address = Column(String, nullable=True)
    business_hours = Column(JSON, nullable=True)  # { "mon": "9-18", ... }
    
    # Relationships
    channels = relationship("CompanyChannel", back_populates="company", cascade="all, delete-orphan")


class CompanyChannel(BaseModel):
    __tablename__ = "company_channels"

    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    type = Column(SQLEnum(ChannelType), nullable=False)
    name = Column(String, nullable=False)  # e.g. "My Telegram Bot"
    status = Column(SQLEnum(ChannelStatus), default=ChannelStatus.DISCONNECTED)
    config = Column(JSON, nullable=True)  # API tokens, etc. (encrypted in real app)
    
    company = relationship("Company", back_populates="channels")
