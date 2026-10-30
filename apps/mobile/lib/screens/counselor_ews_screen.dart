import 'package:flutter/material.dart';
import '../core/theme/school_tokens.dart';
import '../core/formatters/persian_formatters.dart';

class CounselorEwsScreen extends StatefulWidget {
  const CounselorEwsScreen({super.key});

  @override
  State<CounselorEwsScreen> createState() => _CounselorEwsScreenState();
}

class _CounselorEwsScreenState extends State<CounselorEwsScreen> {
  bool confirmedByCounselor = false;
  bool outreachSent = false;

  @override
  Widget build(BuildContext context) {
    final tokens = Theme.of(context).extension<SchoolTokens>() ?? SchoolTokens.dark;

    return Scaffold(
      backgroundColor: tokens.canvas,
      appBar: AppBar(
        backgroundColor: tokens.surface,
        title: const Text(
          'سامانه مشاور و پایش ریسک (EWS)',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Privacy Audit Banner
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: tokens.indigo.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: tokens.indigo.withValues(alpha: 0.3)),
              ),
              child: Row(
                children: [
                  Icon(Icons.lock_outline, color: tokens.indigo, size: 16),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'کلیه دسترسی‌ها به پرونده‌های تحصیلی طبق پروتکل حفظ حریم خصوصی ثبت و لاگ می‌شوند.',
                      style: TextStyle(color: tokens.textSecondary, fontSize: 10),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // At-Risk Priority Case Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: tokens.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: tokens.coral.withValues(alpha: 0.4)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          CircleAvatar(
                            radius: 14,
                            backgroundColor: tokens.coral.withValues(alpha: 0.2),
                            child: Icon(Icons.person, color: tokens.coral, size: 16),
                          ),
                          const SizedBox(width: 8),
                          const Text(
                            'امیرحسین رضایی',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: tokens.coral.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          'ریسک ${PersianFormatters.formatPercent(88)} (فوری)',
                          style: TextStyle(color: tokens.coral, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'دوازدهم ریاضی • افت تراز ناگهانی و ۳ تاخیر متوالی در تکالیف',
                    style: TextStyle(color: tokens.textSecondary, fontSize: 11),
                  ),
                  const SizedBox(height: 12),

                  // SHAP Factors
                  Text(
                    'عوامل موثر بر پیش‌بینی هوش مصنوعی (SHAP):',
                    style: TextStyle(color: tokens.textMuted, fontSize: 11),
                  ),
                  const SizedBox(height: 6),
                  _buildShapRow('تاخیر در تکالیف حسابان', PersianFormatters.formatPercent(48), tokens.coral, tokens),
                  _buildShapRow('غیبت در آزمون‌های آنلاین', PersianFormatters.formatPercent(32), tokens.amber, tokens),
                  _buildShapRow('کاهش مرور جزوات صوتی', PersianFormatters.formatPercent(20), tokens.violet, tokens),
                  const SizedBox(height: 8),

                  // SHAP Non-Causal Caveat
                  Text(
                    'سهم نسبی در پیش‌بینی مدل — نه لزوماً علت رفتاری قطعی.',
                    style: TextStyle(color: tokens.textMuted, fontSize: 9, fontStyle: FontStyle.italic),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Outreach Approval Gate Section
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
                    children: [
                      Icon(Icons.mail_outline, color: tokens.cyan, size: 18),
                      const SizedBox(width: 8),
                      const Text(
                        'ارسال پیام حمایتی و دعوت به جلسه',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: tokens.surfaceElevated,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '«سلام امیرحسین عزیز؛ روند یادگیری شما در مبحث جدید را بررسی کردم. برای رفع اشکال و تنظیم برنامه مرور حسابان، مشتاق گفت‌وگو در روز سه‌شنبه ساعت ۱۰ هستم.»',
                      style: TextStyle(color: tokens.textSecondary, fontSize: 11, height: 1.5),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Mandatory Human Counselor Checkbox
                  Row(
                    children: [
                      Checkbox(
                        value: confirmedByCounselor,
                        activeColor: tokens.cyan,
                        onChanged: (val) {
                          setState(() {
                            confirmedByCounselor = val ?? false;
                          });
                        },
                      ),
                      Expanded(
                        child: Text(
                          'تأییدیه مشاور: متن پیام و ضرورت ارتباط مورد بررسی انسانی قرار گرفت.',
                          style: TextStyle(
                            color: confirmedByCounselor ? tokens.textPrimary : tokens.textMuted,
                            fontSize: 11,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: confirmedByCounselor ? tokens.cyan : tokens.surfaceElevated,
                      foregroundColor: confirmedByCounselor ? tokens.canvas : tokens.textMuted,
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    onPressed: confirmedByCounselor && !outreachSent
                        ? () {
                            setState(() {
                              outreachSent = true;
                            });
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('پیام مشاوره‌ای با تأیید انسانی ارسال شد.')),
                            );
                          }
                        : null,
                    child: Text(
                      outreachSent ? 'ارسال شد ✓' : 'تأیید و ارسال پیام',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildShapRow(String label, String percent, Color color, SchoolTokens tokens) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(width: 8, height: 8, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
              const SizedBox(width: 6),
              Text(label, style: TextStyle(color: tokens.textSecondary, fontSize: 11)),
            ],
          ),
          Text(percent, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 11)),
        ],
      ),
    );
  }
}
