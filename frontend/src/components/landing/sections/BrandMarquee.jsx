import { motion } from 'framer-motion'

const BRANDS = [
  { name: 'Emergence', color: '#3A8DFF' },
  { name: 'Smipay', color: '#00C2A8' },
  { name: 'Femtech', color: '#FF5C8A' },
  { name: 'Orbit Gadgets', color: '#0b5fff' },
  { name: 'OxygenFM', color: '#2f6dff' },
  { name: 'Royal Prince', color: '#d8d8d8' },
  { name: 'Starter', color: '#E8FF47' },
]

export default function BrandMarquee() {
  const row = [...BRANDS, ...BRANDS]

  return (
    <section className="brand-marquee">
      <p className="brand-marquee__label">Brand boards already living in the studio</p>
      <div className="brand-marquee__viewport">
        <motion.div
          className="brand-marquee__track"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 26, ease: 'linear', repeat: Infinity }}
        >
          {row.map((brand, i) => (
            <span className="brand-chip" key={`${brand.name}-${i}`}>
              <i style={{ background: brand.color }} />
              {brand.name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
