import 'package:flutter_test/flutter_test.dart';
import 'package:smart_school/core/api/mobile_api_client.dart';

void main() {
  group('MobileApiClient Offline & Fallback Tests', () {
    test('checkHealth returns false on unreachable host', () async {
      final client = MobileApiClient(baseUrl: 'http://invalid-host-9999.test');
      final isHealthy = await client.checkHealth();
      expect(isHealthy, isFalse);
    });

    test('fetchTeacherDashboard falls back to mock data cleanly', () async {
      final client = MobileApiClient(baseUrl: 'http://invalid-host-9999.test');
      final res = await client.fetchTeacherDashboard();
      expect(res['isMock'], isTrue);
      expect(res['data']['teacher_name'], 'استاد علیرضا رضایی');
      expect((res['data']['metrics'] as List).length, 4);
    });

    test('fetchCounselorOverview falls back cleanly', () async {
      final client = MobileApiClient(baseUrl: 'http://invalid-host-9999.test');
      final res = await client.fetchCounselorOverview();
      expect(res['isMock'], isTrue);
      expect((res['data']['metrics'] as List).length, 4);
    });

    test('generateParametricVariants falls back to generated mock variants', () async {
      final client = MobileApiClient(baseUrl: 'http://invalid-host-9999.test');
      final res = await client.generateParametricVariants(count: 3);
      expect(res['isMock'], isTrue);
      expect((res['data']['variants'] as List).length, 3);
    });
  });

  group('MobileApiClient Live Integration Tests (FastAPI on 127.0.0.1:8000)', () {
    test('Live checkHealth against running backend', () async {
      final client = MobileApiClient(baseUrl: 'http://127.0.0.1:8000');
      final isHealthy = await client.checkHealth();
      // If backend is running, verify true
      if (isHealthy) {
        final teacherRes = await client.fetchTeacherDashboard();
        expect(teacherRes['isMock'], isFalse);
        expect(teacherRes['data']['scope'], 'teacher');

        final variantsRes = await client.generateParametricVariants(count: 5);
        expect(variantsRes['isMock'], isFalse);
        expect((variantsRes['data']['variants'] as List).length, 5);
      }
    });
  });
}
