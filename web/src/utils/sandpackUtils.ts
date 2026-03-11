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
  return { 
    '/App.js': code,
    '/index.css': { code: cssCode ?? '', hidden: true }
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
    'tailwindcss': '^3.4.0', 
    'postcss': '^8.4.0', 
    'autoprefixer': '^10.4.0' 
  },
  '@nextui-org/react': { 
    'framer-motion': 'latest', 
    'tailwindcss': '^3.4.0', 
    'postcss': '^8.4.0', 
    'autoprefixer': '^10.4.0' 
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

const HEROUI_INDEX_HTML = (pkgName: string) => {
  const isHeroUI = pkgName.includes('heroui')
  const pluginName = isHeroUI ? 'heroui' : 'nextui'
  
  return `<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sandbox</title>
    <!-- Tailwind v3 CDN script that supports plugins -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/${pkgName}@latest/dist/theme.js"></script>
    <script>
      // Load plugin from the exposed global object
      const uiPlugin = window.${pluginName} ? window.${pluginName}() : (() => {});
      
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {},
        },
        plugins: [uiPlugin]
      }
    </script>
  </head>
  <body class="dark bg-background text-foreground text-zinc-800 dark:text-zinc-200">
    <div id="root"></div>
  </body>
</html>`
}

function getIndexJsxFor(providerName: 'HeroUIProvider' | 'NextUIProvider', pkgName: string) {
  return `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ${providerName} } from '${pkgName}';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <${providerName}>
      <App />
    </${providerName}>
  </StrictMode>
);`
}

const UI_FILES = (providerName: 'HeroUIProvider' | 'NextUIProvider', pkgName: string) => ({
  '/public/index.html': { code: HEROUI_INDEX_HTML(pkgName), hidden: true },
  '/index.js':          { code: getIndexJsxFor(providerName, pkgName), hidden: true },
})

const COMPANION_FILES: Record<string, Record<string, SandpackFileEntry>> = {
  '@heroui/react': UI_FILES('HeroUIProvider', '@heroui/react'),
  '@nextui-org/react': UI_FILES('NextUIProvider', '@nextui-org/react'),
}

export function detectDependencies(code: string): Record<string, string> {
  const deps: Record<string, string> = {}
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

export function detectExtraFiles(deps: Record<string, string>): Record<string, SandpackFileEntry> {
  const files: Record<string, SandpackFileEntry> = {}
  for (const pkgName of Object.keys(deps)) {
    const extra = COMPANION_FILES[pkgName]
    if (extra) Object.assign(files, extra)
  }
  return files
}

export function getExternalResources(template: ComponentTemplate): string[] {
  if (template !== 'react') return []
  // Instead of relying on Sandpack postcss bundler, inject Tailwind CDN script
  return []
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
