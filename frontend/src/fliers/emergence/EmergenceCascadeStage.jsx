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
import './emergence-templates.css'

/**
 * Template 5 — Cascade Hero section + Stage Grid speaker card (composited as-is).
 * Reuses `.e-cascade__*` hero and `.e-grid__*` card classes; spacing tweaks only under this root.
 */
export default function EmergenceCascadeStage(props) {
  const { event, speakers, panelists, convener, studioEdit, rootStyle, personProps } =
    resolveEmergenceData(props)

  return (
    <article className="e-flier e-flier--cascade-stage" style={rootStyle}>
      <EmergenceBackground />
      <EmergenceHeader event={event} studioEdit={studioEdit} />

      {/* Exact Cascade Hero section */}
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

      {/* Exact Stage Grid speaker card */}
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

              <div className="e-grid__people" role="group" aria-label="Speakers and panelists">
                {speakers.map((person, i) => (
                  <PortraitSlot key={`s-${i}`} {...personProps('speakers', person, i)} />
                ))}
                {panelists.map((person, i) => (
                  <PortraitSlot key={`p-${i}`} {...personProps('panelists', person, i)} />
                ))}
              </div>
            </div>

            <ConvenerSlot
              className="e-grid__convener"
              label={convener.label}
              src={convener.photoSrc}
              studioEdit={studioEdit}
            />
          </div>

          <KeywordStrip event={event} studioEdit={studioEdit} />
        </div>
      </div>

      <EmergenceFooter event={event} studioEdit={studioEdit} />
    </article>
  )
}
