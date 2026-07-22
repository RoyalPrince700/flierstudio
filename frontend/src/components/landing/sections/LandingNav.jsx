import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LiftoffMark } from '../../../fliers/flier-studio/FSLogo'
import { EASE } from '../motion'

const LINKS = [
  { href: '/#boards', label: 'Boards' },
  { href: '/#editing', label: 'Editing' },
  { href: '/#templates', label: 'Templates' },
  { href: '/#export', label: 'Export' },
  { to: '/about', label: 'About' },
]

export default function LandingNav() {
  return (
    <motion.header
      className="landing-nav"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className="landing-wrap landing-nav__inner">
        <Link to="/" className="landing-nav__logo">
          <span className="landing-nav__mark" aria-hidden="true">
            <LiftoffMark size={18} base="#FFFFFF" corner="#FFFFFF" title="" />
          </span>
          Flier Studio
        </Link>

        <nav className="landing-nav__links">
          {LINKS.map((link) =>
            link.to ? (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ) : (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ),
          )}
        </nav>

        <div className="landing-nav__actions">
          <Link to="/templates" className="l-btn l-btn--ghost l-btn--small">
            Sign in
          </Link>
          <Link to="/templates" className="l-btn l-btn--primary l-btn--small">
            Open Studio
          </Link>
        </div>
      </div>
    </motion.header>
  )
}
