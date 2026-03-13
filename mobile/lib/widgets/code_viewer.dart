import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_highlight/flutter_highlight.dart';
import '../theme/app_theme.dart';

/// Code viewer widget with syntax highlighting
class CodeViewer extends StatelessWidget {
  final String code;
  final String language;
  final bool showCopyButton;
  final bool showLineNumbers;

  const CodeViewer({
    super.key,
    required this.code,
    required this.language,
    this.showCopyButton = true,
    this.showLineNumbers = true,
  });

  /// Get language string for highlight
  String get _highlightLanguage {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'js':
        return 'javascript';
      case 'typescript':
      case 'ts':
        return 'typescript';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      default:
        return 'javascript';
    }
  }

  /// Copy code to clipboard
  void _copyCode(BuildContext context) {
    Clipboard.setData(ClipboardData(text: code));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Code copied to clipboard'),
        duration: Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final lines = code.split('\n');
    final lineCount = lines.length;

    return Container(
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: const BoxDecoration(
              border: Border(
                bottom: BorderSide(color: AppTheme.borderColor),
              ),
            ),
            child: Row(
              children: [
                // Language indicator
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.getLanguageColor(language).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    language.toUpperCase(),
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.getLanguageColor(language),
                    ),
                  ),
                ),
                const Spacer(),
                // Line count
                Text(
                  '$lineCount lines',
                  style: AppTheme.bodyMedium.copyWith(fontSize: 12),
                ),
                if (showCopyButton) ...[
                  const SizedBox(width: 16),
                  // Copy button
                  InkWell(
                    onTap: () => _copyCode(context),
                    borderRadius: BorderRadius.circular(8),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryColor.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: AppTheme.primaryColor.withOpacity(0.5),
                        ),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.copy_rounded,
                            size: 16,
                            color: AppTheme.primaryColor,
                          ),
                          SizedBox(width: 4),
                          Text(
                            'Copy',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: AppTheme.primaryColor,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
          
          // Code content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: showLineNumbers
                  ? _buildCodeWithLineNumbers()
                  : _buildCodeOnly(),
            ),
          ),
        ],
      ),
    );
  }

  /// Build code with line numbers
  Widget _buildCodeWithLineNumbers() {
    final lines = code.split('\n');
    
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Line numbers
        Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: List.generate(lines.length, (index) {
            return Text(
              '${index + 1}',
              style: AppTheme.codeStyle.copyWith(
                color: AppTheme.textSecondary.withOpacity(0.5),
              ),
            );
          }),
        ),
        const SizedBox(width: 16),
        // Code
        Expanded(
          child: HighlightView(
            code,
            language: _highlightLanguage,
            theme: _codeTheme,
            padding: EdgeInsets.zero,
            textStyle: AppTheme.codeStyle,
          ),
        ),
      ],
    );
  }

  /// Build code only (no line numbers)
  Widget _buildCodeOnly() {
    return HighlightView(
      code,
      language: _highlightLanguage,
      theme: _codeTheme,
      padding: EdgeInsets.zero,
      textStyle: AppTheme.codeStyle,
    );
  }

  /// Code theme for syntax highlighting (Atom One Dark)
  static const Map<String, TextStyle> _codeTheme = {
    'root': TextStyle(
      backgroundColor: Color(0x00000000),
      color: AppTheme.textPrimary,
    ),
    'keyword': TextStyle(color: Color(0xFFC792EA)), // Purple
    'built_in': TextStyle(color: Color(0xFF82AAFF)), // Blue
    'type': TextStyle(color: Color(0xFF82AAFF)), // Blue
    'literal': TextStyle(color: Color(0xFFF78C6C)), // Orange
    'number': TextStyle(color: Color(0xFFF78C6C)), // Orange
    'operator': TextStyle(color: Color(0xFF89DDFF)), // Cyan
    'punctuation': TextStyle(color: Color(0xFF89DDFF)), // Cyan
    'property': TextStyle(color: Color(0xFF82AAFF)), // Blue
    'regexp': TextStyle(color: Color(0xFF89DDFF)), // Cyan
    'string': TextStyle(color: Color(0xFFC3E88D)), // Green
    'char.escape_': TextStyle(color: Color(0xFF89DDFF)), // Cyan
    'subst': TextStyle(color: Color(0xFFF78C6C)), // Orange
    'symbol': TextStyle(color: Color(0xFF82AAFF)), // Blue
    'variable': TextStyle(color: Color(0xFFF07178)), // Red
    'variable.language_': TextStyle(color: Color(0xFFF07178)), // Red
    'variable.constant_': TextStyle(color: Color(0xFFF78C6C)), // Orange
    'title': TextStyle(color: Color(0xFF82AAFF)), // Blue
    'title.class_': TextStyle(color: Color(0xFFFFCB6B)), // Yellow
    'title.function_': TextStyle(color: Color(0xFF82AAFF)), // Blue
    'params': TextStyle(color: AppTheme.textPrimary),
    'comment': TextStyle(color: Color(0xFF546E7A)), // Gray
    'doctag': TextStyle(color: Color(0xFF546E7A)), // Gray
    'meta': TextStyle(color: Color(0xFF546E7A)), // Gray
    'meta.prompt': TextStyle(color: Color(0xFF546E7A)), // Gray
    'meta.keyword': TextStyle(color: Color(0xFFC792EA)), // Purple
    'meta.string': TextStyle(color: Color(0xFFC3E88D)), // Green
    'section': TextStyle(color: Color(0xFF82AAFF)), // Blue
    'tag': TextStyle(color: Color(0xFFF07178)), // Red
    'name': TextStyle(color: Color(0xFFF07178)), // Red
    'attr': TextStyle(color: Color(0xFFFFCB6B)), // Yellow
    'attribute': TextStyle(color: Color(0xFFC3E88D)), // Green
    'bullet': TextStyle(color: Color(0xFF89DDFF)), // Cyan
    'code': TextStyle(color: Color(0xFFC3E88D)), // Green
    'emphasis': TextStyle(fontStyle: FontStyle.italic),
    'strong': TextStyle(fontWeight: FontWeight.bold),
    'formula': TextStyle(color: Color(0xFF89DDFF)), // Cyan
    'link': TextStyle(color: Color(0xFF82AAFF)), // Blue
    'quote': TextStyle(color: Color(0xFFC3E88D)), // Green
    'selector-tag': TextStyle(color: Color(0xFFF07178)), // Red
    'selector-id': TextStyle(color: Color(0xFFF07178)), // Red
    'selector-class': TextStyle(color: Color(0xFFF07178)), // Red
    'selector-attr': TextStyle(color: Color(0xFFFFCB6B)), // Yellow
    'selector-pseudo': TextStyle(color: Color(0xFFC792EA)), // Purple
    'addition': TextStyle(color: Color(0xFFC3E88D)), // Green
    'deletion': TextStyle(color: Color(0xFFF07178)), // Red
  };
}
