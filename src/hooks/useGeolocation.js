import { useEffect, useState } from 'react'
import { getMapCenter } from '../services/geo'

function useGeolocation() {
  const fallbackLocation = getMapCenter()
  const [userLocation, setUserLocation] = useState(null)
  const [mapCenter, setMapCenter] = useState(fallbackLocation)
  const [locationError, setLocationError] = useState('')
  const [isLocating, setIsLocating] = useState(true)

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('unsupported')
      setMapCenter(fallbackLocation)
      setIsLocating(false)
      return
    }

    setIsLocating(true)
    setLocationError('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }

        setUserLocation(nextLocation)
        setMapCenter(nextLocation)
        setIsLocating(false)
      },
      () => {
        setLocationError('denied')
        setMapCenter(fallbackLocation)
        setIsLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    )
  }

  useEffect(() => {
    requestLocation()
  }, [])

  return {
    userLocation,
    mapCenter,
    locationError,
    isLocating,
    requestLocation,
  }
}

export default useGeolocation
