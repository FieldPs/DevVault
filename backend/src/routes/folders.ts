import { Router, Response } from 'express'
import { Types } from 'mongoose'
import { verifyToken, AuthRequest } from '../middleware/auth'
import { Folder, IFolder } from '../models/Folder'
import { Component } from '../models/Component'

interface FolderTreeNode {
  _id: string
  name: string
  parentId: string | null
  createdAt: Date
  updatedAt: Date
  children: FolderTreeNode[]
}

const router = Router()

const toTreeNode = (folder: IFolder): FolderTreeNode => ({
  _id: folder._id.toString(),
  name: folder.name,
  parentId: folder.parentId ? folder.parentId.toString() : null,
  createdAt: folder.createdAt,
  updatedAt: folder.updatedAt,
  children: [],
})

const buildFolderTree = (folders: IFolder[]): FolderTreeNode[] => {
  const nodeMap = new Map<string, FolderTreeNode>()
  const roots: FolderTreeNode[] = []

  for (const folder of folders) {
    nodeMap.set(folder._id.toString(), toTreeNode(folder))
  }

  for (const folder of folders) {
    const node = nodeMap.get(folder._id.toString())
    if (!node) {
      continue
    }

    const parentId = folder.parentId ? folder.parentId.toString() : null
    if (!parentId) {
      roots.push(node)
      continue
    }

    const parentNode = nodeMap.get(parentId)
    if (!parentNode) {
      roots.push(node)
      continue
    }

    parentNode.children.push(node)
  }

  return roots
}

const collectDescendants = (rootId: string, folders: IFolder[]): string[] => {
  const byParent = new Map<string, string[]>()

  for (const folder of folders) {
    const parentId = folder.parentId ? folder.parentId.toString() : null
    if (!parentId) {
      continue
    }
    const current = byParent.get(parentId) ?? []
    current.push(folder._id.toString())
    byParent.set(parentId, current)
  }

  const queue = [rootId]
  const descendants: string[] = []

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current) {
      continue
    }
    descendants.push(current)
    const children = byParent.get(current) ?? []
    queue.push(...children)
  }

  return descendants
}

router.post('/', verifyToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : ''
  const parentId = typeof req.body.parentId === 'string' ? req.body.parentId : null

  if (!name) {
    res.status(400).json({ message: 'Folder name is required' })
    return
  }

  if (parentId && !Types.ObjectId.isValid(parentId)) {
    res.status(400).json({ message: 'Invalid parent folder id' })
    return
  }

  try {
    if (parentId) {
      const parent = await Folder.findOne({ _id: parentId, ownerId: req.userId })
      if (!parent) {
        res.status(404).json({ message: 'Parent folder not found' })
        return
      }
    }

    const folder = await Folder.create({
      name,
      parentId: parentId ?? null,
      ownerId: req.userId,
    })

    res.status(201).json({ folder })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.get('/', verifyToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const folders = await Folder.find({ ownerId: req.userId }).sort({ name: 1, createdAt: 1 })
    const tree = buildFolderTree(folders)
    res.json({ folders: tree })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.put('/:id', verifyToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : undefined
  const parentId = typeof req.body.parentId === 'string' ? req.body.parentId : req.body.parentId === null ? null : undefined

  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid folder id' })
    return
  }

  if (name !== undefined && !name) {
    res.status(400).json({ message: 'Folder name cannot be empty' })
    return
  }

  if (parentId !== undefined && parentId !== null && !Types.ObjectId.isValid(parentId)) {
    res.status(400).json({ message: 'Invalid parent folder id' })
    return
  }

  if (parentId === id) {
    res.status(400).json({ message: 'Folder cannot be its own parent' })
    return
  }

  try {
    const folder = await Folder.findOne({ _id: id, ownerId: req.userId })
    if (!folder) {
      res.status(404).json({ message: 'Folder not found' })
      return
    }

    if (parentId !== undefined && parentId !== null) {
      const targetParent = await Folder.findOne({ _id: parentId, ownerId: req.userId })
      if (!targetParent) {
        res.status(404).json({ message: 'Parent folder not found' })
        return
      }

      const folders = await Folder.find({ ownerId: req.userId })
      const descendants = collectDescendants(id, folders)
      if (descendants.includes(parentId)) {
        res.status(400).json({ message: 'Folder cannot be moved into its own descendant' })
        return
      }
    }

    if (name !== undefined) {
      folder.name = name
    }
    if (parentId !== undefined) {
      folder.parentId = parentId ? new Types.ObjectId(parentId) : null
    }

    await folder.save()
    res.json({ folder })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.delete('/:id', verifyToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params

  if (!Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid folder id' })
    return
  }

  try {
    const folder = await Folder.findOne({ _id: id, ownerId: req.userId })
    if (!folder) {
      res.status(404).json({ message: 'Folder not found' })
      return
    }

    const folders = await Folder.find({ ownerId: req.userId })
    const folderIds = collectDescendants(id, folders)

    await Folder.deleteMany({ _id: { $in: folderIds }, ownerId: req.userId })
    await Component.updateMany(
      { ownerId: req.userId, folderId: { $in: folderIds } },
      { $unset: { folderId: '' } }
    )

    res.json({ message: 'Folder deleted' })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router
