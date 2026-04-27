import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M21.8 12.23c0-.76-.07-1.49-.2-2.2H12v4.17h5.5a4.7 4.7 0 0 1-2.04 3.09v2.57h3.3c1.93-1.78 3.04-4.4 3.04-7.63Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.08-.92 6.77-2.49l-3.3-2.57c-.92.61-2.09.98-3.47.98-2.67 0-4.93-1.8-5.74-4.23H2.86v2.65A10.22 10.22 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.26 13.69A6.15 6.15 0 0 1 5.94 12c0-.59.11-1.15.32-1.69V7.66H2.86A10.19 10.19 0 0 0 1.8 12c0 1.64.39 3.2 1.06 4.34l3.4-2.65Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.08c1.5 0 2.84.52 3.89 1.52l2.91-2.91C17.08 3.08 14.76 2 12 2A10.22 10.22 0 0 0 2.86 7.66l3.4 2.65c.81-2.43 3.07-4.23 5.74-4.23Z"
        fill="#EA4335"
      />
    </svg>
  )
}

function AuthPage({ content, currentUser, onLogin, onSignup, onGoogleAuth }) {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'participant',
  })

  useEffect(() => {
    if (currentUser) {
      navigate(currentUser.role === 'guide' ? '/panel-guia' : '/perfil', { replace: true })
    }
  }, [currentUser, navigate])

  const handleChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    if (mode === 'login') {
      const result = await onLogin(formData.email, formData.password)
      setFeedback(result.success ? '' : result.message || content.auth.invalidLogin)
      if (result.success) {
        navigate('/perfil')
      }
      setIsSubmitting(false)
      return
    }

    const result = await onSignup(formData)
    setFeedback(result.success ? content.auth.successSignup : result.message || content.auth.existingAccount)
    if (result.success && result.sessionCreated) {
      navigate(formData.role === 'guide' ? '/panel-guia' : '/perfil')
    }
    setIsSubmitting(false)
  }

  const handleGoogleSubmit = async () => {
    setFeedback('')
    setIsGoogleSubmitting(true)

    const result = await onGoogleAuth(mode === 'signup' ? formData.role : null)

    if (!result.success) {
      setFeedback(result.message || content.auth.googleError)
      setIsGoogleSubmitting(false)
    }
  }

  return (
    <div className="container py-4 py-lg-5">
      <div className="row justify-content-center">
        <div className="col-xl-10">
          <div className="auth-shell rounded-5 p-4 p-lg-5">
            <div className="row g-4 align-items-center">
              <div className="col-lg-5">
                <p className="text-uppercase small fw-semibold circular-eyebrow mb-2">Circular</p>
                <h1 className="display-6 fw-semibold circular-heading mb-3">{content.auth.title}</h1>
                <p className="text-muted mb-4">{content.auth.subtitle}</p>
              </div>

              <div className="col-lg-7">
                <div className="join-form-panel rounded-5 p-4 p-lg-5">
                  <div className="d-flex gap-2 mb-4">
                    <button
                      type="button"
                      className={`btn rounded-pill ${mode === 'login' ? 'circular-btn-primary' : 'btn-light'}`}
                      onClick={() => setMode('login')}
                    >
                      {content.auth.login}
                    </button>
                    <button
                      type="button"
                      className={`btn rounded-pill ${mode === 'signup' ? 'circular-btn-primary' : 'btn-light'}`}
                      onClick={() => setMode('signup')}
                    >
                      {content.auth.signup}
                    </button>
                  </div>

                  {feedback && (
                    <div
                      className={`alert rounded-4 ${
                        feedback === content.auth.successSignup ? 'alert-success' : 'alert-warning'
                      }`}
                    >
                      {feedback}
                    </div>
                  )}

                  <form className="row g-3" onSubmit={handleSubmit}>
                    {mode === 'signup' && (
                      <>
                        <div className="col-12">
                          <label className="form-label">Nombre</label>
                          <input
                            required
                            className="form-control circular-input"
                            value={formData.name}
                            onChange={(event) => handleChange('name', event.target.value)}
                          />
                        </div>
                      </>
                    )}

                    <div className="col-md-6">
                      <label className="form-label">{content.circle.email}</label>
                      <input
                        required
                        type="email"
                        className="form-control circular-input"
                        value={formData.email}
                        onChange={(event) => handleChange('email', event.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">{content.auth.password}</label>
                      <input
                        required
                        type="password"
                        className="form-control circular-input"
                        value={formData.password}
                        onChange={(event) => handleChange('password', event.target.value)}
                      />
                    </div>

                    {mode === 'signup' && (
                      <div className="col-12">
                        <label className="form-label">{content.auth.role}</label>
                        <div className="d-flex flex-wrap gap-2">
                          <button
                            type="button"
                            className={`btn rounded-pill auth-role-button ${
                              formData.role === 'participant' ? 'auth-role-button-active' : ''
                            }`}
                            onClick={() => handleChange('role', 'participant')}
                          >
                            {content.auth.participant}
                          </button>
                          <button
                            type="button"
                            className={`btn rounded-pill auth-role-button ${
                              formData.role === 'guide' ? 'auth-role-button-active' : ''
                            }`}
                            onClick={() => handleChange('role', 'guide')}
                          >
                            {content.auth.guide}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="col-12">
                      <button
                        className="btn circular-btn-primary rounded-pill px-4 py-3"
                        type="submit"
                        disabled={isSubmitting || isGoogleSubmitting}
                      >
                        {mode === 'login' ? content.auth.submitLogin : content.auth.submitSignup}
                      </button>
                    </div>

                    {mode === 'login' && (
                      <>
                        <div className="col-12">
                          <div className="auth-divider">
                            <span>{content.auth.orContinueWith}</span>
                          </div>
                        </div>

                        <div className="col-12">
                          <button
                            className="btn google-auth-button rounded-pill px-4 py-3"
                            type="button"
                            onClick={handleGoogleSubmit}
                            disabled={isSubmitting || isGoogleSubmitting}
                          >
                            <GoogleIcon />
                            <span>
                              {isGoogleSubmitting ? content.auth.googleLoading : content.auth.googleContinue}
                            </span>
                          </button>
                        </div>
                      </>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
