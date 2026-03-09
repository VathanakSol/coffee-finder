'use client'

import { useCallback } from 'react'
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

export function GoogleMap({
  center,
  markers = [],
  onMapClick,
  zoom = 15,
  className = '',
}: Readonly<GoogleMapProps>) {
  const handleRecenter = useCallback(() => {
    if (activeMap) {
      activeMap.setView([center.lat, center.lng], zoom, { animate: true })
    }
  }, [center.lat, center.lng, zoom])

  return (
    <div
      className={`relative group overflow-hidden rounded-xl transition-all duration-300 ease-in-out ${className}`}
    >
      <LeafletMapInner
        center={center}
        markers={markers}
        onMapClick={onMapClick}
        zoom={zoom}
        className="w-full h-full z-0 outline-none"
        onMapReady={(map) => {
          activeMap = map
        }}
        onMapDispose={(map) => {
          if (activeMap === map) {
            activeMap = null
          }
        }}
      />

      {/* Map Status Indicator */}
      <div className="absolute top-4 right-4 z-[400] transition-all duration-500 ease-out transform pointer-events-none hidden sm:flex flex-col gap-2 items-end md:translate-y-[-8px] md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="bg-background/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-foreground/90 shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-border/50 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Live Tracker
        </div>
      </div>

      {/* Recenter Button */}
      <button
        onClick={handleRecenter}
        title="Recenter Map"
        className="absolute bottom-6 right-4 z-[400] flex items-center justify-center bg-background/95 backdrop-blur-md p-2.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-border/50 text-foreground/70 hover:text-primary hover:bg-background/100 hover:scale-105 active:scale-95 transition-all duration-300 transform outline-none focus-visible:ring-2 focus-visible:ring-primary md:translate-y-4 md:opacity-0 md:scale-95 group-hover:translate-y-0 group-hover:opacity-100 group-hover:scale-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="2" x2="5" y1="12" y2="12" />
          <line x1="19" x2="22" y1="12" y2="12" />
          <line x1="12" x2="12" y1="2" y2="5" />
          <line x1="12" x2="12" y1="19" y2="22" />
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      {/* Subtle Inner Glow/Shadow for Depth */}
      <div className="pointer-events-none absolute inset-0 z-[400] shadow-[inset_0_0_20px_rgba(0,0,0,0.04)] rounded-[inherit]" />
    </div>
  )
}

export function panToLocation(lat: number, lng: number, zoom?: number) {
  if (!activeMap) {
    return
  }

  const nextZoom = zoom ?? activeMap.getZoom()
  activeMap.setView([lat, lng], nextZoom, { animate: true })
}
