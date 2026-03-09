import { useEffect, useMemo, useState } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
  useActiveCode,
  useSandpack,
} from '@codesandbox/sandpack-react'
import type { ComponentTemplate } from '@/types/component'
import {
  getSandpackTemplate,
  getSandpackFiles,
  detectDependencies,
  detectExtraFiles,
} from '@/utils/sandpackUtils'

interface ComponentEditorProps {
  code: string
  cssCode?: string
  template: ComponentTemplate
  onChange: (code: string) => void
  onCssChange?: (css: string) => void
  onTemplateChange: (t: ComponentTemplate) => void
}

const TEMPLATE_LABELS: Partial<Record<ComponentTemplate, string>> = {
  react: 'React',
  html: 'HTML + CSS',
}

/** Syncs active file(s) back to parent — must live inside SandpackProvider */
function FileSyncer({
  template,
  onChange,
  onCssChange,
}: {
  template: ComponentTemplate
  onChange: (code: string) => void
  onCssChange?: (css: string) => void
}) {
  const { code } = useActiveCode()
  const { sandpack } = useSandpack()

  // React mode: sync active file
  useEffect(() => {
    if (template !== 'html') {
      onChange(code)
    }
  }, [code]) // eslint-disable-line react-hooks/exhaustive-deps

  // HTML+CSS mode: sync both files
  useEffect(() => {
    if (template === 'html') {
      onChange(sandpack.files['/index.html']?.code ?? '')
      onCssChange?.(sandpack.files['/styles.css']?.code ?? '')
    }
  }, [sandpack.files]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

/** Run button + preview — must live inside SandpackProvider */
function PreviewPanel({ realtimeMode }: { realtimeMode: boolean }) {
  const { sandpack } = useSandpack()

  return (
    <div style={{ position: 'relative', flex: 1, minHeight: 700 }}>
      {!realtimeMode && (
        <button
          type="button"
          onClick={() => sandpack.runSandpack()}
          style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
          className="rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/20 transition-colors"
        >
          ▶ Run
        </button>
      )}
      <SandpackPreview style={{ minHeight: 700 }} showNavigator={false} />
    </div>
  )
}

export default function ComponentEditor({
  code,
  cssCode,
  template,
  onChange,
  onCssChange,
  onTemplateChange,
}: ComponentEditorProps) {
  const [realtimeMode, setRealtimeMode] = useState(false)
  const [showConsole, setShowConsole] = useState(false)

  // Auto-detect dependencies from import statements
  const detectedDeps = useMemo(() => detectDependencies(code), [code])
  const extraFiles   = useMemo(() => detectExtraFiles(detectedDeps), [detectedDeps])

  // Key changes when the set of packages changes → triggers SandpackProvider remount → installs new packages
  const sandpackKey = useMemo(
    () => Object.keys(detectedDeps).sort().join(','),
    [detectedDeps]
  )

  const sandpackTemplate = getSandpackTemplate(template)
  const files = { ...getSandpackFiles(template, code, cssCode), ...extraFiles }

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Template selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400">Template:</span>
          <div className="flex rounded-xl border border-white/10 overflow-hidden">
            {(['react', 'html'] as ComponentTemplate[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onTemplateChange(t)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  template === t
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {TEMPLATE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400">Mode:</span>
          <button
            type="button"
            onClick={() => setRealtimeMode((prev) => !prev)}
            className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
              realtimeMode
                ? 'border-green-500/40 bg-green-500/10 text-green-400'
                : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            {realtimeMode ? '⚡ Real-time' : '▶ Manual'}
          </button>
        </div>
      </div>

      {/* Sandpack */}
      <div className="rounded-xl overflow-hidden border border-white/10" style={{ minHeight: 700 }}>
        <SandpackProvider
          key={sandpackKey}
          template={sandpackTemplate}
          theme="dark"
          files={files}
          customSetup={{ dependencies: detectedDeps }}
          options={{
            recompileMode: realtimeMode ? 'immediate' : 'delayed',
            recompileDelay: realtimeMode ? 0 : 9_999_999,
            autorun: realtimeMode,
          }}
        >
          <FileSyncer template={template} onChange={onChange} onCssChange={onCssChange} />

          <SandpackLayout style={{ minHeight: 700 }}>
            <SandpackCodeEditor
              style={{ minHeight: 700 }}
              showTabs
              showLineNumbers
              showInlineErrors
            />
            <PreviewPanel realtimeMode={realtimeMode} />
          </SandpackLayout>

          {/* Collapsible console */}
          <button
            type="button"
            onClick={() => setShowConsole((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-white/5 border-t border-white/10 transition-colors"
          >
            <span>Console</span>
            <span>{showConsole ? '▲' : '▼'}</span>
          </button>
          {showConsole && (
            <SandpackConsole style={{ maxHeight: 150, overflow: 'auto' }} />
          )}
        </SandpackProvider>
      </div>
    </div>
  )
}

