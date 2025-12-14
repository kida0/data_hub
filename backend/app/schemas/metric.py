from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MetricBase(BaseModel):
    name: str
    description: Optional[str] = None
    value: Optional[float] = None
    unit: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    version: Optional[str] = None


class MetricCreate(MetricBase):
    pass


class MetricUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    value: Optional[float] = None
    unit: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    version: Optional[str] = None


class MetricResponse(MetricBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MetricListResponse(BaseModel):
    total: int
    items: list[MetricResponse]

