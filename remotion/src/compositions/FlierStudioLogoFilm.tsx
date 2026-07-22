import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { BrandCursor } from '../components/BrandCursor'
import { FilmAudio } from '../components/FilmAudio'
import { SwipeWipe } from '../components/transitions'
import { colors } from '../brand/tokens'
import { sampleCursor } from '../lib/cursorPath'
import { getFilmCursorKeys } from '../lib/filmCursor'
import { getLayout, type FilmFormat } from '../lib/format'
import { film } from '../lib/timeline'
import { Act1Opening } from '../scenes/Act1Opening'
import { Act4Mockups } from '../scenes/Act4Mockups'
import { Act5Closing } from '../scenes/Act5Closing'

export type LogoFilmProps = {
  format: FilmFormat
}

/**
 * Flier Studio multi-act logo film — ~14.4s.
 * Act 1: reveal liftoff + lockup shift.
 * Act 4: applications · Act 5: closing.
 */
export const FlierStudioLogoFilm: React.FC<LogoFilmProps> = ({ format }) => {
  const layout = getLayout(format)
  const frame = useCurrentFrame()
  const cursor = sampleCursor(frame, getFilmCursorKeys(layout))

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      <FilmAudio />

      <Act1Opening layout={layout} />
      <SwipeWipe frame={frame} range={film.t1.range} layout={layout} direction="diagonal" />
      <Act4Mockups layout={layout} />
      <SwipeWipe frame={frame} range={film.t4.range} layout={layout} direction="diagonal" />
      <Act5Closing layout={layout} />

      <BrandCursor
        sample={cursor}
        x={cursor.x * layout.width}
        y={cursor.y * layout.height}
        scale={layout.cursorScale}
      />
    </AbsoluteFill>
  )
}
