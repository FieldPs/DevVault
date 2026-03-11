import type { SandpackPredefinedTemplate } from '@codesandbox/sandpack-react'
import type { ComponentTemplate } from '@/types/component'

type SandpackFileEntry = string | { code: string; hidden?: boolean; active?: boolean }

const SANDBOX_BG_DEFAULT = '#212121'

const SANDBOX_RUNTIME_JS = `const HEROUI_THEME_EXTEND = {
  colors: {
    default: {
      DEFAULT: '#D4D4D8',
      foreground: '#000000',
      50: '#FAFAFA',
      100: '#F4F4F5',
      200: '#E4E4E7',
      300: '#D4D4D8',
      400: '#A1A1AA',
      500: '#71717A',
      600: '#52525B',
      700: '#3F3F46',
      800: '#27272A',
      900: '#18181B'
    },
    primary: {
      DEFAULT: '#006FEE',
      foreground: '#FFFFFF',
      50: '#E6F1FE',
      100: '#CCE3FD',
      200: '#99C7FB',
      300: '#66AAF9',
      400: '#338EF7',
      500: '#006FEE',
      600: '#005BC4',
      700: '#004493',
      800: '#002E62',
      900: '#001731'
    },
    secondary: {
      DEFAULT: '#7828C8',
      foreground: '#FFFFFF',
      50: '#F2EAFA',
      100: '#E4D4F4',
      200: '#C9A9E9',
      300: '#AE7EDE',
      400: '#9353D3',
      500: '#7828C8',
      600: '#6020A0',
      700: '#481878',
      800: '#301050',
      900: '#180828'
    },
    success: {
      DEFAULT: '#17C964',
      foreground: '#000000',
      50: '#E8FAF0',
      100: '#D1F4E0',
      200: '#A2E9C1',
      300: '#74DFA2',
      400: '#45D483',
      500: '#17C964',
      600: '#12A150',
      700: '#0E793C',
      800: '#095028',
      900: '#052814'
    },
    warning: {
      DEFAULT: '#F5A524',
      foreground: '#000000',
      50: '#FEFCE8',
      100: '#FDEDD3',
      200: '#FBDBA7',
      300: '#F9C97C',
      400: '#F7B750',
      500: '#F5A524',
      600: '#C4841D',
      700: '#936316',
      800: '#62420E',
      900: '#312107'
    },
    danger: {
      DEFAULT: '#F31260',
      foreground: '#FFFFFF',
      50: '#FEE7EF',
      100: '#FDD0DF',
      200: '#FAA0BF',
      300: '#F871A0',
      400: '#F54180',
      500: '#F31260',
      600: '#C20E4D',
      700: '#920B3A',
      800: '#610726',
      900: '#310413'
    },
    focus: '#006FEE',
    foreground: '#11181C',
    background: '#FFFFFF',
    content1: '#FFFFFF',
    content2: '#F4F4F5'
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '14px'
  },
  fontSize: {
    tiny: ['0.75rem', { lineHeight: '1rem' }],
    small: ['0.875rem', { lineHeight: '1.25rem' }],
    medium: ['1rem', { lineHeight: '1.5rem' }],
    large: ['1.125rem', { lineHeight: '1.75rem' }]
  },
  opacity: {
    hover: '0.8'
  },
  transitionProperty: {
    'transform-colors-opacity': 'transform, color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow'
  }
};

const nextConfig = {
  theme: {
    extend: HEROUI_THEME_EXTEND
  }
};

if (window.tailwind?.config) {
  window.tailwind.config = {
    ...window.tailwind.config,
    ...nextConfig,
    theme: {
      ...(window.tailwind.config.theme ?? {}),
      ...nextConfig.theme,
      extend: {
        ...(window.tailwind.config.theme?.extend ?? {}),
        ...HEROUI_THEME_EXTEND,
        colors: {
          ...(window.tailwind.config.theme?.extend?.colors ?? {}),
          ...HEROUI_THEME_EXTEND.colors,
        },
        borderRadius: {
          ...(window.tailwind.config.theme?.extend?.borderRadius ?? {}),
          ...HEROUI_THEME_EXTEND.borderRadius,
        },
        fontSize: {
          ...(window.tailwind.config.theme?.extend?.fontSize ?? {}),
          ...HEROUI_THEME_EXTEND.fontSize,
        },
        opacity: {
          ...(window.tailwind.config.theme?.extend?.opacity ?? {}),
          ...HEROUI_THEME_EXTEND.opacity,
        },
        transitionProperty: {
          ...(window.tailwind.config.theme?.extend?.transitionProperty ?? {}),
          ...HEROUI_THEME_EXTEND.transitionProperty,
        },
      },
    },
  };
} else {
  window.tailwind = { config: nextConfig };
}

const applyPreviewBackground = (bg) => {
  let color = '${SANDBOX_BG_DEFAULT}';
  if (bg === 'light') color = '#f5f5f5';
  if (bg === 'transparent') color = 'transparent';
  document.documentElement.style.setProperty('--sandpack-preview-bg', color);
  document.body.style.backgroundColor = color;
};

window.addEventListener('message', (event) => {
  if (event.data?.type === 'bg-change') {
    applyPreviewBackground(event.data.bg);
  }
});

document.documentElement.classList.add('light');
applyPreviewBackground('dark');
window.tailwind?.refresh?.();
`

const SANDBOX_RUNTIME_CSS = `
.tap-highlight-transparent {
  -webkit-tap-highlight-color: transparent;
}
`

function getReactAppFilePath(language = 'tsx') {
  const normalizedLanguage = language.toLowerCase()

  if (normalizedLanguage === 'js') return '/App.js'
  if (normalizedLanguage === 'jsx') return '/App.jsx'

  return '/App.tsx'
}

function getReactImportPath(appFilePath: string) {
  return `./${appFilePath.replace(/^\//, '')}`
}

export function getSandpackTemplate(template: ComponentTemplate): SandpackPredefinedTemplate {
  // Use standard react template (CRA) which has better stability in Sandpack
  return template === 'react' ? 'react' : 'static'
}

const HTML_WRAPPER = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sandbox</title>
    <style>
      :root {
        --bg-color: ${SANDBOX_BG_DEFAULT};
      }
      body {
        margin: 0;
        padding: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--bg-color);
        transition: background-color 0.3s ease;
      }
      #preview-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
      }
    </style>
    <link rel="stylesheet" href="/styles.css">
    <script src="/sandpack-runtime.js"></script>
  </head>
  <body>
    <div id="preview-container"></div>
    <script>
      fetch('/App.html')
        .then(res => res.text())
        .then(html => {
          document.getElementById('preview-container').innerHTML = html;
        });
    </script>
  </body>
</html>`;

const REACT_HTML_WRAPPER = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>React App</title>
    <style>
      :root {
        --bg-color: #212121;
      }
      body {
        margin: 0;
        padding: 0;
        background-color: var(--bg-color) !important;
        transition: background-color 0.3s ease;
      }
    </style>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script>
      window.addEventListener('message', (event) => {
        if (event.data?.type === 'bg-change') {
          const bg = event.data.bg;
          let color = '#212121';
          if (bg === 'light') color = '#f5f5f5';
          if (bg === 'transparent') color = 'transparent';
          document.documentElement.style.setProperty('--bg-color', color);
        }
      });
    </script>
  </body>
</html>`;

export function getSandpackFiles(
  template: ComponentTemplate,
  code: string,
  cssCode?: string,
  language = 'tsx'
): Record<string, SandpackFileEntry> {
  if (template === 'html') {
    return {
      '/index.html': { code: HTML_WRAPPER, hidden: true },
      '/App.html': { code, active: true },
      '/styles.css': { code: `${SANDBOX_RUNTIME_CSS}\n${cssCode ?? ''}`, active: false },
      '/sandpack-runtime.js': { code: SANDBOX_RUNTIME_JS, hidden: true },
    }
  }
  
  // Combine tailwind import with user CSS
  const userCss = cssCode ?? ''
  const CSS_RESET = `
/* Centering Layout */
body, html, #root {
  min-height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: var(--sandpack-preview-bg, ${SANDBOX_BG_DEFAULT});
}
`;

  // Provide exactly the custom CSS + reset, NO @import "tailwindcss" needed for Browser script
  const finalCss = `${CSS_RESET}\n${SANDBOX_RUNTIME_CSS}\n${userCss}`

  const appFilePath = getReactAppFilePath(language)

  // Use the real source extension so TSX syntax compiles in Sandpack.
  return { 
    '/public/index.html': { code: REACT_HTML_WRAPPER, hidden: true },
    [appFilePath]: { code, active: true },
    '/styles.css': { code: finalCss, hidden: true },
    '/sandpack-runtime.js': { code: SANDBOX_RUNTIME_JS, hidden: true },
  }
}

// ---------------------------------------------------------------------------
// Dependency auto-detection
// ---------------------------------------------------------------------------

const BUILTIN_PACKAGES = new Set([
  'react', 'react-dom', 'react-dom/client', 'react/jsx-runtime',
  'path', 'fs', 'os', 'url', 'util', 'events', 'stream', 'http', 'https',
])

// Peer / companion packages automatically added when a package is detected.
const COMPANION_DEPS: Record<string, Record<string, string>> = {
  '@heroui/react': { 
    'framer-motion': 'latest', 
  },
  '@nextui-org/react': { 
    'framer-motion': 'latest', 
  },
  '@mui/material': {
    '@emotion/react': '^11.14.0',
    '@emotion/styled': '^11.14.0',
  },
  '@mui/icons-material': {
    '@mui/material': '^6',
    '@emotion/react': '^11.14.0',
    '@emotion/styled': '^11.14.0',
  },
}

// ---------------------------------------------------------------------------
// Extra Sandpack files (hidden)
// ---------------------------------------------------------------------------

function getIndexJsFor(
  providerName: 'HeroUIProvider' | 'NextUIProvider' | null,
  pkgName?: string,
  appImportPath = './App'
) {
  if (!providerName || !pkgName) {
    return `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './sandpack-runtime';
import './styles.css';
import App from '${appImportPath}';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}`;
  }

  return `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ${providerName} } from '${pkgName}';
import './sandpack-runtime';
import './styles.css';
import App from '${appImportPath}';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <${providerName}>
        <App />
      </${providerName}>
    </StrictMode>
  );
}`;
}

export function detectDependencies(code: string): Record<string, string> {
  const deps: Record<string, string> = {
    'lucide-react': 'latest',
    // HeroUI internals expect 'tailwindcss' to exist in node_modules
    'tailwindcss': 'latest',
  }
  const importRegex = /import\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g
  let match: RegExpExecArray | null

  while ((match = importRegex.exec(code)) !== null) {
    const raw = match[1]
    if (raw.startsWith('.')) continue

    let pkgName: string
    if (raw.startsWith('@')) {
      const parts = raw.split('/')
      pkgName = parts.length >= 2 ? `${parts[0]}/${parts[1]}` : raw
    } else {
      pkgName = raw.split('/')[0]
    }

    if (BUILTIN_PACKAGES.has(pkgName)) continue
    deps[pkgName] = 'latest'
  }

  for (const pkgName of Object.keys(deps)) {
    const companions = COMPANION_DEPS[pkgName]
    if (companions) Object.assign(deps, companions)
  }

  return deps
}

export function detectExtraFiles(
  deps: Record<string, string>,
  template: ComponentTemplate,
  language = 'tsx'
): Record<string, SandpackFileEntry> {
  if (template !== 'react') return {}

  const appImportPath = getReactImportPath(getReactAppFilePath(language))

  const files: Record<string, SandpackFileEntry> = {
    '/index.js': { code: getIndexJsFor(null, undefined, appImportPath), hidden: true },
  }

  // Override index.js with provider if needed
  for (const pkgName of Object.keys(deps)) {
    if (pkgName === '@heroui/react') {
      files['/index.js'] = {
        code: getIndexJsFor('HeroUIProvider', '@heroui/react', appImportPath),
        hidden: true,
      }
    }

    if (pkgName === '@nextui-org/react') {
      files['/index.js'] = {
        code: getIndexJsFor('NextUIProvider', '@nextui-org/react', appImportPath),
        hidden: true,
      }
    }
  }
  
  return files
}

export function getExternalResources(): string[] {
  // Sandpack reliably injects external resources into the preview head for both
  // static and react templates. Use the official Tailwind CDN entrypoint here
  // instead of relying on react template HTML overrides.
  return ['https://cdn.tailwindcss.com']
}

export function getSandpackEditorOptions(template: ComponentTemplate, language = 'tsx') {
  if (template === 'html') {
    return {
      activeFile: '/App.html',
      visibleFiles: ['/App.html', '/styles.css'],
    }
  }

  const appFilePath = getReactAppFilePath(language)

  return {
    activeFile: appFilePath,
    visibleFiles: [appFilePath],
  }
}

export function parseDependencies(deps: string[]): Record<string, string> {
  const result: Record<string, string> = {}
  for (const dep of deps) {
    if (!dep.trim()) continue
    if (dep.startsWith('@')) {
      const withoutAt = dep.slice(1)
      const atIdx = withoutAt.indexOf('@')
      if (atIdx !== -1) {
        result[`@${withoutAt.slice(0, atIdx)}`] = withoutAt.slice(atIdx + 1)
      } else {
        result[dep] = 'latest'
      }
    } else {
      const atIdx = dep.indexOf('@')
      if (atIdx !== -1) {
        result[dep.slice(0, atIdx)] = dep.slice(atIdx + 1)
      } else {
        result[dep] = 'latest'
      }
    }
  }
  return result
}
