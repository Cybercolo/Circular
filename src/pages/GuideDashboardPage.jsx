import { useState } from 'react'

const emptyForm = {
  title: '',
  shortDescription: '',
  date: '',
  time: '',
  region: '',
  comuna: '',
  type: 'sanacion',
  priceType: 'paid',
  price: '',
  image: '',
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('No se pudo leer la imagen'))
    reader.readAsDataURL(file)
  })
}

function GuideDashboardPage({
  content,
  currentUser,
  guideCircles,
  guideRegistrations,
  onCreateCircle,
}) {
  const [formData, setFormData] = useState(emptyForm)
  const [created, setCreated] = useState(false)
  const [fileInputKey, setFileInputKey] = useState(0)

  if (currentUser?.role !== 'guide') {
    return (
      <div className="container py-5">
        <div className="empty-panel rounded-5 p-5 text-center">
          <h1 className="h2 fw-semibold circular-heading mb-3">{content.dashboard.title}</h1>
          <p className="mb-0 text-muted">{content.dashboard.noGuide}</p>
        </div>
      </div>
    )
  }

  const handleChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      handleChange('image', '')
      return
    }

    const imageData = await readFileAsDataUrl(file)
    handleChange('image', imageData)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onCreateCircle(formData)
    setCreated(true)
    setFormData(emptyForm)
    setFileInputKey((currentKey) => currentKey + 1)
  }

  const requestsByCircle = guideCircles.map((circle) => ({
    circle,
    requests: guideRegistrations.filter((registration) => registration.circleId === circle.id),
  }))

  return (
    <div className="container py-4 py-lg-5">
      <div className="mb-4">
        <h1 className="display-6 fw-semibold circular-heading mb-2">{content.dashboard.title}</h1>
        <p className="text-muted mb-0">{content.dashboard.subtitle}</p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="mini-circle rounded-4 p-3 h-100">
            <p className="small text-uppercase circular-eyebrow mb-2">{content.dashboard.myCircles}</p>
            <p className="display-6 fw-semibold mb-0">{guideCircles.length}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="mini-circle rounded-4 p-3 h-100">
            <p className="small text-uppercase circular-eyebrow mb-2">{content.dashboard.incomingRequests}</p>
            <p className="display-6 fw-semibold mb-0">{guideRegistrations.length}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="mini-circle rounded-4 p-3 h-100">
            <p className="small text-uppercase circular-eyebrow mb-2">{content.dashboard.attendees}</p>
            <p className="mb-0">{content.dashboard.requestsSummary}</p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="join-form-panel rounded-5 p-4 p-lg-5">
            <h2 className="h4 fw-semibold circular-heading mb-4">{content.dashboard.create}</h2>
            <p className="text-muted mb-4">{content.dashboard.createSubtitle}</p>

            {created && <div className="alert alert-success rounded-4">{content.dashboard.success}</div>}

            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <label className="form-label">Título</label>
                <input
                  required
                  className="form-control circular-input"
                  value={formData.title}
                  onChange={(event) => handleChange('title', event.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">{content.search.type}</label>
                <select
                  className="form-select circular-input"
                  value={formData.type}
                  onChange={(event) => handleChange('type', event.target.value)}
                >
                  <option value="sanacion">Sanación</option>
                  <option value="creatividad">Creatividad</option>
                  <option value="espiritualidad">Espiritualidad</option>
                  <option value="conexion">Conexión humana</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">{content.dashboard.description}</label>
                <textarea
                  required
                  rows="4"
                  className="form-control circular-input"
                  value={formData.shortDescription}
                  onChange={(event) => handleChange('shortDescription', event.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">{content.search.date}</label>
                <input
                  required
                  type="date"
                  className="form-control circular-input"
                  value={formData.date}
                  onChange={(event) => handleChange('date', event.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Hora</label>
                <input
                  required
                  type="time"
                  className="form-control circular-input"
                  value={formData.time}
                  onChange={(event) => handleChange('time', event.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">{content.search.region}</label>
                <input
                  required
                  className="form-control circular-input"
                  value={formData.region}
                  onChange={(event) => handleChange('region', event.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">{content.search.comuna}</label>
                <input
                  required
                  className="form-control circular-input"
                  value={formData.comuna}
                  onChange={(event) => handleChange('comuna', event.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">{content.search.price}</label>
                <select
                  className="form-select circular-input"
                  value={formData.priceType}
                  onChange={(event) => handleChange('priceType', event.target.value)}
                >
                  <option value="paid">Pagado</option>
                  <option value="free">Gratuito</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Monto CLP</label>
                <input
                  type="number"
                  min="0"
                  className="form-control circular-input"
                  value={formData.price}
                  disabled={formData.priceType === 'free'}
                  onChange={(event) => handleChange('price', event.target.value)}
                />
              </div>
              <div className="col-12">
                <label className="form-label">{content.dashboard.imageUpload}</label>
                <input
                  key={fileInputKey}
                  required
                  type="file"
                  accept="image/*"
                  className="form-control circular-input"
                  onChange={handleImageChange}
                />
                <div className="form-text">{content.dashboard.imageHelp}</div>
              </div>
              {formData.image && (
                <div className="col-12">
                  <img
                    src={formData.image}
                    alt={formData.title || 'Vista previa del círculo'}
                    className="detail-image rounded-4 dashboard-image-preview"
                  />
                </div>
              )}
              <div className="col-12">
                <button className="btn circular-btn-primary rounded-pill px-4 py-3" type="submit">
                  {content.dashboard.create}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="detail-summary rounded-5 p-4 mb-4">
            <h2 className="h4 fw-semibold circular-heading mb-4">{content.dashboard.myCircles}</h2>
            {guideCircles.length ? (
              <div className="d-grid gap-3">
                {guideCircles.map((circle) => (
                  <div key={circle.id} className="mini-circle rounded-4 p-3">
                    <div className="d-flex justify-content-between gap-3 align-items-start">
                      <div>
                        <p className="fw-semibold mb-1">{circle.title}</p>
                        <p className="mb-2 text-muted small">{circle.shortDescription}</p>
                        <small>
                          {content.dashboard.eventDate}: {circle.displayDate} · {circle.time}
                        </small>
                        <br />
                        <small>
                          {circle.region} · {circle.comuna}
                        </small>
                      </div>
                      <span className="badge circular-badge">{circle.priceLabel}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mb-0 text-muted">{content.dashboard.noEvents}</p>
            )}
          </div>

          <div className="detail-summary rounded-5 p-4">
            <h2 className="h4 fw-semibold circular-heading mb-2">{content.dashboard.requestsByEvent}</h2>
            <p className="text-muted small mb-4">{content.dashboard.requestsSummary}</p>

            {guideRegistrations.length ? (
              <div className="d-grid gap-3">
                {requestsByCircle
                  .filter((item) => item.requests.length)
                  .map(({ circle, requests }) => (
                    <div key={circle.id} className="request-group rounded-4 p-3">
                      <div className="d-flex justify-content-between gap-2 align-items-start mb-3">
                        <div>
                          <p className="fw-semibold mb-1">{circle.title}</p>
                          <small className="text-muted">
                            {circle.displayDate} · {circle.comuna}
                          </small>
                        </div>
                        <span className="badge circular-badge">{requests.length}</span>
                      </div>

                      <div className="d-grid gap-3">
                        {requests.map((request) => (
                          <div key={request.id} className="request-card rounded-4 p-3">
                            <p className="fw-semibold mb-1">{request.name}</p>
                            <p className="small mb-1">
                              <strong>{content.dashboard.contact}:</strong> {request.email} · {request.phone}
                            </p>
                            {request.message && (
                              <p className="small mb-0 text-muted">
                                <strong>{content.dashboard.applicantMessage}:</strong> {request.message}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="mb-0 text-muted">{content.dashboard.noRequests}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuideDashboardPage
