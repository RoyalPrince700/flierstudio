import React from 'react'
import { Audio, Sequence } from 'remotion'
import { filmAudioCues } from '../lib/sfx'

/**
 * Frame-accurate film soundtrack from `src/effects/`.
 * Sparse — not every visual beat gets a hit.
 */
export const FilmAudio: React.FC = () => {
  return (
    <>
      {filmAudioCues.map((cue) => (
        <Sequence
          key={`${cue.id}-${cue.from}`}
          from={cue.from}
          durationInFrames={cue.durationInFrames}
          layout="none"
          name={`sfx:${cue.id}`}
        >
          <Audio
            src={cue.src}
            volume={cue.volume}
            playbackRate={cue.playbackRate ?? 1}
          />
        </Sequence>
      ))}
    </>
  )
}
