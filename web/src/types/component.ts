export type ComponentTemplate = 'react' | 'vanilla' | 'html'
export type ComponentPrivacy = 'private' | 'friends' | 'public'

export interface Component {
  _id: string
  title: string
  description?: string
  code: string
  language: string
  template: ComponentTemplate
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
  language: string
  template: ComponentTemplate
  privacy: ComponentPrivacy
}
