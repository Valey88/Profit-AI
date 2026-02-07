from sqlalchemy import Column, String, Text, JSON, Integer, ForeignKey
from sqlalchemy.orm import relationship
from src.models.base import BaseModel


class AgentConfig(BaseModel):
    __tablename__ = "agent_configs"

    name = Column(String, default="Анна")
    role = Column(String, default="Менеджер поддержки")
    tone = Column(String, default="Вежливый, профессиональный")
    system_prompt = Column(Text, nullable=True)
    skills = Column(JSON, default=dict)  # {"payments": true, "calendar": true, ...}
    
    knowledge_files = relationship("KnowledgeFile", back_populates="agent", cascade="all, delete-orphan")


class KnowledgeFile(BaseModel):
    __tablename__ = "knowledge_files"

    agent_id = Column(Integer, ForeignKey("agent_configs.id"))
    filename = Column(String)
    file_path = Column(String)
    file_size = Column(Integer)
    content = Column(Text, nullable=True)  # Extracted text content
    
    agent = relationship("AgentConfig", back_populates="knowledge_files")
