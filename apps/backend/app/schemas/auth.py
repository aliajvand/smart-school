from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional

class LoginRequest(BaseModel):
    username: str = Field(..., description="نام کاربری")
    password: str = Field(..., description="رمز عبور")

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    full_name: str
    role: str
    is_active: bool

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class PurchaseLicenseRequest(BaseModel):
    organization_name: str = Field(..., description="نام مدرسه یا موسسه آموزشی", min_length=3)
    package_type: str = Field("GOLD_INSTITUTIONAL", description="نوع پلن اشتراک")
    max_seats: int = Field(500, description="تعداد کل ظرفیت دانش‌آموزان و دبیران")
    contact_email: str = Field(..., description="ایمیل مسئول یا مدیر مدرسه")
    contact_phone: str = Field(..., description="شماره تماس جهت پشتیبانی و تایید")
    admin_full_name: str = Field(..., description="نام و نام خانوادگی مدیر یا نماینده")

class IssuedCredentials(BaseModel):
    username: str
    password: str
    role: str = "principal"
    full_name: str
    note: str

class PurchaseLicenseResponse(BaseModel):
    success: bool
    message: str
    license_key: str
    organization_name: str
    max_seats: int
    credentials: IssuedCredentials

class RoleDetail(BaseModel):
    role: str
    title_fa: str
    description_fa: str
    allowed_routes: List[str]
    capabilities: List[str]
    demo_username: str
    demo_password: str

class RolesInfoResponse(BaseModel):
    roles: List[RoleDetail]
