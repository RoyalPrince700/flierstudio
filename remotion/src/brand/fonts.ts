import { loadFont } from '@remotion/google-fonts/SpaceGrotesk'

const { fontFamily } = loadFont('normal', {
  weights: ['500', '700'],
  subsets: ['latin'],
})

export const spaceGrotesk = fontFamily
