'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import type { Map as LeafletMap } from 'leaflet'

interface LeafletMapInnerProps {
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

interface GoogleMapProps {
  center: { lat: number; lng: number }
  markers?: Array<{
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
  zoom?: number
  className?: string
}

let activeMap: LeafletMap | null = null

const LeafletMapInner = dynamic<LeafletMapInnerProps>(
  () => import('@/components/leaflet-map-inner').then((module) => module.LeafletMapInner),
  {
    ssr: false,
  }
)

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    queueMicrotask(() => setIsLoaded(true))
  }, [])

  return isLoaded
}

export function GoogleMap({
  center,
  markers = [],
  onMapClick,
  zoom = 15,
  className = '',
}: Readonly<GoogleMapProps>) {
  return (
    <LeafletMapInner
      center={center}
      markers={markers}
      onMapClick={onMapClick}
      zoom={zoom}
      className={className}
      onMapReady={(map) => {
        activeMap = map
      }}
      onMapDispose={(map) => {
        if (activeMap === map) {
          activeMap = null
        }
      }}
    />
  )
}

export function panToLocation(lat: number, lng: number, zoom?: number) {
  if (!activeMap) {
    return
  }

  const nextZoom = zoom ?? activeMap.getZoom()
  activeMap.setView([lat, lng], nextZoom, { animate: true })
}
