import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IFolder extends Document {
  name: string
  parentId?: Types.ObjectId | null
  ownerId: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const folderSchema = new Schema<IFolder>(
  {
    name: { type: String, required: true, trim: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Folder', default: null },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

export const Folder = mongoose.model<IFolder>('Folder', folderSchema)
