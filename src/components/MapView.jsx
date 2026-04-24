import { Link } from 'react-router-dom'

const mapPositions = [
  { top: '18%', left: '68%' },
  { top: '28%', left: '22%' },
  { top: '44%', left: '28%' },
  { top: '56%', left: '64%' },
  { top: '72%', left: '38%' },
  { top: '82%', left: '58%' },
]

function MapView({ circles, content }) {
  if (!circles.length) {
    return (
      <div className="container pb-5">
        <div className="empty-panel rounded-5 p-5 text-center">
          <p className="mb-0">{content.search.empty}</p>
        </div>
      </div>
    )
  }

  return (
    <section className="container pb-5">
      <div className="map-shell rounded-5 p-4 p-lg-5">
        <div className="map-surface position-relative rounded-5">
          {circles.map((circle, index) => {
            const position = mapPositions[index % mapPositions.length]

            return (
              <Link
                key={circle.id}
                to={`/circulos/${circle.id}`}
                className="map-pin text-decoration-none"
                style={position}
              >
                <span className="map-dot" />
                <span className="map-label rounded-4">
                  <strong>{circle.comuna}</strong>
                  <small>{circle.title}</small>
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default MapView
