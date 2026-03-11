import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useComponentStore } from '@/store/componentStore'
import { useFolderStore } from '@/store/folderStore'
import { parseError } from '@/utils/errorUtils'
import type { ComponentInput, ComponentTemplate, ComponentPrivacy } from '@/types/component'
import ComponentEditor from '@/components/editor/ComponentEditor'
import { buildFolderOptions } from '@/utils/folderUtils'

const PRIVACY_OPTIONS: ComponentPrivacy[] = ['private', 'friends', 'public']

const getLang = (t: ComponentTemplate) => (t === 'react' ? 'tsx' : 'html')

const DEFAULT_REACT_CODE = `import { Button } from "@heroui/react";

export default function App() {
  return (
    <div className="flex flex-col gap-4 items-center p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl">
      <h1 className="text-2xl font-bold text-white tracking-tight">HeroUI Sandbox</h1>
      <p className="text-gray-400 text-sm mb-4">Edit this component to see live changes.</p>
      <Button color="primary" variant="shadow">
        Interactive Button
      </Button>
    </div>
  );
}`;

const DEFAULT_HTML_CODE = `<div class="flex flex-col gap-4 items-center p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl">
  <h1 class="text-2xl font-bold text-white tracking-tight">HTML Sandbox</h1>
  <p class="text-gray-400 text-sm mb-4">Edit this component to see live changes.</p>
  <button class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg transition-all">
    Interactive Button
  </button>
</div>`;

const DEFAULT_FORM: ComponentInput = {
  title: '',
  description: '',
  code: DEFAULT_REACT_CODE,
  cssCode: '',
  language: 'tsx',
  template: 'react',
  privacy: 'private',
  folderId: null,
}

export default function ComponentFormPage() {
  const { id } = useParams<{ id?: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const defaultFolderId = searchParams.get('folderId')
  const { createComponent, updateComponent, getComponent } = useComponentStore()
  const { folders, fetchFolders } = useFolderStore()

  const [form, setForm] = useState<ComponentInput>({
    ...DEFAULT_FORM,
    folderId: defaultFolderId ?? null,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const folderOptions = buildFolderOptions(folders)

  useEffect(() => {
    fetchFolders()
  }, [fetchFolders])

  useEffect(() => {
    if (!isEdit || !id) return
    setLoading(true)
    getComponent(id)
      .then((c) =>
        setForm({
          title: c.title,
          description: c.description ?? '',
          code: c.code,
          cssCode: c.cssCode ?? '',
          language: c.language,
          template: c.template,
          privacy: c.privacy,
          folderId: c.folderId ?? null,
        })
      )
      .catch(() => setError('Failed to load component'))
      .finally(() => setLoading(false))
  }, [id, isEdit, getComponent])

  const set = <K extends keyof ComponentInput>(key: K, value: ComponentInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload: ComponentInput = {
        ...form,
        language: getLang(form.template),
      }
      if (isEdit && id) {
        await updateComponent(id, payload)
      } else {
        await createComponent(payload)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(parseError(err, 'Failed to save component'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[linear-gradient(135deg,#0a0a0f_0%,#0d1117_50%,#0a0f1a_100%)] min-h-screen relative overflow-clip">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-10">
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-white">
            {isEdit ? 'Edit Component' : 'New Component'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)] rounded-2xl p-6 flex flex-col gap-4">

          {/* Title */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Title *</label>
            <input
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. GlassButton"
              required
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-purple-500/50 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Description</label>
            <input
              value={form.description ?? ''}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Short description (optional)"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-purple-500/50 focus:outline-none"
            />
          </div>

          {/* Privacy */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Privacy</label>
            <select
              value={form.privacy}
              onChange={(e) => set('privacy', e.target.value as ComponentPrivacy)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:border-purple-500/50 focus:outline-none"
            >
              {PRIVACY_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Folder */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Folder</label>
            <select
              value={form.folderId ?? ''}
              onChange={(e) => set('folderId', e.target.value || null)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:border-purple-500/50 focus:outline-none"
            >
              <option value="">No folder</option>
              {folderOptions.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.label}
                </option>
              ))}
            </select>
          </div>

          {/* Code Editor (Sandpack split-view) */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Code *</label>
            <ComponentEditor
              code={form.code}
              cssCode={form.cssCode}
              template={form.template}
              language={form.language}
              onChange={(code) => set('code', code)}
              onCssChange={(css) => set('cssCode', css)}
              onTemplateChange={(t: ComponentTemplate) => {
                set('template', t)
                set('code', t === 'react' ? DEFAULT_REACT_CODE : DEFAULT_HTML_CODE)
                set('cssCode', '')
              }}
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 active:translate-y-0 hover:-translate-y-px transition-all shadow-[0_0_24px_rgba(139,92,246,0.45),0_4px_16px_rgba(59,130,246,0.3)] rounded-xl px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Component'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
