import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IFollow extends Document {
  followerId: Types.ObjectId
  followingId: Types.ObjectId
}

const followSchema = new Schema<IFollow>(
  {
    followerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    followingId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

// Compound unique index - prevent duplicate follows
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true })

// Index for efficient "followers" queries (who follows me)
followSchema.index({ followingId: 1 })

// Index for efficient "following" queries (who I follow)
followSchema.index({ followerId: 1 })

export const Follow = mongoose.model<IFollow>('Follow', followSchema)
