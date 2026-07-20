import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    projectId: { type: String, default: '', index: true },
    designId: { type: String, default: '', index: true },
    action: {
      type: String,
      required: true,
      enum: ['view', 'select', 'edit', 'upload_photo', 'download', 'favorite', 'login'],
      index: true,
    },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

eventSchema.index({ createdAt: -1 })

export const Event = mongoose.model('Event', eventSchema)
