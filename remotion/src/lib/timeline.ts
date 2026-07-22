/**

 * Timelines for Flier Studio motion.

 * Short reveal kept; multi-act film is the primary brand piece.

 */



export const FPS = 60



/** Original short logo reveal (~4.0s). */

export const REVEAL_DURATION = 240

export const WIDTH = 1920

export const HEIGHT = 1080

export const SQUARE = 1080

export const REEL_WIDTH = 1080

export const REEL_HEIGHT = 1920



/**

 * Multi-act brand film — ~14.4s @ 60fps (864 frames).

 * Act 1: reveal (~3s) + lockup shift (~3.7s); then applications + closing.

 * Shared by cinematic + reel.

 */

export const FILM_DURATION = 864



/** Legacy short-reveal beats (FlierStudioLogoReveal). */

export const beats = {

  void: [0, 24] as const,

  frame: [18, 52] as const,

  tile: [46, 88] as const,

  slice: [80, 108] as const,

  peel: [100, 148] as const,

  settle: [140, 168] as const,

  wordmark: [160, 198] as const,

  tagline: [190, 220] as const,

  hold: [198, 240] as const,

} as const



/**

 * Multi-act film beats — absolute frames @ 60fps / ~14.4s.

 *

 * Act 1  0:00–0:06.7  Reveal + horizontal lockup — 400 frames

 *  T1    0:06.5–0:07.1 SwipeWipe into applications

 * Act 4  0:06.9–0:11.4 Applications (mockups)

 *  T4    0:11.1–0:11.7 SwipeWipe into closing

 * Act 5  0:11.4–0:14.4 Closing resolve

 */

export const film = {

  act1: {

    range: [0, 400] as const,

    scene1: {

      range: [0, 180] as const,

      /** Cursor → inside TR cut corner */

      cursorEnter: [48, 72] as const,

      /** Single click triggers slice + peel */

      cursorClick: 78 as const,

      /** Cursor exits immediately after click */

      cursorExit: [82, 96] as const,

      /** Reveal-parity mark beats (~3.0s); peel starts at cursorClick */

      mark: {

        frame: [0, 36] as const,

        tile: [30, 68] as const,

        slice: [78, 106] as const,

        peel: [98, 146] as const,

        settle: [138, 166] as const,

        hold: [166, 180] as const,

      },

    },

    scene2: {

      range: [168, 400] as const,

      /** Finished mark slides to lockup position */

      markShift: [178, 248] as const,

      /** “Flier Studio” resolves beside the mark */

      wordmark: [218, 288] as const,

      hold: [288, 400] as const,

    },

  },

  /** Opening lockup → applications */

  t1: {

    range: [388, 424] as const,

  },

  act4: {

    range: [416, 686] as const,

    mock1: [416, 486] as const,

    mock2: [476, 546] as const,

    mock3: [536, 606] as const,

    mock4: [596, 686] as const,

  },

  /** Applications → closing */

  t4: {

    range: [668, 704] as const,

  },

  act5: {

    range: [686, 864] as const,

    returnLockup: [686, 756] as const,

    sliceRejoin: [726, 786] as const,

    tagline: [756, 806] as const,

    hold: [816, 864] as const,

  },

} as const



/** @deprecated use REVEAL_DURATION — kept for Root imports */

export const DURATION_IN_FRAMES = REVEAL_DURATION

