import { AtSign, MessageCircle, Phone } from 'lucide-react'
import { ImagePlaceholder, LogoPlaceholder } from '../../components/placeholders'
import EditableText from '../../components/studio/EditableText'
import { editableTextProps } from '../../components/studio/editableTextProps'
import './flagship-tray.css'

const BURST_ITEMS = [
  { top: 40, left: 80, width: 220, aspect: '16 / 10', label: 'Laptop' },
  { top: 70, right: 70, width: 170, aspect: '9 / 16', label: 'Phone' },
  { top: 220, left: 40, width: 150, aspect: '1 / 1', label: 'Watch' },
  { top: 220, right: 40, width: 190, aspect: '4 / 3', label: 'Console' },
  { top: 370, left: 190, width: 170, aspect: '9 / 16', label: 'Phone' },
  { top: 350, right: 150, width: 210, aspect: '16 / 10', label: 'Tablet' },
]

/**
 * Orbit Gadgets — Gadget Burst flier
 * Intent: show a premium cluster of dream gadgets and invite you to clear your wishlist at Orbit.
 */
export default function OrbitGadgetBurstFlier({
  brandLine1 = 'Orbit',
  brandLine2 = 'Gadgets',
  meta = 'Flagships · Consoles · Accessories',
  headline = 'The wishlist\ncan finally rest.',
  support = 'Stack your dream devices in one place — pay in calm, not chaos.',
  badge = 'Orbit pick',
  cta = 'Shop Orbit',
  phone = '+234 000 000 0000',
  handle = '@orbit_gadgets',
  studioEdit,
}) {
  return (
    <article className="og-burst">
      <div className="og-tray__safe">
        <header className="og-tray__header og-burst__header">
          <div className="og-tray__brand">
            <LogoPlaceholder
              mark="OG"
              width={64}
              height={64}
              style={{
                '--ph-surface': '#111319',
                '--ph-ink': '#fff',
                '--ph-border': '1px solid rgba(123, 177, 255, 0.7)',
                '--ph-blur': 'none',
              }}
            />
            <div className="og-tray__brand-text">
              <EditableText as="span" value={brandLine1} {...editableTextProps(studioEdit, 'brandLine1')} />
              <EditableText as="span" value={brandLine2} {...editableTextProps(studioEdit, 'brandLine2')} />
            </div>
          </div>
          <p className="og-tray__address og-burst__meta">
            <EditableText as="span" value={meta} {...editableTextProps(studioEdit, 'meta')} />
          </p>
        </header>

        <div className="og-burst__headline-block">
          <EditableText
            as="h1"
            className="og-burst__headline"
            value={headline}
            {...editableTextProps(studioEdit, 'headline')}
          />
          <EditableText
            as="p"
            className="og-burst__support"
            value={support}
            {...editableTextProps(studioEdit, 'support')}
          />
        </div>

        <div className="og-burst__stage">
          <div className="og-burst__cluster">
            <span className="og-burst__badge">
              <EditableText as="span" value={badge} {...editableTextProps(studioEdit, 'badge')} />
              <small>PREMIUM</small>
            </span>
            {BURST_ITEMS.map((item) => (
              <div
                key={`${item.label}-${item.top}-${item.left ?? item.right}`}
                className="og-burst__item"
                style={{
                  top: item.top,
                  left: item.left,
                  right: item.right,
                }}
              >
                <ImagePlaceholder
                  label={item.label}
                  width={item.width}
                  aspect={item.aspect}
                  radius={18}
                  showLabel={false}
                  style={{
                    '--ph-surface': 'linear-gradient(155deg,#181d26,#080a0e)',
                    '--ph-border': '1px solid rgba(123, 177, 255, 0.55)',
                    '--ph-ink': 'rgba(230,236,255,0.8)',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <footer className="og-tray__footer-dock og-burst__footer">
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
