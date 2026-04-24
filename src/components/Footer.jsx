const fallbackPayPalUrl = 'https://www.paypal.com/donate'

function Footer({ content, donationUrl = fallbackPayPalUrl }) {
  return (
    <footer className="circular-footer-section py-5 mt-4">
      <div className="circular-footer-inner px-4 px-md-5">
        <div className="g-1 align-items-center">
          <div className="col-lg-7">
            <p className="text-uppercase small fw-semibold circular-eyebrow mb-2">Contacto</p>
            <p className="mb-3 text-muted">{content.footer}</p>
          </div>

          <div className="col-lg-5">
            <div>
              <h3 className="h4 fw-semibold circular-heading mb-2">{content.donation.title}</h3>
              <p className="text-muted mb-2">{content.donation.description}</p>
              <p className="small fw-semibold circular-text-soft mb-3">{content.donation.onePersonNote}</p>
              <a
                className="btn paypal-button rounded-pill px-4"
                href={donationUrl}
                target="_blank"
                rel="noreferrer"
              >
                Donar con <strong>PayPal</strong>
              </a>
              <p className="small text-muted mt-3 mb-0">{content.donation.note}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
