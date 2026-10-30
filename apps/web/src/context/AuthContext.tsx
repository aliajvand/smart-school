'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'student' | 'teacher' | 'counselor' | 'principal';

export interface User {
  id: number;
  username: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
}

export interface IssuedCredentials {
  username: string;
  password: string;
  role: string;
  full_name: string;
  note: string;
}

export interface PurchaseResponse {
  success: boolean;
  message: string;
  license_key: string;
  organization_name: string;
  max_seats: number;
  credentials: IssuedCredentials;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  quickLogin: (role: UserRole) => Promise<boolean>;
  purchaseLicense: (payload: {
    organization_name: string;
    package_type?: string;
    max_seats?: number;
    contact_email: string;
    contact_phone: string;
    admin_full_name: string;
  }) => Promise<PurchaseResponse>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_CREDENTIALS: Record<UserRole, { user: string; pass: string }> = {
  student: { user: 'student_demo', pass: 'student123' },
  teacher: { user: 'teacher_demo', pass: 'teacher123' },
  counselor: { user: 'counselor_demo', pass: 'counselor123' },
  principal: { user: 'principal_demo', pass: 'principal123' },
};

const DEFAULT_USER: User = {
  id: 1,
  username: 'teacher_demo',
  full_name: 'دکتر علی مرادی (مربی / معلم ریاضی)',
  role: 'teacher',
  is_active: true,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load persisted session on initial mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('smart_school_user');
      const storedToken = localStorage.getItem('smart_school_token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch {
      // Keep default user in case localStorage is disabled
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'نام کاربری یا رمز عبور نامعتبر است.');
      }

      const data = await res.json();
      setUser(data.user);
      setToken(data.access_token);
      localStorage.setItem('smart_school_user', JSON.stringify(data.user));
      localStorage.setItem('smart_school_token', data.access_token);
      return true;
    } catch (err: any) {
      setError(err.message || 'خطا در برقراری ارتباط با سرور.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (targetRole: UserRole): Promise<boolean> => {
    const creds = DEMO_CREDENTIALS[targetRole];
    const ok = await login(creds.user, creds.pass);
    if (!ok) {
      // Fallback offline switch if server isn't running yet
      const fallbackUser: User = {
        id: targetRole === 'student' ? 1 : targetRole === 'teacher' ? 2 : targetRole === 'counselor' ? 3 : 4,
        username: creds.user,
        full_name:
          targetRole === 'student'
            ? 'سارا حسینی (دانش‌آموز)'
            : targetRole === 'teacher'
            ? 'دکتر علی مرادی (معلم ریاضی)'
            : targetRole === 'counselor'
            ? 'استاد زهرا کمالی (مشاور EWS)'
            : 'مهندس علیرضا رضایی (مدیر مدرسه)',
        role: targetRole,
        is_active: true,
      };
      setUser(fallbackUser);
      setToken('mock_demo_jwt_token_' + targetRole);
      return true;
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('smart_school_user');
    localStorage.removeItem('smart_school_token');
  };

  const purchaseLicense = async (payload: {
    organization_name: string;
    package_type?: string;
    max_seats?: number;
    contact_email: string;
    contact_phone: string;
    admin_full_name: string;
  }): Promise<PurchaseResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/purchase-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'خطا در ثبت سفارش و صدور لایسنس.');
      }

      const data: PurchaseResponse = await res.json();
      return data;
    } catch (err: any) {
      setError(err.message || 'خطا در اتصال به سرور جهت خرید لایسنس.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user ? user.role : 'teacher',
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        quickLogin,
        purchaseLicense,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
