'use client'

import { useEffect, useMemo } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { divIcon, type LatLngExpression, type Map as LeafletMap } from 'leaflet'

export interface LeafletMapInnerProps {
  center: { lat: number; lng: number }
  markers: Array<{
    id: string
    position: { lat: number; lng: number }
    title: string
    address?: string
    rating?: number
    totalRatings?: number
    isOpen?: boolean
    distance?: number
    phone?: string
    website?: string
    onClick?: () => void
  }>
  onMapClick?: (lat: number, lng: number) => void
  zoom: number
  className: string
  onMapReady: (map: LeafletMap) => void
  onMapDispose: (map: LeafletMap) => void
}

const userLocationIcon = divIcon({
  className: 'coffee-finder-user-pin',
  html: '<div></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

const shopIcon = divIcon({
  className: 'coffee-finder-shop-pin',
  html: '<div></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

function MapRegistrar({ onMapReady, onMapDispose }: Pick<LeafletMapInnerProps, 'onMapReady' | 'onMapDispose'>) {
  const map = useMap()

  useEffect(() => {
    onMapReady(map)
    return () => {
      onMapDispose(map)
    }
  }, [map, onMapReady, onMapDispose])

  return null
}

function CenterUpdater({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])

  return null
}

function ClickHandler({ onMapClick }: Pick<LeafletMapInnerProps, 'onMapClick'>) {
  useMapEvents({
    click: (event) => {
      if (onMapClick) {
        onMapClick(event.latlng.lat, event.latlng.lng)
      }
    },
  })

  return null
}

export function LeafletMapInner({
  center,
  markers,
  onMapClick,
  zoom,
  className,
  onMapReady,
  onMapDispose,
}: Readonly<LeafletMapInnerProps>) {
  const centerPosition = useMemo<LatLngExpression>(() => [center.lat, center.lng], [center.lat, center.lng])

  return (
    <MapContainer center={centerPosition} zoom={zoom} className={className} zoomControl={true}>
      <MapRegistrar onMapReady={onMapReady} onMapDispose={onMapDispose} />
      <CenterUpdater center={centerPosition} zoom={zoom} />
      <ClickHandler onMapClick={onMapClick} />

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      <Marker position={centerPosition} icon={userLocationIcon} />

      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.position.lat, marker.position.lng]}
          icon={shopIcon}
          eventHandlers={
            marker.onClick
              ? {
                  click: marker.onClick,
                }
              : undefined
          }
        >
          <Popup>
            <div className="min-w-48 text-sm">
              <p className="font-semibold text-foreground">{marker.title}</p>

              {marker.address && <p className="text-muted-foreground mt-1">{marker.address}</p>}

              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                {marker.rating !== undefined && (
                  <p>
                    Rating: {marker.rating}
                    {marker.totalRatings ? ` (${marker.totalRatings})` : ''}
                  </p>
                )}

                {marker.distance !== undefined && <p>Distance: {Math.round(marker.distance)}m</p>}

                {marker.isOpen !== undefined && <p>Status: {marker.isOpen ? 'Open' : 'Closed'}</p>}

                {marker.phone && <p>Phone: {marker.phone}</p>}

                {marker.website && (
                  <a
                    href={marker.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
