import datetime
import bcrypt
import jwt
from typing import List, Optional
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.entities import User

DEMO_ROLES = {"teacher", "principal", "counselor", "student"}

# OAuth2 scheme - allows token retrieval from Authorization: Bearer <token>
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

def hash_password(password: str) -> str:
    """Hash a password using direct bcrypt (safe up to 72 bytes)."""
    pwd_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against the stored bcrypt hash."""
    try:
        pwd_bytes = plain_password.encode("utf-8")[:72]
        return bcrypt.checkpw(pwd_bytes, hashed_password.encode("utf-8"))
    except Exception:
        return False

def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None) -> str:
    """Create a signed JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.now(datetime.timezone.utc) + expires_delta
    else:
        expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate a JWT access token."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except Exception:
        return None

def get_current_role(
    x_demo_role: Optional[str] = Header(
        default="teacher",
        alias="X-Demo-Role",
        description="Role simulation header for backwards compatibility",
    ),
    token: Optional[str] = Depends(oauth2_scheme),
) -> str:
    """
    Extracts the user's role from JWT token or fallback X-Demo-Role header.
    Defaults to 'teacher'. Validates role string.
    """
    if token:
        payload = decode_access_token(token)
        if payload and "role" in payload:
            return payload["role"]
            
    if x_demo_role is not None:
        clean = x_demo_role.strip().lower()
        if clean in DEMO_ROLES:
            return clean
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or missing X-Demo-Role. Allowed demo roles: {', '.join(sorted(DEMO_ROLES))}",
            headers={"X-Auth-Type": "DEMO_AUTH_NOT_PRODUCTION"},
        )
    return "teacher"

def get_current_user(
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme),
    x_demo_role: Optional[str] = Header(None, alias="X-Demo-Role"),
) -> User:
    """
    Authenticate user via Bearer JWT token.
    Backwards compatibility: If X-Demo-Role header is passed without token,
    resolves to the designated demo user for that role.
    """
    if token:
        payload = decode_access_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="توکن نامعتبر یا منقضی شده است.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        username = payload.get("sub")
        if not username:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="شناسه کاربر در توکن یافت نشد.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user = db.query(User).filter(User.username == username).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="کاربر متناظر با توکن در پایگاه داده یافت نشد.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user

    # Backwards-compatible / testing demo role fallback
    if x_demo_role:
        role_clean = x_demo_role.strip().lower()
        user = db.query(User).filter(User.role == role_clean).first()
        if user:
            return user
        return User(
            id=999,
            username=f"{role_clean}_demo",
            full_name=f"کاربر آزمایشی ({role_clean})",
            role=role_clean,
            is_active=True,
            hashed_password="mock",
        )

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="احراز هویت الزامی است. لطفاً توکن دسترسی معتبر ارسال فرمایید.",
        headers={"WWW-Authenticate": "Bearer"},
    )

def require_roles(allowed_roles: List[str]):
    """
    FastAPI dependency to enforce Role-Based Access Control (RBAC).
    Accepts JWT Bearer token or X-Demo-Role header.
    """
    def role_checker(role: str = Depends(get_current_role)) -> str:
        if role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied for role '{role}'. Required roles: {', '.join(allowed_roles)}",
                headers={"X-Auth-Type": "DEMO_AUTH_NOT_PRODUCTION"},
            )
        return role
    return role_checker
