import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { divIcon, latLngBounds } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { getCircleCoordinates, getDistanceInKm, getMapCenter } from '../services/geo'
import useGeolocation from '../hooks/useGeolocation'
import EventMarker from './EventMarker'

const circleIcon = divIcon({
  className: 'custom-map-marker',
  html: '<span class="custom-map-marker__inner"></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

const userIcon = divIcon({
  className: 'custom-map-marker custom-map-marker-user',
  html: '<span class="custom-map-marker__inner"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

function FitMapBounds({ points }) {
  const map = useMap()

  useEffect(() => {
    if (!points.length) {
      return
    }

    const bounds = latLngBounds(points.map((point) => [point.lat, point.lng]))
    map.fitBounds(bounds, { padding: [40, 40] })
  }, [map, points])

  return null
}

function formatDistance(distance, content) {
  if (!Number.isFinite(distance)) {
    return null
  }

  const value = distance < 10 ? distance.toFixed(1) : Math.round(distance)
  return `${value} km ${content.search.away}`
}

function MapView({ circles, content }) {
  const [mappedCircles, setMappedCircles] = useState([])
  const [isLoadingMap, setIsLoadingMap] = useState(true)
  const [radiusKm, setRadiusKm] = useState(25)
  const { userLocation, mapCenter, locationError, isLocating, requestLocation } = useGeolocation()

  useEffect(() => {
    let isMounted = true

    const loadCoordinates = async () => {
      setIsLoadingMap(true)

      const resolvedCircles = await Promise.all(
        circles.map(async (circle) => {
          const coordinates = await getCircleCoordinates(circle)

          return coordinates ? { ...circle, coordinates } : null
        }),
      )

      if (isMounted) {
        setMappedCircles(resolvedCircles.filter(Boolean))
        setIsLoadingMap(false)
      }
    }

    if (!circles.length) {
      setMappedCircles([])
      setIsLoadingMap(false)
      return () => {
        isMounted = false
      }
    }

    loadCoordinates()

    return () => {
      isMounted = false
    }
  }, [circles])

  const circlesByDistance = useMemo(() => {
    const circlesWithDistance = mappedCircles
      .map((circle) => ({
        ...circle,
        distanceKm: userLocation ? getDistanceInKm(userLocation, circle.coordinates) : null,
      }))

    const filteredCircles = userLocation
      ? circlesWithDistance.filter((circle) => circle.distanceKm === null || circle.distanceKm <= radiusKm)
      : circlesWithDistance

    return filteredCircles.sort((firstCircle, secondCircle) => {
        if (firstCircle.distanceKm === null) {
          return 1
        }

        if (secondCircle.distanceKm === null) {
          return -1
        }

        return firstCircle.distanceKm - secondCircle.distanceKm
      })
  }, [mappedCircles, userLocation])

  const mapPoints = useMemo(() => {
    const points = mappedCircles.map((circle) => circle.coordinates)
    return userLocation ? [userLocation, ...points] : points
  }, [mappedCircles, userLocation])

  return (
    <section className="container pb-5">
      <div className="map-shell rounded-5 p-4 p-lg-5">
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
          <div>
            <h2 className="h4 fw-semibold circular-heading mb-2">{content.search.nearbyTitle}</h2>
            <p className="mb-0 circular-text-soft">
              {userLocation ? content.search.nearbySorted : content.search.nearbyFallback}
            </p>
          </div>

          <div className="d-flex flex-wrap gap-2 align-items-center">
            <label className="small fw-semibold mb-0">{content.search.radius}</label>
            <select
              className="form-select circular-input map-radius-select"
              disabled={!userLocation}
              value={radiusKm}
              onChange={(event) => setRadiusKm(Number(event.target.value))}
            >
              <option value="10">10 km</option>
              <option value="25">25 km</option>
              <option value="50">50 km</option>
              <option value="100">100 km</option>
            </select>

            <button
              type="button"
              className="btn circular-btn-primary rounded-pill px-4"
              disabled={isLocating}
              onClick={requestLocation}
            >
              {isLocating ? content.search.locating : content.search.useMyLocation}
            </button>
          </div>
        </div>

        {locationError && (
          <div className="alert alert-warning rounded-4 mb-4">{content.search.geolocationError}</div>
        )}

        {isLoadingMap ? (
          <div className="empty-panel rounded-5 p-5 text-center">
            <p className="mb-0">{content.search.mapLoading}</p>
          </div>
        ) : (
          <div className="row g-4 align-items-start">
            <div className="col-lg-8">
              <div className="real-map-shell rounded-5 overflow-hidden">
                <MapContainer center={mapCenter || getMapCenter()} className="real-map-canvas" scrollWheelZoom>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <FitMapBounds points={mapPoints} />

                  {userLocation && (
                    <Marker icon={userIcon} position={[userLocation.lat, userLocation.lng]}>
                      <Popup>{content.search.youAreHere}</Popup>
                    </Marker>
                  )}

                  {circlesByDistance.map((circle) => (
                    <EventMarker
                      key={circle.id}
                      circle={circle}
                      content={content}
                      distanceLabel={formatDistance(circle.distanceKm, content)}
                      icon={circleIcon}
                    />
                  ))}
                </MapContainer>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="nearby-list rounded-5 p-3 p-lg-4">
                {circlesByDistance.length ? (
                  <div className="d-grid gap-3">
                    {circlesByDistance.map((circle) => (
                      <Link
                        key={circle.id}
                        className="nearby-card rounded-4 p-3 text-decoration-none"
                        to={`/circulos/${circle.id}`}
                      >
                        <div className="d-flex justify-content-between gap-3 align-items-start">
                          <div>
                            <p className="fw-semibold mb-1 circular-heading">{circle.title}</p>
                            <p className="small text-muted mb-1">
                              {circle.comuna} · {circle.region}
                            </p>
                            <p className="small text-muted mb-0">
                              {circle.displayDate} · {circle.time}
                            </p>
                          </div>
                          {circle.distanceKm !== null && (
                            <span className="badge circular-badge">
                              {formatDistance(circle.distanceKm, content)}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="empty-panel rounded-4 p-4 text-center">
                    <p className="mb-0">{mappedCircles.length ? content.search.noNearby : content.search.mapUnavailable}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default MapView
