import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PublicPageShell from './PublicPageShell'
import { SITE_LEGAL } from './siteLegal'
import { api, ApiError } from '../../lib/api'

const INITIAL = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

export default function ContactPage() {
  const [form, setForm] = useState(INITIAL)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [error, setError] = useState('')

  useEffect(() => {
    const prev = document.title
    document.title = 'Contact — Flier Studio'
    return () => {
      document.title = prev
    }
  }, [])

  function updateField(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (status === 'success' || status === 'error') {
        setStatus('idle')
        setError('')
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setError('')

    try {
      await api('/api/contact', {
        method: 'POST',
        body: {
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim() || undefined,
          message: form.message.trim(),
        },
      })
      setForm((prev) => ({ ...prev, message: '' }))
      setStatus('success')
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Could not send your message. Please try again.'
      setError(message)
      setStatus('error')
    }
  }

  const busy = status === 'loading'

  return (
    <PublicPageShell
      title="Contact"
      lead="Send a message — we read every one. Prefer email? Use the address below."
    >
      <section className="pub-section">
        <h2>Send a message</h2>
        <form className="pub-contact-form" onSubmit={handleSubmit} noValidate>
          <div className="pub-contact-form__row">
            <label className="pub-contact-form__field" htmlFor="contact-name">
              <span>Name</span>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={120}
                value={form.name}
                onChange={updateField('name')}
                disabled={busy}
              />
            </label>
            <label className="pub-contact-form__field" htmlFor="contact-email">
              <span>Email</span>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={form.email}
                onChange={updateField('email')}
                disabled={busy}
              />
            </label>
          </div>

          <label className="pub-contact-form__field" htmlFor="contact-subject">
            <span>
              Subject <em className="pub-contact-form__optional">(optional)</em>
            </span>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              maxLength={200}
              value={form.subject}
              onChange={updateField('subject')}
              disabled={busy}
            />
          </label>

          <label className="pub-contact-form__field" htmlFor="contact-message">
            <span>Message</span>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={6}
              maxLength={5000}
              value={form.message}
              onChange={updateField('message')}
              disabled={busy}
            />
          </label>

          <div className="pub-contact-form__actions">
            <button
              type="submit"
              className="l-btn l-btn--primary"
              disabled={busy}
            >
              {busy ? 'Sending…' : 'Send message'}
            </button>
            {status === 'success' ? (
              <p className="pub-contact-form__status pub-contact-form__status--ok" role="status">
                Message sent. Thanks — we&apos;ll get back to you.
              </p>
            ) : null}
            {status === 'error' ? (
              <p className="pub-contact-form__status pub-contact-form__status--err" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        </form>
      </section>

      <section className="pub-section">
        <h2>Or email us</h2>
        <p>
          <a href={`mailto:${SITE_LEGAL.contactEmail}`}>
            {SITE_LEGAL.contactEmail}
          </a>
        </p>
      </section>

      <section className="pub-section">
        <h2>Policies</h2>
        <p>
          Read our <Link to="/privacy">Privacy Policy</Link> and{' '}
          <Link to="/terms">Terms of Use</Link>. Learn more on{' '}
          <Link to="/about">About</Link>.
        </p>
      </section>
    </PublicPageShell>
  )
}
