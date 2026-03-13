import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';

/// Storage service for local data persistence
class StorageService {
  static const String _keyUser = 'user';
  static const String _keyToken = 'auth_token';
  static const String _keyIsLoggedIn = 'is_logged_in';
  
  SharedPreferences? _prefs;

  /// Initialize storage service
  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  /// Check if user is logged in
  bool get isLoggedIn => _prefs?.getBool(_keyIsLoggedIn) ?? false;

  /// Get the stored auth token
  String? get token => _prefs?.getString(_keyToken);

  /// Save auth token
  Future<void> saveToken(String token) async {
    await _prefs?.setString(_keyToken, token);
  }

  /// Save user data
  Future<void> saveUser(User user) async {
    await _prefs?.setString(_keyUser, jsonEncode(user.toJson()));
    await _prefs?.setBool(_keyIsLoggedIn, true);
  }

  /// Save user with token (for login response)
  Future<void> saveUserWithToken(User user, String token) async {
    await saveUser(user);
    await saveToken(token);
  }

  /// Get saved user data
  User? getUser() {
    final userJson = _prefs?.getString(_keyUser);
    if (userJson == null) return null;
    
    try {
      return User.fromJson(jsonDecode(userJson));
    } catch (e) {
      return null;
    }
  }

  /// Clear user data (logout)
  Future<void> clearUser() async {
    await _prefs?.remove(_keyUser);
    await _prefs?.remove(_keyToken);
    await _prefs?.setBool(_keyIsLoggedIn, false);
  }

  /// Clear all data
  Future<void> clearAll() async {
    await _prefs?.clear();
  }
}
