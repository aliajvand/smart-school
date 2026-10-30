import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  checkBackendHealth,
  getTeacherDashboard,
  getCounselorOverview,
  getIntegritySignals,
  validateParametricExpression,
  generateParametricVariants,
} from './api-client';

describe('API Client Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('checkBackendHealth returns online when fetch succeeds', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 'ok',
        version: '1.0.0',
        service: 'smart-school-backend',
        timestamp: '2026-10-30T11:23:00Z',
      }),
    }));

    const health = await checkBackendHealth();
    expect(health.online).toBe(true);
    expect(health.version).toBe('1.0.0');
  });

  it('checkBackendHealth returns offline when fetch throws network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    const health = await checkBackendHealth();
    expect(health.online).toBe(false);
  });

  it('getTeacherDashboard falls back gracefully to mock data when offline', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Backend offline')));

    const dashboard = await getTeacherDashboard();
    expect(dashboard.isMock).toBe(true);
    expect(dashboard.teacherName).toBe('استاد علیرضا رضایی');
    expect(dashboard.metrics.length).toBeGreaterThan(0);
    expect(dashboard.gradeDistribution.length).toBeGreaterThan(0);
  });

  it('getCounselorOverview falls back gracefully to mock data when offline', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Backend offline')));

    const counselor = await getCounselorOverview();
    expect(counselor.isMock).toBe(true);
    expect(counselor.atRiskStudents.length).toBeGreaterThan(0);
    expect(counselor.shapAttributions.length).toBeGreaterThan(0);
  });

  it('getIntegritySignals includes mandatory non-verdict disclaimer', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Backend offline')));

    const signals = await getIntegritySignals();
    expect(signals.nonVerdictDisclaimer).toContain('سیگنال');
  });
});
