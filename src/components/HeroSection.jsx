import { Link } from 'react-router-dom'

function HeroSection({ content }) {
  return (
    <section className="hero-shell py-5 py-lg-6">
      <div className="container">
        <div className="hero-card position-relative overflow-hidden rounded-5 p-4 p-lg-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="badge circular-badge mb-3">{content.hero.eyebrow}</span>
              <h1 className="display-4 fw-semibold circular-heading mb-3">{content.hero.title}</h1>
              <p className="lead circular-copy mb-4">{content.hero.description}</p>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link className="btn circular-btn-primary rounded-pill px-4 py-3" to="/explorar">
                  {content.hero.primaryCta}
                </Link>
                <Link className="btn btn-light rounded-pill px-4 py-3" to="/guias/amara-rojas">
                  {content.hero.secondaryCta}
                </Link>
              </div>

              <div className="row g-3">
                {content.hero.stats.map((item) => (
                  <div className="col-sm-4" key={item}>
                    <div className="mini-stat h-100 rounded-4 p-3">{item}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-5">
              <div className="hero-visual position-relative mx-auto">
                <div className="hero-photo photo-one" />
                <div className="hero-photo photo-two" />
                <div className="hero-bloom bloom-one" />
                <div className="hero-bloom bloom-two" />
                <div className="hero-quote rounded-4 p-3">
                  <p className="mb-1 fw-semibold">"Un espacio para volver a ti, acompañada."</p>
                  <small className="text-muted">Círculos cuidados con calidez y claridad</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
