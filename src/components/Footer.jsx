const fallbackPayPalUrl = 'https://www.paypal.com/donate'

function Footer({ content, donationUrl = fallbackPayPalUrl }) {
  return (
    <footer className="circular-footer-section py-5 mt-4">
        <div className="row g-3 align-items-center px-4 px-md-5">

          <div className="col-lg-12">
            <div>
              <h3 className="h4 fw-semibold circular-heading mb-2 text-center">{content.donation.title}</h3>
              <p className="text-muted mb-2 text-center">{content.donation.description}</p>
              <p className="small fw-semibold circular-text-soft mb-3 text-center">{content.donation.onePersonNote}</p>
              <a
                className="btn paypal-button rounded-pill px-4 text-center"
                href={donationUrl}
                target="_blank"
                rel="noreferrer"
              >
                Donar con <strong>PayPal</strong>
              </a>
              <p className="small text-muted mt-3 mb-0 text-center">{content.donation.note}</p>
            </div>
          </div>

          <div className="col-lg-12">
            <p className="text-uppercase small fw-semibold circular-eyebrow text-center">Contacto Circular</p>
            <p className="mb-8 text-muted text-center">{content.footer}</p>
            <p className="small text-muted text-center mb-0">{content.footerDisclaimer}</p>
          </div>

        </div>
    </footer>
  )
}

export default Footer
