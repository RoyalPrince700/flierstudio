import { BadgeDollarSign, Orbit, Zap } from 'lucide-react'
import EditableText from '../../components/studio/EditableText'
import { editableTextProps } from '../../components/studio/editableTextProps'
import PortraitSlot from './shared/PortraitSlot'
import {
  ConvenerSlot,
  EmergenceBackground,
  EmergenceFooter,
  EmergenceHeader,
} from './shared/EmergenceChrome'
import { resolveEmergenceData } from './shared/emergenceData'
import './emergence-templates.css'

/** Template 3 — left theme column, right portrait grid */
export default function EmergenceSplit(props) {
  const { event, speakers, panelists, convener, studioEdit, rootStyle, personProps } =
    resolveEmergenceData(props)
  const icons = [Zap, Orbit, BadgeDollarSign]

  return (
    <article className="e-flier e-flier--split" style={rootStyle}>
      <EmergenceBackground />
      <EmergenceHeader event={event} studioEdit={studioEdit} />

      <div className="e-split__body">
        <aside className="e-split__rail">
          <p className="e-split__kicker">THEME</p>
          <h2 className="e-split__title">
            <EditableText
              as="span"
              value={event.theme}
              {...editableTextProps(studioEdit, 'event.theme')}
            />
            <EditableText
              as="span"
              value={event.capsule}
              {...editableTextProps(studioEdit, 'event.capsule')}
            />
          </h2>
          <ul className="e-split__points">
            {event.keywords.map((word, i) => {
              const Icon = icons[i % icons.length]
              return (
                <li key={`${word}-${i}`}>
                  <Icon size={20} strokeWidth={2.25} />
                  <EditableText
                    as="span"
                    value={word}
                    {...editableTextProps(studioEdit, `event.keywords.${i}`)}
                  />
                </li>
              )
            })}
          </ul>
          <div className="e-split__note">Portrait frames left empty for your speaker assets</div>
        </aside>

        <div className="e-split__grid">
          <div className="e-split__speakers">
            {speakers.map((person, i) => (
              <PortraitSlot key={i} {...personProps('speakers', person, i)} />
            ))}
          </div>
          <div className="e-split__panelists">
            {panelists.map((person, i) => (
              <PortraitSlot key={i} {...personProps('panelists', person, i, 'sm')} />
            ))}
          </div>
        </div>
      </div>

      <ConvenerSlot
        className="e-split__convener"
        label={convener.label}
        src={convener.photoSrc}
        studioEdit={studioEdit}
      />
      <EmergenceFooter event={event} compact studioEdit={studioEdit} />
    </article>
  )
}
