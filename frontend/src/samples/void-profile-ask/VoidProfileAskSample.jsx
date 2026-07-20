import { ArrowUpRight } from 'lucide-react'
import { PortraitPlaceholder } from '../../components/placeholders'
import { voidProfileAsk } from './tokens'
import './void-profile-ask.css'

/**
 * Demo recreation for sample `void-profile-ask`.
 * Generic copy + placeholders — apply PRINCIPLES.md to real brand work.
 */
export default function VoidProfileAskSample({
  name = 'Morgan Vale',
  roleLead = 'Specialist in',
  roleAccent = 'digital design',
  askLine1 = 'Want',
  askLine2Lead = 'a',
  askLine2Muted = 'project',
  askLine3 = 'like this?',
  cta = 'Request your quote\nvia the link in bio.',
  width = voidProfileAsk.size.width,
  height = voidProfileAsk.size.height,
}) {
  const t = voidProfileAsk

  return (
    <article
      className="sample-vpa"
      style={{
        width,
        height,
        '--vpa-bg': t.colors.bg,
        '--vpa-ink': t.colors.ink,
        '--vpa-muted': t.colors.muted,
        '--vpa-accent-word': t.colors.accentWord,
        '--vpa-circle-light': t.colors.circleLight,
        '--vpa-circle-dark': t.colors.circleDark,
        '--vpa-ring': t.colors.ring,
        '--vpa-ring-outer': t.colors.ringOuter,
        '--vpa-display': t.fonts.display,
        '--vpa-body': t.fonts.body,
        '--vpa-safe-x': `${t.spacing.safeX}px`,
        '--vpa-safe-y': `${t.spacing.safeY}px`,
        '--vpa-avatar': `${t.spacing.avatar}px`,
        '--vpa-circle': `${t.spacing.circle}px`,
        '--vpa-gap-header': `${t.spacing.gapHeader}px`,
        '--vpa-gap-footer': `${t.spacing.gapFooter}px`,
      }}
    >
      <div className="sample-vpa__safe">
        <header className="sample-vpa__header">
          <div className="sample-vpa__avatar">
            <span className="sample-vpa__avatar-ring" aria-hidden />
            <PortraitPlaceholder
              size="sm"
              width={t.spacing.avatar}
              aspect="1 / 1"
              shape="circle"
              variant="flat"
              accent={t.colors.mutedSoft}
              ink={t.colors.ink}
            />
          </div>
          <div className="sample-vpa__identity">
            <p className="sample-vpa__name">{name}</p>
            <p className="sample-vpa__role">
              {roleLead}{' '}
              <span className="sample-vpa__role-accent">{roleAccent}</span>
            </p>
          </div>
        </header>

        <div className="sample-vpa__spacer-top" />

        <h1 className="sample-vpa__ask">
          <span className="sample-vpa__ask-line">{askLine1}</span>
          <span className="sample-vpa__ask-line">
            {askLine2Lead}{' '}
            <span className="sample-vpa__ask-muted">{askLine2Muted}</span>
          </span>
          <span className="sample-vpa__ask-line">{askLine3}</span>
        </h1>

        <div className="sample-vpa__spacer-bottom" />

        <footer className="sample-vpa__footer">
          <p className="sample-vpa__cta-copy">
            {cta.split('\n').map((line, index, lines) => (
              <span key={line}>
                {line}
                {index < lines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
          <div className="sample-vpa__circles" aria-hidden>
            <span className="sample-vpa__circle sample-vpa__circle--light" />
            <span className="sample-vpa__circle sample-vpa__circle--dark">
              <ArrowUpRight className="sample-vpa__circle-icon" strokeWidth={2} />
            </span>
          </div>
        </footer>
      </div>
    </article>
  )
}
