/**
 * Dev-only visual QA mount for Emergence templates.
 * Open via /qa-emergence.html while `npm run dev` is running.
 *
 * Cascade Stage Flex also mounts N=1–10 (+ solo 1,2,4,5,6,7,8,9,10) for DESIGN_QA.
 * Extra: N=1/N=2 + filled convener across Ocean / Ember / Violet (slab theme QA).
 * Extra: N=6–8 solo + with-convener (Ember) for multi-row stage balance QA.
 * Extra: N=9–10 Ember banner (solo + convener) for landscape artboard QA.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { EMERGENCE_TEMPLATES } from '../fliers/emergence'
import { createEmergenceContent } from '../lib/flierDraft'
import '../styles/global.css'

const FLEX_QA_COUNTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const CONVENER_SLAB_QA_THEMES = ['ocean', 'ember', 'violet']
const CONVENER_QA_PHOTO = '/assets/gracelife/cityscape.jpg'

function flexContent(template, overrides = {}) {
  return {
    ...createEmergenceContent(),
    ...(template.props?.content || {}),
    ...overrides,
  }
}

function boardsForTemplate(template) {
  const Component = template.Component
  const isFlex =
    template.id === 'cascade-stage-flex' || template.id === 'cascade-flex-updated'
  if (!isFlex) {
    return [
      <div key={template.id} data-shot={template.id} style={{ marginBottom: 24 }}>
        <Component {...(template.props || {})} />
      </div>,
    ]
  }

  const countBoards = FLEX_QA_COUNTS.map((count) => {
    const content = flexContent(template, { stagePeopleCount: count })
    return (
      <div
        key={`${template.id}-n${count}`}
        data-shot={`${template.id}-n${count}`}
        style={{ marginBottom: 24 }}
      >
        <Component {...(template.props || {})} content={content} />
      </div>
    )
  })

  const soloBoards = [1, 2, 4, 5, 6, 7, 8, 9, 10].map((count) => {
    const content = flexContent(template, {
      stagePeopleCount: count,
      includeConvener: false,
    })
    return (
      <div
        key={`${template.id}-n${count}-solo`}
        data-shot={`${template.id}-n${count}-solo`}
        style={{ marginBottom: 24 }}
      >
        <Component {...(template.props || {})} content={content} />
      </div>
    )
  })

  /* N=6–8 Ember: solo + with-convener multi-row balance */
  const highNBalanceBoards = [6, 7, 8].flatMap((count) =>
    [false, true].map((withConvener) => {
      const content = flexContent(template, {
        stagePeopleCount: count,
        includeConvener: withConvener,
        colorTheme: 'ember',
      })
      const shot = withConvener
        ? `${template.id}-n${count}-ember`
        : `${template.id}-n${count}-solo-ember`
      return (
        <div key={shot} data-shot={shot} style={{ marginBottom: 24 }}>
          <Component {...(template.props || {})} content={content} />
        </div>
      )
    }),
  )

  /* N=9–10 Ember banner: landscape artboard + stage balance */
  const bannerBalanceBoards = [9, 10].flatMap((count) =>
    [false, true].map((withConvener) => {
      const content = flexContent(template, {
        stagePeopleCount: count,
        includeConvener: withConvener,
        colorTheme: 'ember',
      })
      const shot = withConvener
        ? `${template.id}-n${count}-banner-ember`
        : `${template.id}-n${count}-solo-banner-ember`
      return (
        <div key={shot} data-shot={shot} style={{ marginBottom: 24 }}>
          <Component {...(template.props || {})} content={content} />
        </div>
      )
    }),
  )

  /* Filled-photo theme matrix — verifies --e-convener-slab (N=1) and no slab (N=2) */
  const slabThemeBoards = [1, 2].flatMap((count) =>
    CONVENER_SLAB_QA_THEMES.map((theme) => {
      const content = flexContent(template, {
        stagePeopleCount: count,
        includeConvener: true,
        colorTheme: theme,
        convener: {
          ...createEmergenceContent().convener,
          photoSrc: CONVENER_QA_PHOTO,
        },
      })
      const shot = `${template.id}-n${count}-filled-${theme}`
      return (
        <div key={shot} data-shot={shot} style={{ marginBottom: 24 }}>
          <Component {...(template.props || {})} content={content} />
        </div>
      )
    }),
  )

  /* N=4 + convener equal-column QA (Ocean / Ember) */
  const n4EqualBoards = ['ocean', 'ember'].map((theme) => {
    const content = flexContent(template, {
      stagePeopleCount: 4,
      includeConvener: true,
      colorTheme: theme,
    })
    const shot = `${template.id}-n4-eq-${theme}`
    return (
      <div key={shot} data-shot={shot} style={{ marginBottom: 24 }}>
        <Component {...(template.props || {})} content={content} />
      </div>
    )
  })

  /* Tray toggle QA — N=6 with stage bg on and off */
  const trayToggleBoards = [true, false].map((showBg) => {
    const content = flexContent(template, {
      stagePeopleCount: 6,
      showSpeakerStageBg: showBg,
    })
    const shot = `${template.id}-n6-tray-${showBg ? 'on' : 'off'}`
    return (
      <div key={shot} data-shot={shot} style={{ marginBottom: 24 }}>
        <Component {...(template.props || {})} content={content} />
      </div>
    )
  })

  return [
    ...countBoards,
    ...soloBoards,
    ...highNBalanceBoards,
    ...bannerBalanceBoards,
    ...slabThemeBoards,
    ...n4EqualBoards,
    ...trayToggleBoards,
  ]
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {Object.values(EMERGENCE_TEMPLATES).flatMap((template) => boardsForTemplate(template))}
  </StrictMode>,
)
