import type { SandpackPredefinedTemplate } from '@codesandbox/sandpack-react'
import type { ComponentTemplate } from '@/types/component'

type SandpackFileEntry = string | { code: string; hidden?: boolean }

export function getSandpackTemplate(template: ComponentTemplate): SandpackPredefinedTemplate {
  return template === 'react' ? 'react' : 'static'
}

export function getSandpackFiles(
  template: ComponentTemplate,
  code: string,
  cssCode?: string
): Record<string, SandpackFileEntry> {
  if (template === 'html') {
    return { '/index.html': code, '/styles.css': cssCode ?? '' }
  }
  return { '/App.js': code }
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
  '@heroui/react':      { tailwindcss: '3.4.17', postcss: '^8.4.31', 'framer-motion': 'latest' },
  '@nextui-org/react':  { tailwindcss: '3.4.17', postcss: '^8.4.31', 'framer-motion': 'latest' },
  '@mui/material': {
    '@emotion/react':   '^11.14.0',
    '@emotion/styled':  '^11.14.0',
  },
  '@mui/icons-material': {
    '@mui/material':    '^6',
    '@emotion/react':   '^11.14.0',
    '@emotion/styled':  '^11.14.0',
  },
}

// ---------------------------------------------------------------------------
// Extra Sandpack files injected when certain packages are detected.
// All files are HIDDEN so they don't show up as editor tabs.
// ---------------------------------------------------------------------------

const HEROUI_INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sandbox</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`

// Only @tailwind base is needed: generates HeroUI CSS variables via heroui()
// plugin. Utilities are handled by the Tailwind Play CDN (externalResources).
const HEROUI_INDEX_CSS = `/* Base layer: generates HeroUI CSS variables via heroui() plugin */
@tailwind base;`

// heroui() plugin generates all bg-primary / text-primary-foreground classes.
// The third content entry is required so Tailwind scans HeroUI's own theme
// dist files and generates the CSS-variable-backed utility classes.
const HEROUI_TAILWIND_CONFIG = `const { heroui } = require('@heroui/react');
module.exports = {
  content: [
    './**/*.{js,jsx,ts,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  plugins: [heroui()],
};`

// Just tailwindcss — no autoprefixer so we avoid fetching an extra package.
const HEROUI_POSTCSS_CONFIG = `module.exports = {
  plugins: {
    tailwindcss: {},
  },
};`

// Wraps user's App in HeroUIProvider (injects CSS variables) and imports
// the PostCSS-processed stylesheet.
const HEROUI_INDEX_JS = `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HeroUIProvider } from '@heroui/react';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeroUIProvider>
      <App />
    </HeroUIProvider>
  </StrictMode>
);`

const COMPANION_FILES: Record<string, Record<string, SandpackFileEntry>> = {
  '@heroui/react': {
    '/public/index.html':  { code: HEROUI_INDEX_HTML,        hidden: true },
    '/index.js':           { code: HEROUI_INDEX_JS,          hidden: true },
    '/index.css':          { code: HEROUI_INDEX_CSS,         hidden: true },
    '/tailwind.config.js': { code: HEROUI_TAILWIND_CONFIG,   hidden: true },
    '/postcss.config.js':  { code: HEROUI_POSTCSS_CONFIG,    hidden: true },
  },
  '@nextui-org/react': {
    '/public/index.html':  { code: HEROUI_INDEX_HTML,        hidden: true },
    '/index.js':           { code: HEROUI_INDEX_JS,          hidden: true },
    '/index.css':          { code: HEROUI_INDEX_CSS,         hidden: true },
    '/tailwind.config.js': { code: HEROUI_TAILWIND_CONFIG,   hidden: true },
    '/postcss.config.js':  { code: HEROUI_POSTCSS_CONFIG,    hidden: true },
  },
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

  // Inject companion / peer deps
  for (const pkgName of Object.keys(deps)) {
    const companions = COMPANION_DEPS[pkgName]
    if (companions) Object.assign(deps, companions)
  }

  return deps
}

/** Extra Sandpack files to merge into the `files` prop (all hidden). */
export function detectExtraFiles(deps: Record<string, string>): Record<string, SandpackFileEntry> {
  const files: Record<string, SandpackFileEntry> = {}
  for (const pkgName of Object.keys(deps)) {
    const extra = COMPANION_FILES[pkgName]
    if (extra) Object.assign(files, extra)
  }
  return files
}

/**
 * Returns external resources to inject into the Sandpack preview iframe.
 * Always includes the Tailwind Play CDN for React templates so any
 * Tailwind-based library (shadcn/ui, HeroUI, flowbite, daisyUI, etc.)
 * renders correctly without requiring a PostCSS build pipeline.
 */
export function getExternalResources(template: ComponentTemplate): string[] {
  if (template === 'react') {
    return ['https://cdn.tailwindcss.com']
  }
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


