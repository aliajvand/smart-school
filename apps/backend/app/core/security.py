from typing import List, Optional
from fastapi import Header, HTTPException, status

# NOTE: Explicitly labelled as DEMO AUTH, not production authentication.
# In production, replace with verified JWT / OAuth2 bearer tokens.

DEMO_ROLES = {"teacher", "principal", "counselor", "student"}

def get_current_role(
    x_demo_role: Optional[str] = Header(
        default="teacher",
        description="DEMO AUTH ONLY: Role simulation header (teacher, principal, counselor, student)",
    )
) -> str:
    """
    Extracts and validates the demo role header.
    Returns 401 if an invalid role is provided.
    """
    if not x_demo_role or x_demo_role.lower() not in DEMO_ROLES:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or missing X-Demo-Role. Allowed demo roles: {', '.join(sorted(DEMO_ROLES))}",
            headers={"X-Auth-Type": "DEMO_AUTH_NOT_PRODUCTION"},
        )
    return x_demo_role.lower()

def require_roles(allowed_roles: List[str]):
    """
    Factory for role-based authorization in demo mode.
    Returns 403 Forbidden if the user's role is not in allowed_roles.
    """
    def role_checker(role: str = Header(default="teacher", alias="X-Demo-Role")) -> str:
        current = get_current_role(role)
        if current not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied for role '{current}'. Required roles: {', '.join(allowed_roles)}",
                headers={"X-Auth-Type": "DEMO_AUTH_NOT_PRODUCTION"},
            )
        return current
    return role_checker
