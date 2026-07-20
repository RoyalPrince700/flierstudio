import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../../auth/AuthContext'
import './LoginScreen.css'

const googleConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID)

export default function LoginScreen({ theme = 'dark' }) {
  const { loginWithGoogle, error, setError } = useAuth()
  const [busy, setBusy] = useState(false)

  return (
    <div className="login-screen" data-theme={theme}>
      <div className="login-screen__card">
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

        <p className="login-screen__hint">
          Run the API with <code>npm run dev:api</code> from the repo root (MongoDB + Google Client ID required).
        </p>
      </div>
    </div>
  )
}
