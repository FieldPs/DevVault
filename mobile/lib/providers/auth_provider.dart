import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../services/auth_service.dart';

/// Authentication state management
class AuthProvider with ChangeNotifier {
  final AuthService _authService;
  
  User? _user;
  bool _isLoading = false;
  String? _error;
  bool _initialized = false;

  AuthProvider(this._authService);

  // Getters
  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isLoggedIn => _user != null;
  bool get initialized => _initialized;

  /// Initialize auth state
  Future<void> init() async {
    if (_initialized) return;
    
    // Try to get cached user first (synchronous, no notify)
    _user = _authService.getCachedUser();
    
    // Then verify with API
    if (_user != null) {
      final freshUser = await _authService.getCurrentUser();
      _user = freshUser;
    }
    
    _initialized = true;
    // Don't notify here - let the splash screen handle navigation
  }

  /// Login with email and password
  Future<bool> login({
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await _authService.login(
        email: email,
        password: password,
      );
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// Logout
  Future<void> logout() async {
    _isLoading = true;
    notifyListeners();

    await _authService.logout();
    _user = null;
    _error = null;
    _isLoading = false;
    notifyListeners();
  }

  /// Clear error
  void clearError() {
    _error = null;
    notifyListeners();
  }
}
