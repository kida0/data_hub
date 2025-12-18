from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..schemas.experiment import ExperimentResponse, ExperimentCreate, ExperimentUpdate, ExperimentListResponse
from ..services.experiment_service import ExperimentService

router = APIRouter()


@router.get("/", response_model=ExperimentListResponse)
def get_experiments(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """모든 실험 조회"""
    return ExperimentService.get_all_experiments(
        db=db,
        skip=skip,
        limit=limit,
        search=search,
        status=status
    )


@router.get("/{experiment_id}", response_model=ExperimentResponse)
def get_experiment(experiment_id: int, db: Session = Depends(get_db)):
    """특정 실험 조회"""
    experiment = ExperimentService.get_experiment_by_id(db, experiment_id)
    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")
    return experiment


@router.post("/", response_model=ExperimentResponse)
def create_experiment(experiment: ExperimentCreate, db: Session = Depends(get_db)):
    """새 실험 생성"""
    return ExperimentService.create_experiment(db, experiment)


@router.put("/{experiment_id}", response_model=ExperimentResponse)
def update_experiment(experiment_id: int, experiment: ExperimentUpdate, db: Session = Depends(get_db)):
    """실험 업데이트"""
    updated_experiment = ExperimentService.update_experiment(db, experiment_id, experiment)
    if not updated_experiment:
        raise HTTPException(status_code=404, detail="Experiment not found")
    return updated_experiment


@router.delete("/{experiment_id}")
def delete_experiment(experiment_id: int, db: Session = Depends(get_db)):
    """실험 삭제"""
    success = ExperimentService.delete_experiment(db, experiment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Experiment not found")
    return {"message": "Experiment deleted successfully"}
