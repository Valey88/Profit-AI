from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Optional, List, Dict, Any

from src.models.company import Company, CompanyChannel, ChannelType, ChannelStatus
from src.modules.integrations.telegram.service import validate_and_setup_telegram_bot


# TODO: Move to config
WEBHOOK_BASE_URL = "http://localhost:8001"  # Will be replaced with actual domain


class OnboardingService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_company(self, company_id: int = 1) -> Company:
        """Get company info (create default if not exists)."""
        # Use selectinload to eager load channels
        result = await self.db.execute(
            select(Company)
            .options(selectinload(Company.channels))
            .where(Company.id == company_id)
        )
        company = result.scalar_one_or_none()
        
        if not company:
            company = Company(id=company_id, name="My Company")
            self.db.add(company)
            await self.db.commit()
            # Refresh with eager loading
            result = await self.db.execute(
                select(Company)
                .options(selectinload(Company.channels))
                .where(Company.id == company_id)
            )
            company = result.scalar_one()
            
        return company

    async def update_company(self, company_id: int, updates: dict) -> Company:
        """Update company details."""
        company = await self.get_company(company_id)
        
        for key, value in updates.items():
            if hasattr(company, key):
                setattr(company, key, value)
                
        await self.db.commit()
        await self.db.refresh(company)
        return company

    async def connect_channel(
        self, 
        company_id: int, 
        channel_type: str, 
        config: dict
    ) -> Dict[str, Any]:
        """
        Connect a new channel with validation.
        
        For Telegram: validates token and sets up webhook.
        For Widget: just saves config (color, position, etc.).
        """
        
        # Special handling for Telegram
        if channel_type == "telegram":
            token = config.get("token")
            if not token:
                raise ValueError("Telegram bot token is required")
            
            # Validate token and setup webhook
            result = await validate_and_setup_telegram_bot(token, WEBHOOK_BASE_URL)
            
            if not result.get("success"):
                raise ValueError(result.get("error", "Failed to connect Telegram"))
            
            # Enrich config with bot info
            config["bot_id"] = result.get("bot_id")
            config["bot_username"] = result.get("bot_username")
            config["bot_name"] = result.get("bot_name")
        
        # Check if channel already exists
        try:
            channel_enum = ChannelType(channel_type)
        except ValueError:
            raise ValueError(f"Invalid channel type: {channel_type}")
            
        result = await self.db.execute(
            select(CompanyChannel)
            .where(CompanyChannel.company_id == company_id)
            .where(CompanyChannel.type == channel_enum)
        )
        channel = result.scalar_one_or_none()
        
        if channel:
            # Update existing
            channel.status = ChannelStatus.CONNECTED
            channel.config = config
            if channel_type == "telegram" and config.get("bot_name"):
                channel.name = f"@{config.get('bot_username', 'Bot')}"
        else:
            # Create new
            name = config.get("name", f"{channel_type.capitalize()} channel")
            if channel_type == "telegram" and config.get("bot_username"):
                name = f"@{config['bot_username']}"
            
            channel = CompanyChannel(
                company_id=company_id,
                type=channel_enum,
                name=name,
                status=ChannelStatus.CONNECTED,
                config=config
            )
            self.db.add(channel)
            
        await self.db.commit()
        await self.db.refresh(channel)
        return channel
        
    async def disconnect_channel(self, channel_id: int) -> bool:
        """Disconnect a channel."""
        result = await self.db.execute(
            select(CompanyChannel).where(CompanyChannel.id == channel_id)
        )
        channel = result.scalar_one_or_none()
        if channel:
            # TODO: For Telegram, call deleteWebhook
            await self.db.delete(channel)
            await self.db.commit()
            return True
        return False

