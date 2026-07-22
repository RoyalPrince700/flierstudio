import EditableText from '../../../components/studio/EditableText'
import { editableTextProps } from '../../../components/studio/editableTextProps'
import { fsTokens } from '../../../design/flierStudioTokens'
import { LiftoffMark, LogoStacked, Wordmark } from '../FSLogo'
import LandscapeShell from './LandscapeShell'
import './fs-l-boards.css'

const C = fsTokens.colors

/* ------------------------------------------------------------------ */
/* 01 — Cover                                                          */
/* ------------------------------------------------------------------ */
export function LCoverBoard({
  title = 'The Liftoff',
  subtitle = 'Brand Identity System',
  edition = 'Version 1.0 — 2026',
  studioEdit,
}) {
  return (
    <LandscapeShell index="01" chapter="Cover" theme="ink">
      <div className="fl-cover">
        <div className="fl-cover__left">
          <p className="fsl-eyebrow">Case study</p>
          <EditableText
            as="h1"
            className="fsl-display fl-cover__title"
            value={title}
            {...editableTextProps(studioEdit, 'title')}
          />
          <EditableText
            as="p"
            className="fl-cover__sub"
            value={subtitle}
            {...editableTextProps(studioEdit, 'subtitle')}
          />
          <div className="fl-cover__meta">
            <EditableText as="span" value={edition} {...editableTextProps(studioEdit, 'edition')} />
            <span>1600 × 1200 · Editorial</span>
          </div>
        </div>
        <div className="fl-cover__right">
          <LogoStacked markSize={280} base={C.paper} corner={C.signal} text={C.paper} />
        </div>
      </div>
    </LandscapeShell>
  )
}

/* ------------------------------------------------------------------ */
/* 02 — Strategy                                                       */
/* ------------------------------------------------------------------ */
export function LStrategyBoard({
  headline = 'The design studio for social fliers.',
  narrative = 'Flier Studio exists for the moment an idea needs an audience. Start with a ready template — you change the words, photos, and colors; the studio already did the layout thinking — composition, hierarchy, rhythm — so every post leaves looking like it came from a design team.',
  purpose = 'Give anyone with something to announce the layout intelligence of a working design studio.',
  positioning = 'A template-first creative studio in the browser — ready layouts with craft built in. Designers move faster; everyone else creates without knowing design principles.',
  audience = 'Creators, event teams, and small brands worldwide who publish to social — designers who need speed, and non-designers who just need a flier up.',
  studioEdit,
}) {
  return (
    <LandscapeShell index="02" chapter="Strategy">
      <div className="fl-strat">
        <div className="fl-strat__main">
          <p className="fsl-eyebrow">Purpose · Positioning · Personality</p>
          <EditableText
            as="h1"
            className="fsl-display fl-strat__headline"
            value={headline}
            {...editableTextProps(studioEdit, 'headline')}
          />
          <EditableText
            as="p"
            className="fsl-copy fl-strat__narrative"
            value={narrative}
            {...editableTextProps(studioEdit, 'narrative')}
          />
          <div className="fl-strat__traits">
            <p className="fsl-label">Personality</p>
            <div className="fl-strat__trait-row">
              {['Precise', 'Confident', 'Craft-first', 'Quietly bold', 'Global'].map((t) => (
                <span key={t} className="fl-strat__trait">
                  {t}
                </span>
              ))}
            </div>
            <p className="fsl-label" style={{ marginTop: 22 }}>
              Values
            </p>
            <div className="fl-strat__trait-row">
              {['Craft over clutter', 'Clarity wins attention', 'Access to good design', 'Momentum'].map(
                (t) => (
                  <span key={t} className="fl-strat__trait fl-strat__trait--ghost">
                    {t}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
        <aside className="fl-strat__side">
          {[
            ['Purpose', 'purpose', purpose],
            ['Positioning', 'positioning', positioning],
            ['Audience', 'audience', audience],
          ].map(([label, path, value]) => (
            <div key={path} className="fl-strat__cell">
              <p className="fsl-label">{label}</p>
              <EditableText
                as="p"
                className="fl-strat__cell-copy"
                value={value}
                {...editableTextProps(studioEdit, path)}
              />
            </div>
          ))}
        </aside>
      </div>
    </LandscapeShell>
  )
}

/* ------------------------------------------------------------------ */
/* 03 — Logo reveal                                                    */
/* ------------------------------------------------------------------ */
export function LLogoRevealBoard({
  caption = 'The Liftoff — the moment a flier is posted.',
  studioEdit,
}) {
  return (
    <LandscapeShell index="03" chapter="Logo" theme="ink">
      <div className="fl-reveal">
        <div className="fl-reveal__mark">
          <LiftoffMark size={520} base={C.paper} corner={C.signal} />
        </div>
        <div className="fl-reveal__copy">
          <Wordmark size={72} color={C.paper} />
          <EditableText
            as="p"
            className="fl-reveal__caption"
            value={caption}
            {...editableTextProps(studioEdit, 'caption')}
          />
        </div>
      </div>
    </LandscapeShell>
  )
}

/* ------------------------------------------------------------------ */
/* 16 — Closing overview                                               */
/* ------------------------------------------------------------------ */
export function LOverviewBoard({
  headline = 'Designed to be posted.',
  support = 'One mark, two typefaces, one signal color — a system built to survive feeds, favicons, decks, and print without losing its voice.',
  contact = 'brand@flierstudio.design',
  studioEdit,
}) {
  return (
    <LandscapeShell index="16" chapter="Overview" theme="ink">
      <div className="fl-over">
        <div className="fl-over__mark">
          <LogoStacked markSize={220} base={C.paper} corner={C.signal} text={C.paper} />
        </div>
        <div className="fl-over__copy">
          <EditableText
            as="h1"
            className="fsl-display fl-over__headline"
            value={headline}
            {...editableTextProps(studioEdit, 'headline')}
          />
          <EditableText
            as="p"
            className="fsl-copy fl-over__support"
            value={support}
            {...editableTextProps(studioEdit, 'support')}
          />
          <div className="fl-over__swatches">
            {[C.signal, C.cobalt, C.paper, C.graphite].map((hex) => (
              <span key={hex} className="fl-over__swatch" style={{ background: hex }} />
            ))}
          </div>
          <div className="fl-over__meta">
            <span className="fsl-label">Identity system V1.0 · Editorial</span>
            <EditableText
              as="span"
              className="fl-over__contact"
              value={contact}
              {...editableTextProps(studioEdit, 'contact')}
            />
          </div>
        </div>
      </div>
    </LandscapeShell>
  )
}
