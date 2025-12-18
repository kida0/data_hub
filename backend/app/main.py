from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base

# 모델 import (테이블 생성을 위해 필요)
from .models import segment, campaign, experiment

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DataHub API",
    description="데이터 분석 및 인사이트 제공 API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Welcome to DataHub API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# 라우터 임포트
from .routes import metrics, segments, experiments
app.include_router(metrics.router, prefix="/api/metrics", tags=["metrics"])
app.include_router(segments.router, prefix="/api/segments", tags=["segments"])
app.include_router(experiments.router, prefix="/api/experiments", tags=["experiments"])

