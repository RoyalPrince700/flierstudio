import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './auth/AuthContext'
import GoogleAnalytics from './components/GoogleAnalytics'
import App from './App'
import './styles/global.css'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleAnalytics />
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
