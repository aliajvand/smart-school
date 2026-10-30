from typing import List
from fastapi import APIRouter, Depends
from app.core.security import require_roles
from app.core.audit import get_audit_log, AuditEntry

router = APIRouter(prefix="/audit", tags=["Audit Log"])

@router.get("", response_model=List[AuditEntry])
def list_audit_logs(
    limit: int = 50,
    current_role: str = Depends(require_roles(["counselor", "principal"])),
):
    """
    Returns recent system audit events (restricted strictly to counselor and principal roles).
    """
    return get_audit_log(limit=limit)
