import sys
import os
import pytest
from fastapi.testclient import TestClient

# Ensure app package is importable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.db.init_db import init_db

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """Ensure database tables and 4-role demo data are initialized before tests run."""
    init_db()

@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client
