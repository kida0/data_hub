from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date


class ExperimentBase(BaseModel):
    name: str
    description: Optional[str] = None
    owner: str
    team: Optional[str] = None
    experiment_type: Optional[str] = "A/B Test"
    status: Optional[str] = "draft"
    objective: Optional[str] = None
    hypothesis: str
    ice_impact: Optional[int] = None
    ice_confidence: Optional[int] = None
    ice_ease: Optional[int] = None
    primary_metric_id: Optional[int] = None
    secondary_metric_ids: Optional[str] = None  # JSON string
    start_date: date
    end_date: date
    target_segment_id: Optional[int] = None
    variants: str  # JSON string
    minimum_detectable_effect: Optional[float] = 5.0
    statistical_significance: Optional[float] = 95.0
    statistical_power: Optional[float] = 80.0
    conditions: Optional[str] = None
    confounding_factors: Optional[str] = None
    progress: Optional[float] = 0.0
    days_left: Optional[int] = None


class ExperimentCreate(BaseModel):
    name: str
    description: Optional[str] = None
    owner: str
    team: Optional[str] = None
    experiment_type: str = "A/B Test"
    status: str = "draft"
    objective: str
    hypothesis: str
    ice_impact: Optional[int] = None
    ice_confidence: Optional[int] = None
    ice_ease: Optional[int] = None
    primary_metric_id: int
    secondary_metric_ids: Optional[str] = None  # JSON string: '["1", "2"]'
    start_date: date
    end_date: date
    target_segment_id: int
    variants: str  # JSON string: '[{"name": "Control", "description": "", "traffic_allocation": 50}]'
    minimum_detectable_effect: Optional[float] = 5.0
    statistical_significance: Optional[float] = 95.0
    statistical_power: Optional[float] = 80.0
    conditions: Optional[str] = None
    confounding_factors: Optional[str] = None


class ExperimentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    owner: Optional[str] = None
    team: Optional[str] = None
    experiment_type: Optional[str] = None
    status: Optional[str] = None
    objective: Optional[str] = None
    hypothesis: Optional[str] = None
    ice_impact: Optional[int] = None
    ice_confidence: Optional[int] = None
    ice_ease: Optional[int] = None
    primary_metric_id: Optional[int] = None
    secondary_metric_ids: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    target_segment_id: Optional[int] = None
    variants: Optional[str] = None
    minimum_detectable_effect: Optional[float] = None
    statistical_significance: Optional[float] = None
    statistical_power: Optional[float] = None
    conditions: Optional[str] = None
    confounding_factors: Optional[str] = None
    progress: Optional[float] = None
    days_left: Optional[int] = None


class ExperimentResponse(ExperimentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ExperimentListResponse(BaseModel):
    total: int
    items: list[ExperimentResponse]
