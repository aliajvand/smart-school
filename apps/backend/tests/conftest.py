import sys
import os
import pytest
from fastapi.testclient import TestClient

# Ensure app package is importable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app

@pytest.fixture
def client():
    return TestClient(app)
