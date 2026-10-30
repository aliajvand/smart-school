'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  BookOpen,
  ShieldAlert,
  Building2,
  Lock,
  User,
  KeyRound,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  Mail,
  Phone,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAuth, UserRole } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, quickLogin, purchaseLicense, isLoading, error, clearError } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'purchase'>('login');

  // Standard Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Purchase State
  const [orgName, setOrgName] = useState('');
  const [packageType, setPackageType] = useState('GOLD_INSTITUTIONAL');
  const [maxSeats, setMaxSeats] = useState(1200);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [adminName, setAdminName] = useState('');
  const [purchasedInfo, setPurchasedInfo] = useState<any>(null);

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    const ok = await login(username, password);
    if (ok) {
      router.push('/dashboard');
    }
  };

  const handleRoleQuickLogin = async (role: UserRole) => {
    await quickLogin(role);
    if (role === 'student') {
      router.push('/student');
    } else if (role === 'counselor') {
      router.push('/counselor');
    } else {
      router.push('/dashboard');
    }
  };

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await purchaseLicense({
        organization_name: orgName,
        package_type: packageType,
        max_seats: Number(maxSeats),
        contact_email: contactEmail,
        contact_phone: contactPhone,
        admin_full_name: adminName,
      });
      setPurchasedInfo(res);
    } catch {
      // Error handled by AuthContext
    }
  };

  const handleLoginWithIssuedCreds = async () => {
    if (!purchasedInfo) return;
    const { username, password } = purchasedInfo.credentials;
    const ok = await login(username, password);
    if (ok) {
      router.push('/dashboard');
    }
  };

  return (
    <div dir="rtl" lang="fa" className="min-h-screen bg-canvas text-text-primary font-sans flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -start-48 w-96 h-96 bg-ai-cyan/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -end-48 w-96 h-96 bg-ai-indigo/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-surface-raised border border-ai-cyan/40 shadow-ai mb-4">
            <img src="/assets/svg/brand-icon.svg" alt="لوگو" className="h-10 w-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
            سامانه یکپارچه «مدرسه هوشمند آینده»
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1.5">
            پلتفرم ارزیابی پارامتریک، تصحیح خودکار با OpenCV و سیستم هشدار زودهنگام (EWS)
          </p>

          {/* Navigation Tabs */}
          <div className="inline-flex rounded-xl border border-border bg-surface p-1 mt-6 shadow-sm">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                clearError();
              }}
              className={`rounded-lg px-5 py-2 text-xs font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-ai-indigo text-text-primary shadow-ai'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              ورود کاربران سامانه (۴ نقش)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('purchase');
                clearError();
              }}
              className={`rounded-lg px-5 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'purchase'
                  ? 'bg-gradient-to-r from-ai-cyan to-ai-indigo text-text-primary shadow-ai'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-ai-cyan" />
              <span>خرید اشتراک و لایسنس سازمانی</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-danger/40 bg-danger/15 p-4 text-xs font-medium text-danger flex items-center justify-between">
            <span>{error}</span>
            <button onClick={clearError} className="text-xs font-bold text-text-muted hover:text-text-primary">
              بستن
            </button>
          </div>
        )}

        {/* TAB 1: LOGIN */}
        {activeTab === 'login' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Standard Username / Password Form */}
            <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-surface/90 p-6 backdrop-blur-glass shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <KeyRound className="h-5 w-5 text-ai-cyan" />
                  <h2 className="text-sm font-bold text-text-primary">ورود با نام کاربری و رمز عبور</h2>
                </div>
                <p className="text-xs text-text-muted mb-5 leading-relaxed">
                  دانش‌آموزان، دبیران، مشاوران و مدیران دارای حساب کاربری می‌توانند از این بخش وارد شوند.
                </p>

                <form onSubmit={handleStandardLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1.5">نام کاربری</label>
                    <div className="relative">
                      <User className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="مثال: teacher_demo"
                        className="w-full rounded-xl border border-border bg-canvas py-2.5 ps-10 pe-4 text-xs text-text-primary placeholder:text-text-disabled focus:border-focus focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1.5">کلمه عبور</label>
                    <div className="relative">
                      <Lock className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-border bg-canvas py-2.5 ps-10 pe-4 text-xs text-text-primary placeholder:text-text-disabled focus:border-focus focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-xl bg-gradient-to-l from-ai-violet to-ai-indigo py-2.5 text-xs font-bold text-text-primary shadow-ai hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <span>در حال تایید...</span> : <span>ورود به سامانه</span>}
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                </form>
              </div>

              <div className="mt-6 pt-4 border-t border-border/80 text-[11px] text-text-muted flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-success shrink-0" />
                <span>احراز هویت امن رمزنگاری‌شده بر پایه JWT و توکن‌های ۲۵۶ بیتی</span>
              </div>
            </div>

            {/* Quick Demo 4 Roles Selector */}
            <div className="lg:col-span-7 rounded-2xl border border-border/80 bg-surface/90 p-6 backdrop-blur-glass shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-warning" />
                  <h2 className="text-sm font-bold text-text-primary">ورود سریع آزمایشی (۴ نقش مستقل)</h2>
                </div>
                <span className="text-[10px] bg-ai-cyan/15 text-ai-cyan font-bold px-2 py-0.5 rounded-full border border-ai-cyan/30">
                  بدون نیاز به تایپ
                </span>
              </div>
              <p className="text-xs text-text-muted mb-4">
                جهت ارزیابی دسترسی‌ها و بررسی تفکیک سطوح، روی هر نقش کلیک نمایید تا فورا وارد شوید:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Student */}
                <div className="rounded-xl border border-border bg-surface-raised/70 p-3.5 flex flex-col justify-between hover:border-ai-cyan/50 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4 text-ai-cyan" />
                        دانش‌آموز
                      </span>
                      <span className="text-[10px] bg-surface text-text-muted px-2 py-0.5 rounded border border-border">
                        student
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed mb-3">
                      مشاهده کارنامه، نمودار تراز ۶۵۴۰ تا ۷۱۲۰، درسنامه صوتی و کوئیز هوشمند.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRoleQuickLogin('student')}
                    className="w-full rounded-lg bg-surface border border-ai-cyan/40 py-1.5 text-[11px] font-bold text-ai-cyan hover:bg-ai-cyan/15 transition-colors"
                  >
                    ورود به عنوان دانش‌آموز
                  </button>
                </div>

                {/* 2. Teacher */}
                <div className="rounded-xl border border-border bg-surface-raised/70 p-3.5 flex flex-col justify-between hover:border-ai-indigo/50 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4 text-ai-indigo" />
                        معلم / مربی
                      </span>
                      <span className="text-[10px] bg-surface text-text-muted px-2 py-0.5 rounded border border-border">
                        teacher
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed mb-3">
                      داشبورد کلاس‌ها، تصحیح خوشه‌ای برگه‌ها، رادار تقلب و طراح سوالات پارامتریک.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRoleQuickLogin('teacher')}
                    className="w-full rounded-lg bg-surface border border-ai-indigo/40 py-1.5 text-[11px] font-bold text-text-primary hover:bg-ai-indigo/25 transition-colors"
                  >
                    ورود به عنوان معلم
                  </button>
                </div>

                {/* 3. Counselor */}
                <div className="rounded-xl border border-border bg-surface-raised/70 p-3.5 flex flex-col justify-between hover:border-warning/50 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                        <ShieldAlert className="h-4 w-4 text-warning" />
                        مشاور تحصیلی (EWS)
                      </span>
                      <span className="text-[10px] bg-surface text-text-muted px-2 py-0.5 rounded border border-border">
                        counselor
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed mb-3">
                      شاخص ریسک افت، تحلیل فاکتورهای علی SHAP و گیت تایید مداخله انسانی.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRoleQuickLogin('counselor')}
                    className="w-full rounded-lg bg-surface border border-warning/40 py-1.5 text-[11px] font-bold text-warning hover:bg-warning/15 transition-colors"
                  >
                    ورود به عنوان مشاور
                  </button>
                </div>

                {/* 4. Principal */}
                <div className="rounded-xl border border-border bg-surface-raised/70 p-3.5 flex flex-col justify-between hover:border-success/50 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                        <Building2 className="h-4 w-4 text-success" />
                        مدیر کل مدرسه
                      </span>
                      <span className="text-[10px] bg-surface text-text-muted px-2 py-0.5 rounded border border-border">
                        principal
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed mb-3">
                      پایش ۱۲,۵۰۰ دانش‌آموز کل مجتمع، گزارش ممیزی امنیتی و مدیریت لایسنس.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRoleQuickLogin('principal')}
                    className="w-full rounded-lg bg-surface border border-success/40 py-1.5 text-[11px] font-bold text-success hover:bg-success/15 transition-colors"
                  >
                    ورود به عنوان مدیر کل
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PURCHASE & PROVISION */}
        {activeTab === 'purchase' && (
          <div className="rounded-2xl border border-border/80 bg-surface/90 p-6 sm:p-8 backdrop-blur-glass shadow-lg">
            {!purchasedInfo ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-6 w-6 text-ai-cyan" />
                  <h2 className="text-base font-extrabold text-text-primary">خرید اشتراک و فعال‌سازی آنی لایسنس سازمانی</h2>
                </div>
                <p className="text-xs text-text-muted mb-6">
                  مدارس و مجتمع‌های آموزشی می‌توانند با تکمیل فرم زیر، لایسنس مدرسه و حساب مدیر اصلی را بلافاصله دریافت نمایند.
                </p>

                <form onSubmit={handlePurchaseSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1.5">نام مدرسه یا مجتمع آموزشی</label>
                    <input
                      type="text"
                      required
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="مثال: دبیرستان ماندگار البرز"
                      className="w-full rounded-xl border border-border bg-canvas py-2.5 px-3.5 text-xs text-text-primary placeholder:text-text-disabled focus:border-focus focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1.5">نام و سمت نماینده یا مدیر</label>
                    <input
                      type="text"
                      required
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="مثال: دکتر علیرضا رضایی"
                      className="w-full rounded-xl border border-border bg-canvas py-2.5 px-3.5 text-xs text-text-primary placeholder:text-text-disabled focus:border-focus focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1.5">نوع پکیج و ظرفیت</label>
                    <select
                      value={packageType}
                      onChange={(e) => {
                        setPackageType(e.target.value);
                        setMaxSeats(e.target.value === 'GOLD_INSTITUTIONAL' ? 1200 : 500);
                      }}
                      className="w-full rounded-xl border border-border bg-canvas py-2.5 px-3.5 text-xs text-text-primary focus:border-focus focus:outline-none"
                    >
                      <option value="GOLD_INSTITUTIONAL">پکیج طلایی سازمانی (۱۲۰۰ کاربر - نامحدود)</option>
                      <option value="STANDARD_SCHOOL">پکیج استاندارد مدرسه (۵۰۰ کاربر)</option>
                      <option value="TRIAL">آزمایشی ۳۰ روزه (۱۰۰ کاربر)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1.5">شماره تماس پشتیبانی و تایید</label>
                    <div className="relative">
                      <Phone className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                      <input
                        type="tel"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="۰۲۱۸۸۷۷۶۶۵۵"
                        className="w-full rounded-xl border border-border bg-canvas py-2.5 ps-10 pe-3.5 text-xs text-text-primary placeholder:text-text-disabled focus:border-focus focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-text-secondary mb-1.5">ایمیل رسمی جهت دریافت مستندات</label>
                    <div className="relative">
                      <Mail className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="principal@alborz-school.ir"
                        className="w-full rounded-xl border border-border bg-canvas py-2.5 ps-10 pe-3.5 text-xs text-text-primary placeholder:text-text-disabled focus:border-focus focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-auto px-8 rounded-xl bg-gradient-to-l from-ai-cyan to-ai-indigo py-3 text-xs font-bold text-text-primary shadow-ai hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isLoading ? <span>در حال صدور لایسنس...</span> : <span>تکمیل سفارش و صدور آنی اکانت مدیر</span>}
                      <Sparkles className="h-4 w-4 text-ai-cyan" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Celebration & Delivery Card */
              <div className="rounded-xl border border-success/40 bg-success/10 p-6 sm:p-8 text-center animate-fade-in">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/20 text-success mb-4">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-extrabold text-text-primary mb-1">
                  خرید لایسنس با موفقیت انجام شد!
                </h3>
                <p className="text-xs text-text-secondary max-w-lg mx-auto mb-6">
                  لایسنس سازمانی برای موسسه «{purchasedInfo.organization_name}» صادر شد و اکانت مدیریت اصلی آماده ورود است.
                </p>

                {/* Issued Credentials Box */}
                <div className="max-w-md mx-auto rounded-xl border border-border bg-surface p-5 text-start space-y-3.5 shadow-md mb-6">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <span className="text-xs text-text-muted">کد اختصاصی لایسنس:</span>
                    <span dir="ltr" className="text-xs font-mono font-bold text-ai-cyan bg-canvas px-2.5 py-1 rounded border border-ai-cyan/30">
                      {purchasedInfo.license_key}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted">نام کاربری مدیر (Principal):</span>
                    <span dir="ltr" className="text-xs font-mono font-bold text-text-primary bg-canvas px-2.5 py-1 rounded border border-border">
                      {purchasedInfo.credentials.username}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted">کلمه عبور اختصاصی:</span>
                    <span dir="ltr" className="text-xs font-mono font-bold text-warning bg-canvas px-2.5 py-1 rounded border border-warning/30">
                      {purchasedInfo.credentials.password}
                    </span>
                  </div>

                  <div className="text-[11px] text-text-muted pt-2 border-t border-border">
                    {purchasedInfo.credentials.note}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleLoginWithIssuedCreds}
                    className="rounded-xl bg-gradient-to-l from-ai-cyan to-ai-indigo px-6 py-2.5 text-xs font-bold text-text-primary shadow-ai hover:opacity-95 transition-opacity flex items-center gap-2"
                  >
                    <span>ورود فوری با اکانت اصلی صادر شده</span>
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPurchasedInfo(null);
                      setActiveTab('login');
                    }}
                    className="rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-bold text-text-secondary hover:text-text-primary"
                  >
                    بازگشت به صفحه ورود
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
