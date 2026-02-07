from sqlalchemy import Column, String, ForeignKey, Text, Enum as SQLEnum, Integer, JSON
from sqlalchemy.orm import relationship
from src.models.base import BaseModel
import enum


class MessageRole(str, enum.Enum):
    USER = "user"
    SYSTEM = "system"
    ASSISTANT = "assistant"
    MANAGER = "manager"  # Human agent


class ChatPlatform(str, enum.Enum):
    TELEGRAM = "telegram"
    AVITO = "avito"
    WEB = "web"
    WHATSAPP = "whatsapp"
    INSTAGRAM = "instagram"
    VK = "vk"


class ChatStatus(str, enum.Enum):
    AI = "AI"        # AI is handling this chat
    HUMAN = "HUMAN"  # Human operator is handling
    DONE = "DONE"    # Chat is closed/completed


class Chat(BaseModel):
    __tablename__ = "chats"

    external_id = Column(String, unique=True, index=True)  # ID from Telegram/Avito
    platform = Column(SQLEnum(ChatPlatform), index=True)
    status = Column(SQLEnum(ChatStatus), default=ChatStatus.AI)
    item_name = Column(String, nullable=True)  # For Avito: product name
    unread_count = Column(Integer, default=0)
    
    messages = relationship("Message", back_populates="chat", cascade="all, delete-orphan", order_by="Message.created_at")
    client = relationship("ChatClient", back_populates="chat", uselist=False, cascade="all, delete-orphan")


class Message(BaseModel):
    __tablename__ = "messages"

    chat_id = Column(Integer, ForeignKey("chats.id"))
    role = Column(SQLEnum(MessageRole))
    content = Column(Text)
    
    chat = relationship("Chat", back_populates="messages")


class ChatClient(BaseModel):
    """Client/contact info associated with a chat"""
    __tablename__ = "chat_clients"

    chat_id = Column(Integer, ForeignKey("chats.id"), unique=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    history = Column(JSON, default=list)  # List of past interactions
    
    chat = relationship("Chat", back_populates="client")
