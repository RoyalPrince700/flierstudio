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

/** Template 4 — Cascade hero chrome + Stage Grid equal people layout */
export default function EmergenceCascadeGrid(props) {
  const { event, speakers, panelists, convener, studioEdit, rootStyle, personProps } =
    resolveEmergenceData(props)

  return (
    <article className="e-flier e-flier--cascade-grid" style={rootStyle}>
      <EmergenceBackground />
      <EmergenceHeader event={event} studioEdit={studioEdit} />

      <div className="e-cascade-grid__hero">
        <p className="e-cascade-grid__eyebrow">
          <Zap size={18} strokeWidth={2.4} />
          <EditableText
            as="span"
            value={event.heroSeries}
            {...editableTextProps(studioEdit, 'event.heroSeries')}
          />
        </p>
        <h2 className="e-cascade-grid__title">
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
        <div className="e-cascade-grid__icons">
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

      <div className="e-cascade-grid__board">
        <div className="e-cascade-grid__layout">
          <div
            className="e-cascade-grid__people"
            role="group"
            aria-label="Speakers and panelists"
          >
            {speakers.map((person, i) => (
              <PortraitSlot key={`s-${i}`} {...personProps('speakers', person, i)} />
            ))}
            {panelists.map((person, i) => (
              <PortraitSlot key={`p-${i}`} {...personProps('panelists', person, i)} />
            ))}
          </div>

          <ConvenerSlot
            className="e-cascade-grid__convener"
            label={convener.label}
            src={convener.photoSrc}
            studioEdit={studioEdit}
          />
        </div>

        <KeywordStrip event={event} studioEdit={studioEdit} />
      </div>

      <EmergenceFooter event={event} studioEdit={studioEdit} />
    </article>
  )
}
