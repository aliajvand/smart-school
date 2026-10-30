/**
 * Integration Verification Script for Milestone 3 & Production Rollout
 * Tests real HTTP requests between Web Client and Running FastAPI Backend
 */

const BASE_URL = process.env.API_BASE_URL || 'http://127.0.0.1:8000';

async function testEndpoint(name, url, options = {}) {
  const start = Date.now();
  try {
    const res = await fetch(url, options);
    const duration = Date.now() - start;
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    console.log(`✅ [${res.status}] ${name} (${duration}ms)`);
    return { ok: true, data };
  } catch (err) {
    console.error(`❌ ${name} failed: ${err.message}`);
    return { ok: false, error: err.message };
  }
}

async function run() {
  console.log(`\n--- Running Web ↔ Backend Integration Verification ---\nTarget: ${BASE_URL}\n`);
  let total = 0;
  let passed = 0;

  // 1. Health Probe
  total++;
  const health = await testEndpoint('Health Check', `${BASE_URL}/health`);
  if (health.ok && health.data.status === 'ok') passed++;

  // 2. Teacher Dashboard
  total++;
  const teacherDash = await testEndpoint('Teacher Dashboard', `${BASE_URL}/api/v1/dashboard/teacher`, {
    headers: { 'X-Demo-Role': 'teacher' },
  });
  if (teacherDash.ok && Array.isArray(teacherDash.data.metrics)) passed++;

  // 3. Principal Dashboard
  total++;
  const principalDash = await testEndpoint('Principal Dashboard', `${BASE_URL}/api/v1/dashboard/principal`, {
    headers: { 'X-Demo-Role': 'principal' },
  });
  if (principalDash.ok && teacherDash.data.metrics.length > 0) passed++;

  // 4. Counselor Overview
  total++;
  const counselor = await testEndpoint('Counselor Overview', `${BASE_URL}/api/v1/counselor/overview`, {
    headers: { 'X-Demo-Role': 'counselor' },
  });
  if (counselor.ok && counselor.data.shap_features.length > 0) passed++;

  // 4b. Counselor At-Risk Queue
  total++;
  const atRisk = await testEndpoint('Counselor At-Risk Queue', `${BASE_URL}/api/v1/counselor/students/at-risk`, {
    headers: { 'X-Demo-Role': 'counselor' },
  });
  if (atRisk.ok && atRisk.data.length > 0) passed++;

  // 5. Parametric Validation
  total++;
  const paramVal = await testEndpoint('Parametric Question Validation', `${BASE_URL}/api/v1/studio/questions/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Demo-Role': 'teacher' },
    body: JSON.stringify({
      expression: 'v0 * sin(theta) + g * t',
      parameters: [
        { id: '1', symbol: 'v0', label: 'سرعت', min_val: 10.0, max_val: 30.0, step: 5.0 },
        { id: '2', symbol: 'theta', label: 'زاویه', min_val: 15.0, max_val: 75.0, step: 15.0 },
        { id: '3', symbol: 'g', label: 'گرانش', min_val: 9.8, max_val: 10.0, step: 0.2 },
        { id: '4', symbol: 't', label: 'زمان', min_val: 1.0, max_val: 5.0, step: 1.0 },
      ],
    }),
  });
  if (paramVal.ok && paramVal.data.is_valid === true) passed++;

  // 6. Parametric Generation
  total++;
  const paramGen = await testEndpoint('Parametric Variants Generation (5 variants)', `${BASE_URL}/api/v1/studio/questions/generate-variants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Demo-Role': 'teacher' },
    body: JSON.stringify({
      template_expression: 'a * x + b',
      parameters: [
        { id: '1', symbol: 'a', label: 'a', min_val: 1.0, max_val: 5.0, step: 1.0 },
        { id: '2', symbol: 'b', label: 'b', min_val: 2.0, max_val: 10.0, step: 2.0 },
        { id: '3', symbol: 'x', label: 'x', min_val: 1.0, max_val: 5.0, step: 1.0 },
      ],
      variant_count: 5,
    }),
  });
  if (paramGen.ok && paramGen.data.count === 5) passed++;

  // 7. Integrity Signals with mandatory non-verdict disclaimer
  total++;
  const integrity = await testEndpoint('Integrity Signals Radar', `${BASE_URL}/api/v1/integrity/signals`, {
    headers: { 'X-Demo-Role': 'teacher' },
  });
  if (integrity.ok && integrity.data.non_verdict_disclaimer && integrity.data.non_verdict_disclaimer.includes('سیگنال')) passed++;

  // 8. AST Clusters
  total++;
  const clusters = await testEndpoint('AST Answer Clusters', `${BASE_URL}/api/v1/assessments/exam-12/clusters`, {
    headers: { 'X-Demo-Role': 'teacher' },
  });
  if (clusters.ok && clusters.data.length > 0) passed++;

  // 9. Audio Lesson Waveform
  total++;
  const audio = await testEndpoint('Class Audio Waveform', `${BASE_URL}/api/v1/audio/lessons/lesson-math-101`, {
    headers: { 'X-Demo-Role': 'student' },
  });
  if (audio.ok && audio.data.waveform_peaks.length > 0) passed++;

  // 10. Regrade Flow
  total++;
  const regrade = await testEndpoint('Regrade Flow', `${BASE_URL}/api/v1/regrades/reg-101`, {
    headers: { 'X-Demo-Role': 'student' },
  });
  if (regrade.ok && regrade.data.steps.length > 0) passed++;

  // 11. Auth Roles Catalog
  total++;
  const rolesInfo = await testEndpoint('Auth Roles Info Catalog', `${BASE_URL}/api/v1/auth/roles-info`);
  if (rolesInfo.ok && rolesInfo.data.roles.length === 4) passed++;

  // 12. Auth Login (JWT Bearer Verification)
  total++;
  const authLogin = await testEndpoint('Auth Login (JWT Bearer Token)', `${BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'principal_demo', password: 'principal123' }),
  });
  if (authLogin.ok && authLogin.data.access_token && authLogin.data.user.role === 'principal') passed++;

  // 13. Vision & OpenCV Pipeline
  total++;
  const visionScan = await testEndpoint('OpenCV ArUco & Laplacian Pipeline', `${BASE_URL}/api/v1/vision/test-synthetic-scan`, {
    method: 'POST',
  });
  if (visionScan.ok && visionScan.data.alignment.all_corners_found && visionScan.data.evaluation.total_score > 0) passed++;

  console.log(`\n--- Integration Summary: ${passed}/${total} Live Endpoints Verified ---\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

run();
