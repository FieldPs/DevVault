/// API Configuration for DevVault Mobile App
class ApiConfig {
  // Backend API URL
  static const String devApiUrl = 'http://localhost:3000';
  static const String prodApiUrl = 'https://devvault-api.onrender.com';
  
  // Web App URL (for WebView preview)
  static const String devWebUrl = 'http://localhost:5173';
  static const String prodWebUrl = 'https://devvault-web.vercel.app';
  
  // Current environment
  static const bool _isProduction = false; // Set to true for production builds
  
  /// Get the base API URL based on environment
  static String get baseUrl => _isProduction ? prodApiUrl : devApiUrl;
  
  /// Get the web app URL based on environment
  static String get webUrl => _isProduction ? prodWebUrl : devWebUrl;
  
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
