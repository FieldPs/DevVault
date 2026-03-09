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
  '@heroui/react':      { 'framer-motion': 'latest', tailwindcss: '3.4.17' },
  '@nextui-org/react':  { 'framer-motion': 'latest', tailwindcss: '3.4.17' },
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
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sandbox</title>

    <!-- HeroUI dark-theme CSS variables — injected directly so they are always
         available regardless of whether the PostCSS pipeline runs -->
    <style>
      :root {
        color-scheme: dark;
        /* layout */
        --heroui-background: 0 0% 7%;
        --heroui-foreground: 213 31% 91%;
        --heroui-overlay: 0 0% 0%;
        --heroui-focus: 212 100% 47%;
        --heroui-divider: 0 0% 100%;
        --heroui-divider-opacity: 0.15;
        /* primary — blue */
        --heroui-primary-50:  214 100% 97%;
        --heroui-primary-100: 214 95% 93%;
        --heroui-primary-200: 213 97% 87%;
        --heroui-primary-300: 212 96% 78%;
        --heroui-primary-400: 213 94% 68%;
        --heroui-primary-500: 212 100% 47%;
        --heroui-primary-600: 221 83% 53%;
        --heroui-primary-700: 224 76% 48%;
        --heroui-primary-800: 226 71% 40%;
        --heroui-primary-900: 224 64% 33%;
        --heroui-primary:     212 100% 47%;
        --heroui-primary-foreground: 0 0% 100%;
        /* secondary — purple */
        --heroui-secondary-50:  270 100% 98%;
        --heroui-secondary-100: 269 100% 95%;
        --heroui-secondary-200: 269 100% 92%;
        --heroui-secondary-300: 269 97% 85%;
        --heroui-secondary-400: 270 95% 75%;
        --heroui-secondary-500: 265 89% 60%;
        --heroui-secondary-600: 270 91% 65%;
        --heroui-secondary-700: 272 72% 47%;
        --heroui-secondary-800: 273 67% 39%;
        --heroui-secondary-900: 274 66% 32%;
        --heroui-secondary:     265 89% 60%;
        --heroui-secondary-foreground: 0 0% 100%;
        /* success — green */
        --heroui-success-50:  150 80% 95%;
        --heroui-success-100: 150 80% 85%;
        --heroui-success-200: 151 80% 74%;
        --heroui-success-300: 152 76% 64%;
        --heroui-success-400: 153 69% 53%;
        --heroui-success-500: 158 64% 52%;
        --heroui-success-600: 156 84% 40%;
        --heroui-success-700: 157 79% 35%;
        --heroui-success-800: 158 80% 29%;
        --heroui-success-900: 158 79% 24%;
        --heroui-success:     158 64% 52%;
        --heroui-success-foreground: 0 0% 0%;
        /* warning — amber */
        --heroui-warning-50:  55 92% 95%;
        --heroui-warning-100: 55 97% 88%;
        --heroui-warning-200: 52 98% 76%;
        --heroui-warning-300: 46 97% 65%;
        --heroui-warning-400: 43 96% 56%;
        --heroui-warning-500: 39 100% 57%;
        --heroui-warning-600: 32 95% 44%;
        --heroui-warning-700: 26 90% 37%;
        --heroui-warning-800: 23 82% 31%;
        --heroui-warning-900: 22 78% 26%;
        --heroui-warning:     39 100% 57%;
        --heroui-warning-foreground: 0 0% 0%;
        /* danger — red */
        --heroui-danger-50:  0 100% 97%;
        --heroui-danger-100: 0 100% 94%;
        --heroui-danger-200: 357 96% 90%;
        --heroui-danger-300: 352 96% 83%;
        --heroui-danger-400: 343 96% 72%;
        --heroui-danger-500: 0 91% 63%;
        --heroui-danger-600: 340 82% 62%;
        --heroui-danger-700: 341 79% 53%;
        --heroui-danger-800: 343 79% 44%;
        --heroui-danger-900: 345 80% 36%;
        --heroui-danger:     0 91% 63%;
        --heroui-danger-foreground: 0 0% 100%;
        /* default — gray */
        --heroui-default-50:  0 0% 97%;
        --heroui-default-100: 0 0% 93%;
        --heroui-default-200: 0 0% 88%;
        --heroui-default-300: 0 0% 74%;
        --heroui-default-400: 0 0% 56%;
        --heroui-default-500: 0 0% 39%;
        --heroui-default-600: 0 0% 28%;
        --heroui-default-700: 0 0% 20%;
        --heroui-default-800: 0 0% 15%;
        --heroui-default-900: 240 6% 10%;
        --heroui-default:     240 3.7% 26%;
        --heroui-default-foreground: 0 0% 93%;
        /* content layers */
        --heroui-content1: 240 6% 10%;
        --heroui-content1-foreground: 0 0% 90%;
        --heroui-content2: 240 5% 15%;
        --heroui-content2-foreground: 0 0% 82%;
        --heroui-content3: 240 5% 20%;
        --heroui-content3-foreground: 0 0% 71%;
        --heroui-content4: 240 4% 26%;
        --heroui-content4-foreground: 0 0% 56%;
        /* radii */
        --heroui-radius-small:  8px;
        --heroui-radius-medium: 12px;
        --heroui-radius-large:  14px;
        /* border widths */
        --heroui-border-width-small:  1px;
        --heroui-border-width-medium: 2px;
        --heroui-border-width-large:  3px;
      }
    </style>

    <!-- Configure Tailwind CDN BEFORE it loads so it knows about HeroUI
         semantic colors (bg-primary, text-danger, etc.) -->
    <script>
      window.tailwind = {
        config: {
          darkMode: 'class',
          theme: {
            extend: {
              colors: {
                background: 'hsl(var(--heroui-background))',
                foreground: 'hsl(var(--heroui-foreground))',
                overlay:    'hsl(var(--heroui-overlay))',
                focus:      'hsl(var(--heroui-focus))',
                divider:    'hsl(var(--heroui-divider) / var(--heroui-divider-opacity, 1))',
                primary: {
                  DEFAULT:    'hsl(var(--heroui-primary))',
                  foreground: 'hsl(var(--heroui-primary-foreground))',
                  50:  'hsl(var(--heroui-primary-50))',
                  100: 'hsl(var(--heroui-primary-100))',
                  200: 'hsl(var(--heroui-primary-200))',
                  300: 'hsl(var(--heroui-primary-300))',
                  400: 'hsl(var(--heroui-primary-400))',
                  500: 'hsl(var(--heroui-primary-500))',
                  600: 'hsl(var(--heroui-primary-600))',
                  700: 'hsl(var(--heroui-primary-700))',
                  800: 'hsl(var(--heroui-primary-800))',
                  900: 'hsl(var(--heroui-primary-900))',
                },
                secondary: {
                  DEFAULT:    'hsl(var(--heroui-secondary))',
                  foreground: 'hsl(var(--heroui-secondary-foreground))',
                  50:  'hsl(var(--heroui-secondary-50))',
                  100: 'hsl(var(--heroui-secondary-100))',
                  200: 'hsl(var(--heroui-secondary-200))',
                  300: 'hsl(var(--heroui-secondary-300))',
                  400: 'hsl(var(--heroui-secondary-400))',
                  500: 'hsl(var(--heroui-secondary-500))',
                  600: 'hsl(var(--heroui-secondary-600))',
                  700: 'hsl(var(--heroui-secondary-700))',
                  800: 'hsl(var(--heroui-secondary-800))',
                  900: 'hsl(var(--heroui-secondary-900))',
                },
                success: {
                  DEFAULT:    'hsl(var(--heroui-success))',
                  foreground: 'hsl(var(--heroui-success-foreground))',
                  50:  'hsl(var(--heroui-success-50))',
                  100: 'hsl(var(--heroui-success-100))',
                  200: 'hsl(var(--heroui-success-200))',
                  300: 'hsl(var(--heroui-success-300))',
                  400: 'hsl(var(--heroui-success-400))',
                  500: 'hsl(var(--heroui-success-500))',
                  600: 'hsl(var(--heroui-success-600))',
                  700: 'hsl(var(--heroui-success-700))',
                  800: 'hsl(var(--heroui-success-800))',
                  900: 'hsl(var(--heroui-success-900))',
                },
                warning: {
                  DEFAULT:    'hsl(var(--heroui-warning))',
                  foreground: 'hsl(var(--heroui-warning-foreground))',
                  50:  'hsl(var(--heroui-warning-50))',
                  100: 'hsl(var(--heroui-warning-100))',
                  200: 'hsl(var(--heroui-warning-200))',
                  300: 'hsl(var(--heroui-warning-300))',
                  400: 'hsl(var(--heroui-warning-400))',
                  500: 'hsl(var(--heroui-warning-500))',
                  600: 'hsl(var(--heroui-warning-600))',
                  700: 'hsl(var(--heroui-warning-700))',
                  800: 'hsl(var(--heroui-warning-800))',
                  900: 'hsl(var(--heroui-warning-900))',
                },
                danger: {
                  DEFAULT:    'hsl(var(--heroui-danger))',
                  foreground: 'hsl(var(--heroui-danger-foreground))',
                  50:  'hsl(var(--heroui-danger-50))',
                  100: 'hsl(var(--heroui-danger-100))',
                  200: 'hsl(var(--heroui-danger-200))',
                  300: 'hsl(var(--heroui-danger-300))',
                  400: 'hsl(var(--heroui-danger-400))',
                  500: 'hsl(var(--heroui-danger-500))',
                  600: 'hsl(var(--heroui-danger-600))',
                  700: 'hsl(var(--heroui-danger-700))',
                  800: 'hsl(var(--heroui-danger-800))',
                  900: 'hsl(var(--heroui-danger-900))',
                },
                default: {
                  DEFAULT:    'hsl(var(--heroui-default))',
                  foreground: 'hsl(var(--heroui-default-foreground))',
                  50:  'hsl(var(--heroui-default-50))',
                  100: 'hsl(var(--heroui-default-100))',
                  200: 'hsl(var(--heroui-default-200))',
                  300: 'hsl(var(--heroui-default-300))',
                  400: 'hsl(var(--heroui-default-400))',
                  500: 'hsl(var(--heroui-default-500))',
                  600: 'hsl(var(--heroui-default-600))',
                  700: 'hsl(var(--heroui-default-700))',
                  800: 'hsl(var(--heroui-default-800))',
                  900: 'hsl(var(--heroui-default-900))',
                },
                content1: {
                  DEFAULT:    'hsl(var(--heroui-content1))',
                  foreground: 'hsl(var(--heroui-content1-foreground))',
                },
                content2: {
                  DEFAULT:    'hsl(var(--heroui-content2))',
                  foreground: 'hsl(var(--heroui-content2-foreground))',
                },
                content3: {
                  DEFAULT:    'hsl(var(--heroui-content3))',
                  foreground: 'hsl(var(--heroui-content3-foreground))',
                },
                content4: {
                  DEFAULT:    'hsl(var(--heroui-content4))',
                  foreground: 'hsl(var(--heroui-content4-foreground))',
                },
              },
            },
          },
        },
      }
    </script>

    <!-- Tailwind Play CDN — reads window.tailwind.config set above -->
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="dark bg-background text-foreground">
    <div id="root"></div>
  </body>
</html>`

// Only @tailwind base is needed: generates HeroUI CSS variables via heroui()
// plugin. Utilities are handled by the Tailwind Play CDN (externalResources).
const HEROUI_INDEX_CSS = `/* Styles handled by Tailwind Play CDN configured in index.html */`

// heroui() plugin generates all bg-primary / text-primary-foreground classes.
// The third content entry is required so Tailwind scans HeroUI's own theme
// dist files and generates the CSS-variable-backed utility classes.

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
    '/public/index.html': { code: HEROUI_INDEX_HTML, hidden: true },
    '/index.js':          { code: HEROUI_INDEX_JS,   hidden: true },
    '/index.css':         { code: HEROUI_INDEX_CSS,  hidden: true },
  },
  '@nextui-org/react': {
    '/public/index.html': { code: HEROUI_INDEX_HTML, hidden: true },
    '/index.js':          { code: HEROUI_INDEX_JS,   hidden: true },
    '/index.css':         { code: HEROUI_INDEX_CSS,  hidden: true },
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

export function getExternalResources(template: ComponentTemplate, deps: Record<string, string> = {}): string[] {
  if (template !== 'react') return []
  // HeroUI/NextUI embed Tailwind CDN inside their custom index.html — skip here
  if (deps['@heroui/react'] || deps['@nextui-org/react']) return []
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


