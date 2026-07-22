import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { childUp, fadeUp, staggerChildren, viewportOnce } from '../motion'

const CARDS = [
  {
    name: 'EMERGENCE',
    meta: 'Conference · 1080 × 1350',
    bg: 'radial-gradient(120% 100% at 80% 0%, #1e42a3 0%, #0b1e6e 46%, #061433 100%)',
  },
  {
    name: 'ORBIT',
    meta: 'Retail · 1080 × 1080',
    bg: 'linear-gradient(160deg, #0e1526 0%, #0b5fff 140%)',
  },
  {
    name: 'OXYGENFM',
    meta: 'On-air · 1080 × 1350',
    bg: 'linear-gradient(160deg, #0b1230 0%, #2f6dff 150%)',
  },
  {
    name: 'ROYAL',
    meta: 'Quotes · 1080 × 1350',
    bg: 'linear-gradient(180deg, #1b1b1b 0%, #060606 100%)',
  },
  {
    name: 'SMIPAY',
    meta: 'Fintech · 1080 × 1080',
    bg: 'linear-gradient(160deg, #04211d 0%, #00C2A8 170%)',
  },
  {
    name: 'TESTMANCER',
    meta: 'QA · 1080 × 1350',
    bg: 'linear-gradient(160deg, #12081f 0%, #7B5CFF 180%)',
  },
]

export default function FeatureBoards() {
  return (
    <section className="landing-section" id="boards">
      <div className="landing-wrap landing-section__grid">
        <motion.div
          className="landing-section__copy"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <p className="landing-eyebrow">Project boards</p>
          <h2 className="landing-h2">Every brand gets its own board</h2>
          <p className="landing-lead">
            Emergence, Orbit Gadgets, OxygenFM — each brand lives on an infinite
            canvas with its own colors, type and templates. Switch tabs, never
            mix identities.
          </p>
          <ul className="landing-feature-list">
            <li>
              <Check size={17} strokeWidth={2.6} />
              <span>
                <strong>Native export sizes.</strong> Artboards are designed at
                true Instagram pixels — post, portrait and story.
              </span>
            </li>
            <li>
              <Check size={17} strokeWidth={2.6} />
              <span>
                <strong>Figma-style canvas.</strong> Pan, zoom and fit-to-screen
                with keyboard shortcuts you already know.
              </span>
            </li>
            <li>
              <Check size={17} strokeWidth={2.6} />
              <span>
                <strong>Drafts saved locally.</strong> Every artboard remembers
                your edits, per project, automatically.
              </span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          className="boards-visual"
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div className="boards-visual__tabs" variants={childUp}>
            <span className="boards-visual__tab boards-visual__tab--active">
              <i style={{ background: '#3A8DFF' }} />
              Emergence
            </span>
            <span className="boards-visual__tab">
              <i style={{ background: '#0b5fff' }} />
              Orbit
            </span>
            <span className="boards-visual__tab">
              <i style={{ background: '#2f6dff' }} />
              OxygenFM
            </span>
            <span className="boards-visual__tab">
              <i style={{ background: '#00C2A8' }} />
              Smipay
            </span>
          </motion.div>

          <div className="boards-visual__grid">
            {CARDS.map((card) => (
              <motion.div
                key={card.name}
                className="board-card"
                style={{ background: card.bg }}
                variants={childUp}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                <b>{card.name}</b>
                <span>{card.meta}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
