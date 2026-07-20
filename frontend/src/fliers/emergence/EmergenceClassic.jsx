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

/** Template 1 — closest to the reference: tilted cyan gallery card */
export default function EmergenceClassic(props) {
  const { event, speakers, panelists, convener, studioEdit, rootStyle, personProps } =
    resolveEmergenceData(props)

  return (
    <article className="e-flier e-flier--classic" style={rootStyle}>
      <EmergenceBackground />
      <EmergenceHeader event={event} studioEdit={studioEdit} />

      <div className="e-classic__stage">
        <div className="e-classic__card">
          {/* Rotated plate only — content stays untransformed so export text stays sharp */}
          <div className="e-classic__plate" aria-hidden />
          <div className="e-classic__content">
            <div className="e-classic__row">
              <p className="e-classic__label">SPEAKERS</p>
              <div className="e-classic__speakers">
                {speakers.map((person, i) => (
                  <PortraitSlot key={i} {...personProps('speakers', person, i)} />
                ))}
              </div>
            </div>

            <div className="e-classic__row">
              <p className="e-classic__label">PANELISTS</p>
              <div className="e-classic__panelists">
                {panelists.map((person, i) => (
                  <PortraitSlot key={i} {...personProps('panelists', person, i, 'sm')} />
                ))}
              </div>
            </div>

            <KeywordStrip event={event} studioEdit={studioEdit} />
          </div>
        </div>
      </div>

      <ConvenerSlot
        className="e-classic__convener"
        label={convener.label}
        src={convener.photoSrc}
        studioEdit={studioEdit}
      />
      <EmergenceFooter event={event} studioEdit={studioEdit} />
    </article>
  )
}
