"""Database engine and session management."""

import asyncio
from typing import AsyncGenerator, Dict, Any
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy import text
from backend.app.core.config import settings
from backend.app.core.logging import logger

# Construct async engine
engine_kwargs: Dict[str, Any] = {
    "echo": settings.DEBUG,
    "future": True,
}

if "sqlite" in settings.async_database_url:
    engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20

engine = create_async_engine(settings.async_database_url, **engine_kwargs)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency that yields a database session per request."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def _ping_db() -> None:
    async with engine.connect() as conn:
        await conn.execute(text("SELECT 1"))


async def check_db_connection() -> Dict[str, Any]:
    """Safely test whether the configured database is reachable within a 2-second timeout."""
    try:
        await asyncio.wait_for(_ping_db(), timeout=2.0)
        return {
            "connected": True,
            "database_url": settings.safe_dict().get("DATABASE_URL"),
            "status": "ready",
        }
    except Exception as exc:
        logger.warning(f"Database connection check failed: {str(exc)}")
        return {
            "connected": False,
            "database_url": settings.safe_dict().get("DATABASE_URL"),
            "status": "unreachable",
            "error": str(exc),
        }
