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

/** Template 3 — equal 2×3 photo grid + tall right convener; programme title above */
export default function EmergenceStageGrid(props) {
  const { event, speakers, panelists, convener, studioEdit, rootStyle, personProps } =
    resolveEmergenceData(props)

  return (
    <article className="e-flier e-flier--grid" style={rootStyle}>
      <EmergenceBackground />
      <EmergenceHeader event={event} studioEdit={studioEdit} />

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
