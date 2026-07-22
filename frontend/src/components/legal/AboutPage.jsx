import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PublicPageShell from './PublicPageShell'
import { SITE_LEGAL } from './siteLegal'

export default function AboutPage() {
  useEffect(() => {
    const prev = document.title
    document.title = 'About — Flier Studio'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <PublicPageShell
      title="About Flier Studio"
      lead="A studio for people who need a flier that looks designed — without starting from a blank artboard."
    >
      <section className="pub-section">
        <h2>What it is</h2>
        <p>
          Flier Studio is a web app for making and exporting print-ready social
          fliers. You browse templates published by the team, open one in the
          Studio, edit the words, photos, and colors, then download a PNG or
          JPG at the size the board was built for.
        </p>
        <p>
          The promise is simple: <strong>{SITE_LEGAL.tagline}</strong> Templates
          carry the layout craft. You make the message yours.
        </p>
      </section>

      <section className="pub-section">
        <h2>Who it’s for</h2>
        <ul>
          <li>
            <strong>Designers who want speed</strong> — skip rebuilding the same
            poster structure; jump into a solid board and ship the variation.
          </li>
          <li>
            <strong>Non-designers who need ready layouts</strong> — pick a
            template that already has hierarchy, spacing, and export size dialed
            in, then swap in your content.
          </li>
        </ul>
      </section>

      <section className="pub-section">
        <h2>How we think about craft</h2>
        <p>
          Good fliers are not dashboards. They answer one question, hold one
          hero, and export at native pixels. Flier Studio is built around that
          idea: curated boards, editable slots, and downloads that match the
          platform size — Instagram portrait, story, LinkedIn, and the rest —
          rather than stretching everything to a single default.
        </p>
        <p>
          We are not pitching a magic “AI does the whole poster” button. The
          work is in the template system and the Studio tools you use to finish
          it.
        </p>
      </section>

      <section className="pub-section">
        <h2>A short story</h2>
        <p>
          Most event and promo graphics die in the gap between “we need a flier
          tonight” and “someone has time to design one.” Flier Studio closes
          that gap with boards that already feel intentional — Signal accent,
          warm ink and paper, type that can shout when it should — so you spend
          your energy on the message, not reinventing margins.
        </p>
      </section>

      <section className="pub-section">
        <h2>Get started</h2>
        <p>
          Sign in with Google, open the studio, and pick a template to begin. Your drafts can
          live on your device while you work; export when it’s ready to post.
        </p>
        <div className="pub-about-cta">
          <Link to="/studio" className="l-btn l-btn--primary">
            Open the Studio
          </Link>
          <Link to="/contact" className="l-btn l-btn--ghost">
            Contact us
          </Link>
        </div>
      </section>
    </PublicPageShell>
  )
}
