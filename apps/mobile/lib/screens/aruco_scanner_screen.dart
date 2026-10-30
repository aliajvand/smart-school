import 'package:flutter/material.dart';
import '../core/theme/school_tokens.dart';
import '../core/formatters/persian_formatters.dart';

class ArUcoScannerScreen extends StatefulWidget {
  const ArUcoScannerScreen({super.key});

  @override
  State<ArUcoScannerScreen> createState() => _ArUcoScannerScreenState();
}

class _ArUcoScannerScreenState extends State<ArUcoScannerScreen> {
  bool perspectiveCorrectionEnabled = true;
  double sharpnessScore = 84.0;
  bool isScanning = false;
  bool scanCompleted = true;

  @override
  Widget build(BuildContext context) {
    final tokens = Theme.of(context).extension<SchoolTokens>() ?? SchoolTokens.dark;

    return Scaffold(
      backgroundColor: tokens.canvas,
      appBar: AppBar(
        backgroundColor: tokens.surface,
        title: const Text(
          'اسکنر هوشمند برگه (ArUco)',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: Icon(
              perspectiveCorrectionEnabled ? Icons.crop_free : Icons.grid_off,
              color: tokens.cyan,
            ),
            tooltip: 'اصلاح پرسپکتیو',
            onPressed: () {
              setState(() {
                perspectiveCorrectionEnabled = !perspectiveCorrectionEnabled;
              });
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Simulation banner
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: tokens.amber.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: tokens.amber.withValues(alpha: 0.4)),
              ),
              child: Row(
                children: [
                  Icon(Icons.info_outline, color: tokens.amber, size: 18),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'محیط شبیه‌ساز اسکنر — ۴ نشانگر گوشه‌ای ArUco کالیبره شده‌اند.',
                      style: TextStyle(color: tokens.amber, fontSize: 11),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Scanner Viewport Box
            AspectRatio(
              aspectRatio: 3 / 4,
              child: Container(
                decoration: BoxDecoration(
                  color: tokens.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: tokens.border),
                ),
                child: Stack(
                  children: [
                    // Mock Paper content
                    Center(
                      child: Padding(
                        padding: const EdgeInsets.all(24.0),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.description, size: 48, color: tokens.textMuted.withValues(alpha: 0.5)),
                            const SizedBox(height: 12),
                            Text(
                              'پاسخ‌برگ استاندارد ریاضی ۱۲',
                              style: TextStyle(color: tokens.textSecondary, fontWeight: FontWeight.w600),
                            ),
                            const SizedBox(height: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                              decoration: BoxDecoration(
                                color: tokens.surfaceElevated,
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                '\\int_{-1}^{1} x^2 dx = \\frac{2}{3}',
                                style: TextStyle(
                                  color: tokens.cyan,
                                  fontFamily: 'monospace',
                                  fontSize: 13,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    // 4 ArUco Corner Markers
                    _buildCornerMarker(Alignment.topLeft, '#0', tokens),
                    _buildCornerMarker(Alignment.topRight, '#1', tokens),
                    _buildCornerMarker(Alignment.bottomRight, '#2', tokens),
                    _buildCornerMarker(Alignment.bottomLeft, '#3', tokens),

                    // Top Sharpness Meter
                    Positioned(
                      top: 12,
                      left: 12,
                      right: 12,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: tokens.canvas.withValues(alpha: 0.85),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: tokens.emerald.withValues(alpha: 0.5)),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Icon(Icons.lens, color: tokens.emerald, size: 10),
                                const SizedBox(width: 6),
                                Text(
                                  'شاخص وضوح لاپلاسین:',
                                  style: TextStyle(color: tokens.textSecondary, fontSize: 11),
                                ),
                              ],
                            ),
                            Text(
                              '${PersianFormatters.toPersianDigits(sharpnessScore.round())}٪ (وضوح مناسب)',
                              style: TextStyle(
                                color: tokens.emerald,
                                fontWeight: FontWeight.bold,
                                fontSize: 11,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // AI Instant Evaluation Card
            if (scanCompleted)
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: tokens.surfaceElevated,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: tokens.cyan.withValues(alpha: 0.4)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.auto_awesome, color: tokens.cyan, size: 20),
                            const SizedBox(width: 8),
                            const Text(
                              'ارزیابی آنی هوش مصنوعی',
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: tokens.cyan.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: tokens.cyan),
                          ),
                          child: Text(
                            PersianFormatters.formatScore(95, 100),
                            style: TextStyle(
                              color: tokens.cyan,
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'تشخیص گام‌های حل دست‌نویس:',
                      style: TextStyle(color: tokens.textSecondary, fontSize: 12),
                    ),
                    const SizedBox(height: 6),
                    _buildStepRow('گام ۱: محاسبه پادمشتق صحیح x³/۳', true, tokens),
                    _buildStepRow('گام ۲: جایگذاری کران‌های ۱ و ۱-', true, tokens),
                    _buildStepRow('گام ۳: ساده‌سازی کسر نهایی ۲/۳', true, tokens),
                  ],
                ),
              ),
            const SizedBox(height: 16),

            // Scan Action Button
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: tokens.cyan,
                foregroundColor: tokens.canvas,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              icon: const Icon(Icons.camera_alt),
              label: const Text(
                'ثبت و ارسال به کارتابل دبیر',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('برگه اسکن شد و نمره ۹۵ / ۱۰۰ در سامانه ثبت گردید.'),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCornerMarker(Alignment alignment, String label, SchoolTokens tokens) {
    return Align(
      alignment: alignment,
      child: Container(
        margin: const EdgeInsets.all(12),
        padding: const EdgeInsets.all(6),
        decoration: BoxDecoration(
          color: tokens.canvas.withValues(alpha: 0.8),
          borderRadius: BorderRadius.circular(6),
          border: Border.all(color: tokens.emerald, width: 2),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: tokens.emerald,
            fontWeight: FontWeight.bold,
            fontSize: 10,
            fontFamily: 'monospace',
          ),
        ),
      ),
    );
  }

  Widget _buildStepRow(String title, bool isCorrect, SchoolTokens tokens) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2.0),
      child: Row(
        children: [
          Icon(
            isCorrect ? Icons.check_circle : Icons.cancel,
            color: isCorrect ? tokens.emerald : tokens.coral,
            size: 14,
          ),
          const SizedBox(width: 6),
          Expanded(
            child: Text(
              title,
              style: TextStyle(color: tokens.textPrimary, fontSize: 11),
            ),
          ),
        ],
      ),
    );
  }
}
