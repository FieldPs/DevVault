import type { SandpackPredefinedTemplate } from '@codesandbox/sandpack-react'
import type { ComponentTemplate } from '@/types/component'

type SandpackFileEntry = string | { code: string; hidden?: boolean; active?: boolean }

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
        --bg-color: #212121;
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
  </head>
  <body>
    <div id="preview-container"></div>
    <script>
      fetch('/App.html')
        .then(res => res.text())
        .then(html => {
          document.getElementById('preview-container').innerHTML = html;
        });
        
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
  cssCode?: string
): Record<string, SandpackFileEntry> {
  if (template === 'html') {
    return {
      '/index.html': { code: HTML_WRAPPER, hidden: true },
      '/App.html': { code, active: true },
      '/styles.css': { code: cssCode ?? '', active: false }
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
}
`;

  // Provide exactly the custom CSS + reset, NO @import "tailwindcss" needed for Browser script
  const finalCss = `${CSS_RESET}\n${userCss}`

  // Use standard React (CRA) paths: /App.js and /styles.css
  return { 
    '/public/index.html': { code: REACT_HTML_WRAPPER, hidden: true },
    '/App.js': code,
    '/styles.css': { code: finalCss, hidden: true }
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

function getIndexJsFor(providerName: 'HeroUIProvider' | 'NextUIProvider' | null, pkgName?: string) {
  if (!providerName || !pkgName) {
    return `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App';

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
import './styles.css';
import App from './App';

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

// Map from a detected package to extra files needed to boot
const COMPANION_FILES: Record<string, Record<string, SandpackFileEntry>> = {
  '@heroui/react': {
    '/index.js': { code: getIndexJsFor('HeroUIProvider', '@heroui/react'), hidden: true },
  },
  '@nextui-org/react': {
    '/index.js': { code: getIndexJsFor('NextUIProvider', '@nextui-org/react'), hidden: true },
  },
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

export function detectExtraFiles(deps: Record<string, string>, template: ComponentTemplate): Record<string, SandpackFileEntry> {
  if (template !== 'react') return {}

  const files: Record<string, SandpackFileEntry> = {
    '/index.js': { code: getIndexJsFor(null), hidden: true },
  }

  // Override index.js with provider if needed
  for (const pkgName of Object.keys(deps)) {
    const extra = COMPANION_FILES[pkgName]
    if (extra) Object.assign(files, extra)
  }
  
  return files
}

export function getExternalResources(): string[] {
  // Sandpack reliably injects external resources into the preview head for both
  // static and react templates. Use the official Tailwind CDN entrypoint here
  // instead of relying on react template HTML overrides.
  return ['https://cdn.tailwindcss.com']
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
