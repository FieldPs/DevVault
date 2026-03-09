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

  return deps
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
