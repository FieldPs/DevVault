import { create } from 'zustand'
import api from '@/lib/api'
import { parseError } from '@/utils/errorUtils'
import type { Folder } from '@/types/folder'

const flattenFolders = (folders: Folder[]): Folder[] => {
  const result: Folder[] = []

  const walk = (nodes: Folder[]) => {
    for (const node of nodes) {
      result.push(node)
      walk(node.children)
    }
  }

  walk(folders)
  return result
}

const findFolderPath = (folders: Folder[], targetId: string): Folder[] => {
  for (const folder of folders) {
    if (folder._id === targetId) {
      return [folder]
    }

    const nested = findFolderPath(folder.children, targetId)
    if (nested.length > 0) {
      return [folder, ...nested]
    }
  }

  return []
}

interface FolderState {
  folders: Folder[]
  flatFolders: Folder[]
  selectedFolderId: string | null
  loading: boolean
  error: string | null

  fetchFolders: () => Promise<void>
  createFolder: (name: string, parentId?: string | null) => Promise<void>
  renameFolder: (id: string, name: string) => Promise<void>
  deleteFolder: (id: string) => Promise<void>
  selectFolder: (folderId: string | null) => void
  getBreadcrumbs: () => Folder[]
  getSelectedFolderIds: () => string[]
}

export const useFolderStore = create<FolderState>((set, get) => ({
  folders: [],
  flatFolders: [],
  selectedFolderId: null,
  loading: false,
  error: null,

  fetchFolders: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.get('/folders')
      const folders = res.data.folders as Folder[]
      set({ folders, flatFolders: flattenFolders(folders), loading: false })
    } catch (err) {
      set({ error: parseError(err, 'Failed to load folders'), loading: false })
    }
  },

  createFolder: async (name, parentId) => {
    try {
      await api.post('/folders', { name, parentId: parentId ?? null })
      await get().fetchFolders()
    } catch (err) {
      set({ error: parseError(err, 'Failed to create folder') })
      throw err
    }
  },

  renameFolder: async (id, name) => {
    try {
      await api.put(`/folders/${id}`, { name })
      await get().fetchFolders()
    } catch (err) {
      set({ error: parseError(err, 'Failed to rename folder') })
      throw err
    }
  },

  deleteFolder: async (id) => {
    try {
      await api.delete(`/folders/${id}`)
      await get().fetchFolders()

      const selectedFolderId = get().selectedFolderId
      if (!selectedFolderId) {
        return
      }

      const exists = get().flatFolders.some((folder) => folder._id === selectedFolderId)
      if (!exists) {
        set({ selectedFolderId: null })
      }
    } catch (err) {
      set({ error: parseError(err, 'Failed to delete folder') })
      throw err
    }
  },

  selectFolder: (selectedFolderId) => set({ selectedFolderId }),

  getBreadcrumbs: () => {
    const selectedFolderId = get().selectedFolderId
    if (!selectedFolderId) {
      return []
    }
    return findFolderPath(get().folders, selectedFolderId)
  },

  getSelectedFolderIds: () => {
    const selectedFolderId = get().selectedFolderId
    if (!selectedFolderId) {
      return []
    }

    const selected = get().flatFolders.find((folder) => folder._id === selectedFolderId)
    if (!selected) {
      return []
    }

    const ids: string[] = []
    const walk = (folder: Folder) => {
      ids.push(folder._id)
      for (const child of folder.children) {
        walk(child)
      }
    }

    walk(selected)
    return ids
  },
}))
