from fastapi import APIRouter, UploadFile, File, HTTPException, Response, status
from app.services.vision_engine import vision_engine

router = APIRouter(prefix="/vision", tags=["Vision & OCR Processing"])

@router.post("/scan-sheet")
async def scan_exam_sheet(file: UploadFile = File(...)):
    """
    Process an uploaded exam answer sheet:
    - Assesses image blur / sharpness using Laplacian variance
    - Detects 4 ArUco corner markers for alignment
    - Corrects perspective distortion via homography warp
    - Segments handwriting steps and evaluates mathematical equivalence
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="فایل ارسالی باید تصویر (JPEG یا PNG) باشد.",
        )
    
    try:
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="فایل تصویر ارسالی خالی است.",
            )
        result = vision_engine.analyze_sheet_bytes(contents)
        return result
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(ve),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"خطا در پردازش تصویر برگه: {str(e)}",
        )

@router.get("/synthetic-sheet")
def get_synthetic_sheet():
    """
    Generate and return a synthetic exam sheet JPEG with 4 real ArUco markers
    and sample calculus solution for testing and demonstration.
    """
    try:
        jpg_bytes = vision_engine.generate_synthetic_sheet()
        return Response(content=jpg_bytes, media_type="image/jpeg")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"خطا در ایجاد برگه آزمایشی: {str(e)}",
        )

@router.post("/test-synthetic-scan")
def test_synthetic_scan():
    """
    Instantly run the synthetic sheet through the vision pipeline
    without requiring manual camera upload.
    """
    try:
        jpg_bytes = vision_engine.generate_synthetic_sheet()
        result = vision_engine.analyze_sheet_bytes(jpg_bytes)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"خطا در ارزیابی برگه آزمایشی: {str(e)}",
        )
