export type ComponentTemplate = 'react' | 'vanilla' | 'html'
export type ComponentPrivacy = 'private' | 'friends' | 'public'

export interface Component {
  _id: string
  title: string
  description?: string
  code: string
  cssCode?: string
  language: string
  template: ComponentTemplate
  dependencies?: string[]
  folderId?: string
  ownerId: string
  privacy: ComponentPrivacy
  createdAt: string
  updatedAt: string
}

export interface ComponentInput {
  title: string
  description?: string
  code: string
  cssCode?: string
  language: string
  template: ComponentTemplate
  privacy: ComponentPrivacy
  dependencies?: string[]
  folderId?: string | null
}

export interface PublicOwner {
  _id: string
  username: string
}

export interface PublicComponent extends Omit<Component, 'ownerId'> {
  ownerId: string | PublicOwner
}
