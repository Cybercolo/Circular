import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import GuidePreview from '../components/GuidePreview'
import JoinCircleForm from '../components/JoinCircleForm'

function CircleDetailPage({ content, circles, currentUser, onJoin }) {
  const { circleId } = useParams()

  const circle = useMemo(
    () => circles.find((currentCircle) => currentCircle.id === circleId),
    [circleId, circles],
  )

  if (!circle) {
    return (
      <div className="container py-5">
        <div className="empty-panel rounded-5 p-5 text-center">
          <p className="mb-3">Este círculo no está disponible.</p>
          <Link className="btn circular-btn-primary rounded-pill px-4" to="/explorar">
            {content.nav.explore}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4 py-lg-5">
      <div className="row g-4">
        <div className="col-lg-7">
          <img src={circle.image} alt={circle.title} className="detail-image rounded-5 mb-4" />
          <span className="badge circular-badge mb-3">{circle.themeLabel}</span>
          <h1 className="display-5 fw-semibold circular-heading mb-3">{circle.title}</h1>
          <p className="lead text-muted mb-4">{circle.shortDescription}</p>

          <div className="detail-info rounded-5 p-4 mb-4">
            <div className="row row-cols-1 row-cols-md-2 g-3">
              <div>
                <p className="small text-uppercase circular-eyebrow mb-1">{content.circle.intention}</p>
                <p className="mb-0">{circle.intention}</p>
              </div>
              <div>
                <p className="small text-uppercase circular-eyebrow mb-1">{content.circle.expect}</p>
                <p className="mb-0">{circle.expectations}</p>
              </div>
              <div>
                <p className="small text-uppercase circular-eyebrow mb-1">{content.circle.duration}</p>
                <p className="mb-0">{circle.duration}</p>
              </div>
              <div>
                <p className="small text-uppercase circular-eyebrow mb-1">{content.circle.materials}</p>
                <p className="mb-0">{circle.materials}</p>
              </div>
              <div>
                <p className="small text-uppercase circular-eyebrow mb-1">Precio</p>
                <p className="mb-0">{circle.priceLabel}</p>
              </div>
              <div>
                <p className="small text-uppercase circular-eyebrow mb-1">{content.circle.location}</p>
                <p className="mb-0">{circle.locationDetails}</p>
              </div>
            </div>
          </div>

          <JoinCircleForm
            content={content}
            currentUser={currentUser}
            circleId={circle.id}
            onJoin={onJoin}
          />
        </div>

        <div className="col-lg-5">
          <div className="sticky-lg-top detail-sidebar">
            <div className="detail-summary rounded-5 p-4 mb-4">
              <ul className="list-unstyled d-grid gap-3 mb-0">
                <li>
                  <strong>{circle.displayDate}</strong> · {circle.time}
                </li>
                <li>
                  {circle.region} · {circle.comuna}
                </li>
                <li>{circle.priceLabel}</li>
              </ul>
            </div>

            <GuidePreview guide={circle.guide} content={content} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CircleDetailPage
