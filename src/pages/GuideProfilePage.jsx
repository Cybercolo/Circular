import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import CircleFeed from '../components/CircleFeed'

function GuideProfilePage({ content, guides, circles }) {
  const { guideId } = useParams()

  const guide = useMemo(
    () => guides.find((currentGuide) => currentGuide.id === guideId),
    [guideId, guides],
  )

  const guideCircles = circles.filter((circle) => circle.guide.id === guideId)

  if (!guide) {
    return (
      <div className="container py-5">
        <div className="empty-panel rounded-5 p-5 text-center">
          <p className="mb-0">No encontramos a esta guía.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4 py-lg-5">
      <div className="guide-hero rounded-5 p-4 p-lg-5 mb-5">
        <div className="row align-items-center g-4">
          <div className="col-lg-4 text-center text-lg-start">
            <img src={guide.image} alt={guide.name} className="guide-profile-image" />
          </div>
          <div className="col-lg-8">
            <p className="text-uppercase small fw-semibold circular-eyebrow mb-2">
              {content.guide.title}
            </p>
            <h1 className="display-5 fw-semibold circular-heading mb-3">{guide.name}</h1>
            <p className="lead text-muted mb-4">{guide.story}</p>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="detail-info rounded-5 p-4 h-100">
                  <p className="small text-uppercase circular-eyebrow mb-2">{content.guide.experience}</p>
                  <p className="mb-0">{guide.experience}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="detail-info rounded-5 p-4 h-100">
                  <p className="small text-uppercase circular-eyebrow mb-2">{content.guide.special}</p>
                  <p className="mb-0">{guide.special}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <p className="text-uppercase small fw-semibold circular-eyebrow mb-1">
              {content.guide.rating}
            </p>
            <h2 className="fw-semibold circular-heading mb-0">{guide.rating}/5</h2>
          </div>
        </div>
        <div className="row row-cols-1 row-cols-lg-2 g-4">
          {guide.reviews.map((review) => (
            <div className="col" key={`${guide.id}-${review.name}`}>
              <div className="review-card rounded-5 p-4 h-100">
                <p className="fw-semibold mb-2">
                  {review.name} · {review.stars}/5
                </p>
                <p className="mb-0 text-muted">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <p className="text-uppercase small fw-semibold circular-eyebrow mb-1">
            {content.guide.circles}
          </p>
          <h2 className="fw-semibold circular-heading mb-0">{guideCircles.length}</h2>
        </div>
        <CircleFeed circles={guideCircles} content={content} />
      </section>
    </div>
  )
}

export default GuideProfilePage
