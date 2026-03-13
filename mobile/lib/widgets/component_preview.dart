import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import '../utils/preview_html_generator.dart';
import '../theme/app_theme.dart';

/// Component preview widget using local HTML generation
/// Renders React components directly without needing the web app
class ComponentPreview extends StatefulWidget {
  final String componentId;
  final String code;
  final String? cssCode;
  final String language;
  final String? template;

  const ComponentPreview({
    super.key,
    required this.componentId,
    required this.code,
    this.cssCode,
    this.language = 'javascript',
    this.template,
  });

  @override
  State<ComponentPreview> createState() => _ComponentPreviewState();
}

class _ComponentPreviewState extends State<ComponentPreview> {
  WebViewController? _controller;
  bool _isLoading = true;
  String? _error;
  bool _initialized = false;

  @override
  void initState() {
    super.initState();
    _initWebView();
  }

  @override
  void didUpdateWidget(ComponentPreview oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Reload preview if component data changed
    if (oldWidget.code != widget.code ||
        oldWidget.cssCode != widget.cssCode ||
        oldWidget.language != widget.language) {
      _reloadHtml();
    }
  }

  void _initWebView() {
    // Generate HTML from component data
    final html = PreviewHtmlGenerator.generate(
      code: widget.code,
      cssCode: widget.cssCode,
      language: widget.language,
      template: widget.template ?? 'react',
    );

    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFF1a1a2e))
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (String url) {
            if (mounted) {
              setState(() {
                _isLoading = true;
                _error = null;
              });
            }
          },
          onPageFinished: (String url) {
            if (mounted) {
              setState(() {
                _isLoading = false;
                _initialized = true;
              });
            }
          },
          onWebResourceError: (WebResourceError error) {
            // Only show error for actual network failures
            if (mounted && error.errorCode != -1) {
              setState(() {
                _isLoading = false;
                _error = error.description;
              });
            }
          },
        ),
      )
      ..loadHtmlString(html);
  }

  void _reloadHtml() {
    if (_controller == null) {
      _initWebView();
      return;
    }

    final html = PreviewHtmlGenerator.generate(
      code: widget.code,
      cssCode: widget.cssCode,
      language: widget.language,
      template: widget.template ?? 'react',
    );

    setState(() {
      _isLoading = true;
      _error = null;
    });

    _controller?.loadHtmlString(html);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.borderColor),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: Stack(
          children: [
            // WebView
            if (_controller != null)
              Positioned.fill(
                child: WebViewWidget(controller: _controller!),
              ),

            // Loading indicator - only show while loading
            if (_isLoading && _controller != null)
              Positioned.fill(
                child: Container(
                  color: const Color(0xFF1a1a2e),
                  child: const Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        SpinKitFadingCube(
                          color: AppTheme.primaryColor,
                          size: 40,
                        ),
                        SizedBox(height: 16),
                        Text(
                          'Loading preview...',
                          style: TextStyle(color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

            // Error state
            if (_error != null)
              Positioned.fill(
                child: Container(
                  color: AppTheme.backgroundColor,
                  child: Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(
                          Icons.error_outline,
                          color: AppTheme.errorColor,
                          size: 48,
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'Failed to load preview',
                          style: TextStyle(color: Colors.white),
                        ),
                        const SizedBox(height: 8),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: Text(
                            _error!,
                            style: const TextStyle(color: Colors.grey),
                            textAlign: TextAlign.center,
                          ),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton.icon(
                          onPressed: _initWebView,
                          icon: const Icon(Icons.refresh),
                          label: const Text('Retry'),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
