import pytest
from fastapi.testclient import TestClient

def test_teacher_dashboard_endpoint(client: TestClient):
    response = client.get("/api/v1/dashboard/teacher", headers={"X-Demo-Role": "teacher"})
    assert response.status_code == 200
    data = response.json()
    assert data["scope"] == "teacher"
    assert len(data["metrics"]) == 4
    assert len(data["progress_series"]) == 4

def test_principal_dashboard_endpoint(client: TestClient):
    response = client.get("/api/v1/dashboard/principal", headers={"X-Demo-Role": "principal"})
    assert response.status_code == 200
    data = response.json()
    assert data["scope"] == "principal"
    assert data["metrics"][0]["numeric_value"] == 12500

def test_student_dashboard_endpoint(client: TestClient):
    response = client.get("/api/v1/dashboard/student", headers={"X-Demo-Role": "student"})
    assert response.status_code == 200
    data = response.json()
    assert data["scope"] == "student"
    assert data["taraz_estimate"] == 9480

def test_counselor_overview_and_at_risk(client: TestClient):
    resp = client.get("/api/v1/counselor/overview", headers={"X-Demo-Role": "counselor"})
    assert resp.status_code == 200
    assert len(resp.json()["shap_features"]) == 3

    resp_students = client.get("/api/v1/counselor/students/at-risk", headers={"X-Demo-Role": "counselor"})
    assert resp_students.status_code == 200
    assert len(resp_students.json()) >= 1

def test_counselor_outreach_approval_gate(client: TestClient):
    # Without explicit counselor confirmation -> 422
    resp_unconfirmed = client.post(
        "/api/v1/counselor/outreach/approve",
        headers={"X-Demo-Role": "counselor"},
        json={
            "student_id": "st-109",
            "custom_message": "دعوت به جلسه مشاوره",
            "confirmed_by_counselor": False,
        },
    )
    assert resp_unconfirmed.status_code == 422

    # With explicit counselor confirmation -> 200
    resp_confirmed = client.post(
        "/api/v1/counselor/outreach/approve",
        headers={"X-Demo-Role": "counselor"},
        json={
            "student_id": "st-109",
            "custom_message": "دعوت به جلسه مشاوره",
            "confirmed_by_counselor": True,
        },
    )
    assert resp_confirmed.status_code == 200
    assert resp_confirmed.json()["success"] is True

def test_studio_validate_endpoint(client: TestClient):
    payload = {
        "expression": "v0 * sin(theta) + g * t",
        "parameters": [
            {"id": "1", "symbol": "v0", "label": "سرعت", "min_val": 10.0, "max_val": 30.0, "step": 5.0},
            {"id": "2", "symbol": "theta", "label": "زاویه", "min_val": 15.0, "max_val": 75.0, "step": 15.0},
            {"id": "3", "symbol": "g", "label": "گرانش", "min_val": 9.8, "max_val": 10.0, "step": 0.2},
            {"id": "4", "symbol": "t", "label": "زمان", "min_val": 1.0, "max_val": 5.0, "step": 1.0},
        ],
    }
    resp = client.post("/api/v1/studio/questions/validate", headers={"X-Demo-Role": "teacher"}, json=payload)
    assert resp.status_code == 200
    assert resp.json()["is_valid"] is True

def test_studio_generate_variants_endpoint(client: TestClient):
    payload = {
        "template_expression": "a * x + b",
        "parameters": [
            {"id": "1", "symbol": "a", "label": "ضریب a", "min_val": 1.0, "max_val": 5.0, "step": 1.0},
            {"id": "2", "symbol": "b", "label": "ضریب b", "min_val": 2.0, "max_val": 10.0, "step": 2.0},
            {"id": "3", "symbol": "x", "label": "متغیر x", "min_val": 1.0, "max_val": 5.0, "step": 1.0},
        ],
        "variant_count": 5,
    }
    resp = client.post("/api/v1/studio/questions/generate-variants", headers={"X-Demo-Role": "teacher"}, json=payload)
    assert resp.status_code == 200
    assert resp.json()["count"] == 5

def test_integrity_signals_endpoint(client: TestClient):
    resp = client.get("/api/v1/integrity/signals", headers={"X-Demo-Role": "teacher"})
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["nodes"]) == 5
    assert len(data["edges"]) == 3
    assert "سیگنال" in data["non_verdict_disclaimer"]

def test_assessment_clusters_and_batch_score(client: TestClient):
    resp = client.get("/api/v1/assessments/math-12-exam/clusters", headers={"X-Demo-Role": "teacher"})
    assert resp.status_code == 200
    clusters = resp.json()
    assert len(clusters) == 3

    # Batch score
    score_payload = {"cluster_id": "cls-1", "score": 20.0}
    resp_score = client.post(
        "/api/v1/assessments/math-12-exam/clusters/batch-score",
        headers={"X-Demo-Role": "teacher"},
        json=score_payload,
    )
    assert resp_score.status_code == 200
    assert resp_score.json()["success"] is True

def test_regrades_submission_endpoint(client: TestClient):
    payload = {
        "student_id": "st-109",
        "assessment_id": "math-12-midterm",
        "question_number": 2,
        "claimed_issue": "ضریب منفی اشتباه خوانده شده است.",
    }
    resp = client.post("/api/v1/regrades", headers={"X-Demo-Role": "student"}, json=payload)
    assert resp.status_code == 200
    assert resp.json()["status"] == "pending_teacher_review"

def test_audio_lesson_endpoint(client: TestClient):
    resp = client.get("/api/v1/audio/lessons/phys-12-06")
    assert resp.status_code == 200
    assert resp.json()["total_duration_seconds"] == 1730

def test_audit_log_endpoint(client: TestClient):
    resp = client.get("/api/v1/audit", headers={"X-Demo-Role": "counselor"})
    assert resp.status_code == 200
    logs = resp.json()
    assert len(logs) >= 2
