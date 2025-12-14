from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..schemas.segment import SegmentResponse, SegmentCreate, SegmentUpdate, SegmentListResponse
from ..services.segment_service import SegmentService

router = APIRouter()


@router.get("/", response_model=SegmentListResponse)
def get_segments(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """모든 세그먼트 조회"""
    return SegmentService.get_all_segments(
        db=db, 
        skip=skip, 
        limit=limit,
        search=search,
        category=category
    )


@router.get("/stats")
def get_segments_stats(db: Session = Depends(get_db)):
    """세그먼트 통계 조회"""
    return SegmentService.get_segments_stats(db)


@router.get("/{segment_id}", response_model=SegmentResponse)
def get_segment(segment_id: int, db: Session = Depends(get_db)):
    """특정 세그먼트 조회"""
    segment = SegmentService.get_segment_by_id(db, segment_id)
    if not segment:
        raise HTTPException(status_code=404, detail="Segment not found")
    return segment


@router.post("/", response_model=SegmentResponse)
def create_segment(segment: SegmentCreate, db: Session = Depends(get_db)):
    """새 세그먼트 생성"""
    return SegmentService.create_segment(db, segment)


@router.put("/{segment_id}", response_model=SegmentResponse)
def update_segment(segment_id: int, segment: SegmentUpdate, db: Session = Depends(get_db)):
    """세그먼트 업데이트"""
    updated_segment = SegmentService.update_segment(db, segment_id, segment)
    if not updated_segment:
        raise HTTPException(status_code=404, detail="Segment not found")
    return updated_segment


@router.delete("/{segment_id}")
def delete_segment(segment_id: int, db: Session = Depends(get_db)):
    """세그먼트 삭제"""
    success = SegmentService.delete_segment(db, segment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Segment not found")
    return {"message": "Segment deleted successfully"}

