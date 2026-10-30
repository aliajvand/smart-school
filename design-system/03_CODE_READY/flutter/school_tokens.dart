import 'package:flutter/material.dart';

@immutable
class SchoolTokens extends ThemeExtension<SchoolTokens> {
  const SchoolTokens({
    required this.canvas,
    required this.surface,
    required this.surfaceRaised,
    required this.surfaceElevated,
    required this.border,
    required this.borderStrong,
    required this.textPrimary,
    required this.textSecondary,
    required this.textMuted,
    required this.textDisabled,
    required this.aiViolet,
    required this.aiIndigo,
    required this.aiCyan,
    required this.success,
    required this.warning,
    required this.danger,
    required this.math,
    required this.focus,
    required this.radiusCard,
    required this.radiusControl,
    required this.radiusPill,
    required this.blurGlassSigma,
    required this.space1,
    required this.space2,
    required this.space3,
    required this.space4,
    required this.space5,
    required this.space6,
    required this.motionFast,
    required this.motionBase,
    required this.motionSlow,
    required this.agentPulseDuration,
  });

  final Color canvas, surface, surfaceRaised, surfaceElevated;
  final Color border, borderStrong;
  final Color textPrimary, textSecondary, textMuted, textDisabled;
  final Color aiViolet, aiIndigo, aiCyan, success, warning, danger, math, focus;

  final double radiusCard, radiusControl, radiusPill, blurGlassSigma;
  final double space1, space2, space3, space4, space5, space6;
  final Duration motionFast, motionBase, motionSlow, agentPulseDuration;

  LinearGradient get aiAuraGradient => LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [aiViolet, aiIndigo, aiCyan],
      );

  List<BoxShadow> get panelShadow => const [
        BoxShadow(
          color: Color(0x47000000),
          blurRadius: 36,
          offset: Offset(0, 12),
        ),
      ];

  List<BoxShadow> get aiAuraShadow => [
        BoxShadow(
          color: aiViolet.withValues(alpha: 0.28),
          blurRadius: 2,
          spreadRadius: 1,
        ),
        BoxShadow(
          color: aiIndigo.withValues(alpha: 0.18),
          blurRadius: 28,
        ),
      ];

  static const dark = SchoolTokens(
    canvas: Color(0xFF070A12),
    surface: Color(0xFF0F172A),
    surfaceRaised: Color(0xFF111C32),
    surfaceElevated: Color(0xFF17233B),
    border: Color(0xFF293449),
    borderStrong: Color(0xFF3B4963),
    textPrimary: Color(0xFFF8FAFC),
    textSecondary: Color(0xFFCBD5E1),
    textMuted: Color(0xFF94A3B8),
    textDisabled: Color(0xFF64748B),
    aiViolet: Color(0xFF7C3AED),
    aiIndigo: Color(0xFF4F46E5),
    aiCyan: Color(0xFF06B6D4),
    success: Color(0xFF10B981),
    warning: Color(0xFFF59E0B),
    danger: Color(0xFFF43F5E),
    math: Color(0xFFA5B4FC),
    focus: Color(0xFF67E8F9),
    radiusCard: 20.0,
    radiusControl: 12.0,
    radiusPill: 9999.0,
    blurGlassSigma: 12.0,
    space1: 4.0,
    space2: 8.0,
    space3: 12.0,
    space4: 16.0,
    space5: 20.0,
    space6: 24.0,
    motionFast: Duration(milliseconds: 140),
    motionBase: Duration(milliseconds: 220),
    motionSlow: Duration(milliseconds: 420),
    agentPulseDuration: Duration(milliseconds: 1800),
  );

  /// Converts ASCII digits to Persian digits (`۰..۹`) for UI strings.
  static String toFaDigits(String input) {
    const en = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const fa = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    var out = input;
    for (var i = 0; i < 10; i++) {
      out = out.replaceAll(en[i], fa[i]);
    }
    return out;
  }

  static String formatFaPercent(num value) {
    final clamped = value.clamp(0, 100).round().toString();
    return '${toFaDigits(clamped)}٪';
  }

  @override
  SchoolTokens copyWith({
    Color? canvas,
    Color? surface,
    Color? surfaceRaised,
    Color? surfaceElevated,
    Color? border,
    Color? borderStrong,
    Color? textPrimary,
    Color? textSecondary,
    Color? textMuted,
    Color? textDisabled,
    Color? aiViolet,
    Color? aiIndigo,
    Color? aiCyan,
    Color? success,
    Color? warning,
    Color? danger,
    Color? math,
    Color? focus,
    double? radiusCard,
    double? radiusControl,
    double? radiusPill,
    double? blurGlassSigma,
    double? space1,
    double? space2,
    double? space3,
    double? space4,
    double? space5,
    double? space6,
    Duration? motionFast,
    Duration? motionBase,
    Duration? motionSlow,
    Duration? agentPulseDuration,
  }) =>
      SchoolTokens(
        canvas: canvas ?? this.canvas,
        surface: surface ?? this.surface,
        surfaceRaised: surfaceRaised ?? this.surfaceRaised,
        surfaceElevated: surfaceElevated ?? this.surfaceElevated,
        border: border ?? this.border,
        borderStrong: borderStrong ?? this.borderStrong,
        textPrimary: textPrimary ?? this.textPrimary,
        textSecondary: textSecondary ?? this.textSecondary,
        textMuted: textMuted ?? this.textMuted,
        textDisabled: textDisabled ?? this.textDisabled,
        aiViolet: aiViolet ?? this.aiViolet,
        aiIndigo: aiIndigo ?? this.aiIndigo,
        aiCyan: aiCyan ?? this.aiCyan,
        success: success ?? this.success,
        warning: warning ?? this.warning,
        danger: danger ?? this.danger,
        math: math ?? this.math,
        focus: focus ?? this.focus,
        radiusCard: radiusCard ?? this.radiusCard,
        radiusControl: radiusControl ?? this.radiusControl,
        radiusPill: radiusPill ?? this.radiusPill,
        blurGlassSigma: blurGlassSigma ?? this.blurGlassSigma,
        space1: space1 ?? this.space1,
        space2: space2 ?? this.space2,
        space3: space3 ?? this.space3,
        space4: space4 ?? this.space4,
        space5: space5 ?? this.space5,
        space6: space6 ?? this.space6,
        motionFast: motionFast ?? this.motionFast,
        motionBase: motionBase ?? this.motionBase,
        motionSlow: motionSlow ?? this.motionSlow,
        agentPulseDuration: agentPulseDuration ?? this.agentPulseDuration,
      );

  @override
  SchoolTokens lerp(ThemeExtension<SchoolTokens>? other, double t) {
    if (other is! SchoolTokens) return this;
    Color mix(Color a, Color b) => Color.lerp(a, b, t)!;
    double mixD(double a, double b) => a + (b - a) * t;
    return SchoolTokens(
      canvas: mix(canvas, other.canvas),
      surface: mix(surface, other.surface),
      surfaceRaised: mix(surfaceRaised, other.surfaceRaised),
      surfaceElevated: mix(surfaceElevated, other.surfaceElevated),
      border: mix(border, other.border),
      borderStrong: mix(borderStrong, other.borderStrong),
      textPrimary: mix(textPrimary, other.textPrimary),
      textSecondary: mix(textSecondary, other.textSecondary),
      textMuted: mix(textMuted, other.textMuted),
      textDisabled: mix(textDisabled, other.textDisabled),
      aiViolet: mix(aiViolet, other.aiViolet),
      aiIndigo: mix(aiIndigo, other.aiIndigo),
      aiCyan: mix(aiCyan, other.aiCyan),
      success: mix(success, other.success),
      warning: mix(warning, other.warning),
      danger: mix(danger, other.danger),
      math: mix(math, other.math),
      focus: mix(focus, other.focus),
      radiusCard: mixD(radiusCard, other.radiusCard),
      radiusControl: mixD(radiusControl, other.radiusControl),
      radiusPill: mixD(radiusPill, other.radiusPill),
      blurGlassSigma: mixD(blurGlassSigma, other.blurGlassSigma),
      space1: mixD(space1, other.space1),
      space2: mixD(space2, other.space2),
      space3: mixD(space3, other.space3),
      space4: mixD(space4, other.space4),
      space5: mixD(space5, other.space5),
      space6: mixD(space6, other.space6),
      motionFast: other.motionFast,
      motionBase: other.motionBase,
      motionSlow: other.motionSlow,
      agentPulseDuration: other.agentPulseDuration,
    );
  }
}
