from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from src.models.user import User, UserRole, UserStatus


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_users(self) -> List[User]:
        """Get all users."""
        result = await self.db.execute(select(User).order_by(User.id))
        return result.scalars().all()

    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    async def invite_user(self, email: str, full_name: str, role: str) -> User:
        """Invite a new user."""
        existing_user = await self.get_user_by_email(email)
        if existing_user:
            raise ValueError("User with this email already exists")

        user = User(
            email=email,
            full_name=full_name,
            role=UserRole(role),
            status=UserStatus.INVITED,
            avatar_url=f"https://api.dicebear.com/7.x/initials/svg?seed={full_name}"
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def update_user(self, user_id: int, updates: dict) -> Optional[User]:
        """Update user details."""
        user = await self.get_user_by_id(user_id)
        if not user:
            return None

        for key, value in updates.items():
            if value is not None and hasattr(user, key):
                if key == "role":
                    setattr(user, key, UserRole(value))
                elif key == "status":
                    setattr(user, key, UserStatus(value))
                else:
                    setattr(user, key, value)

        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def delete_user(self, user_id: int) -> bool:
        """Delete a user."""
        user = await self.get_user_by_id(user_id)
        if not user:
            return False
            
        await self.db.delete(user)
        await self.db.commit()
        return True
