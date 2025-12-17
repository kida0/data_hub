from pydantic import BaseModel
from datetime import datetime


class MetricDataPointBase(BaseModel):
    metric_id: int
    value: float
    timestamp: datetime


class MetricDataPointCreate(MetricDataPointBase):
    pass


class MetricDataPointResponse(MetricDataPointBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
