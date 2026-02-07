from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    # App
    PROJECT_NAME: str = "Profit Flow AI"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-super-secret-key-change-in-production"  # JWT signing key
    
    # Database
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "profitflow"
    POSTGRES_HOST: str = "db"
    POSTGRES_PORT: int = 5432
    USE_SQLITE: bool = True  # Set to False in production with PostgreSQL
    
    @property
    def DATABASE_URL(self) -> str:
        # Check if explicit DB URL is set in env (e.g. Render)
        if os.getenv("DATABASE_URL"):
            url = os.getenv("DATABASE_URL")
            if url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql+asyncpg://", 1)
            elif url.startswith("postgresql://"):
                 url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
            return url

        # Use SQLite for local development (when PostgreSQL is not available)
        if self.USE_SQLITE or self.POSTGRES_HOST == "db":
            db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data.db")
            return f"sqlite+aiosqlite:///{db_path}"
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # Redis
    REDIS_HOST: str = "redis"
    REDIS_PORT: int = 6379

    # OpenAI / OpenRouter
    OPENAI_API_KEY: str = ""
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"  # OpenRouter: https://openrouter.ai/api/v1
    OPENAI_MODEL: str = "gpt-4o-mini"

    class Config:
        env_file = ".env"

settings = Settings()

