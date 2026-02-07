from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime


class KnowledgeFileResponse(BaseModel):
    id: int
    filename: str
    file_size: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class AgentConfigBase(BaseModel):
    name: str
    role: str
    tone: str
    system_prompt: Optional[str] = None
    skills: Dict[str, bool] = {}


class AgentConfigCreate(BaseModel):
    """For updates - all fields are optional"""
    name: Optional[str] = None
    role: Optional[str] = None
    tone: Optional[str] = None
    system_prompt: Optional[str] = None
    skills: Optional[Dict[str, bool]] = None


class AgentConfigResponse(AgentConfigBase):
    id: int
    knowledge_files: List[KnowledgeFileResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

