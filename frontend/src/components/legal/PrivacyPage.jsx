import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PublicPageShell from './PublicPageShell'
import { SITE_LEGAL } from './siteLegal'

export default function PrivacyPage() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Privacy Policy — Flier Studio'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <PublicPageShell
      title="Privacy Policy"
      updated={SITE_LEGAL.lastUpdated}
      lead="A short, plain-language note on what Flier Studio collects and how we handle it."
    >
      <section className="pub-section">
        <h2>Who we are</h2>
        <p>
          Flier Studio is a web app for designing and exporting fliers from
          curated templates. The service is operated by {SITE_LEGAL.operatorName}.
        </p>
      </section>

      <section className="pub-section">
        <h2>What we collect</h2>
        <p>
          We use Google sign-in. When you sign in, we receive basic Google
          account details: name, email address, Google account ID, and profile
          photo if Google provides it.
        </p>
        <p>
          Drafts and edits mostly stay on your device. We do not sell your data.
        </p>
      </section>

      <section className="pub-section">
        <h2>How we use data</h2>
        <ul>
          <li>Sign you in and keep your session working.</li>
          <li>Show templates and run the Studio.</li>
          <li>Understand aggregate product usage (via Google Analytics / Tag Manager).</li>
          <li>Keep the service secure and reliable.</li>
        </ul>
      </section>

      <section className="pub-section">
        <h2>Local device storage</h2>
        <p>
          Flier Studio may store drafts and preferences on your device (for
          example in IndexedDB or local storage) so editing feels fast. That
          data stays in your browser unless you clear site data. Clearing
          browser storage removes local drafts and preferences.
        </p>
      </section>

      <section className="pub-section">
        <h2>Cookies and sessions</h2>
        <p>
          We use session mechanisms so you stay signed in after Google login,
          and local storage for preferences. Google Tag Manager may load
          analytics tags that set cookies as described by Google. We do not run
          a wall of third-party advertising cookies on the product itself.
        </p>
      </section>

      <section className="pub-section">
        <h2>Sharing</h2>
        <p>We share data only as needed to run the product:</p>
        <ul>
          <li>
            <strong>Google</strong> — as your sign-in provider. Their policies
            cover your Google account.
          </li>
          <li>
            <strong>Infrastructure providers</strong> — hosting and similar
            vendors that help us operate the service.
          </li>
          <li>
            <strong>Legal requirements</strong> — if we are required to disclose
            information by law or to protect the service and its users.
          </li>
        </ul>
      </section>

      <section className="pub-section">
        <h2>Retention</h2>
        <p>
          Account details are kept while your account is active and for a
          reasonable period afterward if needed for security. Local drafts
          remain on your device until you delete them or clear browser storage.
        </p>
      </section>

      <section className="pub-section">
        <h2>Your rights and choices</h2>
        <p>
          Depending on where you live, you may have rights to access, correct,
          delete, or export personal data we hold about you. You can also sign
          out, stop using the product, or clear local browser storage at any
          time.
        </p>
        <p>
          To make a privacy request, email{' '}
          <a href={`mailto:${SITE_LEGAL.contactEmail}`}>
            {SITE_LEGAL.contactEmail}
          </a>
          . We may ask you to verify that the request relates to your account.
        </p>
      </section>

      <section className="pub-section">
        <h2>Children</h2>
        <p>
          Flier Studio is not directed at children under 13 (or the equivalent
          minimum age in your region). If you believe a child has created an
          account, contact us and we will take appropriate steps.
        </p>
      </section>

      <section className="pub-section">
        <h2>Changes</h2>
        <p>
          We may update this policy as the product evolves. When we do, we will
          revise the “Last updated” date on this page.
        </p>
      </section>

      <section className="pub-section">
        <h2>Contact</h2>
        <p>
          Privacy questions:{' '}
          <a href={`mailto:${SITE_LEGAL.contactEmail}`}>
            {SITE_LEGAL.contactEmail}
          </a>
        </p>
        <p>
          Or see our <Link to="/contact">Contact</Link> page.
        </p>
      </section>
    </PublicPageShell>
  )
}
