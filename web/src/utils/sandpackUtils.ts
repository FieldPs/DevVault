import type { SandpackPredefinedTemplate } from '@codesandbox/sandpack-react'
import type { ComponentTemplate } from '@/types/component'

export function getSandpackTemplate(template: ComponentTemplate): SandpackPredefinedTemplate {
  return template === 'react' ? 'react' : 'static'
}

export function getSandpackFiles(
  template: ComponentTemplate,
  code: string,
  cssCode?: string
): Record<string, string> {
  if (template === 'html') {
    return { '/index.html': code, '/styles.css': cssCode ?? '' }
  }
  return { '/App.js': code }
}

const BUILTIN_PACKAGES = new Set([
  'react', 'react-dom', 'react-dom/client', 'react/jsx-runtime',
  'path', 'fs', 'os', 'url', 'util', 'events', 'stream', 'http', 'https',
])

// Peer/companion deps required when certain packages are used
const COMPANION_DEPS: Record<string, Record<string, string>> = {
  '@heroui/react':      { tailwindcss: 'latest', 'framer-motion': 'latest' },
  '@nextui-org/react':  { tailwindcss: 'latest', 'framer-motion': 'latest' },
  'framer-motion':      {},
}

// Extra Sandpack files to inject when certain packages are detected
// (e.g. Tailwind CDN in index.html so HeroUI utility classes render correctly)
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

const COMPANION_FILES: Record<string, Record<string, string>> = {
  '@heroui/react':     { '/public/index.html': HEROUI_INDEX_HTML },
  '@nextui-org/react': { '/public/index.html': HEROUI_INDEX_HTML },
}

export function detectDependencies(code: string): Record<string, string> {
  const deps: Record<string, string> = {}

  // Match ES import statements: import ... from 'pkg' and import 'pkg'
  const importRegex = /import\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g
  let match: RegExpExecArray | null

  while ((match = importRegex.exec(code)) !== null) {
    const raw = match[1]

    // Skip relative imports
    if (raw.startsWith('.')) continue

    // Extract root package name
    let pkgName: string
    if (raw.startsWith('@')) {
      // Scoped: @scope/pkg/subpath → @scope/pkg
      const parts = raw.split('/')
      pkgName = parts.length >= 2 ? `${parts[0]}/${parts[1]}` : raw
    } else {
      // Regular: pkg/subpath → pkg
      pkgName = raw.split('/')[0]
    }

    if (BUILTIN_PACKAGES.has(pkgName)) continue
    deps[pkgName] = 'latest'
  }

  // Inject companion/peer deps (e.g. tailwindcss when @heroui/react is used)
  for (const pkgName of Object.keys(deps)) {
    const companions = COMPANION_DEPS[pkgName]
    if (companions) Object.assign(deps, companions)
  }

  return deps
}

/** Extra files to inject into Sandpack based on detected deps (e.g. Tailwind CDN HTML) */
export function detectExtraFiles(deps: Record<string, string>): Record<string, string> {
  const files: Record<string, string> = {}
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
    // Handle scoped packages like @heroui/react or @heroui/react@2.0.0
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
