import { AtSign, MapPin, MessageCircle, Phone } from 'lucide-react'
import { LogoPlaceholder } from '../../../components/placeholders'
import { malikGadget } from '../tokens'
import './malik-shared.css'

/** Shared header + floating CTA dock used across Malik Gadget template variations. */
export function MalikHeader({ ink = 'dark' }) {
  const d = malikGadget.demo
  const addressColor = ink === 'light' ? 'rgba(255,255,255,0.92)' : malikGadget.colors.inkSoft
  const brandColor = ink === 'light' ? '#fff' : malikGadget.colors.ink

  return (
    <header className="mg__header">
      <div className="mg__brand">
        <LogoPlaceholder
          mark={d.mark}
          width={64}
          height={64}
          style={{
            '--ph-surface': malikGadget.colors.brand,
            '--ph-ink': '#fff',
            '--ph-border': '0',
            '--ph-blur': 'none',
          }}
        />
        <p className="mg__brand-name" style={{ color: brandColor }}>
          {d.brand}
        </p>
      </div>
      <p className="mg__address" style={{ '--mg-address': addressColor }}>
        <MapPin size={18} strokeWidth={2.25} />
        <span>{d.address}</span>
      </p>
    </header>
  )
}

export function MalikFooter() {
  const d = malikGadget.demo
  return (
    <footer className="mg__footer-dock">
      <div className="mg__footer-inner">
        <span className="mg__cta">{d.cta}</span>
        <div className="mg__contacts">
          <span className="mg__contact">
            <MessageCircle size={18} strokeWidth={2.25} />
            <Phone size={18} strokeWidth={2.25} />
            {d.phone}
          </span>
          <span className="mg__contact">
            <AtSign size={18} strokeWidth={2.25} />
            {d.handle}
          </span>
        </div>
      </div>
    </footer>
  )
}

export function mgVars(extra = {}) {
  const t = malikGadget
  return {
    width: t.size.width,
    height: t.size.height,
    '--mg-ink': t.colors.ink,
    '--mg-muted': t.colors.muted,
    '--mg-brand': t.colors.brand,
    '--mg-brand-deep': t.colors.brandDeep,
    '--mg-brand-soft': t.colors.brandSoft,
    '--mg-accent': t.colors.accent,
    '--mg-accent-ink': t.colors.accentInk,
    '--mg-pink': t.colors.pink,
    '--mg-footer-frame': t.colors.footerFrame,
    '--mg-display': t.fonts.display,
    '--mg-body': t.fonts.body,
    '--mg-safe': `${t.spacing.safe}px`,
    '--mg-footer-radius': `${t.spacing.footerRadius}px`,
    ...extra,
  }
}
