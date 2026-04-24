import { Link } from 'react-router-dom'

function GuidesPage({ content, guides, circles }) {
  return (
    <div className="container py-4 py-lg-5">
      <div className="guide-hero rounded-5 p-4 p-lg-5 mb-5">
        <p className="text-uppercase small fw-semibold circular-eyebrow mb-2">
          {content.guide.directoryEyebrow}
        </p>
        <h1 className="display-5 fw-semibold circular-heading mb-3">{content.guide.directoryTitle}</h1>
        <p className="lead text-muted mb-0">{content.guide.directoryDescription}</p>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        {guides.map((guide) => {
          const guideCircles = circles.filter((circle) => circle.guide.id === guide.id)

          return (
            <div className="col" key={guide.id}>
              <article className="review-card rounded-5 p-4 h-100">
                <img src={guide.image} alt={guide.name} className="guides-feed-image mb-4" />
                <p className="small text-uppercase circular-eyebrow mb-2">{content.guide.title}</p>
                <h2 className="h4 fw-semibold circular-heading mb-2">{guide.name}</h2>
                <p className="text-muted mb-3">{guide.story}</p>
                <p className="small mb-2">
                  <strong>{content.guide.rating}:</strong> {guide.rating}/5
                </p>
                <p className="small mb-4">
                  <strong>{content.guide.circles}:</strong> {guideCircles.length}
                </p>
                <div className="mt-auto d-flex gap-2">
                  <Link className="btn circular-btn-primary rounded-pill px-4" to={`/guias/${guide.id}`}>
                    {content.guide.viewProfile}
                  </Link>
                </div>
              </article>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GuidesPage
