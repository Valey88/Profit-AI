from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Tuple
from src.models.user import User

class AdminService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_users(self, skip: int = 0, limit: int = 100) -> Tuple[List[User], int]:
        # Get total count
        count_result = await self.db.execute(select(func.count(User.id)))
        total = count_result.scalar_one()

        # Get users
        result = await self.db.execute(
            select(User).offset(skip).limit(limit).order_by(User.id.desc())
        )
        users = result.scalars().all()
        
        return users, total
