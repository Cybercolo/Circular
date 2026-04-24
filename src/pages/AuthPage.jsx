import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AuthPage({ content, onLogin, onSignup }) {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [feedback, setFeedback] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'participant',
  })

  const handleChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (mode === 'login') {
      const result = onLogin(formData.email, formData.password)
      setFeedback(result.success ? '' : content.auth.invalidLogin)
      if (result.success) {
        navigate('/perfil')
      }
      return
    }

    const result = onSignup(formData)
    setFeedback(result.success ? content.auth.successSignup : content.auth.existingAccount)
    if (result.success) {
      navigate(formData.role === 'guide' ? '/panel-guia' : '/perfil')
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
                <div className="demo-card rounded-5 p-4">
                  <p className="fw-semibold mb-2">{content.auth.demoTitle}</p>
                  <p className="mb-2 small">{content.auth.demoParticipant}</p>
                  <p className="mb-0 small">{content.auth.demoGuide}</p>
                </div>
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
                        <div className="col-md-6">
                          <label className="form-label">Nombre</label>
                          <input
                            required
                            className="form-control circular-input"
                            value={formData.name}
                            onChange={(event) => handleChange('name', event.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">{content.circle.phone}</label>
                          <input
                            required
                            className="form-control circular-input"
                            value={formData.phone}
                            onChange={(event) => handleChange('phone', event.target.value)}
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
                            className={`btn rounded-pill ${
                              formData.role === 'participant' ? 'circular-btn-primary' : 'btn-light'
                            }`}
                            onClick={() => handleChange('role', 'participant')}
                          >
                            {content.auth.participant}
                          </button>
                          <button
                            type="button"
                            className={`btn rounded-pill ${
                              formData.role === 'guide' ? 'circular-btn-primary' : 'btn-light'
                            }`}
                            onClick={() => handleChange('role', 'guide')}
                          >
                            {content.auth.guide}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="col-12">
                      <button className="btn circular-btn-primary rounded-pill px-4 py-3" type="submit">
                        {mode === 'login' ? content.auth.submitLogin : content.auth.submitSignup}
                      </button>
                    </div>
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
