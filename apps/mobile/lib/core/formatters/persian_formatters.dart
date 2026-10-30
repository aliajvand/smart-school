/// Persian Number and Text Formatting Utilities for Flutter
/// Enforces Eastern Arabic-Indic numerals for Farsi presentation.
class PersianFormatters {
  static const Map<String, String> _persianDigits = {
    '0': '۰',
    '1': '۱',
    '2': '۲',
    '3': '۳',
    '4': '۴',
    '5': '۵',
    '6': '۶',
    '7': '۷',
    '8': '۸',
    '9': '۹',
  };

  /// Converts any latin digits in the string or number to Persian digits
  static String toPersianDigits(dynamic input) {
    if (input == null) return '';
    final str = input.toString();
    final buffer = StringBuffer();
    for (int i = 0; i < str.length; i++) {
      final char = str[i];
      buffer.write(_persianDigits[char] ?? char);
    }
    return buffer.toString();
  }

  /// Formats exam scores canonically, e.g. "۹۵ / ۱۰۰"
  static String formatScore(num score, [num maxScore = 100]) {
    final sStr = score % 1 == 0 ? score.toInt().toString() : score.toStringAsFixed(1);
    final mStr = maxScore % 1 == 0 ? maxScore.toInt().toString() : maxScore.toStringAsFixed(1);
    return '${toPersianDigits(sStr)} / ${toPersianDigits(mStr)}';
  }

  /// Formats percent with Persian percent symbol: "۸۴٪"
  static String formatPercent(num value, {bool includeSign = false}) {
    final rounded = value.round();
    final sign = includeSign && rounded > 0 ? '+' : '';
    return '$sign${toPersianDigits(rounded)}٪';
  }

  /// Formats seconds to mm:ss in Persian digits: "۰۳:۱۴"
  static String formatTime(int totalSeconds) {
    final minutes = totalSeconds ~/ 60;
    final seconds = totalSeconds % 60;
    final mStr = minutes.toString().padLeft(2, '0');
    final sStr = seconds.toString().padLeft(2, '0');
    return '${toPersianDigits(mStr)}:${toPersianDigits(sStr)}';
  }
}
