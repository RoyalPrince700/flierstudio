import EditableImageSlot from '../../components/studio/EditableImageSlot'
import EditableText from '../../components/studio/EditableText'
import { editableTextProps } from '../../components/studio/editableTextProps'
import { prayerChain as t } from '../../samples/prayer-chain/tokens'
import './prayer-chain.css'

/**
 * GraceLife Church — Prayer Chain
 * Intent: What’s the GraceLife Prayer Chain fasting season and when is it?
 * Guide: frontend/prayerchaindesignguide.md
 */
export default function PrayerChainFlier({
  logoSrc = t.assets.logo,
  chainSrc = t.assets.chain,
  citySrc = t.assets.city,
  glowSrc = t.assets.glow,
  line1 = 'Prayer',
  line2 = 'Chain',
  support = '30 days fasting and prayer',
  date = '22nd to 31st of August 2026',
  width = t.size.width,
  height = t.size.height,
  studioEdit,
}) {
  const editable = Boolean(studioEdit?.enabled)

  return (
    <article
      className="pc-flier"
      style={{
        width,
        height,
        '--pc-core': t.colors.core,
        '--pc-glow-mid': t.colors.glowMid,
        '--pc-field': t.colors.field,
        '--pc-field-deep': t.colors.fieldDeep,
        '--pc-ink': t.colors.ink,
        '--pc-ink-soft': t.colors.inkSoft,
        '--pc-sheen': t.colors.sheen,
        '--pc-map-yellow': t.colors.mapYellow,
        '--pc-map-warm': t.colors.mapWarm,
        '--pc-shadow-cool': t.colors.shadowCool,
        '--pc-highlight-warm': t.colors.highlightWarm,
        '--pc-display': t.fonts.display,
        '--pc-support': t.fonts.support,
        '--pc-display-size': `${t.type.displaySize}px`,
        '--pc-support-size': `${t.type.supportSize}px`,
        '--pc-date-size': `${t.type.dateSize}px`,
        '--pc-safe': `${t.spacing.safe}px`,
        '--pc-grain': t.effects.grainOpacity,
        '--pc-city-opacity': t.effects.cityOpacity,
        '--pc-glow-blur': `${t.effects.glowBlur}px`,
        '--pc-chain-blur': `${t.effects.chainBlur}px`,
      }}
    >
      {/* z-0 Base radial field */}
      <div className="pc-flier__base" aria-hidden />

      {/* z-1 City plate */}
      <div className="pc-flier__city" aria-hidden>
        <EditableImageSlot
          path="citySrc"
          editable={editable}
          focused={studioEdit?.focusedPath === 'citySrc'}
          hasImage={Boolean(citySrc)}
          onFocusField={studioEdit?.onFocusField}
          onPickImage={studioEdit?.onPickImage}
          onClearImage={studioEdit?.onClearImage}
          imageFits={studioEdit?.imageFits}
          onImageFitChange={studioEdit?.onImageFitChange}
          emptyHint="Add city"
          filledHint="Select"
        >
          <img className="pc-flier__city-img" src={citySrc} alt="" draggable={false} />
        </EditableImageSlot>
      </div>

      {/* z-2 Soft chains (DOF) */}
      <div className="pc-flier__chains pc-flier__chains--soft" aria-hidden>
        <img
          className="pc-flier__chain pc-flier__chain--bl"
          src={chainSrc}
          alt=""
          draggable={false}
        />
        <img
          className="pc-flier__chain pc-flier__chain--br"
          src={chainSrc}
          alt=""
          draggable={false}
        />
      </div>

      {/* z-3 Hero chain */}
      <div className="pc-flier__chains pc-flier__chains--hero" aria-hidden>
        <img
          className="pc-flier__chain pc-flier__chain--tr"
          src={chainSrc}
          alt=""
          draggable={false}
        />
      </div>

      {/* z-4 Yellow abstract glow */}
      <div className="pc-flier__glow" aria-hidden>
        <img className="pc-flier__glow-img" src={glowSrc} alt="" draggable={false} />
        <div className="pc-flier__glow-blob pc-flier__glow-blob--top" />
        <div className="pc-flier__glow-blob pc-flier__glow-blob--bottom" />
      </div>

      {/* z-5 Soft-light gradient maps */}
      <div className="pc-flier__map pc-flier__map--yellow" aria-hidden />
      <div className="pc-flier__map pc-flier__map--warm" aria-hidden />

      {/* z-6 Content */}
      <div className="pc-flier__content">
        <div className="pc-flier__logo-wrap">
          <EditableImageSlot
            path="logoSrc"
            editable={editable}
            focused={studioEdit?.focusedPath === 'logoSrc'}
            hasImage={Boolean(logoSrc)}
            onFocusField={studioEdit?.onFocusField}
            onPickImage={studioEdit?.onPickImage}
            onClearImage={studioEdit?.onClearImage}
            enableFit={false}
            emptyHint="Add logo"
            filledHint="Select"
            className="pc-flier__logo-slot"
          >
            <div
              className="pc-flier__logo"
              style={{
                WebkitMaskImage: `url(${logoSrc})`,
                maskImage: `url(${logoSrc})`,
              }}
              role="img"
              aria-label="GraceLife Church"
            />
          </EditableImageSlot>
        </div>

        <h1 className="pc-flier__title">
          <span className="pc-flier__display-line">
            <EditableText
              as="span"
              value={line1}
              {...editableTextProps(studioEdit, 'line1')}
            />
            <span className="pc-flier__sheen" aria-hidden />
          </span>
          <span className="pc-flier__display-line">
            <EditableText
              as="span"
              value={line2}
              {...editableTextProps(studioEdit, 'line2')}
            />
            <span className="pc-flier__sheen pc-flier__sheen--b" aria-hidden />
          </span>
        </h1>

        <p className="pc-flier__support">
          <EditableText
            as="span"
            value={support}
            {...editableTextProps(studioEdit, 'support')}
          />
        </p>

        <p className="pc-flier__date">
          <EditableText
            as="span"
            value={date}
            {...editableTextProps(studioEdit, 'date')}
          />
        </p>
      </div>

      {/* z-7 Grain */}
      <div className="pc-flier__grain" aria-hidden />

      {/* z-8 Global grade + color balance */}
      <div className="pc-flier__grade" aria-hidden />
      <div className="pc-flier__balance pc-flier__balance--shadow" aria-hidden />
      <div className="pc-flier__balance pc-flier__balance--highlight" aria-hidden />
    </article>
  )
}
