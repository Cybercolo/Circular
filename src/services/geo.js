const chileCenter = {
  lat: -33.4489,
  lng: -70.6693,
}

const comunaCoordinates = {
  'providencia|metropolitana': { lat: -33.4263, lng: -70.6167 },
  'nunoa|metropolitana': { lat: -33.4569, lng: -70.5979 },
  'vina-del-mar|valparaiso': { lat: -33.0153, lng: -71.5500 },
  'concepcion|biobio': { lat: -36.8270, lng: -73.0503 },
  'puerto-varas|los-lagos': { lat: -41.3195, lng: -72.9854 },
  'temuco|araucania': { lat: -38.7359, lng: -72.5904 },
}

function slugifyLocation(value) {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function getCircleCacheKey(circle) {
  return `circular-geocode-${circle.id}`
}

function getStoredCoordinates(circle) {
  if (typeof window === 'undefined') {
    return null
  }

  const cached = window.localStorage.getItem(getCircleCacheKey(circle))

  if (!cached) {
    return null
  }

  try {
    return JSON.parse(cached)
  } catch {
    return null
  }
}

function storeCoordinates(circle, coordinates) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(getCircleCacheKey(circle), JSON.stringify(coordinates))
}

function getFallbackCoordinates(circle) {
  const key = `${slugifyLocation(circle.comuna)}|${slugifyLocation(circle.region)}`
  return comunaCoordinates[key] ?? null
}

export function getMapCenter() {
  return chileCenter
}

export function getDistanceInKm(origin, destination) {
  if (!origin || !destination) {
    return null
  }

  const toRadians = (degrees) => (degrees * Math.PI) / 180
  const earthRadiusKm = 6371
  const deltaLat = toRadians(destination.lat - origin.lat)
  const deltaLng = toRadians(destination.lng - origin.lng)
  const startLat = toRadians(origin.lat)
  const endLat = toRadians(destination.lat)

  const haversine =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(deltaLng / 2) ** 2

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

export async function getCircleCoordinates(circle) {
  const latitude = Number(circle.latitude)
  const longitude = Number(circle.longitude)

  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    return { lat: latitude, lng: longitude }
  }

  const storedCoordinates = getStoredCoordinates(circle)
  if (storedCoordinates) {
    return storedCoordinates
  }

  const fallbackCoordinates = getFallbackCoordinates(circle)
  if (fallbackCoordinates) {
    storeCoordinates(circle, fallbackCoordinates)
    return fallbackCoordinates
  }

  try {
    const query = encodeURIComponent([circle.comuna, circle.region, 'Chile'].filter(Boolean).join(', '))
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=cl&q=${query}`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    )

    if (!response.ok) {
      return null
    }

    const results = await response.json()
    const match = results?.[0]

    if (!match) {
      return null
    }

    const coordinates = {
      lat: Number(match.lat),
      lng: Number(match.lon),
    }

    if (!Number.isFinite(coordinates.lat) || !Number.isFinite(coordinates.lng)) {
      return null
    }

    storeCoordinates(circle, coordinates)
    return coordinates
  } catch {
    return null
  }
}
