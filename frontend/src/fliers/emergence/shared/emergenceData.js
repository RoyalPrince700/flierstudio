import { mergeEmergenceDraft } from '../../../lib/flierDraft'
import { emergence } from '../../../design/emergenceTokens'
import { emergenceThemeCssVars } from '../../../design/emergenceThemes'
import {
  resolveStageFlexBoardSize,
  stageFlexBannerCssVars,
} from '../stagePeopleLayout'

/** Resolve editable Emergence content + fonts from studio props. */
export function resolveEmergenceData(props = {}) {
  const content = mergeEmergenceDraft(props.content)
  const fonts = content.fonts
  const studioEdit = props.studioEdit || null
  const stageFlex = props.stageFlex === true
  const includeConvener = content.includeConvener !== false
  const boardSize = stageFlex
    ? resolveStageFlexBoardSize(content.stagePeopleCount, { includeConvener })
    : emergence.size

  const rootStyle = {
    width: boardSize.width,
    height: boardSize.height,
    '--e-display': fonts.display,
    '--e-body': fonts.body,
    ...emergenceThemeCssVars(content.colorTheme),
    ...(stageFlex
      ? stageFlexBannerCssVars(content.stagePeopleCount, { includeConvener })
      : null),
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
