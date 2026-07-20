import {
  LogoPlaceholder,
  PortraitPlaceholder,
} from '../../components/placeholders'
import { glassStack } from './tokens'
import './glass-stack.css'

/**
 * Demo recreation for sample `glass-stack`.
 * Generic copy + placeholders — apply PRINCIPLES.md to real brand work.
 */
export default function GlassStackSample({
  brandName = 'Northline',
  eyebrow = 'Annual Gathering',
  headline = 'Anniversary Summit',
  support = 'A night of ideas, makers, and the people building what comes next.',
  date = '18 Oct 2026',
  time = '6:00 PM',
  place = 'Harbor Hall',
  cta = 'Reserve your seat',
  speakers = [
    { name: 'Alex Rivera', title: 'Keynote' },
    { name: 'Jordan Lee', title: 'Product' },
    { name: 'Sam Okoye', title: 'Design' },
  ],
  width = glassStack.size.width,
  height = glassStack.size.height,
}) {
  const t = glassStack

  return (
    <article
      className="sample-glass"
      style={{
        width,
        height,
        '--gs-bg-top': t.colors.bgTop,
        '--gs-bg-bottom': t.colors.bgBottom,
        '--gs-glow': t.colors.glow,
        '--gs-glow-alt': t.colors.glowAlt,
        '--gs-glass': t.colors.glass,
        '--gs-glass-border': t.colors.glassBorder,
        '--gs-ink': t.colors.ink,
        '--gs-muted': t.colors.muted,
        '--gs-accent': t.colors.accent,
        '--gs-accent-soft': t.colors.accentSoft,
        '--gs-display': t.fonts.display,
        '--gs-body': t.fonts.body,
        '--gs-safe': `${t.spacing.safe}px`,
        '--gs-radius': `${t.spacing.radius}px`,
        '--gs-blur': t.effects.blur,
        '--gs-shadow': t.effects.shadow,
      }}
    >
      <div className="sample-glass__safe">
        <header className="sample-glass__top">
          <LogoPlaceholder mark="NL" width={64} height={64} />
          <p className="sample-glass__brand">{brandName}</p>
        </header>

        <div>
          <p className="sample-glass__eyebrow">{eyebrow}</p>
          <h1 className="sample-glass__headline">{headline}</h1>
          <p className="sample-glass__support">{support}</p>
        </div>

        <div className="sample-glass__panel">
          <div className="sample-glass__meta">
            <div className="sample-glass__meta-item">
              <span className="sample-glass__meta-label">Date</span>
              <p className="sample-glass__meta-value">{date}</p>
            </div>
            <div className="sample-glass__meta-item">
              <span className="sample-glass__meta-label">Time</span>
              <p className="sample-glass__meta-value">{time}</p>
            </div>
            <div className="sample-glass__meta-item">
              <span className="sample-glass__meta-label">Place</span>
              <p className="sample-glass__meta-value">{place}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="sample-glass__speakers-label">Featured voices</p>
          <div className="sample-glass__speakers">
            {speakers.map((speaker) => (
              <PortraitPlaceholder
                key={speaker.name}
                name={speaker.name}
                title={speaker.title}
                size="md"
                width={280}
                shape="rounded"
                variant="glass"
                accent={t.colors.accent}
                ink={t.colors.ink}
              />
            ))}
          </div>
        </div>

        <div className="sample-glass__spacer" />

        <footer className="sample-glass__cta">{cta}</footer>
      </div>
    </article>
  )
}
