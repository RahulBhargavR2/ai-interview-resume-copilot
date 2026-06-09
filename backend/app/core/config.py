from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str

    JWT_SECRETE: str = 'abcdef'

    JWT_ALGORITHM: str

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 50

    GEMINI_API_KEY: str

    LLM_MODEL: str

    model_config = SettingsConfigDict(
        env_file='.env',
        extra="ignore"
    )

settings = Settings()
