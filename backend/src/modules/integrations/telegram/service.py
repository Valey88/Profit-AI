"""
Telegram Bot Integration Service

Handles:
- Token validation via Telegram API
- Webhook registration
- Incoming message processing
"""
import httpx
from typing import Optional, Dict, Any
from pydantic import BaseModel


class TelegramBotInfo(BaseModel):
    """Response from Telegram getMe API."""
    id: int
    is_bot: bool
    first_name: str
    username: Optional[str] = None
    can_join_groups: bool = True
    can_read_all_group_messages: bool = False
    supports_inline_queries: bool = False


class TelegramService:
    """Service for interacting with Telegram Bot API."""
    
    BASE_URL = "https://api.telegram.org/bot"
    
    def __init__(self, token: str):
        self.token = token
        self.base = f"{self.BASE_URL}{token}"
    
    async def validate_token(self) -> Optional[TelegramBotInfo]:
        """
        Validate bot token by calling getMe.
        Returns bot info if valid, None if invalid.
        """
        async with httpx.AsyncClient() as client:
            try:
                url = f"{self.base}/getMe"
                print(f"[TelegramService] Validating token at: {url[:50]}...")
                response = await client.get(url, timeout=10.0)
                data = response.json()
                print(f"[TelegramService] Response status: {response.status_code}, ok: {data.get('ok')}")
                
                if data.get("ok") and data.get("result"):
                    bot_info = TelegramBotInfo(**data["result"])
                    print(f"[TelegramService] Bot validated: @{bot_info.username}")
                    return bot_info
                    
                print(f"[TelegramService] Invalid response: {data}")
                return None
            except Exception as e:
                print(f"[TelegramService] API error: {type(e).__name__}: {e}")
                return None
    
    async def set_webhook(self, webhook_url: str) -> bool:
        """
        Set webhook URL for incoming updates.
        Returns True on success.
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base}/setWebhook",
                    json={"url": webhook_url},
                    timeout=10.0
                )
                data = response.json()
                return data.get("ok", False)
            except Exception as e:
                print(f"Set webhook error: {e}")
                return False
    
    async def delete_webhook(self) -> bool:
        """Remove webhook (for cleanup/disconnect)."""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base}/deleteWebhook",
                    timeout=10.0
                )
                data = response.json()
                return data.get("ok", False)
            except Exception as e:
                print(f"Delete webhook error: {e}")
                return False
    
    async def send_message(self, chat_id: int, text: str, **kwargs) -> bool:
        """Send a text message to a chat."""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base}/sendMessage",
                    json={"chat_id": chat_id, "text": text, **kwargs},
                    timeout=10.0
                )
                data = response.json()
                return data.get("ok", False)
            except Exception as e:
                print(f"Send message error: {e}")
                return False


async def validate_and_setup_telegram_bot(
    token: str,
    webhook_base_url: str
) -> Dict[str, Any]:
    """
    Complete flow: validate token -> set webhook.
    
    Args:
        token: Telegram bot token
        webhook_base_url: Base URL of our backend (e.g., https://api.profitflow.ai)
    
    Returns:
        Dict with success status and bot info or error message
    """
    service = TelegramService(token)
    
    # Step 1: Validate token
    bot_info = await service.validate_token()
    if not bot_info:
        return {
            "success": False,
            "error": "Invalid bot token. Please check and try again."
        }
    
    # Step 2: Set webhook (skip for localhost - Telegram can't reach it)
    if "localhost" in webhook_base_url or "127.0.0.1" in webhook_base_url:
        print(f"[TelegramService] Skipping webhook for localhost. Bot: @{bot_info.username}")
    else:
        webhook_url = f"{webhook_base_url}/integrations/telegram/webhook"
        webhook_set = await service.set_webhook(webhook_url)
        
        if not webhook_set:
            return {
                "success": False,
                "error": "Failed to set webhook. Please try again."
            }
    
    return {
        "success": True,
        "bot_id": bot_info.id,
        "bot_username": bot_info.username,
        "bot_name": bot_info.first_name
    }
