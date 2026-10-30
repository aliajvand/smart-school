import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/school_tokens.dart';
import 'screens/shell_screen.dart';

void main() {
  runApp(
    const ProviderScope(
      child: SmartSchoolApp(),
    ),
  );
}

class SmartSchoolApp extends StatelessWidget {
  const SmartSchoolApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'مدرسه هوشمند آینده',
      debugShowCheckedModeBanner: false,
      theme: createSchoolDarkTheme(),
      builder: (context, child) {
        return Directionality(
          textDirection: TextDirection.rtl,
          child: child ?? const SizedBox.shrink(),
        );
      },
      home: const ShellScreen(),
    );
  }
}
