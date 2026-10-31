import os
import sys
import cv2
import numpy as np

# Ensure UTF-8 output encoding for Windows terminal
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../apps/backend")))
from app.services.vision_engine import vision_engine

OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data/vision_test_suite/scenarios"))
os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_all_scenarios():
    print(f"--- Generating Vision Evaluation Scenarios in: {OUTPUT_DIR} ---")
    
    # 1. Scenario 1: Perfect Exam Sheet (100% score, 4 ArUco locked, crisp)
    sheet_base = vision_engine.generate_synthetic_sheet()
    np_arr = np.frombuffer(sheet_base, np.uint8)
    base_img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    
    p1 = os.path.join(OUTPUT_DIR, "scenario_01_perfect_full_grade.jpg")
    cv2.imwrite(p1, base_img)
    print("Created: scenario_01_perfect_full_grade.jpg (پاسخ کامل، بدون خطا، تصویر شارپ)")

    # 2. Scenario 2: Severe Perspective Skew (Simulating photo taken at 35-degree angle)
    h, w = base_img.shape[:2]
    src_pts = np.float32([[0, 0], [w, 0], [w, h], [0, h]])
    dst_pts = np.float32([[w * 0.12, h * 0.08], [w * 0.88, h * 0.02], [w * 0.96, h * 0.92], [w * 0.04, h * 0.98]])
    matrix = cv2.getPerspectiveTransform(src_pts, dst_pts)
    skewed = cv2.warpPerspective(base_img, matrix, (w, h), borderValue=(240, 240, 240))
    p2 = os.path.join(OUTPUT_DIR, "scenario_02_skewed_perspective_35deg.jpg")
    cv2.imwrite(p2, skewed)
    print("Created: scenario_02_skewed_perspective_35deg.jpg (زاویه دست دوربین کج و اعوجاج پرسپکتیو)")

    # 3. Scenario 3: Heavy Blur / Shaky Camera (Testing Laplacian Sharpness Rejection)
    blurred = cv2.GaussianBlur(base_img, (31, 31), 10.0)
    p3 = os.path.join(OUTPUT_DIR, "scenario_03_heavy_blur_laplacian_fail.jpg")
    cv2.imwrite(p3, blurred)
    print("Created: scenario_03_heavy_blur_laplacian_fail.jpg (تصویر تار و لرزان جهت سنجش و هشدار)")

    # 4. Scenario 4: Calculation Sign Error in Step 2
    error_img = base_img.copy()
    margin = 40
    cv2.rectangle(error_img, (margin + 40, margin + 410), (w - margin - 40, margin + 540), (255, 255, 255), -1)
    ink_color = (180, 50, 20)
    cv2.putText(error_img, "Step 2: F(1) - F(-1) = 1 - 3 = -2  [SIGN ERROR]", (margin + 50, margin + 460), cv2.FONT_HERSHEY_SCRIPT_SIMPLEX, 0.8, ink_color, 2)
    cv2.putText(error_img, "Step 3: Final Answer = -2  [WRONG]", (margin + 50, margin + 530), cv2.FONT_HERSHEY_SCRIPT_SIMPLEX, 0.8, ink_color, 2)
    p4 = os.path.join(OUTPUT_DIR, "scenario_04_math_error_in_step2.jpg")
    cv2.imwrite(p4, error_img)
    print("Created: scenario_04_math_error_in_step2.jpg (خطای علامتی در گام دوم جهت کسر نمره بارم)")

    # 5. Scenario 5: Missing Corner (Only 3 ArUco markers visible - paper folded/occluded)
    missing_corner = base_img.copy()
    cv2.rectangle(missing_corner, (0, h - 180), (180, h), (255, 255, 255), -1)
    p5 = os.path.join(OUTPUT_DIR, "scenario_05_missing_corner_folded.jpg")
    cv2.imwrite(p5, missing_corner)
    print("Created: scenario_05_missing_corner_folded.jpg (گوشه کاغذ تاخورده / فقدان مارکر چهارم)")

    print(f"\nAll 5 scenario sheets successfully generated in: {OUTPUT_DIR}")

if __name__ == "__main__":
    generate_all_scenarios()
