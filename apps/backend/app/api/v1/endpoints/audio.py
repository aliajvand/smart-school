from fastapi import APIRouter, HTTPException, status
from app.schemas.audio import AudioLessonResponse, AudioTopicSchema

router = APIRouter(prefix="/audio", tags=["Audio Classroom"])

@router.get("/lessons/{lesson_id}", response_model=AudioLessonResponse)
def get_audio_lesson(lesson_id: str):
    """
    Returns audio lesson waveform peaks and synchronized notes/topics.
    """
    if lesson_id == "not-found":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"درس با شناسه '{lesson_id}' یافت نشد.",
        )
        
    return AudioLessonResponse(
        id=lesson_id,
        title="پلیر صوتی کلاس و جزوه هوشمند",
        course_title="کلاس فیزیک ۳ — پایه دوازدهم ریاضی",
        session_title="جلسه ۶: تحلیل شتاب ثابت و معادلات حرکت",
        total_duration_seconds=1730,
        current_playback_seconds=194,
        waveform_peaks=[
            12, 24, 45, 68, 85, 92, 78, 64, 52, 60,
            74, 90, 82, 70, 55, 40, 62, 88, 95, 75,
            60, 45, 55, 70, 84, 92, 80, 65, 50, 40,
        ],
        topics=[
            AudioTopicSchema(
                id="top-1",
                timestamp_seconds=0,
                title="مقدمه و یادآوری بردار سرعت و مکان",
                summary="بررسی مفهوم شیب خط در نمودار مکان-زمان و تعریف سرعت لحظه‌ای.",
                is_active=False,
            ),
            AudioTopicSchema(
                id="top-2",
                timestamp_seconds=194,
                title="تعریف شتاب و حرکت با شتاب ثابت",
                summary="تحلیل مساحت زیر نمودار سرعت-زمان و اثبات فرمول مستقل از زمان.",
                is_active=True,
            ),
            AudioTopicSchema(
                id="top-3",
                timestamp_seconds=600,
                title="حل مثال نمونه: سقوط آزاد با مقاومت ناچیز هوا",
                summary="بررسی سقوط گلوله از ارتفاع h با شتاب گرانشی g=9.8.",
                is_active=False,
            ),
        ],
    )
