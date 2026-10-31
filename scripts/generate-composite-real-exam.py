import os
import sys
import cv2
import numpy as np

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../apps/backend")))
from app.services.vision_engine import vision_engine

OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data/vision_test_suite/scenarios"))
os.makedirs(OUTPUT_DIR, exist_ok=True)

HODA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data/vision_test_suite/real_handwriting/hoda_persian_digits/samples/Hoda_Test_20000"))
MATH_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data/vision_test_suite/real_handwriting/math_expressions/samples/2014"))
PERSIAN_PAGE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../data/vision_test_suite/real_handwriting/persian_text_answers/page_0000.jpg"))

def overlay_transparent(bg, overlay, x, y, max_w=None, max_h=None):
    """Place overlay image onto background with white background blending."""
    if overlay is None or bg is None:
        return
    
    # Resize if needed
    h, w = overlay.shape[:2]
    if max_w and max_h:
        scale = min(max_w / w, max_h / h)
        overlay = cv2.resize(overlay, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
        h, w = overlay.shape[:2]

    # Convert to 3 channels if grayscale
    if len(overlay.shape) == 2:
        overlay = cv2.cvtColor(overlay, cv2.COLOR_GRAY2BGR)

    # Invert or threshold if it's dark text on white
    # We blend minimum pixel value (dark ink onto bg)
    roi = bg[y : y + h, x : x + w]
    if roi.shape[:2] == overlay.shape[:2]:
        blended = np.minimum(roi, overlay)
        bg[y : y + h, x : x + w] = blended

def create_real_handwritten_exam_sheet():
    print("--- Creating Real Human Handwritten Exam Sheet ---")
    width, height = 900, 1250
    # Clean paper texture
    page = np.full((height, width, 3), 252, dtype=np.uint8)

    # 1. Place 4 ArUco markers (size 90x90) with clean quiet zone
    aruco_dict = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_4X4_50)
    marker_size = 90
    margin = 40
    positions = {
        0: (margin, margin),
        1: (width - margin - marker_size, margin),
        2: (width - margin - marker_size, height - margin - marker_size),
        3: (margin, height - margin - marker_size),
    }

    for marker_id, (px, py) in positions.items():
        marker_img = cv2.aruco.generateImageMarker(aruco_dict, marker_id, marker_size)
        for c in range(3):
            page[py : py + marker_size, px : px + marker_size, c] = marker_img

    # 2. Header Box
    cv2.rectangle(page, (margin + 120, margin + 5), (width - margin - 120, margin + 90), (245, 247, 250), -1)
    cv2.rectangle(page, (margin + 120, margin + 5), (width - margin - 120, margin + 90), (200, 210, 220), 1)

    cv2.putText(page, "AYANDEH SMART SCHOOL - REAL EXAM SHEET", (margin + 140, margin + 45), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (30, 41, 59), 2)
    cv2.putText(page, "Subject: Physics & Geology  |  Student ID (Hoda Digits):", (margin + 140, margin + 75), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (100, 116, 139), 1)

    # 3. LEVEL 1: Real Persian Handwritten Digits from Hoda Dataset (Student ID: 9 8 4 0 2)
    digits_to_use = ['9', '8', '4', '0', '2']
    start_x = margin + 500
    for idx, d in enumerate(digits_to_use):
        d_dir = os.path.join(HODA_DIR, d)
        if os.path.exists(d_dir):
            files = [f for f in os.listdir(d_dir) if f.endswith('.png')]
            if files:
                digit_img = cv2.imread(os.path.join(d_dir, files[0]))
                if digit_img is not None:
                    # Invert if white digit on black background (Hoda raw format)
                    if np.mean(digit_img) < 128:
                        digit_img = 255 - digit_img
                    overlay_transparent(page, digit_img, start_x + (idx * 30), margin + 58, max_w=24, max_h=24)

    # 4. LEVEL 2: Real Handwritten Mathematical & Physics Formulas from CROHME
    cv2.rectangle(page, (margin + 20, margin + 120), (width - margin - 20, margin + 420), (255, 255, 255), 1)
    cv2.putText(page, "Section 1: Physics Dynamics - Derive equation of motion:", (margin + 40, margin + 150), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (3, 105, 161), 2)

    # Find CROHME formula samples
    if os.path.exists(MATH_DIR):
        math_files = sorted([f for f in os.listdir(MATH_DIR) if f.endswith('.bmp')])
        # Sample 1: theta_3 = theta_1 + theta_2 or fraction formula
        if len(math_files) > 5:
            formula_1 = cv2.imread(os.path.join(MATH_DIR, math_files[3]))
            formula_2 = cv2.imread(os.path.join(MATH_DIR, math_files[5]))
            
            cv2.putText(page, "Student Handwritten Step 1 (Real CROHME sample):", (margin + 50, margin + 190), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (71, 85, 105), 1)
            overlay_transparent(page, formula_1, margin + 70, margin + 210, max_w=320, max_h=70)
            
            cv2.putText(page, "Student Handwritten Step 2 (Real CROHME sample):", (margin + 50, margin + 310), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (71, 85, 105), 1)
            overlay_transparent(page, formula_2, margin + 70, margin + 330, max_w=320, max_h=70)

    # 5. LEVEL 3: Real Persian Handwritten Text Answers from Scanned Paper (زمین‌شناسی و علوم)
    cv2.rectangle(page, (margin + 20, margin + 450), (width - margin - 20, height - margin - 120), (255, 255, 255), 1)
    cv2.putText(page, "Section 2: Geology & Science - Explain continental drift & rock cycle:", (margin + 40, margin + 480), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (3, 105, 161), 2)

    if os.path.exists(PERSIAN_PAGE_PATH):
        persian_page = cv2.imread(PERSIAN_PAGE_PATH)
        if persian_page is not None:
            # Crop real handwritten Persian lines from the page
            ph, pw = persian_page.shape[:2]
            # Crop 2 realistic paragraph sections from real human Persian handwriting
            crop_line1 = persian_page[int(ph * 0.15) : int(ph * 0.35), int(pw * 0.1) : int(pw * 0.9)]
            crop_line2 = persian_page[int(ph * 0.40) : int(ph * 0.65), int(pw * 0.1) : int(pw * 0.9)]

            cv2.putText(page, "Student Persian Handwriting (Descriptive text from real paper scan):", (margin + 50, margin + 515), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (71, 85, 105), 1)
            overlay_transparent(page, crop_line1, margin + 50, margin + 535, max_w=width - (margin * 2) - 100, max_h=230)
            
            overlay_transparent(page, crop_line2, margin + 50, margin + 790, max_w=width - (margin * 2) - 100, max_h=250)

    # Output file
    out_path = os.path.join(OUTPUT_DIR, "scenario_06_real_human_handwriting.jpg")
    cv2.imwrite(out_path, page, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
    print(f"Successfully created REAL human handwriting composite exam sheet:\n -> {out_path}")
    return out_path

if __name__ == "__main__":
    create_real_handwritten_exam_sheet()
