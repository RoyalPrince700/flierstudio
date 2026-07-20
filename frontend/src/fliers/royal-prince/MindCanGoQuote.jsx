import { ArrowUpRight } from 'lucide-react'
import { PortraitPlaceholder } from '../../components/placeholders'
import EditableImageSlot from '../../components/studio/EditableImageSlot'
import EditableText from '../../components/studio/EditableText'
import { editableTextProps } from '../../components/studio/editableTextProps'
import { voidProfileAsk } from '../../samples/void-profile-ask/tokens'
import './mind-can-go-quote.css'

const PHOTO = '/assets/myimages/royalprinceprofile.png'

/**
 * Royal Prince quote — sample `void-profile-ask`
 * Intent: AI gives superpowers — it goes as far as your mind can go.
 */
export default function MindCanGoQuote({
  name = 'Royal Prince',
  roleLead = 'Focus, Vision,',
  roleAccent = 'AI',
  cta = 'AI gives us superpowers.\nHow far will you take it?',
  photoSrc = PHOTO,
  width = 1080,
  height = 1700,
  variant = 'lines-a',
  headline1 = 'AI is',
  headline2Lead = 'as',
  headline2Muted = 'far',
  headline3 = 'your mind can go.',
  useGrayBg = false,
  fonts,
  studioEdit,
}) {
  const t = voidProfileAsk

  const isGroteskVariant =
    variant === 'grotesk-a' ||
    variant === 'grotesk-b' ||
    variant === 'grotesk-c' ||
    variant === 'grotesk-d' ||
    variant === 'grotesk-e'

  const displayFont =
    fonts?.display ||
    (isGroteskVariant
      ? '"Clash Display", "Neue Montreal", "Montserrat", "Syne", "Manrope", "DM Sans", "Segoe UI", sans-serif'
      : variant === 'lines-b'
        ? '"Syne", "Avenir Next", sans-serif'
        : variant === 'lines-c'
          ? '"DM Sans", "Segoe UI", sans-serif'
          : t.fonts.display)

  const bodyFont =
    fonts?.body ||
    (isGroteskVariant
      ? '"Neue Montreal", "Montserrat", "Manrope", "DM Sans", "Segoe UI", sans-serif'
      : variant === 'lines-c'
        ? '"DM Sans", "Segoe UI", sans-serif'
        : t.fonts.body)

  const background = useGrayBg
    ? 'radial-gradient(circle at 10% 0%, #f5f5f7 0%, #e0e0e6 42%, #c8c8d2 70%, #b0b0bc 100%)'
    : t.colors.bg

  const ink = useGrayBg ? '#111111' : t.colors.ink
  const muted = useGrayBg ? '#5c5c66' : t.colors.muted
  const circleLight = useGrayBg ? '#ffffff' : t.colors.circleLight
  const circleDark = useGrayBg ? '#8b8b96' : t.colors.circleDark
  const ctaColor = useGrayBg ? '#22222a' : '#d6d6d6'
  const circleBorder = useGrayBg ? '1px solid rgba(0, 0, 0, 0.08)' : 'none'
  const editable = Boolean(studioEdit?.enabled)

  return (
    <article
      className={`rp-quote rp-quote--${variant}`}
      style={{
        width,
        height,
        '--rp-bg': background,
        '--rp-ink': ink,
        '--rp-muted': muted,
        '--rp-accent-word': t.colors.accentWord,
        '--rp-circle-light': circleLight,
        '--rp-circle-dark': circleDark,
        '--rp-circle-border': circleBorder,
        '--rp-cta': ctaColor,
        '--rp-ring': t.colors.ring,
        '--rp-ring-outer': t.colors.ringOuter,
        '--rp-display': displayFont,
        '--rp-body': bodyFont,
        '--rp-safe-x': `${t.spacing.safeX}px`,
        '--rp-safe-y': `${t.spacing.safeY}px`,
        '--rp-avatar': `${t.spacing.avatar}px`,
        '--rp-circle': `${t.spacing.circle}px`,
        '--rp-gap-header': `${t.spacing.gapHeader}px`,
        '--rp-gap-footer': `${t.spacing.gapFooter}px`,
      }}
    >
      <div className="rp-quote__safe">
        <header className="rp-quote__header">
          <div className="rp-quote__avatar">
            <span className="rp-quote__avatar-ring" aria-hidden />
            <EditableImageSlot
              path="photoSrc"
              editable={editable}
              focused={studioEdit?.focusedPath === 'photoSrc'}
              hasImage={Boolean(photoSrc)}
              onFocusField={studioEdit?.onFocusField}
              onPickImage={studioEdit?.onPickImage}
            >
              <PortraitPlaceholder
                src={photoSrc}
                alt={name}
                size="sm"
                width={t.spacing.avatar}
                aspect="1 / 1"
                shape="circle"
                variant="flat"
                accent={t.colors.mutedSoft}
                ink={t.colors.ink}
              />
            </EditableImageSlot>
          </div>
          <div className="rp-quote__identity">
            <EditableText
              as="p"
              className="rp-quote__name"
              value={name}
              {...editableTextProps(studioEdit, 'name')}
            />
            <p className="rp-quote__role">
              <EditableText as="span" value={roleLead} {...editableTextProps(studioEdit, 'roleLead')} />{' '}
              <EditableText
                as="span"
                className="rp-quote__role-accent"
                value={roleAccent}
                {...editableTextProps(studioEdit, 'roleAccent')}
              />
            </p>
          </div>
        </header>

        <div className="rp-quote__spacer-top" />

        <h1 className="rp-quote__ask">
          <EditableText
            as="span"
            className="rp-quote__ask-line"
            value={headline1}
            {...editableTextProps(studioEdit, 'headline1')}
          />
          <span className="rp-quote__ask-line">
            <EditableText as="span" value={headline2Lead} {...editableTextProps(studioEdit, 'headline2Lead')} />{' '}
            <EditableText
              as="span"
              className="rp-quote__ask-muted"
              value={headline2Muted}
              {...editableTextProps(studioEdit, 'headline2Muted')}
            />
          </span>
          <EditableText
            as="span"
            className="rp-quote__ask-line"
            value={headline3}
            {...editableTextProps(studioEdit, 'headline3')}
          />
        </h1>

        <div className="rp-quote__spacer-bottom" />

        <footer className="rp-quote__footer">
          <EditableText
            as="p"
            className="rp-quote__cta-copy"
            value={cta}
            {...editableTextProps(studioEdit, 'cta')}
          />
          <div className="rp-quote__circles" aria-hidden>
            <span className="rp-quote__circle rp-quote__circle--light" />
            <span className="rp-quote__circle rp-quote__circle--dark">
              <ArrowUpRight className="rp-quote__circle-icon" strokeWidth={2} />
            </span>
          </div>
        </footer>
      </div>
    </article>
  )
}
