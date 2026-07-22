import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { LiftoffMark } from '../../fliers/flier-studio/FSLogo'
import '../landing/LandingPage.css'
import './LegalPages.css'

const FOOTER_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
  { to: '/contact', label: 'Contact' },
]

export function PublicFooter({ showSectionAnchors = false }) {
  return (
    <footer className="pub-footer">
      <div className="landing-wrap pub-footer__inner">
        <Link to="/" className="pub-footer__brand">
          <span className="landing-nav__mark" aria-hidden="true">
            <LiftoffMark size={17} base="#FFFFFF" corner="#FFFFFF" title="" />
          </span>
          Flier Studio
        </Link>

        <nav className="pub-footer__links" aria-label="Footer">
          {showSectionAnchors ? (
            <>
              <a href="/#boards">Boards</a>
              <a href="/#editing">Editing</a>
              <a href="/#templates">Templates</a>
              <a href="/#export">Export</a>
            </>
          ) : null}
          {FOOTER_LINKS.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
          <Link to="/studio">Sign in</Link>
        </nav>

        <span className="pub-footer__note">
          © {new Date().getFullYear()} Flier Studio. Designed at native pixels.
        </span>
      </div>
    </footer>
  )
}

export default function PublicPageShell({
  title,
  eyebrow = 'Flier Studio',
  updated,
  children,
  lead,
}) {
  const location = useLocation()

  useEffect(() => {
    const scroller = document.querySelector('.pub-page .landing__scroll')
    if (scroller) scroller.scrollTop = 0
    else window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="landing pub-page">
      <div className="landing__scroll">
        <header className="landing-nav pub-nav">
          <div className="landing-wrap landing-nav__inner">
            <Link to="/" className="landing-nav__logo">
              <span className="landing-nav__mark" aria-hidden="true">
                <LiftoffMark size={18} base="#FFFFFF" corner="#FFFFFF" title="" />
              </span>
              Flier Studio
            </Link>

            <nav className="landing-nav__links">
              <Link to="/about">About</Link>
              <Link to="/templates">Templates</Link>
              <Link to="/contact">Contact</Link>
            </nav>

            <div className="landing-nav__actions">
              <Link to="/studio" className="l-btn l-btn--ghost l-btn--small">
                Sign in
              </Link>
              <Link to="/studio" className="l-btn l-btn--primary l-btn--small">
                Open Studio
              </Link>
            </div>
          </div>
        </header>

        <main className="pub-main">
          <div className="landing-wrap pub-doc">
            {eyebrow ? <p className="landing-eyebrow">{eyebrow}</p> : null}
            <h1 className="pub-doc__title">{title}</h1>
            {updated ? (
              <p className="pub-doc__meta">Last updated: {updated}</p>
            ) : null}
            {lead ? <p className="pub-doc__lead">{lead}</p> : null}
            <div className="pub-doc__body">{children}</div>
          </div>
        </main>

        <PublicFooter />
      </div>
    </div>
  )
}
