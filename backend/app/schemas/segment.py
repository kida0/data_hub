from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date


class SegmentBase(BaseModel):
    name: str
    description: Optional[str] = None
    customer_count: Optional[int] = None
    category: Optional[str] = None
    metric1_value: Optional[str] = None
    metric1_label: Optional[str] = None
    metric2_value: Optional[str] = None
    metric2_label: Optional[str] = None
    metric3_value: Optional[str] = None
    metric3_label: Optional[str] = None
    last_touch_channel: Optional[str] = None
    last_touch_date: Optional[date] = None


class SegmentCreate(SegmentBase):
    pass


class SegmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    customer_count: Optional[int] = None
    category: Optional[str] = None
    metric1_value: Optional[str] = None
    metric1_label: Optional[str] = None
    metric2_value: Optional[str] = None
    metric2_label: Optional[str] = None
    metric3_value: Optional[str] = None
    metric3_label: Optional[str] = None
    last_touch_channel: Optional[str] = None
    last_touch_date: Optional[date] = None


class SegmentResponse(SegmentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SegmentListResponse(BaseModel):
    total: int
    items: list[SegmentResponse]

