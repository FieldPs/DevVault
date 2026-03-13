import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import '../providers/auth_provider.dart';
import '../providers/component_provider.dart';
import '../models/component.dart';
import '../widgets/component_card.dart';
import '../theme/app_theme.dart';

/// Gallery screen showing list of components
class GalleryScreen extends StatefulWidget {
  const GalleryScreen({super.key});

  @override
  State<GalleryScreen> createState() => _GalleryScreenState();
}

class _GalleryScreenState extends State<GalleryScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ComponentProvider>().fetchComponents();
    });
  }

  void _navigateToDetail(Component component) {
    Navigator.of(context).pushNamed(
      '/detail',
      arguments: component.id,
    );
  }

  void _handleLogout() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.errorColor,
            ),
            child: const Text('Logout'),
          ),
        ],
      ),
    );

    if (confirmed == true && mounted) {
      await context.read<AuthProvider>().logout();
      if (mounted) {
        Navigator.of(context).pushReplacementNamed('/login');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Components'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              Navigator.of(context).pushNamed('/search');
            },
            tooltip: 'Search',
          ),
          PopupMenuButton<String>(
            icon: const Icon(Icons.more_vert),
            onSelected: (value) {
              if (value == 'logout') {
                _handleLogout();
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'logout',
                child: Row(
                  children: [
                    Icon(Icons.logout, color: AppTheme.errorColor),
                    SizedBox(width: 8),
                    Text('Logout'),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
      body: Consumer<ComponentProvider>(
        builder: (context, componentProvider, child) {
          // Loading state
          if (componentProvider.isLoading && componentProvider.components.isEmpty) {
            return const Center(
              child: SpinKitFadingCube(
                color: AppTheme.primaryColor,
                size: 40,
              ),
            );
          }

          // Error state
          if (componentProvider.error != null && componentProvider.components.isEmpty) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(
                    Icons.error_outline,
                    color: AppTheme.errorColor,
                    size: 48,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Failed to load components',
                    style: AppTheme.bodyLarge,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    componentProvider.error!,
                    style: AppTheme.bodyMedium,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: () => componentProvider.fetchComponents(),
                    icon: const Icon(Icons.refresh),
                    label: const Text('Retry'),
                  ),
                ],
              ),
            );
          }

          // Empty state
          if (componentProvider.components.isEmpty) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.code_off_outlined,
                    size: 64,
                    color: AppTheme.textSecondary.withOpacity(0.5),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No components yet',
                    style: AppTheme.headingMedium,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Create components on the web app',
                    style: AppTheme.bodyMedium,
                  ),
                ],
              ),
            );
          }

          // Component list
          return RefreshIndicator(
            onRefresh: () => componentProvider.refresh(),
            color: AppTheme.primaryColor,
            child: GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 1.2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
              ),
              itemCount: componentProvider.components.length,
              itemBuilder: (context, index) {
                final component = componentProvider.components[index];
                return ComponentCard(
                  component: component,
                  onTap: () => _navigateToDetail(component),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
