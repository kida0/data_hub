from sqlalchemy import Column, Integer, String, Float, DateTime
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
    status = Column(String(50), nullable=True)
    version = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

