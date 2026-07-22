/**
 * Branded HTML + plain-text email templates for Flier Studio.
 * Colors match the product identity: Signal / Ink / Paper.
 * Inline CSS + table layout for common email clients.
 */

const COLORS = {
  signal: '#FF4A1D',
  signalDeep: '#C93007',
  ink: '#141310',
  paper: '#F5F1E8',
  mist: '#E8E2D6',
  muted: '#5C574E',
  white: '#FFFFFF',
}

const FONTS =
  "'Space Grotesk', 'Manrope', 'Segoe UI', Helvetica, Arial, sans-serif"

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function firstName(name, email) {
  const raw = String(name || '').trim()
  if (raw) return raw.split(/\s+/)[0]
  const local = String(email || '').split('@')[0]
  return local || 'there'
}

/**
 * @param {{ name?: string, email?: string, studioUrl: string }} opts
 */
export function welcomeEmailTemplate({ name, email, studioUrl }) {
  const greetingName = escapeHtml(firstName(name, email))
  const safeUrl = escapeHtml(studioUrl)
  const subject = 'Welcome to Flier Studio'

  const text = [
    `Welcome to Flier Studio, ${firstName(name, email)}.`,
    '',
    'Start with a template. Make it yours.',
    '',
    'Pick a layout, swap the copy and photos, then export. The craft is already built in.',
    '',
    `Open the studio: ${studioUrl}`,
    '',
    '— Flier Studio',
  ].join('\n')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.ink};-webkit-text-size-adjust:100%;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${COLORS.ink};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;background-color:${COLORS.paper};border-radius:20px;overflow:hidden;">
          <!-- Signal bar -->
          <tr>
            <td style="height:6px;background-color:${COLORS.signal};font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Brand -->
          <tr>
            <td style="padding:36px 36px 8px 36px;font-family:${FONTS};">
              <p style="margin:0;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.signalDeep};font-weight:700;">
                Flier Studio
              </p>
            </td>
          </tr>

          <!-- Headline -->
          <tr>
            <td style="padding:12px 36px 0 36px;font-family:${FONTS};">
              <h1 style="margin:0;font-size:32px;line-height:1.15;letter-spacing:-0.03em;color:${COLORS.ink};font-weight:700;">
                Welcome, ${greetingName}.
              </h1>
            </td>
          </tr>

          <!-- Tagline -->
          <tr>
            <td style="padding:16px 36px 0 36px;font-family:${FONTS};">
              <p style="margin:0;font-size:18px;line-height:1.4;letter-spacing:-0.02em;color:${COLORS.ink};font-weight:500;">
                Start with a template. Make it yours.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:20px 36px 0 36px;font-family:${FONTS};">
              <p style="margin:0;font-size:15px;line-height:1.55;color:${COLORS.muted};">
                Pick a layout, change the words and photos, then export. Composition and hierarchy are already handled — you just put something up.
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:32px 36px 8px 36px;font-family:${FONTS};">
              <a href="${safeUrl}" style="display:inline-block;background-color:${COLORS.signal};color:${COLORS.white};text-decoration:none;font-size:15px;font-weight:700;letter-spacing:-0.01em;padding:14px 22px;border-radius:12px;">
                Open the studio
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding:12px 36px 36px 36px;font-family:${FONTS};">
              <p style="margin:0;font-size:13px;line-height:1.5;color:${COLORS.muted};">
                Or paste this link:<br />
                <a href="${safeUrl}" style="color:${COLORS.signalDeep};word-break:break-all;">${safeUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px;border-top:1px solid ${COLORS.mist};font-family:${FONTS};background-color:#EFEBE3;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:${COLORS.muted};">
                Flier Studio · Start with a template. Make it yours.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return { subject, html, text }
}
