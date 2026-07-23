import { Gem, Network, Zap } from 'lucide-react'
import EditableText from '../../components/studio/EditableText'
import { editableTextProps } from '../../components/studio/editableTextProps'
import PortraitSlot from './shared/PortraitSlot'
import {
  ConvenerSlot,
  EmergenceBackground,
  EmergenceFooter,
  EmergenceHeader,
  KeywordStrip,
} from './shared/EmergenceChrome'
import { resolveEmergenceData } from './shared/emergenceData'
import {
  stagePeopleLayoutClass,
  stagePeopleRowGroups,
} from './stagePeopleLayout'
import './emergence-templates.css'

/**
 * Cascade Stage Flex — same chrome as Cascade Stage, dynamic stagePeople 1–10.
 * Original `EmergenceCascadeStage` stays fixed 3+3; this board owns the flex layout.
 */
export default function EmergenceCascadeStageFlex(props) {
  const {
    event,
    stagePeople,
    stagePeopleCount,
    includeConvener,
    convener,
    studioEdit,
    rootStyle,
    personProps,
  } = resolveEmergenceData(props)

  const count = stagePeopleCount
  const people = stagePeople
  const showConvener = includeConvener !== false
  const rows = stagePeopleRowGroups(people, { includeConvener: showConvener })

  return (
    <article
      className={[
        'e-flier',
        'e-flier--cascade-stage',
        'e-flier--cascade-stage-flex',
        showConvener ? '' : 'e-flier--cascade-stage-flex-solo',
      ]
        .filter(Boolean)
        .join(' ')}
      style={rootStyle}
      data-people-count={count}
      data-include-convener={showConvener ? '1' : '0'}
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
          <div className="e-grid__layout">
            <div className="e-grid__people-col">
              <h2 className="e-grid__programme">
                <EditableText
                  as="span"
                  value={event.programmeTitle}
                  {...editableTextProps(studioEdit, 'event.programmeTitle')}
                />
              </h2>

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

            {showConvener ? (
              <ConvenerSlot
                className="e-grid__convener"
                label={convener.label}
                src={convener.photoSrc}
                studioEdit={studioEdit}
              />
            ) : null}
          </div>

          <KeywordStrip event={event} studioEdit={studioEdit} />
        </div>
      </div>

      <EmergenceFooter event={event} studioEdit={studioEdit} />
    </article>
  )
}
