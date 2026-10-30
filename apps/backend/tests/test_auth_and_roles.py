import pytest
from fastapi.testclient import TestClient

def test_login_all_four_roles(client: TestClient):
    roles = [
        ("student_demo", "student123", "student"),
        ("teacher_demo", "teacher123", "teacher"),
        ("counselor_demo", "counselor123", "counselor"),
        ("principal_demo", "principal123", "principal"),
    ]
    for username, password, expected_role in roles:
        response = client.post(
            "/api/v1/auth/login",
            json={"username": username, "password": password},
        )
        assert response.status_code == 200, f"Login failed for {username}: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["role"] == expected_role
        assert data["user"]["username"] == username

def test_login_invalid_password(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "teacher_demo", "password": "wrong_password_999"},
    )
    assert response.status_code == 401
    assert "نادرست است" in response.json()["detail"]

def test_auth_me_with_bearer_token(client: TestClient):
    # 1. Login as student
    login_res = client.post(
        "/api/v1/auth/login",
        json={"username": "student_demo", "password": "student123"},
    )
    token = login_res.json()["access_token"]

    # 2. Call /auth/me with Bearer token
    me_res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["user"]["username"] == "student_demo"
    assert me_data["user"]["role"] == "student"
    assert "view_own_grades" in me_data["permissions"]

def test_rbac_access_restrictions(client: TestClient):
    # 1. Login as student
    student_token = client.post(
        "/api/v1/auth/login",
        json={"username": "student_demo", "password": "student123"},
    ).json()["access_token"]

    # Student trying to view teacher dashboard must be blocked (403)
    teacher_dash_res = client.get(
        "/api/v1/dashboard/teacher",
        headers={"Authorization": f"Bearer {student_token}"},
    )
    assert teacher_dash_res.status_code == 403

    # Student trying to view counselor EWS overview must be blocked (403)
    counselor_res = client.get(
        "/api/v1/counselor/overview",
        headers={"Authorization": f"Bearer {student_token}"},
    )
    assert counselor_res.status_code == 403

    # 2. Login as Principal
    principal_token = client.post(
        "/api/v1/auth/login",
        json={"username": "principal_demo", "password": "principal123"},
    ).json()["access_token"]

    # Principal has overarching access to teacher and counselor scopes
    p_teacher_res = client.get(
        "/api/v1/dashboard/teacher",
        headers={"Authorization": f"Bearer {principal_token}"},
    )
    assert p_teacher_res.status_code == 200

    p_counselor_res = client.get(
        "/api/v1/counselor/overview",
        headers={"Authorization": f"Bearer {principal_token}"},
    )
    assert p_counselor_res.status_code == 200

def test_institutional_license_purchase_and_auto_provision(client: TestClient):
    purchase_payload = {
        "organization_name": "دبیرستان البرز ماندگار",
        "package_type": "GOLD_INSTITUTIONAL",
        "max_seats": 800,
        "contact_email": "admin@alborz-school.ir",
        "contact_phone": "02166442211",
        "admin_full_name": "دکتر کمال رضایی",
    }
    purchase_res = client.post(
        "/api/v1/auth/purchase-license",
        json=purchase_payload,
    )
    assert purchase_res.status_code == 200
    data = purchase_res.json()
    assert data["success"] is True
    assert data["license_key"].startswith("SCH-2026-")
    assert data["organization_name"] == "دبیرستان البرز ماندگار"
    
    # Check issued master credentials
    creds = data["credentials"]
    assert creds["role"] == "principal"
    assert creds["username"].startswith("admin_")
    assert creds["password"].startswith("Sch@")

    # Immediate verification: New principal can log in with issued credentials
    login_new = client.post(
        "/api/v1/auth/login",
        json={"username": creds["username"], "password": creds["password"]},
    )
    assert login_new.status_code == 200
    assert login_new.json()["user"]["role"] == "principal"

def test_roles_info_catalog(client: TestClient):
    response = client.get("/api/v1/auth/roles-info")
    assert response.status_code == 200
    roles = response.json()["roles"]
    assert len(roles) == 4
    role_names = [r["role"] for r in roles]
    assert "student" in role_names
    assert "teacher" in role_names
    assert "counselor" in role_names
    assert "principal" in role_names
