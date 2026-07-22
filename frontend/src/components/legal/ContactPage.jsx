import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PublicPageShell from './PublicPageShell'
import { SITE_LEGAL } from './siteLegal'

function Placeholder({ children }) {
  return <span className="pub-placeholder">{children}</span>
}

export default function ContactPage() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Contact — Flier Studio'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <PublicPageShell
      title="Contact"
      lead="Questions about the product, privacy, or these pages — reach us here."
    >
      <section className="pub-section">
        <h2>Email</h2>
        <p>
          General:{' '}
          <a href={`mailto:${SITE_LEGAL.supportEmail}`}>
            <Placeholder>{SITE_LEGAL.supportEmail}</Placeholder>
          </a>
        </p>
        <p>
          Privacy &amp; legal:{' '}
          <a href={`mailto:${SITE_LEGAL.contactEmail}`}>
            <Placeholder>{SITE_LEGAL.contactEmail}</Placeholder>
          </a>
        </p>
        <div className="pub-callout">
          <p>
            These addresses are placeholders. Replace{' '}
            <Placeholder>{SITE_LEGAL.supportEmail}</Placeholder> and{' '}
            <Placeholder>{SITE_LEGAL.contactEmail}</Placeholder> in{' '}
            <code style={{ color: 'var(--l-text)' }}>
              frontend/src/components/legal/siteLegal.js
            </code>{' '}
            with real inboxes before launch. Operator name:{' '}
            <Placeholder>{SITE_LEGAL.operatorName}</Placeholder>.
          </p>
        </div>
      </section>

      <section className="pub-section">
        <h2>What to include</h2>
        <ul>
          <li>Your Google account email if the question is about an account.</li>
          <li>For privacy requests: what you want us to access, correct, or delete.</li>
          <li>For product issues: browser, and what you were trying to do.</li>
        </ul>
      </section>

      <section className="pub-section">
        <h2>Policies</h2>
        <p>
          Read our <Link to="/privacy">Privacy Policy</Link> and{' '}
          <Link to="/terms">Terms of Use</Link>. Learn more on{' '}
          <Link to="/about">About</Link>.
        </p>
      </section>
    </PublicPageShell>
  )
}
