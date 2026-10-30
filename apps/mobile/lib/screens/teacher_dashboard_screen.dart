import 'package:flutter/material.dart';
import '../core/theme/school_tokens.dart';
import '../core/formatters/persian_formatters.dart';

class TeacherDashboardScreen extends StatefulWidget {
  const TeacherDashboardScreen({super.key});

  @override
  State<TeacherDashboardScreen> createState() => _TeacherDashboardScreenState();
}

class _TeacherDashboardScreenState extends State<TeacherDashboardScreen> {
  String selectedScope = 'teacher';

  @override
  Widget build(BuildContext context) {
    final tokens = Theme.of(context).extension<SchoolTokens>() ?? SchoolTokens.dark;

    final metrics = selectedScope == 'teacher'
        ? [
            {'title': 'دانش‌آموزان من', 'val': 128, 'unit': 'نفر', 'color': tokens.cyan},
            {'title': 'میانگین کلاس', 'val': 18.4, 'unit': 'از ۲۰', 'color': tokens.emerald},
            {'title': 'برگه‌های تصحیح‌شده', 'val': 96, 'unit': 'برگه', 'color': tokens.indigo},
            {'title': 'موارد نیازمند بررسی', 'val': 3, 'unit': 'مورد', 'color': tokens.amber},
          ]
        : [
            {'title': 'کل دانش‌آموزان', 'val': 840, 'unit': 'نفر', 'color': tokens.cyan},
            {'title': 'میانگین کل مدرسه', 'val': 17.2, 'unit': 'از ۲۰', 'color': tokens.emerald},
            {'title': 'کل آزمون‌های برگزارشده', 'val': 42, 'unit': 'آزمون', 'color': tokens.indigo},
            {'title': 'هشدارهای EWS فعال', 'val': 7, 'unit': 'مورد', 'color': tokens.coral},
          ];

    return Scaffold(
      backgroundColor: tokens.canvas,
      appBar: AppBar(
        backgroundColor: tokens.surface,
        title: const Text(
          'کارتابل دبیر و نظارت آزمون',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Scope Switcher (Teacher / Principal)
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: tokens.surface,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: tokens.border),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: InkWell(
                      onTap: () => setState(() => selectedScope = 'teacher'),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        decoration: BoxDecoration(
                          color: selectedScope == 'teacher' ? tokens.indigo : Colors.transparent,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          'کلاس‌های من (۱۲۸)',
                          style: TextStyle(
                            color: selectedScope == 'teacher' ? tokens.textPrimary : tokens.textSecondary,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ),
                  ),
                  Expanded(
                    child: InkWell(
                      onTap: () => setState(() => selectedScope = 'principal'),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        decoration: BoxDecoration(
                          color: selectedScope == 'principal' ? tokens.indigo : Colors.transparent,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          'کل مجتمع آموزشی',
                          style: TextStyle(
                            color: selectedScope == 'principal' ? tokens.textPrimary : tokens.textSecondary,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // 4 KPI Cards Grid
            GridView.count(
              crossAxisCount: 2,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              childAspectRatio: 1.5,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              children: metrics.map((m) {
                final color = m['color'] as Color;
                final val = m['val'] as num;
                return Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: tokens.surface,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: tokens.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        m['title'] as String,
                        style: TextStyle(color: tokens.textMuted, fontSize: 11),
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            PersianFormatters.toPersianDigits(val),
                            style: TextStyle(
                              color: color,
                              fontWeight: FontWeight.bold,
                              fontSize: 20,
                            ),
                          ),
                          Text(
                            m['unit'] as String,
                            style: TextStyle(color: tokens.textSecondary, fontSize: 10),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 16),

            // Suspicious Answers Section
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: tokens.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: tokens.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.shield_outlined, color: tokens.amber, size: 18),
                          const SizedBox(width: 8),
                          const Text(
                            'بررسی پاسخ‌های با تشابه بالا',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: tokens.amber.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          '۳ مورد',
                          style: TextStyle(color: tokens.amber, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  // Mandatory Non-Verdict Disclaimer
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: tokens.canvas,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: tokens.border),
                    ),
                    child: Text(
                      'توجه: تشابه راه‌حل صرفاً یک سیگنال کمکی برای بررسی دبیر است و به معنای اثبات تخلف نیست.',
                      style: TextStyle(color: tokens.textMuted, fontSize: 10),
                    ),
                  ),
                  const SizedBox(height: 12),

                  _buildSuspiciousRow('سارا محمدی', 'امیرحسین رضایی', 92, 'سوال ۳: انتگرال جزء به جزء', tokens),
                  const Divider(height: 16),
                  _buildSuspiciousRow('مهدی کریمی', 'سارا محمدی', 87, 'سوال ۴: تغییر متغیر مثلثاتی', tokens),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSuspiciousRow(
    String student1,
    String student2,
    int similarity,
    String question,
    SchoolTokens tokens,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              '$student1 ↔ $student2',
              style: TextStyle(
                color: tokens.textPrimary,
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: tokens.coral.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                '${PersianFormatters.toPersianDigits(similarity)}٪ همپوشانی',
                style: TextStyle(
                  color: tokens.coral,
                  fontWeight: FontWeight.bold,
                  fontSize: 10,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 4),
        Text(
          question,
          style: TextStyle(color: tokens.textSecondary, fontSize: 11),
        ),
      ],
    );
  }
}
