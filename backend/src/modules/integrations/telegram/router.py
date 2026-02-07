"""
Telegram Webhook Router

Handles incoming messages from Telegram and routes them to AI engine.
"""
from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import json

from src.database import get_db
from src.modules.chat.service import ChatService


router = APIRouter(prefix="/integrations/telegram", tags=["Telegram Integration"])


@router.post("/webhook")
async def telegram_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Receive incoming updates from Telegram.
    
    Telegram sends updates in this format:
    {
        "update_id": 123,
        "message": {
            "message_id": 456,
            "from": {"id": 789, "first_name": "User", ...},
            "chat": {"id": 789, "type": "private", ...},
            "text": "Hello!"
        }
    }
    """
    try:
        body = await request.json()
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON")
    
    # Extract message info
    message = body.get("message")
    if not message:
        # Could be callback_query, edited_message, etc. - handle later
        return {"ok": True}
    
    chat_id = message.get("chat", {}).get("id")
    text = message.get("text", "")
    user = message.get("from", {})
    user_name = user.get("first_name", "User")
    
    if not chat_id or not text:
        return {"ok": True}  # Skip non-text messages for now
    
    # TODO: Process message through AI engine
    # For now, just log it
    print(f"[Telegram] Message from {user_name} (chat {chat_id}): {text}")
    
    # TODO: 
    # 1. Find or create chat in our DB
    # 2. Add message to chat history
    # 3. Get AI response
    # 4. Send response back via Telegram API
    
    return {"ok": True}


@router.get("/health")
async def telegram_health():
    """Health check for Telegram integration."""
    return {"status": "ok", "service": "telegram-integration"}
