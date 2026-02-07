from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from src.database import get_db
from .schemas import AgentConfigResponse, AgentConfigCreate, KnowledgeFileResponse
from .service import AgentService


router = APIRouter(prefix="/agent", tags=["Agent Configuration"])


@router.get("/config", response_model=AgentConfigResponse)
async def get_config(db: AsyncSession = Depends(get_db)):
    """Get current agent configuration."""
    service = AgentService(db)
    return await service.get_config()


@router.put("/config", response_model=AgentConfigResponse)
async def update_config(
    config: AgentConfigCreate,
    db: AsyncSession = Depends(get_db)
):
    """Update agent configuration."""
    service = AgentService(db)
    return await service.update_config(config.model_dump())


@router.post("/knowledge", response_model=KnowledgeFileResponse)
async def upload_knowledge(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """Upload a knowledge base file and process it."""
    service = AgentService(db)
    content = await file.read()
    return await service.add_knowledge_file(
        filename=file.filename,
        content=content
    )


@router.delete("/knowledge/{file_id}")
async def delete_knowledge(
    file_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete a knowledge base file."""
    service = AgentService(db)
    await service.delete_knowledge_file(file_id)
    return {"status": "success"}
