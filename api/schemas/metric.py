from typing import Optional, Any
from pydantic import BaseModel

class MetricBase(BaseModel):
    entity: str
    name: str
    type: str
    value: float
    calculation_config: Optional[Any] = None

class MetricCreate(MetricBase):
    entity: str
    name: str
    type: str
    value: float
    calculation_config: Optional[Any] = None
    pass

class MetricUpdate(BaseModel):
    value: Optional[int] = None
    type: Optional[str] = None
    calculation_config: Optional[Any] = None

class MetricOut(MetricBase):
    id: int
    calculation_config: Optional[Any] = None
    class Config:
        from_attributes = True 