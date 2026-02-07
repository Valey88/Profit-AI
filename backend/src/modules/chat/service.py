from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Optional

from src.models.chat import Chat, Message, MessageRole, ChatPlatform, ChatStatus, ChatClient


class ChatService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_or_create_chat(
        self,
        external_id: str,
        platform: str,
        client_name: str = "Unknown",
        item_name: Optional[str] = None
    ) -> Chat:
        """Get existing chat or create a new one with client."""
        result = await self.db.execute(
            select(Chat)
            .options(selectinload(Chat.client), selectinload(Chat.messages))
            .where(Chat.external_id == external_id)
        )
        chat = result.scalar_one_or_none()

        if not chat:
            chat = Chat(
                external_id=external_id,
                platform=ChatPlatform(platform),
                status=ChatStatus.AI,
                item_name=item_name
            )
            self.db.add(chat)
            await self.db.flush()
            
            # Create associated client
            client = ChatClient(
                chat_id=chat.id,
                name=client_name,
                history=[]
            )
            self.db.add(client)
            await self.db.commit()
            
            # Reload with all relationships
            result = await self.db.execute(
                select(Chat)
                .options(selectinload(Chat.client), selectinload(Chat.messages))
                .where(Chat.id == chat.id)
            )
            chat = result.scalar_one()

        return chat

    async def get_chat_by_id(self, chat_id: int) -> Optional[Chat]:
        """Get chat by ID with messages and client."""
        result = await self.db.execute(
            select(Chat)
            .options(
                selectinload(Chat.messages),
                selectinload(Chat.client)
            )
            .where(Chat.id == chat_id)
        )
        return result.scalar_one_or_none()

    async def get_all_chats(self) -> List[Chat]:
        """Get all chats with messages and client."""
        result = await self.db.execute(
            select(Chat)
            .options(
                selectinload(Chat.messages),
                selectinload(Chat.client)
            )
            .order_by(Chat.updated_at.desc())
        )
        return result.scalars().all()

    async def add_message(
        self,
        chat_id: int,
        role: str,
        content: str
    ) -> Message:
        """Add a message to a chat."""
        message = Message(
            chat_id=chat_id,
            role=MessageRole(role),
            content=content
        )
        self.db.add(message)
        await self.db.commit()
        await self.db.refresh(message)
        return message

    async def get_chat_history(
        self,
        chat_id: int,
        limit: int = 20
    ) -> List[dict]:
        """Get chat history as list of dicts for AI context."""
        result = await self.db.execute(
            select(Message)
            .where(Message.chat_id == chat_id)
            .order_by(Message.created_at.desc())
            .limit(limit)
        )
        messages = result.scalars().all()
        return [
            {"role": msg.role.value, "content": msg.content}
            for msg in reversed(messages)
        ]

    async def update_chat_status(
        self,
        chat_id: int,
        status: str
    ) -> Optional[Chat]:
        """Update chat AI/HUMAN/DONE status."""
        chat = await self.get_chat_by_id(chat_id)
        if chat:
            chat.status = ChatStatus(status)
            await self.db.commit()
            await self.db.refresh(chat)
        return chat

    async def update_client(
        self,
        chat_id: int,
        name: Optional[str] = None,
        phone: Optional[str] = None,
        email: Optional[str] = None,
        notes: Optional[str] = None
    ) -> Optional[ChatClient]:
        """Update client info for a chat."""
        result = await self.db.execute(
            select(ChatClient).where(ChatClient.chat_id == chat_id)
        )
        client = result.scalar_one_or_none()
        
        if client:
            if name is not None:
                client.name = name
            if phone is not None:
                client.phone = phone
            if email is not None:
                client.email = email
            if notes is not None:
                client.notes = notes
            await self.db.commit()
            await self.db.refresh(client)
        return client

    async def update_notes(
        self,
        chat_id: int,
        notes: str
    ) -> Optional[ChatClient]:
        """Update client notes for a chat."""
        return await self.update_client(chat_id, notes=notes)
