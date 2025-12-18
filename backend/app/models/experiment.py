from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from ..database import Base


class Experiment(Base):
    __tablename__ = "experiments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # 기본 정보
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    owner = Column(String(100), nullable=False)
    team = Column(String(100), nullable=True)
    experiment_type = Column(String(50), nullable=True, default="A/B Test")
    status = Column(String(50), nullable=True, default="draft")

    # 목표 및 가설
    objective = Column(String(100), nullable=True)
    hypothesis = Column(Text, nullable=False)
    ice_impact = Column(Integer, nullable=True)
    ice_confidence = Column(Integer, nullable=True)
    ice_ease = Column(Integer, nullable=True)

    # 메트릭
    primary_metric_id = Column(Integer, ForeignKey("metrics.id"), nullable=True)
    secondary_metric_ids = Column(Text, nullable=True)  # JSON array as string

    # 기간 및 대상
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    target_segment_id = Column(Integer, ForeignKey("segments.id"), nullable=True)

    # Variants (JSON 배열)
    variants = Column(Text, nullable=False)  # JSON array as string

    # 통계 설정
    minimum_detectable_effect = Column(Float, nullable=True, default=5.0)
    statistical_significance = Column(Float, nullable=True, default=95.0)
    statistical_power = Column(Float, nullable=True, default=80.0)

    # 추가 정보
    conditions = Column(Text, nullable=True)
    confounding_factors = Column(Text, nullable=True)

    # 실행 결과
    progress = Column(Float, nullable=True, default=0.0)
    days_left = Column(Integer, nullable=True)

    # 메타데이터
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
