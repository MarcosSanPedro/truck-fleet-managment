from typing import Optional
from pydantic import BaseModel

class MetricBase(BaseModel):
    entity: str
    name: str
    type: str
    value: float

class MetricCreate(MetricBase):
    entity: str
    name: str
    type: str
    value: float
    pass

class MetricUpdate(BaseModel):
    value: Optional[int] = None
    type: Optional[str] = None

class MetricOut(MetricBase):
    id: int
    class Config:
        from_attributes = True 