import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import '../providers/component_provider.dart';
import '../models/component.dart';
import '../widgets/component_card.dart';
import '../theme/app_theme.dart';

/// Search screen for searching components
class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _searchController = TextEditingController();
  final _focusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    // Auto-focus search field
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _focusNode.requestFocus();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _performSearch(String query) {
    final provider = context.read<ComponentProvider>();
    if (query.isEmpty) {
      provider.fetchComponents();
    } else {
      provider.searchComponents(query);
    }
  }

  void _navigateToDetail(Component component) {
    Navigator.of(context).pushNamed(
      '/detail',
      arguments: component.id,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _searchController,
          focusNode: _focusNode,
          decoration: const InputDecoration(
            hintText: 'Search components...',
            border: InputBorder.none,
            hintStyle: TextStyle(color: AppTheme.textSecondary),
          ),
          style: AppTheme.bodyLarge,
          textInputAction: TextInputAction.search,
          onChanged: (value) {
            // Debounce search
            Future.delayed(const Duration(milliseconds: 300), () {
              if (_searchController.text == value) {
                _performSearch(value);
              }
            });
          },
          onSubmitted: _performSearch,
        ),
        actions: [
          if (_searchController.text.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.clear),
              onPressed: () {
                _searchController.clear();
                _performSearch('');
              },
            ),
        ],
      ),
      body: Consumer<ComponentProvider>(
        builder: (context, provider, child) {
          // Loading state
          if (provider.isLoading) {
            return const Center(
              child: SpinKitFadingCube(
                color: AppTheme.primaryColor,
                size: 40,
              ),
            );
          }

          final components = provider.components;

          // Empty state
          if (components.isEmpty) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    _searchController.text.isEmpty
                        ? Icons.search
                        : Icons.search_off,
                    size: 64,
                    color: AppTheme.textSecondary.withOpacity(0.5),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    _searchController.text.isEmpty
                        ? 'Start typing to search'
                        : 'No results found',
                    style: AppTheme.headingMedium,
                  ),
                  if (_searchController.text.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Text(
                      'Try a different search term',
                      style: AppTheme.bodyMedium,
                    ),
                  ],
                ],
              ),
            );
          }

          // Results list
          return Column(
            children: [
              // Results count
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                color: AppTheme.surfaceColor,
                child: Row(
                  children: [
                    Text(
                      '${components.length} result${components.length == 1 ? '' : 's'}',
                      style: AppTheme.bodyMedium,
                    ),
                    if (_searchController.text.isNotEmpty) ...[
                      const SizedBox(width: 8),
                      Text(
                        'for "${_searchController.text}"',
                        style: AppTheme.bodyMedium.copyWith(
                          color: AppTheme.primaryColor,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              
              // Results grid
              Expanded(
                child: GridView.builder(
                  padding: const EdgeInsets.all(16),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 1.2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                  ),
                  itemCount: components.length,
                  itemBuilder: (context, index) {
                    final component = components[index];
                    return ComponentCard(
                      component: component,
                      onTap: () => _navigateToDetail(component),
                    );
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
