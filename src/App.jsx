import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import FloatingFlowerDecoration from './components/FloatingFlowerDecoration'
import { supabase } from './lib/supabaseClient'
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
import { initialGuides } from './services/mockData'

const defaultFilters = {
  query: '',
  region: '',
  comuna: '',
  date: '',
  type: '',
  price: '',
}

const paypalDonationUrl = 'https://www.paypal.com/donate'
const pendingGoogleRoleKey = 'circular-pending-google-role'

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

function getSupabaseErrorMessage(error, fallbackMessage) {
  const rawMessage = error?.message || ''

  if (rawMessage === 'TypeError: Failed to fetch' || rawMessage === 'TypeError: Load failed') {
    return fallbackMessage
  }

  if (rawMessage) {
    return rawMessage
  }

  return fallbackMessage
}

function getStoredGoogleRole() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(pendingGoogleRoleKey)
}

function setStoredGoogleRole(role) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(pendingGoogleRoleKey, role)
}

function clearStoredGoogleRole() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(pendingGoogleRoleKey)
}

function normalizeGuideRecord(guide) {
  return {
    id: guide.id,
    profileId: guide.profile_id ?? null,
    name: guide.name,
    image: guide.image_url || 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
    story:
      guide.story ||
      'Esta guía forma parte de Circular y está construyendo su perfil público dentro de la plataforma.',
    experience: guide.experience || 'Perfil de guía en proceso de configuración.',
    special: guide.special || 'Círculos creados desde la comunidad Circular.',
    rating: Number(guide.rating ?? 5),
    reviews: Array.isArray(guide.reviews) ? guide.reviews : [],
  }
}

function normalizeCircleRecord(circle) {
  const normalizedPrice = Number(circle.price ?? 0)

  return {
    id: circle.id,
    title: circle.title,
    shortDescription: circle.short_description ?? '',
    intention: circle.intention ?? circle.short_description ?? '',
    theme: circle.theme ?? typeLabels.es[circle.type] ?? circle.type,
    expectations: circle.expectations ?? '',
    duration: circle.duration ?? '',
    materials: circle.materials ?? '',
    price: normalizedPrice,
    priceType: circle.price_type ?? (normalizedPrice === 0 ? 'free' : 'paid'),
    region: circle.region ?? '',
    comuna: circle.comuna ?? '',
    date: circle.date ?? '',
    time: circle.time ?? '',
    guideId: circle.guide_id ?? '',
    image: circle.image_url ?? '',
    type: circle.type ?? '',
    locationDetails: circle.location_details ?? '',
  }
}

function normalizeRegistrationRecord(registration) {
  return {
    id: registration.id,
    circleId: registration.circle_id,
    userId: registration.user_id,
    name: registration.name,
    email: registration.email,
    phone: registration.phone,
    message: registration.message ?? '',
  }
}

async function uploadImage(file) {
  const fileName = `${Date.now()}-${file.name}`
  const filePath = `circles/${fileName}`

  const { error } = await supabase.storage.from('circle-images').upload(filePath, file)

  if (error) {
    console.error(error)
    return null
  }

  const { data: publicUrlData } = supabase.storage.from('circle-images').getPublicUrl(filePath)

  return publicUrlData.publicUrl
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function getUserDisplayName(user) {
  const metadata = user?.user_metadata ?? {}

  return (
    metadata.full_name ||
    metadata.name ||
    metadata.user_name ||
    user?.email?.split('@')[0] ||
    'Circular'
  )
}

function getUserAvatar(user) {
  const metadata = user?.user_metadata ?? {}

  return metadata.avatar_url || metadata.picture || null
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

function toCurrentUser(user) {
  if (!user) {
    return null
  }

  const metadata = user.user_metadata ?? {}

  return {
    id: user.id,
    email: user.email ?? '',
    name: getUserDisplayName(user),
    phone: metadata.phone || '',
    role: metadata.role || 'participant',
    guideId: metadata.guideId || null,
    avatar: getUserAvatar(user),
  }
}

async function loadGuideIdForProfile(profileId) {
  if (!profileId) {
    return null
  }

  const { data, error } = await supabase.from('guides').select('id').eq('profile_id', profileId).maybeSingle()

  if (error) {
    console.error(error)
    return null
  }

  return data?.id ?? null
}

async function getAvailableGuideId(name, profileId) {
  const baseId = slugify(name) || `guia-${profileId?.slice(0, 8) ?? Date.now()}`
  let candidate = baseId
  let suffix = 1

  while (true) {
    const { data, error } = await supabase
      .from('guides')
      .select('id, profile_id')
      .eq('id', candidate)
      .maybeSingle()

    if (error) {
      console.error(error)
      return candidate
    }

    if (!data || data.profile_id === profileId) {
      return candidate
    }

    candidate = `${baseId}-${suffix}`
    suffix += 1
  }
}

async function loadProfileForUser(user) {
  if (!user) {
    return null
  }

  const metadata = user.user_metadata ?? {}
  const fallbackUser = toCurrentUser(user)

  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()

  if (error) {
    console.error(error)
    return fallbackUser
  }

  if (!data) {
    return fallbackUser
  }

  const role = data.role || metadata.role || 'participant'
  const guideId =
    role === 'guide' ? await loadGuideIdForProfile(user.id) : metadata.guideId || null

  return {
    id: user.id,
    email: data.email || user.email || '',
    name: data.name || getUserDisplayName(user),
    phone: data.phone || metadata.phone || '',
    role,
    guideId,
    avatar: getUserAvatar(user),
  }
}

function App() {
  const [language, setLanguage] = useState('es')
  const [guides, setGuides] = useState(initialGuides)
  const [circles, setCircles] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [filters, setFilters] = useState(defaultFilters)
  const [viewMode, setViewMode] = useState('list')

  const syncAuthenticatedUser = useCallback(async (user, preferredRole = null) => {
    if (!user) {
      clearStoredGoogleRole()
      return null
    }

    const fallbackUser = toCurrentUser(user)
    const profileName = getUserDisplayName(user)
    const profileEmail = user.email ?? ''

    try {
      const { data: existingProfile, error: profileLookupError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (profileLookupError) {
        console.error(profileLookupError)
        return fallbackUser
      }

      // Keep OAuth users aligned with the same profiles/guides tables used by email auth.
      const role = existingProfile?.role || preferredRole || user.user_metadata?.role || 'participant'
      const profilePayload = {
        id: user.id,
        name: existingProfile?.name || profileName,
        email: existingProfile?.email || profileEmail,
        role,
      }

      const { error: profileUpsertError } = await supabase.from('profiles').upsert([profilePayload])

      if (profileUpsertError) {
        console.error(profileUpsertError)
        return fallbackUser
      }

      if (role === 'guide') {
        const { data: existingGuide, error: guideLookupError } = await supabase
          .from('guides')
          .select('*')
          .eq('profile_id', user.id)
          .maybeSingle()

        if (guideLookupError) {
          console.error(guideLookupError)
        } else if (existingGuide) {
          setGuides((currentGuides) => {
            const nextGuide = normalizeGuideRecord(existingGuide)
            const filteredGuides = currentGuides.filter((guide) => guide.id !== nextGuide.id)
            return [...filteredGuides, nextGuide]
          })
        } else {
          const guideId = await getAvailableGuideId(profilePayload.name, user.id)
          const guidePayload = {
            id: guideId,
            profile_id: user.id,
            name: profilePayload.name,
            image_url:
              getUserAvatar(user) ||
              'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
            story:
              'Estoy empezando mi camino como guía en Circular, ofreciendo encuentros sensibles y bien cuidados para crear comunidad.',
            experience:
              'Nueva guía en Circular. Puedes completar esta presentación con tu enfoque y recorrido.',
            special:
              'Mis círculos buscan abrir espacios humanos, amables y contemporáneos para compartir desde la autenticidad.',
            rating: 5,
            reviews: [],
          }

          const { data: insertedGuide, error: guideCreateError } = await supabase
            .from('guides')
            .upsert([guidePayload])
            .select()
            .single()

          if (guideCreateError) {
            console.error(guideCreateError)
          } else if (insertedGuide) {
            setGuides((currentGuides) => {
              const nextGuide = normalizeGuideRecord(insertedGuide)
              const filteredGuides = currentGuides.filter((guide) => guide.id !== nextGuide.id)
              return [...filteredGuides, nextGuide]
            })
          }
        }
      }

      clearStoredGoogleRole()
      return loadProfileForUser(user)
    } catch (error) {
      console.error(error)
      return fallbackUser
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const syncCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (isMounted) {
        const profileUser = await syncAuthenticatedUser(user, getStoredGoogleRole())
        setCurrentUser(profileUser)
      }
    }

    syncCurrentUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncAuthenticatedUser(session?.user ?? null, getStoredGoogleRole()).then((profileUser) => {
        setCurrentUser(profileUser)
      })
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [syncAuthenticatedUser])

  useEffect(() => {
    const loadGuides = async () => {
      try {
        const { data, error } = await supabase.from('guides').select('*')

        if (error) {
          console.error(error)
          return
        }

        if (data?.length) {
          setGuides(data.map(normalizeGuideRecord))
        }
      } catch (error) {
        console.warn(getSupabaseErrorMessage(error, 'No se pudieron cargar las guias desde Supabase.'))
      }
    }

    loadGuides()
  }, [])

  useEffect(() => {
    const loadCircles = async () => {
      try {
        const { data, error } = await supabase.from('circles').select('*')

        if (error) {
          console.error(error)
          return
        }

        setCircles((data ?? []).map(normalizeCircleRecord))
      } catch (error) {
        console.warn(getSupabaseErrorMessage(error, 'No se pudieron cargar los circulos desde Supabase.'))
      }
    }

    loadCircles()
  }, [])

  useEffect(() => {
    const loadRegistrations = async () => {
      if (!currentUser) {
        setRegistrations([])
        return
      }

      try {
        const { data, error } = await supabase.from('registrations').select('*')

        if (error) {
          console.error(error)
          return
        }

        setRegistrations((data ?? []).map(normalizeRegistrationRecord))
      } catch (error) {
        console.warn(getSupabaseErrorMessage(error, 'No se pudieron cargar las inscripciones desde Supabase.'))
      }
    }

    loadRegistrations()
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
          guide:
            guidesById[circle.guideId] ??
            {
              id: circle.guideId,
              name:
                circle.guideId === currentUser?.guideId && currentUser?.name
                  ? currentUser.name
                  : 'Guía de Circular',
              image:
                'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
              story:
                'Esta guía está comenzando su presencia en Circular. Pronto podrá completar su perfil público.',
              experience: 'Perfil de guía en proceso de configuración.',
              special: 'Círculos creados desde la comunidad Circular.',
              rating: 5,
              reviews: [],
            },
          displayDate: formatDate(circle.date, language),
          themeLabel: circle.theme || typeLabels[language][circle.type] || circle.type,
          priceLabel:
            circle.priceType === 'free' ? content.search.free : formatPrice(circle.price, language),
        }))
        .sort((firstCircle, secondCircle) => {
          return (
            new Date(`${firstCircle.date}T${firstCircle.time}`) -
            new Date(`${secondCircle.date}T${secondCircle.time}`)
          )
        }),
    [circles, guidesById, language, content.search.free, currentUser],
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

  const handleLogin = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error || !data.user) {
        return { success: false, message: error?.message }
      }

      const profileUser = await syncAuthenticatedUser(data.user)
      setCurrentUser(profileUser)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: getSupabaseErrorMessage(error, content.auth.networkError),
      }
    }
  }

  const handleSignup = async (formData) => {
    try {
      let guideId

      if (formData.role === 'guide') {
        const baseId = slugify(formData.name)
        guideId = guidesById[baseId] ? `${baseId}-${guides.length + 1}` : baseId
      }

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: formData.role,
            guideId,
          },
        },
      })

      if (error) {
        const rawMessage = error.message?.toLowerCase() ?? ''

        if (rawMessage.includes('rate limit')) {
          return { success: false, message: content.auth.rateLimitError }
        }

        return { success: false, message: error.message }
      }

      const profilePayload = {
        id: data.user?.id,
        name: formData.name,
        email: formData.email,
        role: formData.role,
      }

      if (data.user?.id) {
        const { error: profileError } = await supabase.from('profiles').upsert([profilePayload])

        if (profileError) {
          console.error(profileError)
          return { success: false, message: profileError.message }
        }
      }

      if (formData.role === 'guide' && guideId && data.user?.id) {
        const guidePayload = {
          id: guideId,
          profile_id: data.user.id,
          name: formData.name,
          image_url:
            'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
          story:
            'Estoy empezando mi camino como guía en Circular, ofreciendo encuentros sensibles y bien cuidados para crear comunidad.',
          experience:
            'Nueva guía en Circular. Puedes completar esta presentación con tu enfoque y recorrido.',
          special:
            'Mis círculos buscan abrir espacios humanos, amables y contemporáneos para compartir desde la autenticidad.',
          rating: 5,
          reviews: [],
        }

        const { data: insertedGuide, error: guideError } = await supabase
          .from('guides')
          .upsert([guidePayload])
          .select()
          .single()

        if (guideError) {
          console.error(guideError)
          return { success: false, message: guideError.message }
        }

        setGuides((currentGuides) => {
          const nextGuide = normalizeGuideRecord(insertedGuide)
          const filteredGuides = currentGuides.filter((guide) => guide.id !== nextGuide.id)
          return [...filteredGuides, nextGuide]
        })
      }

      if (data.session?.user) {
        const profileUser = await syncAuthenticatedUser(data.session.user, formData.role)
        setCurrentUser(profileUser)
      }

      return { success: true, sessionCreated: Boolean(data.session) }
    } catch (error) {
      return {
        success: false,
        message: getSupabaseErrorMessage(error, content.auth.networkError),
      }
    }
  }

  const handleGoogleAuth = async (preferredRole = null) => {
    try {
      // Google redirects away from the app, so we persist the chosen role for first-time users.
      setStoredGoogleRole(preferredRole || 'participant')

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window === 'undefined' ? undefined : `${window.location.origin}/auth`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        clearStoredGoogleRole()
        return { success: false, message: error.message }
      }

      return { success: true, redirecting: Boolean(data?.url) }
    } catch (error) {
      clearStoredGoogleRole()
      return {
        success: false,
        message: getSupabaseErrorMessage(error, content.auth.networkError),
      }
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setCurrentUser(null)
  }

  const handleJoinCircle = async (circleId, formData) => {
    const payload = {
      circle_id: circleId,
      user_id: currentUser?.id ?? null,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
    }

    const { data, error } = await supabase.from('registrations').insert([payload]).select().single()

    if (error) {
      console.error(error)
      return { success: false }
    }

    setRegistrations((currentRegistrations) => [
      normalizeRegistrationRecord(data),
      ...currentRegistrations,
    ])

    return { success: true }
  }

  const handleCreateCircle = async (formData) => {
    if (!currentUser?.guideId) {
      return { success: false }
    }

    const normalizedPrice = formData.priceType === 'free' ? 0 : Number(formData.price || 0)
    const imageUrl = await uploadImage(formData.image)

    if (!imageUrl) {
      return { success: false }
    }

    const payload = {
      title: formData.title,
      short_description: formData.shortDescription,
      intention: formData.shortDescription,
      theme: typeLabels.es[formData.type],
      expectations:
        'Una experiencia guiada con conversación, práctica grupal y un cierre cuidado para favorecer conexión y claridad.',
      duration: '2 horas',
      materials: 'Cuaderno, agua y ropa cómoda.',
      price: normalizedPrice,
      price_type: formData.priceType,
      region: formData.region,
      comuna: formData.comuna,
      date: formData.date,
      time: formData.time,
      guide_id: currentUser.guideId,
      image_url: imageUrl,
      type: formData.type,
      location_details: `${formData.comuna}, ${formData.region}. Dirección a confirmar después de la inscripción.`,
    }

    const { data, error } = await supabase.from('circles').insert([payload]).select().single()

    if (error) {
      console.error(error)
      return { success: false }
    }

    setCircles((currentCircles) => [normalizeCircleRecord(data), ...currentCircles])

    return { success: true }
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
            element={
              <AuthPage
                content={content}
                currentUser={currentUser}
                onLogin={handleLogin}
                onSignup={handleSignup}
                onGoogleAuth={handleGoogleAuth}
              />
            }
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
