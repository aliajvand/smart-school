import os
import sys

# Ensure apps/backend is in sys.path when executed directly
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from sqlalchemy.orm import Session
from app.db.session import engine, Base, SessionLocal
from app.models.entities import User, StudentProfile, Assessment, Submission, OrganizationLicense
from app.core.security import hash_password

def init_db(db: Session | None = None) -> None:
    """Create all tables and seed standard demo credentials for the 4 platform roles."""
    Base.metadata.create_all(bind=engine)
    
    should_close = False
    if db is None:
        db = SessionLocal()
        should_close = True

    try:
        # Check if users already seeded
        existing_user = db.query(User).filter(User.username == "student_demo").first()
        if not existing_user:
            # 1. Student
            student = User(
                username="student_demo",
                hashed_password=hash_password("student123"),
                full_name="سارا حسینی",
                role="student",
                is_active=True,
            )
            db.add(student)
            db.flush()

            profile = StudentProfile(
                user_id=student.id,
                grade_major="دوازدهم تجربی - الف",
                taraz_min=6540.0,
                taraz_max=7120.0,
                risk_score=0.12,
                status="STABLE",
            )
            db.add(profile)

            # 2. Teacher
            teacher = User(
                username="teacher_demo",
                hashed_password=hash_password("teacher123"),
                full_name="دکتر علی مرادی (مربی / معلم ریاضی)",
                role="teacher",
                is_active=True,
            )
            db.add(teacher)
            db.flush()

            # 3. Counselor
            counselor = User(
                username="counselor_demo",
                hashed_password=hash_password("counselor123"),
                full_name="استاد زهرا کمالی (مشاور تحصیلی و EWS)",
                role="counselor",
                is_active=True,
            )
            db.add(counselor)

            # 4. Principal
            principal = User(
                username="principal_demo",
                hashed_password=hash_password("principal123"),
                full_name="مهندس علیرضا رضایی (مدیریت دبیرستان)",
                role="principal",
                is_active=True,
            )
            db.add(principal)

            # 5. Default Organization License
            license_entry = OrganizationLicense(
                organization_name="مجتمع آموزشی و دبیرستان نمونه آینده",
                package_type="GOLD_INSTITUTIONAL",
                max_seats=1200,
                license_key="SCH-2026-TEH-GOLD-01",
                contact_email="principal@sch-ayandeh.ir",
                contact_phone="02188776655",
                is_active=True,
            )
            db.add(license_entry)

            # 6. Sample Assessment & Submission
            assessment = Assessment(
                title="آزمون جامع حسابان و دیفرانسیل - مرحله دوم",
                course="ریاضی و حسابان پیشرفته",
                created_by=teacher.id,
            )
            db.add(assessment)
            db.flush()

            submission = Submission(
                assessment_id=assessment.id,
                student_id=student.id,
                score=18.5,
                raw_image_url="/assets/scans/sample_calculus_p1.jpg",
                status="GRADED",
            )
            db.add(submission)

            db.commit()
            print("Database initialized and 4 role demo accounts seeded successfully.")
        else:
            print("Database already contains seeded accounts.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        if should_close:
            db.close()

if __name__ == "__main__":
    init_db()
