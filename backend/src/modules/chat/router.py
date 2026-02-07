from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from src.database import get_db
from src.modules.ai_engine.service import ai_service
from src.modules.ai_engine.models import AIRequest
from .schemas import (
    ChatCreate,
    ChatResponse,
    ChatStatusUpdate,
    ClientResponse,
    ClientUpdate,
    MessageCreate,
    MessageResponse,
    NotesUpdate,
    SendMessageRequest,
    SendMessageResponse
)
from .service import ChatService


router = APIRouter(prefix="/chats", tags=["Chats"])


@router.get("/", response_model=List[ChatResponse])
async def get_all_chats(db: AsyncSession = Depends(get_db)):
    """Get all chats with messages and client info."""
    service = ChatService(db)
    chats = await service.get_all_chats()
    return chats


@router.post("/", response_model=ChatResponse)
async def create_chat(
    chat_data: ChatCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create or get an existing chat."""
    service = ChatService(db)
    chat = await service.get_or_create_chat(
        external_id=chat_data.external_id,
        platform=chat_data.platform,
        client_name=chat_data.client_name or "Unknown",
        item_name=chat_data.item_name
    )
    return chat


@router.get("/{chat_id}", response_model=ChatResponse)
async def get_chat(chat_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific chat with messages and client."""
    service = ChatService(db)
    chat = await service.get_chat_by_id(chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat


@router.put("/{chat_id}/status", response_model=ChatResponse)
async def update_chat_status(
    chat_id: int,
    status_update: ChatStatusUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Toggle chat status between AI/HUMAN/DONE."""
    service = ChatService(db)
    chat = await service.update_chat_status(chat_id, status_update.status)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
        
    # Notify via Socket.IO
    from src.socket_manager import sio
    from src.models.chat import ChatStatus, MessageRole
    
    system_msg = ""
    if status_update.status == ChatStatus.HUMAN:
        system_msg = "Менеджер подключился к диалогу. AI приостановлен."
    elif status_update.status == ChatStatus.AI:
        system_msg = "AI-ассистент снова активен."
    elif status_update.status == ChatStatus.DONE:
        system_msg = "Диалог завершен."
        
    if system_msg:
        # Create system message
        message = await service.add_message(
            chat_id=chat_id,
            role=MessageRole.MANAGER.value, # Use manager role for visibility in widget
            content=system_msg
        )
        
        # Emit
        await sio.emit('new_message', {
            'id': message.id,
            'role': 'manager',
            'content': message.content,
            'created_at': message.created_at.isoformat()
        }, room=str(chat_id))

    return chat


@router.put("/{chat_id}/client", response_model=ClientResponse)
async def update_client(
    chat_id: int,
    client_update: ClientUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update client information for a chat."""
    service = ChatService(db)
    client = await service.update_client(
        chat_id=chat_id,
        name=client_update.name,
        phone=client_update.phone,
        email=client_update.email,
        notes=client_update.notes
    )
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


@router.put("/{chat_id}/notes", response_model=ClientResponse)
async def update_notes(
    chat_id: int,
    notes_update: NotesUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update notes for a chat's client."""
    service = ChatService(db)
    client = await service.update_notes(chat_id, notes_update.notes)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


@router.post("/send", response_model=SendMessageResponse)
async def send_message(
    request: SendMessageRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Send a message to a chat and get AI response.
    This is the main endpoint for the unified inbox.
    """
    service = ChatService(db)
    
    # Validate chat exists
    chat = await service.get_chat_by_id(request.chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    # Save user message
    user_message = await service.add_message(
        chat_id=request.chat_id,
        role="user",
        content=request.content
    )

    # Get chat history for context
    chat_history = await service.get_chat_history(request.chat_id)

    # Process with AI
    ai_request = AIRequest(
        conversation_id=str(request.chat_id),
        text=request.content,
        context=request.context
    )
    ai_response = await ai_service.process_message(ai_request, chat_history, db=db)

    # Save AI response
    ai_message = await service.add_message(
        chat_id=request.chat_id,
        role="assistant",
        content=ai_response.text
    )

    return SendMessageResponse(
        user_message=MessageResponse(
            id=user_message.id,
            role=user_message.role.value,
            content=user_message.content,
            created_at=user_message.created_at
        ),
        ai_response=MessageResponse(
            id=ai_message.id,
            role=ai_message.role.value,
            content=ai_message.content,
            created_at=ai_message.created_at
        ),
        intent=ai_response.intent,
        suggested_actions=ai_response.suggested_actions
    )


@router.post("/{chat_id}/messages", response_model=MessageResponse)
async def add_message_to_chat(
    chat_id: int,
    message: MessageCreate,
    db: AsyncSession = Depends(get_db)
):
    """Add a message to a chat (Manager sending). Auto-switches to HUMAN mode."""
    service = ChatService(db)
    chat = await service.get_chat_by_id(chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    from src.models.chat import MessageRole, ChatStatus
    from src.socket_manager import sio
    
    # 1. Update status to HUMAN (Manager takeover)
    await service.update_chat_status(chat_id, ChatStatus.HUMAN)

    # 2. Add message with MANAGER role
    new_message = await service.add_message(
        chat_id=chat_id,
        role=MessageRole.MANAGER.value,
        content=message.content
    )
    
    # 3. Emit real-time event
    await sio.emit('new_message', {
        'id': new_message.id,
        'role': 'manager',
        'content': new_message.content,
        'created_at': new_message.created_at.isoformat()
    }, room=str(chat_id))

    return MessageResponse(
        id=new_message.id,
        role=new_message.role.value,
        content=new_message.content,
        created_at=new_message.created_at
    )
