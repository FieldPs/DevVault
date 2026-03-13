import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  SandpackCodeEditor,
  SandpackConsole,
  SandpackPreview,
  SandpackProvider,
} from '@codesandbox/sandpack-react'
import RunPreviewOnDemand from '@/components/editor/RunPreviewOnDemand'
import type { PublicComponent } from '@/types/component'
import { useAuthStore } from '@/store/authStore'
import { useComponentStore } from '@/store/componentStore'
import {
  detectDependencies,
  detectExtraFiles,
  getExternalResources,
  getSandpackEditorOptions,
  getSandpackFiles,
  getSandpackTemplate,
} from '@/utils/sandpackUtils'

type Tab = 'preview' | 'code'

function getOwnerName(component: PublicComponent): string {
  if (typeof component.ownerId === 'string') return 'Unknown'
  return component.ownerId.username
}

export default function PublicComponentPage() {
  const { id } = useParams<{ id: string }>()
  const { getPublicComponent } = useComponentStore()
  const { user, loading: authLoading } = useAuthStore()

  const [component, setComponent] = useState<PublicComponent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('preview')
  const [showConsole, setShowConsole] = useState(false)

  const detectedDeps = useMemo(
    () => (component ? detectDependencies(component.code) : {}),
    [component]
  )
  const extraFiles = useMemo(
    () => detectExtraFiles(detectedDeps, component?.template || 'react', component?.language || 'tsx'),
    [component, detectedDeps]
  )
  const files = useMemo(
    () => (component ? { ...getSandpackFiles(component.template, component.code, component.cssCode, component.language), ...extraFiles } : {}),
    [component, extraFiles]
  )
  const template = useMemo(
    () => getSandpackTemplate(component?.template || 'react'),
    [component]
  )
  const editorOptions = useMemo(
    () => getSandpackEditorOptions(component?.template || 'react', component?.language || 'tsx'),
    [component]
  )
  const sandpackKey = useMemo(() => {
    if (!component) return 'public-component'
    return `${component._id}:${component.template}:${component.language}:${JSON.stringify(detectedDeps)}`
  }, [component, detectedDeps])

  useEffect(() => {
    if (!id) return
    let active = true
    getPublicComponent(id)
      .then((result) => {
        if (active) setComponent(result)
      })
      .catch(() => {
        if (active) setError('Public component not found or unavailable.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id, getPublicComponent])

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#0a0a0f_0%,#0d1117_50%,#0a0f1a_100%)] px-6 py-8">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        {authLoading ? (
          <span className="text-sm text-gray-500">Loading session…</span>
        ) : user ? (
          <>
            <Link to="/dashboard" className="text-sm text-gray-400 transition-colors hover:text-white">
              ← Dashboard
            </Link>
            <Link to="/explore" className="text-sm text-blue-400 transition-colors hover:text-blue-300">
              Explore
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-gray-400 transition-colors hover:text-white">
              ← Login
            </Link>
            <Link to="/register" className="text-sm text-blue-400 transition-colors hover:text-blue-300">
              Create account
            </Link>
          </>
        )}
      </div>

      <div className="mx-auto mt-6 w-full max-w-5xl">
        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-gray-400">
            Loading public component…
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-10 text-center text-sm text-red-300">
            {error}
          </div>
        )}

        {!loading && component && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h1 className="text-2xl font-bold text-white">{component.title}</h1>
              <p className="mt-2 text-sm text-gray-400">
                By <span className="text-blue-300">{getOwnerName(component)}</span> · {component.language}
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="flex border-b border-white/10">
                {(['preview', 'code'] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2.5 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab ? 'border-b-2 border-purple-500 text-white' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {tab === 'preview' ? 'Preview' : 'Code'}
                  </button>
                ))}
              </div>

              <SandpackProvider
                key={sandpackKey}
                template={template}
                theme="dark"
                files={files}
                customSetup={{ dependencies: detectedDeps }}
                options={{
                  ...editorOptions,
                  autorun: false,
                  initMode: 'immediate',
                  recompileMode: 'immediate',
                  bundlerTimeOut: 180000,
                  externalResources: getExternalResources(),
                }}
              >
                <RunPreviewOnDemand enabled={activeTab === 'preview'} />
                <div className={activeTab === 'preview' ? 'block' : 'hidden'}>
                  <SandpackPreview
                    style={{ minHeight: 560 }}
                    showNavigator={false}
                    showRefreshButton
                    showOpenInCodeSandbox={false}
                    showSandpackErrorOverlay
                  />
                  <button
                    type="button"
                    onClick={() => setShowConsole((prev) => !prev)}
                    className="w-full border-t border-white/10 bg-white/5 px-3 py-2 text-left text-xs text-gray-400 transition-colors hover:text-white"
                  >
                    Console {showConsole ? '▲' : '▼'}
                  </button>
                  {showConsole && <SandpackConsole style={{ maxHeight: 180, overflow: 'auto' }} showSyntaxError showSetupProgress />}
                </div>

                <div className={activeTab === 'code' ? 'block' : 'hidden'}>
                  <SandpackCodeEditor readOnly showTabs showLineNumbers style={{ minHeight: 560 }} />
                </div>
              </SandpackProvider>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
