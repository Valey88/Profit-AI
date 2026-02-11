from fastapi import Depends, HTTPException, status
from src.modules.auth.deps import get_current_user
from src.models.user import User, UserRole

async def get_current_admin(user: User = Depends(get_current_user)) -> User:
    if user.role not in [UserRole.ADMIN, UserRole.OWNER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return user
