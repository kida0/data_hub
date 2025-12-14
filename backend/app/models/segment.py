from sqlalchemy import Column, Integer, String, Date, DateTime
from sqlalchemy.sql import func
from ..database import Base


class Segment(Base):
    __tablename__ = "segments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(String, nullable=True)
    customer_count = Column(Integer, nullable=True)
    category = Column(String(100), nullable=True)
    metric1_value = Column(String(50), nullable=True)
    metric1_label = Column(String(100), nullable=True)
    metric2_value = Column(String(50), nullable=True)
    metric2_label = Column(String(100), nullable=True)
    metric3_value = Column(String(50), nullable=True)
    metric3_label = Column(String(100), nullable=True)
    last_touch_channel = Column(String(50), nullable=True)
    last_touch_date = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

