import 'package:flutter/material.dart';
import '../core/theme/school_tokens.dart';
import 'aruco_scanner_screen.dart';
import 'classroom_audio_screen.dart';
import 'teacher_dashboard_screen.dart';
import 'counselor_ews_screen.dart';

class ShellScreen extends StatefulWidget {
  const ShellScreen({super.key});

  @override
  State<ShellScreen> createState() => _ShellScreenState();
}

class _ShellScreenState extends State<ShellScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    ArUcoScannerScreen(),
    ClassroomAudioScreen(),
    TeacherDashboardScreen(),
    CounselorEwsScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final tokens = Theme.of(context).extension<SchoolTokens>() ?? SchoolTokens.dark;

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: NavigationBar(
        backgroundColor: tokens.surface,
        indicatorColor: tokens.indigo.withValues(alpha: 0.25),
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.document_scanner_outlined),
            selectedIcon: Icon(Icons.document_scanner),
            label: 'اسکنر برگه',
          ),
          NavigationDestination(
            icon: Icon(Icons.headphones_outlined),
            selectedIcon: Icon(Icons.headphones),
            label: 'کلاس هوشمند',
          ),
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard),
            label: 'کارتابل دبیر',
          ),
          NavigationDestination(
            icon: Icon(Icons.health_and_safety_outlined),
            selectedIcon: Icon(Icons.health_and_safety),
            label: 'مشاور EWS',
          ),
        ],
      ),
    );
  }
}
