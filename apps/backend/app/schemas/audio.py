from typing import List, Optional
from pydantic import BaseModel

class AudioTopicSchema(BaseModel):
    id: str
    timestamp_seconds: int
    title: str
    summary: str
    is_active: bool = False

class AudioLessonResponse(BaseModel):
    id: str
    title: str
    course_title: str
    session_title: str
    total_duration_seconds: int
    current_playback_seconds: int
    waveform_peaks: List[int]
    topics: List[AudioTopicSchema]
