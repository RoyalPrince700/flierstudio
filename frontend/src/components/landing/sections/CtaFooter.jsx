import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LiftoffMark } from '../../../fliers/flier-studio/FSLogo'
import { fadeUp, viewportOnce } from '../motion'

export default function CtaFooter() {
  return (
    <>
      <section className="landing-cta">
        <div className="landing-wrap landing-cta__inner">
          <motion.h2
            className="landing-cta__title"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            Your next flier starts here
          </motion.h2>
          <motion.p
            className="landing-cta__copy"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            custom={0.1}
          >
            Sign in with Google, open a board, and have something worth posting
            before your coffee cools.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            custom={0.2}
          >
            <Link to="/templates" className="l-btn l-btn--primary">
              Open the Studio — it&rsquo;s free
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-wrap landing-footer__inner">
          <div className="landing-footer__brand">
            <span className="landing-nav__mark" aria-hidden="true">
              <LiftoffMark size={17} base="#FFFFFF" corner="#FFFFFF" title="" />
            </span>
            Flier Studio
          </div>
          <nav className="landing-footer__links" aria-label="Footer">
            <div className="landing-footer__link-group">
              <a href="/#boards">Boards</a>
              <a href="/#editing">Editing</a>
              <a href="/#templates">Templates</a>
              <a href="/#export">Export</a>
              <Link to="/templates">Sign in</Link>
            </div>
            <div className="landing-footer__link-group landing-footer__link-group--legal">
              <Link to="/about">About</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </nav>
          <span className="landing-footer__note">
            © {new Date().getFullYear()} Flier Studio · Start with a template. Make it yours.
          </span>
        </div>
      </footer>
    </>
  )
}
