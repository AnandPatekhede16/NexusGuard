"""Structured logging configuration with automatic secret masking."""

import logging
import re
import sys
from backend.app.core.config import settings

# Sensitive keywords and patterns to scrub
SENSITIVE_PATTERNS = [
    re.compile(r"(password['\"]?\s*[:=]\s*['\"]?)([^'\"&\s,]+)", re.IGNORECASE),
    re.compile(r"(secret['\"]?\s*[:=]\s*['\"]?)([^'\"&\s,]+)", re.IGNORECASE),
    re.compile(r"(token['\"]?\s*[:=]\s*['\"]?)([^'\"&\s,]+)", re.IGNORECASE),
    re.compile(r"(key['\"]?\s*[:=]\s*['\"]?)([^'\"&\s,]+)", re.IGNORECASE),
    re.compile(r"(authorization:\s*bearer\s+)([^\s]+)", re.IGNORECASE),
    re.compile(r"://([^:]+):([^@]+)@", re.IGNORECASE),  # Database URI credentials
]


class SecretMaskingFormatter(logging.Formatter):
    """Custom logging formatter that masks sensitive keys and credentials."""

    def format(self, record: logging.LogRecord) -> str:
        original = super().format(record)
        masked = original
        for pattern in SENSITIVE_PATTERNS:
            if "://" in pattern.pattern:
                # Mask db credentials as ://user:***@
                masked = pattern.sub(r"://\1:******@", masked)
            else:
                masked = pattern.sub(r"\1******", masked)
        return masked


def setup_logging() -> None:
    """Initialize structured application logging."""
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)

    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)

    # Avoid duplicate handlers on re-init
    if not root_logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        formatter = SecretMaskingFormatter(
            fmt="[%(asctime)s] [%(levelname)s] [%(name)s]: %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
        handler.setFormatter(formatter)
        root_logger.addHandler(handler)

    # Suppress verbose third-party logs
    logging.getLogger("uvicorn.access").setLevel(logging.INFO)
    logging.getLogger("sqlalchemy.engine").setLevel(
        logging.INFO if settings.DEBUG else logging.WARNING
    )


logger = logging.getLogger("nexusguard")
