import mongoose from 'mongoose'

/**
 * Publish state for a template collection (group).
 * One document per collectionId — uniqueness is enforced in Mongo after sync dedupe.
 *
 * Per-design visibility uses a deny list keyed by catalog template/board id:
 * - Missing from unpublishedDesignIds → published (safe default for new designs on sync)
 * - Present in unpublishedDesignIds → individually unpublished
 * Non-admins see a design only when group status is published AND the design is not denied.
 * Catalog sync never resets status or unpublishedDesignIds.
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
    /** Catalog template ids that are hidden while the group may still be published. */
    unpublishedDesignIds: { type: [String], default: [] },
    publishedAt: { type: Date },
    publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

export const Template = mongoose.model('Template', templateSchema)
