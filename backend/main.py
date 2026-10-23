"""Root entry point for the backend, exposing app from backend.app.main."""

import sys
from pathlib import Path

# Ensure workspace root is always in sys.path regardless of execution directory
root_dir = Path(__file__).resolve().parent.parent
backend_dir = Path(__file__).resolve().parent

if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from backend.app.main import app

if __name__ == "__main__":
    import uvicorn
    from backend.app.core.config import settings

    uvicorn.run(
        "backend.app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
    )
