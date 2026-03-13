/// HTML generator for component preview
/// Generates self-contained HTML with React/ReactDOM from CDN
class PreviewHtmlGenerator {
  /// Generate HTML for component preview
  static String generate({
    required String code,
    String? cssCode,
    String language = 'javascript',
    String template = 'react',
  }) {
    // Determine if this is a React component
    final isReact = template.toLowerCase() == 'react' ||
        language.toLowerCase() == 'javascript' ||
        language.toLowerCase() == 'typescript' ||
        language.toLowerCase() == 'jsx' ||
        language.toLowerCase() == 'tsx';

    if (isReact) {
      return _generateReactHtml(code, cssCode);
    }

    // Fallback to plain HTML/JS
    return _generatePlainHtml(code, cssCode);
  }

  /// Generate HTML for React components
  static String _generateReactHtml(String code, String? cssCode) {
    // Strip import statements and export keywords, wrap for auto-render
    final processedCode = _processReactCode(code);

    return '''
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Preview</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root {
      width: 100%; height: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #1a1a2e;
      color: #eee;
    }
    #root { padding: 16px; overflow: auto; }
    .error { color: #ff6b6b; padding: 16px; font-family: monospace; white-space: pre-wrap; background: #2d1f1f; border-radius: 8px; margin: 16px; }
    ${cssCode ?? ''}
  </style>
</head>
<body>
  <div id="root">Loading...</div>
  
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  
  <script>
    function showError(msg) {
      document.getElementById('root').innerHTML = '<div class="error">Error: ' + String(msg).replace(/</g, '<') + '</div>';
    }
    
    window.onerror = function(msg, url, line) {
      showError(msg + ' (line ' + line + ')');
      return true;
    };
  </script>
  
  <script type="text/babel">
    // Destructure React hooks
    const { useState, useEffect, useRef, useCallback, useMemo, useContext, useReducer } = React;
    
    // User's component code (imports and exports stripped)
    $processedCode
    
    // Try to find and render the component
    setTimeout(function() {
      try {
        // Get all function declarations and const declarations that might be components
        // Components are usually PascalCase functions
        var componentNames = ['App', 'Component', 'Main', 'Root', 'Preview', 'Button', 'Card', 'Form', 'Header', 'Footer', 'Sidebar', 'Modal', 'List', 'Item', 'Page', 'View'];
        var ComponentToRender = null;
        
        for (var i = 0; i < componentNames.length; i++) {
          var name = componentNames[i];
          if (typeof window[name] !== 'undefined') {
            ComponentToRender = window[name];
            break;
          }
          // Also try evaluating the name (for const declarations in Babel output)
          try {
            var maybe = eval(name);
            if (typeof maybe === 'function') {
              ComponentToRender = maybe;
              break;
            }
          } catch (e) {}
        }
        
        if (ComponentToRender) {
          var root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(React.createElement(ComponentToRender));
        } else {
          // If no component found, show the code
          showError('No component found. Make sure your component is named (App, Component, etc.) or uses export default.');
        }
      } catch (e) {
        showError(e.message);
      }
    }, 200);
  </script>
</body>
</html>
''';
  }

  /// Generate plain HTML for non-React code
  static String _generatePlainHtml(String code, String? cssCode) {
    return '''
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #1a1a2e;
      color: #eee;
      padding: 16px;
    }
    ${cssCode ?? ''}
  </style>
</head>
<body>
  $code
</body>
</html>
''';
  }

  /// Process React code to remove imports and handle exports
  static String _processReactCode(String code) {
    // Remove import statements
    var processed = code.replaceAllMapped(
      RegExp(r'''import\s+[\s\S]*?from\s+['"][\s\S]*?['"];?''', multiLine: true),
      (_) => '',
    );
    
    // Remove export default - but keep what follows
    processed = processed.replaceAll('export default ', '');
    
    // Remove export keywords from declarations
    processed = processed.replaceAllMapped(
      RegExp(r'export\s+(const|let|var|function|class)\s+'),
      (m) => '${m.group(1)} ',
    );
    
    // Remove export { ... } statements
    processed = processed.replaceAllMapped(
      RegExp(r'''export\s*\{[\s\S]*?\}\s*;?''', multiLine: true),
      (_) => '',
    );
    
    return processed;
  }
}
