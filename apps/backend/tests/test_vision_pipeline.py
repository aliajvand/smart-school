import io
import pytest
from fastapi.testclient import TestClient

def test_synthetic_sheet_generation_and_scan(client: TestClient):
    # 1. Test downloading synthetic sheet
    img_res = client.get("/api/v1/vision/synthetic-sheet")
    assert img_res.status_code == 200
    assert img_res.headers["content-type"] == "image/jpeg"
    assert len(img_res.content) > 10000

    # 2. Test direct synthetic scan endpoint
    scan_res = client.post("/api/v1/vision/test-synthetic-scan")
    assert scan_res.status_code == 200
    data = scan_res.json()
    assert data["success"] is True
    assert data["sharpness"]["score_percent"] >= 80.0
    assert data["sharpness"]["is_acceptable"] is True
    assert data["alignment"]["markers_detected"] == 4
    assert data["alignment"]["all_corners_found"] is True
    assert data["alignment"]["perspective_rectified"] is True

    # 3. Check mathematical step evaluation
    eval_data = data["evaluation"]
    assert len(eval_data["steps"]) == 3
    assert eval_data["total_score"] == 2.5
    assert eval_data["grade_percent"] == 100.0
    for step in eval_data["steps"]:
        assert step["is_correct"] is True
        assert step["sympy_verified"] is True

def test_upload_scan_sheet(client: TestClient):
    # Get synthetic sheet JPEG
    img_res = client.get("/api/v1/vision/synthetic-sheet")
    img_bytes = img_res.content

    # Upload via multipart file to /vision/scan-sheet
    response = client.post(
        "/api/v1/vision/scan-sheet",
        files={"file": ("test_exam.jpg", io.BytesIO(img_bytes), "image/jpeg")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["alignment"]["all_corners_found"] is True
    assert data["evaluation"]["total_score"] == 2.5

def test_upload_invalid_file_type(client: TestClient):
    response = client.post(
        "/api/v1/vision/scan-sheet",
        files={"file": ("notes.txt", io.BytesIO(b"Hello world math test"), "text/plain")},
    )
    assert response.status_code == 400
    assert "باید تصویر" in response.json()["detail"]
