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

// Peer / companion packages automatically added when a package is detected
const COMPANION_DEPS: Record<string, Record<string, string>> = {
  '@heroui/react':      { tailwindcss: 'latest', 'framer-motion': 'latest' },
  '@nextui-org/react':  { tailwindcss: 'latest', 'framer-motion': 'latest' },
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
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`

// Overrides the template entry so every HeroUI component is wrapped in
// HeroUIProvider (required for CSS variables / theme context).
const HEROUI_INDEX_JS = `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HeroUIProvider } from '@heroui/react';
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
    '/public/index.html': { code: HEROUI_INDEX_HTML, hidden: true },
    '/index.js':           { code: HEROUI_INDEX_JS,   hidden: true },
  },
  '@nextui-org/react': {
    '/public/index.html': { code: HEROUI_INDEX_HTML, hidden: true },
    '/index.js':           { code: HEROUI_INDEX_JS,   hidden: true },
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


