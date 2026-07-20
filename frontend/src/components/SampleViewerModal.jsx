import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Check, Copy, Download, X } from 'lucide-react'
import { exportFlier } from '../lib/exportFlier'

/**
 * Full-page modal to preview a sample at fit scale and download PNG/JPG for phone review.
 */
export default function SampleViewerModal({ template, onClose }) {
  const exportRef = useRef(null)
  const stageRef = useRef(null)
  const [scale, setScale] = useState(0.2)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!template) return undefined
    function onKey(e) {
      if (e.key === 'Escape' && !busy) onClose()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [template, onClose, busy])

  useLayoutEffect(() => {
    if (!template) return undefined
    const stage = stageRef.current
    if (!stage) return undefined

    function measure() {
      const padX = 48
      const padY = 48
      const availW = Math.max(160, stage.clientWidth - padX)
      const availH = Math.max(160, stage.clientHeight - padY)
      const next = Math.min(availW / template.width, availH / template.height, 1)
      setScale(Number.isFinite(next) && next > 0 ? next : 0.2)
    }

    measure()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    ro?.observe(stage)
    window.addEventListener('resize', measure)
    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [template])

  const copyId = useCallback(async () => {
    if (!template) return
    try {
      await navigator.clipboard.writeText(template.id)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      // ignore
    }
  }, [template])

  const handleDownload = useCallback(
    async (format) => {
      if (!template || !exportRef.current) return
      setBusy(true)
      setError('')
      try {
        await exportFlier(exportRef.current, {
          format,
          filename: `sample-${template.id}-${Date.now()}`,
          width: template.width,
          height: template.height,
          scale: 2,
          quality: 0.92,
        })
      } catch (err) {
        console.error(err)
        setError('Download failed. Try again.')
      } finally {
        setBusy(false)
      }
    },
    [template],
  )

  if (!template?.Component) return null

  const Component = template.Component
  const frameW = template.width * scale
  const frameH = template.height * scale

  return (
    <div
      className="sample-viewer"
      role="dialog"
      aria-modal="true"
      aria-label={`Preview ${template.name}`}
    >
      <button
        type="button"
        className="sample-viewer__backdrop"
        aria-label="Close preview"
        onClick={() => !busy && onClose()}
      />

      <div className="sample-viewer__shell">
        <header className="sample-viewer__bar">
          <div className="sample-viewer__meta">
            <strong>{template.name}</strong>
            <code>{template.id}</code>
            <span>{template.sizeLabel}</span>
          </div>

          <div className="sample-viewer__actions">
            {error ? <span className="sample-viewer__error">{error}</span> : null}
            <button
              type="button"
              className="sample-viewer__btn"
              onClick={copyId}
              disabled={busy}
            >
              {copied ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} strokeWidth={2.25} />}
              {copied ? 'Copied' : 'Copy id'}
            </button>
            <button
              type="button"
              className="sample-viewer__btn sample-viewer__btn--primary"
              onClick={() => handleDownload('png')}
              disabled={busy}
            >
              <Download size={14} strokeWidth={2.25} />
              {busy ? 'Saving…' : 'PNG'}
            </button>
            <button
              type="button"
              className="sample-viewer__btn sample-viewer__btn--primary"
              onClick={() => handleDownload('jpg')}
              disabled={busy}
            >
              <Download size={14} strokeWidth={2.25} />
              {busy ? 'Saving…' : 'JPG'}
            </button>
            <button
              type="button"
              className="sample-viewer__icon"
              onClick={onClose}
              disabled={busy}
              aria-label="Close"
            >
              <X size={18} strokeWidth={2.25} />
            </button>
          </div>
        </header>

        <div className="sample-viewer__stage" ref={stageRef}>
          <div
            className="sample-viewer__frame"
            style={{ width: frameW, height: frameH }}
          >
            <div
              className="sample-viewer__scaler"
              style={{
                width: template.width,
                height: template.height,
                transform: `scale(${scale})`,
              }}
            >
              <div ref={exportRef} className="sample-viewer__export-root">
                <Component
                  {...(template.props || {})}
                  width={template.width}
                  height={template.height}
                />
              </div>
            </div>
          </div>
        </div>

        <p className="sample-viewer__hint">
          Download PNG or JPG to preview on your phone · Esc to close
        </p>
      </div>
    </div>
  )
}
