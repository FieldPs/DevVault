import { Router, Response } from 'express'
import { Component } from '../models/Component'
import { verifyToken, AuthRequest } from '../middleware/auth'

const router = Router()

// POST /components — create
router.post('/', verifyToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, code, language, template, description, privacy } = req.body
  if (!title || !code || !language || !template) {
    res.status(400).json({ message: 'title, code, language, and template are required' })
    return
  }
  try {
    const component = await Component.create({
      title,
      code,
      language,
      template,
      description: description ?? '',
      privacy: privacy ?? 'private',
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
  const { title, code, language, template, description, privacy } = req.body
  if (!title || !code || !language || !template) {
    res.status(400).json({ message: 'title, code, language, and template are required' })
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
    const updated = await Component.findByIdAndUpdate(
      req.params.id,
      { title, code, language, template, description, privacy },
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
