#!/bin/bash

# DataHub 프론트엔드 실행 스크립트

echo "DataHub 프론트엔드를 시작합니다..."

# node_modules가 없으면 설치
if [ ! -d "node_modules" ]; then
    echo "의존성을 설치합니다..."
    npm install
fi

# Vite 개발 서버 실행
npm run dev

