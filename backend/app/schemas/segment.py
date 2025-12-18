from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date


class CampaignInfo(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class SegmentBase(BaseModel):
    name: str
    description: Optional[str] = None
    segment_owner: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    refresh_period: Optional[str] = None
    query: Optional[str] = None
    customer_count: Optional[int] = None
    metric1_value: Optional[str] = None
    metric1_label: Optional[str] = None
    metric2_value: Optional[str] = None
    metric2_label: Optional[str] = None
    metric3_value: Optional[str] = None
    metric3_label: Optional[str] = None
    metric4_value: Optional[str] = None
    metric4_label: Optional[str] = None
    last_touch_channel: Optional[str] = None
    last_touch_date: Optional[date] = None


class SegmentCreate(SegmentBase):
    pass


class SegmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    segment_owner: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    refresh_period: Optional[str] = None
    query: Optional[str] = None
    customer_count: Optional[int] = None
    metric1_value: Optional[str] = None
    metric1_label: Optional[str] = None
    metric2_value: Optional[str] = None
    metric2_label: Optional[str] = None
    metric3_value: Optional[str] = None
    metric3_label: Optional[str] = None
    metric4_value: Optional[str] = None
    metric4_label: Optional[str] = None
    last_touch_channel: Optional[str] = None
    last_touch_date: Optional[date] = None


class SegmentResponse(SegmentBase):
    id: int
    created_at: datetime
    updated_at: datetime
    campaigns: List[CampaignInfo] = []

    class Config:
        from_attributes = True


class SegmentListResponse(BaseModel):
    total: int
    items: list[SegmentResponse]

