'use client'

import { useEffect, useMemo } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { divIcon, type LatLngExpression, type Map as LeafletMap } from 'leaflet'
import { Coffee, MapPin, Star, Navigation, Phone, ExternalLink, Clock } from 'lucide-react'

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
          <Popup className="coffee-finder-popup">
            <div className="flex flex-col gap-3 min-w-[260px] max-w-[300px] text-sm p-0 m-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-base text-foreground leading-tight flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="line-clamp-2">{marker.title}</span>
                  </h3>
                  {marker.isOpen !== undefined && (
                    <span
                      className={`inline-flex items-center gap-1 mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${marker.isOpen
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                        }`}
                    >
                      <Clock className="w-3 h-3" />
                      {marker.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                  )}
                </div>
                {marker.rating !== undefined && (
                  <div className="flex flex-col items-end flex-shrink-0">
                    <div className="flex items-center gap-1 bg-orange-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-md font-bold text-xs">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{marker.rating}</span>
                    </div>
                    {marker.totalRatings && (
                      <span className="text-[10px] text-muted-foreground mt-0.5 font-medium">({marker.totalRatings})</span>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2 mt-1">
                {marker.address && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span className="text-xs leading-tight">{marker.address}</span>
                  </div>
                )}
                {marker.distance !== undefined && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Navigation className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-xs font-medium">{Math.round(marker.distance)}m away</span>
                  </div>
                )}
                {marker.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-xs hover:text-foreground cursor-pointer transition-colors hover:underline">
                      {marker.phone}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-1 pt-3 border-t border-border/50">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${marker.position.lat},${marker.position.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 py-1.5 px-3 rounded-md text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Directions
                </a>
                {marker.website && (
                  <a
                    href={marker.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 py-1.5 px-3 rounded-md text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Website
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
