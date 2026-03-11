import { useState } from 'react'
import { FolderTree, Plus, Pencil, Trash2 } from 'lucide-react'
import { useFolderStore } from '@/store/folderStore'
import type { Folder } from '@/types/folder'

interface FolderNodeProps {
  folder: Folder
  expandedIds: Set<string>
  onToggleExpand: (folderId: string) => void
  depth?: number
}

function FolderNode({ folder, expandedIds, onToggleExpand, depth = 0 }: FolderNodeProps) {
  const { selectedFolderId, selectFolder, createFolder, renameFolder, deleteFolder } = useFolderStore()
  const hasChildren = folder.children.length > 0
  const isExpanded = expandedIds.has(folder._id)

  const handleCreate = async () => {
    const name = prompt('New folder name')
    if (!name) return
    await createFolder(name, folder._id)
  }

  const handleRename = async () => {
    const name = prompt('Rename folder', folder.name)
    if (!name) return
    await renameFolder(folder._id, name)
  }

  const handleDelete = async () => {
    if (!confirm(`Delete folder "${folder.name}" and all subfolders?`)) return
    await deleteFolder(folder._id)
  }

  return (
    <div className="space-y-1">
      <div
        className={`group flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-all ${
          selectedFolderId === folder._id
            ? 'bg-purple-500/25 text-purple-200 ring-1 ring-purple-400/30'
            : 'text-gray-300 hover:bg-white/10 hover:text-white'
        }`}
        style={{ marginLeft: `${depth * 12}px` }}
        onClick={() => selectFolder(folder._id)}
      >
        <div className="flex min-w-0 items-center gap-1">
          {hasChildren && (
            <button
              onClick={(event) => {
                event.stopPropagation()
                onToggleExpand(folder._id)
              }}
              className="rounded px-1 text-xs text-gray-500 transition-colors group-hover:text-gray-300 hover:bg-white/15 hover:text-white"
              aria-label={isExpanded ? 'Collapse child folders' : 'Expand child folders'}
            >
              {isExpanded ? '-' : '+'}
            </button>
          )}
          <span className="truncate text-left">{folder.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(event) => {
              event.stopPropagation()
              void handleCreate()
            }}
            className="rounded p-1 text-gray-500 hover:bg-white/10 hover:text-white"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation()
              void handleRename()
            }}
            className="rounded p-1 text-gray-500 hover:bg-white/10 hover:text-white"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation()
              void handleDelete()
            }}
            className="rounded p-1 text-gray-500 hover:bg-white/10 hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {isExpanded &&
        folder.children.map((child) => (
          <FolderNode
            key={child._id}
            folder={child}
            expandedIds={expandedIds}
            onToggleExpand={onToggleExpand}
            depth={depth + 1}
          />
        ))}
    </div>
  )
}

export default function FolderSidebar() {
  const { folders, selectedFolderId, selectFolder, createFolder, loading } = useFolderStore()
  const [expandedFolderIds, setExpandedFolderIds] = useState<Set<string>>(new Set())

  const toggleExpand = (folderId: string) => {
    setExpandedFolderIds((prev) => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
  }

  const handleCreateRoot = async () => {
    const name = prompt('Root folder name')
    if (!name) return
    await createFolder(name, null)
  }

  return (
    <aside className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <FolderTree className="h-4 w-4 text-purple-400" />
          Folders
        </div>
        <button
          onClick={handleCreateRoot}
          className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-2 py-1 text-xs text-purple-300 hover:bg-purple-500/20"
        >
          + Root
        </button>
      </div>

      <button
        onClick={() => selectFolder(null)}
        className={`mb-2 w-full rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
          selectedFolderId === null ? 'bg-blue-500/20 text-blue-300' : 'text-gray-300 hover:bg-white/5'
        }`}
      >
        All Components
      </button>

      {loading && <p className="text-xs text-gray-500">Loading folders…</p>}
      {!loading && folders.length === 0 && <p className="text-xs text-gray-500">No folders yet.</p>}

      <div className="space-y-1">
        {folders.map((folder) => (
          <FolderNode
            key={folder._id}
            folder={folder}
            expandedIds={expandedFolderIds}
            onToggleExpand={toggleExpand}
          />
        ))}
      </div>
    </aside>
  )
}
