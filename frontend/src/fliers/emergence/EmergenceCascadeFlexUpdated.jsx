import { Gem, Network, Zap } from 'lucide-react'
import EditableText from '../../components/studio/EditableText'
import { editableTextProps } from '../../components/studio/editableTextProps'
import PortraitSlot from './shared/PortraitSlot'
import {
  // TEMP: ConvenerSlot gated off — re-enable when convener edit is finished (allowConvener: true).
  // ConvenerSlot,
  EmergenceBackground,
  EmergenceFooter,
  EmergenceHeader,
  KeywordStrip,
} from './shared/EmergenceChrome'
import { resolveEmergenceData } from './shared/emergenceData'
import {
  isStageFlexBannerCount,
  stagePeopleLayoutClass,
  stagePeopleRowGroups,
} from './stagePeopleLayout'
import './emergence-templates.css'

/**
 * Cascade Flex Updated — independent copy of Cascade Stage Flex.
 * Same chrome + dynamic stagePeople 1–10; owns e-flier--cascade-flex-updated CSS.
 * Original EmergenceCascadeStageFlex / cascade-stage-flex stays untouched.
 *
 * TEMP: speakers-only (no convener column). Re-enable when convener edit is finished:
 * set allowConvener: true on cascade-flex-updated template and restore showConvener /
 * ConvenerSlot branch below.
 */
export default function EmergenceCascadeFlexUpdated(props) {
  const {
    event,
    stagePeople,
    stagePeopleCount,
    showSpeakerStageBg,
    // convener, // TEMP: restore with ConvenerSlot when allowConvener is re-enabled
    studioEdit,
    rootStyle,
    personProps,
  } = resolveEmergenceData(props)

  const count = stagePeopleCount
  const people = stagePeople
  // TEMP: force speakers-only — ignore draft includeConvener until edit work is done.
  const showConvener = false
  const showStageCard = showSpeakerStageBg !== false
  const landscape = isStageFlexBannerCount(count)
  const rows = stagePeopleRowGroups(people, { includeConvener: showConvener })
  /* N=1 + convener: programme spans the full speaker+convener pair */
  const programmeOverPair = showConvener && count === 1

  const programmeHeading = (
    <h2 className="e-grid__programme">
      <EditableText
        as="span"
        value={event.programmeTitle}
        {...editableTextProps(studioEdit, 'event.programmeTitle')}
      />
    </h2>
  )

  return (
    <article
      className={[
        'e-flier',
        'e-flier--cascade-stage',
        'e-flier--cascade-flex-updated',
        'e-flier--cascade-flex-updated-solo',
      ]
        .filter(Boolean)
        .join(' ')}
      style={rootStyle}
      data-people-count={count}
      data-include-convener="0"
      data-stage-card={showStageCard ? '1' : '0'}
      data-orientation={landscape ? 'landscape' : 'portrait'}
    >
      <EmergenceBackground />
      <EmergenceHeader event={event} studioEdit={studioEdit} />

      <div className="e-cascade__hero">
        <p className="e-cascade__eyebrow">
          <Zap size={18} strokeWidth={2.4} />
          <EditableText
            as="span"
            value={event.heroSeries}
            {...editableTextProps(studioEdit, 'event.heroSeries')}
          />
        </p>
        <h2 className="e-cascade__title">
          <EditableText
            as="span"
            value={event.heroTheme}
            {...editableTextProps(studioEdit, 'event.heroTheme')}
          />
          <em>
            <EditableText
              as="span"
              value={event.heroCapsule}
              {...editableTextProps(studioEdit, 'event.heroCapsule')}
            />
          </em>
        </h2>
        <div className="e-cascade__icons">
          <span>
            <Network size={18} /> NETWORK
          </span>
          <span>
            <Gem size={18} /> GRANT
          </span>
          <span>
            <Zap size={18} /> DISRUPT
          </span>
        </div>
      </div>

      <div className="e-grid__stage">
        <div className="e-grid__card">
          {programmeOverPair ? programmeHeading : null}

          <div className="e-grid__layout">
            <div className="e-grid__people-col">
              {!programmeOverPair ? programmeHeading : null}

              <div
                className={`e-flex-people ${stagePeopleLayoutClass(count)}`}
                role="group"
                aria-label="People on stage"
              >
                {rows.map((row, rowIndex) => (
                  <div
                    key={`row-${rowIndex}`}
                    className="e-flex-people__row"
                    style={{ '--row-cols': String(row.cols) }}
                    data-cols={row.cols}
                  >
                    {row.people.map((person, i) => {
                      const index = rows
                        .slice(0, rowIndex)
                        .reduce((sum, r) => sum + r.people.length, 0) + i
                      return (
                        <PortraitSlot
                          key={`sp-${index}`}
                          {...personProps('stagePeople', person, index)}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* TEMP: convener column disabled — restore when allowConvener is re-enabled:
            {showConvener ? (
              <ConvenerSlot
                className="e-grid__convener"
                label={convener.label}
                src={convener.photoSrc}
                studioEdit={studioEdit}
              />
            ) : null}
            */}
          </div>

          <KeywordStrip event={event} studioEdit={studioEdit} />
        </div>
      </div>

      <EmergenceFooter event={event} studioEdit={studioEdit} compact={landscape} />
    </article>
  )
}
