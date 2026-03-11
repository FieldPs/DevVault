import { useNavigate } from 'react-router-dom'
import { Eye, Pencil, Trash2, Code2 } from 'lucide-react'
import { useComponentStore } from '@/store/componentStore'
import { useFolderStore } from '@/store/folderStore'
import type { Component } from '@/types/component'

const PRIVACY_BADGE: Record<string, string> = {
  private: '🔒 Private',
  friends: '👥 Friends',
  public:  '🌐 Public',
}

interface Props {
  component: Component
}

function ComponentRow({ component }: Props) {
  const { deleteComponent, moveComponent } = useComponentStore()
  const { flatFolders } = useFolderStore()
  const navigate = useNavigate()

  const handleDelete = async () => {
    if (!confirm(`Delete "${component.title}"?`)) return
    await deleteComponent(component._id)
  }

  return (
    <div
      className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-white/5"
      style={{ border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
          <Code2 className="h-4 w-4 text-purple-400" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-white text-sm">{component.title}</p>
          <p className="text-xs text-gray-500">
            {component.language} · {PRIVACY_BADGE[component.privacy]}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-4">
        <select
          value={component.folderId ?? ''}
          onChange={(e) => moveComponent(component._id, e.target.value || null)}
          className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-gray-300 focus:outline-none"
        >
          <option value="">No folder</option>
          {flatFolders.map((folder) => (
            <option key={folder._id} value={folder._id}>
              {folder.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => navigate(`/components/${component._id}`)}
          className="flex items-center gap-1 rounded-lg border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-400 hover:bg-purple-500/20 transition-colors"
        >
          <Eye className="h-3 w-3" />
          View
        </button>
        <button
          onClick={() => navigate(`/components/${component._id}/edit`)}
          className="flex items-center gap-1 rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-colors"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
        >
          <Trash2 className="h-3 w-3" />
          Delete
        </button>
      </div>
    </div>
  )
}

export default function ComponentList({ components }: { components: Component[] }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)] rounded-2xl p-4 flex flex-col gap-2">
      {components.map((c) => (
        <ComponentRow key={c._id} component={c} />
      ))}
    </div>
  )
}
