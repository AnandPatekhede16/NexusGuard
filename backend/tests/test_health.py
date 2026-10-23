"""Tests for health endpoint, basic routing, and structured error handling."""

import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient
from backend.app.core.config import settings
from backend.app.core.logging import SecretMaskingFormatter
import logging


def test_health_endpoint_sync(client: TestClient) -> None:
    """Synchronous test verifying GET /api/v1/health returns 200 and expected payload."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data == {
        "status": "ok",
        "service": "NexusGuard API",
    }


@pytest.mark.asyncio
async def test_health_endpoint_async(async_client: AsyncClient) -> None:
    """Asynchronous test verifying GET /api/v1/health returns 200 and expected payload."""
    response = await async_client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "NexusGuard API"


def test_root_index(client: TestClient) -> None:
    """Test root index returns basic navigation info."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "NexusGuard API"
    assert data["health"] == "/api/v1/health"
    assert data["docs"] == "/api/v1/docs"


def test_structured_error_handling_404(client: TestClient) -> None:
    """Verify that 404 routes return a structured error envelope."""
    response = client.get("/api/v1/non-existent-endpoint")
    assert response.status_code == 404
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "HTTP_404"
    assert "Not Found" in data["error"]["message"]


def test_secret_masking_in_logs() -> None:
    """Verify that SecretMaskingFormatter masks secrets and database credentials."""
    formatter = SecretMaskingFormatter(fmt="%(message)s")
    record = logging.LogRecord(
        name="test",
        level=logging.INFO,
        pathname="",
        lineno=0,
        msg="Connecting to postgresql://admin:supersecret@localhost:5432/db with key=secret123",
        args=(),
        exc_info=None,
    )
    formatted = formatter.format(record)
    assert "supersecret" not in formatted
    assert "secret123" not in formatted
    assert "admin:******@" in formatted
    assert "key=******" in formatted


def test_config_safe_dict() -> None:
    """Verify settings.safe_dict() masks sensitive keys."""
    safe = settings.safe_dict()
    assert safe["SECRET_KEY"] == "******"
    assert safe["DATABASE_URL"] == "******"
    assert safe["PROJECT_NAME"] == "NexusGuard API"
