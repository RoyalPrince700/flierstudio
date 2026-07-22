import React from 'react'
import { Composition } from 'remotion'
import {
  FlierStudioLogoFilm,
  LogoFilmProps,
} from './compositions/FlierStudioLogoFilm'
import {
  FlierStudioLogoReveal,
  LogoRevealProps,
} from './compositions/FlierStudioLogoReveal'
import {
  FILM_DURATION,
  FPS,
  HEIGHT,
  REEL_HEIGHT,
  REEL_WIDTH,
  REVEAL_DURATION,
  SQUARE,
  WIDTH,
} from './lib/timeline'

export const RemotionRoot: React.FC = () => {
  const revealProps: LogoRevealProps = { showTagline: true }
  const filmCinematic: LogoFilmProps = { format: 'cinematic' }
  const filmReel: LogoFilmProps = { format: 'reel' }

  return (
    <>
      {/* Multi-act brand film */}
      <Composition
        id="FlierStudioLogoFilm"
        component={FlierStudioLogoFilm}
        durationInFrames={FILM_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={filmCinematic}
      />
      <Composition
        id="FlierStudioLogoFilmReel"
        component={FlierStudioLogoFilm}
        durationInFrames={FILM_DURATION}
        fps={FPS}
        width={REEL_WIDTH}
        height={REEL_HEIGHT}
        defaultProps={filmReel}
      />

      {/* Original short reveal (kept) */}
      <Composition
        id="FlierStudioLogoReveal"
        component={FlierStudioLogoReveal}
        durationInFrames={REVEAL_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={revealProps}
      />
      <Composition
        id="FlierStudioLogoRevealSquare"
        component={FlierStudioLogoReveal}
        durationInFrames={REVEAL_DURATION}
        fps={FPS}
        width={SQUARE}
        height={SQUARE}
        defaultProps={revealProps}
      />
    </>
  )
}
