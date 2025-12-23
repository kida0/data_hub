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
    objective: str
    background: str
    hypothesis: str
    expected_impact: Optional[str] = None
    primary_metric_ids: str  # JSON string
    secondary_metric_ids: Optional[str] = None  # JSON string
    guardrail_metric_ids: Optional[str] = None  # JSON string
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    target_segment_id: int
    variants: Optional[str] = None  # JSON string
    experiment_unit: Optional[str] = "User"
    significance_level: Optional[float] = 0.05
    statistical_power: Optional[float] = 0.8
    minimum_detectable_effect: Optional[float] = None
    sample_size: Optional[str] = None


class ExperimentCreate(BaseModel):
    name: str
    description: Optional[str] = None
    owner: str
    team: Optional[str] = None
    experiment_type: str = "A/B Test"
    status: str = "draft"
    objective: str
    background: str
    hypothesis: str
    expected_impact: Optional[str] = None
    primary_metric_ids: str  # JSON string: '["1", "2"]'
    secondary_metric_ids: Optional[str] = None  # JSON string
    guardrail_metric_ids: Optional[str] = None  # JSON string
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    target_segment_id: int
    variants: Optional[str] = None  # JSON string (생성 시에는 선택)
    experiment_unit: Optional[str] = "User"
    significance_level: Optional[float] = 0.05
    statistical_power: Optional[float] = 0.8
    minimum_detectable_effect: Optional[float] = None
    sample_size: Optional[str] = None


class ExperimentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    owner: Optional[str] = None
    team: Optional[str] = None
    experiment_type: Optional[str] = None
    status: Optional[str] = None
    objective: Optional[str] = None
    background: Optional[str] = None
    hypothesis: Optional[str] = None
    expected_impact: Optional[str] = None
    primary_metric_ids: Optional[str] = None
    secondary_metric_ids: Optional[str] = None
    guardrail_metric_ids: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    target_segment_id: Optional[int] = None
    variants: Optional[str] = None
    experiment_unit: Optional[str] = None
    significance_level: Optional[float] = None
    statistical_power: Optional[float] = None
    minimum_detectable_effect: Optional[float] = None
    sample_size: Optional[str] = None


class ExperimentResponse(ExperimentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ExperimentListResponse(BaseModel):
    total: int
    items: list[ExperimentResponse]
