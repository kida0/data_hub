from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from ..models.segment import Segment
from ..schemas.segment import SegmentCreate, SegmentUpdate


class SegmentService:
    @staticmethod
    def get_all_segments(
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        search: Optional[str] = None,
        category: Optional[str] = None
    ):
        """모든 세그먼트 조회"""
        query = db.query(Segment)
        
        # 검색 필터
        if search:
            query = query.filter(
                (Segment.name.contains(search)) | 
                (Segment.description.contains(search))
            )
        
        # 카테고리 필터
        if category:
            query = query.filter(Segment.category == category)
        
        total = query.count()
        items = query.offset(skip).limit(limit).all()
        
        return {"total": total, "items": items}

    @staticmethod
    def get_segment_by_id(db: Session, segment_id: int):
        """ID로 세그먼트 조회"""
        return db.query(Segment).filter(Segment.id == segment_id).first()

    @staticmethod
    def create_segment(db: Session, segment: SegmentCreate):
        """새 세그먼트 생성"""
        db_segment = Segment(**segment.model_dump())
        db.add(db_segment)
        db.commit()
        db.refresh(db_segment)
        return db_segment

    @staticmethod
    def update_segment(db: Session, segment_id: int, segment: SegmentUpdate):
        """세그먼트 업데이트"""
        db_segment = db.query(Segment).filter(Segment.id == segment_id).first()
        if not db_segment:
            return None
        
        update_data = segment.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_segment, key, value)
        
        db.commit()
        db.refresh(db_segment)
        return db_segment

    @staticmethod
    def delete_segment(db: Session, segment_id: int):
        """세그먼트 삭제"""
        db_segment = db.query(Segment).filter(Segment.id == segment_id).first()
        if not db_segment:
            return False
        
        db.delete(db_segment)
        db.commit()
        return True

    @staticmethod
    def get_segments_stats(db: Session):
        """세그먼트 통계 조회"""
        total_segments = db.query(Segment).count()
        total_customers = db.query(func.sum(Segment.customer_count)).scalar() or 0
        
        # 카테고리별 고객 수
        retention_customers = db.query(func.sum(Segment.customer_count)).filter(
            Segment.category == "리텐션"
        ).scalar() or 0
        
        reactivation_customers = db.query(func.sum(Segment.customer_count)).filter(
            Segment.category == "재활성화"
        ).scalar() or 0
        
        return {
            "total_segments": total_segments,
            "total_customers": total_customers,
            "active_customers": retention_customers,
            "at_risk_customers": reactivation_customers
        }

