import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import FloatingFlowerDecoration from './components/FloatingFlowerDecoration'
import Navbar from './components/Navbar'
import AuthPage from './pages/AuthPage'
import BecomeGuidePage from './pages/BecomeGuidePage'
import CircleDetailPage from './pages/CircleDetailPage'
import ExplorePage from './pages/ExplorePage'
import GuideDashboardPage from './pages/GuideDashboardPage'
import GuideProfilePage from './pages/GuideProfilePage'
import GuidesPage from './pages/GuidesPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import { uiText } from './services/content'
import { initialAccounts, initialCircles, initialGuides } from './services/mockData'
import { loadFromStorage, saveToStorage, storageKeys } from './services/storage'

const defaultFilters = {
  query: '',
  region: '',
  comuna: '',
  date: '',
  type: '',
  price: '',
}

const paypalDonationUrl = 'https://www.paypal.com/donate'

const typeLabels = {
  es: {
    sanacion: 'Sanación emocional',
    creatividad: 'Creatividad',
    espiritualidad: 'Espiritualidad',
    conexion: 'Conexión humana',
  },
  en: {
    sanacion: 'Healing',
    creatividad: 'Creativity',
    espiritualidad: 'Spirituality',
    conexion: 'Connection',
  },
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function formatPrice(price, language) {
  return new Intl.NumberFormat(language === 'es' ? 'es-CL' : 'en-US', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(price)
}

function formatDate(date, language) {
  return new Intl.DateTimeFormat(language === 'es' ? 'es-CL' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`))
}

function toSessionUser(account) {
  if (!account) {
    return null
  }

  const sessionUser = { ...account }
  delete sessionUser.password
  return sessionUser
}

function App() {
  const [language, setLanguage] = useState(() => loadFromStorage(storageKeys.language, 'es'))
  const [accounts, setAccounts] = useState(() =>
    loadFromStorage(storageKeys.accounts, initialAccounts),
  )
  const [guides, setGuides] = useState(() => loadFromStorage(storageKeys.guides, initialGuides))
  const [circles, setCircles] = useState(() => loadFromStorage(storageKeys.circles, initialCircles))
  const [registrations, setRegistrations] = useState(() =>
    loadFromStorage(storageKeys.registrations, []),
  )
  const [currentUser, setCurrentUser] = useState(() => loadFromStorage(storageKeys.user, null))
  const [filters, setFilters] = useState(defaultFilters)
  const [viewMode, setViewMode] = useState('list')

  useEffect(() => {
    saveToStorage(storageKeys.language, language)
  }, [language])

  useEffect(() => {
    saveToStorage(storageKeys.accounts, accounts)
  }, [accounts])

  useEffect(() => {
    saveToStorage(storageKeys.guides, guides)
  }, [guides])

  useEffect(() => {
    saveToStorage(storageKeys.circles, circles)
  }, [circles])

  useEffect(() => {
    saveToStorage(storageKeys.registrations, registrations)
  }, [registrations])

  useEffect(() => {
    saveToStorage(storageKeys.user, currentUser)
  }, [currentUser])

  const content = uiText[language]

  const guidesById = useMemo(
    () => Object.fromEntries(guides.map((guide) => [guide.id, guide])),
    [guides],
  )

  const enrichedCircles = useMemo(
    () =>
      circles
        .map((circle) => ({
          ...circle,
          guide: guidesById[circle.guideId],
          displayDate: formatDate(circle.date, language),
          themeLabel: circle.theme || typeLabels[language][circle.type] || circle.type,
          priceLabel:
            circle.priceType === 'free' ? content.search.free : formatPrice(circle.price, language),
        }))
        .filter((circle) => circle.guide)
        .sort((firstCircle, secondCircle) => {
          return (
            new Date(`${firstCircle.date}T${firstCircle.time}`) -
            new Date(`${secondCircle.date}T${secondCircle.time}`)
          )
        }),
    [circles, guidesById, language, content.search.free],
  )

  const regions = useMemo(
    () => [...new Set(enrichedCircles.map((circle) => circle.region))],
    [enrichedCircles],
  )

  const comunas = useMemo(() => {
    const circlesByRegion = filters.region
      ? enrichedCircles.filter((circle) => circle.region === filters.region)
      : enrichedCircles

    return [...new Set(circlesByRegion.map((circle) => circle.comuna))]
  }, [enrichedCircles, filters.region])

  const filteredCircles = useMemo(() => {
    const normalizedQuery = filters.query.trim().toLowerCase()

    return enrichedCircles.filter((circle) => {
      const matchesQuery =
        !normalizedQuery ||
        [circle.title, circle.region, circle.comuna, circle.themeLabel]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)

      const matchesRegion = !filters.region || circle.region === filters.region
      const matchesComuna = !filters.comuna || circle.comuna === filters.comuna
      const matchesDate = !filters.date || circle.date === filters.date
      const matchesType = !filters.type || circle.type === filters.type
      const matchesPrice = !filters.price || circle.priceType === filters.price

      return matchesQuery && matchesRegion && matchesComuna && matchesDate && matchesType && matchesPrice
    })
  }, [enrichedCircles, filters])

  const guideCircles = useMemo(() => {
    if (!currentUser?.guideId) {
      return []
    }

    return enrichedCircles.filter((circle) => circle.guide.id === currentUser.guideId)
  }, [currentUser, enrichedCircles])

  const guideRegistrations = useMemo(() => {
    if (!currentUser?.guideId) {
      return []
    }

    const guideCircleIds = new Set(guideCircles.map((circle) => circle.id))

    return registrations.filter((registration) => guideCircleIds.has(registration.circleId))
  }, [currentUser, guideCircles, registrations])

  const toggleLanguage = () => {
    setLanguage((currentLanguage) => (currentLanguage === 'es' ? 'en' : 'es'))
  }

  const handleFilterChange = (field, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
      ...(field === 'region' ? { comuna: '' } : {}),
    }))
  }

  const handleClearFilters = () => {
    setFilters(defaultFilters)
  }

  const handleLogin = (email, password) => {
    const account = accounts.find(
      (currentAccount) => currentAccount.email === email && currentAccount.password === password,
    )

    if (!account) {
      return { success: false }
    }

    setCurrentUser(toSessionUser(account))
    return { success: true }
  }

  const handleSignup = (formData) => {
    const emailExists = accounts.some((account) => account.email === formData.email)

    if (emailExists) {
      return { success: false }
    }

    let guideId

    if (formData.role === 'guide') {
      const baseId = slugify(formData.name)
      guideId = guidesById[baseId] ? `${baseId}-${guides.length + 1}` : baseId

      setGuides((currentGuides) => [
        ...currentGuides,
        {
          id: guideId,
          name: formData.name,
          image:
            'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
          story:
            'Estoy empezando mi camino como guía en Circular, ofreciendo encuentros sensibles y bien cuidados para crear comunidad.',
          experience:
            'Nueva guía en Circular. Puedes completar esta presentación con tu enfoque y recorrido.',
          special:
            'Mis círculos buscan abrir espacios humanos, amables y contemporáneos para compartir desde la autenticidad.',
          rating: 5,
          reviews: [],
        },
      ])
    }

    const newAccount = {
      id: crypto.randomUUID(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: formData.role,
      guideId,
    }

    setAccounts((currentAccounts) => [...currentAccounts, newAccount])
    setCurrentUser(toSessionUser(newAccount))

    return { success: true }
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  const handleJoinCircle = (circleId, formData) => {
    setRegistrations((currentRegistrations) => [
      {
        id: crypto.randomUUID(),
        circleId,
        ...formData,
      },
      ...currentRegistrations,
    ])
  }

  const handleCreateCircle = (formData) => {
    if (!currentUser?.guideId) {
      return
    }

    const normalizedPrice = formData.priceType === 'free' ? 0 : Number(formData.price || 0)

    setCircles((currentCircles) => [
      {
        id: crypto.randomUUID(),
        title: formData.title,
        shortDescription: formData.shortDescription,
        intention: formData.shortDescription,
        theme: typeLabels.es[formData.type],
        expectations:
          'Una experiencia guiada con conversación, práctica grupal y un cierre cuidado para favorecer conexión y claridad.',
        duration: '2 horas',
        materials: 'Cuaderno, agua y ropa cómoda.',
        price: normalizedPrice,
        priceType: formData.priceType,
        region: formData.region,
        comuna: formData.comuna,
        date: formData.date,
        time: formData.time,
        guideId: currentUser.guideId,
        image: formData.image,
        type: formData.type,
        locationDetails: `${formData.comuna}, ${formData.region}. Dirección a confirmar después de la inscripción.`,
      },
      ...currentCircles,
    ])
  }

  return (
    <div className="app-shell">
      <Navbar
        content={content}
        currentUser={currentUser}
        language={language}
        onToggleLanguage={toggleLanguage}
        onLogout={handleLogout}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                content={content}
                language={language}
                filters={filters}
                regions={regions}
                comunas={comunas}
                onChangeFilter={handleFilterChange}
                onClearFilters={handleClearFilters}
                filteredCircles={filteredCircles}
              />
            }
          />
          <Route
            path="/explorar"
            element={
              <ExplorePage
                content={content}
                language={language}
                filters={filters}
                regions={regions}
                comunas={comunas}
                onChangeFilter={handleFilterChange}
                onClearFilters={handleClearFilters}
                filteredCircles={filteredCircles}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            }
          />
          <Route
            path="/circulos/:circleId"
            element={
              <CircleDetailPage
                content={content}
                circles={enrichedCircles}
                currentUser={currentUser}
                onJoin={handleJoinCircle}
              />
            }
          />
          <Route
            path="/guias"
            element={<GuidesPage content={content} guides={guides} circles={enrichedCircles} />}
          />
          <Route
            path="/guias/:guideId"
            element={<GuideProfilePage content={content} guides={guides} circles={enrichedCircles} />}
          />
          <Route path="/convertirse-guia" element={<BecomeGuidePage content={content} />} />
          <Route
            path="/auth"
            element={<AuthPage content={content} onLogin={handleLogin} onSignup={handleSignup} />}
          />
          <Route
            path="/panel-guia"
            element={
              <GuideDashboardPage
                content={content}
                currentUser={currentUser}
                guideCircles={guideCircles}
                guideRegistrations={guideRegistrations}
                onCreateCircle={handleCreateCircle}
              />
            }
          />
          <Route
            path="/perfil"
            element={
              <ProfilePage
                content={content}
                currentUser={currentUser}
                registrations={registrations}
                circles={enrichedCircles}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <FloatingFlowerDecoration />
      <Footer content={content} donationUrl={paypalDonationUrl} />
    </div>
  )
}

export default App
