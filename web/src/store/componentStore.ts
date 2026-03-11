import { create } from 'zustand'
import api from '@/lib/api'
import type { Component, ComponentInput, PublicComponent } from '@/types/component'
import { parseError } from '@/utils/errorUtils'

interface ComponentState {
  components: Component[]
  loading: boolean
  error: string | null

  fetchComponents: () => Promise<void>
  createComponent: (input: ComponentInput) => Promise<Component>
  updateComponent: (id: string, input: ComponentInput) => Promise<void>
  deleteComponent: (id: string) => Promise<void>
  getComponent: (id: string) => Promise<Component>
  getPublicComponent: (id: string) => Promise<PublicComponent>
  fetchExploreComponents: () => Promise<PublicComponent[]>
  moveComponent: (id: string, folderId: string | null) => Promise<void>
}

export const useComponentStore = create<ComponentState>((set, get) => ({
  components: [],
  loading: false,
  error: null,

  fetchComponents: async () => {
    set({ loading: true, error: null })
    try {
      const res = await api.get('/components')
      set({ components: res.data.components, loading: false })
    } catch (err) {
      set({ error: parseError(err, 'Failed to load components'), loading: false })
    }
  },

  createComponent: async (input) => {
    const res = await api.post('/components', input)
    const created: Component = res.data.component
    set({ components: [created, ...get().components] })
    return created
  },

  updateComponent: async (id, input) => {
    const res = await api.put(`/components/${id}`, input)
    const updated: Component = res.data.component
    set({ components: get().components.map((c) => (c._id === id ? updated : c)) })
  },

  deleteComponent: async (id) => {
    await api.delete(`/components/${id}`)
    set({ components: get().components.filter((c) => c._id !== id) })
  },

  getComponent: async (id) => {
    const res = await api.get(`/components/${id}`)
    return res.data.component as Component
  },

  getPublicComponent: async (id) => {
    const res = await api.get(`/components/public/${id}`)
    return res.data.component as PublicComponent
  },

  fetchExploreComponents: async () => {
    const res = await api.get('/components/explore')
    return (res.data.components ?? []) as PublicComponent[]
  },

  moveComponent: async (id, folderId) => {
    const component = get().components.find((item) => item._id === id)
    if (!component) {
      throw new Error('Component not found')
    }

    const payload: ComponentInput = {
      title: component.title,
      description: component.description ?? '',
      code: component.code,
      cssCode: component.cssCode ?? '',
      language: component.language,
      template: component.template,
      privacy: component.privacy,
      dependencies: component.dependencies ?? [],
      folderId,
    }

    const res = await api.put(`/components/${id}`, payload)
    const updated: Component = res.data.component
    set({ components: get().components.map((item) => (item._id === id ? updated : item)) })
  },
}))
