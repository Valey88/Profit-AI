from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class MessageCreate(BaseModel):
    content: str


class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class ClientCreate(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    notes: Optional[str] = None
    history: List[str] = []


class ClientResponse(BaseModel):
    id: int
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    notes: Optional[str] = None
    history: List[str] = []

    class Config:
        from_attributes = True


class ClientUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    notes: Optional[str] = None


class ChatCreate(BaseModel):
    external_id: str
    platform: str
    client_name: Optional[str] = "Unknown"
    item_name: Optional[str] = None


class ChatResponse(BaseModel):
    id: int
    external_id: str
    platform: str
    status: str
    item_name: Optional[str] = None
    unread_count: int = 0
    created_at: datetime
    updated_at: datetime
    messages: List[MessageResponse] = []
    client: Optional[ClientResponse] = None

    class Config:
        from_attributes = True


class ChatStatusUpdate(BaseModel):
    status: str  # AI, HUMAN, DONE


class SendMessageRequest(BaseModel):
    chat_id: int
    content: str
    context: Optional[dict] = None


class SendMessageResponse(BaseModel):
    user_message: MessageResponse
    ai_response: MessageResponse
    intent: str
    suggested_actions: List[str]


class NotesUpdate(BaseModel):
    notes: str
