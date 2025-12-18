from sqlalchemy.orm import Session
from typing import Optional
from ..models.metric import Metric
from ..models.metric_data_point import MetricDataPoint
from ..schemas.metric import MetricCreate, MetricUpdate


class MetricService:
    @staticmethod
    def get_all_metrics(
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        search: Optional[str] = None,
        category: Optional[str] = None,
        status: Optional[str] = None
    ):
        """모든 지표 조회"""
        query = db.query(Metric)
        
        # 검색 필터
        if search:
            query = query.filter(
                (Metric.name.contains(search)) | 
                (Metric.description.contains(search))
            )
        
        # 카테고리 필터
        if category:
            query = query.filter(Metric.category == category)
        
        # 상태 필터
        if status:
            query = query.filter(Metric.status == status)
        
        total = query.count()
        items = query.offset(skip).limit(limit).all()
        
        return {"total": total, "items": items}

    @staticmethod
    def get_metric_by_id(db: Session, metric_id: int):
        """ID로 지표 조회"""
        return db.query(Metric).filter(Metric.id == metric_id).first()

    @staticmethod
    def create_metric(db: Session, metric: MetricCreate):
        """새 지표 생성"""
        db_metric = Metric(**metric.model_dump())
        db.add(db_metric)
        db.commit()
        db.refresh(db_metric)
        return db_metric

    @staticmethod
    def update_metric(db: Session, metric_id: int, metric: MetricUpdate):
        """지표 업데이트"""
        db_metric = db.query(Metric).filter(Metric.id == metric_id).first()
        if not db_metric:
            return None
        
        update_data = metric.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_metric, key, value)
        
        db.commit()
        db.refresh(db_metric)
        return db_metric

    @staticmethod
    def delete_metric(db: Session, metric_id: int):
        """지표 삭제"""
        db_metric = db.query(Metric).filter(Metric.id == metric_id).first()
        if not db_metric:
            return False
        
        db.delete(db_metric)
        db.commit()
        return True

    @staticmethod
    def get_metrics_stats(db: Session):
        """지표 통계 조회"""
        total_metrics = db.query(Metric).count()
        active_metrics = db.query(Metric).filter(Metric.status == "활성화").count()
        inactive_metrics = db.query(Metric).filter(Metric.status == "비활성화").count()
        warning_metrics = db.query(Metric).filter(Metric.status == "주의").count()

        return {
            "total": total_metrics,
            "active": active_metrics,
            "inactive": inactive_metrics,
            "warning": warning_metrics
        }

    @staticmethod
    def get_metric_time_series(db: Session, metric_id: int, limit: int = 30):
        """지표의 시계열 데이터 조회"""
        data_points = (
            db.query(MetricDataPoint)
            .filter(MetricDataPoint.metric_id == metric_id)
            .order_by(MetricDataPoint.timestamp.desc())
            .limit(limit)
            .all()
        )

        # 시간순으로 정렬 (오래된 것부터)
        data_points.reverse()

        return [
            {
                "timestamp": point.timestamp.isoformat(),
                "value": point.value,
                "visitor_count": point.visitor_count
            }
            for point in data_points
        ]

