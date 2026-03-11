import { useEffect, useMemo, useRef, useState } from 'react'
import { SandpackProvider, SandpackPreview, useSandpack } from '@codesandbox/sandpack-react'
import { useNavigate } from 'react-router-dom'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { useComponentStore } from '@/store/componentStore'
import { useFolderStore } from '@/store/folderStore'
import type { Component } from '@/types/component'
import { buildFolderOptions } from '@/utils/folderUtils'
import {
  detectDependencies,
  detectExtraFiles,
  getExternalResources,
  getSandpackFiles,
  getSandpackTemplate,
} from '@/utils/sandpackUtils'

const PRIVACY_BADGE: Record<string, string> = {
  private: 'Private',
  friends: 'Friends',
  public:  'Public',
}

interface Props {
  component: Component
  folderOptions: Array<{ id: string; label: string }>
}

function AutoRunPreview() {
  const { sandpack } = useSandpack()
  const attemptsRef = useRef(0)

  useEffect(() => {
    if (sandpack.status === 'running') return
    if (attemptsRef.current >= 2) return

    const delay = attemptsRef.current === 0 ? 75 : 1500
    const timer = window.setTimeout(() => {
      attemptsRef.current += 1
      sandpack.runSandpack()
    }, delay)

    return () => window.clearTimeout(timer)
  }, [sandpack, sandpack.status])

  return null
}

function useLazyPreview() {
  const previewRef = useRef<HTMLDivElement | null>(null)
  const [canRender, setCanRender] = useState(
    () => typeof window === 'undefined' || !('IntersectionObserver' in window)
  )

  useEffect(() => {
    if (canRender) return
    if (!previewRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting)
        if (visible) {
          setCanRender(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px 0px' }
    )

    observer.observe(previewRef.current)
    return () => observer.disconnect()
  }, [canRender])

  return { previewRef, canRender }
}

function ComponentCard({ component, folderOptions }: Props) {
  const { deleteComponent, moveComponent } = useComponentStore()
  const navigate = useNavigate()
  const { previewRef, canRender } = useLazyPreview()

  const detectedDeps = useMemo(() => detectDependencies(component.code), [component.code])
  const extraFiles = useMemo(
    () => detectExtraFiles(detectedDeps, component.template, component.language),
    [detectedDeps, component.template, component.language]
  )
  const sandpackTemplate = useMemo(
    () => getSandpackTemplate(component.template),
    [component.template]
  )
  const sandpackFiles = useMemo(
    () => ({ ...getSandpackFiles(component.template, component.code, component.cssCode, component.language), ...extraFiles }),
    [component, extraFiles]
  )
  const sandpackKey = useMemo(
    () => `${component._id}:${component.template}:${component.language}:${JSON.stringify(detectedDeps)}`,
    [component._id, component.template, component.language, detectedDeps]
  )

  const handleDelete = async () => {
    if (!confirm(`Delete "${component.title}"?`)) return
    await deleteComponent(component._id)
  }

  return (
    <div
      className="overflow-hidden rounded-2xl bg-white/5 transition-colors hover:bg-white/[0.075]"
      style={{ border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div ref={previewRef} className="h-52 border-b border-white/10 bg-[#0d1117]">
        {canRender ? (
          <SandpackProvider
            key={sandpackKey}
            template={sandpackTemplate}
            theme="dark"
            files={sandpackFiles}
            customSetup={{ dependencies: detectedDeps }}
            options={{
              autorun: false,
              initMode: 'immediate',
              recompileMode: 'immediate',
              bundlerTimeOut: 120000,
              externalResources: getExternalResources(),
            }}
          >
            <AutoRunPreview />
            <SandpackPreview
              showNavigator={false}
              showRefreshButton={false}
              showOpenInCodeSandbox={false}
              showSandpackErrorOverlay
              style={{ height: 208 }}
            />
          </SandpackProvider>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-500">
            Preview loads when visible
          </div>
        )}
      </div>

      <div className="space-y-4 p-4">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-white">{component.title}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-blue-300">
              {component.language}
            </span>
            <span className="rounded-lg border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-violet-300">
              {PRIVACY_BADGE[component.privacy]}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-xs text-gray-500">
            Folder
            <select
              value={component.folderId ?? ''}
              onChange={(e) => moveComponent(component._id, e.target.value || null)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-gray-300 focus:outline-none"
            >
              <option value="">No folder</option>
              {folderOptions.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate(`/components/${component._id}`)}
            className="flex items-center gap-1 rounded-lg border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-400 transition-colors hover:bg-purple-500/20"
          >
            <Eye className="h-3 w-3" />
            View
          </button>
          <button
            onClick={() => navigate(`/components/${component._id}/edit`)}
            className="flex items-center gap-1 rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400 transition-colors hover:bg-blue-500/20"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20"
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ComponentList({ components }: { components: Component[] }) {
  const { folders } = useFolderStore()
  const folderOptions = useMemo(() => buildFolderOptions(folders), [folders])

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {components.map((c) => (
        <ComponentCard key={c._id} component={c} folderOptions={folderOptions} />
      ))}
    </div>
  )
}
