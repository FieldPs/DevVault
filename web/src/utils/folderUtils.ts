import type { Folder } from '@/types/folder'

export interface FolderOption {
  id: string
  label: string
}

export const buildFolderOptions = (folders: Folder[]): FolderOption[] => {
  const result: FolderOption[] = []

  const walk = (nodes: Folder[], parentPath: string | null) => {
    for (const node of nodes) {
      const path = parentPath ? `${parentPath} / ${node.name}` : node.name
      result.push({ id: node._id, label: path })
      walk(node.children, path)
    }
  }

  walk(folders, null)
  return result
}
