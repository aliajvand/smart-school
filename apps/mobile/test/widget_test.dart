import 'package:flutter_test/flutter_test.dart';
import 'package:smart_school/main.dart';

void main() {
  testWidgets('SmartSchoolApp renders ArUco scanner and shell tabs', (WidgetTester tester) async {
    await tester.pumpWidget(const SmartSchoolApp());
    await tester.pumpAndSettle();

    // Verify AppBar Title
    expect(find.text('اسکنر هوشمند برگه (ArUco)'), findsOneWidget);

    // Verify Score Display ۹۵ / ۱۰۰
    expect(find.text('۹۵ / ۱۰۰'), findsOneWidget);

    // Verify Navigation Bar Destinations
    expect(find.text('اسکنر برگه'), findsOneWidget);
    expect(find.text('کلاس هوشمند'), findsOneWidget);
    expect(find.text('کارتابل دبیر'), findsOneWidget);
    expect(find.text('مشاور EWS'), findsOneWidget);
  });
}
