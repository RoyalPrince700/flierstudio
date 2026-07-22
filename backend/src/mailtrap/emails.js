import {
  getClientUrl,
  getMailtrapTransport,
} from './mailtrap.config.js'
import { welcomeEmailTemplate } from './emailTemplates.js'

/**
 * Send a branded welcome email to a newly created user.
 * Throws on failure — callers should catch so auth is never blocked.
 *
 * @param {{ name?: string, email: string }} user
 */
export async function sendWelcomeEmail(user) {
  const email = String(user?.email || '')
    .trim()
    .toLowerCase()
  if (!email) {
    throw new Error('Cannot send welcome email: user has no email')
  }

  const studioUrl = getClientUrl()
  const { subject, html, text } = welcomeEmailTemplate({
    name: user.name,
    email,
    studioUrl,
  })

  const { transport, config } = getMailtrapTransport()

  const result = await transport.sendMail({
    from: `"${config.from.name}" <${config.from.email}>`,
    to: email,
    subject,
    html,
    text,
  })

  return { result, mode: config.mode }
}

/**
 * Fire-and-forget welcome email. Logs errors; never throws to the caller.
 */
export function sendWelcomeEmailSafe(user) {
  return sendWelcomeEmail(user).catch((err) => {
    console.error('Welcome email failed', {
      email: user?.email,
      message: err?.message || String(err),
    })
    return null
  })
}
