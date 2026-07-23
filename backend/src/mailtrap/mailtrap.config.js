import nodemailer from 'nodemailer'

/**
 * Mailtrap SMTP transport — sandbox (dev/test) vs production sending.
 *
 * Env switch:
 * - MAILTRAP_USE_SANDBOX=true|false overrides NODE_ENV
 * - Otherwise: sandbox when NODE_ENV !== 'production'
 *
 * Paste SMTP values from Mailtrap → Integration → SMTP
 * (sandbox inbox or verified sending domain).
 */

function env(name, fallback = '') {
  const value = process.env[name]
  if (value == null) return fallback
  const trimmed = String(value).trim()
  return trimmed === '' ? fallback : trimmed
}

export function useMailtrapSandbox() {
  const override = env('MAILTRAP_USE_SANDBOX').toLowerCase()
  if (override === 'true') return true
  if (override === 'false') return false
  return env('NODE_ENV', 'development') !== 'production'
}

export function getMailtrapConfig() {
  const sandbox = useMailtrapSandbox()

  if (sandbox) {
    return {
      mode: 'sandbox',
      host: env('MAILTRAP_HOST', 'sandbox.smtp.mailtrap.io'),
      port: Number(env('MAILTRAP_PORT', '2525')),
      username: env('MAILTRAP_USERNAME'),
      password: env('MAILTRAP_PASSWORD'),
      from: {
        name: env('MAILTRAP_FROM_NAME', 'Flier Studio'),
        email: env('MAILTRAP_FROM_EMAIL', 'hello@demomailtrap.com'),
      },
    }
  }

  return {
    mode: 'production',
    host: env('MAILTRAP_PRODUCTION_HOST', 'live.smtp.mailtrap.io'),
    port: Number(env('MAILTRAP_PRODUCTION_PORT', '587')),
    username: env('MAILTRAP_PRODUCTION_USERNAME', 'api'),
    password: env('MAILTRAP_PRODUCTION_PASSWORD'),
    from: {
      name: env(
        'MAILTRAP_PRODUCTION_FROM_NAME',
        env('MAILTRAP_FROM_NAME', 'Flier Studio'),
      ),
      email: env(
        'MAILTRAP_PRODUCTION_FROM_EMAIL',
        env('MAILTRAP_FROM_EMAIL', 'hello@flierstudio.com'),
      ),
    },
  }
}

let cachedTransport = null
let cachedKey = ''

export function getMailtrapTransport() {
  const config = getMailtrapConfig()

  if (!config.username || !config.password) {
    throw new Error(
      config.mode === 'sandbox'
        ? 'MAILTRAP_USERNAME and MAILTRAP_PASSWORD are required (Email Testing → Integration → SMTP)'
        : 'MAILTRAP_PRODUCTION_USERNAME and MAILTRAP_PRODUCTION_PASSWORD are required (Sending Domains → Integration → SMTP)',
    )
  }

  if (!config.host || !Number.isFinite(config.port)) {
    throw new Error('Mailtrap SMTP host/port are missing or invalid')
  }

  const key = `${config.mode}:${config.host}:${config.port}:${config.username}:${config.password}`
  if (cachedTransport && cachedKey === key) {
    return { transport: cachedTransport, config }
  }

  cachedTransport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    // 465 = implicit TLS; 2525/587 = STARTTLS
    secure: config.port === 465,
    auth: {
      user: config.username,
      pass: config.password,
    },
  })
  cachedKey = key

  return { transport: cachedTransport, config }
}

export function getClientUrl() {
  return String(env('CLIENT_URL', 'http://localhost:5173'))
    .split(',')[0]
    .trim()
    .replace(/\/$/, '')
}
