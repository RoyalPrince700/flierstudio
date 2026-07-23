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

/** Template 4 — oversized theme hero + cascading offset frames */
export default function EmergenceCascade(props) {
  const { event, speakers, panelists, convener, studioEdit, rootStyle, personProps } =
    resolveEmergenceData(props)

  return (
    <article className="e-flier e-flier--cascade" style={rootStyle}>
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

      <div className="e-cascade__board">
        <div className="e-cascade__speakers">
          {speakers.map((person, i) => (
            <div key={i} className={`e-cascade__chip e-cascade__chip--${i + 1}`}>
              <PortraitSlot {...personProps('speakers', person, i)} />
            </div>
          ))}
        </div>
        <div className="e-cascade__panelists">
          {panelists.map((person, i) => (
            <div key={i} className={`e-cascade__chip e-cascade__chip--p${i + 1}`}>
              <PortraitSlot {...personProps('panelists', person, i, 'sm')} />
            </div>
          ))}
        </div>
        <KeywordStrip event={event} studioEdit={studioEdit} />
      </div>

      <ConvenerSlot
        className="e-cascade__convener"
        label={convener.label}
        src={convener.photoSrc}
        studioEdit={studioEdit}
      />
      <EmergenceFooter event={event} studioEdit={studioEdit} />
    </article>
  )
}
