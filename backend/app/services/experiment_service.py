from sqlalchemy.orm import Session
from typing import Optional
from ..models.experiment import Experiment
from ..schemas.experiment import ExperimentCreate, ExperimentUpdate


class ExperimentService:
    @staticmethod
    def get_all_experiments(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        search: Optional[str] = None,
        status: Optional[str] = None
    ):
        """모든 실험 조회"""
        query = db.query(Experiment)

        # 검색 필터
        if search:
            query = query.filter(
                (Experiment.name.contains(search)) |
                (Experiment.description.contains(search))
            )

        # 상태 필터
        if status:
            query = query.filter(Experiment.status == status)

        total = query.count()
        items = query.order_by(Experiment.created_at.desc()).offset(skip).limit(limit).all()

        return {"total": total, "items": items}

    @staticmethod
    def get_experiment_by_id(db: Session, experiment_id: int):
        """ID로 실험 조회"""
        return db.query(Experiment).filter(Experiment.id == experiment_id).first()

    @staticmethod
    def create_experiment(db: Session, experiment: ExperimentCreate):
        """새 실험 생성"""
        db_experiment = Experiment(**experiment.model_dump())
        db.add(db_experiment)
        db.commit()
        db.refresh(db_experiment)
        return db_experiment

    @staticmethod
    def update_experiment(db: Session, experiment_id: int, experiment: ExperimentUpdate):
        """실험 업데이트"""
        db_experiment = db.query(Experiment).filter(Experiment.id == experiment_id).first()
        if not db_experiment:
            return None

        update_data = experiment.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_experiment, key, value)

        db.commit()
        db.refresh(db_experiment)
        return db_experiment

    @staticmethod
    def delete_experiment(db: Session, experiment_id: int):
        """실험 삭제"""
        db_experiment = db.query(Experiment).filter(Experiment.id == experiment_id).first()
        if not db_experiment:
            return False

        db.delete(db_experiment)
        db.commit()
        return True
