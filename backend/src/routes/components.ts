import { Router, Response } from 'express'
import { Types } from 'mongoose'
import { Component } from '../models/Component'
import { Folder } from '../models/Folder'
import { verifyToken, AuthRequest } from '../middleware/auth'

const router = Router()

// POST /components — create
router.post('/', verifyToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, code, cssCode, language, template, description, privacy, dependencies, folderId } = req.body
  if (!title || !code || !language || !template) {
    res.status(400).json({ message: 'title, code, language, and template are required' })
    return
  }
  if (folderId && (!Types.ObjectId.isValid(folderId))) {
    res.status(400).json({ message: 'Invalid folder id' })
    return
  }
  try {
    if (folderId) {
      const folder = await Folder.findOne({ _id: folderId, ownerId: req.userId })
      if (!folder) {
        res.status(404).json({ message: 'Folder not found' })
        return
      }
    }

    const component = await Component.create({
      title,
      code,
      cssCode: cssCode ?? '',
      language,
      template,
      description: description ?? '',
      privacy: privacy ?? 'private',
      dependencies: Array.isArray(dependencies) ? dependencies : [],
      folderId: folderId ?? null,
      ownerId: req.userId,
    })
    res.status(201).json({ component })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
})

// GET /components — list own components
router.get('/', verifyToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const components = await Component.find({ ownerId: req.userId }).sort({ createdAt: -1 })
    res.json({ components })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
})

// GET /components/explore — list public components from other users
router.get('/explore', verifyToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const includeMine = req.query.includeMine === 'true'
    const query: Record<string, unknown> = { privacy: 'public' }

    if (!includeMine && req.userId && Types.ObjectId.isValid(req.userId)) {
      query.ownerId = { $ne: new Types.ObjectId(req.userId) }
    }

    const components = await Component.find(query)
      .populate('ownerId', 'username')
      .sort({ createdAt: -1 })

    res.json({ components })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
})

// GET /components/public/:id — public component detail (no auth)
router.get('/public/:id', async (req, res: Response): Promise<void> => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Invalid component id' })
    return
  }

  try {
    const component = await Component.findOne({
      _id: req.params.id,
      privacy: 'public',
    }).populate('ownerId', 'username')

    if (!component) {
      res.status(404).json({ message: 'Public component not found' })
      return
    }

    res.json({ component })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
})

// GET /components/:id — single component
router.get('/:id', verifyToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const component = await Component.findById(req.params.id)
    if (!component) {
      res.status(404).json({ message: 'Component not found' })
      return
    }
    if (component.ownerId.toString() !== req.userId) {
      res.status(403).json({ message: 'Forbidden' })
      return
    }
    res.json({ component })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
})

// PUT /components/:id — update
router.put('/:id', verifyToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, code, cssCode, language, template, description, privacy, dependencies, folderId } = req.body
  if (!title || !code || !language || !template) {
    res.status(400).json({ message: 'title, code, language, and template are required' })
    return
  }
  if (folderId && (!Types.ObjectId.isValid(folderId))) {
    res.status(400).json({ message: 'Invalid folder id' })
    return
  }
  try {
    const component = await Component.findById(req.params.id)
    if (!component) {
      res.status(404).json({ message: 'Component not found' })
      return
    }
    if (component.ownerId.toString() !== req.userId) {
      res.status(403).json({ message: 'Forbidden' })
      return
    }
    if (folderId) {
      const folder = await Folder.findOne({ _id: folderId, ownerId: req.userId })
      if (!folder) {
        res.status(404).json({ message: 'Folder not found' })
        return
      }
    }
    const updated = await Component.findByIdAndUpdate(
      req.params.id,
      {
        title,
        code,
        cssCode: cssCode ?? '',
        language,
        template,
        description,
        privacy,
        dependencies: Array.isArray(dependencies) ? dependencies : [],
        folderId: folderId ?? null,
      },
      { new: true }
    )
    res.json({ component: updated })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
})

// DELETE /components/:id
router.delete('/:id', verifyToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const component = await Component.findById(req.params.id)
    if (!component) {
      res.status(404).json({ message: 'Component not found' })
      return
    }
    if (component.ownerId.toString() !== req.userId) {
      res.status(403).json({ message: 'Forbidden' })
      return
    }
    await component.deleteOne()
    res.json({ message: 'Component deleted' })
  } catch {
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router
