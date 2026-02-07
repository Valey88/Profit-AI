from sqlalchemy import Column, String, Enum as SQLEnum, Boolean
from src.models.base import BaseModel
import enum


class UserRole(str, enum.Enum):
    OWNER = "owner"
    ADMIN = "admin"
    VIEWER = "viewer"


class UserStatus(str, enum.Enum):
    ACTIVE = "active"
    INVITED = "invited"
    DISABLED = "disabled"


class User(BaseModel):
    __tablename__ = "users"

    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=True)
    role = Column(SQLEnum(UserRole), default=UserRole.VIEWER)
    status = Column(SQLEnum(UserStatus), default=UserStatus.INVITED)
    avatar_url = Column(String, nullable=True)
    is_online = Column(Boolean, default=False)
