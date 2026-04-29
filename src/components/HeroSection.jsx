import { Link } from 'react-router-dom'

function HeroSection({ content }) {
  return (
    <section className="hero-shell py-5 py-lg-6">
      <div className="container">
        <div className="hero-card position-relative overflow-hidden rounded-5 p-4 p-lg-5">
          <div className="hero-background" aria-hidden="true">
            <img src="/hero-hands.png" alt="" className="hero-background-image" />
          </div>

          <div className="row align-items-center g-4 position-relative">
            <div className="col-lg-7 hero-copy-column">
              <span className="badge circular-badge mb-3">{content.hero.eyebrow}</span>
              <h1 className="display-4 fw-semibold circular-heading mb-3">{content.hero.title}</h1>
              <p className="lead circular-copy mb-4">{content.hero.description}</p>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link className="btn circular-btn-primary rounded-pill px-4 py-3" to="/explorar">
                  {content.hero.primaryCta}
                </Link>
                <Link className="btn btn-light rounded-pill px-4 py-3" to="/guias">
                  {content.hero.secondaryCta}
                </Link>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="hero-quote rounded-4 p-3 p-lg-4">
                <p className="mb-1 fw-semibold">"Tejiendo comunidad entre mujeres."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
