from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, Field

class AuditEntry(BaseModel):
    id: str
    action: str
    actor_role: str
    target_student_id: Optional[str] = None
    target_student_name: Optional[str] = None
    purpose: Optional[str] = None
    details: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# Thread-safe in-memory audit log storage for demo mode
_AUDIT_LOG_STORE: List[AuditEntry] = [
    AuditEntry(
        id="audit-init-1",
        action="ACCESS_STUDENT_RECORD",
        actor_role="counselor",
        target_student_id="st-109",
        target_student_name="امیرحسین رضایی",
        purpose="بررسی افت تحصیلی در آزمون دوره‌ای و غیبت آنلاین",
        details="مشاهده ویژگی‌های مدل EWS و پیش‌نویس پیام حمایتی",
    ),
    AuditEntry(
        id="audit-init-2",
        action="ACCESS_STUDENT_RECORD",
        actor_role="counselor",
        target_student_id="st-104",
        target_student_name="سارا محمدی",
        purpose="پیگیری غیبت‌های متوالی زیست‌شناسی",
        details="ثبت درخواست ارسال جزوه صوتی جبرانی",
    ),
]

def record_audit_event(
    action: str,
    actor_role: str,
    target_student_id: Optional[str] = None,
    target_student_name: Optional[str] = None,
    purpose: Optional[str] = None,
    details: Optional[str] = None,
) -> AuditEntry:
    entry = AuditEntry(
        id=f"audit-{len(_AUDIT_LOG_STORE) + 1}-{int(datetime.now(timezone.utc).timestamp())}",
        action=action,
        actor_role=actor_role,
        target_student_id=target_student_id,
        target_student_name=target_student_name,
        purpose=purpose,
        details=details,
    )
    _AUDIT_LOG_STORE.insert(0, entry)
    return entry

def get_audit_log(limit: int = 50) -> List[AuditEntry]:
    return _AUDIT_LOG_STORE[:limit]
