import { Sparkles } from 'lucide-react'
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

/** Template 2 — flat card + lime ribbon, single showcase speaker row */
export default function EmergenceRibbon(props) {
  const { event, speakers, panelists, convener, studioEdit, rootStyle, personProps } =
    resolveEmergenceData(props)

  return (
    <article className="e-flier e-flier--ribbon" style={rootStyle}>
      <EmergenceBackground />
      <EmergenceHeader event={event} showZap={false} studioEdit={studioEdit} />

      <div className="e-ribbon__band">
        <Sparkles size={22} strokeWidth={2.25} />
        <span>GROWTH CONFERENCE · EMPTY PORTRAIT SLOTS READY FOR ASSETS</span>
        <Sparkles size={22} strokeWidth={2.25} />
      </div>

      <div className="e-ribbon__card">
        <div className="e-ribbon__block">
          <p className="e-ribbon__heading">SPEAKERS</p>
          <div className="e-ribbon__speakers">
            {speakers.map((person, i) => (
              <PortraitSlot key={i} {...personProps('speakers', person, i)} />
            ))}
          </div>
        </div>

        <div className="e-ribbon__block">
          <p className="e-ribbon__heading">PANELISTS</p>
          <div className="e-ribbon__panelists">
            {panelists.map((person, i) => (
              <PortraitSlot key={i} {...personProps('panelists', person, i, 'sm')} />
            ))}
          </div>
        </div>

        <KeywordStrip event={event} studioEdit={studioEdit} />
      </div>

      <ConvenerSlot
        className="e-ribbon__convener"
        label={convener.label}
        src={convener.photoSrc}
        studioEdit={studioEdit}
      />
      <EmergenceFooter event={event} studioEdit={studioEdit} />
    </article>
  )
}
