from pydantic import BaseModel
from typing import Optional, Any, Dict

class VKEventConfirmation(BaseModel):
    type: str # "confirmation"
    group_id: int

class VKEventMessageNew(BaseModel):
    type: str # "message_new"
    object: Dict[str, Any]
    group_id: int

class VKEvent(BaseModel):
    type: str
    object: Optional[Dict[str, Any]] = None
    group_id: int
    secret: Optional[str] = None
