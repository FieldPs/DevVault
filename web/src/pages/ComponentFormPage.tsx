import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useComponentStore } from '@/store/componentStore'
import { parseError } from '@/utils/errorUtils'
import type { ComponentInput, ComponentTemplate, ComponentPrivacy } from '@/types/component'

const LANGUAGES = ['tsx', 'jsx', 'ts', 'js', 'html', 'css']
const TEMPLATES: ComponentTemplate[] = ['react', 'vanilla', 'html']
const PRIVACY_OPTIONS: ComponentPrivacy[] = ['private', 'friends', 'public']

const DEFAULT_FORM: ComponentInput = {
  title: '',
  description: '',
  code: '',
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
      if (isEdit && id) {
        await updateComponent(id, form)
      } else {
        await createComponent(form)
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
      <div className="mx-auto max-w-2xl px-6 py-10">
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

          {/* Row: Language, Template, Privacy */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Language *', key: 'language' as const, options: LANGUAGES },
              { label: 'Template *', key: 'template' as const, options: TEMPLATES },
              { label: 'Privacy',    key: 'privacy'  as const, options: PRIVACY_OPTIONS },
            ].map(({ label, key, options }) => (
              <div key={key}>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">{label}</label>
                <select
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value as ComponentInput[typeof key])}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:border-purple-500/50 focus:outline-none"
                >
                  {options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          {/* Code */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Code *</label>
            <textarea
              value={form.code}
              onChange={(e) => set('code', e.target.value)}
              placeholder="Paste your component code here…"
              required
              rows={14}
              className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 font-mono text-sm text-green-300 placeholder-gray-600 focus:border-purple-500/50 focus:outline-none resize-y"
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
