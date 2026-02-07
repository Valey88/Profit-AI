from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

class MessageRole(str, Enum):
    USER = "user"
    SYSTEM = "system"
    ASSISTANT = "assistant"

class AIRequest(BaseModel):
    conversation_id: str
    text: str
    role: MessageRole = MessageRole.USER
    context: Optional[dict] = None

class AIResponse(BaseModel):
    text: str
    intent: Optional[str] = None
    confidence: float = 0.0
    suggested_actions: List[str] = []

class RAGDocument(BaseModel):
    title: str
    content: str
    metadata: Optional[dict] = None
