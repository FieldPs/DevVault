import 'package:flutter/foundation.dart';

/// API Configuration for DevVault Mobile App
/// 
/// Environment variables can be passed via:
/// - Development: `flutter run` (uses defaults)
/// - Production: `flutter build --dart-define=IS_PRODUCTION=true`
/// 
/// For Android emulator, use 10.0.2.2 instead of localhost
class ApiConfig {
  // Environment variables (passed via --dart-define)
  static const String _envApiUrl = String.fromEnvironment('API_URL', defaultValue: '');
  static const String _envWebUrl = String.fromEnvironment('WEB_URL', defaultValue: '');
  static const bool _isProduction = bool.fromEnvironment('IS_PRODUCTION', defaultValue: false);

  // Default URLs
  // For Android emulator: use 10.0.2.2 instead of localhost
  static const String _devApiUrl = 'http://10.0.2.2:5000';
  static const String _prodApiUrl = 'https://devvault-api.onrender.com';
  
  // Web app URLs (for WebView preview)
  static const String _devWebUrl = 'http://10.0.2.2:5173';
  static const String _prodWebUrl = 'https://devvault-web.vercel.app';

  /// Get the base API URL
  static String get baseUrl {
    if (_envApiUrl.isNotEmpty) return _envApiUrl;
    return _isProduction ? _prodApiUrl : _devApiUrl;
  }
  
  /// Get the web app URL (for WebView preview)
  static String get webUrl {
    if (_envWebUrl.isNotEmpty) return _envWebUrl;
    return _isProduction ? _prodWebUrl : _devWebUrl;
  }
  
  /// Check if running in production mode
  static bool get isProduction => _isProduction;

  /// API endpoints
  static String get login => '$baseUrl/auth/login';
  static String get logout => '$baseUrl/auth/logout';
  static String get me => '$baseUrl/auth/me';
  static String get components => '$baseUrl/components';
  
  /// Get component detail URL
  static String componentDetail(String id) => '$components/$id';
  
  /// Get public preview URL for WebView
  static String publicPreviewUrl(String componentId) => '$webUrl/c/$componentId';
  
  /// Timeout duration in milliseconds
  static const int timeoutMs = 30000;
}
