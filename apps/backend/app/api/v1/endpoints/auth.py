import secrets
import string
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.entities import User, OrganizationLicense, AuditLog
from app.core.security import (
    verify_password,
    hash_password,
    create_access_token,
    get_current_user,
    require_roles,
)
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    UserOut,
    PurchaseLicenseRequest,
    PurchaseLicenseResponse,
    IssuedCredentials,
    RolesInfoResponse,
    RoleDetail,
)

router = APIRouter(prefix="/auth", tags=["Authentication & Roles"])

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate user by username and password, returning JWT Bearer token and role profile.
    """
    user = db.query(User).filter(User.username == request.username.strip()).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="نام کاربری یا رمز عبور وارد شده نادرست است.",
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="حساب کاربری غیرفعال شده است. لطفاً با مدیریت تماس بگیرید.",
        )

    # Issue JWT token
    token = create_access_token(data={"sub": user.username, "role": user.role, "uid": user.id})

    return LoginResponse(
        access_token=token,
        token_type="bearer",
        user=UserOut.model_validate(user),
    )


@router.post("/purchase-license", response_model=PurchaseLicenseResponse)
def purchase_license(request: PurchaseLicenseRequest, db: Session = Depends(get_db)):
    """
    Purchase organizational license & automatically issue primary master/principal credentials.
    Instantly provisions institutional access key and master admin account.
    """
    # 1. Generate unique license key
    random_code = secrets.token_hex(4).upper()
    license_key = f"SCH-2026-{random_code}"

    # 2. Generate master principal username & secure password
    random_suffix = secrets.token_hex(2)
    clean_org = "".join(c for c in request.organization_name if c.isalnum())[:8] or "org"
    principal_username = f"admin_{clean_org.lower()}_{random_suffix}"
    
    # Generate human-friendly strong password
    chars = string.ascii_letters + string.digits
    raw_pass = "".join(secrets.choice(chars) for _ in range(8))
    generated_password = f"Sch@{raw_pass}"

    # 3. Create Principal User
    principal_user = User(
        username=principal_username,
        hashed_password=hash_password(generated_password),
        full_name=f"{request.admin_full_name} (مدیر {request.organization_name})",
        role="principal",
        is_active=True,
    )
    db.add(principal_user)
    db.flush()

    # 4. Create Organization License record
    license_record = OrganizationLicense(
        organization_name=request.organization_name,
        package_type=request.package_type,
        max_seats=request.max_seats,
        license_key=license_key,
        contact_email=request.contact_email,
        contact_phone=request.contact_phone,
        is_active=True,
    )
    db.add(license_record)

    # 5. Audit Log
    audit_entry = AuditLog(
        action="LICENSE_PURCHASED_AND_PROVISIONED",
        actor_username=principal_username,
        actor_role="principal",
        target_id=license_key,
        details=f"خرید بسته {request.package_type} با ظرفیت {request.max_seats} کاربر برای موسسه {request.organization_name}",
    )
    db.add(audit_entry)
    db.commit()

    return PurchaseLicenseResponse(
        success=True,
        message="لایسنس سازمانی با موفقیت فعال شد و مشخصات دسترسی اکانت اصلی صادر گردید.",
        license_key=license_key,
        organization_name=request.organization_name,
        max_seats=request.max_seats,
        credentials=IssuedCredentials(
            username=principal_username,
            password=generated_password,
            role="principal",
            full_name=principal_user.full_name,
            note="با این نام کاربری و رمز عبور می‌توانید بلافاصله به داشبورد مدیریتی مدرسه وارد شوید.",
        ),
    )


@router.get("/me")
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """
    Get profile of the currently authenticated user with effective permissions.
    """
    role_permissions = {
        "student": ["view_own_grades", "view_own_taraz", "listen_audio_lessons", "submit_regrade"],
        "teacher": ["view_class_analytics", "batch_grade_clusters", "design_parametric_questions", "inspect_integrity"],
        "counselor": ["view_ews_dashboard", "review_at_risk_students", "shap_explainability", "human_gate_outreach"],
        "principal": ["view_schoolwide_analytics", "audit_compliance", "manage_licenses", "view_all_dashboards"],
    }
    return {
        "user": UserOut.model_validate(current_user),
        "permissions": role_permissions.get(current_user.role, []),
    }


@router.get("/roles-info", response_model=RolesInfoResponse)
def get_roles_info():
    """
    Provides catalog of all 4 distinct roles, their route permissions, and quick demo credentials.
    """
    roles = [
        RoleDetail(
            role="student",
            title_fa="دانش‌آموز",
            description_fa="مشاهده کارنامه فردی، تحلیل تراز پایدار، درسنامه صوتی هوشمند و کوئیز سریع کلاسی",
            allowed_routes=["/student", "/mobile-preview"],
            capabilities=[
                "مشاهده نمودار پیشرفت و تراز علمی",
                "دسترسی به پادکست‌های صوتی تدریس با رونویسی خودکار",
                "شرکت در کوئیزهای ارزیابی هوشمند",
                "ثبت و پیگیری اعتراض به نمره با استدلال علمی",
            ],
            demo_username="student_demo",
            demo_password="student123",
        ),
        RoleDetail(
            role="teacher",
            title_fa="معلم و مربی آموزشی",
            description_fa="تحلیل عملکرد کلاس، تصحیح خوشه‌ای برگه‌ها، رادار تقلب و طراحی سوالات پارامتریک",
            allowed_routes=["/dashboard", "/studio", "/mobile-preview"],
            capabilities=[
                "داشبورد تحلیلی عملکرد کلاس و توزیع چارک‌ها",
                "طراحی سوالات پارامتریک ریاضی با موتور فرمولی",
                "تصحیح خوشه‌ای برگه‌های دست‌نویس با یک کلیک",
                "رادار تشخیص پاسخ‌های مشکوک و شباهت‌سنجی تقلب",
            ],
            demo_username="teacher_demo",
            demo_password="teacher123",
        ),
        RoleDetail(
            role="counselor",
            title_fa="مشاور تحصیلی (EWS)",
            description_fa="سیستم هشدار زودهنگام، صف دانش‌آموزان در معرض افت، تبیین‌پذیری SHAP و تایید مداخله انسانی",
            allowed_routes=["/counselor", "/dashboard"],
            capabilities=[
                "رصد شاخص هشدار زودهنگام (EWS) با وزن‌دهی نمایی EWMA",
                "مشاهده فاکتورهای ریسک با مدل علی و تبیین‌پذیری SHAP",
                "گیت تایید انسانی الزامی قبل از ارسال پیام مداخله به والدین",
                "رهگیری تغییرات رفتاری و تراز دانش‌آموزان حساس",
            ],
            demo_username="counselor_demo",
            demo_password="counselor123",
        ),
        RoleDetail(
            role="principal",
            title_fa="مدیر مدرسه و ستاد",
            description_fa="دید کلان مدرسه (۱۲,۵۰۰ دانش‌آموز)، پایش ممیزی امنیتی، مدیریت لایسنس و دسترسی جامع",
            allowed_routes=["/dashboard", "/counselor", "/studio", "/student", "/mobile-preview"],
            capabilities=[
                "نظارت بر کلیه بخش‌ها و داشبوردهای سیستم به صورت جامع",
                "گزارش ممیزی کامل اقدامات مشاوران و معلمان",
                "مدیریت لایسنس سازمانی و تخصیص ظرفیت مدارس",
                "بررسی نرخ کلی موفقیت و تحلیل استراتژیک آموزشی",
            ],
            demo_username="principal_demo",
            demo_password="principal123",
        ),
    ]
    return RolesInfoResponse(roles=roles)
