import mongoose from 'mongoose'

/**
 * Admin-managed design category catalog (runtime DB data).
 * Distinct from frontend sample style tags in samples/{id}/meta.js.
 */
const categorySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    label: { type: String, required: true, trim: true },
    sortOrder: { type: Number, default: 100, index: true },
    /** Built-in popular seeds — not removable by default catalog UI later. */
    isSeed: { type: Boolean, default: false },
  },
  { timestamps: true },
)

categorySchema.methods.toJSONSafe = function toJSONSafe() {
  return {
    id: this._id.toString(),
    slug: this.slug,
    label: this.label,
    sortOrder: this.sortOrder,
    isSeed: Boolean(this.isSeed),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

export const Category = mongoose.model('Category', categorySchema)
