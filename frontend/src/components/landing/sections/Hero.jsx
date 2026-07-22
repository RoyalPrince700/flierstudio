import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Download,
  Frame,
  Hand,
  Layers,
  MousePointer2,
  Sparkles,
  Type,
} from 'lucide-react'
import { EASE, fadeUp } from '../motion'

function Cursor() {
  return (
    <motion.div
      className="studio-mock__cursor"
      initial={{ x: 420, y: 320, opacity: 0 }}
      animate={{
        x: [420, 175, 175, 470, 470],
        y: [320, 150, 150, 235, 235],
        opacity: [0, 1, 1, 1, 1],
      }}
      transition={{
        duration: 7,
        times: [0, 0.25, 0.45, 0.75, 1],
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: 1.4,
      }}
    >
      <MousePointer2 size={18} fill="#fff" color="#111" />
      <div className="studio-mock__cursorTag">you</div>
    </motion.div>
  )
}

function StudioMock() {
  const flierIn = (delay) => ({
    initial: { opacity: 0, y: 34, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.8, ease: EASE, delay },
  })

  return (
    <motion.div
      className="studio-mock"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
    >
      <div className="studio-mock__bar">
        <div className="studio-mock__dots">
          <span />
          <span />
          <span />
        </div>
        <div className="studio-mock__tabs">
          <span className="studio-mock__tab studio-mock__tab--active">
            <i style={{ background: '#3A8DFF' }} />
            Emergence
          </span>
          <span className="studio-mock__tab">
            <i style={{ background: '#0b5fff' }} />
            Orbit Gadgets
          </span>
          <span className="studio-mock__tab">
            <i style={{ background: '#d8d8d8' }} />
            Royal Prince
          </span>
        </div>
        <span className="studio-mock__zoom">72%</span>
      </div>

      <div className="studio-mock__body">
        <div className="studio-mock__rail">
          <span className="studio-mock__railBtn studio-mock__railBtn--active">
            <MousePointer2 size={16} />
          </span>
          <span className="studio-mock__railBtn">
            <Type size={16} />
          </span>
          <span className="studio-mock__railBtn">
            <Hand size={16} />
          </span>
          <span className="studio-mock__railBtn">
            <Frame size={16} />
          </span>
        </div>

        <div className="studio-mock__canvas">
          <Cursor />

          <motion.div {...flierIn(0.8)} style={{ marginTop: 26 }}>
            <div className="mini-flier mini-flier--emergence mini-flier--selected">
              <span className="mini-flier__label">emergence / classic</span>
              <div className="mf-kicker">Emerge · 2026</div>
              <div className="mf-title">
                EMERG
                <br />
                ENCE
              </div>
              <p className="mf-sub">A conference on systems, motion and the shape of what comes next.</p>
              <span className="mf-chip">REGISTER FREE</span>
              <span className="mf-orb" />
            </div>
          </motion.div>

          <motion.div {...flierIn(1.0)}>
            <div className="mini-flier mini-flier--orbit">
              <div className="mf-brand">
                <i />
                Orbit Gadgets
              </div>
              <div className="mf-title">
                Flagship,
                <br />
                unboxed.
              </div>
              <div className="mf-price">FROM $649</div>
              <img src="/assets/orbit-gadgets/phone-coral-cutout.png" alt="" loading="lazy" />
            </div>
          </motion.div>

          <motion.div {...flierIn(1.2)} style={{ marginTop: 48 }}>
            <div className="mini-flier mini-flier--quote">
              <div className="mf-mark">“</div>
              <p className="mf-quote">The mind can go anywhere it is trained to return from.</p>
              <div className="mf-author">Royal Prince</div>
            </div>
          </motion.div>
        </div>

        <div className="studio-mock__inspector">
          <h5>Layers</h5>
          <div className="studio-mock__layer studio-mock__layer--active">
            <Layers size={12} />
            emergence-classic
          </div>
          <div className="studio-mock__layer">
            <Layers size={12} />
            flagship-tray
          </div>
          <div className="studio-mock__layer">
            <Layers size={12} />
            mind-can-go
          </div>
          <h5 style={{ marginTop: 20 }}>Export</h5>
          <div className="studio-mock__layer">PNG · 3× HD</div>
          <div className="studio-mock__exportBtn">
            <Download size={13} />
            Download
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section className="landing-hero">
      <div className="landing-wrap landing-hero__inner">
        <motion.span
          className="landing-hero__badge"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <Sparkles size={14} />
          The design studio for social fliers
        </motion.span>

        <motion.h1
          className="landing-hero__title"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
        >
          Start with a template. <em>Make it yours.</em>
        </motion.h1>

        <motion.p
          className="landing-hero__copy"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
        >
          Thousands of layouts ready — change the words, photos, and colors.
          No design degree required.
        </motion.p>

        <motion.div
          className="landing-hero__ctas"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
        >
          <Link to="/templates" className="l-btn l-btn--primary">
            Open the Studio
          </Link>
          <Link to="/templates" className="l-btn l-btn--ghost">
            Browse templates
          </Link>
        </motion.div>

        <motion.p
          className="landing-hero__hint"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
        >
          Sign in with Google · Export with <code>Ctrl + E</code>
        </motion.p>

        <StudioMock />
      </div>
    </section>
  )
}
