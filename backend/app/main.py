"""NexusGuard FastAPI Application Entry Point."""

from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.core.logging import logger, setup_logging
from backend.app.core.exceptions import register_exception_handlers
from backend.app.db.session import check_db_connection
from backend.app.api.v1.api import api_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application startup and shutdown lifecycle management."""
    setup_logging()
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION} [{settings.ENVIRONMENT}]")
    logger.info(f"Allowed CORS origins: {settings.CORS_ORIGINS}")
    logger.info(f"Config: {settings.safe_dict()}")

    # Non-blocking database connection audit on startup
    db_status = await check_db_connection()
    if db_status.get("connected"):
        logger.info("Database connection established successfully.")
    else:
        logger.warning(
            f"Database not currently connected ({db_status.get('status')}): "
            f"{db_status.get('error', 'Unreachable')}. Running in disconnected/memory mode."
        )

    yield

    logger.info(f"Shutting down {settings.PROJECT_NAME}.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url=f"{settings.API_V1_PREFIX}/docs",
    redoc_url=f"{settings.API_V1_PREFIX}/redoc",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register structured exception handlers
register_exception_handlers(app)

# Mount API routers under prefix (/api/v1)
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/", tags=["Root"], summary="Root Index")
async def root_index() -> dict:
    """Root info endpoint providing navigation to docs and health check."""
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "health": f"{settings.API_V1_PREFIX}/health",
        "docs": f"{settings.API_V1_PREFIX}/docs",
    }
