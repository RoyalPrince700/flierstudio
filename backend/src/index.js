import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import mongoose from 'mongoose'
import morgan from 'morgan'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import eventRoutes from './routes/events.js'
import templateRoutes from './routes/templates.js'

const PORT = Number(process.env.PORT) || 8080

/** Comma-separated allowed browser origins for CORS (credentials). Prefer one canonical. */
const CLIENT_ORIGINS = String(process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim().replace(/\/$/, ''))
  .filter(Boolean)

function requireEnv(name) {
  if (!process.env[name]) {
    console.error(`Missing required env: ${name}`)
    process.exit(1)
  }
}

requireEnv('MONGODB_URI')
requireEnv('JWT_SECRET')
requireEnv('GOOGLE_CLIENT_ID')

const app = express()

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(
  cors({
    origin(origin, callback) {
      // Non-browser / same-origin tooling may omit Origin
      if (!origin || CLIENT_ORIGINS.includes(origin)) {
        callback(null, true)
        return
      }
      callback(null, false)
    },
    credentials: true,
  }),
)
app.use(morgan('dev'))
app.use(express.json({ limit: '2mb' }))
app.use(cookieParser())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'flier-studio-api' })
})

app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/templates', templateRoutes)
app.use('/api/admin', adminRoutes)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Server error' })
})

async function start() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('MongoDB connected')

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`)
    console.log(`CORS origins: ${CLIENT_ORIGINS.join(', ')}`)
  })
}

start().catch((err) => {
  console.error('Failed to start API', err)
  process.exit(1)
})
