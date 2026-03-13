import 'package:dio/dio.dart';
import '../config/api_config.dart';
import '../models/component.dart';
import 'api_service.dart';

/// Component service for fetching components
class ComponentService {
  final ApiService _apiService;

  ComponentService(this._apiService);

  /// Get all components for the current user
  Future<List<Component>> getComponents({
    String? folderId,
    String? search,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      
      if (folderId != null) {
        queryParams['folder'] = folderId;
      }
      
      if (search != null && search.isNotEmpty) {
        queryParams['search'] = search;
      }

      final response = await _apiService.get(
        ApiConfig.components,
        queryParameters: queryParams.isNotEmpty ? queryParams : null,
      );

      final List<dynamic> componentsJson = response.data['components'] ?? response.data;
      return componentsJson
          .map((json) => Component.fromJson(json))
          .toList();
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Get a single component by ID
  Future<Component> getComponent(String id) async {
    try {
      final response = await _apiService.get(ApiConfig.componentDetail(id));
      return Component.fromJson(response.data['component'] ?? response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// Search components by title
  Future<List<Component>> searchComponents(String query) async {
    return getComponents(search: query);
  }

  /// Handle API errors
  String _handleError(DioException error) {
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
        if (error.response?.statusCode == 404) {
          return 'Component not found.';
        }
        return 'Server error. Please try again.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}
