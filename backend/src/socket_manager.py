import socketio
from src.database import AsyncSessionLocal
from src.modules.chat.service import ChatService
from src.modules.ai_engine.service import ai_service
from src.modules.ai_engine.models import AIRequest

# Initialize Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*'
)

@sio.event
async def connect(sid, environ):
    print(f"Socket connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Socket disconnected: {sid}")

@sio.event
async def join_chat(sid, chat_id):
    """Join a specific chat room."""
    chat_id = str(chat_id)
    await sio.enter_room(sid, chat_id)
    print(f"Socket {sid} joined room {chat_id}")
    await sio.emit('status', {'msg': f'Joined chat {chat_id}'}, to=sid)

@sio.event
async def send_message(sid, data):
    """
    Handle incoming message from widget.
    data: {chat_id: int, content: str}
    """
    chat_id = data.get('chat_id')
    content = data.get('content')
    
    if not chat_id or not content:
        return

    from src.models.chat import ChatStatus

    async with AsyncSessionLocal() as db:
        service = ChatService(db)
        
        # Check chat status first
        chat = await service.get_chat_by_id(chat_id)
        if not chat:
            return

        # 1. Save User Message
        user_message = await service.add_message(
            chat_id=chat_id,
            role="user",
            content=content
        )
        
        # Emit back to room (so other clients see it)
        await sio.emit('new_message', {
            'id': user_message.id,
            'role': 'user',
            'content': user_message.content,
            'created_at': user_message.created_at.isoformat()
        }, room=str(chat_id))

        # If HUMAN mode, agent is paused
        if chat.status == ChatStatus.HUMAN:
            return

        # Emit typing indicator
        await sio.emit('typing_start', {}, room=str(chat_id))

        # 2. Get AI Response
        chat_history = await service.get_chat_history(chat_id)
        
        ai_request = AIRequest(
            conversation_id=str(chat_id),
            text=content
        )
        
        ai_response = await ai_service.process_message(ai_request, chat_history, db=db)
        
        # 3. Save AI Message
        ai_message = await service.add_message(
            chat_id=chat_id,
            role="assistant",
            content=ai_response.text
        )
        
        # 4. Emit AI Response
        await sio.emit('new_message', {
            'id': ai_message.id,
            'role': 'assistant',
            'content': ai_message.content,
            'created_at': ai_message.created_at.isoformat()
        }, room=str(chat_id))
