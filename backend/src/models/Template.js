import mongoose from 'mongoose'

/**
 * Publish state for a template collection (group), not individual fliers.
 * One document per collectionId — uniqueness is enforced in Mongo after sync dedupe.
 */
const templateSchema = new mongoose.Schema(
  {
    collectionId: { type: String, required: true, unique: true },
    source: { type: String, enum: ['project', 'analyzed'], required: true },
    templateCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    publishedAt: { type: Date },
    publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

export const Template = mongoose.model('Template', templateSchema)
