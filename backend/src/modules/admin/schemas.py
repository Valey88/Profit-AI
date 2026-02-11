from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from src.modules.auth.schemas import UserResponse

class AdminUserResponse(UserResponse):
    is_online: bool
    created_at: datetime
    # Add subscription info if needed, or separate field

class UserListResponse(BaseModel):
    users: List[AdminUserResponse]
    total: int
