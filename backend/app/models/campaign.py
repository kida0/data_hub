from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Table
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base


# Segment-Campaign 연결 테이블
segment_campaigns = Table(
    'segment_campaigns',
    Base.metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('segment_id', Integer, ForeignKey('segments.id'), nullable=False),
    Column('campaign_id', Integer, ForeignKey('campaigns.id'), nullable=False),
    Column('created_at', DateTime(timezone=True), server_default=func.now())
)


class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), nullable=True, default='active')
    created_at = Column(DateTime(timezone=True), server_default=func.now())
