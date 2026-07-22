import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../../auth/AuthContext'
import { LiftoffMark } from '../../fliers/flier-studio/FSLogo'
import { fsTokens } from '../../design/flierStudioTokens'
import './LoginScreen.css'

const googleConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID)

export default function LoginScreen({ theme = 'dark' }) {
  const { loginWithGoogle, error, setError } = useAuth()
  const [busy, setBusy] = useState(false)

  return (
    <div className="login-screen" data-theme={theme}>
      <div className="login-screen__card">
        <LiftoffMark
          className="login-screen__mark"
          size={34}
          base={theme === 'dark' ? fsTokens.colors.paper : fsTokens.colors.ink}
          corner={fsTokens.colors.signal}
        />
        <p className="login-screen__eyebrow">Flier Studio</p>
        <h1 className="login-screen__title">Sign in to design</h1>
        <p className="login-screen__copy">
          Use your Google account so your work can sync across devices once cloud drafts are enabled.
        </p>

        {googleConfigured ? (
          <div className="login-screen__google">
            <GoogleLogin
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
              theme={theme === 'dark' ? 'filled_black' : 'outline'}
              size="large"
              text="continue_with"
              shape="rectangular"
              width="320"
            />
          </div>
        ) : (
          <p className="login-screen__error">
            Set <code>VITE_GOOGLE_CLIENT_ID</code> in <code>.env</code> (see <code>.env.example</code>).
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
      </div>
    </div>
  )
}
