import { tokens } from '../../design/tokens'
import { DEFAULT_BRAND_LOGO_SRC } from '../../design/defaultBrandLogo'
import EditableImageSlot from '../../components/studio/EditableImageSlot'
import EditableText from '../../components/studio/EditableText'
import { editableTextProps } from '../../components/studio/editableTextProps'
import './instagram-post.css'

/**
 * Starter Instagram Post flier (1080×1080).
 * Drop brand assets into /public/assets and wire them here when ready.
 */
export default function InstagramPostFlier({
  brandName = tokens.brand.name,
  headline = 'Something Worth Showing Up For',
  support = 'Swap this copy, colors, and imagery when you send the reference flier and assets.',
  cta = 'Save the Date',
  meta = 'Instagram · 1080×1080',
  width = 1080,
  height = 1080,
  backgroundImage = '/assets/placeholder-bg.svg',
  logoSrc = DEFAULT_BRAND_LOGO_SRC,
  fonts,
  studioEdit,
}) {
  const display = fonts?.display || tokens.fonts.display
  const body = fonts?.body || tokens.fonts.body

  return (
    <article
      className="ig-post"
      style={{
        width,
        height,
        '--flier-bg': tokens.colors.bg,
        '--flier-ink': tokens.colors.ink,
        '--flier-muted': tokens.colors.muted,
        '--flier-accent': tokens.colors.accent,
        '--flier-accent-alt': tokens.colors.accentAlt,
        '--flier-display': display,
        '--flier-body': body,
        '--flier-safe': `${tokens.spacing.safe}px`,
        backgroundImage: `linear-gradient(160deg, rgba(16, 24, 32, 0.82) 0%, rgba(16, 24, 32, 0.55) 45%, rgba(16, 24, 32, 0.88) 100%), url(${backgroundImage})`,
      }}
    >
      <header className="ig-post__header">
        <EditableImageSlot
          path="logoSrc"
          editable={Boolean(studioEdit?.enabled)}
          focused={studioEdit?.focusedPath === 'logoSrc'}
          hasImage={Boolean(logoSrc)}
          onFocusField={studioEdit?.onFocusField}
          onPickImage={studioEdit?.onPickImage}
          onClearImage={studioEdit?.onClearImage}
          imageFits={studioEdit?.imageFits}
          onImageFitChange={studioEdit?.onImageFitChange}
          enableFit={false}
        >
          <img className="ig-post__logo" src={logoSrc} alt="" />
        </EditableImageSlot>
        <EditableText
          as="p"
          className="ig-post__brand"
          value={brandName}
          {...editableTextProps(studioEdit, 'brandName')}
        />
      </header>

      <div className="ig-post__body">
        <EditableText
          as="p"
          className="ig-post__meta"
          value={meta}
          {...editableTextProps(studioEdit, 'meta')}
        />
        <EditableText
          as="h1"
          className="ig-post__headline"
          value={headline}
          {...editableTextProps(studioEdit, 'headline')}
        />
        <EditableText
          as="p"
          className="ig-post__support"
          value={support}
          {...editableTextProps(studioEdit, 'support')}
        />
      </div>

      <footer className="ig-post__footer">
        <EditableText
          as="span"
          className="ig-post__cta"
          value={cta}
          {...editableTextProps(studioEdit, 'cta')}
        />
      </footer>
    </article>
  )
}
