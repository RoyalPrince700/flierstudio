import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { LiftoffMark } from '../../../fliers/flier-studio/FSLogo'
import { EASE } from '../motion'

const LINKS = [
  { href: '/#boards', label: 'Boards' },
  { href: '/#editing', label: 'Editing' },
  { href: '/#templates', label: 'Templates' },
  { href: '/#export', label: 'Export' },
  { to: '/about', label: 'About' },
]

function NavLink({ link, onNavigate }) {
  if (link.to) {
    return (
      <Link to={link.to} onClick={onNavigate}>
        {link.label}
      </Link>
    )
  }
  return (
    <a href={link.href} onClick={onNavigate}>
      {link.label}
    </a>
  )
}

export default function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()
  const toggleRef = useRef(null)
  const panelRef = useRef(null)

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    if (!menuOpen) return undefined

    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu()
    }

    const scrollRoot = document.querySelector('.landing__scroll')
    const prevOverflow = scrollRoot?.style.overflow ?? ''
    if (scrollRoot) scrollRoot.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    const firstLink = panelRef.current?.querySelector('a, button')
    firstLink?.focus()

    return () => {
      if (scrollRoot) scrollRoot.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKeyDown)
      toggleRef.current?.focus()
    }
  }, [menuOpen])

  return (
    <motion.header
      className="landing-nav"
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className="landing-wrap landing-nav__inner">
        <Link to="/" className="landing-nav__logo" aria-label="Flier Studio home">
          <span className="landing-nav__mark" aria-hidden="true">
            <LiftoffMark size={18} base="#FFFFFF" corner="#FFFFFF" title="" />
          </span>
          <span className="landing-nav__wordmark">Flier Studio</span>
        </Link>

        <nav className="landing-nav__links" aria-label="Primary">
          {LINKS.map((link) => (
            <NavLink key={link.label} link={link} />
          ))}
        </nav>

        <div className="landing-nav__actions">
          <Link to="/templates" className="l-btn l-btn--ghost l-btn--small landing-nav__signin">
            Sign in
          </Link>
          <Link to="/templates" className="l-btn l-btn--primary l-btn--small">
            Open Studio
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="landing-nav__menu-btn"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} strokeWidth={2.25} /> : <Menu size={22} strokeWidth={2.25} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.button
              type="button"
              className="landing-nav__backdrop"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
            />
            <motion.nav
              ref={panelRef}
              id={menuId}
              className="landing-nav__drawer"
              aria-label="Mobile"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              {LINKS.map((link) => (
                <NavLink key={link.label} link={link} onNavigate={closeMenu} />
              ))}
              <Link
                to="/templates"
                className="landing-nav__drawer-signin"
                onClick={closeMenu}
              >
                Sign in
              </Link>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </motion.header>
  )
}
