import { useEffect, useMemo, useRef, useState } from 'react'
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
  getExternalResources,
  getSandpackEditorOptions,
} from '@/utils/sandpackUtils'

interface ComponentEditorProps {
  code: string
  cssCode?: string
  template: ComponentTemplate
  language?: string
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
  const lastCodeRef = useRef<string>('')
  const lastCssRef  = useRef<string>('')

  // React mode: only propagate when string actually changed
  useEffect(() => {
    if (template !== 'html' && code !== lastCodeRef.current) {
      lastCodeRef.current = code
      onChange(code)
    }
  }, [code]) // eslint-disable-line react-hooks/exhaustive-deps

  // HTML+CSS mode: only propagate when either file string actually changed
  useEffect(() => {
    if (template !== 'html') return
    const html = sandpack.files['/App.html']?.code ?? ''
    const css  = sandpack.files['/styles.css']?.code  ?? ''
    let changed = false
    if (html !== lastCodeRef.current) { lastCodeRef.current = html; changed = true; onChange(html) }
    if (css  !== lastCssRef.current)  { lastCssRef.current  = css;  changed = true; onCssChange?.(css) }
    void changed
  }, [sandpack.files]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

/** Run button + preview — must live inside SandpackProvider */
function PreviewPanel({ realtimeMode }: { realtimeMode: boolean }) {
  const { sandpack } = useSandpack()
  const [bgType, setBgType] = useState<'dark' | 'light' | 'transparent'>('dark')

  // Send message to iframe when background changes
  useEffect(() => {
    // We send it to all iframes to be safe, Sandpack sets class sp-preview-iframe
    const frames = document.querySelectorAll('.sp-preview-iframe')
    frames.forEach(f => {
      const iframe = f as HTMLIFrameElement
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'bg-change', bg: bgType }, '*')
      }
    })
  }, [bgType, sandpack.status]) // Resend on status change (e.g. reload)

  return (
    <div className="flex flex-col bg-[#151515] border-r border-white/5" style={{ flex: 1, minHeight: 700 }}>
      {/* Background toggle bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#1e1e1e]">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Background:</span>
          <div className="flex items-center rounded-lg overflow-hidden border border-white/10 bg-black/20">
            <button 
              onClick={() => setBgType('dark')}
              className={`w-6 h-6 flex items-center justify-center transition-colors ${bgType === 'dark' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              title="Dark"
            >
              <div className="w-3 h-3 rounded-full bg-[#212121] border border-white/20" />
            </button>
            <button 
              onClick={() => setBgType('light')}
              className={`w-6 h-6 flex items-center justify-center transition-colors ${bgType === 'light' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              title="Light"
            >
              <div className="w-3 h-3 rounded-full bg-[#f5f5f5] border border-black/20" />
            </button>
            <button 
              onClick={() => setBgType('transparent')}
              className={`w-6 h-6 flex items-center justify-center transition-colors ${bgType === 'transparent' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              title="Transparent"
            >
              <div className="w-3 h-3 rounded-full bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMElEQVQ4T2N89uzZfwY8QFJSEp80A+OIAMOX1BIA0Q+o4Kj4YNTBqIOY4IFn0wMAAG7gMh520H9/AAAAAElFTkSuQmCC')] border border-white/10" />
            </button>
          </div>
        </div>
        {!realtimeMode && (
          <button
            type="button"
            onClick={() => sandpack.runSandpack()}
            className="rounded border border-green-500/40 bg-green-500/10 px-2.5 py-1 text-[11px] font-medium text-green-400 hover:bg-green-500/20 transition-colors"
          >
            ▶ Run
          </button>
        )}
      </div>
      <div style={{ position: 'relative', flex: 1 }}>
        <SandpackPreview style={{ minHeight: '100%', height: '100%' }} showNavigator={false} />
      </div>
    </div>
  )
}

export default function ComponentEditor({
  code,
  cssCode,
  template,
  language,
  onChange,
  onCssChange,
  onTemplateChange,
}: ComponentEditorProps) {
  const [realtimeMode, setRealtimeMode] = useState(false)
  const [showConsole, setShowConsole] = useState(false)

  // Auto-detect dependencies from import statements
  const detectedDeps = useMemo(() => detectDependencies(code), [code])
  const extraFiles   = useMemo(() => detectExtraFiles(detectedDeps, template, language), [detectedDeps, template, language])

  // Include template in key so switching template always remounts the provider
  const sandpackKey = useMemo(
    () => `${template}:${JSON.stringify(detectedDeps)}`,
    [template, detectedDeps]
  )

  const sandpackTemplate = getSandpackTemplate(template)
  const sandpackEditorOptions = useMemo(
    () => getSandpackEditorOptions(template, language),
    [template, language]
  )
  const files = useMemo(
    () => ({ ...getSandpackFiles(template, code, cssCode, language), ...extraFiles }),
    [template, code, cssCode, language, extraFiles]
  )

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
            ...sandpackEditorOptions,
            recompileMode: realtimeMode ? 'immediate' : 'delayed',
            recompileDelay: realtimeMode ? 300 : 9_999_999,
            autorun: realtimeMode,
            bundlerTimeOut: 60000,
            externalResources: getExternalResources(),
          }}
        >
          <FileSyncer template={template} onChange={onChange} onCssChange={onCssChange} />

          <SandpackLayout style={{ minHeight: 700, border: 'none' }}>
            <PreviewPanel realtimeMode={realtimeMode} />
            <SandpackCodeEditor
              style={{ minHeight: 700 }}
              showTabs
              showLineNumbers
              showInlineErrors
            />
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

