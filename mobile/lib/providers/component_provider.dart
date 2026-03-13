import 'package:flutter/foundation.dart';
import '../models/component.dart';
import '../services/component_service.dart';

/// Component state management
class ComponentProvider with ChangeNotifier {
  final ComponentService _componentService;
  
  List<Component> _components = [];
  Component? _selectedComponent;
  bool _isLoading = false;
  String? _error;
  String _searchQuery = '';

  ComponentProvider(this._componentService);

  // Getters
  List<Component> get components => _components;
  Component? get selectedComponent => _selectedComponent;
  bool get isLoading => _isLoading;
  String? get error => _error;
  String get searchQuery => _searchQuery;
  
  /// Get filtered components based on search query
  List<Component> get filteredComponents {
    if (_searchQuery.isEmpty) return _components;
    
    return _components.where((c) {
      final titleLower = c.title.toLowerCase();
      final queryLower = _searchQuery.toLowerCase();
      return titleLower.contains(queryLower);
    }).toList();
  }

  /// Fetch all components
  Future<void> fetchComponents({String? folderId}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _components = await _componentService.getComponents(folderId: folderId);
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Fetch a single component
  Future<void> fetchComponent(String id) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _selectedComponent = await _componentService.getComponent(id);
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Search components
  Future<void> searchComponents(String query) async {
    _searchQuery = query;
    
    if (query.isEmpty) {
      await fetchComponents();
      return;
    }
    
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _components = await _componentService.searchComponents(query);
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Set search query (local filter)
  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  /// Clear selected component
  void clearSelectedComponent() {
    _selectedComponent = null;
    notifyListeners();
  }

  /// Clear error
  void clearError() {
    _error = null;
    notifyListeners();
  }

  /// Refresh components
  Future<void> refresh() async {
    await fetchComponents();
  }
}
