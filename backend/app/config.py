from pydantic_settings import BaseSettings
from typing import List
import os
from pathlib import Path

# 프로젝트 루트 디렉토리 찾기
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATABASE_PATH = BASE_DIR / "database" / "datahub.db"


class Settings(BaseSettings):
    database_url: str = f"sqlite:///{DATABASE_PATH}"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    class Config:
        env_file = ".env"


settings = Settings()

