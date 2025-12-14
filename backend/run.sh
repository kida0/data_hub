#!/bin/bash

# DataHub 백엔드 실행 스크립트

echo "DataHub 백엔드를 시작합니다..."

# 가상환경 활성화
if [ -d "venv" ]; then
    source venv/bin/activate
else
    echo "가상환경이 없습니다. 먼저 'python -m venv venv'를 실행하세요."
    exit 1
fi

# 데이터베이스 초기화 (없을 경우)
if [ ! -f "../database/datahub.db" ]; then
    echo "데이터베이스를 초기화합니다..."
    sqlite3 ../database/datahub.db < ../database/init.sql
fi

# FastAPI 서버 실행
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

