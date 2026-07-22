import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PublicPageShell from './PublicPageShell'
import { SITE_LEGAL } from './siteLegal'

function Placeholder({ children }) {
  return <span className="pub-placeholder">{children}</span>
}

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
      lead="These terms cover how you may use Flier Studio — templates, editing, and exports — in everyday language."
    >
      <section className="pub-section">
        <h2>Acceptance</h2>
        <p>
          By accessing or using Flier Studio, you agree to these Terms of Use
          and our <Link to="/privacy">Privacy Policy</Link>. If you do not
          agree, do not use the service.
        </p>
        <p>
          The service is operated by{' '}
          <Placeholder>{SITE_LEGAL.operatorName}</Placeholder>. Replace this
          placeholder with your registered operator name before publishing as
          final legal copy.
        </p>
      </section>

      <section className="pub-section">
        <h2>The service</h2>
        <p>
          Flier Studio lets you browse templates published by administrators,
          open a template in the Studio, customize text, images, and colors, and
          export PNG or JPG files. Templates provide layout craft; you supply
          and control your content. The product does not claim that AI invents
          finished designs from a blank prompt on your behalf.
        </p>
      </section>

      <section className="pub-section">
        <h2>Accounts and Google sign-in</h2>
        <p>
          You sign in with Google. You are responsible for the Google account
          you use and for activity that occurs while you are signed in. Keep
          your Google account secure. You must provide accurate account
          information and be old enough to use the service under applicable law.
        </p>
        <p>
          We may suspend or limit access if we reasonably believe an account is
          compromised, abusive, or used in violation of these terms.
        </p>
      </section>

      <section className="pub-section">
        <h2>Templates, exports, and allowed use</h2>
        <p>You may:</p>
        <ul>
          <li>Browse published templates available to your account.</li>
          <li>Edit boards in the Studio for your own projects.</li>
          <li>
            Export PNG/JPG files and use those exports for personal or
            commercial projects, subject to any rights in third-party content
            you add (photos, logos, fonts you upload, etc.).
          </li>
        </ul>
        <p>You may not:</p>
        <ul>
          <li>
            Scrape, bulk-download, or redistribute Flier Studio template files,
            layout systems, or brand assets as a competing template library.
          </li>
          <li>
            Reverse engineer the product beyond what applicable law allows.
          </li>
          <li>
            Remove Flier Studio branding from places where the product requires
            it, or present our templates as your original template product.
          </li>
          <li>
            Use the service to create or distribute unlawful, hateful,
            deceptive, or infringing material.
          </li>
          <li>
            Interfere with the service, other users, or admin systems (including
            attempting unauthorized access).
          </li>
        </ul>
      </section>

      <section className="pub-section">
        <h2>Your content</h2>
        <p>
          You keep ownership of the words, photos, and other materials you add
          to boards. You grant us a limited license to host, process, and
          display that content only as needed to operate Flier Studio (for
          example, to show your edits in the Studio and to generate exports you
          request).
        </p>
        <p>
          Drafts may be stored locally on your device. You are responsible for
          backing up important work and for having the rights to any assets you
          upload or place into a flier.
        </p>
      </section>

      <section className="pub-section">
        <h2>Our intellectual property</h2>
        <p>
          Flier Studio — including the name, logo, interface, template layouts,
          sample systems, and documentation — is owned by us or our licensors.
          These terms do not transfer ownership of our templates or brand to
          you. Your export is a finished flier for your use; it is not a license
          to resell our template library or identity system.
        </p>
      </section>

      <section className="pub-section">
        <h2>Third-party services</h2>
        <p>
          Sign-in depends on Google. Their terms and privacy practices apply to
          your use of Google accounts. We are not responsible for third-party
          services outside our reasonable control.
        </p>
      </section>

      <section className="pub-section">
        <h2>No warranty</h2>
        <p>
          Flier Studio is provided “as is” and “as available.” We work to keep
          it reliable, but we do not promise uninterrupted access, perfect
          exports on every device, or that the service will meet every creative
          or commercial need. To the fullest extent permitted by law, we
          disclaim implied warranties such as merchantability, fitness for a
          particular purpose, and non-infringement.
        </p>
      </section>

      <section className="pub-section">
        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, Flier Studio and its
          operators will not be liable for indirect, incidental, special,
          consequential, or lost-profit damages arising from your use of the
          service. Our total liability for any claim relating to the service is
          limited to the greater of (a) the amount you paid us for the service
          in the three months before the claim, or (b) USD $50 — a practical
          startup-level cap while the product is free or early-stage.
        </p>
        <p>
          Some jurisdictions do not allow certain limitations; in those places,
          our liability is limited to the maximum extent allowed by law under{' '}
          <Placeholder>{SITE_LEGAL.governingLaw}</Placeholder>.
        </p>
      </section>

      <section className="pub-section">
        <h2>Termination</h2>
        <p>
          You may stop using Flier Studio at any time. We may suspend or end
          access if you breach these terms, if required by law, or if we
          discontinue the service. Provisions that should survive (including
          ownership, disclaimers, and limitations) will survive termination.
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
        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of{' '}
          <Placeholder>{SITE_LEGAL.governingLaw}</Placeholder>, without regard
          to conflict-of-law rules, unless mandatory consumer protections in
          your country say otherwise. Replace the placeholder with your chosen
          jurisdiction before publishing as final legal copy.
        </p>
      </section>

      <section className="pub-section">
        <h2>Contact</h2>
        <p>
          Questions about these terms:{' '}
          <Placeholder>{SITE_LEGAL.contactEmail}</Placeholder>
        </p>
        <p>
          Or use our <Link to="/contact">Contact</Link> page.
        </p>
      </section>
    </PublicPageShell>
  )
}
