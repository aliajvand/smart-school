import 'package:flutter/material.dart';
import '../core/theme/school_tokens.dart';
import '../core/formatters/persian_formatters.dart';

class ClassroomAudioScreen extends StatefulWidget {
  const ClassroomAudioScreen({super.key});

  @override
  State<ClassroomAudioScreen> createState() => _ClassroomAudioScreenState();
}

class _ClassroomAudioScreenState extends State<ClassroomAudioScreen> {
  bool isPlaying = false;
  int currentSeconds = 165; // 02:45
  final int totalSeconds = 600; // 10:00

  int? selectedQuizOption;
  bool quizSubmitted = false;

  final List<Map<String, dynamic>> topics = [
    {'time': 0, 'timeLabel': '۰۰:۰۰', 'title': 'مفهوم اولیه حد در بینهایت'},
    {'time': 165, 'timeLabel': '۰۲:۴۵', 'title': 'قاعده هوپیتال و شرایط اعمال مشتق صورت و مخرج'},
    {'time': 310, 'timeLabel': '۰۵:۱۰', 'title': 'بررسی خطاهای رایج در ابهام صفر در صفر'},
    {'time': 510, 'timeLabel': '۰۸:۳۰', 'title': 'حل تشریحی نمونه سوال امتحانات نهایی'},
  ];

  @override
  Widget build(BuildContext context) {
    final tokens = Theme.of(context).extension<SchoolTokens>() ?? SchoolTokens.dark;

    return Scaffold(
      backgroundColor: tokens.canvas,
      appBar: AppBar(
        backgroundColor: tokens.surface,
        title: const Text(
          'کلاس هوشمند و کوییز صوتی',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Audio Player Card
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
                      CircleAvatar(
                        backgroundColor: tokens.indigo.withValues(alpha: 0.2),
                        child: Icon(Icons.graphic_eq, color: tokens.indigo),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'جلسه ۱۴: مشتق و کاربرد حد پیشرفته',
                              style: TextStyle(
                                color: tokens.textPrimary,
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                            ),
                            Text(
                              'حسابان ۲ • دوازدهم ریاضی',
                              style: TextStyle(color: tokens.textMuted, fontSize: 11),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Simulated Waveform Bars
                  SizedBox(
                    height: 48,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: List.generate(32, (index) {
                        final progress = (index / 32) <= (currentSeconds / totalSeconds);
                        final height = 12.0 + ((index * 7) % 36);
                        return Container(
                          width: 4,
                          height: height,
                          decoration: BoxDecoration(
                            color: progress ? tokens.cyan : tokens.border,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        );
                      }),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Time indicator & Controls
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        PersianFormatters.formatTime(currentSeconds),
                        style: TextStyle(
                          color: tokens.cyan,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                      IconButton(
                        iconSize: 36,
                        icon: Icon(
                          isPlaying ? Icons.pause_circle_filled : Icons.play_circle_fill,
                          color: tokens.cyan,
                        ),
                        onPressed: () {
                          setState(() {
                            isPlaying = !isPlaying;
                          });
                        },
                      ),
                      Text(
                        PersianFormatters.formatTime(totalSeconds),
                        style: TextStyle(color: tokens.textMuted, fontSize: 12),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Synchronized Topics Section
            Text(
              'سرفصل‌های هماهنگ‌شده با صوت:',
              style: TextStyle(
                color: tokens.textPrimary,
                fontWeight: FontWeight.bold,
                fontSize: 13,
              ),
            ),
            const SizedBox(height: 8),
            ...topics.map((topic) {
              final isCurrent = (topic['time'] as int) == currentSeconds;
              return InkWell(
                onTap: () {
                  setState(() {
                    currentSeconds = topic['time'] as int;
                  });
                },
                child: Container(
                  margin: const EdgeInsets.only(bottom: 6),
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: isCurrent ? tokens.surfaceElevated : tokens.surface,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: isCurrent ? tokens.cyan : tokens.border.withValues(alpha: 0.5),
                    ),
                  ),
                  child: Row(
                    children: [
                      Text(
                        topic['timeLabel'] as String,
                        style: TextStyle(
                          color: isCurrent ? tokens.cyan : tokens.textMuted,
                          fontWeight: FontWeight.bold,
                          fontSize: 11,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          topic['title'] as String,
                          style: TextStyle(
                            color: isCurrent ? tokens.textPrimary : tokens.textSecondary,
                            fontSize: 11,
                          ),
                        ),
                      ),
                      if (isCurrent)
                        Icon(Icons.volume_up, size: 16, color: tokens.cyan),
                    ],
                  ),
                ),
              );
            }),
            const SizedBox(height: 16),

            // 5-Minute Pop Quiz Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: tokens.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: tokens.indigo.withValues(alpha: 0.5)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.timer, color: tokens.amber, size: 18),
                          const SizedBox(width: 6),
                          const Text(
                            'کوییز ۵ دقیقه‌ای هوشمند',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: tokens.amber.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: tokens.amber),
                        ),
                        child: Text(
                          '۰۴:۵۲',
                          style: TextStyle(
                            color: tokens.amber,
                            fontWeight: FontWeight.bold,
                            fontSize: 11,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'سوال ۱: اگر f(x) = sin(2x) / x باشد، حاصل حد f(x) وقتی x به سمت صفر میل می‌کند برابر با کدام گزینه است؟',
                    style: TextStyle(fontSize: 12, height: 1.5),
                  ),
                  const SizedBox(height: 10),
                  _buildQuizOption(0, 'گزینه ۱: برابر با صفر', tokens),
                  _buildQuizOption(1, 'گزینه ۲: برابر با ۲ (پاسخ صحیح با قاعده هوپیتال)', tokens),
                  _buildQuizOption(2, 'گزینه ۳: برابر با ۱/۲', tokens),
                  _buildQuizOption(3, 'گزینه ۴: حد وجود ندارد', tokens),
                  const SizedBox(height: 12),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: tokens.indigo,
                      foregroundColor: tokens.textPrimary,
                      padding: const EdgeInsets.symmetric(vertical: 10),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    onPressed: () {
                      setState(() {
                        quizSubmitted = true;
                      });
                    },
                    child: Text(
                      quizSubmitted ? 'ثبت شد — پاسخ صحیح گزینه ۲' : 'ثبت پاسخ کوییز',
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

  Widget _buildQuizOption(int index, String label, SchoolTokens tokens) {
    final isSelected = selectedQuizOption == index;
    return InkWell(
      onTap: () {
        if (!quizSubmitted) {
          setState(() {
            selectedQuizOption = index;
          });
        }
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 6),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? tokens.indigo.withValues(alpha: 0.15) : tokens.surfaceElevated,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isSelected ? tokens.indigo : tokens.border,
          ),
        ),
        child: Row(
          children: [
            Icon(
              isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
              color: isSelected ? tokens.indigo : tokens.textMuted,
              size: 16,
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                label,
                style: TextStyle(
                  color: isSelected ? tokens.textPrimary : tokens.textSecondary,
                  fontSize: 11,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
