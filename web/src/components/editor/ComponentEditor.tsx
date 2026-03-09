import { useEffect, useState } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useActiveCode,
  useSandpack,
} from '@codesandbox/sandpack-react'
import type { SandpackPredefinedTemplate } from '@codesandbox/sandpack-react'
import type { ComponentTemplate } from '@/types/component'

interface ComponentEditorProps {
  code: string
  template: ComponentTemplate
  onChange: (code: string) => void
  onTemplateChange: (t: ComponentTemplate) => void
}

function getFileKey(template: ComponentTemplate): string {
  if (template === 'react') return '/App.js'
  if (template === 'vanilla') return '/index.js'
  return '/index.html'
}

function getSandpackTemplate(template: ComponentTemplate): SandpackPredefinedTemplate {
  if (template === 'react') return 'react'
  if (template === 'vanilla') return 'vanilla'
  return 'static'
}

const TEMPLATE_LABELS: Record<ComponentTemplate, string> = {
  react: 'React',
  vanilla: 'Vanilla JS',
  html: 'HTML + CSS',
}

/** Inner component — must live inside SandpackProvider to use hooks */
function CodeSyncAndPreview({
  realtimeMode,
  onChange,
}: {
  realtimeMode: boolean
  onChange: (code: string) => void
}) {
  const { code } = useActiveCode()
  const { sandpack } = useSandpack()

  // Sync code changes back to parent form state
  useEffect(() => {
    onChange(code)
  }, [code]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SandpackLayout style={{ minHeight: 500 }}>
      <SandpackCodeEditor
        style={{ minHeight: 500 }}
        showTabs
        showLineNumbers
        showInlineErrors
      />
      <div style={{ position: 'relative', flex: 1, minHeight: 500 }}>
        {!realtimeMode && (
          <button
            type="button"
            onClick={() => sandpack.runSandpack()}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 10,
            }}
            className="rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/20 transition-colors"
          >
            ▶ Run
          </button>
        )}
        <SandpackPreview style={{ minHeight: 500 }} showNavigator={false} />
      </div>
    </SandpackLayout>
  )
}

export default function ComponentEditor({
  code,
  template,
  onChange,
  onTemplateChange,
}: ComponentEditorProps) {
  const [realtimeMode, setRealtimeMode] = useState(true)

  const fileKey = getFileKey(template)
  const sandpackTemplate = getSandpackTemplate(template)

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Template selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400">Template:</span>
          <div className="flex rounded-xl border border-white/10 overflow-hidden">
            {(['react', 'vanilla', 'html'] as ComponentTemplate[]).map((t) => (
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

        {/* Run mode toggle */}
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

      {/* Sandpack split view */}
      <div className="rounded-xl overflow-hidden border border-white/10" style={{ minHeight: 500 }}>
        <SandpackProvider
          template={sandpackTemplate}
          theme="dark"
          files={{ [fileKey]: code }}
          options={{
            recompileMode: realtimeMode ? 'immediate' : 'delayed',
            recompileDelay: realtimeMode ? 0 : 9999999,
            autorun: realtimeMode,
          }}
        >
          <CodeSyncAndPreview realtimeMode={realtimeMode} onChange={onChange} />
        </SandpackProvider>
      </div>
    </div>
  )
}
