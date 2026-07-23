import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PublicPageShell from './PublicPageShell'
import { SITE_LEGAL } from './siteLegal'

export default function TermsPage() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Terms of Use — Flier Studio'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <PublicPageShell
      title="Terms of Use"
      updated={SITE_LEGAL.lastUpdated}
      lead="Simple terms for using Flier Studio while the product is early."
    >
      <section className="pub-section">
        <h2>Acceptance</h2>
        <p>
          By using Flier Studio, you agree to these Terms of Use and our{' '}
          <Link to="/privacy">Privacy Policy</Link>. If you do not agree, do
          not use the service. Flier Studio is operated by{' '}
          {SITE_LEGAL.operatorName}.
        </p>
      </section>

      <section className="pub-section">
        <h2>The service</h2>
        <p>
          Flier Studio lets you browse templates, customize text, images, and
          colors in the Studio, and export PNG or JPG files. Templates provide
          the layout; you supply and control your content.
        </p>
      </section>

      <section className="pub-section">
        <h2>Google sign-in</h2>
        <p>
          You sign in with Google. You are responsible for the Google account
          you use and for activity while you are signed in. Keep your account
          secure. You must be old enough to use the service under applicable
          law.
        </p>
        <p>
          We may suspend or limit access if an account looks compromised,
          abusive, or used in violation of these terms.
        </p>
      </section>

      <section className="pub-section">
        <h2>Allowed use</h2>
        <p>You may:</p>
        <ul>
          <li>Browse published templates available to your account.</li>
          <li>Edit boards in the Studio for your own projects.</li>
          <li>
            Export PNG/JPG files and use those exports for personal or
            commercial projects, subject to rights in content you add (photos,
            logos, etc.).
          </li>
        </ul>
        <p>You may not:</p>
        <ul>
          <li>
            Scrape or redistribute Flier Studio templates or brand assets as a
            competing template library.
          </li>
          <li>
            Present our templates as your original template product.
          </li>
          <li>
            Use the service to create or distribute unlawful, hateful,
            deceptive, or infringing material.
          </li>
          <li>
            Interfere with the service, other users, or admin systems.
          </li>
        </ul>
      </section>

      <section className="pub-section">
        <h2>Your content vs our templates</h2>
        <p>
          You keep ownership of the words, photos, and other materials you add
          to boards. You are responsible for having the rights to anything you
          put into a flier. Drafts may be stored locally on your device.
        </p>
        <p>
          Flier Studio — including the name, interface, and template layouts —
          remains ours. Your export is a finished flier for your use; it is not
          a license to resell our template library.
        </p>
      </section>

      <section className="pub-section">
        <h2>Availability</h2>
        <p>
          Flier Studio is an early product, provided as available. We work to
          keep it reliable, but we do not promise uninterrupted access or
          perfect results on every device.
        </p>
      </section>

      <section className="pub-section">
        <h2>Changes</h2>
        <p>
          We may update these terms as the product changes. We will update the
          “Last updated” date on this page. Continued use after changes means
          you accept the revised terms.
        </p>
      </section>

      <section className="pub-section">
        <h2>Contact</h2>
        <p>
          Questions:{' '}
          <a href={`mailto:${SITE_LEGAL.contactEmail}`}>
            {SITE_LEGAL.contactEmail}
          </a>
        </p>
        <p>
          Or use our <Link to="/contact">Contact</Link> page.
        </p>
      </section>
    </PublicPageShell>
  )
}
