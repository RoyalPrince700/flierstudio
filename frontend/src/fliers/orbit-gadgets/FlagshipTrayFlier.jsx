import { AtSign, MapPin, MessageCircle, Phone } from 'lucide-react'
import { LogoPlaceholder } from '../../components/placeholders'
import EditableText from '../../components/studio/EditableText'
import { editableTextProps } from '../../components/studio/editableTextProps'
import './flagship-tray.css'

const PHONES = [
  {
    src: '/assets/orbit-gadgets/phone-coral-cutout.png',
    chip: 'Aura',
    accent: '#ff7a3d',
    vibe: 'Bold',
    alt: 'Aura coral flagship',
  },
  {
    src: '/assets/orbit-gadgets/phone-titanium-cutout.png',
    chip: 'Nova',
    accent: '#9aa3ad',
    vibe: 'Everyday',
    alt: 'Nova titanium flagship',
  },
  {
    src: '/assets/orbit-gadgets/phone-porcelain-cutout.png',
    chip: 'Pulse',
    accent: '#c5d4e8',
    vibe: 'Minimal',
    alt: 'Pulse porcelain flagship',
  },
]

/** Orbit Gadgets board — sample `malik-gadget-flagship-tray` with generated product shots */
export default function FlagshipTrayFlier({
  brandLine1 = 'Orbit',
  brandLine2 = 'Gadgets',
  address = 'Unit 12 · Market Plaza · Demo City',
  headline = 'Which one fits you?',
  support = 'Every flagship has a different vibe.',
  cta = 'Shop now',
  phone = '+234 000 000 0000',
  handle = '@orbit_gadgets',
  studioEdit,
}) {
  return (
    <article className="og-tray">
      <div className="og-tray__glow" aria-hidden />
      <div className="og-tray__safe">
        <header className="og-tray__header">
          <div className="og-tray__brand">
            <LogoPlaceholder
              mark="OG"
              width={64}
              height={64}
              style={{
                '--ph-surface': '#0b5fff',
                '--ph-ink': '#fff',
                '--ph-border': '0',
                '--ph-blur': 'none',
              }}
            />
            <div className="og-tray__brand-text">
              <EditableText as="span" value={brandLine1} {...editableTextProps(studioEdit, 'brandLine1')} />
              <EditableText as="span" value={brandLine2} {...editableTextProps(studioEdit, 'brandLine2')} />
            </div>
          </div>
          <p className="og-tray__address">
            <MapPin size={18} strokeWidth={2.25} />
            <EditableText as="span" value={address} {...editableTextProps(studioEdit, 'address')} />
          </p>
        </header>

        <div className="og-tray__headline">
          <EditableText as="h1" value={headline} {...editableTextProps(studioEdit, 'headline')} />
          <EditableText as="p" value={support} {...editableTextProps(studioEdit, 'support')} />
        </div>

        <div className="og-tray__stage">
          <div className="og-tray__shelf">
            <div className="og-tray__logos">
              {PHONES.map((item) => (
                <span
                  key={item.chip}
                  className="og-tray__logo-chip"
                  style={{ '--chip-accent': item.accent }}
                >
                  {item.chip}
                </span>
              ))}
            </div>
            {PHONES.map((item) => (
              <div key={item.src} className="og-tray__slot">
                <img src={item.src} alt={item.alt} className="og-tray__phone" />
                <span className="og-tray__spec-pill">{item.vibe}</span>
              </div>
            ))}
          </div>
        </div>

        <footer className="og-tray__footer-dock">
          <div className="og-tray__footer-inner">
            <EditableText
              as="span"
              className="og-tray__cta"
              value={cta}
              {...editableTextProps(studioEdit, 'cta')}
            />
            <div className="og-tray__contacts">
              <span className="og-tray__contact">
                <MessageCircle size={18} strokeWidth={2.25} />
                <Phone size={18} strokeWidth={2.25} />
                <EditableText as="span" value={phone} {...editableTextProps(studioEdit, 'phone')} />
              </span>
              <span className="og-tray__contact">
                <AtSign size={18} strokeWidth={2.25} />
                <EditableText as="span" value={handle} {...editableTextProps(studioEdit, 'handle')} />
              </span>
            </div>
          </div>
        </footer>
      </div>
    </article>
  )
}
