import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { childUp, fadeUp, staggerChildren, viewportOnce } from '../motion'

const COLLECTIONS = [
  {
    id: 'glass-stack',
    name: 'Glass Stack',
    desc: 'Frosted layers & depth',
    bg: 'linear-gradient(150deg, #16102e 0%, #7b5cff 160%)',
  },
  {
    id: 'malik-gadget',
    name: 'Malik Gadget',
    desc: 'Retail product energy',
    bg: 'linear-gradient(150deg, #101725 0%, #0b5fff 170%)',
  },
  {
    id: 'radioshow',
    name: 'Radio Show',
    desc: 'On-air promo kits',
    bg: 'linear-gradient(150deg, #0c1330 0%, #2f6dff 160%)',
  },
  {
    id: 'void-profile-ask',
    name: 'Void Profile',
    desc: 'Minimal quote posters',
    bg: 'linear-gradient(165deg, #1c1c1c 0%, #060606 100%)',
  },
]

export default function FeatureTemplates() {
  return (
    <section className="landing-section" id="templates">
      <div className="landing-wrap">
        <motion.div
          className="samples-head"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <p className="landing-eyebrow">Template library</p>
          <h2 className="landing-h2">Start from a layout, not a blank page</h2>
          <p className="landing-lead">
            Curated template collections with proven type, color, and spacing.
            Pick one, open it in the studio, and start editing immediately.
          </p>
        </motion.div>

        <motion.div
          className="samples-grid"
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {COLLECTIONS.map((collection) => (
            <motion.div
              key={collection.id}
              variants={childUp}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              <Link to="/templates" className="sample-card" style={{ display: 'block' }}>
                <div className="sample-card__preview" style={{ background: collection.bg }}>
                  <b>{collection.name.toUpperCase()}</b>
                </div>
                <div className="sample-card__meta">
                  <div>
                    <h4>{collection.name}</h4>
                    <p>{collection.desc}</p>
                  </div>
                  <ArrowRight size={17} />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
