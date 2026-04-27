import { Link } from 'react-router-dom'
import { Popup, Marker } from 'react-leaflet'

function EventMarker({ circle, content, icon, distanceLabel }) {
  return (
    <Marker icon={icon} position={[circle.coordinates.lat, circle.coordinates.lng]}>
      <Popup>
        <div className="map-popup-copy">
          <strong>{circle.title}</strong>
          <div>{circle.displayDate} · {circle.time}</div>
          <div>{circle.guide?.name || content.circle.guide}</div>
          <p className="small mb-2 mt-2">{circle.shortDescription}</p>
          {distanceLabel && <small>{distanceLabel}</small>}
          <div className="mt-2">
            <Link to={`/circulos/${circle.id}`}>{content.circle.details}</Link>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}

export default EventMarker
