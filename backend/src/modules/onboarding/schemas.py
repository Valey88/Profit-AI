from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class CompanyBase(BaseModel):
    name: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    industry: Optional[str] = None
    address: Optional[str] = None


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(CompanyBase):
    pass


class ChannelBase(BaseModel):
    type: str
    name: str
    config: Optional[Dict[str, Any]] = None


class ChannelCreate(ChannelBase):
    pass


class ChannelResponse(BaseModel):
    id: int
    company_id: int
    type: str
    name: str
    status: str

    class Config:
        from_attributes = True


class CompanyResponse(CompanyBase):
    id: int
    channels: List[ChannelResponse] = []

    class Config:
        from_attributes = True
