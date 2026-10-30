import 'package:flutter/material.dart';

/// Design Tokens for «مدرسه هوشمند آینده» Mobile App
/// Adheres to Canonical Master Specification (Canvas #070A12, Surface #0F172A).
@immutable
class SchoolTokens extends ThemeExtension<SchoolTokens> {
  // Background & Surfaces
  final Color canvas;
  final Color surface;
  final Color surfaceElevated;
  final Color surfaceHover;
  final Color border;
  final Color borderSubtle;

  // Accents & AI Palette
  final Color cyan;
  final Color indigo;
  final Color violet;
  final Color emerald;
  final Color amber;
  final Color coral;

  // Typography Colors
  final Color textPrimary;
  final Color textSecondary;
  final Color textMuted;

  const SchoolTokens({
    required this.canvas,
    required this.surface,
    required this.surfaceElevated,
    required this.surfaceHover,
    required this.border,
    required this.borderSubtle,
    required this.cyan,
    required this.indigo,
    required this.violet,
    required this.emerald,
    required this.amber,
    required this.coral,
    required this.textPrimary,
    required this.textSecondary,
    required this.textMuted,
  });

  static const dark = SchoolTokens(
    canvas: Color(0xFF070A12),
    surface: Color(0xFF0F172A),
    surfaceElevated: Color(0xFF1E293B),
    surfaceHover: Color(0xFF26334D),
    border: Color(0xFF334155),
    borderSubtle: Color(0xFF1E293B),
    cyan: Color(0xFF06B6D4),
    indigo: Color(0xFF6366F1),
    violet: Color(0xFF8B5CF6),
    emerald: Color(0xFF10B981),
    amber: Color(0xFFF59E0B),
    coral: Color(0xFFEF4444),
    textPrimary: Color(0xFFF8FAFC),
    textSecondary: Color(0xFF94A3B8),
    textMuted: Color(0xFF64748B),
  );

  @override
  SchoolTokens copyWith({
    Color? canvas,
    Color? surface,
    Color? surfaceElevated,
    Color? surfaceHover,
    Color? border,
    Color? borderSubtle,
    Color? cyan,
    Color? indigo,
    Color? violet,
    Color? emerald,
    Color? amber,
    Color? coral,
    Color? textPrimary,
    Color? textSecondary,
    Color? textMuted,
  }) {
    return SchoolTokens(
      canvas: canvas ?? this.canvas,
      surface: surface ?? this.surface,
      surfaceElevated: surfaceElevated ?? this.surfaceElevated,
      surfaceHover: surfaceHover ?? this.surfaceHover,
      border: border ?? this.border,
      borderSubtle: borderSubtle ?? this.borderSubtle,
      cyan: cyan ?? this.cyan,
      indigo: indigo ?? this.indigo,
      violet: violet ?? this.violet,
      emerald: emerald ?? this.emerald,
      amber: amber ?? this.amber,
      coral: coral ?? this.coral,
      textPrimary: textPrimary ?? this.textPrimary,
      textSecondary: textSecondary ?? this.textSecondary,
      textMuted: textMuted ?? this.textMuted,
    );
  }

  @override
  SchoolTokens lerp(ThemeExtension<SchoolTokens>? other, double t) {
    if (other is! SchoolTokens) return this;
    return SchoolTokens(
      canvas: Color.lerp(canvas, other.canvas, t)!,
      surface: Color.lerp(surface, other.surface, t)!,
      surfaceElevated: Color.lerp(surfaceElevated, other.surfaceElevated, t)!,
      surfaceHover: Color.lerp(surfaceHover, other.surfaceHover, t)!,
      border: Color.lerp(border, other.border, t)!,
      borderSubtle: Color.lerp(borderSubtle, other.borderSubtle, t)!,
      cyan: Color.lerp(cyan, other.cyan, t)!,
      indigo: Color.lerp(indigo, other.indigo, t)!,
      violet: Color.lerp(violet, other.violet, t)!,
      emerald: Color.lerp(emerald, other.emerald, t)!,
      amber: Color.lerp(amber, other.amber, t)!,
      coral: Color.lerp(coral, other.coral, t)!,
      textPrimary: Color.lerp(textPrimary, other.textPrimary, t)!,
      textSecondary: Color.lerp(textSecondary, other.textSecondary, t)!,
      textMuted: Color.lerp(textMuted, other.textMuted, t)!,
    );
  }
}

ThemeData createSchoolDarkTheme() {
  const tokens = SchoolTokens.dark;

  return ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: tokens.canvas,
    canvasColor: tokens.canvas,
    cardColor: tokens.surface,
    colorScheme: ColorScheme.dark(
      surface: tokens.surface,
      primary: tokens.cyan,
      secondary: tokens.indigo,
      tertiary: tokens.violet,
      error: tokens.coral,
      onSurface: tokens.textPrimary,
    ),
    extensions: const [tokens],
    dividerColor: tokens.border,
    textTheme: TextTheme(
      bodyLarge: TextStyle(color: tokens.textPrimary),
      bodyMedium: TextStyle(color: tokens.textSecondary),
      bodySmall: TextStyle(color: tokens.textMuted),
      titleLarge: TextStyle(color: tokens.textPrimary, fontWeight: FontWeight.bold),
      titleMedium: TextStyle(color: tokens.textPrimary, fontWeight: FontWeight.w600),
    ),
  );
}
