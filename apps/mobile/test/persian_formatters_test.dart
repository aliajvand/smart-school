import 'package:flutter_test/flutter_test.dart';
import 'package:smart_school/core/formatters/persian_formatters.dart';

void main() {
  group('PersianFormatters Unit Tests', () {
    test('toPersianDigits converts ASCII numbers correctly', () {
      expect(PersianFormatters.toPersianDigits('0123456789'), '۰۱۲۳۴۵۶۷۸۹');
      expect(PersianFormatters.toPersianDigits(128), '۱۲۸');
      expect(PersianFormatters.toPersianDigits(null), '');
    });

    test('formatScore outputs canonical Persian score', () {
      expect(PersianFormatters.formatScore(95, 100), '۹۵ / ۱۰۰');
      expect(PersianFormatters.formatScore(18.5, 20), '۱۸.۵ / ۲۰');
    });

    test('formatPercent outputs Persian percent symbol', () {
      expect(PersianFormatters.formatPercent(84), '۸۴٪');
      expect(PersianFormatters.formatPercent(12, includeSign: true), '+۱۲٪');
    });

    test('formatTime formats mm:ss in Persian', () {
      expect(PersianFormatters.formatTime(165), '۰۲:۴۵');
      expect(PersianFormatters.formatTime(0), '۰۰:۰۰');
      expect(PersianFormatters.formatTime(600), '۱۰:۰۰');
    });
  });
}
