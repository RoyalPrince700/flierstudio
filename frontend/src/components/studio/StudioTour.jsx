import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { X } from 'lucide-react'
import { getStudioTourSteps, markStudioTourSeen } from '../../lib/studioTour'
import './StudioTour.css'

const PAD = 8

function measureTarget(selector) {
  if (!selector || typeof document === 'undefined') return null
  const el = document.querySelector(selector)
  if (!el) return null
  const r = el.getBoundingClientRect()
  if (r.width < 2 && r.height < 2) return null
  return {
    top: r.top - PAD,
    left: r.left - PAD,
    width: r.width + PAD * 2,
    height: r.height + PAD * 2,
  }
}

function tooltipStyle(rect, isPhone) {
  if (!rect) {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: isPhone ? 'min(340px, calc(100vw - 32px))' : '360px',
    }
  }

  const gap = 14
  const tipW = isPhone ? Math.min(340, window.innerWidth - 32) : 360
  const tipH = 200
  const spaceBelow = window.innerHeight - (rect.top + rect.height)
  const spaceAbove = rect.top
  const placeBelow = spaceBelow >= tipH + gap || spaceBelow >= spaceAbove

  let top = placeBelow ? rect.top + rect.height + gap : rect.top - tipH - gap
  top = Math.max(16, Math.min(top, window.innerHeight - tipH - 16))

  let left = rect.left + rect.width / 2 - tipW / 2
  left = Math.max(16, Math.min(left, window.innerWidth - tipW - 16))

  return {
    top,
    left,
    width: tipW,
    transform: 'none',
  }
}

/**
 * Lightweight first-time studio tour. Non-blocking after skip/complete.
 * Empty-studio welcome when `hasOpenDesign` is false — does not require Emergence or any project.
 */
export default function StudioTour({
  open,
  isNarrow,
  isPhone,
  hasOpenDesign = false,
  templatesOpen = false,
  onClose,
  onEnsurePanelOpen,
}) {
  const steps = getStudioTourSteps({ isNarrow, isPhone, hasOpenDesign, templatesOpen })
  const [index, setIndex] = useState(0)
  const [rect, setRect] = useState(null)

  const step = steps[index] || steps[0]
  const isLast = index >= steps.length - 1

  const finish = useCallback(() => {
    markStudioTourSeen()
    onClose?.()
  }, [onClose])

  const refreshRect = useCallback(() => {
    setRect(measureTarget(step?.target))
  }, [step?.target])

  useEffect(() => {
    if (!open) {
      setIndex(0)
      return undefined
    }
    setIndex(0)
    return undefined
  }, [open])

  useEffect(() => {
    if (!open || !step) return undefined
    if (step.openPanel) onEnsurePanelOpen?.()
    const t = window.setTimeout(refreshRect, step.openPanel ? 280 : 40)
    return () => window.clearTimeout(t)
  }, [open, step, index, onEnsurePanelOpen, refreshRect])

  useLayoutEffect(() => {
    if (!open) return undefined
    refreshRect()
    const onResize = () => refreshRect()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onResize, true)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onResize, true)
    }
  }, [open, refreshRect, index])

  useEffect(() => {
    if (!open) return undefined
    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        finish()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, finish])

  if (!open || !step) return null

  const tip = tooltipStyle(rect, isPhone)

  return (
    <div className="studio-tour" role="dialog" aria-modal="true" aria-label="Studio tour">
      <div className="studio-tour__blocker" aria-hidden="true" />
      {rect ? (
        <div
          className="studio-tour__spot"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          }}
          aria-hidden="true"
        />
      ) : (
        <div className="studio-tour__shade" aria-hidden="true" />
      )}

      <div className="studio-tour__card" style={tip}>
        <header className="studio-tour__head">
          <p className="studio-tour__eyebrow">
            Quick tour · {index + 1}/{steps.length}
          </p>
          <button
            type="button"
            className="studio-tour__close"
            onClick={finish}
            aria-label="Skip tour"
          >
            <X size={16} strokeWidth={2.25} />
          </button>
        </header>
        <h2 className="studio-tour__title">{step.title}</h2>
        <p className="studio-tour__body">{step.body}</p>
        <div className="studio-tour__actions">
          <button type="button" className="studio-tour__btn studio-tour__btn--ghost" onClick={finish}>
            Skip
          </button>
          <div className="studio-tour__nav">
            {index > 0 ? (
              <button
                type="button"
                className="studio-tour__btn studio-tour__btn--ghost"
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
              >
                Back
              </button>
            ) : null}
            <button
              type="button"
              className="studio-tour__btn studio-tour__btn--accent"
              onClick={() => {
                if (isLast) finish()
                else setIndex((i) => i + 1)
              }}
            >
              {isLast ? 'Done' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
