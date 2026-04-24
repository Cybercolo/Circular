import { Link } from 'react-router-dom'

function GuidePreview({ guide, content }) {
  return (
    <div className="guide-preview rounded-5 p-4">
      <div className="d-flex flex-column flex-sm-row gap-3 align-items-sm-center">
        <img src={guide.image} alt={guide.name} className="guide-avatar" />
        <div>
          <p className="text-uppercase small fw-semibold circular-eyebrow mb-1">{content.guide.title}</p>
          <h3 className="h4 fw-semibold circular-heading mb-2">{guide.name}</h3>
          <p className="mb-2 text-muted">{guide.experience}</p>
          <p className="mb-3">
            {content.guide.rating}: <strong>{guide.rating}/5</strong>
          </p>
          <Link className="btn btn-light rounded-pill px-3" to={`/guias/${guide.id}`}>
            {content.localeLabel === 'ES' ? 'Ver perfil' : 'View profile'}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GuidePreview
