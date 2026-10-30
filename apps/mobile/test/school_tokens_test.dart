import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:smart_school/core/theme/school_tokens.dart';

void main() {
  group('SchoolTokens Unit Tests', () {
    test('Dark tokens adhere to canonical specification', () {
      const tokens = SchoolTokens.dark;
      expect(tokens.canvas, const Color(0xFF070A12));
      expect(tokens.surface, const Color(0xFF0F172A));
      expect(tokens.surfaceElevated, const Color(0xFF1E293B));
      expect(tokens.border, const Color(0xFF334155));
      expect(tokens.cyan, const Color(0xFF06B6D4));
      expect(tokens.indigo, const Color(0xFF6366F1));
      expect(tokens.violet, const Color(0xFF8B5CF6));
      expect(tokens.emerald, const Color(0xFF10B981));
      expect(tokens.amber, const Color(0xFFF59E0B));
      expect(tokens.coral, const Color(0xFFEF4444));
    });

    test('createSchoolDarkTheme includes SchoolTokens extension', () {
      final theme = createSchoolDarkTheme();
      final ext = theme.extension<SchoolTokens>();
      expect(ext, isNotNull);
      expect(ext!.canvas, const Color(0xFF070A12));
    });
  });
}
