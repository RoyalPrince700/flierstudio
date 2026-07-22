import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { motion, useReducedMotion } from 'framer-motion'
import { useAuth } from '../../auth/AuthContext'
import {
  LiftoffMark,
  Wordmark,
  MARK_CORNER_PATH,
  MARK_TILE_PATH,
} from '../../fliers/flier-studio/FSLogo'
import { fsTokens } from '../../design/flierStudioTokens'
import { EASE } from '../landing/motion'
import './LoginScreen.css'

const googleConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID)
const GOOGLE_BTN_MAX = 320
const GOOGLE_BTN_MIN = 240

function useGoogleButtonWidth(ref) {
  const [width, setWidth] = useState(GOOGLE_BTN_MAX)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof ResizeObserver === 'undefined') return undefined

    const measure = () => {
      const raw = Math.min(GOOGLE_BTN_MAX, Math.max(GOOGLE_BTN_MIN, node.clientWidth))
      const next = Math.round(raw / 4) * 4
      setWidth((prev) => (prev === next ? prev : next))
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(node)
    return () => ro.disconnect()
  }, [ref])

  return width
}

function PeelMotif({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={MARK_TILE_PATH} />
      <path d={MARK_CORNER_PATH} />
    </svg>
  )
}

function ArtboardSilhouette({ className }) {
  return (
    <div className={className} aria-hidden="true">
      <div className="login-screen__sil-bar">
        <span />
        <span />
        <span />
      </div>
      <div className="login-screen__sil-body">
        <div className="login-screen__sil-tile login-screen__sil-tile--a" />
        <div className="login-screen__sil-tile login-screen__sil-tile--b" />
        <div className="login-screen__sil-tile login-screen__sil-tile--c" />
      </div>
    </div>
  )
}

export default function LoginScreen({ theme = 'dark' }) {
  const { loginWithGoogle, error, setError } = useAuth()
  const [busy, setBusy] = useState(false)
  const reduceMotion = useReducedMotion()
  const googleWrapRef = useRef(null)
  const googleWidth = useGoogleButtonWidth(googleWrapRef)
  const isDark = theme === 'dark'

  const markBase = isDark ? fsTokens.colors.paper : fsTokens.colors.ink
  const wordColor = isDark ? fsTokens.colors.paper : fsTokens.colors.ink

  const enter = (delay = 0) =>
    reduceMotion
      ? { initial: false }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, ease: EASE, delay },
        }

  return (
    <div className="login-screen" data-theme={theme}>
      <div className="login-screen__atmosphere" aria-hidden="true">
        <span className="login-screen__glow login-screen__glow--signal" />
        <span className="login-screen__glow login-screen__glow--cobalt" />
        <span className="login-screen__glow login-screen__glow--amber" />
        <span className="login-screen__grid" />
        <PeelMotif className="login-screen__peel login-screen__peel--lg" />
        <PeelMotif className="login-screen__peel login-screen__peel--sm" />
        <ArtboardSilhouette className="login-screen__silhouette" />
      </div>

      <motion.div className="login-screen__card" {...enter(0.05)}>
        <header className="login-screen__brand">
          <LiftoffMark
            className="login-screen__mark"
            size={40}
            base={markBase}
            corner={fsTokens.colors.signal}
          />
          <Wordmark
            className="login-screen__wordmark"
            size={22}
            color={wordColor}
            accent={fsTokens.colors.signal}
          />
        </header>

        <h1 className="login-screen__title">
          Start with a template.
          <span className="login-screen__title-accent"> Make it yours.</span>
        </h1>
        <p className="login-screen__copy">
          Sign in to open the studio — pick a layout, then change the words,
          photos, and colors.
        </p>

        {googleConfigured ? (
          <div
            ref={googleWrapRef}
            className={`login-screen__google${busy ? ' login-screen__google--busy' : ''}`}
          >
            <GoogleLogin
              key={googleWidth}
              onSuccess={async (response) => {
                if (!response.credential) {
                  setError('Google did not return a credential.')
                  return
                }
                setBusy(true)
                setError('')
                try {
                  await loginWithGoogle(response.credential)
                } catch (err) {
                  setError(err?.message || 'Google sign-in failed')
                } finally {
                  setBusy(false)
                }
              }}
              onError={() => setError('Google sign-in was cancelled or failed.')}
              useOneTap={false}
              theme={isDark ? 'filled_black' : 'outline'}
              size="large"
              text="continue_with"
              shape="rectangular"
              width={String(googleWidth)}
            />
          </div>
        ) : (
          <p className="login-screen__error">
            Set <code>VITE_GOOGLE_CLIENT_ID</code> in <code>.env</code> (see{' '}
            <code>.env.example</code>).
          </p>
        )}

        {busy ? <p className="login-screen__status">Signing you in…</p> : null}
        {error ? <p className="login-screen__error">{error}</p> : null}

        <nav className="login-screen__legal" aria-label="Legal">
          <Link to="/about">About</Link>
          <span aria-hidden="true">·</span>
          <Link to="/privacy">Privacy</Link>
          <span aria-hidden="true">·</span>
          <Link to="/terms">Terms</Link>
        </nav>
      </motion.div>
    </div>
  )
}
