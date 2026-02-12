from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from datetime import datetime

class BlockSchema(BaseModel):
    id: str
    type: str
    content: Dict[str, Any]
    styles: Optional[Dict[str, Any]] = None

class PageBase(BaseModel):
    name: str
    slug: str
    content: List[BlockSchema] = []

class PageCreate(PageBase):
    pass

class PageUpdate(PageBase):
    pass

class PageResponse(PageBase):
    id: int
    site_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SiteBase(BaseModel):
    name: str
    domain: Optional[str] = None

class SiteCreate(SiteBase):
    pass

class SiteUpdate(SiteBase):
    pass

class SiteResponse(SiteBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    pages: List[PageResponse] = []

    class Config:
        from_attributes = True
