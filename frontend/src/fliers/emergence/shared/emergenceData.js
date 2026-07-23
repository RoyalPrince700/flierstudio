import { mergeEmergenceDraft } from '../../../lib/flierDraft'
import { emergence } from '../../../design/emergenceTokens'
import { emergenceThemeCssVars } from '../../../design/emergenceThemes'

/** Resolve editable Emergence content + fonts from studio props. */
export function resolveEmergenceData(props = {}) {
  const content = mergeEmergenceDraft(props.content)
  const fonts = content.fonts
  const studioEdit = props.studioEdit || null

  const rootStyle = {
    width: emergence.size.width,
    height: emergence.size.height,
    '--e-display': fonts.display,
    '--e-body': fonts.body,
    ...emergenceThemeCssVars(content.colorTheme),
  }

  function personProps(listKey, person, index, size) {
    return {
      ...person,
      src: person.photoSrc,
      size,
      namePath: `${listKey}.${index}.name`,
      titlePath: `${listKey}.${index}.title`,
      photoPath: `${listKey}.${index}.photoSrc`,
      studioEdit,
    }
  }

  return {
    content,
    event: content.event,
    speakers: content.speakers,
    panelists: content.panelists,
    stagePeople: content.stagePeople,
    stagePeopleCount: content.stagePeopleCount,
    includeConvener: content.includeConvener,
    convener: content.convener,
    studioEdit,
    rootStyle,
    personProps,
  }
}
