import mongoose, { Document, Schema, Types } from 'mongoose'

export type ComponentTemplate = 'react' | 'vanilla' | 'html'
export type ComponentPrivacy = 'private' | 'friends' | 'public'

export interface IComponent extends Document {
  title: string
  description?: string
  code: string
  cssCode?: string
  language: string
  template: ComponentTemplate
  dependencies: string[]
  folderId?: Types.ObjectId
  ownerId: Types.ObjectId
  privacy: ComponentPrivacy
}

const componentSchema = new Schema<IComponent>(
  {
    title:        { type: String, required: true, trim: true },
    description:  { type: String, trim: true, default: '' },
    code:         { type: String, required: true },
    cssCode:      { type: String, default: '' },
    language:     { type: String, required: true },
    template:     { type: String, enum: ['react', 'vanilla', 'html'], required: true },
    dependencies: { type: [String], default: [] },
    folderId:     { type: Schema.Types.ObjectId, ref: 'Folder' },
    ownerId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    privacy:      { type: String, enum: ['private', 'friends', 'public'], default: 'private' },
  },
  { timestamps: true }
)

export const Component = mongoose.model<IComponent>('Component', componentSchema)
