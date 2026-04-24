import { Link } from 'react-router-dom'

function CircleCard({ circle, content }) {
  return (
    <article className="col">
      <div className="card h-100 border-0 circle-card">
        <img src={circle.image} className="card-img-top circle-card-image" alt={circle.title} />
        <div className="card-body p-4 d-flex flex-column">
          <div className="d-flex flex-wrap gap-2 mb-3">
            <span className="badge rounded-pill text-bg-light">{circle.themeLabel}</span>
            <span className="badge rounded-pill circular-price-badge">{circle.priceLabel}</span>
          </div>

          <h3 className="h4 fw-semibold circular-heading">{circle.title}</h3>
          <p className="text-muted mb-4">{circle.shortDescription}</p>

          <ul className="list-unstyled small text-muted d-grid gap-2 mb-4">
            <li>
              <strong>{circle.displayDate}</strong> · {circle.time}
            </li>
            <li>
              {circle.region} · {circle.comuna}
            </li>
            <li>
              {content.circle.guide}:{' '}
              <Link className="text-decoration-none fw-semibold" to={`/guias/${circle.guide.id}`}>
                {circle.guide.name}
              </Link>
            </li>
          </ul>

          <div className="mt-auto d-flex flex-wrap gap-2">
            <Link className="btn circular-btn-primary rounded-pill px-3" to={`/circulos/${circle.id}`}>
              {content.circle.join}
            </Link>
            <Link className="btn btn-light rounded-pill px-3" to={`/circulos/${circle.id}`}>
              {content.circle.details}
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default CircleCard
