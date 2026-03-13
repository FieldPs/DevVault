import 'package:dio/dio.dart';
import '../config/api_config.dart';
import '../models/user.dart';
import 'api_service.dart';
import 'storage_service.dart';

/// Authentication service
class AuthService {
  final ApiService _apiService;
  final StorageService _storageService;

  AuthService(this._apiService, this._storageService);

  /// Login with email and password
  Future<User> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _apiService.post(
        ApiConfig.login,
        data: {
          'email': email,
          'password': password,
        },
      );

      final user = User.fromJson(response.data['user']);
      await _storageService.saveUser(user);
      return user;
    } on DioException catch (e) {
      throw _handleAuthError(e);
    }
  }

  /// Logout
  Future<void> logout() async {
    try {
      await _apiService.post(ApiConfig.logout);
    } catch (_) {
      // Ignore logout API errors
    } finally {
      await _storageService.clearUser();
    }
  }

  /// Get current user from API
  Future<User?> getCurrentUser() async {
    try {
      final response = await _apiService.get(ApiConfig.me);
      final user = User.fromJson(response.data['user']);
      await _storageService.saveUser(user);
      return user;
    } on DioException {
      return null;
    }
  }

  /// Get cached user
  User? getCachedUser() {
    return _storageService.getUser();
  }

  /// Check if user is logged in
  bool get isLoggedIn => _storageService.isLoggedIn;

  /// Handle authentication errors
  String _handleAuthError(DioException error) {
    if (error.response?.data != null) {
      final data = error.response!.data;
      if (data is Map && data['message'] != null) {
        return data['message'];
      }
    }
    
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return 'Connection timeout. Please try again.';
      case DioExceptionType.connectionError:
        return 'No internet connection.';
      case DioExceptionType.badResponse:
        if (error.response?.statusCode == 401) {
          return 'Invalid email or password.';
        }
        return 'Server error. Please try again.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}
