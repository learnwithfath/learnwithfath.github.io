import 'package:flutter_test/flutter_test.dart';
import 'package:taskforge_flutter/main.dart';

void main() {
  testWidgets('renders TaskForge', (tester) async {
    await tester.pumpWidget(const TaskForgeApp());
    expect(find.text('TaskForge'), findsOneWidget);
  });
}
