from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..schemas.metric import MetricResponse, MetricCreate, MetricUpdate, MetricListResponse
from ..services.metric_service import MetricService

router = APIRouter()


@router.get("/", response_model=MetricListResponse)
def get_metrics(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """모든 지표 조회"""
    return MetricService.get_all_metrics(
        db=db, 
        skip=skip, 
        limit=limit,
        search=search,
        category=category,
        status=status
    )


@router.get("/stats")
def get_metrics_stats(db: Session = Depends(get_db)):
    """지표 통계 조회"""
    return MetricService.get_metrics_stats(db)


@router.get("/{metric_id}", response_model=MetricResponse)
def get_metric(metric_id: int, db: Session = Depends(get_db)):
    """특정 지표 조회"""
    metric = MetricService.get_metric_by_id(db, metric_id)
    if not metric:
        raise HTTPException(status_code=404, detail="Metric not found")
    return metric


@router.get("/{metric_id}/timeseries")
def get_metric_timeseries(
    metric_id: int,
    limit: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db)
):
    """지표의 시계열 데이터 조회"""
    metric = MetricService.get_metric_by_id(db, metric_id)
    if not metric:
        raise HTTPException(status_code=404, detail="Metric not found")

    return MetricService.get_metric_time_series(db, metric_id, limit)


@router.post("/", response_model=MetricResponse)
def create_metric(metric: MetricCreate, db: Session = Depends(get_db)):
    """새 지표 생성"""
    return MetricService.create_metric(db, metric)


@router.put("/{metric_id}", response_model=MetricResponse)
def update_metric(metric_id: int, metric: MetricUpdate, db: Session = Depends(get_db)):
    """지표 업데이트"""
    updated_metric = MetricService.update_metric(db, metric_id, metric)
    if not updated_metric:
        raise HTTPException(status_code=404, detail="Metric not found")
    return updated_metric


@router.delete("/{metric_id}")
def delete_metric(metric_id: int, db: Session = Depends(get_db)):
    """지표 삭제"""
    success = MetricService.delete_metric(db, metric_id)
    if not success:
        raise HTTPException(status_code=404, detail="Metric not found")
    return {"message": "Metric deleted successfully"}

