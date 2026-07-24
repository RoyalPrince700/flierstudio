/**
 * Upsert popular design categories. Safe to run repeatedly.
 * Usage: node scripts/seed-categories.js
 */
import 'dotenv/config'
import mongoose from 'mongoose'
import { seedCategories } from '../src/lib/categories.js'

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI')
    process.exit(1)
  }

  await mongoose.connect(process.env.MONGODB_URI)
  const categories = await seedCategories()
  console.log(
    'Seeded categories:',
    categories.map((c) => `${c.slug} (${c.label})`).join(', '),
  )
  await mongoose.disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
