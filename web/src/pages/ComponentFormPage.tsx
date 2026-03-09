import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useComponentStore } from '@/store/componentStore'
import { parseError } from '@/utils/errorUtils'
import type { ComponentInput, ComponentTemplate, ComponentPrivacy } from '@/types/component'
import ComponentEditor from '@/components/editor/ComponentEditor'

const PRIVACY_OPTIONS: ComponentPrivacy[] = ['private', 'friends', 'public']

const getLang = (t: ComponentTemplate) => (t === 'react' ? 'tsx' : 'html')

const DEFAULT_FORM: ComponentInput = {
  title: '',
  description: '',
  code: '',
  cssCode: '',
  language: 'tsx',
  template: 'react',
  privacy: 'private',
}

export default function ComponentFormPage() {
  const { id } = useParams<{ id?: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { createComponent, updateComponent, getComponent } = useComponentStore()

  const [form, setForm] = useState<ComponentInput>(DEFAULT_FORM)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
    <div className="page-bg min-h-screen">
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

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 flex flex-col gap-4">

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

          {/* Code Editor (Sandpack split-view) */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Code *</label>
            <ComponentEditor
              code={form.code}
              cssCode={form.cssCode}
              template={form.template}
              onChange={(code) => set('code', code)}
              onCssChange={(css) => set('cssCode', css)}
              onTemplateChange={(t: ComponentTemplate) => {
                set('template', t)
                set('code', '')
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
              className="gradient-btn rounded-xl px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Component'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
