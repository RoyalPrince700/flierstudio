import { AtSign, MapPin, MessageCircle, Phone } from 'lucide-react'
import { ImagePlaceholder, LogoPlaceholder } from '../../components/placeholders'
import EditableImageSlot from '../../components/studio/EditableImageSlot'
import EditableText from '../../components/studio/EditableText'
import { editableTextProps } from '../../components/studio/editableTextProps'
import './flagship-tray.css'

/**
 * Orbit Gadgets — Pocket Split flier
 * Intent: convince you that your everyday pocket setup deserves an Orbit upgrade.
 */
export default function OrbitPocketSplitFlier({
  brandLine1 = 'Orbit',
  brandLine2 = 'Gadgets',
  address = 'Unit 12 · Market Plaza · Demo City',
  headline = 'Your pocket\ndeserves better.',
  support = 'Trade in laggy, cracked screens for devices that can actually keep up.',
  badge = 'Everyday upgrade',
  heroSrc = '',
  cta = 'Upgrade today',
  phone = '+234 000 000 0000',
  handle = '@orbit_gadgets',
  studioEdit,
}) {
  const editable = Boolean(studioEdit?.enabled)

  return (
    <article className="og-pocket">
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

        <div className="og-pocket__layout">
          <div className="og-pocket__copy">
            <EditableText
              as="h1"
              className="og-pocket__headline"
              value={headline}
              {...editableTextProps(studioEdit, 'headline')}
            />
            <EditableText
              as="p"
              className="og-pocket__support"
              value={support}
              {...editableTextProps(studioEdit, 'support')}
            />
          </div>

          <div className="og-pocket__media">
            <span className="og-pocket__badge">
              <EditableText as="span" value={badge} {...editableTextProps(studioEdit, 'badge')} />
              <small>★★★</small>
            </span>
            <EditableImageSlot
              path="heroSrc"
              editable={editable}
              focused={studioEdit?.focusedPath === 'heroSrc'}
              hasImage={Boolean(heroSrc)}
              onFocusField={studioEdit?.onFocusField}
              onPickImage={studioEdit?.onPickImage}
            >
              <ImagePlaceholder
                src={heroSrc || undefined}
                label="Pocket lifestyle"
                width={460}
                aspect="4 / 5"
                radius={28}
                style={{
                  '--ph-surface':
                    'linear-gradient(160deg, rgba(16, 37, 98, 0.9), rgba(8, 14, 32, 0.96))',
                  '--ph-border': '1px solid rgba(123, 177, 255, 0.6)',
                  '--ph-ink': 'rgba(215, 227, 255, 0.86)',
                }}
              />
            </EditableImageSlot>
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
