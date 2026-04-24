import CircleCard from './CircleCard'

function CircleFeed({ circles, content }) {
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
      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        {circles.map((circle) => (
          <CircleCard key={circle.id} circle={circle} content={content} />
        ))}
      </div>
    </section>
  )
}

export default CircleFeed
