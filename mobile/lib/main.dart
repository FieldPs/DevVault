import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'services/storage_service.dart';
import 'services/api_service.dart';
import 'services/auth_service.dart';
import 'services/component_service.dart';
import 'providers/auth_provider.dart';
import 'providers/component_provider.dart';
import 'app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize services
  final storageService = StorageService();
  await storageService.init();

  final apiService = ApiService(storageService);
  final authService = AuthService(apiService, storageService);
  final componentService = ComponentService(apiService);

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => AuthProvider(authService),
        ),
        ChangeNotifierProvider(
          create: (_) => ComponentProvider(componentService),
        ),
      ],
      child: const DevVaultApp(),
    ),
  );
}
