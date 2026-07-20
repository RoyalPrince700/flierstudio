import { Radio } from 'lucide-react'
import { radioshow } from '../tokens'
import './radioshow-shared.css'

/** Shared brand mark + wordmark for Signal Room demo. */
export function RadioBrand({ ink = 'light' }) {
  const d = radioshow.demo
  const color = ink === 'light' ? radioshow.colors.white : radioshow.colors.black

  return (
    <div className="rs__brand" style={{ color }}>
      <span className="rs__brand-mark" aria-hidden>
        <Radio size={36} strokeWidth={2.5} />
      </span>
      <span className="rs__brand-name">{d.brand}</span>
    </div>
  )
}

/** Orange listen CTA used across all radioshow templates. */
export function RadioCta({
  label = radioshow.demo.cta,
  shadow = true,
  tone = 'orange',
}) {
  const bg =
    tone === 'green' ? radioshow.colors.green : radioshow.colors.orange

  return (
    <span
      className={`rs__cta${shadow ? ' rs__cta--shadow' : ''}`}
      style={{ background: bg }}
    >
      {label}
    </span>
  )
}

export function rsVars(extra = {}) {
  const t = radioshow
  return {
    width: t.size.width,
    height: t.size.height,
    '--rs-blue': t.colors.blue,
    '--rs-orange': t.colors.orange,
    '--rs-green': t.colors.green,
    '--rs-black': t.colors.black,
    '--rs-white': t.colors.white,
    '--rs-display': t.fonts.display,
    '--rs-body': t.fonts.body,
    '--rs-ui': t.fonts.ui,
    '--rs-safe': `${t.spacing.safe}px`,
    '--rs-radius': `${t.spacing.radius}px`,
    '--rs-shadow': `${t.spacing.shadow}px`,
    ...extra,
  }
}
