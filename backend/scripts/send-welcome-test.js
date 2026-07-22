/**
 * Sandbox smoke test for the welcome email.
 *
 * Usage (from backend/):
 *   npm run mail:welcome-test
 *   npm run mail:welcome-test -- you@example.com "Ada"
 *
 * Emails land in your Mailtrap Email Testing inbox (not a real mailbox).
 */
import 'dotenv/config'
import { sendWelcomeEmail } from '../src/mailtrap/emails.js'
import { getMailtrapConfig } from '../src/mailtrap/mailtrap.config.js'

const email = process.argv[2] || 'welcome-test@example.com'
const name = process.argv[3] || 'Ada'

async function main() {
  const config = getMailtrapConfig()
  console.log(`Mailtrap mode: ${config.mode}`)
  console.log(`SMTP: ${config.host}:${config.port}`)
  console.log(`From: ${config.from.name} <${config.from.email}>`)
  console.log(`To: ${name} <${email}>`)

  const { result, mode } = await sendWelcomeEmail({ name, email })
  console.log(`Welcome email sent (${mode})`)
  console.log(result)
}

main().catch((err) => {
  console.error('Welcome email test failed:', err?.message || err)
  process.exit(1)
})
