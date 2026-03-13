import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import '../providers/component_provider.dart';
import '../widgets/code_viewer.dart';
import '../widgets/component_preview.dart';
import '../theme/app_theme.dart';

/// Component detail screen with Preview and Code tabs
class ComponentDetailScreen extends StatefulWidget {
  final String componentId;

  const ComponentDetailScreen({
    super.key,
    required this.componentId,
  });

  @override
  State<ComponentDetailScreen> createState() => _ComponentDetailScreenState();
}

class _ComponentDetailScreenState extends State<ComponentDetailScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ComponentProvider>().fetchComponent(widget.componentId);
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _copyAllCode(BuildContext context, String code, String? cssCode) {
    final fullCode = cssCode != null && cssCode.isNotEmpty
        ? '/* CSS */\n$cssCode\n\n/* Component */\n$code'
        : code;
    
    Clipboard.setData(ClipboardData(text: fullCode));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('All code copied to clipboard'),
        duration: Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ComponentProvider>(
      builder: (context, componentProvider, child) {
        final component = componentProvider.selectedComponent;

        return Scaffold(
          appBar: AppBar(
            title: component != null
                ? Text(
                    component.title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  )
                : const Text('Component'),
            actions: [
              if (component != null)
                IconButton(
                  icon: const Icon(Icons.copy),
                  onPressed: () => _copyAllCode(
                    context,
                    component.code,
                    component.cssCode,
                  ),
                  tooltip: 'Copy all code',
                ),
            ],
            bottom: component != null
                ? TabBar(
                    controller: _tabController,
                    tabs: const [
                      Tab(icon: Icon(Icons.preview), text: 'Preview'),
                      Tab(icon: Icon(Icons.code), text: 'Code'),
                    ],
                  )
                : null,
          ),
          body: _buildBody(componentProvider, component),
        );
      },
    );
  }

  Widget _buildBody(ComponentProvider provider, component) {
    // Loading state
    if (provider.isLoading && component == null) {
      return const Center(
        child: SpinKitFadingCube(
          color: AppTheme.primaryColor,
          size: 40,
        ),
      );
    }

    // Error state
    if (provider.error != null && component == null) {
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
              'Failed to load component',
              style: AppTheme.bodyLarge,
            ),
            const SizedBox(height: 8),
            Text(
              provider.error!,
              style: AppTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: () => provider.fetchComponent(widget.componentId),
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (component == null) {
      return const Center(
        child: Text('Component not found'),
      );
    }

    // Content with tabs
    return Column(
      children: [
        // Component info header
        _buildInfoHeader(component),
        
        // Tab content
        Expanded(
          child: TabBarView(
            controller: _tabController,
            children: [
              // Preview tab - Local HTML generation
              ComponentPreview(
                componentId: component.id,
                code: component.code,
                cssCode: component.cssCode,
                language: component.language,
                template: component.template,
              ),
              
              // Code tab - Syntax highlighted code
              _buildCodeTab(component),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildInfoHeader(component) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        color: AppTheme.surfaceColor,
        border: Border(
          bottom: BorderSide(color: AppTheme.borderColor),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title and privacy
          Row(
            children: [
              Expanded(
                child: Text(
                  component.title,
                  style: AppTheme.headingMedium,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppTheme.cardColor,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      component.privacyIcon,
                      style: const TextStyle(fontSize: 12),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      component.displayPrivacy,
                      style: AppTheme.bodyMedium.copyWith(fontSize: 12),
                    ),
                  ],
                ),
              ),
            ],
          ),
          
          // Description
          if (component.description != null && component.description!.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(
              component.description!,
              style: AppTheme.bodyMedium,
            ),
          ],
          
          const SizedBox(height: 12),
          
          // Language badge
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppTheme.getLanguageColor(component.language).withOpacity(0.2),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(
                    color: AppTheme.getLanguageColor(component.language).withOpacity(0.5),
                  ),
                ),
                child: Text(
                  component.displayLanguage,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.getLanguageColor(component.language),
                  ),
                ),
              ),
              const Spacer(),
              if (component.createdAt != null)
                Text(
                  'Created ${_formatDate(component.createdAt!)}',
                  style: AppTheme.bodyMedium.copyWith(fontSize: 12),
                ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCodeTab(component) {
    final hasCss = component.cssCode != null && component.cssCode!.isNotEmpty;
    
    if (!hasCss) {
      // Only JavaScript/TypeScript code
      return Padding(
        padding: const EdgeInsets.all(16),
        child: CodeViewer(
          code: component.code,
          language: component.language,
        ),
      );
    }

    // Both component code and CSS
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Component code
          Expanded(
            flex: 2,
            child: CodeViewer(
              code: component.code,
              language: component.language,
            ),
          ),
          const SizedBox(height: 12),
          // CSS code
          Expanded(
            child: CodeViewer(
              code: component.cssCode!,
              language: 'css',
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);
    
    if (diff.inDays == 0) {
      return 'today';
    } else if (diff.inDays == 1) {
      return 'yesterday';
    } else if (diff.inDays < 7) {
      return '${diff.inDays} days ago';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }
}
