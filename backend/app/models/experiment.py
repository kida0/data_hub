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

    # 실험 계획
    objective = Column(String(255), nullable=False)
    background = Column(Text, nullable=False)
    hypothesis = Column(Text, nullable=False)
    expected_impact = Column(Text, nullable=True)

    # 메트릭 (JSON 배열)
    primary_metric_ids = Column(Text, nullable=False)  # JSON array as string
    secondary_metric_ids = Column(Text, nullable=True)  # JSON array as string
    guardrail_metric_ids = Column(Text, nullable=True)  # JSON array as string

    # 기간 및 대상
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    target_segment_id = Column(Integer, ForeignKey("segments.id"), nullable=False)

    # Variants (JSON 배열) - 생성 시에는 필수 아님
    variants = Column(Text, nullable=True)  # JSON array as string

    # 데이터팀 입력 필드 - 통계적 설계
    experiment_unit = Column(String(50), nullable=True, default="User")
    significance_level = Column(Float, nullable=True, default=0.05)
    statistical_power = Column(Float, nullable=True, default=0.8)
    minimum_detectable_effect = Column(Float, nullable=True)
    sample_size = Column(String(50), nullable=True)

    # 메타데이터
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
