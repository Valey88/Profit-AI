from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from src.database import get_db
from .schemas import UserResponse, UserCreate, UserUpdate
from .service import UserService


router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=List[UserResponse])
async def get_users(db: AsyncSession = Depends(get_db)):
    """Get all team members."""
    service = UserService(db)
    return await service.get_all_users()


@router.post("/invite", response_model=UserResponse)
async def invite_user(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """Invite a new user."""
    service = UserService(db)
    try:
        return await service.invite_user(
            email=user_data.email,
            full_name=user_data.full_name,
            role=user_data.role
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update user details."""
    service = UserService(db)
    user = await service.update_user(user_id, user_data.model_dump(exclude_unset=True))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete a user."""
    service = UserService(db)
    result = await service.delete_user(user_id)
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": "success"}
