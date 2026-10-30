import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(50), nullable=False, index=True)  # student, teacher, counselor, principal
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    created_assessments = relationship("Assessment", back_populates="creator")
    submissions = relationship("Submission", back_populates="student")

    def __repr__(self):
        return f"<User {self.username} ({self.role})>"


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    grade_major = Column(String(100), default="دوازدهم ریاضی و فیزیک")
    taraz_min = Column(Float, default=6200.0)
    taraz_max = Column(Float, default=6850.0)
    risk_score = Column(Float, default=0.18)
    status = Column(String(50), default="STABLE")  # STABLE, WATCHLIST, CRITICAL

    user = relationship("User", back_populates="student_profile")


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    course = Column(String(100), default="حسابان و دیفرانسیل پیشرفته")
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    creator = relationship("User", back_populates="created_assessments")
    submissions = relationship("Submission", back_populates="assessment", cascade="all, delete-orphan")


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    score = Column(Float, default=0.0)
    raw_image_url = Column(String(500), nullable=True)
    status = Column(String(50), default="GRADED")  # GRADED, REGRADE_REQUESTED, FLAGGED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    assessment = relationship("Assessment", back_populates="submissions")
    student = relationship("User", back_populates="submissions")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(100), nullable=False, index=True)
    actor_username = Column(String(100), nullable=False)
    actor_role = Column(String(50), nullable=False)
    target_id = Column(String(100), nullable=True)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)


class OrganizationLicense(Base):
    __tablename__ = "organization_licenses"

    id = Column(Integer, primary_key=True, index=True)
    organization_name = Column(String(150), nullable=False)
    package_type = Column(String(50), default="GOLD_INSTITUTIONAL")  # GOLD_INSTITUTIONAL, STANDARD_SCHOOL
    max_seats = Column(Integer, default=500)
    license_key = Column(String(100), unique=True, index=True, nullable=False)
    contact_email = Column(String(150), nullable=False)
    contact_phone = Column(String(50), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
