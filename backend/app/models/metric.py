from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class Metric(Base):
    __tablename__ = "metrics"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(String, nullable=True)
    value = Column(Float, nullable=True)
    unit = Column(String(50), nullable=True)
    category = Column(String(100), nullable=True)
    status = Column(String(50), nullable=True, default="비활성화")
    version = Column(String(20), nullable=True)
    metric_owner = Column(String(100), nullable=True)
    priority = Column(String(10), nullable=True)
    calculation_logic = Column(Text, nullable=True)
    alert_settings = Column(String, nullable=True)
    data_source = Column(Text, nullable=True)
    aggregation_period = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationship
    data_points = relationship("MetricDataPoint", back_populates="metric", cascade="all, delete-orphan")

