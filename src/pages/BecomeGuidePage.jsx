import { Link } from 'react-router-dom'

function BecomeGuidePage({ content }) {
  return (
    <div className="container py-4 py-lg-5">
      <div className="guide-hero rounded-5 p-4 p-lg-5">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <p className="text-uppercase small fw-semibold circular-eyebrow mb-2">Circular para guías</p>
            <h1 className="display-5 fw-semibold circular-heading mb-3">
              {content.becomeGuide.title}
            </h1>
            <p className="lead text-muted mb-4">{content.becomeGuide.description}</p>
            <ul className="list-unstyled d-grid gap-3 mb-4">
              {content.becomeGuide.bullets.map((bullet) => (
                <li key={bullet} className="benefit-item rounded-4 p-3">
                  {bullet}
                </li>
              ))}
            </ul>
            <Link className="btn circular-btn-primary rounded-pill px-4 py-3" to="/auth?mode=signup&role=guide">
              {content.becomeGuide.cta}
            </Link>
          </div>

          <div className="col-lg-5">
            <div className="become-guide-card rounded-5 p-4">
              <p className="small text-uppercase circular-eyebrow mb-2">Qué incluye</p>
              <ul className="list-unstyled d-grid gap-3 mb-0">
                <li>Perfil profesional con historia y reseñas.</li>
                <li>Panel para crear círculos en pocos pasos.</li>
                <li>Diseño cálido, moderno y enfocado en confianza.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BecomeGuidePage
