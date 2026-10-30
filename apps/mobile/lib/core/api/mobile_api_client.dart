import 'dart:convert';
import 'package:http/http.dart' as http;

class MobileApiClient {
  final String baseUrl;
  final http.Client _client;

  MobileApiClient({
    this.baseUrl = 'http://127.0.0.1:8000',
    http.Client? client,
  }) : _client = client ?? http.Client();

  /// Probes FastAPI backend health check
  Future<bool> checkHealth() async {
    try {
      final res = await _client
          .get(Uri.parse('$baseUrl/health'))
          .timeout(const Duration(seconds: 2));
      return res.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  /// Fetches teacher dashboard metrics with offline fallback
  Future<Map<String, dynamic>> fetchTeacherDashboard() async {
    try {
      final res = await _client.get(
        Uri.parse('$baseUrl/api/v1/dashboard/teacher'),
        headers: {
          'Accept': 'application/json',
          'X-Demo-Role': 'teacher',
        },
      ).timeout(const Duration(seconds: 3));

      if (res.statusCode == 200) {
        return {
          'isMock': false,
          'data': json.decode(utf8.decode(res.bodyBytes)),
        };
      }
    } catch (_) {}

    return {
      'isMock': true,
      'data': {
        'teacher_name': 'استاد علیرضا رضایی',
        'metrics': [
          {'title': 'دانش‌آموزان من', 'numeric_value': 128, 'unit_label': 'نفر'},
          {'title': 'میانگین کلاس', 'numeric_value': 18.4, 'unit_label': 'از ۲۰'},
          {'title': 'برگه‌های تصحیح‌شده', 'numeric_value': 96, 'unit_label': 'برگه'},
          {'title': 'موارد نیازمند بررسی', 'numeric_value': 3, 'unit_label': 'مورد'},
        ],
        'suspicious_answers': [
          {
            'id': 'susp-1',
            'student_name': 'سارا محمدی',
            'similarity_score': 92,
            'matched_student_name': 'امیرحسین رضایی',
            'matched_question_title': 'سوال ۳: انتگرال جزء به جزء',
          },
          {
            'id': 'susp-2',
            'student_name': 'مهدی کریمی',
            'similarity_score': 87,
            'matched_student_name': 'سارا محمدی',
            'matched_question_title': 'سوال ۴: تغییر متغیر مثلثاتی',
          },
        ],
      },
    };
  }

  /// Fetches counselor overview with offline fallback
  Future<Map<String, dynamic>> fetchCounselorOverview() async {
    try {
      final res = await _client.get(
        Uri.parse('$baseUrl/api/v1/counselor/overview'),
        headers: {
          'Accept': 'application/json',
          'X-Demo-Role': 'counselor',
        },
      ).timeout(const Duration(seconds: 3));

      if (res.statusCode == 200) {
        return {
          'isMock': false,
          'data': json.decode(utf8.decode(res.bodyBytes)),
        };
      }
    } catch (_) {}

    return {
      'isMock': true,
      'data': {
        'metrics': [
          {'title': 'تحت پایش', 'numeric_value': 320, 'unit_label': 'نفر'},
          {'title': 'نیازمند بررسی', 'numeric_value': 7, 'unit_label': 'پرونده'},
          {'title': 'جلسات برگزارشده', 'numeric_value': 24, 'unit_label': 'جلسه'},
          {'title': 'بهبود پس از جلسه', 'numeric_value': 89, 'unit_label': '٪'},
        ],
      },
    };
  }

  /// Generates parametric question variants via FastAPI backend with fallback
  Future<Map<String, dynamic>> generateParametricVariants({
    String templateExpression = 'a * x + b',
    int count = 5,
  }) async {
    try {
      final res = await _client.post(
        Uri.parse('$baseUrl/api/v1/studio/questions/generate-variants'),
        headers: {
          'Content-Type': 'application/json',
          'X-Demo-Role': 'teacher',
        },
        body: json.encode({
          'template_expression': templateExpression,
          'parameters': [
            {'id': '1', 'symbol': 'a', 'label': 'ضریب a', 'min_val': 1.0, 'max_val': 5.0, 'step': 1.0},
            {'id': '2', 'symbol': 'b', 'label': 'ضریب b', 'min_val': 2.0, 'max_val': 10.0, 'step': 2.0},
            {'id': '3', 'symbol': 'x', 'label': 'متغیر x', 'min_val': 1.0, 'max_val': 5.0, 'step': 1.0},
          ],
          'variant_count': count,
        }),
      ).timeout(const Duration(seconds: 4));

      if (res.statusCode == 200) {
        return {
          'isMock': false,
          'data': json.decode(utf8.decode(res.bodyBytes)),
        };
      }
    } catch (_) {}

    return {
      'isMock': true,
      'data': {
        'count': count,
        'template_expression': templateExpression,
        'variants': List.generate(count, (i) => {
          'variant_id': 'var-${i + 1}',
          'student_name': 'دانش‌آموز ${i + 1}',
          'rendered_formula': '$templateExpression [نسخه ${i + 1}]',
          'expected_answer': 15 + i * 2,
        }),
      },
    };
  }
}
