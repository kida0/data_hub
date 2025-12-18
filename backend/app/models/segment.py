from sqlalchemy import Column, Integer, String, Date, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base


class Segment(Base):
    __tablename__ = "segments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    segment_owner = Column(String(100), nullable=True)
    category = Column(String(100), nullable=True)
    tags = Column(Text, nullable=True)
    refresh_period = Column(String(50), nullable=True)
    query = Column(Text, nullable=True)
    customer_count = Column(Integer, nullable=True)
    metric1_value = Column(String(50), nullable=True)
    metric1_label = Column(String(100), nullable=True)
    metric2_value = Column(String(50), nullable=True)
    metric2_label = Column(String(100), nullable=True)
    metric3_value = Column(String(50), nullable=True)
    metric3_label = Column(String(100), nullable=True)
    metric4_value = Column(String(50), nullable=True)
    metric4_label = Column(String(100), nullable=True)
    last_touch_channel = Column(String(50), nullable=True)
    last_touch_date = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Campaigns 관계
    campaigns = relationship(
        "Campaign",
        secondary="segment_campaigns",
        lazy="joined"
    )

