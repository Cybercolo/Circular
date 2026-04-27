import { Link } from 'react-router-dom'

function ProfilePage({ content, currentUser, registrations, circles }) {
  if (!currentUser) {
    return (
      <div className="container py-5">
        <div className="empty-panel rounded-5 p-5 text-center">
          <h1 className="h2 fw-semibold circular-heading mb-3">{content.profile.title}</h1>
          <p className="text-muted mb-4">Necesitas iniciar sesión para ver tu perfil.</p>
          <Link className="btn circular-btn-primary rounded-pill px-4" to="/auth">
            {content.nav.login}
          </Link>
        </div>
      </div>
    )
  }

  const upcomingRegistrations = registrations
    .filter((registration) => registration.email === currentUser.email)
    .map((registration) => ({
      ...registration,
      circle: circles.find((circle) => circle.id === registration.circleId),
    }))
    .filter((registration) => registration.circle)

  return (
    <div className="container py-4 py-lg-5">
      <div className="guide-hero rounded-5 p-4 p-lg-5 mb-4">
        {currentUser.avatar ? (
          <img
            alt={currentUser.name}
            className="profile-avatar mb-4"
            referrerPolicy="no-referrer"
            src={currentUser.avatar}
          />
        ) : (
          <div className="profile-avatar profile-avatar-fallback mb-4">
            {currentUser.name?.charAt(0)?.toUpperCase() || 'C'}
          </div>
        )}
        <p className="text-uppercase small fw-semibold circular-eyebrow mb-2">{content.profile.title}</p>
        <h1 className="display-6 fw-semibold circular-heading mb-2">{currentUser.name}</h1>
        <p className="mb-2 text-muted">{currentUser.email}</p>
        <span className="badge circular-badge">
          {content.profile.roleLabels[currentUser.role] || currentUser.role}
        </span>
      </div>

      <div className="detail-summary rounded-5 p-4">
        <h2 className="h4 fw-semibold circular-heading mb-4">{content.profile.upcoming}</h2>
        {upcomingRegistrations.length ? (
          <div className="d-grid gap-3">
            {upcomingRegistrations.map((registration) => (
              <div className="mini-circle rounded-4 p-3" key={registration.id}>
                <p className="fw-semibold mb-1">{registration.circle.title}</p>
                <p className="small text-muted mb-1">
                  {registration.circle.date} · {registration.circle.time}
                </p>
                <p className="small mb-3">
                  {registration.circle.region} · {registration.circle.comuna}
                </p>
                <Link
                  className="btn circular-btn-primary rounded-pill px-3 py-2"
                  to={`/circulos/${registration.circle.id}`}
                >
                  {content.profile.viewEvent}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="mb-0 text-muted">{content.profile.noReservations}</p>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
