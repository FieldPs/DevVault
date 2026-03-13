import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'providers/auth_provider.dart';
import 'screens/login_screen.dart';
import 'screens/gallery_screen.dart';
import 'screens/component_detail_screen.dart';
import 'screens/search_screen.dart';
import 'theme/app_theme.dart';

/// Main app widget
class DevVaultApp extends StatelessWidget {
  const DevVaultApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'DevVault',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const SplashScreen(),
      routes: {
        '/login': (context) => const LoginScreen(),
        '/gallery': (context) => const GalleryScreen(),
        '/search': (context) => const SearchScreen(),
      },
      onGenerateRoute: (settings) {
        if (settings.name == '/detail') {
          final componentId = settings.arguments as String;
          return MaterialPageRoute(
            builder: (context) => ComponentDetailScreen(componentId: componentId),
          );
        }
        return null;
      },
    );
  }
}

/// Splash screen that checks auth state
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  bool _isNavigating = false;

  @override
  void initState() {
    super.initState();
    // Use addPostFrameCallback to avoid calling during build
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _initAuth();
    });
  }

  Future<void> _initAuth() async {
    if (_isNavigating) return;
    
    final auth = context.read<AuthProvider>();
    await auth.init();
    
    if (!mounted || _isNavigating) return;
    
    _isNavigating = true;
    
    if (auth.isLoggedIn) {
      Navigator.of(context).pushReplacementNamed('/gallery');
    } else {
      Navigator.of(context).pushReplacementNamed('/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.code_rounded,
              size: 80,
              color: AppTheme.primaryColor,
            ),
            const SizedBox(height: 24),
            const SpinKitFadingCube(
              color: AppTheme.primaryColor,
              size: 40,
            ),
            const SizedBox(height: 24),
            Text(
              'DevVault',
              style: AppTheme.headingLarge,
            ),
            const SizedBox(height: 8),
            Text(
              'Loading...',
              style: AppTheme.bodyMedium,
            ),
          ],
        ),
      ),
    );
  }
}
