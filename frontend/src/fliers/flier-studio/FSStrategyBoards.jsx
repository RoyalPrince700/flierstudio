import EditableText from '../../components/studio/EditableText'
import { editableTextProps } from '../../components/studio/editableTextProps'
import { fsTokens } from '../../design/flierStudioTokens'
import BoardShell from './BoardShell'
import { LiftoffMark, LogoStacked, Wordmark } from './FSLogo'
import './fs-boards.css'

const C = fsTokens.colors

/* ------------------------------------------------------------------ */
/* 01 — Brand strategy & positioning                                   */
/* ------------------------------------------------------------------ */
export function FSStrategyBoard({
  headline = 'The design studio for social fliers.',
  narrative = 'Flier Studio exists for the moment an idea needs an audience. Start with a ready template — you change the words, photos, and colors; the studio already did the layout thinking — composition, hierarchy, rhythm — so every post leaves looking like it came from a design team.',
  purpose = 'Give anyone with something to announce the layout intelligence of a working design studio.',
  positioning = 'A template-first creative studio in the browser — ready layouts with craft built in. Designers move faster; everyone else creates without knowing design principles.',
  audience = 'Creators, event teams, and small brands worldwide who publish to social — designers who need speed, and non-designers who just need a flier up.',
  studioEdit,
}) {
  return (
    <BoardShell index="01" chapter="Strategy">
      <div className="fs-strat">
        <p className="fsb-eyebrow">Purpose · Positioning · Personality</p>
        <EditableText
          as="h1"
          className="fsb-display fs-strat__headline"
          value={headline}
          {...editableTextProps(studioEdit, 'headline')}
        />
        <EditableText
          as="p"
          className="fsb-copy fs-strat__narrative"
          value={narrative}
          {...editableTextProps(studioEdit, 'narrative')}
        />
        <div className="fs-strat__grid">
          <div className="fs-strat__cell">
            <p className="fsb-label">Purpose</p>
            <EditableText
              as="p"
              className="fs-strat__cell-copy"
              value={purpose}
              {...editableTextProps(studioEdit, 'purpose')}
            />
          </div>
          <div className="fs-strat__cell">
            <p className="fsb-label">Positioning</p>
            <EditableText
              as="p"
              className="fs-strat__cell-copy"
              value={positioning}
              {...editableTextProps(studioEdit, 'positioning')}
            />
          </div>
          <div className="fs-strat__cell">
            <p className="fsb-label">Audience</p>
            <EditableText
              as="p"
              className="fs-strat__cell-copy"
              value={audience}
              {...editableTextProps(studioEdit, 'audience')}
            />
          </div>
        </div>
        <div className="fs-strat__traits">
          <p className="fsb-label">Personality</p>
          <div className="fs-strat__trait-row">
            {['Precise', 'Confident', 'Craft-first', 'Quietly bold', 'Global'].map((t) => (
              <span key={t} className="fs-strat__trait">
                {t}
              </span>
            ))}
          </div>
          <p className="fsb-label" style={{ marginTop: 34 }}>
            Values
          </p>
          <div className="fs-strat__trait-row">
            {['Craft over clutter', 'Clarity wins attention', 'Access to good design', 'Momentum'].map(
              (t) => (
                <span key={t} className="fs-strat__trait fs-strat__trait--ghost">
                  {t}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </BoardShell>
  )
}

/* ------------------------------------------------------------------ */
/* 13 — Brand voice & sample messaging                                 */
/* ------------------------------------------------------------------ */
export function FSVoiceBoard({
  headline = 'Say it like a designer would.',
  principle1 = 'Direct. Short sentences that respect the reader’s time.',
  principle2 = 'Craft-literate. We talk about layout, rhythm, and hierarchy — plainly.',
  principle3 = 'Encouraging, never gushing. The work is the compliment.',
  sampleHero = 'Start with a template. Make it yours.',
  sampleSupport = 'Thousands of layouts ready — change the words, photos, and colors.',
  sampleCta = 'Open the studio',
  sampleEmpty = 'Nothing on the board yet. Pick a template and make it yours.',
  studioEdit,
}) {
  const principles = [
    ['principle1', principle1],
    ['principle2', principle2],
    ['principle3', principle3],
  ]
  return (
    <BoardShell index="13" chapter="Voice">
      <div className="fs-voice">
        <p className="fsb-eyebrow">Brand voice</p>
        <EditableText
          as="h1"
          className="fsb-display fs-voice__headline"
          value={headline}
          {...editableTextProps(studioEdit, 'headline')}
        />
        <div className="fs-voice__cols">
          <div className="fs-voice__principles">
            {principles.map(([path, value], i) => (
              <div key={path} className="fs-voice__principle">
                <span className="fs-voice__num">{String(i + 1).padStart(2, '0')}</span>
                <EditableText
                  as="p"
                  className="fs-voice__principle-copy"
                  value={value}
                  {...editableTextProps(studioEdit, path)}
                />
              </div>
            ))}
          </div>
          <div className="fs-voice__samples">
            <p className="fsb-label">In use</p>
            <div className="fsb-peel fs-voice__sample fs-voice__sample--hero">
              <span className="fs-voice__sample-tag">Hero headline</span>
              <EditableText
                as="p"
                className="fs-voice__sample-hero"
                value={sampleHero}
                {...editableTextProps(studioEdit, 'sampleHero')}
              />
              <EditableText
                as="p"
                className="fs-voice__sample-sub"
                value={sampleSupport}
                {...editableTextProps(studioEdit, 'sampleSupport')}
              />
              <span className="fs-voice__sample-btn">
                <EditableText
                  as="span"
                  value={sampleCta}
                  {...editableTextProps(studioEdit, 'sampleCta')}
                />
              </span>
            </div>
            <div className="fsb-peel fs-voice__sample">
              <span className="fs-voice__sample-tag">Empty state</span>
              <EditableText
                as="p"
                className="fs-voice__sample-body"
                value={sampleEmpty}
                {...editableTextProps(studioEdit, 'sampleEmpty')}
              />
            </div>
            <div className="fs-voice__dodont">
              <div>
                <p className="fs-voice__do">We say</p>
                <p className="fs-voice__phrase">“Start with a template.”</p>
                <p className="fs-voice__phrase">“Make it yours.”</p>
              </div>
              <div>
                <p className="fs-voice__dont">We never say</p>
                <p className="fs-voice__phrase fs-voice__phrase--strike">“Unleash your creativity!”</p>
                <p className="fs-voice__phrase fs-voice__phrase--strike">“Stunning designs in seconds!”</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BoardShell>
  )
}

/* ------------------------------------------------------------------ */
/* 21 — Final overview / contact                                       */
/* ------------------------------------------------------------------ */
export function FSOverviewBoard({
  headline = 'Designed to be posted.',
  support = 'One mark, two typefaces, one signal color — a system built to survive feeds, favicons, decks, and print without losing its voice.',
  contact = 'brand@flierstudio.design',
  studioEdit,
}) {
  return (
    <BoardShell index="21" chapter="Overview" theme="ink">
      <div className="fs-over">
        <div className="fs-over__logo">
          <LogoStacked markSize={190} base={C.paper} corner={C.signal} text={C.paper} />
        </div>
        <EditableText
          as="h1"
          className="fsb-display fs-over__headline"
          value={headline}
          {...editableTextProps(studioEdit, 'headline')}
        />
        <EditableText
          as="p"
          className="fsb-copy fs-over__support"
          value={support}
          {...editableTextProps(studioEdit, 'support')}
        />
        <div className="fs-over__swatches">
          {[C.signal, C.cobalt, C.paper, C.graphite].map((hex) => (
            <span key={hex} className="fs-over__swatch" style={{ background: hex }} />
          ))}
        </div>
        <div className="fs-over__meta">
          <span className="fsb-label">Identity system V1.0</span>
          <EditableText
            as="span"
            className="fs-over__contact"
            value={contact}
            {...editableTextProps(studioEdit, 'contact')}
          />
        </div>
      </div>
    </BoardShell>
  )
}

export { LiftoffMark, Wordmark }
