from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Optional

from src.models.agent import AgentConfig, KnowledgeFile


class AgentService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_config(self) -> AgentConfig:
        """Get the single agent config or create default."""
        result = await self.db.execute(
            select(AgentConfig).options(selectinload(AgentConfig.knowledge_files))
        )
        config = result.scalar_one_or_none()
        
        if not config:
            config = AgentConfig(
                name="Анна",
                role="Менеджер поддержки",
                tone="Вежливый, профессиональный",
                system_prompt="Ты — Анна, менеджер поддержки. Твоя цель — помогать клиентам.",
                skills={
                    "payments": True,
                    "calendar": True,
                    "voiceToText": True
                }
            )
            self.db.add(config)
            await self.db.commit()
            await self.db.refresh(config)
            
        return config

    async def update_config(self, config_data: dict) -> AgentConfig:
        """Update agent configuration."""
        config = await self.get_config()
        
        # Only update fields that are not None
        for key, value in config_data.items():
            if value is not None and hasattr(config, key):
                setattr(config, key, value)
                
        await self.db.commit()
        
        # Reload with eager loading for knowledge_files
        result = await self.db.execute(
            select(AgentConfig)
            .options(selectinload(AgentConfig.knowledge_files))
            .where(AgentConfig.id == config.id)
        )
        return result.scalar_one()

    async def add_knowledge_file(self, filename: str, content: bytes) -> KnowledgeFile:
        """Add a knowledge base file and extract its content."""
        config = await self.get_config()
        
        extracted_text = ""
        
        # Extract text if PDF
        if filename.lower().endswith('.pdf'):
            try:
                import io
                from pypdf import PdfReader
                
                pdf_file = io.BytesIO(content)
                reader = PdfReader(pdf_file)
                
                text_parts = []
                for page in reader.pages:
                    text_parts.append(page.extract_text())
                
                extracted_text = "\n".join(text_parts)
                print(f"Extracted {len(extracted_text)} chars from {filename}")
            except Exception as e:
                print(f"Error extracting text from PDF: {e}")
                extracted_text = "Error extracting text."
        else:
            # Try to decode as text
            try:
                extracted_text = content.decode('utf-8')
            except:
                pass

        file = KnowledgeFile(
            agent_id=config.id,
            filename=filename,
            file_path=f"/uploads/{filename}",
            file_size=len(content),
            content=extracted_text
        )
        self.db.add(file)
        await self.db.commit()
        await self.db.refresh(file)
        return file

    async def delete_knowledge_file(self, file_id: int):
        """Delete a knowledge base file record."""
        result = await self.db.execute(
            select(KnowledgeFile).where(KnowledgeFile.id == file_id)
        )
        file = result.scalar_one_or_none()
        if file:
            await self.db.delete(file)
            await self.db.commit()
