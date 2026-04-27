import { Link, NavLink } from 'react-router-dom'

function Navbar({ content, currentUser, language, onToggleLanguage, onLogout }) {
  return (
    <header className="sticky-top border-bottom border-white border-opacity-50">
      <nav className="navbar navbar-expand-lg circular-navbar py-3">
        <div className="container">
          <Link className="navbar-brand circular-brand" to="/">
            <img alt="Circular" className="circular-brand-logo" src="/circular-logo.png" />
            <span>Circular</span>
          </Link>

          <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3 ms-lg-auto">
            <div className="d-flex flex-wrap align-items-center gap-2 gap-lg-3">
              <NavLink className="nav-link circular-nav-link px-0" to="/explorar">
                {content.nav.explore}
              </NavLink>
              <NavLink className="nav-link circular-nav-link px-0" to="/convertirse-guia">
                {content.nav.becomeGuide}
              </NavLink>
              {currentUser?.role === 'guide' && (
                <NavLink className="nav-link circular-nav-link px-0" to="/panel-guia">
                  {content.nav.dashboard}
                </NavLink>
              )}
            </div>

            <div className="d-flex flex-wrap align-items-center gap-2">
              <button
                type="button"
                className="btn btn-sm circular-language-toggle"
                onClick={onToggleLanguage}
              >
                {language === 'es' ? content.alternateLocaleLabel : content.alternateLocaleLabel}
              </button>

              {currentUser ? (
                <>
                  <div className="navbar-user-chip rounded-pill px-2 py-2">
                    {currentUser.avatar ? (
                      <img
                        alt={currentUser.name}
                        className="navbar-user-avatar"
                        referrerPolicy="no-referrer"
                        src={currentUser.avatar}
                      />
                    ) : (
                      <span className="navbar-user-avatar navbar-user-avatar-fallback">
                        {currentUser.name?.charAt(0)?.toUpperCase() || 'C'}
                      </span>
                    )}
                    <div className="navbar-user-copy">
                      <span className="navbar-user-name">{currentUser.name}</span>
                      <span className="navbar-user-email">{currentUser.email}</span>
                    </div>
                  </div>
                  <NavLink className="btn btn-light rounded-pill px-3" to="/perfil">
                    {content.nav.profile}
                  </NavLink>
                  <button
                    type="button"
                    className="btn btn-outline-danger rounded-pill px-3"
                    onClick={onLogout}
                  >
                    {content.nav.logout}
                  </button>
                </>
              ) : (
                <NavLink className="btn circular-btn-primary circular-login-button rounded-pill px-4" to="/auth">
                  {content.nav.login}
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
