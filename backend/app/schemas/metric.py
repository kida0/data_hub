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
    metric_owner: Optional[str] = None
    priority: Optional[str] = None
    calculation_logic: Optional[str] = None
    alert_settings: Optional[str] = None
    data_source: Optional[str] = None
    aggregation_period: Optional[str] = None


class MetricCreate(BaseModel):
    name: str
    description: str
    category: str
    metric_owner: str
    priority: str
    calculation_logic: str
    alert_settings: Optional[str] = None
    status: str = "비활성화"
    version: str = "v1.0.0"


class MetricUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    value: Optional[float] = None
    unit: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    version: Optional[str] = None
    metric_owner: Optional[str] = None
    priority: Optional[str] = None
    calculation_logic: Optional[str] = None
    alert_settings: Optional[str] = None
    data_source: Optional[str] = None
    aggregation_period: Optional[str] = None


class MetricResponse(MetricBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MetricListResponse(BaseModel):
    total: int
    items: list[MetricResponse]

