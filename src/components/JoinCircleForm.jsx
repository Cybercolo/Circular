import { useState } from 'react'

function JoinCircleForm({ content, currentUser, circleId, onJoin }) {
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onJoin(circleId, formData)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="confirmation-panel rounded-5 p-4">
        <p className="mb-0 fw-semibold">{content.circle.confirmation}</p>
      </div>
    )
  }

  return (
    <div className="join-form-panel rounded-5 p-4 p-lg-5">
      <h3 className="h4 fw-semibold circular-heading mb-2">{content.circle.formTitle}</h3>
      <p className="text-muted mb-4">{content.circle.formSubtitle}</p>

      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label className="form-label">{content.circle.name}</label>
          <input
            required
            type="text"
            className="form-control circular-input"
            value={formData.name}
            onChange={(event) => handleChange('name', event.target.value)}
          />
        </div>

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

        <div className="col-12">
          <label className="form-label">{content.circle.phone}</label>
          <input
            required
            type="tel"
            className="form-control circular-input"
            value={formData.phone}
            onChange={(event) => handleChange('phone', event.target.value)}
          />
        </div>

        <div className="col-12">
          <label className="form-label">{content.circle.message}</label>
          <textarea
            rows="4"
            className="form-control circular-input"
            value={formData.message}
            onChange={(event) => handleChange('message', event.target.value)}
          />
        </div>

        <div className="col-12">
          <button type="submit" className="btn circular-btn-primary rounded-pill px-4 py-3">
            {content.circle.submit}
          </button>
        </div>
      </form>
    </div>
  )
}

export default JoinCircleForm
