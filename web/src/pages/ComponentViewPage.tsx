import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  SandpackProvider,
  SandpackPreview,
  SandpackCodeEditor,
  SandpackConsole,
} from '@codesandbox/sandpack-react'
import Navbar from '@/components/layout/Navbar'
import { useComponentStore } from '@/store/componentStore'
import type { Component } from '@/types/component'
import { getSandpackTemplate, getSandpackFiles, detectDependencies, detectExtraFiles, getExternalResources } from '@/utils/sandpackUtils'

type Tab = 'preview' | 'code'

export default function ComponentViewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getComponent } = useComponentStore()

  const [component, setComponent] = useState<Component | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('preview')
  const [copied, setCopied] = useState(false)
  const [showConsole, setShowConsole] = useState(false)

  // Auto-detect dependencies from the component's import statements
  const detectedDeps = useMemo(
    () => (component ? detectDependencies(component.code) : {}),
    [component]
  )
  const extraFiles = useMemo(() => detectExtraFiles(detectedDeps, component?.template || 'react'), [detectedDeps, component])

  useEffect(() => {
    if (!id) return
    let active = true
    getComponent(id)
      .then((c) => { if (active) setComponent(c) })
      .catch(() => { if (active) setError('Component not found or failed to load.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id, getComponent])

  const handleCopy = async () => {
    if (!component) return
    try {
      await navigator.clipboard.writeText(component.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: do nothing
    }
  }

  return (
    <div className="bg-[linear-gradient(135deg,#0a0a0f_0%,#0d1117_50%,#0a0f1a_100%)] min-h-screen relative overflow-clip">
      <Navbar />

      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Back button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-sm text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Dashboard
        </button>

        {/* Loading */}
        {loading && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)] rounded-2xl p-10 text-center text-gray-400 text-sm">
            Loading component…
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)] rounded-2xl p-10 text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && component && (
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)] rounded-2xl px-6 py-5 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-2xl font-bold bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent truncate">{component.title}</h1>
                {component.description && (
                  <p className="mt-1 text-sm text-gray-400">{component.description}</p>
                )}
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5">
                    {component.language}
                  </span>
                  <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5">
                    {component.template}
                  </span>
                  <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5">
                    {component.privacy}
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/components/${component._id}/edit`)}
                className="bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 active:translate-y-0 hover:-translate-y-px transition-all shadow-[0_0_24px_rgba(139,92,246,0.45),0_4px_16px_rgba(59,130,246,0.3)] shrink-0 rounded-xl px-4 py-2 text-sm font-semibold text-white"
              >
                ✏️ Edit
              </button>
            </div>

            {/* Tabs */}
            <div className="flex flex-col gap-0">
              {/* Tab bar */}
              <div className="flex border-b border-white/10">
                {(['preview', 'code'] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2.5 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-b-2 border-purple-500 text-white'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {tab === 'preview' ? '▶ Preview' : '</> Code'}
                  </button>
                ))}
              </div>

              {/* Tab panels */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)] rounded-b-2xl rounded-tr-2xl overflow-hidden">
                {activeTab === 'preview' && (
                  <SandpackProvider
                    template={getSandpackTemplate(component.template)}
                    theme="dark"
                    files={{ ...getSandpackFiles(component.template, component.code, component.cssCode), ...extraFiles }}
                    customSetup={{ dependencies: detectedDeps }}
                    options={{ bundlerTimeOut: 60000, externalResources: getExternalResources() }}
                  >
                    <SandpackPreview
                      style={{ minHeight: 600 }}
                      showNavigator={false}
                    />
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
                )}

                {activeTab === 'code' && (
                  <div className="relative">
                    {/* Copy button */}
                    <button
                      onClick={handleCopy}
                      className={`absolute top-3 right-3 z-10 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        copied
                          ? 'border-green-500/40 bg-green-500/10 text-green-400'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {copied ? '✓ Copied!' : 'Copy Code'}
                    </button>

                    <SandpackProvider
                      template={getSandpackTemplate(component.template)}
                      theme="dark"
                      files={{ ...getSandpackFiles(component.template, component.code, component.cssCode), ...extraFiles }}
                      customSetup={{ dependencies: detectedDeps }}
                      options={{ bundlerTimeOut: 60000, externalResources: getExternalResources() }}
                    >
                      <SandpackCodeEditor
                        readOnly
                        showTabs
                        showLineNumbers
                        style={{ minHeight: 600 }}
                      />
                    </SandpackProvider>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
