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

/**
 * Inbox for public contact form submissions.
 * Hardcoded for now — move to CONTACT_INBOX env when ready.
 */
const CONTACT_INBOX = 'flierstudios@gmail.com'

/**
 * Send a contact-form message to the Flier Studio inbox.
 *
 * @param {{ name: string, email: string, message: string, subject?: string }} payload
 */
export async function sendContactMessage({ name, email, message, subject }) {
  const fromName = String(name || '').trim() || 'Anonymous'
  const replyTo = String(email || '')
    .trim()
    .toLowerCase()
  const body = String(message || '').trim()
  const shortSubject = String(subject || '').trim()

  if (!replyTo) {
    throw new Error('Cannot send contact email: missing reply-to email')
  }
  if (!body) {
    throw new Error('Cannot send contact email: message is empty')
  }

  const subjectLine = shortSubject
    ? `Flier Studio contact: ${shortSubject}`
    : `Flier Studio contact: ${fromName}`

  const text = [
    `Name: ${fromName}`,
    `Email: ${replyTo}`,
    shortSubject ? `Subject: ${shortSubject}` : null,
    '',
    body,
  ]
    .filter((line) => line !== null)
    .join('\n')

  const html = `
    <div style="font-family: system-ui, sans-serif; line-height: 1.5; color: #1a1a1a;">
      <p><strong>Name:</strong> ${escapeHtml(fromName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(replyTo)}</p>
      ${shortSubject ? `<p><strong>Subject:</strong> ${escapeHtml(shortSubject)}</p>` : ''}
      <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;" />
      <p style="white-space: pre-wrap;">${escapeHtml(body)}</p>
    </div>
  `.trim()

  const { transport, config } = getMailtrapTransport()

  const result = await transport.sendMail({
    from: `"${config.from.name}" <${config.from.email}>`,
    to: CONTACT_INBOX,
    replyTo,
    subject: subjectLine,
    html,
    text,
  })

  return { result, mode: config.mode, to: CONTACT_INBOX }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
