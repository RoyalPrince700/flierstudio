import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PublicPageShell from './PublicPageShell'
import { SITE_LEGAL } from './siteLegal'

function Placeholder({ children }) {
  return <span className="pub-placeholder">{children}</span>
}

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
      lead="This policy explains what Flier Studio collects, why we collect it, and how you can ask questions or make requests. Plain language first."
    >
      <section className="pub-section">
        <h2>Who we are</h2>
        <p>
          Flier Studio is a web app for designing and exporting fliers from
          curated templates. For legal purposes, the service is operated by{' '}
          <Placeholder>{SITE_LEGAL.operatorName}</Placeholder>. Replace this
          placeholder with your registered operator name before publishing as
          final legal copy.
        </p>
      </section>

      <section className="pub-section">
        <h2>What we collect</h2>
        <p>Depending on how you use the product, we may process:</p>
        <ul>
          <li>
            <strong>Google account basics</strong> — when you sign in with
            Google: name, email address, Google account ID, and profile photo
            URL (if provided by Google).
          </li>
          <li>
            <strong>Account records</strong> — role (user or admin), account
            creation time, and last login time.
          </li>
          <li>
            <strong>Content you put into boards</strong> — text, images, and
            color choices you edit in the Studio. Drafts are primarily stored on
            your device (see below). We do not treat your flier copy as a
            marketing lead list.
          </li>
          <li>
            <strong>Technical data</strong> — standard request information our
            servers or hosting providers may log (for example IP address,
            browser type, and timestamps) to keep the service secure and
            reliable.
          </li>
          <li>
            <strong>Aggregate usage measurement</strong> — we use Google Tag
            Manager / Google Analytics to understand how people use the product
            in aggregate (for example pages visited). That measurement is handled
            by Google under their policies and is not stored as per-action event
            logs in our own database.
          </li>
        </ul>
      </section>

      <section className="pub-section">
        <h2>How we use data</h2>
        <ul>
          <li>Authenticate you and keep your session working.</li>
          <li>Show templates you are allowed to use and run the Studio.</li>
          <li>
            Improve the product — understand aggregate usage through Google
            Analytics / Tag Manager.
          </li>
          <li>
            Support admin tools — published template groups and user lists for
            operators of the service.
          </li>
          <li>Protect the service against abuse and outages.</li>
        </ul>
        <p>
          We do not sell your personal information. Flier Studio is a template
          studio — layouts are craft work you customize — not a product that
          claims to “AI-generate everything” from your private data.
        </p>
      </section>

      <section className="pub-section">
        <h2>Local device storage</h2>
        <p>
          To make editing feel fast and resilient, Flier Studio may store data
          on your device, including:
        </p>
        <ul>
          <li>
            <strong>Drafts</strong> — board edits in IndexedDB (and, for older
            sessions, local storage during migration).
          </li>
          <li>
            <strong>Preferences</strong> — for example theme, open tabs, and
            UI layout choices in local storage.
          </li>
        </ul>
        <p>
          This data stays on your browser unless you clear site data or we later
          offer optional cloud sync (and you choose to use it). Clearing browser
          storage will remove local drafts and preferences.
        </p>
      </section>

      <section className="pub-section">
        <h2>Cookies and sessions</h2>
        <p>
          We use authentication tokens / session mechanisms so you stay signed
          in after Google login. We may also use local storage (described above)
          for preferences. We use Google Tag Manager to load measurement tags
          (such as analytics) so we can understand aggregate product usage. Those
          tags may set cookies or similar identifiers as described by Google. We
          do not run a wall of third-party advertising cookies on the product
          itself.
        </p>
      </section>

      <section className="pub-section">
        <h2>Sharing</h2>
        <p>We share data only as needed to run the product:</p>
        <ul>
          <li>
            <strong>Google</strong> — as your sign-in provider. Their handling
            of your Google account is governed by Google’s policies.
          </li>
          <li>
            <strong>Infrastructure providers</strong> — hosting, database, and
            similar vendors that process data on our behalf to operate the
            service.
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
          Account records are kept while your account is active and for a
          reasonable period afterward as needed for security and legal
          obligations. Local drafts remain on your device until you delete them
          or clear browser storage. Aggregate analytics retention follows Google
          Analytics / Tag Manager settings.
        </p>
      </section>

      <section className="pub-section">
        <h2>Your rights and choices</h2>
        <p>
          Depending on where you live, you may have rights to access, correct,
          delete, or export personal data we hold about you, or to object to
          certain processing. You can also sign out, stop using the product, or
          clear local browser storage at any time.
        </p>
        <p>
          To make a privacy request, email{' '}
          <Placeholder>{SITE_LEGAL.contactEmail}</Placeholder> (replace with
          your real inbox before launch) and tell us what you need. We may ask
          you to verify that the request relates to your account.
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
          revise the “Last updated” date on this page. Continued use after
          changes means you accept the updated policy.
        </p>
      </section>

      <section className="pub-section">
        <h2>Contact</h2>
        <p>
          Privacy questions and requests:{' '}
          <Placeholder>{SITE_LEGAL.contactEmail}</Placeholder>
        </p>
        <p>
          General contact: see our <Link to="/contact">Contact</Link> page.
        </p>
        <div className="pub-callout">
          <p>
            Owner checklist before final publish: set{' '}
            <Placeholder>{SITE_LEGAL.operatorName}</Placeholder>,{' '}
            <Placeholder>{SITE_LEGAL.contactEmail}</Placeholder>, and any
            region-specific disclosures required for your{' '}
            <Placeholder>{SITE_LEGAL.governingLaw}</Placeholder>.
          </p>
        </div>
      </section>
    </PublicPageShell>
  )
}
