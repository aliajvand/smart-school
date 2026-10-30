import pytest
from fastapi.testclient import TestClient

def test_health_check(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "smart-school-backend"

def test_root_endpoint(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200
    assert "version" in response.json()

def test_demo_auth_success_with_valid_role(client: TestClient):
    response = client.get(
        "/api/v1/dashboard/teacher",
        headers={"X-Demo-Role": "teacher"},
    )
    assert response.status_code == 200
    assert response.json()["scope"] == "teacher"

def test_demo_auth_forbidden_role(client: TestClient):
    # Teacher trying to access counselor overview should get 403 Forbidden
    response = client.get(
        "/api/v1/counselor/overview",
        headers={"X-Demo-Role": "teacher"},
    )
    assert response.status_code == 403
    assert "Access denied" in response.json()["detail"]

def test_demo_auth_invalid_role(client: TestClient):
    response = client.get(
        "/api/v1/dashboard/teacher",
        headers={"X-Demo-Role": "super_hacker"},
    )
    assert response.status_code == 401
    assert "Invalid or missing X-Demo-Role" in response.json()["detail"]
